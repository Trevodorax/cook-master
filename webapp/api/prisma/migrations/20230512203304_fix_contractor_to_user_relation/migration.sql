/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `contractors` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `contractors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "contractors" ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "presentation" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "contractors_userId_key" ON "contractors"("userId");

-- AddForeignKey
ALTER TABLE "contractors" ADD CONSTRAINT "contractors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
