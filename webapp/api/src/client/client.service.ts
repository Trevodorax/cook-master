import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) {}

  async getClientById(clientId: string) {
    const client = await this.prisma.client.findUnique({
      where: { id: Number(clientId) },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  async getEventsByClientId(clientId: string) {
    const client = await this.getClientById(clientId);

    return this.prisma.event.findMany({
      where: { clients: { some: { id: client.id } } },
    });
  }

  async getCoursesByClientId(clientId: string) {
    const client = await this.getClientById(clientId);

    return this.prisma.course.findMany({
      where: { clients: { some: { id: client.id } } },
    });
  }

  async applyToEvent(clientId: number, eventId: number) {
    if (!eventId) {
      throw new BadRequestException('Missing event id.');
    }

    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });

    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!client || !event) {
      throw new NotFoundException('Client or event not found');
    }

    await this.prisma.client.update({
      where: { id: clientId },
      data: {
        events: {
          connect: { id: eventId },
        },
      },
    });
  }

  async resignFromEvent(clientId: number, eventId: number) {
    if (!eventId) {
      throw new BadRequestException('Missing event id.');
    }

    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });

    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!client || !event) {
      throw new NotFoundException('Client or event not found');
    }

    // Remove event from client's events
    await this.prisma.client.update({
      where: { id: clientId },
      data: {
        events: {
          disconnect: { id: eventId },
        },
      },
    });
  }
}
