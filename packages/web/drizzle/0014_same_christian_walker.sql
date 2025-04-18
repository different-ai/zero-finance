CREATE TABLE "offramp_transfers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"align_transfer_id" text NOT NULL,
	"status" text NOT NULL,
	"amount_to_send" text NOT NULL,
	"destination_currency" text NOT NULL,
	"destination_payment_rails" text,
	"destination_bank_account_id" uuid,
	"destination_bank_account_snapshot" jsonb,
	"deposit_amount" text NOT NULL,
	"deposit_token" text NOT NULL,
	"deposit_network" text NOT NULL,
	"deposit_address" text NOT NULL,
	"fee_amount" text,
	"quote_expires_at" timestamp,
	"transaction_hash" text,
	"user_op_hash" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "offramp_transfers_align_transfer_id_unique" UNIQUE("align_transfer_id")
);
--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT '504d784a-bee2-4866-a44d-2fa2a9ddc0d8';--> statement-breakpoint
ALTER TABLE "offramp_transfers" ADD CONSTRAINT "offramp_transfers_user_id_users_privy_did_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("privy_did") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offramp_transfers" ADD CONSTRAINT "offramp_transfers_destination_bank_account_id_user_destination_bank_accounts_id_fk" FOREIGN KEY ("destination_bank_account_id") REFERENCES "public"."user_destination_bank_accounts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "offramp_transfers_user_id_idx" ON "offramp_transfers" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "offramp_transfers_align_id_idx" ON "offramp_transfers" USING btree ("align_transfer_id");