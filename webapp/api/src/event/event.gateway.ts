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
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import { EventService } from './event.service';

@WebSocketGateway({ cors: true })
export class EventGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly eventService: EventService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  afterInit() {
    console.log('EventGateway Initialized!');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-event')
  handleAuth(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    const dataJSON = JSON.parse(data) as { token: string; eventId: number };
    if (!dataJSON.token || !dataJSON.eventId) {
      throw new BadRequestException('Invalid message');
    }

    const payload = this.jwtService.verify(dataJSON.token, {
      secret: this.configService.get('JWT_SECRET'),
    });

    // TODO: check that the user is participating in this event

    client.join(`event${dataJSON.eventId}`);
    client.to(`event${dataJSON.eventId}`).emit('user-connected');
  }
}
