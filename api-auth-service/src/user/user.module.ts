
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from './user.schema.js';
import { UsersController } from './user.controller.js';
import { UsersService } from './user.service.js';
import { RedisModule } from '../redis/redis.module.js';

@Module({
  imports: [
    RedisModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
