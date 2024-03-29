import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AddressService } from 'src/address/address.service';
import { CreateAddressDto } from 'src/premise/dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClientService {
  constructor(
    private prisma: PrismaService,
    private addressService: AddressService,
  ) {}

  async getClientById(clientId: string) {
    const client = await this.prisma.client.findUnique({
      where: { id: Number(clientId) },
      include: { user: true, Address: true },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  async updateClientAddress(clientId: number, address: CreateAddressDto) {
    const existingClient = await this.prisma.client.findUnique({
      where: { id: clientId },
      include: {
        Address: true,
      },
    });

    if (!existingClient) {
      throw new NotFoundException(`Client with id ${clientId} not found`);
    }

    if (existingClient.Address) {
      // remove the address if it exists
      await this.prisma.address.delete({
        where: {
          id: existingClient.Address.id,
        },
      });
    }

    // create the new address
    const newAddress = await this.addressService.createAddress(address);

    // create the relationship between the client and the address
    const newAddressWithClient = await this.prisma.address.update({
      where: { id: newAddress.id },
      data: {
        client: {
          connect: {
            id: clientId,
          },
        },
      },
    });
    const updatedClient = await this.prisma.client.update({
      where: { id: clientId },
      data: {
        addressId: newAddressWithClient.id,
      },
    });

    return updatedClient;
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

  async getUserForClient(clientId: number) {
    const userForClient = this.prisma.client.findUnique({
      where: {
        id: clientId,
      },
      select: {
        user: true,
      },
    });

    if (!userForClient) {
      throw new NotFoundException('Client not found.');
    }

    return userForClient;
  }

  async applyToCourse(clientId: number, courseId: number) {
    if (!courseId) {
      throw new BadRequestException('Missing course id.');
    }

    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!client || !course) {
      throw new NotFoundException('Client or course not found');
    }

    await this.prisma.client.update({
      where: { id: clientId },
      data: {
        courses: {
          connect: { id: courseId },
        },
      },
    });

    const existingClientCourseProgress =
      await this.prisma.clientCourseProgress.findUnique({
        where: {
          clientId_courseId: {
            clientId: clientId,
            courseId: courseId,
          },
        },
      });

    if (!existingClientCourseProgress) {
      await this.prisma.clientCourseProgress.create({
        data: {
          client: {
            connect: { id: clientId },
          },
          course: {
            connect: { id: courseId },
          },
          progression: 1,
        },
      });
    }
  }

  async resignFromCourse(clientId: number, courseId: number) {
    if (!courseId) {
      throw new BadRequestException('Missing course id.');
    }

    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!client || !course) {
      throw new NotFoundException('Client or course not found');
    }

    // Remove course from client's courses
    await this.prisma.client.update({
      where: { id: clientId },
      data: {
        courses: {
          disconnect: { id: courseId },
        },
      },
    });
  }

  async getClientProgressInCourse(
    clientId: number,
    courseId: string,
  ): Promise<number> {
    const courseIdNumber = parseInt(courseId);
    if (isNaN(courseIdNumber)) {
      throw new BadRequestException(`Incorrect course id: ${courseId}`);
    }

    // Find the ClientCourseProgress with the provided clientId and courseId
    const progress = await this.prisma.clientCourseProgress.findUnique({
      where: {
        clientId_courseId: {
          clientId: clientId,
          courseId: courseIdNumber,
        },
      },
    });

    if (!progress) {
      return 0;
    }

    return progress.progression;
  }
}
