import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { JwtGuard } from 'src/auth/guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { AllowedUserTypes } from 'src/auth/decorator';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}
  @Get(':roomId')
  getRoomById(@Param('roomId') roomId: string) {
    return this.roomService.getRoomById(roomId);
  }

  @Get(':roomId/events')
  getEventsFromRoom(@Param('roomId') roomId: string) {
    return this.roomService.getEventsFromRoom(roomId);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @AllowedUserTypes(['admin'])
  @Patch(':roomId')
  patchRoomById(
    @Param('roomId') roomId: string,
    @Body() data: { capacity: number },
  ) {
    return this.roomService.patchRoomById(roomId, data.capacity);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @AllowedUserTypes(['admin'])
  @Delete(':roomId')
  deleteRoomById(@Param('roomId') roomId: string) {
    return this.roomService.deleteRoomById(roomId);
  }
}
