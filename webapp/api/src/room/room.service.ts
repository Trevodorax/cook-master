import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async getRoomById(roomId: string) {
    const room = await this.prisma.room.findUnique({
      where: { id: Number(roomId) },
    });

    if (!room) {
      throw new NotFoundException(`No room found with id ${roomId}`);
    }

    return room;
  }

  async patchRoomById(roomId: string, capacity: number) {
    return await this.prisma.room.update({
      where: { id: Number(roomId) },
      data: { capacity },
    });
  }

  async deleteRoomById(roomId: string) {
    return await this.prisma.room.delete({
      where: { id: Number(roomId) },
    });
  }
}
