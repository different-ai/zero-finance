ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT '15542132-e606-48b8-82e5-fb311b76a62f';--> statement-breakpoint
ALTER TABLE "inbox_cards" ADD COLUMN "applied_classifications" jsonb;--> statement-breakpoint
ALTER TABLE "inbox_cards" ADD COLUMN "classification_triggered" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "inbox_cards" ADD COLUMN "auto_approved" boolean DEFAULT false;