-- CreateTable
CREATE TABLE "Premise" (
    "id" SERIAL NOT NULL,
    "addressId" INTEGER NOT NULL,

    CONSTRAINT "Premise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "capacity" INTEGER NOT NULL,
    "premiseId" INTEGER NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Premise_addressId_key" ON "Premise"("addressId");

-- AddForeignKey
ALTER TABLE "Premise" ADD CONSTRAINT "Premise_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_premiseId_fkey" FOREIGN KEY ("premiseId") REFERENCES "Premise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
