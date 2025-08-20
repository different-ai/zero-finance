CREATE TABLE "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"invoice_number" text,
	"vendor" text,
	"issue_date" timestamp,
	"due_date" timestamp,
	"currency" text DEFAULT 'USD' NOT NULL,
	"total_amount" numeric(18, 2) NOT NULL,
	"parsed_confidence" numeric(5, 2),
	"doc_url" text,
	"raw" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "matches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"invoice_id" uuid NOT NULL,
	"transaction_id" uuid NOT NULL,
	"status" text DEFAULT 'suggested' NOT NULL,
	"score" numeric(5, 2),
	"rationale" text,
	"adjustments" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"decided_by" text,
	"decided_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "raw_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"source" text NOT NULL,
	"external_id" text,
	"txn_date" timestamp NOT NULL,
	"amount" numeric(18, 2) NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"counterparty" text,
	"memo" text,
	"raw" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT '77febd6a-439e-4207-8bf3-8fca3367d903';--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_transaction_id_raw_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."raw_transactions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "invoices_user_due_idx" ON "invoices" USING btree ("user_id","due_date");--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_match" ON "matches" USING btree ("invoice_id","transaction_id");--> statement-breakpoint
CREATE INDEX "raw_transactions_user_date_idx" ON "raw_transactions" USING btree ("user_id","txn_date");