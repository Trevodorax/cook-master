import { Injectable, NotFoundException } from '@nestjs/common';
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
}
