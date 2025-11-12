CREATE TABLE "api_waitlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255),
	"company_name" varchar(255),
	"use_case" text,
	"privy_did" varchar(255),
	"user_id" varchar(255),
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT 'a3905015-10f3-462b-b725-cb087c4112c3';--> statement-breakpoint
CREATE INDEX "api_waitlist_email_idx" ON "api_waitlist" USING btree ("email");--> statement-breakpoint
CREATE INDEX "api_waitlist_privy_did_idx" ON "api_waitlist" USING btree ("privy_did");--> statement-breakpoint
CREATE INDEX "api_waitlist_status_idx" ON "api_waitlist" USING btree ("status");