import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import {
  CreateEventDto,
  GetAllEventsDto,
  GetEventByIdDto,
  PatchEventDto,
} from './dto';
import { AddUserToEventDto } from './dto/addUserToEvent.dto';

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
        clients: true,
      },
    });

    return events;
  }

  async getEventById(dto: GetEventByIdDto) {
    const foundEvent = await this.prisma.event.findUnique({
      where: { id: dto.id },
      include: {
        animator: true,
        clients: true,
      },
    });

    if (!foundEvent) {
      throw new NotFoundException('Event not found');
    }

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
      include: {
        animator: true,
      },
    });

    return newEvent;
  }

  async patchEvent(id: number, dto: PatchEventDto) {
    /* ===== CHECKS ===== */
    // make sure the animator exists if it is specified
    if (dto.animator) {
      const contractor = await this.prisma.contractor.findUnique({
        where: { id: dto.animator },
      });

      if (!contractor) {
        throw new NotFoundException(
          `Contractor with ID ${dto.animator} not found`,
        );
      }
    }

    // make sure the date is valid if it is specified
    if (dto.startTime) {
      const date = new Date(dto.startTime);

      if (!date) {
        throw new BadRequestException('Wrong date format');
      }
    }

    // make sure the modified event exists
    const foundEvent = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!foundEvent) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    /* ===== UPDATE ===== */
    const modifiedEventData = {
      ...dto,
      animator: dto.animator ? { connect: { id: dto.animator } } : undefined,
      startTime: dto.startTime ? new Date(dto.startTime) : undefined,
    };

    const updatedEvent = await this.prisma.event.update({
      where: { id },
      data: modifiedEventData,
    });

    return updatedEvent;
  }

  async addUserToEvent(id: number, dto: AddUserToEventDto) {
    const user = await this.prisma.client.findUnique({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${dto.userId} not found`);
    }

    const event = await this.prisma.event.update({
      where: { id },
      data: {
        clients: {
          connect: { id: dto.userId },
        },
      },
      include: {
        clients: true,
      },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }
}
