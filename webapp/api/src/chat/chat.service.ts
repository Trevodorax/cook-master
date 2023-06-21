import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async getMessages(userId: number, otherUserId: number) {
    return this.prisma.message.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                senderId: userId,
                recipientId: otherUserId,
              },
              {
                senderId: otherUserId,
                recipientId: userId,
              },
            ],
          },
        ],
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async addMessage(authorId: number, recipientId: number, content: string) {
    return this.prisma.message.create({
      data: {
        content,
        senderId: authorId,
        recipientId,
      },
    });
  }
}
