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

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService, private events: EventService) {}

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
      include: { lessons: true },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course.lessons;
  }

  async getClientsOfCourse(dto: GetCourseDto) {
    const idNumber = parseInt(dto.courseId);

    if (isNaN(idNumber)) {
      throw new BadRequestException('id must be an integer');
    }

    const course = await this.prisma.course.findUnique({
      where: { id: idNumber },
      include: { clients: true },
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

    const foundCourse = await this.prisma.course.findUnique({
      where: { id: courseIdNumber },
    });

    if (!foundCourse) {
      throw new NotFoundException(`Could not find course with id ${courseId}`);
    }

    const updatedCourse = await this.prisma.course.update({
      where: { id: courseIdNumber },
      data: {
        workshops: {
          connect: { id: createdWorkshop.id },
        },
      },
    });

    return updatedCourse;
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
