ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT '4701199f-14b1-493f-9d76-d4a5773d8eb5';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "user_role" text DEFAULT 'startup' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "contractor_invite_code" text;