import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import { GetContractorDto } from './dto';
import { User } from '@prisma/client';

@Injectable()
export class ContractorService {
  constructor(private prisma: PrismaService) {}

  async getEventsByContractorId(dto: GetContractorDto) {
    return this.prisma.event.findMany({
      where: {
        contractorId: dto.contractorId,
      },
    });
  }

  async getEventsForMe(user: User) {
    if (!user) {
      throw new UnauthorizedException(
        'You must be logged in to access this route.',
      );
    }

    if (user.contractorId === null) {
      throw new UnauthorizedException(
        'You must be a contractor to access this route.',
      );
    }

    const formattedDto: GetContractorDto = {
      contractorId: user.contractorId,
    };

    return this.getEventsByContractorId(formattedDto);
  }

  async getCoursesByContractorId(dto: GetContractorDto) {
    return this.prisma.course.findMany({
      where: {
        contractorId: dto.contractorId,
      },
    });
  }

  async getCoursesForMe(user: User) {
    if (!user) {
      throw new UnauthorizedException(
        'You must be logged in to access this route.',
      );
    }

    if (user.contractorId === null) {
      throw new UnauthorizedException(
        'You must be a contractor to access this route.',
      );
    }

    const formattedDto: GetContractorDto = {
      contractorId: user.contractorId,
    };

    return this.getCoursesByContractorId(formattedDto);
  }

  async getUserForContractor(dto: GetContractorDto) {
    const userForContractor = this.prisma.contractor.findUnique({
      where: {
        id: dto.contractorId,
      },
      select: {
        user: true,
      },
    });

    if (!userForContractor) {
      throw new NotFoundException('Contractor not found.');
    }

    return userForContractor;
  }
}
