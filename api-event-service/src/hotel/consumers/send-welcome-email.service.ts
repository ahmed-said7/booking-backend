import { Injectable } from "@nestjs/common";
import { BaseConsumer } from "../../rabbit/base.js";
import { EventDefinition } from "../../rabbit/rabbit-types.js";
import { RabbitConsumer } from "../../rabbit/rabbit-consumer.service.js";

export const USER_CREATED = {
  exchange: 'users.exchange',
  exchangeType: 'topic',
  routingKey: 'user.created',
} as const satisfies EventDefinition;

@Injectable()
export class SendWelcomeEmailConsumer extends BaseConsumer<any> {
  protected readonly definition = {
    ...USER_CREATED,
    queue: 'notifications.user-created',
  };

  constructor(transport: RabbitConsumer) {
    super(transport);
  }

  protected async handle(payload: any): Promise<void> {
    console.log(`Sending welcome email to user: ${JSON.stringify(payload)}`);
  }

  
}