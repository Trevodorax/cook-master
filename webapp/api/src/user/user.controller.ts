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
import { AllowedUserTypes, GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers(
    @Query('search') search: string,
    @Query('userType') userType: string,
  ) {
    if (search || userType) {
      return this.userService.searchUsers(search, userType);
    } else {
      return this.userService.getAllUsers();
    }
  }

  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@GetUser() user: User) {
    return this.userService.getMe(user);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @AllowedUserTypes(['admin'])
  @Patch('confirmAdmin')
  async confirmAdmin(@Body() data: { id: string }) {
    return await this.userService.confirmAdmin(data.id);
  }

  @UseGuards(JwtGuard)
  @Get('me/conversations')
  getMyConversations(@GetUser() user: User) {
    return this.userService.getUserConversations(user.id);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @AllowedUserTypes(['admin'])
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return await this.userService.getUserById(id);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @AllowedUserTypes(['admin'])
  @Delete(':id')
  async deleteUserById(@Param('id') id: string) {
    return await this.userService.deleteUserById(id);
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  async patchMe(@GetUser() user: User, @Body() data: Partial<User>) {
    return await this.userService.patchUser(user.id.toString(), data);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @AllowedUserTypes(['admin'])
  @Patch(':id')
  async patchUser(@Param('id') id: string, @Body() data: Partial<User>) {
    return await this.userService.patchUser(id, data);
  }
}
