import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [LessonController],
  providers: [LessonService, PrismaService],
})
export class LessonModule {}
