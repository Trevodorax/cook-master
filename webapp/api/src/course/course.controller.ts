import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';

import { CourseService } from './course.service';
import {
  CreateCourseDto,
  PatchCourseDto,
  GetCourseDto,
  GetAllCoursesDto,
} from './dto';
import { SearchCourseDto } from './dto/searchCourse.dto';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  getAllCourses(@Query() filters: GetAllCoursesDto['filters']) {
    return this.courseService.getAllCourses({ filters });
  }

  @Post()
  createCourse(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.createCourse(createCourseDto);
  }

  @Get('search')
  searchLessons(@Query() searchDto: SearchCourseDto) {
    return this.courseService.searchCourses(searchDto);
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
