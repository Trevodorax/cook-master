import { Injectable } from '@nestjs/common';
import { addMinutes, isBefore, isAfter } from 'date-fns';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async getRoomById(roomId: string) {
    const room = await this.prisma.room.findUnique({
      where: { id: Number(roomId) },
    });

    if (!room) {
      //throw new NotFoundException(`No room found with id ${roomId}`);
      return null;
    }

    return room;
  }

  async getEventsFromRoom(roomId: string) {
    const room = await this.prisma.room.findUnique({
      where: { id: Number(roomId) },
      include: {
        events: true,
      },
    });

    if (!room) {
      //throw new NotFoundException(`No room found with id ${roomId}`);
      return null;
    }

    return room.events;
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

  async checkRoomAvailability(roomId: number, startDate: Date, endDate: Date) {
    // Get all events for the room
    const roomEvents = await this.prisma.event.findMany({
      where: {
        roomId: roomId,
      },
    });

    // Check if there is any event that overlaps with the requested start and end date
    for (const event of roomEvents) {
      // Calculate event end time by adding duration to the start time
      const eventEndTime = addMinutes(
        new Date(event.startTime),
        event.durationMin,
      );

      // An event overlaps if it starts before the requested end date and ends after the requested start date
      if (
        isBefore(new Date(event.startTime), endDate) &&
        isAfter(eventEndTime, startDate)
      ) {
        return false; // Room is not available
      }
    }

    // If no overlapping events are found, the room is available
    return true;
  }
}
