/*
  Warnings:

  - You are about to drop the column `userId` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `contractors` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clientId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[adminId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[contractorId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "admins" DROP CONSTRAINT "admins_userId_fkey";

-- DropForeignKey
ALTER TABLE "clients" DROP CONSTRAINT "clients_userId_fkey";

-- DropForeignKey
ALTER TABLE "contractors" DROP CONSTRAINT "contractors_userId_fkey";

-- DropIndex
DROP INDEX "admins_userId_key";

-- DropIndex
DROP INDEX "clients_userId_key";

-- DropIndex
DROP INDEX "contractors_userId_key";

-- AlterTable
ALTER TABLE "admins" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "clients" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "contractors" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "adminId" INTEGER,
ADD COLUMN     "clientId" INTEGER,
ADD COLUMN     "contractorId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "users_clientId_key" ON "users"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "users_adminId_key" ON "users"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "users_contractorId_key" ON "users"("contractorId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "contractors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
