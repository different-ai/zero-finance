ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT '04b5c64e-42a0-4ed3-a683-86942f144795';--> statement-breakpoint
ALTER TABLE "user_safes" ALTER COLUMN "safe_address" SET DATA TYPE varchar(44);--> statement-breakpoint
ALTER TABLE "user_safes" ADD COLUMN "safe_chain" text DEFAULT 'ethereum' NOT NULL;