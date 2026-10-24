import { Injectable } from "@nestjs/common";
import { BasePublisher } from "../../rabbit/base.js";
import { UserResponseDto } from "../dto/user_response.dto.js";
import { EventDefinition } from "../../rabbit/rabbit-types.js";
import { RabbitPublisher } from "../../rabbit/rabbit-publisher.service.js";

export const USER_CREATED = {
  exchange: 'users.exchange',
  exchangeType: 'topic',
  routingKey: 'user.created',
} as const satisfies EventDefinition;

@Injectable()
export class UserCreatedPublisher extends BasePublisher<UserResponseDto> {
  protected readonly definition = USER_CREATED;

  constructor(transport: RabbitPublisher) {
    super(transport);
  }
}