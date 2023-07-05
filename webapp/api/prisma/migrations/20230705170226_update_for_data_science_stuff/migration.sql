-- AlterTable
ALTER TABLE "contractors" ADD COLUMN     "serviceCost" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "serviceType" TEXT NOT NULL DEFAULT 'courses';

-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "total" INTEGER NOT NULL DEFAULT 0,
    "boughtAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" INTEGER,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
