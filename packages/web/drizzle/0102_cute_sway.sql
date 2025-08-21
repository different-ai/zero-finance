ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT '61800250-f468-46e7-8174-a3535b625b73';--> statement-breakpoint
ALTER TABLE "raw_transactions" ADD COLUMN "gl_code" text;--> statement-breakpoint
ALTER TABLE "raw_transactions" ADD COLUMN "gl_code_confidence" numeric(5, 2);--> statement-breakpoint
ALTER TABLE "raw_transactions" ADD COLUMN "gl_code_reason" text;--> statement-breakpoint
ALTER TABLE "raw_transactions" ADD COLUMN "categorization_status" text DEFAULT 'pending';