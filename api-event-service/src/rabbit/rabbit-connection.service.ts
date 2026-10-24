import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitConnectionService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitConnectionService.name);

  private connection?: Awaited<ReturnType<typeof amqp.connect>>;
  private publisher?: amqp.ConfirmChannel;
  private readonly channels: amqp.Channel[] = [];

  constructor(private readonly config: ConfigService) {}

  async onModuleInit(): Promise<void> {
    this.connection = await amqp.connect(this.config.getOrThrow<string>('RABBITMQ_URL'));

    this.connection.on('error', (e) => this.logger.error(`Connection error: ${e.message}`));
    this.connection.on('close', () => this.logger.warn('RabbitMQ connection closed'));

    this.publisher = await this.connection.createConfirmChannel();

    this.logger.log('RabbitMQ connected');
  }

  getPublisherChannel(): amqp.ConfirmChannel {
    if (!this.publisher) throw new Error('RabbitMQ publisher channel is not ready');
    return this.publisher;
  }

  async createConsumerChannel(): Promise<amqp.Channel> {
    if (!this.connection) throw new Error('RabbitMQ connection is not ready');
    const channel = await this.connection.createChannel();
    this.channels.push(channel);
    return channel;
  }

  async onModuleDestroy(): Promise<void> {
    for (const ch of this.channels) await ch.close().catch(() => undefined);
    await this.publisher?.close().catch(() => undefined);
    await this.connection?.close().catch(() => undefined);
  }
}