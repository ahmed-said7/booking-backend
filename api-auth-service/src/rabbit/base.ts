import { Inject, OnApplicationBootstrap } from '@nestjs/common';
import {
  ConsumerDefinition,
  EventDefinition,
} from './rabbit-types.js';
import { RabbitConsumer } from './rabbit-consumer.service.js';
import { RabbitPublisher } from './rabbit-publisher.service.js';

export abstract class BasePublisher<T> {
  protected abstract readonly definition: EventDefinition;

   constructor(private readonly transport: RabbitPublisher) {}

  publish(payload: T): Promise<void> {
    return this.transport.publish(this.definition, payload);
  }
}


export abstract class BaseConsumer<T> implements OnApplicationBootstrap {
  protected abstract readonly definition: ConsumerDefinition;

  protected abstract handle(payload: T): Promise<void>;

  // @Inject(MessageConsumer) private readonly transport!: MessageConsumer;
  constructor(private readonly transport: RabbitConsumer) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.transport.consume<T>(this.definition, (env) =>
      this.handle(env.payload),
    );
  }
}