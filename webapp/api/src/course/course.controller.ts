import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto, PatchCourseDto, GetCourseDto } from './dto';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  getAllCourses() {
    return this.courseService.getAllCourses();
  }

  @Post()
  createCourse(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.createCourse(createCourseDto);
  }

  @Get(':courseId')
  getCourseById(@Param() dto: GetCourseDto) {
    return this.courseService.getCourseById(dto);
  }

  @Patch(':courseId')
  patchCourse(
    @Param() dto: GetCourseDto,
    @Body() patchCourseDto: PatchCourseDto,
  ) {
    return this.courseService.patchCourse(dto, patchCourseDto);
  }

  @Get(':courseId/lessons')
  getLessonsOfCourse(@Param() dto: GetCourseDto) {
    return this.courseService.getLessonsOfCourse(dto);
  }

  @Get(':courseId/clients')
  getClientsOfCourse(@Param() dto: GetCourseDto) {
    return this.courseService.getClientsOfCourse(dto);
  }

  @Delete(':courseId')
  deleteCourse(@Param() dto: GetCourseDto) {
    return this.courseService.deleteCourse(dto);
  }
}
