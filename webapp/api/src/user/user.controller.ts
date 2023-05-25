import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { PaulJwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';
import { User } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(PaulJwtGuard)
  @Get()
  async getAllUsers(
    @GetUser() user: User,
    @Query('search') search: string,
    @Query('userType') userType: string,
  ) {
    if (search || userType) {
      return this.userService.searchUsers(user, search, userType);
    } else {
      return this.userService.getAllUsers(user);
    }
  }

  @UseGuards(PaulJwtGuard)
  @Get('me')
  getMe(@GetUser() user: User) {
    return this.userService.getMe(user);
  }

  @UseGuards(PaulJwtGuard)
  @Get(':id')
  async getUserById(@GetUser() user: User, @Param('id') id: string) {
    return await this.userService.getUserById(user, id);
  }

  @UseGuards(PaulJwtGuard)
  @Delete(':id')
  async deleteUserById(@GetUser() user: User, @Param('id') id: string) {
    return await this.userService.deleteUserById(user, id);
  }

  @UseGuards(PaulJwtGuard)
  @Patch(':id')
  async patchUser(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() data: Partial<User>,
  ) {
    return await this.userService.patchUser(user, id, data);
  }
}
