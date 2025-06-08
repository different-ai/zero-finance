ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT 'e71e7b29-300c-456d-bbc5-fcf332909d47';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "kyc_sub_status" text;