ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT 'eec5663f-41f8-449a-9f6e-923b4f084b7d';--> statement-breakpoint
ALTER TABLE "gmail_sync_jobs" ADD COLUMN "next_page_token" text;--> statement-breakpoint
ALTER TABLE "gmail_sync_jobs" ADD COLUMN "processed_count" integer DEFAULT 0;