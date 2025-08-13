ALTER TABLE "escrow_invoices" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "escrow_invoices" CASCADE;--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT 'b9a6d6f6-dba9-4547-8d51-6d877ba49b5b';