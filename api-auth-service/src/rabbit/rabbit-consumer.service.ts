import { Injectable, Logger } from '@nestjs/common';
import { RabbitConnectionService } from './rabbit-connection.service.js';
import { ConsumerDefinition, MessageConsumer, MessageHandler } from './rabbit-types.js';

@Injectable()
export class RabbitConsumer implements MessageConsumer {
  private readonly logger = new Logger(RabbitConsumer.name);

  constructor(
    private readonly connection: RabbitConnectionService,
  ) {}

  async consume<T>(def: ConsumerDefinition, handler: MessageHandler<T>): Promise<void> {
    const channel = await this.connection.createConsumerChannel();

    await channel.assertExchange(def.exchange, def.exchangeType, { durable: true });
    await channel.assertQueue(def.queue, { durable: true });
    await channel.bindQueue(
      def.queue,
      def.exchange,
      def.exchangeType === 'fanout' ? '' : def.routingKey,
    );

    await channel.consume(def.queue, async (msg) => {
      if (!msg) return;
      try {
        await handler(JSON.parse(msg.content.toString()));
        channel.ack(msg);
      } catch (error) {
        this.logger.error(
          `Failed to process ${def.queue}`,
          error instanceof Error ? error.stack : String(error),
        );
        channel.nack(msg, false, false);
      }
    });

    this.logger.log(`Consuming ${def.queue}`);
  }
}