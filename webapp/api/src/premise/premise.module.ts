import { Module } from '@nestjs/common';
import { PremiseService } from './premise.service';
import { PremiseController } from './premise.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddressService } from 'src/address/address.service';

@Module({
  controllers: [PremiseController],
  providers: [PremiseService, PrismaService, AddressService],
})
export class PremiseModule {}
