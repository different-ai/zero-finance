CREATE TABLE "outgoing_transfers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_did" text NOT NULL,
	"workspace_id" uuid,
	"safe_address" varchar(42) NOT NULL,
	"tx_hash" varchar(66) NOT NULL,
	"to_address" varchar(42) NOT NULL,
	"token_address" varchar(42),
	"token_symbol" varchar(20),
	"token_decimals" integer,
	"amount" numeric(78, 0) NOT NULL,
	"block_number" bigint NOT NULL,
	"timestamp" timestamp with time zone NOT NULL,
	"tx_type" varchar(50),
	"method_name" varchar(100),
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "outgoing_transfers_tx_hash_unique" UNIQUE("tx_hash")
);
--> statement-breakpoint
ALTER TABLE "outgoing_transfers" ADD CONSTRAINT "outgoing_transfers_user_did_users_privy_did_fk" FOREIGN KEY ("user_did") REFERENCES "public"."users"("privy_did") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "outgoing_transfers_safe_address_idx" ON "outgoing_transfers" USING btree ("safe_address");--> statement-breakpoint
CREATE INDEX "outgoing_transfers_tx_hash_idx" ON "outgoing_transfers" USING btree ("tx_hash");--> statement-breakpoint
CREATE INDEX "outgoing_transfers_user_did_idx" ON "outgoing_transfers" USING btree ("user_did");--> statement-breakpoint
CREATE INDEX "outgoing_transfers_workspace_idx" ON "outgoing_transfers" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "outgoing_transfers_timestamp_idx" ON "outgoing_transfers" USING btree ("timestamp");