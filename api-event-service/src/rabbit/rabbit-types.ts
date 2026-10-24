export interface EventDefinition {
  exchange: string;
  exchangeType: 'direct' | 'fanout' | 'topic';
  routingKey: string;
}

export interface ConsumerDefinition extends EventDefinition {
  queue: string;
  prefetch?: number;
}

export interface MessageEnvelope<T> {
  id: string;
  type: string;
  occurredAt: string;
  payload: T;
}

export type MessageHandler<T> = (envelope: MessageEnvelope<T>) => Promise<void>;

export abstract class MessagePublisher {
  abstract publish<T>(def: EventDefinition, payload: T): Promise<void>;
}

export abstract class MessageConsumer {
  abstract consume<T>(def: ConsumerDefinition, handler: MessageHandler<T>): Promise<void>;
}