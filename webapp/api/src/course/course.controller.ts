import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';

import { CourseService } from './course.service';
import {
  CreateCourseDto,
  PatchCourseDto,
  GetCourseDto,
  GetAllCoursesDto,
} from './dto';
import { SearchCourseDto } from './dto/searchCourse.dto';
import { CreateEventDto, unparsedCreateEventDto } from 'src/event/dto';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';

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

  @Post(':courseId/workshops')
  addWorkshop(
    @Param('courseId') courseId: string,
    @Body() workshop: unparsedCreateEventDto,
  ) {
    const parsedCreateEventDto: CreateEventDto = {
      ...workshop,
      durationMin: workshop.durationMin,
      startTime: new Date(workshop.startTime),
      animator: workshop.animator ? workshop.animator : undefined,
    };

    return this.courseService.addWorkshop(courseId, parsedCreateEventDto);
  }

  // returns the id of next course if authorized, else returns -1
  @UseGuards(JwtGuard)
  @Get(':courseId/requestNextCourseAccess')
  requestNextCourseAccess(
    @GetUser() user: User,
    @Param('courseId') courseId: string,
  ) {
    if (!user.clientId) {
      throw new ForbiddenException(
        'You must be a client to perform this operation',
      );
    }

    return this.courseService.requestNextCourseAccess(user.clientId, courseId);
  }

  @Get(':courseId/workshops')
  getWorkshopsFromCourse(@Param('courseId') courseId: string) {
    return this.courseService.getWorkshopsFromCourse(courseId);
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
