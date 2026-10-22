import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from './redis/redis.module.js';
import { UsersModule } from './user/user.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const username = config.get<string>('MONGO_ROOT_USERNAME');
        const password = config.get<string>('MONGO_ROOT_PASSWORD');
        const host = config.get<string>('MONGO_HOST');
        const port = config.get<string>('MONGO_PORT');
        const database = config.get<string>('MONGO_DATABASE');

        console.log('MongoDB connection string:', `mongodb://${encodeURIComponent(username!)}:${encodeURIComponent(password!)}@${host}:${port}/${database}?authSource=admin`);
        return {
          uri: `mongodb://${encodeURIComponent(username!)}:${encodeURIComponent(password!)}@${host}:${port}/${database}?authSource=admin`,
        };
      },
    }),

    RedisModule,

    UsersModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
