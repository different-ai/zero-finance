CREATE TABLE "starter_account_whitelist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"added_by" text NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "starter_account_whitelist_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT '49c03e92-18e5-41b6-b5db-6fe26a89a207';--> statement-breakpoint
ALTER TABLE "starter_account_whitelist" ADD CONSTRAINT "starter_account_whitelist_added_by_admins_privy_did_fk" FOREIGN KEY ("added_by") REFERENCES "public"."admins"("privy_did") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "starter_whitelist_email_idx" ON "starter_account_whitelist" USING btree ("email");