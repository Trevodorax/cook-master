import {
  BadRequestException,
  ForbiddenException,
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
import { User } from '@prisma/client';

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

    // Find the lesson with the highest index in this course
    const maxIndexLesson = await this.prisma.lesson.findFirst({
      where: { courseId: dto.courseId },
      orderBy: { index: 'desc' },
    });

    const newIndex = maxIndexLesson ? maxIndexLesson.index + 1 : 1;

    return this.prisma.lesson.create({
      data: {
        name: dto.name,
        description: dto.description,
        content: dto.content,
        index: newIndex,
        Course: {
          connect: {
            id: dto.courseId,
          },
        },
      },
    });
  }

  async getLessonById(user: User, dto: GetLessonDto) {
    const idNumber = parseInt(dto.lessonId);

    if (isNaN(idNumber)) {
      throw new BadRequestException('id must be an integer');
    }

    const lesson = await this.prisma.lesson.findUnique({
      where: { id: idNumber },
      include: {
        Course: {
          select: {
            contractorId: true,
            id: true, // include course id for later use
          },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    // check permission to access the lesson
    if (user.clientId) {
      // Fetch the client's progress in the course
      const progress = await this.prisma.clientCourseProgress.findUnique({
        where: {
          clientId_courseId: {
            clientId: user.clientId,
            courseId: lesson.Course.id,
          },
        },
      });

      // Throw a forbidden exception if there is no progress table found
      if (!progress) {
        throw new ForbiddenException('You are not enrolled in this course.');
      }

      // Compare the client's progression with the lesson's index
      if (progress.progression >= lesson.index) {
        return lesson;
      } else {
        return -1;
      }
    } else if (user.contractorId) {
      if (user.contractorId === lesson.Course.contractorId) {
        return lesson;
      }
    }

    throw new ForbiddenException('You cannot access this lesson');
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
