CREATE TABLE "gmail_processing_prefs" (
	"user_id" text PRIMARY KEY NOT NULL,
	"is_enabled" boolean DEFAULT false NOT NULL,
	"activated_at" timestamp with time zone,
	"keywords" text[] DEFAULT '{"invoice","bill","payment","receipt","order","statement"}' NOT NULL,
	"last_synced_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT '1644ccda-4ad4-45d8-9775-43ca771c2fbc';--> statement-breakpoint
ALTER TABLE "gmail_processing_prefs" ADD CONSTRAINT "gmail_processing_prefs_user_id_users_privy_did_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("privy_did") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "gmail_processing_prefs_user_id_idx" ON "gmail_processing_prefs" USING btree ("user_id");--> statement-breakpoint
-- Remove duplicate inbox cards before creating unique index
DELETE FROM "inbox_cards" a
USING "inbox_cards" b
WHERE a.id > b.id
  AND a.user_id = b.user_id
  AND a.log_id = b.log_id;
--> statement-breakpoint
CREATE UNIQUE INDEX "inbox_cards_user_log_id_unique_idx" ON "inbox_cards" USING btree ("user_id","log_id");