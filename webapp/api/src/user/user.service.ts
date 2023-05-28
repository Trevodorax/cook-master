import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UserType } from 'src/auth/dto';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async getMe(user: User) {
    const userData = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        admin: true,
        client: true,
        contractor: true,
      },
    });

    return userData;
  }

  async getAllUsers() {
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

  async getUserById(id: string) {
    const idAsNumber = parseInt(id);

    const foundUser = await this.prisma.user.findUnique({
      where: { id: idAsNumber },
      include: {
        admin: true,
      },
    });

    if (!foundUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    delete foundUser.hash;

    return foundUser;
  }

  async deleteUserById(id: string) {
    const idAsNumber = parseInt(id);

    if (idAsNumber === 1) {
      throw new ForbiddenException('You cannot delete the default admin');
    }

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

  async patchUser(id: string, data: Partial<User>) {
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

  async confirmAdmin(id: string) {
    const idAsNumber = parseInt(id);

    const foundUser = await this.prisma.user.findUnique({
      where: { id: idAsNumber },
    });

    if (!foundUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (!foundUser.adminId) {
      throw new BadRequestException('Selected user is not an admin');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: idAsNumber },
      data: {
        admin: {
          update: {
            isConfirmed: true,
          },
        },
      },
    });

    return updatedUser;
  }

  async searchUsers(search: string, userType: UserType) {
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
