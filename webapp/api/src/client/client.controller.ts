import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ClientService } from './client.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';

@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get(':clientId')
  getClientById(@Param('clientId') clientId: string) {
    return this.clientService.getClientById(clientId);
  }

  @UseGuards(JwtGuard)
  @Get('me/events')
  getMyEvents(@GetUser() user: User) {
    console.log('user is: ', user);

    return this.clientService.getEventsByClientId(user.clientId.toString());
  }

  @UseGuards(JwtGuard)
  @Get('me/courses')
  getMyCourses(@GetUser() user: User) {
    return this.clientService.getCoursesByClientId(user.clientId.toString());
  }

  @Get(':clientId/events')
  getEventsByClientId(@Param('clientId') clientId: string) {
    return this.clientService.getEventsByClientId(clientId);
  }

  @Get(':clientId/courses')
  getCoursesByClientId(@Param('clientId') clientId: string) {
    return this.clientService.getCoursesByClientId(clientId);
  }
}
