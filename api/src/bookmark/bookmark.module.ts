import { Module } from '@nestjs/common';
import { BookmarkController } from './Bookmark.controller';

@Module({
  controllers: [BookmarkController],
})
export class BookmarkModule {}
