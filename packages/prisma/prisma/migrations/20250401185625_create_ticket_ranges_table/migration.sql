-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "ticket_range_id" TEXT;

-- CreateTable
CREATE TABLE "ticket_ranges" (
    "id" TEXT NOT NULL,
    "start" INTEGER NOT NULL,
    "end" INTEGER NOT NULL,
    "member_id" TEXT,
    "generated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "ticket_ranges_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ticket_ranges" ADD CONSTRAINT "ticket_ranges_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_ticket_range_id_fkey" FOREIGN KEY ("ticket_range_id") REFERENCES "ticket_ranges"("id") ON DELETE SET NULL ON UPDATE CASCADE;
