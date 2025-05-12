CREATE TABLE "auto_earn_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_did" varchar(66) NOT NULL,
	"safe_address" varchar(42) NOT NULL,
	"pct" integer NOT NULL,
	"last_trigger" timestamp
);
--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT '97d59529-f9d6-41e5-a95b-64f36e258976';