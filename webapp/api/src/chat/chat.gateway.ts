import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { BadRequestException } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private clients: Map<number, Socket> = new Map();

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  afterInit() {
    console.log('ChatGateway Initialized!');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.clients.forEach((socket, userId) => {
      if (socket.id === client.id) {
        this.clients.delete(userId);
        console.log(`Client disconnected: ${client.id}`);
      }
    });
  }

  @SubscribeMessage('auth')
  handleAuth(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    const dataJSON = JSON.parse(data);
    if (!dataJSON.token) {
      throw new BadRequestException('Invalid message');
    }

    const payload = this.jwtService.verify(dataJSON.token, {
      secret: this.configService.get('JWT_SECRET'),
    });

    this.clients.set(payload.sub, client);
  }

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() data: string): Promise<any> {
    const dataJSON = JSON.parse(data);
    if (!dataJSON.token) {
      throw new BadRequestException('Missing token');
    }

    if (!dataJSON.recipientId) {
      throw new BadRequestException('Missing recipientId');
    }

    if (!dataJSON.content) {
      throw new BadRequestException('Missing content');
    }

    const payload = this.jwtService.verify(dataJSON.token, {
      secret: this.configService.get('JWT_SECRET'),
    });

    const authorId = payload.sub;

    const newMessage = await this.chatService.addMessage(
      authorId,
      dataJSON.recipientId,
      dataJSON.content,
    );

    const senderSocket = this.clients.get(authorId);
    const recipientSocket = this.clients.get(dataJSON.recipientId);

    if (senderSocket) {
      senderSocket.emit('message', newMessage);
    }
    if (recipientSocket) {
      recipientSocket.emit('message', newMessage);
    }
  }
}
