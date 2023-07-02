import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PremiseService } from './premise.service';
import { CreatePremiseDto } from './dto';

@Controller('premises')
export class PremiseController {
  constructor(private readonly premiseService: PremiseService) {}
  @Post()
  createPremise(@Body() data: CreatePremiseDto) {
    return this.premiseService.createPremise(data);
  }

  @Get()
  getAllPremises() {
    return this.premiseService.getAllPremises();
  }

  @Get(':premiseId')
  getPremiseById(@Param('premiseId') premiseId: string) {
    return this.premiseService.getPremiseById(premiseId);
  }

  @Get(':premiseId/rooms')
  getRoomsOfPremise(@Param('premiseId') premiseId: string) {
    return this.premiseService.getRoomsOfPremise(premiseId);
  }

  @Post(':premiseId/rooms')
  createRoomInPremise(
    @Param('premiseId') premiseId: string,
    @Body() data: { capacity: number },
  ) {
    return this.premiseService.createRoomInPremise(premiseId, data.capacity);
  }

  @Delete(':premiseId')
  deletePremiseById(@Param('premiseId') premiseId: string) {
    return this.premiseService.deletePremiseById(premiseId);
  }
}
