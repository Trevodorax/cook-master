import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventService } from 'src/event/event.service';
import { LessonService } from 'src/lesson/lesson.service';

@Module({
  controllers: [CourseController],
  providers: [CourseService, PrismaService, EventService, LessonService],
})
export class CourseModule {}
