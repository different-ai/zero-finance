CREATE TABLE "virtual_account_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"workspace_id" uuid,
	"align_virtual_account_id" text NOT NULL,
	"event_type" text NOT NULL,
	"event_timestamp" timestamp with time zone,
	"source_amount" text,
	"source_currency" text,
	"source_payment_rails" text,
	"destination_amount" text,
	"destination_token" text,
	"destination_network" text,
	"destination_address" text,
	"transaction_hash" text,
	"raw_event_data" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "virtual_account_history" ADD CONSTRAINT "virtual_account_history_user_id_users_privy_did_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("privy_did") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "va_history_user_id_idx" ON "virtual_account_history" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "va_history_workspace_idx" ON "virtual_account_history" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "va_history_va_id_idx" ON "virtual_account_history" USING btree ("align_virtual_account_id");--> statement-breakpoint
CREATE UNIQUE INDEX "va_history_unique_event_idx" ON "virtual_account_history" USING btree ("align_virtual_account_id","event_type","event_timestamp","source_amount");