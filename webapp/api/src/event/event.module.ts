import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { RoomService } from 'src/room/room.service';
import { RoomModule } from 'src/room/room.module';
import { EventGateway } from './event.gateway';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [EventController],
  providers: [EventService, UserService, EventGateway, RoomService, JwtService],
  imports: [RoomModule],
})
export class EventModule {}
