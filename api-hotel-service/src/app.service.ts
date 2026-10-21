import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'API HOTEL SERVICE V1.0.0';
  }
}
