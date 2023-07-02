import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { RoomService } from './room.service';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}
  @Get(':roomId')
  getRoomById(@Param('roomId') roomId: string) {
    return this.roomService.getRoomById(roomId);
  }

  @Patch(':roomId')
  patchRoomById(
    @Param('roomId') roomId: string,
    @Body() data: { capacity: number },
  ) {
    return this.roomService.patchRoomById(roomId, data.capacity);
  }

  @Delete(':roomId')
  deleteRoomById(@Param('roomId') roomId: string) {
    return this.roomService.deleteRoomById(roomId);
  }
}
