import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

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

        return {
          uri: `mongodb://${encodeURIComponent(username!)}:${encodeURIComponent(password!)}@${host}:${port}/${database}?authSource=admin`,
        };
      },
    }),
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: '8rlYVU5lkLOiFxgl',
      appSecret: 'ngu78j8c^Tz%P8B7m2m3BRIpijCs4iFZi!BJ%LdKip&uL',
      serviceId: 'apihotelservice',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
