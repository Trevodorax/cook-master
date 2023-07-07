import { Injectable } from '@nestjs/common';

import { CreateAddressDto } from 'src/premise/dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) {}

  async createAddress(address: CreateAddressDto) {
    const newAddress = await this.prisma.address.create({
      data: {
        streetName: address.streetName,
        streetNumber: address.streetNumber,
        city: address.city,
        postalCode: address.postalCode,
        country: address.country,
      },
    });

    return newAddress;
  }
}
