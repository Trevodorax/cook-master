import {
  BadRequestException,
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';

import { User } from '@prisma/client';
import { JwtGuard } from 'src/auth/guard';
import { AllowedUserTypes, GetUser } from 'src/auth/decorator';

import { ContractorService } from './contractor.service';
import { GetContractorDto } from './dto';

@Controller('contractors')
export class ContractorController {
  constructor(private contractorService: ContractorService) {}

  @UseGuards(JwtGuard)
  @Get('me/events')
  async getEventsForMe(@GetUser() user: User) {
    return this.contractorService.getEventsForMe(user);
  }

  @UseGuards(JwtGuard)
  @Get('me/courses')
  async getCoursesForMe(@GetUser() user: User) {
    return this.contractorService.getCoursesForMe(user);
  }

  @UseGuards(JwtGuard)
  @AllowedUserTypes(['admin'])
  @Get(':id/events')
  async getEventsByContractorId(@Param('id') id: string) {
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      throw new BadRequestException('Invalid contractor ID.');
    }

    const formattedDto: GetContractorDto = {
      contractorId: parseInt(id),
    };
    return this.contractorService.getEventsByContractorId(formattedDto);
  }

  @UseGuards(JwtGuard)
  @Get(':id/user')
  async getUserForContractor(@Param('id') id: string) {
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      throw new BadRequestException('Invalid contractor ID.');
    }

    const formattedDto: GetContractorDto = {
      contractorId: parseInt(id),
    };

    return this.contractorService.getUserForContractor(formattedDto);
  }
}
