import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { RoomService } from 'src/room/room.service';
import { RoomModule } from 'src/room/room.module';

@Module({
  controllers: [EventController],
  providers: [EventService, RoomService],
  imports: [RoomModule],
})
export class EventModule {}
