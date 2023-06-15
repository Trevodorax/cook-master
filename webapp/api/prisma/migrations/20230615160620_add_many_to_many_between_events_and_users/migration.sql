/*
  Warnings:

  - You are about to drop the `_ClientToEvent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ClientToEvent" DROP CONSTRAINT "_ClientToEvent_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClientToEvent" DROP CONSTRAINT "_ClientToEvent_B_fkey";

-- DropTable
DROP TABLE "_ClientToEvent";

-- CreateTable
CREATE TABLE "_EventToClient" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EventToClient_AB_unique" ON "_EventToClient"("A", "B");

-- CreateIndex
CREATE INDEX "_EventToClient_B_index" ON "_EventToClient"("B");

-- AddForeignKey
ALTER TABLE "_EventToClient" ADD CONSTRAINT "_EventToClient_A_fkey" FOREIGN KEY ("A") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToClient" ADD CONSTRAINT "_EventToClient_B_fkey" FOREIGN KEY ("B") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
