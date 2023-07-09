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

  const fs = require('fs');

  let key: string;
  let cert: string;

  fs.readFile('/usr/src/app/certs/cookmaster.site.key', 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file from disk: ${err}`);
    } else {
      key = data;
    }
  });

  fs.readFile('/usr/src/app/certs/cookmaster.site.crt', 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file from disk: ${err}`);
    } else {
      cert = data;
    }
  });

  const peerServer = PeerServer({
    port: 9000,
    path: '/trevodorax',
    proxied: true,
    // ssl: {
    //   key,
    //   cert,
    // },
  });

  await app.listen(3333);
}
bootstrap();
