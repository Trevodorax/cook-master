import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PremiseService } from './premise.service';
import { CreateAddressDto } from './dto';
import { AllowedUserTypes } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@Controller('premises')
export class PremiseController {
  constructor(private readonly premiseService: PremiseService) {}
  @UseGuards(JwtGuard, RolesGuard)
  @AllowedUserTypes(['admin'])
  @Post()
  createPremise(@Body() data: CreateAddressDto) {
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

  @UseGuards(JwtGuard, RolesGuard)
  @AllowedUserTypes(['admin'])
  @Post(':premiseId/rooms')
  createRoomInPremise(
    @Param('premiseId') premiseId: string,
    @Body() data: { capacity: number },
  ) {
    return this.premiseService.createRoomInPremise(premiseId, data.capacity);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @AllowedUserTypes(['admin'])
  @Delete(':premiseId')
  deletePremiseById(@Param('premiseId') premiseId: string) {
    return this.premiseService.deletePremiseById(premiseId);
  }
}
