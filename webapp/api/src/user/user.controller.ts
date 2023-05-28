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

  @UseGuards(JwtGuard, RolesGuard)
  @AllowedUserTypes(['admin', 'contractor'])
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

  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@GetUser() user: User) {
    return this.userService.getMe(user);
  }

  @UseGuards(JwtGuard)
  @Patch('confirmAdmin')
  async confirmAdmin(@GetUser() user: User, @Body() data: { id: string }) {
    return await this.userService.confirmAdmin(user, data.id);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getUserById(@GetUser() user: User, @Param('id') id: string) {
    return await this.userService.getUserById(user, id);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteUserById(@GetUser() user: User, @Param('id') id: string) {
    return await this.userService.deleteUserById(user, id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async patchUser(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() data: Partial<User>,
  ) {
    return await this.userService.patchUser(user, id, data);
  }
}
