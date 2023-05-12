import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto, SignUpDto } from './dto';
import * as argon from 'argon2';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(dto: SignUpDto) {
    const passwordHash = await argon.hash(dto.password);

    const newUserData = {
      email: dto.email,
      hash: passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
    };

    let managerData = undefined;
    let clientData = undefined;
    let contractorData = undefined;

    switch (dto.userType) {
      case 'client':
        clientData = {
          create: {
            fidelityPoints: 0,
            Address: {},
          },
        };
        break;

      case 'contractor':
        contractorData = {
          create: {},
        };
        break;

      case 'manager':
        managerData = {
          create: {
            isConfirmed: false,
            isItemManager: false,
            isClientManager: false,
            isContractorManager: false,
          },
        };
        break;
    }

    const newUserDataWithUserType = {
      ...newUserData,
      manager: managerData,
      client: clientData,
      contractor: contractorData,
    };

    try {
      const user = await this.prisma.user.create({
        data: newUserDataWithUserType,
        select: {
          id: true,
          email: true,
        },
      });

      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code == 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
      }
      throw error;
    }
  }

  async signin(dto: SignInDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
      select: {
        id: true,
        email: true,
        hash: true,
      },
    });

    if (!user) {
      throw new ForbiddenException("This email isn't linked to an account.");
    }

    const isPasswordValid = await argon.verify(user.hash, dto.password);

    if (!isPasswordValid) {
      throw new ForbiddenException('Incorrect password');
    }

    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: '30m',
      secret: this.config.get('JWT_SECRET'),
    });

    return {
      access_token: accessToken,
    };
  }
}
