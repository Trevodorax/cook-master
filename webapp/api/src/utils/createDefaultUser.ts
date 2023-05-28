import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';

export async function createDefaultUser(): Promise<void> {
  const prisma = new PrismaClient();

  try {
    // Check if the default user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'admin@cookmaster.site' },
    });

    if (existingUser) {
      return;
    }

    // TODO: Hide this password in a .env file
    const passwordHash = await argon.hash('Respons11!');

    // Create the default admin
    const admin = await prisma.admin.create({
      data: {
        isConfirmed: true,
        isItemAdmin: true,
        isClientAdmin: true,
        isContractorAdmin: true,
      },
    });

    // Create the default user with adminId
    await prisma.user.create({
      data: {
        email: 'admin@cookmaster.site',
        hash: passwordHash,
        firstName: 'Admin',
        lastName: 'Istrator',
        userType: 'admin',
        adminId: admin.id,
      },
    });
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
}
