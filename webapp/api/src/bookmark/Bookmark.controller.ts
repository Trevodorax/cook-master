import { Get, Controller } from '@nestjs/common';

@Controller('Bookmarks')
export class BookmarkController {
  @Get('test')
  test() {
    return {
      message: 'Test successful',
    };
  }
}
