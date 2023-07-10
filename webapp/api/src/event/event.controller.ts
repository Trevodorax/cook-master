import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EventService } from './event.service';
import {
  CreateEventDto,
  GetAllEventsDto,
  PatchEventDto,
  unparsedCreateEventDto,
} from './dto';
import { JwtGuard } from 'src/auth/guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { AllowedUserTypes } from 'src/auth/decorator';

@Controller('events')
export class EventController {
  constructor(private eventService: EventService) {}

  @UseGuards(JwtGuard)
  @Get()
  getAllEvents(@Query() filters: GetAllEventsDto['filters']) {
    return this.eventService.getAllEvents({ filters });
  }

  @UseGuards(JwtGuard, RolesGuard)
  @AllowedUserTypes(['admin', 'contractor'])
  @Post()
  createEvent(@Body() data: unparsedCreateEventDto) {
    const parsedDto: CreateEventDto = {
      ...data,
      durationMin: parseInt(data.durationMin),
      startTime: new Date(data.startTime),
      animator: data.animator ? parseInt(data.animator) : undefined,
    };

    return this.eventService.createEvent(parsedDto);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  getEventById(@Param('id') id: string) {
    return this.eventService.getEventById({ id: parseInt(id) });
  }

  @UseGuards(JwtGuard, RolesGuard)
  @AllowedUserTypes(['admin', 'contractor'])
  @Patch(':id')
  patchEvent(@Param('id') id: string, @Body() data: PatchEventDto) {
    return this.eventService.patchEvent(parseInt(id), data);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @AllowedUserTypes(['admin', 'contractor'])
  @Delete(':id')
  deleteEvent(@Param('id') id: string) {
    return this.eventService.deleteEvent(id);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @AllowedUserTypes(['admin', 'contractor'])
  @Post(':eventId/clients')
  addUserToEvent(
    @Param('eventId') eventId: string,
    @Body() data: { clientId: number },
  ) {
    return this.eventService.addUserToEvent(eventId, data.clientId);
  }

  @UseGuards(JwtGuard)
  @Get(':eventId/clients')
  getClientsFromEvent(@Param('eventId') eventId: string) {
    return this.eventService.getClientsFromEvent(eventId);
  }
}
