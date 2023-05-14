import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtUser } from 'src/auth/strategy';

import { PrismaService } from 'src/prisma/prisma.service';
import { getUserType } from 'src/utils/getUserType';

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
        adminId: true,
        clientId: true,
        contractorId: true,
      },
    });

    const usersWithType = users.map((user) => ({
      ...user,
      adminId: undefined,
      clientId: undefined,
      contractorId: undefined,
      userType: getUserType(user),
    }));

    return usersWithType;
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
      userType: getUserType(foundUser),
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
}
