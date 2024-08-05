import { Controller, Get } from '@nestjs/common';
import { AuthenService } from './authen.service';

@Controller()
export class AuthenController {
  constructor(private readonly authenService: AuthenService) {}

  @Get()
  getHello(): string {
    return this.authenService.getHello();
  }
}
