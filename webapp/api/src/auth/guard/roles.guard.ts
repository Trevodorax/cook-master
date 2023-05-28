import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowedUserTypes = this.reflector.get<string[]>(
      'allowedUserTypes',
      context.getHandler(),
    );
    if (!allowedUserTypes) {
      // if no AllowedUserTypes decorator is set, anyone can access
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    if (user.userType === 'admin') {
      // If user is admin, check if isConfirmed is true
      const admin = await this.prisma.admin.findUnique({
        where: { id: user.adminId },
      });
      if (!admin || !admin.isConfirmed) {
        return false;
      }
    }

    return allowedUserTypes.includes(user.userType);
  }
}
