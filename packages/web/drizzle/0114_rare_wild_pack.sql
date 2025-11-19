CREATE TABLE IF NOT EXISTS "bridge_transactions" (
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
CREATE TABLE IF NOT EXISTS "workspace_features" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_id" uuid NOT NULL,
	"feature_name" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"granted_by" text,
	"grant_source" text DEFAULT 'admin',
	"grant_reference" text,
	"activated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP INDEX IF EXISTS "user_safe_type_unique_idx";--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "earn_deposits" ADD COLUMN IF NOT EXISTS "chain_id" integer DEFAULT 8453 NOT NULL;--> statement-breakpoint
ALTER TABLE "earn_withdrawals" ADD COLUMN IF NOT EXISTS "chain_id" integer DEFAULT 8453 NOT NULL;--> statement-breakpoint
ALTER TABLE "user_safes" ADD COLUMN IF NOT EXISTS "chain_id" integer DEFAULT 8453 NOT NULL;--> statement-breakpoint
ALTER TABLE "workspace_features" ADD CONSTRAINT "workspace_features_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bridge_transactions_user_did_idx" ON "bridge_transactions" USING btree ("user_did");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bridge_transactions_status_idx" ON "bridge_transactions" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bridge_transactions_deposit_tx_hash_idx" ON "bridge_transactions" USING btree ("deposit_tx_hash");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bridge_transactions_created_at_idx" ON "bridge_transactions" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "workspace_feature_unique_idx" ON "workspace_features" USING btree ("workspace_id","feature_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "workspace_features_workspace_id_idx" ON "workspace_features" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "workspace_features_feature_name_idx" ON "workspace_features" USING btree ("feature_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "workspace_features_is_active_idx" ON "workspace_features" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "earn_deposits_chain_id_idx" ON "earn_deposits" USING btree ("chain_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "earn_withdrawals_chain_id_idx" ON "earn_withdrawals" USING btree ("chain_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_safe_type_chain_unique_idx" ON "user_safes" USING btree ("user_did","safe_type","chain_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_safes_chain_id_idx" ON "user_safes" USING btree ("chain_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_safes_user_chain_idx" ON "user_safes" USING btree ("user_did","chain_id");