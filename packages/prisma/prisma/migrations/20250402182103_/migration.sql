/*
  Warnings:

  - Added the required column `updated_at` to the `ticket_payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ticket_payments" ADD COLUMN     "paid_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "vision_id" TEXT;
