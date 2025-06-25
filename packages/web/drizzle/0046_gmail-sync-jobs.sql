CREATE TABLE "gmail_sync_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"error" text,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone,
	"cards_added" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT '576e3a6a-1ed8-43a2-a6b2-31b5876855c1';--> statement-breakpoint
ALTER TABLE "gmail_sync_jobs" ADD CONSTRAINT "gmail_sync_jobs_user_id_users_privy_did_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("privy_did") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "gmail_sync_jobs_user_id_idx" ON "gmail_sync_jobs" USING btree ("user_id");