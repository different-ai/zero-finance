CREATE TABLE "action_ledger" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"approved_by" text NOT NULL,
	"inbox_card_id" text NOT NULL,
	"action_title" text NOT NULL,
	"action_subtitle" text,
	"action_type" text NOT NULL,
	"source_type" text NOT NULL,
	"source_details" jsonb,
	"impact_data" jsonb,
	"amount" text,
	"currency" text,
	"confidence" integer,
	"rationale" text,
	"chain_of_thought" text[],
	"original_card_data" jsonb NOT NULL,
	"parsed_invoice_data" jsonb,
	"status" text DEFAULT 'approved' NOT NULL,
	"execution_details" jsonb,
	"error_message" text,
	"metadata" jsonb,
	"approved_at" timestamp with time zone DEFAULT now() NOT NULL,
	"executed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT '269f1464-87a7-4d10-b4df-cb45b9bae29e';--> statement-breakpoint
ALTER TABLE "action_ledger" ADD CONSTRAINT "action_ledger_approved_by_users_privy_did_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("privy_did") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "action_ledger_approved_by_idx" ON "action_ledger" USING btree ("approved_by");--> statement-breakpoint
CREATE INDEX "action_ledger_action_type_idx" ON "action_ledger" USING btree ("action_type");--> statement-breakpoint
CREATE INDEX "action_ledger_source_type_idx" ON "action_ledger" USING btree ("source_type");--> statement-breakpoint
CREATE INDEX "action_ledger_status_idx" ON "action_ledger" USING btree ("status");--> statement-breakpoint
CREATE INDEX "action_ledger_approved_at_idx" ON "action_ledger" USING btree ("approved_at");