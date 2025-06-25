ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT 'becffbd6-3158-445a-aa8f-fcf4da95bec0';--> statement-breakpoint
ALTER TABLE "inbox_cards" ADD COLUMN "subject_hash" text;--> statement-breakpoint
CREATE INDEX "inbox_cards_subject_hash_idx" ON "inbox_cards" USING btree ("subject_hash");