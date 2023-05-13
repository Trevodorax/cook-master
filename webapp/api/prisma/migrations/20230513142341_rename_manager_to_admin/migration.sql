/*
  Warnings:

  - You are about to drop the `managers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "managers" DROP CONSTRAINT "managers_userId_fkey";

-- DropTable
DROP TABLE "managers";

-- CreateTable
CREATE TABLE "admins" (
    "id" SERIAL NOT NULL,
    "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "isItemAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isClientAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isContractorAdmin" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_userId_key" ON "admins"("userId");

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
