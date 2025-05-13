CREATE TABLE IF NOT EXISTS "auto_earn_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_did" varchar(66) NOT NULL,
	"safe_address" varchar(42) NOT NULL,
	"pct" integer NOT NULL,
	"last_trigger" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT '6f40f918-f845-4643-a682-f4b460c3ad93';--> statement-breakpoint
CREATE UNIQUE INDEX "auto_earn_user_safe_unique_idx" ON "auto_earn_configs" USING btree ("user_did","safe_address");