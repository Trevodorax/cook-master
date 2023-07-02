/*
  Warnings:

  - You are about to drop the `_ClientToEvent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ClientToEvent" DROP CONSTRAINT "_ClientToEvent_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClientToEvent" DROP CONSTRAINT "_ClientToEvent_B_fkey";

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "atHomeClientId" INTEGER,
ADD COLUMN     "roomId" INTEGER;

-- DropTable
DROP TABLE "_ClientToEvent";

-- CreateTable
CREATE TABLE "_Participant" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Participant_AB_unique" ON "_Participant"("A", "B");

-- CreateIndex
CREATE INDEX "_Participant_B_index" ON "_Participant"("B");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_atHomeClientId_fkey" FOREIGN KEY ("atHomeClientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Participant" ADD CONSTRAINT "_Participant_A_fkey" FOREIGN KEY ("A") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Participant" ADD CONSTRAINT "_Participant_B_fkey" FOREIGN KEY ("B") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
