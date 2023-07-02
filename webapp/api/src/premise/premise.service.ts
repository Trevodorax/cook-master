import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePremiseDto } from './dto';

@Injectable()
export class PremiseService {
  constructor(private prisma: PrismaService) {}

  async createPremise(data: CreatePremiseDto) {
    const { streetName, streetNumber, city, postalCode, country } = data;

    // Creating new address using the input data
    const newAddress = await this.prisma.address.create({
      data: { streetName, streetNumber, city, postalCode, country },
    });

    // Creating new premise using the addressId from the newly created address
    const newPremise = await this.prisma.premise.create({
      data: {
        addressId: newAddress.id,
      },
    });

    return newPremise;
  }

  async getAllPremises() {
    return await this.prisma.premise.findMany({
      include: {
        address: true,
        rooms: true,
      },
    });
  }

  async getPremiseById(premiseId: string) {
    return await this.prisma.premise.findUnique({
      where: { id: Number(premiseId) },
      include: {
        address: true,
        rooms: true,
      },
    });
  }

  async getRoomsOfPremise(premiseId: string) {
    const premise = await this.getPremiseById(premiseId);
    if (!premise) {
      throw new NotFoundException(`No premise found with id ${premiseId}`);
    }

    return premise.rooms;
  }

  async createRoomInPremise(premiseId: string, capacity: number) {
    return await this.prisma.room.create({
      data: {
        premiseId: Number(premiseId),
        capacity,
      },
    });
  }

  async deletePremiseById(premiseId: string) {
    // delete premise will also cascade delete its related address and rooms
    return await this.prisma.premise.delete({
      where: { id: Number(premiseId) },
    });
  }
}
