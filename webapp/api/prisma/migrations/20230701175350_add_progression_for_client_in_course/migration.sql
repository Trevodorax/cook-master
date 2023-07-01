-- CreateTable
CREATE TABLE "client_course_progress" (
    "progression" INTEGER NOT NULL,
    "clientId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "client_course_progress_pkey" PRIMARY KEY ("clientId","courseId")
);

-- AddForeignKey
ALTER TABLE "client_course_progress" ADD CONSTRAINT "client_course_progress_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_course_progress" ADD CONSTRAINT "client_course_progress_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
