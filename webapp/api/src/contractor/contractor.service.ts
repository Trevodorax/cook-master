import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import { GetEventsByContractorIdDto } from './dto';

@Injectable()
export class ContractorService {
  constructor(private prisma: PrismaService) {}

  async getEventsByContractorId(dto: GetEventsByContractorIdDto) {
    return this.prisma.event.findMany({
      where: {
        contractorId: dto.contractorId,
      },
    });
  }
}
