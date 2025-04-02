-- CreateEnum
CREATE TYPE "TicketPaymentType" AS ENUM ('CASH', 'PIX');

-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "ticket_payment_id" TEXT;

-- CreateTable
CREATE TABLE "ticket_payments" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" "TicketPaymentType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_payments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_ticket_payment_id_fkey" FOREIGN KEY ("ticket_payment_id") REFERENCES "ticket_payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
