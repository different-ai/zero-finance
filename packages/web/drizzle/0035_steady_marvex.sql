CREATE TABLE "oauth_states" (
	"state" text PRIMARY KEY NOT NULL,
	"user_privy_did" text NOT NULL,
	"provider" text DEFAULT 'gmail' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT 'f3a786a7-6eda-4e36-982e-0defe10a7fdb';--> statement-breakpoint
CREATE INDEX "oauth_states_user_did_idx" ON "oauth_states" USING btree ("user_privy_did");--> statement-breakpoint
CREATE INDEX "oauth_states_provider_idx" ON "oauth_states" USING btree ("provider");