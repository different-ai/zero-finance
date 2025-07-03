ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT '63c80669-7da3-4599-aeb8-b0ade6ba3923';--> statement-breakpoint
ALTER TABLE "inbox_cards" ADD COLUMN "payment_status" text DEFAULT 'unpaid';--> statement-breakpoint
ALTER TABLE "inbox_cards" ADD COLUMN "paid_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "inbox_cards" ADD COLUMN "paid_amount" text;--> statement-breakpoint
ALTER TABLE "inbox_cards" ADD COLUMN "payment_method" text;--> statement-breakpoint
ALTER TABLE "inbox_cards" ADD COLUMN "due_date" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "inbox_cards" ADD COLUMN "reminder_date" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "inbox_cards" ADD COLUMN "reminder_sent" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "inbox_cards" ADD COLUMN "expense_category" text;--> statement-breakpoint
ALTER TABLE "inbox_cards" ADD COLUMN "expense_note" text;--> statement-breakpoint
ALTER TABLE "inbox_cards" ADD COLUMN "added_to_expenses" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "inbox_cards" ADD COLUMN "expense_added_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "inbox_cards" ADD COLUMN "attachment_urls" text[];--> statement-breakpoint
ALTER TABLE "inbox_cards" ADD COLUMN "has_attachments" boolean DEFAULT false;