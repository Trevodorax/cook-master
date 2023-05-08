import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { PaulJwtGuard } from 'src/auth/guard';

@Controller('users')
export class UserController {
  @UseGuards(PaulJwtGuard)
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }
}
