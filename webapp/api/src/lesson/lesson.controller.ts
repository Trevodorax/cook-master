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
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import {
  CreateLessonDto,
  PatchLessonDto,
  GetLessonDto,
  SearchLessonDto,
} from './dto/';
import { JwtGuard } from 'src/auth/guard';
import { AllowedUserTypes, GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@Controller('lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @AllowedUserTypes(['admin'])
  @Get()
  getAllLessons() {
    return this.lessonService.getAllLessons();
  }

  @UseGuards(JwtGuard, RolesGuard)
  @AllowedUserTypes(['admin', 'contractor'])
  @Post()
  createLesson(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonService.createLesson(createLessonDto);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @AllowedUserTypes(['admin'])
  @Get('search')
  searchLessons(@Query() searchDto: SearchLessonDto) {
    return this.lessonService.searchLessons(searchDto);
  }

  @UseGuards(JwtGuard)
  @Get(':lessonId')
  getLessonById(@GetUser() user: User, @Param() dto: GetLessonDto) {
    return this.lessonService.getLessonById(user, dto);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @AllowedUserTypes(['admin', 'contractor'])
  @Patch(':lessonId')
  patchLesson(
    @Param() dto: GetLessonDto,
    @Body() patchLessonDto: PatchLessonDto,
  ) {
    return this.lessonService.patchLesson(dto, patchLessonDto);
  }

  @UseGuards(JwtGuard)
  @Get(':lessonId/course')
  getCourseOfLesson(@Param() dto: GetLessonDto) {
    return this.lessonService.getCourseOfLesson(dto);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @AllowedUserTypes(['admin', 'contractor'])
  @Delete(':lessonId')
  deleteLesson(@Param() dto: GetLessonDto) {
    return this.lessonService.deleteLesson(dto);
  }
}
