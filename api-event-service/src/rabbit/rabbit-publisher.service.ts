import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { RabbitConnectionService } from './rabbit-connection.service.js';
import { EventDefinition, MessageEnvelope, MessagePublisher } from './rabbit-types.js';

@Injectable()
export class RabbitPublisher implements MessagePublisher {
  private readonly logger = new Logger(RabbitPublisher.name);
  private readonly assertedExchanges = new Set<string>();

  constructor(private readonly connection: RabbitConnectionService) {}

  async publish<T>(def: EventDefinition, payload: T): Promise<void> {
    const channel = this.connection.getPublisherChannel();

    if (!this.assertedExchanges.has(def.exchange)) {
      await channel.assertExchange(def.exchange, def.exchangeType, { durable: true });
      this.assertedExchanges.add(def.exchange);
    }

    const envelope: MessageEnvelope<T> = {
      id: randomUUID(),
      type: def.routingKey,
      occurredAt: new Date().toISOString(),
      payload,
    };

    await new Promise<void>((resolve, reject) => {
      channel.publish(
        def.exchange,
        def.exchangeType === 'fanout' ? '' : def.routingKey,
        Buffer.from(JSON.stringify(envelope)),
        { persistent: true, messageId: envelope.id },
        (error) => (error ? reject(error) : resolve()),
      );
    });

    this.logger.log(`Published ${def.routingKey}`);
  }
}