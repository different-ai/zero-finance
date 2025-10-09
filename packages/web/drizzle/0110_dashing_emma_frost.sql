ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT '085a4aef-c7cb-4c10-afc3-b9a8a1fa8e84';--> statement-breakpoint
ALTER TABLE "user_funding_sources" ADD COLUMN "account_tier" text DEFAULT 'full';--> statement-breakpoint
ALTER TABLE "user_funding_sources" ADD COLUMN "owner_align_customer_id" text;