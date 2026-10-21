import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'API AUTH SERVICE V1.0.0';
  }
}
