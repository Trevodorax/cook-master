import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto, PatchCourseDto, GetCourseDto } from './dto';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async getAllCourses() {
    return this.prisma.course.findMany();
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
}
