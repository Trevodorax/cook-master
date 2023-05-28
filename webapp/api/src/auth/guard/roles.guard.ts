import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
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
    return allowedUserTypes.includes(user.userType);
  }
}
