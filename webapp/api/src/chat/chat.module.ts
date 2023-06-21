import { Module } from '@nestjs/common';

import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  imports: [JwtModule],
})
export class ChatModule {}
