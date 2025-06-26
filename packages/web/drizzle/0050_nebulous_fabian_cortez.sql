ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT 'ee421633-48d9-4f00-9183-4f51cdcfecac';--> statement-breakpoint
ALTER TABLE "gmail_sync_jobs" ADD COLUMN "current_action" text;