/*
  Warnings:

  - You are about to drop the column `userId` on the `courses` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_userId_fkey";

-- AlterTable
ALTER TABLE "courses" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "_ClientToCourse" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ClientToCourse_AB_unique" ON "_ClientToCourse"("A", "B");

-- CreateIndex
CREATE INDEX "_ClientToCourse_B_index" ON "_ClientToCourse"("B");

-- AddForeignKey
ALTER TABLE "_ClientToCourse" ADD CONSTRAINT "_ClientToCourse_A_fkey" FOREIGN KEY ("A") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientToCourse" ADD CONSTRAINT "_ClientToCourse_B_fkey" FOREIGN KEY ("B") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
