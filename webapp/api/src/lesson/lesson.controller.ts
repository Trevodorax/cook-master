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
import { LessonService } from './lesson.service';
import {
  CreateLessonDto,
  PatchLessonDto,
  GetLessonDto,
  SearchLessonDto,
} from './dto/';

@Controller('lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Get()
  getAllLessons() {
    return this.lessonService.getAllLessons();
  }

  @Post()
  createLesson(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonService.createLesson(createLessonDto);
  }

  @Get('search')
  searchLessons(@Query() searchDto: SearchLessonDto) {
    return this.lessonService.searchLessons(searchDto);
  }

  @Get(':lessonId')
  getLessonById(@Param() dto: GetLessonDto) {
    return this.lessonService.getLessonById(dto);
  }

  @Patch(':lessonId')
  patchLesson(
    @Param() dto: GetLessonDto,
    @Body() patchLessonDto: PatchLessonDto,
  ) {
    return this.lessonService.patchLesson(dto, patchLessonDto);
  }

  @Get(':lessonId/course')
  getCourseOfLesson(@Param() dto: GetLessonDto) {
    return this.lessonService.getCourseOfLesson(dto);
  }

  @Delete(':lessonId')
  deleteLesson(@Param() dto: GetLessonDto) {
    return this.lessonService.deleteLesson(dto);
  }
}
