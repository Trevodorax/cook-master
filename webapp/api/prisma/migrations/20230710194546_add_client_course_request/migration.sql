-- CreateTable
CREATE TABLE "client_course_requests" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "client_course_requests_pkey" PRIMARY KEY ("id")
);
