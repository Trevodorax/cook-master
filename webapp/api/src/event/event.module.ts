import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { RoomService } from 'src/room/room.service';
import { RoomModule } from 'src/room/room.module';
import { EventGateway } from './event.gateway';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [EventController],
  providers: [EventService, EventGateway, RoomService, JwtService],
  imports: [RoomModule],
})
export class EventModule {}
