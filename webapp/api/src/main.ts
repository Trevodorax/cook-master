import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { PeerServer } from 'peer';

import { AppModule } from './app.module';
import { createDefaultUser } from './utils/createDefaultUser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    rawBody: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.setGlobalPrefix('api');
  createDefaultUser();

  const peerServer = PeerServer({
    port: 9000,
    path: '/trevodorax',
    proxied: true,
  });

  await app.listen(3333);
}
bootstrap();
