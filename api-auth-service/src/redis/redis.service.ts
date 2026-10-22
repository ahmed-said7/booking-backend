import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client = new Redis({
    host: process.env.REDIS_HOST ?? 'redis',
    port: Number(process.env.REDIS_PORT ?? 6379),
  });

//   async onModuleInit() {
//     await this.client.connect();
//   }

  async onModuleDestroy() {
    await this.client.quit();
  }

  set(key: string, value: string, ttl = 60) {
    return this.client.set(key, value, 'EX', ttl);
  }

  get(key: string) {
    return this.client.get(key);
  }

  del(key: string) {
    return this.client.del(key);
  }
}