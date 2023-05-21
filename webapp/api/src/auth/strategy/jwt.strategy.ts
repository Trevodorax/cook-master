import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

export interface JwtUser {
  user: User;
  userType: 'admin' | 'client' | 'contractor';
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'paul-jwt') {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: number }) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });
    delete user.hash;

    if (!user) {
      return null;
    }

    return user;
  }
}
