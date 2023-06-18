/*
  Warnings:

  - You are about to drop the column `subscriptionLevel` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "subscriptionLevel" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "subscriptionLevel";
