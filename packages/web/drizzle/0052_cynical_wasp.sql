ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT '8b522c05-f84a-4de8-a18c-83c23c62195f';--> statement-breakpoint
ALTER TABLE "action_ledger" ADD COLUMN "note" text;--> statement-breakpoint
ALTER TABLE "action_ledger" ADD COLUMN "categories" text[];