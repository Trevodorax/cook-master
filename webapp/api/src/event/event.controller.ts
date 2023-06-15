import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { EventService } from './event.service';
import {
  CreateEventDto,
  GetAllEventsDto,
  PatchEventDto,
  unparsedCreateEventDto,
} from './dto';
import { AddUserToEventDto } from './dto/addUserToEvent.dto';

@Controller('events')
export class EventController {
  constructor(private eventService: EventService) {}

  // TODO: secure this route
  @Get()
  getAllEvents(@Query() filters: GetAllEventsDto['filters']) {
    return this.eventService.getAllEvents({ filters });
  }

  // TODO: secure this route
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

  // TODO: secure this route
  @Get(':id')
  getEventById(@Param('id') id: string) {
    return this.eventService.getEventById({ id: parseInt(id) });
  }

  @Patch(':id')
  patchEvent(@Param('id') id: string, @Body() data: PatchEventDto) {
    return this.eventService.patchEvent(parseInt(id), data);
  }

  @Post(':id/users')
  addUserToEvent(@Param('id') id: string, @Body() data: AddUserToEventDto) {
    return this.eventService.addUserToEvent(parseInt(id), data);
  }
}
