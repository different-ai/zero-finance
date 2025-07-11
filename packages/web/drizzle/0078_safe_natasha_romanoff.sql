ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT 'eaa974b4-2977-410b-81bd-0bd581427830';--> statement-breakpoint
ALTER TABLE "user_safes" ALTER COLUMN "safe_address" SET DATA TYPE varchar(44);--> statement-breakpoint
ALTER TABLE "user_safes" ADD COLUMN "safe_chain" text DEFAULT 'ethereum' NOT NULL;