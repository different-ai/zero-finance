ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT 'bd6fddbd-704c-420e-b11f-878bbbf930c9';--> statement-breakpoint
ALTER TABLE "user_funding_sources" ADD COLUMN "source_provider" text;--> statement-breakpoint
ALTER TABLE "user_funding_sources" ADD COLUMN "align_virtual_account_id_ref" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "align_customer_id" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "kyc_provider" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "kyc_status" text DEFAULT 'none';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "kyc_flow_link" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "align_virtual_account_id" text;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_align_customer_id_unique" UNIQUE("align_customer_id");