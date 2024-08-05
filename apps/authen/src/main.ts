import { NestFactory } from '@nestjs/core';
import { AuthenModule } from './authen.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthenModule);
  await app.listen(3000);
}
bootstrap();
