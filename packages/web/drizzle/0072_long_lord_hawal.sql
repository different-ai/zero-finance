ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT 'f8658f7d-f0cf-4fdc-891e-3416ff0e7f7f';--> statement-breakpoint
ALTER TABLE "inbox_cards" ADD COLUMN "marked_as_fraud" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "inbox_cards" ADD COLUMN "fraud_marked_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "inbox_cards" ADD COLUMN "fraud_reason" text;--> statement-breakpoint
ALTER TABLE "inbox_cards" ADD COLUMN "fraud_marked_by" text;