-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('WAITING', 'DELIVERED');

-- CreateTable
CREATE TABLE "tickets" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "member_id" TEXT,
    "name" TEXT,
    "phone" TEXT,
    "status" "TicketStatus" NOT NULL DEFAULT 'WAITING',
    "delivered_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tickets_number_key" ON "tickets"("number");

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
