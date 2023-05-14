import { User } from '@prisma/client';

export const getUserType = (user: Partial<User>) => {
  if (!user.adminId && !user.clientId && !user.contractorId) {
    throw new Error('User has no type');
  }

  if (user.clientId) return 'client';
  if (user.contractorId) return 'contractor';
  if (user.adminId) return 'admin';
};
