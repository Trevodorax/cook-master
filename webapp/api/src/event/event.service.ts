import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import { CreateEventDto, GetAllEventsDto, GetEventByIdDto } from './dto';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async getAllEvents({ filters }: GetAllEventsDto) {
    let where = {};

    if (filters.day) {
      const date = new Date(filters.day);
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);

      where = {
        ...where,
        AND: [
          {
            startTime: {
              gte: date,
            },
          },
          {
            startTime: {
              lt: nextDate,
            },
          },
        ],
      };
    }

    // Add conditions based on search filters here

    const events = await this.prisma.event.findMany({
      where,
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
