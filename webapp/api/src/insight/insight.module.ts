import { Module } from '@nestjs/common';
import { InsightService } from './insight.service';
import { InsightController } from './insight.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [InsightController],
  providers: [InsightService, PrismaService],
})
export class InsightModule {}
