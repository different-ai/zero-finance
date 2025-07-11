CREATE TABLE "onramp_transfers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"align_transfer_id" text NOT NULL,
	"status" text NOT NULL,
	"amount" text NOT NULL,
	"source_currency" text NOT NULL,
	"source_rails" text NOT NULL,
	"destination_network" text NOT NULL,
	"destination_token" text NOT NULL,
	"destination_address" text NOT NULL,
	"deposit_rails" text NOT NULL,
	"deposit_currency" text NOT NULL,
	"deposit_bank_account" jsonb,
	"deposit_amount" text NOT NULL,
	"deposit_message" text,
	"fee_amount" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "onramp_transfers_align_transfer_id_unique" UNIQUE("align_transfer_id")
);
--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT 'ee3078d1-f927-4d38-9c89-547539bbcfa5';--> statement-breakpoint
ALTER TABLE "onramp_transfers" ADD CONSTRAINT "onramp_transfers_user_id_users_privy_did_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("privy_did") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "onramp_transfers_user_id_idx" ON "onramp_transfers" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "onramp_transfers_align_id_idx" ON "onramp_transfers" USING btree ("align_transfer_id");