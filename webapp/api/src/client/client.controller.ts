import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { ClientService } from './client.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { CreateAddressDto } from 'src/premise/dto';

@Controller('clients')
export class ClientController {
  constructor(private clientService: ClientService) {}

  @UseGuards(JwtGuard)
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
  @Put('me/address')
  updateMyAddress(@GetUser() user: User, @Body() address: CreateAddressDto) {
    return this.clientService.updateClientAddress(user.clientId, address);
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

  @UseGuards(JwtGuard)
  @Post('me/courses')
  applyToCourse(@GetUser() user: User, @Body() dto: { courseId: number }) {
    return this.clientService.applyToCourse(user.clientId, dto.courseId);
  }

  @UseGuards(JwtGuard)
  @Delete('me/courses')
  resignFromCourse(@GetUser() user: User, @Body() dto: { courseId: number }) {
    return this.clientService.resignFromCourse(user.clientId, dto.courseId);
  }

  @UseGuards(JwtGuard)
  @Get('me/courses/:courseId/progress')
  getMyProgressInCourse(
    @GetUser() user: User,
    @Param('courseId') courseId: string,
  ) {
    if (!user.clientId) {
      return 0;
    }

    return this.clientService.getClientProgressInCourse(
      user.clientId,
      courseId,
    );
  }

  @UseGuards(JwtGuard)
  @Get(':clientId/events')
  getEventsByClientId(@Param('clientId') clientId: string) {
    return this.clientService.getEventsByClientId(clientId);
  }

  @UseGuards(JwtGuard)
  @Get(':clientId/courses')
  getCoursesByClientId(@Param('clientId') clientId: string) {
    return this.clientService.getCoursesByClientId(clientId);
  }

  @UseGuards(JwtGuard)
  @Get(':id/user')
  async getUserForContractor(@Param('id') id: string) {
    const idNumber = parseInt(id);
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid client ID.');
    }

    return this.clientService.getUserForClient(idNumber);
  }
}
