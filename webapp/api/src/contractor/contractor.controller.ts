import { Controller, Get, Param } from '@nestjs/common';

import { ContractorService } from './contractor.service';

import { GetEventsByContractorIdDto } from './dto';

@Controller('contractors')
export class ContractorController {
  constructor(private eventService: ContractorService) {}

  // TODO: secure this route
  @Get(':id/events')
  async getEventsByContractorId(@Param('id') id: string) {
    const formattedDto: GetEventsByContractorIdDto = {
      contractorId: parseInt(id),
    };
    return this.eventService.getEventsByContractorId(formattedDto);
  }
}
