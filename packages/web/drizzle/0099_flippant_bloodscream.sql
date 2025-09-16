ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT 'ea43b031-ce09-442a-8a8d-7b83641329f0';--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "is_insured" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "insurance_activated_at" timestamp;