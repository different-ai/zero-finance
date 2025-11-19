CREATE TABLE "bridge_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_did" text NOT NULL,
	"source_chain_id" integer NOT NULL,
	"dest_chain_id" integer NOT NULL,
	"vault_address" varchar(42) NOT NULL,
	"amount" numeric(78, 0) NOT NULL,
	"bridge_fee" numeric(78, 0) NOT NULL,
	"lp_fee" numeric(78, 0),
	"relayer_gas_fee" numeric(78, 0),
	"relayer_capital_fee" numeric(78, 0),
	"deposit_tx_hash" varchar(66),
	"fill_tx_hash" varchar(66),
	"deposit_id" text,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"filled_at" timestamp,
	"failed_at" timestamp,
	"error_message" text
);
--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT 'c4783b7a-151e-42f9-b0ae-0acecf4701a5';