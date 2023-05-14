import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async getUserById(user: JwtUser, id: string) {
    if (user.userType !== 'admin') {
      throw new ForbiddenException(
        'Admin rights are required to perform this operation',
      );
    }

    const idAsNumber = parseInt(id);

    const foundUser = await this.prisma.user.findUnique({
      where: { id: idAsNumber },
    });

    delete foundUser.hash;

    if (!foundUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const foundUserWithType = {
      ...foundUser,
      userType: foundUser.adminId
        ? 'admin'
        : foundUser.clientId
        ? 'client'
        : 'contractor',
    };

    return foundUserWithType;
  }

  async deleteUserById(user: JwtUser, id: string) {
    if (user.userType !== 'admin') {
      throw new ForbiddenException(
        'Admin rights are required to perform this operation',
      );
    }

    const idAsNumber = parseInt(id);

    const foundUser = await this.prisma.user.findUnique({
      where: { id: idAsNumber },
    });

    if (!foundUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const deletedUser = await this.prisma.user.delete({
      where: { id: idAsNumber },
    });

    console.log(deletedUser);

    return deletedUser;
  }
}
