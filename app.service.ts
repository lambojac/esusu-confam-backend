import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Esusu Confam API is running! Visit /api-docs for documentation.';
  }
}