import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger"
import {ValidationPipe} from "./pipes/validation.pipe";


async function start() {
  const PORT = process.env.PORT || 3000
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
      .setTitle('To-do app')
      .setDescription('My to-do application on NestJS with TypeORM')
      .setVersion('0.0.1')
      .build()
  const documentation = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/todo/doc', app, documentation)

  app.useGlobalPipes(new ValidationPipe())
  app.enableCors()

  try{
    await app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}...`))
  }catch (e) {
    console.log(`Error on starting server: ${e.message}`)
  }
}

start()