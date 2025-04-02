/*
  Warnings:

  - Added the required column `member_id` to the `ticket_payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ticket_payments" ADD COLUMN     "member_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ticket_payments" ADD CONSTRAINT "ticket_payments_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
