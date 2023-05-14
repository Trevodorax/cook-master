import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtUser } from 'src/auth/strategy';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async getMe(user: JwtUser) {
    const userData = await this.prisma.user.findUnique({
      where: {
        id: user.user.id,
      },
      include: {
        admin: true,
        client: true,
        contractor: true,
      },
    });

    const modifiedUserData = {
      ...userData,
      userType: user.userType,
    };

    return modifiedUserData;
  }

  async getAllUsers(user: JwtUser) {
    if (user.userType !== 'admin') {
      throw new ForbiddenException(
        'Admin rights are required to perform this operation',
      );
    }

    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    return users;
  }
}
