/*
  Warnings:

  - You are about to drop the column `ticket_payment_id` on the `tickets` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "tickets" DROP CONSTRAINT "tickets_ticket_payment_id_fkey";

-- AlterTable
ALTER TABLE "tickets" DROP COLUMN "ticket_payment_id";
