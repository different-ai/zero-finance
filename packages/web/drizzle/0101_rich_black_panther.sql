CREATE TABLE "context_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"item_id" text NOT NULL,
	"item_type" text NOT NULL,
	"questions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"responses" jsonb,
	"status" text DEFAULT 'pending' NOT NULL,
	"sent_at" timestamp with time zone,
	"responded_at" timestamp with time zone,
	"response_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT '98a0d332-33da-47f0-8826-e5201e77bfdb';--> statement-breakpoint
CREATE INDEX "context_requests_user_item_idx" ON "context_requests" USING btree ("user_id","item_id");--> statement-breakpoint
CREATE INDEX "context_requests_status_idx" ON "context_requests" USING btree ("status");