ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT '379de0d2-07ec-4a74-ae8c-844b91f523ed';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "first_name" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_name" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "company_name" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "beneficiary_type" text;