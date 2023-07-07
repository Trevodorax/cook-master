import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventService } from 'src/event/event.service';
import { LessonService } from 'src/lesson/lesson.service';
import { RoomService } from 'src/room/room.service';

@Module({
  controllers: [CourseController],
  providers: [
    CourseService,
    PrismaService,
    EventService,
    LessonService,
    RoomService,
  ],
})
export class CourseModule {}
