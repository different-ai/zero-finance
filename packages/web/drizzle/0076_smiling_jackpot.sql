ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT 'fa37854c-d9ff-42e8-a3b4-59e66fa906f3';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "kyc_notification_sent" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "kyc_notification_status" text;