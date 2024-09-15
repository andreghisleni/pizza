/*
  Warnings:

  - You are about to drop the column `status` on the `tickets` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TicketCreated" AS ENUM ('ONTHELOT', 'AFTERIMPORT');

-- AlterTable
ALTER TABLE "tickets" DROP COLUMN "status",
ADD COLUMN     "created" "TicketCreated" NOT NULL DEFAULT 'ONTHELOT',
ADD COLUMN     "description" TEXT;

-- DropEnum
DROP TYPE "TicketStatus";
