import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
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

  @UseGuards(PaulJwtGuard)
  @Get(':id')
  async getUserById(@GetUser() user: JwtUser, @Param('id') id: string) {
    return await this.userService.getUserById(user, id);
  }

  @UseGuards(PaulJwtGuard)
  @Delete(':id')
  async deleteUserById(@GetUser() user: JwtUser, @Param('id') id: string) {
    return await this.userService.deleteUserById(user, id);
  }
}
