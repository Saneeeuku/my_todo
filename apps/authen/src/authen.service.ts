import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthenService {
  getHello(): string {
    return 'Hello World!';
  }
}
