import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UserType } from 'src/auth/dto';
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
        userType: true,
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

    return foundUser;
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

    return deletedUser;
  }

  async patchUser(user: JwtUser, id: string, data: Partial<User>) {
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

    const updatedUser = await this.prisma.user.update({
      where: { id: idAsNumber },
      data,
    });

    return updatedUser;
  }

  async searchUsers(user: JwtUser, search: string, userType: UserType) {
    if (user.userType !== 'admin') {
      throw new ForbiddenException(
        'Admin rights are required to perform this operation',
      );
    }

    const users = await this.prisma.user.findMany({
      where: {
        AND: [
          userType
            ? {
                userType: userType,
              }
            : null,
          search
            ? {
                OR: [
                  {
                    firstName: {
                      contains: search,
                      mode: 'insensitive',
                    },
                  },
                  {
                    lastName: {
                      contains: search,
                      mode: 'insensitive',
                    },
                  },
                  {
                    email: {
                      contains: search,
                      mode: 'insensitive',
                    },
                  },
                ],
              }
            : null,
        ],
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        userType: true,
      },
    });

    return users;
  }
}
