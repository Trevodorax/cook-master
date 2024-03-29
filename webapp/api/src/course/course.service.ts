import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto, PatchCourseDto, GetCourseDto } from './dto';
import { SearchCourseDto } from './dto/searchCourse.dto';
import { EventService } from 'src/event/event.service';
import { CreateEventDto } from 'src/event/dto';
import { User } from '@prisma/client';
import { LessonService } from 'src/lesson/lesson.service';

@Injectable()
export class CourseService {
  constructor(
    private prisma: PrismaService,
    private events: EventService,
    private lessonService: LessonService,
  ) {}

  async getAllCourses({ filters }) {
    let where = {};

    if (filters.term) {
      where = {
        ...where,
        OR: [
          {
            name: {
              contains: filters.term,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: filters.term,
              mode: 'insensitive',
            },
          },
        ],
      };
    }

    return this.prisma.course.findMany({ where });
  }

  async createCourse(dto: CreateCourseDto) {
    return this.prisma.course.create({ data: dto });
  }

  async getCourseById(dto: GetCourseDto) {
    const idNumber = parseInt(dto.courseId);

    if (isNaN(idNumber)) {
      throw new BadRequestException('id must be an integer');
    }

    const course = await this.prisma.course.findUnique({
      where: { id: idNumber },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async patchCourse(dto: GetCourseDto, data: PatchCourseDto) {
    const idNumber = parseInt(dto.courseId);

    if (isNaN(idNumber)) {
      throw new BadRequestException('id must be an integer');
    }

    const course = await this.prisma.course.findUnique({
      where: { id: idNumber },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return this.prisma.course.update({ where: { id: idNumber }, data });
  }

  async getLessonsOfCourse(dto: GetCourseDto) {
    const idNumber = parseInt(dto.courseId);

    if (isNaN(idNumber)) {
      throw new BadRequestException('id must be an integer');
    }

    const course = await this.prisma.course.findUnique({
      where: { id: idNumber },
      include: {
        lessons: {
          select: {
            id: true,
            name: true,
            description: true,
            index: true,
            courseId: true,
          },
          orderBy: {
            index: 'asc',
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course.lessons;
  }

  async getLessonOfCourseAtIndex(
    user: User,
    courseId: string,
    lessonIndex: string,
  ) {
    const courseIdNumber = parseInt(courseId);

    if (isNaN(courseIdNumber)) {
      throw new BadRequestException('course id must be an integer');
    }

    const lessonIndexNumber = parseInt(lessonIndex);

    if (isNaN(lessonIndexNumber)) {
      throw new BadRequestException('lesson index must be an integer');
    }

    // Fetch the lesson with the given index in the specified course
    const lesson = await this.prisma.lesson.findFirst({
      where: {
        courseId: courseIdNumber,
        index: lessonIndexNumber,
      },
      select: {
        id: true,
      },
    });

    if (!lesson) {
      return null;
    }

    return this.lessonService.getLessonById(user, {
      lessonId: lesson.id.toString(),
    });
  }

  async getClientsOfCourse(dto: GetCourseDto) {
    const idNumber = parseInt(dto.courseId);

    if (isNaN(idNumber)) {
      throw new BadRequestException('id must be an integer');
    }

    const course = await this.prisma.course.findUnique({
      where: { id: idNumber },
      include: {
        clients: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course.clients;
  }

  async deleteCourse(dto: GetCourseDto) {
    const idNumber = parseInt(dto.courseId);

    if (isNaN(idNumber)) {
      throw new BadRequestException('id must be an integer');
    }

    const course = await this.prisma.course.findUnique({
      where: { id: idNumber },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return this.prisma.course.delete({ where: { id: idNumber } });
  }

  async addWorkshop(courseId: string, workshop: CreateEventDto) {
    const courseIdNumber = parseInt(courseId);

    if (isNaN(courseIdNumber)) {
      throw new BadRequestException('Course id must be a number.');
    }

    const createdWorkshop = await this.events.createEvent(workshop);

    if (!createdWorkshop) {
      return null;
    }

    const foundCourse = await this.prisma.course.findUnique({
      where: { id: courseIdNumber },
    });

    if (!foundCourse) {
      throw new NotFoundException(`Could not find course with id ${courseId}`);
    }

    await this.prisma.course.update({
      where: { id: courseIdNumber },
      data: {
        workshops: {
          connect: { id: createdWorkshop.id },
        },
      },
    });

    return createdWorkshop;
  }

  // increases the index of the user for this course
  // returns the id of the newly available course or -1 if there is an error (course not exist ...)
  async requestNextCourseAccess(
    clientId: number,
    courseId: string,
  ): Promise<number> {
    const courseIdNumber = parseInt(courseId);
    if (isNaN(courseIdNumber)) {
      throw new BadRequestException(`Incorrect course id: ${courseId}`);
    }

    // Check the number of course requests made by the client today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const courseRequestsToday = await this.prisma.clientCourseRequest.count({
      where: {
        clientId: clientId,
        requestedAt: {
          gte: startOfDay,
        },
      },
    });

    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });

    const nbAllowedDailyRequestsPerSubscriptionType = { 0: 1, 1: 5, 2: 1000 };

    const nbAllowedDailyRequests =
      nbAllowedDailyRequestsPerSubscriptionType[client.subscriptionLevel];

    // If the client has already requested 5 new courses today, throw an exception
    if (courseRequestsToday >= nbAllowedDailyRequests) {
      throw new BadRequestException(
        'You have reached your daily limit for new course requests',
      );
    }

    // Record the new course request
    await this.prisma.clientCourseRequest.create({
      data: {
        clientId: clientId,
        courseId: courseIdNumber,
      },
    });

    // Start a transaction to ensure data consistency
    const transaction = await this.prisma.$transaction([
      this.prisma.course.findUnique({
        where: { id: courseIdNumber },
        select: { lessons: true },
      }),
      this.prisma.clientCourseProgress.findUnique({
        where: {
          clientId_courseId: {
            clientId: clientId,
            courseId: courseIdNumber,
          },
        },
      }),
    ]);

    const course = transaction[0];
    const progress = transaction[1];

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    if (!progress) {
      throw new NotFoundException(
        `No course progress found for client ${clientId} in course ${courseId}`,
      );
    }

    // Check if client has already completed all lessons in the course
    if (progress.progression >= course.lessons.length) {
      return -1;
    }

    // Increment the progression and save it to the database
    const newProgression = progress.progression + 1;
    await this.prisma.clientCourseProgress.update({
      where: {
        clientId_courseId: {
          clientId: clientId,
          courseId: courseIdNumber,
        },
      },
      data: {
        progression: newProgression,
      },
    });

    // Return the ID of the next lesson if it exists, -1 otherwise
    return course.lessons[newProgression - 1]?.id ?? -1;
  }

  async getWorkshopsFromCourse(courseId: string) {
    const courseIdNumber = parseInt(courseId);

    if (isNaN(courseIdNumber)) {
      throw new BadRequestException('Course id must be a number.');
    }

    const foundCourse = await this.prisma.course.findUnique({
      where: { id: courseIdNumber },
    });

    if (!foundCourse) {
      throw new NotFoundException(`Could not fiind course with id ${courseId}`);
    }

    const course = await this.prisma.course.findUnique({
      where: { id: courseIdNumber },
      select: { workshops: true },
    });

    return course.workshops;
  }

  async searchCourses(searchDto: SearchCourseDto) {
    const { searchTerm } = searchDto;

    if (!searchTerm) {
      return this.prisma.course.findMany();
    }

    return this.prisma.course.findMany({
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
