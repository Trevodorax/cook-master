/*
  Warnings:

  - A unique constraint covering the columns `[courseId,index]` on the table `lessons` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `index` to the `lessons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "lessons" ADD COLUMN     "index" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "lessons_courseId_index_key" ON "lessons"("courseId", "index");
