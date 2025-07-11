ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT 'd698c5ec-4fcc-4120-9b67-7654d2b00d44';--> statement-breakpoint
ALTER TABLE "inbox_cards" ADD COLUMN "embedding" jsonb;