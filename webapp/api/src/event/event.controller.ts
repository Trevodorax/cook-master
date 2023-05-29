import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto, unparsedCreateEventDto } from './dto';

@Controller('events')
export class EventController {
  constructor(private eventService: EventService) {}

  // TODO: secure this route
  @Get()
  getAllEvents() {
    return this.eventService.getAllEvents();
  }

  // TODO: secure this route
  @Post()
  createEvent(@Body() data: unparsedCreateEventDto) {
    const parsedDto: CreateEventDto = {
      ...data,
      startTime: new Date(data.startTime),
    };

    return this.eventService.createEvent(parsedDto);
  }

  // TODO: secure this route
  @Get(':id')
  getEventById(@Param('id') id: string) {
    return this.eventService.getEventById({ id: parseInt(id) });
  }
}
