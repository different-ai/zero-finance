ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT 'bf15a074-70b4-4fde-a310-bc8488b084a5';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "kyc_sub_status" text;