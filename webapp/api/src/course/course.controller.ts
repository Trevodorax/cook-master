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
import { AllowedUserTypes, GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @UseGuards(JwtGuard)
  @Get()
  getAllCourses(@Query() filters: GetAllCoursesDto['filters']) {
    return this.courseService.getAllCourses({ filters });
  }

  @UseGuards(JwtGuard, RolesGuard)
  @AllowedUserTypes(['contractor', 'admin'])
  @Post()
  createCourse(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.createCourse(createCourseDto);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Get('search')
  searchLessons(@Query() searchDto: SearchCourseDto) {
    return this.courseService.searchCourses(searchDto);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @UseGuards(JwtGuard)
  @Post(':courseId/workshops')
  addWorkshop(
    @GetUser() user: User,
    @Param('courseId') courseId: string,
    @Body() workshop: unparsedCreateEventDto,
  ) {
    const parsedCreateEventDto: CreateEventDto = {
      ...workshop,
      durationMin: workshop.durationMin,
      startTime: new Date(workshop.startTime),
      animator: workshop.animator
        ? workshop.animator
        : user.contractorId
        ? user.contractorId
        : undefined,
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

  @UseGuards(JwtGuard)
  @Get(':courseId/workshops')
  getWorkshopsFromCourse(@Param('courseId') courseId: string) {
    return this.courseService.getWorkshopsFromCourse(courseId);
  }

  @UseGuards(JwtGuard)
  @Get(':courseId')
  getCourseById(@Param() dto: GetCourseDto) {
    return this.courseService.getCourseById(dto);
  }

  @UseGuards(JwtGuard)
  @Patch(':courseId')
  patchCourse(
    @Param() dto: GetCourseDto,
    @Body() patchCourseDto: PatchCourseDto,
  ) {
    return this.courseService.patchCourse(dto, patchCourseDto);
  }

  @UseGuards(JwtGuard)
  @Get(':courseId/lessons')
  getLessonsOfCourse(@Param() dto: GetCourseDto) {
    return this.courseService.getLessonsOfCourse(dto);
  }

  @UseGuards(JwtGuard)
  @Get(':courseId/lessons/:lessonIndex')
  getLessonOfCourseAtIndex(
    @GetUser() user: User,
    @Param()
    { courseId, lessonIndex }: { courseId: string; lessonIndex: string },
  ) {
    return this.courseService.getLessonOfCourseAtIndex(
      user,
      courseId,
      lessonIndex,
    );
  }

  @UseGuards(JwtGuard)
  @Get(':courseId/clients')
  getClientsOfCourse(@Param() dto: GetCourseDto) {
    return this.courseService.getClientsOfCourse(dto);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @AllowedUserTypes(['contractor', 'admin'])
  @Delete(':courseId')
  deleteCourse(@Param() dto: GetCourseDto) {
    return this.courseService.deleteCourse(dto);
  }
}
