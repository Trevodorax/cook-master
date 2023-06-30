-- AlterTable
ALTER TABLE "events" ADD COLUMN     "courseId" INTEGER;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
