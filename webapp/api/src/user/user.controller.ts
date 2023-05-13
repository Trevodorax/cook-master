import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { PaulJwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';
import { JwtUser } from 'src/auth/strategy';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(PaulJwtGuard)
  @Get()
  getAllUsers(@GetUser() user: JwtUser) {
    return this.userService.getAllUsers(user);
  }

  @UseGuards(PaulJwtGuard)
  @Get('me')
  getMe(@GetUser() user: JwtUser) {
    return this.userService.getMe(user);
  }
}
