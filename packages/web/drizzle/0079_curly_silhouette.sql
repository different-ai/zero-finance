ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT 'b7dfcb6e-bc50-4fa7-810b-550110aa635b';--> statement-breakpoint
ALTER TABLE "inbox_cards" ADD COLUMN "raw_text_content" text;