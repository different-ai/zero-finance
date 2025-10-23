CREATE TABLE "user_login_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"privy_did" varchar(255) NOT NULL,
	"email" varchar(255),
	"smart_wallet_address" varchar(42),
	"embedded_wallet_address" varchar(42),
	"login_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_agent" text,
	"ip_address" varchar(45)
);
--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT '67619cb9-f376-4a03-ae6e-367b0a42a4cb';--> statement-breakpoint
CREATE INDEX "user_login_logs_privy_did_idx" ON "user_login_logs" USING btree ("privy_did");--> statement-breakpoint
CREATE INDEX "user_login_logs_login_at_idx" ON "user_login_logs" USING btree ("login_at");--> statement-breakpoint
CREATE INDEX "user_login_logs_email_idx" ON "user_login_logs" USING btree ("email");