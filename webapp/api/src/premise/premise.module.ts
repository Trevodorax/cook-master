import { Module } from '@nestjs/common';
import { PremiseService } from './premise.service';
import { PremiseController } from './premise.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PremiseController],
  providers: [PremiseService, PrismaService],
})
export class PremiseModule {}
