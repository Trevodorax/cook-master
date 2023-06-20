import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
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
    return this.clientService.getEventsByClientId(user.clientId.toString());
  }

  @UseGuards(JwtGuard)
  @Get('me/courses')
  getMyCourses(@GetUser() user: User) {
    return this.clientService.getCoursesByClientId(user.clientId.toString());
  }

  @UseGuards(JwtGuard)
  @Post('me/events')
  applyToEvent(@GetUser() user: User, @Body() dto: { eventId: number }) {
    return this.clientService.applyToEvent(user.clientId, dto.eventId);
  }

  @UseGuards(JwtGuard)
  @Delete('me/events')
  resignFromEvent(@GetUser() user: User, @Body() dto: { eventId: number }) {
    return this.clientService.resignFromEvent(user.clientId, dto.eventId);
  }

  @Get(':clientId/events')
  getEventsByClientId(@Param('clientId') clientId: string) {
    return this.clientService.getEventsByClientId(clientId);
  }

  @Get(':clientId/courses')
  getCoursesByClientId(@Param('clientId') clientId: string) {
    return this.clientService.getCoursesByClientId(clientId);
  }

  @Get(':id/user')
  async getUserForContractor(@Param('id') id: string) {
    const idNumber = parseInt(id);
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid client ID.');
    }

    return this.clientService.getUserForClient(idNumber);
  }
}
