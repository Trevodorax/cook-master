import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import {
  CreateLessonDto,
  PatchLessonDto,
  GetLessonDto,
  SearchLessonDto,
} from './dto';

@Injectable()
export class LessonService {
  constructor(private prisma: PrismaService) {}

  async getAllLessons() {
    return this.prisma.lesson.findMany();
  }

  async createLesson(dto: CreateLessonDto) {
    const course = await this.prisma.course.findUnique({
      where: { id: dto.courseId },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${dto.courseId} not found`);
    }

    return this.prisma.lesson.create({ data: dto });
  }

  async getLessonById(dto: GetLessonDto) {
    const idNumber = parseInt(dto.lessonId);

    if (isNaN(idNumber)) {
      throw new BadRequestException('id must be an integer');
    }

    const lesson = await this.prisma.lesson.findUnique({
      where: { id: idNumber },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return lesson;
  }

  async patchLesson(dto: GetLessonDto, data: PatchLessonDto) {
    const idNumber = parseInt(dto.lessonId);

    if (isNaN(idNumber)) {
      throw new BadRequestException('id must be an integer');
    }

    const lesson = await this.prisma.lesson.findUnique({
      where: { id: idNumber },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return this.prisma.lesson.update({ where: { id: idNumber }, data });
  }

  async getCourseOfLesson(dto: GetLessonDto) {
    const idNumber = parseInt(dto.lessonId);

    if (isNaN(idNumber)) {
      throw new BadRequestException('id must be an integer');
    }

    const lesson = await this.prisma.lesson.findUnique({
      where: { id: idNumber },
      include: { Course: true },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return lesson.Course;
  }

  async deleteLesson(dto: GetLessonDto) {
    const idNumber = parseInt(dto.lessonId);

    if (isNaN(idNumber)) {
      throw new BadRequestException('id must be an integer');
    }

    const lesson = await this.prisma.lesson.findUnique({
      where: { id: idNumber },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return this.prisma.lesson.delete({ where: { id: idNumber } });
  }

  async searchLessons(searchDto: SearchLessonDto) {
    const { searchTerm } = searchDto;

    if (!searchTerm) {
      return this.prisma.lesson.findMany();
    }

    return this.prisma.lesson.findMany({
      where: {
        OR: [
          {
            name: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
  }
}
