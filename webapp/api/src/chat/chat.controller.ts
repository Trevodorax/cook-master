import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';

import { ChatService } from './chat.service';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtGuard)
  @Get(':otherUserId')
  getMessages(
    @GetUser() user: User,
    @Param('otherUserId') otherUserId: number,
  ) {
    return this.chatService.getMessages(user.id, otherUserId);
  }
}
