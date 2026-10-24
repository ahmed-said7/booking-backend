import { Global, Module } from '@nestjs/common';
import { MessageConsumer, MessagePublisher } from './rabbit-types.js';
import { RabbitConnectionService } from './rabbit-connection.service.js';
import { RabbitConsumer } from './rabbit-consumer.service.js';
import { RabbitPublisher } from './rabbit-publisher.service.js';

@Global()
@Module({
  providers: [
    RabbitConnectionService,
    RabbitPublisher,
    RabbitConsumer,
  ],
  exports: [
    RabbitPublisher,
    RabbitConsumer
  ],
})
export class MessagingModule {}