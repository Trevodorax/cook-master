import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { createDefaultUser } from './utils/createDefaultUser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.setGlobalPrefix('api');
  createDefaultUser();

  await app.listen(3333);
}
bootstrap();
