import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import { CreateEventDto, GetEventByIdDto } from './dto';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async getAllEvents() {
    const events = await this.prisma.event.findMany({
      include: {
        animator: true,
      },
    });

    return events;
  }

  async getEventById(dto: GetEventByIdDto) {
    const foundEvent = await this.prisma.event.findUnique({
      where: { id: dto.id },
      include: {
        animator: true,
      },
    });

    return foundEvent;
  }

  async createEvent(dto: CreateEventDto) {
    const newEvent = await this.prisma.event.create({
      data: {
        type: dto.type,
        name: dto.name,
        description: dto.description,
        startTime: dto.startTime,
        durationMin: dto.durationMin,
        contractorId: dto.animator ?? undefined,
      },
    });

    return newEvent;
  }
}
