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
import { UserService } from 'src/user/user.service';

@WebSocketGateway({ cors: true })
export class EventGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  animatorSocket: Socket | null = null;

  constructor(
    private readonly eventService: EventService,
    private readonly userService: UserService,
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
    // Remove animator socket if it's the one disconnecting
    if (this.animatorSocket === client) {
      this.animatorSocket = null;
    }
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-event')
  async handleAuth(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    const dataJSON = JSON.parse(data) as {
      token: string;
      eventId: number;
      peerId: string;
    };

    if (!dataJSON.token || !dataJSON.eventId || !dataJSON.peerId) {
      throw new BadRequestException('Invalid message');
    }

    const payload = this.jwtService.verify(dataJSON.token, {
      secret: this.configService.get('JWT_SECRET'),
    });

    // TODO: check that the user is participating in this event
    const event = await this.eventService.getEventById({
      id: dataJSON.eventId,
    });
    const user = await this.userService.getUserById(payload.sub);

    const isAnimator =
      user.contractorId && user.contractorId === event.contractorId;

    client.join(`event${dataJSON.eventId}`);

    if (isAnimator) {
      this.animatorSocket = client;
      console.log('animator connected');
    }

    if (this.animatorSocket) {
      this.animatorSocket.emit('user-connected', dataJSON.peerId);
    }
  }
}
