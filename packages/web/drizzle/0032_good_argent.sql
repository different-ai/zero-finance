CREATE TABLE "inbox_cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"card_id" text NOT NULL,
	"icon" text NOT NULL,
	"title" text NOT NULL,
	"subtitle" text NOT NULL,
	"confidence" integer NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"blocked" boolean DEFAULT false NOT NULL,
	"timestamp" timestamp with time zone NOT NULL,
	"snoozed_time" text,
	"is_ai_suggestion_pending" boolean DEFAULT false,
	"requires_action" boolean DEFAULT false,
	"suggested_action_label" text,
	"amount" text,
	"currency" text,
	"from_entity" text,
	"to_entity" text,
	"log_id" text NOT NULL,
	"rationale" text NOT NULL,
	"code_hash" text NOT NULL,
	"chain_of_thought" text[] NOT NULL,
	"impact" jsonb NOT NULL,
	"parsed_invoice_data" jsonb,
	"source_details" jsonb NOT NULL,
	"comments" jsonb DEFAULT '[]',
	"suggested_update" jsonb,
	"metadata" jsonb,
	"source_type" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "inbox_cards_card_id_unique" UNIQUE("card_id")
);
--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT '826c8646-7fa1-4f7d-a3cf-d3d4944695f3';--> statement-breakpoint
ALTER TABLE "inbox_cards" ADD CONSTRAINT "inbox_cards_user_id_users_privy_did_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("privy_did") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "inbox_cards_user_id_idx" ON "inbox_cards" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "inbox_cards_status_idx" ON "inbox_cards" USING btree ("status");--> statement-breakpoint
CREATE INDEX "inbox_cards_source_type_idx" ON "inbox_cards" USING btree ("source_type");--> statement-breakpoint
CREATE INDEX "inbox_cards_timestamp_idx" ON "inbox_cards" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "inbox_cards_confidence_idx" ON "inbox_cards" USING btree ("confidence");--> statement-breakpoint
CREATE INDEX "inbox_cards_card_id_idx" ON "inbox_cards" USING btree ("card_id");