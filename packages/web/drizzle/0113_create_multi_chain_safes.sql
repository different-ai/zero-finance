-- Create safes table for multi-chain Safe deployment tracking
CREATE TABLE IF NOT EXISTS "safes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL REFERENCES "workspaces"("id") ON DELETE CASCADE,
	"address" varchar(42) NOT NULL,
	"chain_id" integer NOT NULL,
	"owners" jsonb NOT NULL,
	"threshold" integer NOT NULL,
	"salt" varchar(66) NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"deployment_tx" varchar(66),
	"deployed_at" timestamp with time zone,
	"deployed_by" varchar(42),
	"synced_at" timestamp with time zone,
	"sync_status" text DEFAULT 'synced',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Create safe_owner_sync_operations table for tracking owner sync across chains
CREATE TABLE IF NOT EXISTS "safe_owner_sync_operations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL REFERENCES "workspaces"("id") ON DELETE CASCADE,
	"operation_type" text NOT NULL,
	"owner_address" varchar(42),
	"threshold" integer,
	"base_tx_hash" varchar(66),
	"base_executed_at" timestamp with time zone,
	"chains_to_sync" jsonb NOT NULL,
	"sync_results" jsonb,
	"status" text DEFAULT 'pending' NOT NULL,
	"retry_count" integer DEFAULT 0 NOT NULL,
	"max_retries" integer DEFAULT 3 NOT NULL,
	"next_retry_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Create indexes for safes table
CREATE UNIQUE INDEX IF NOT EXISTS "safes_workspace_chain_idx" ON "safes" ("workspace_id", "chain_id");
CREATE INDEX IF NOT EXISTS "safes_address_idx" ON "safes" ("address");
CREATE INDEX IF NOT EXISTS "safes_workspace_id_idx" ON "safes" ("workspace_id");
CREATE INDEX IF NOT EXISTS "safes_chain_id_idx" ON "safes" ("chain_id");
CREATE INDEX IF NOT EXISTS "safes_is_primary_idx" ON "safes" ("is_primary");

-- Create indexes for safe_owner_sync_operations table
CREATE INDEX IF NOT EXISTS "safe_sync_ops_workspace_id_idx" ON "safe_owner_sync_operations" ("workspace_id");
CREATE INDEX IF NOT EXISTS "safe_sync_ops_status_idx" ON "safe_owner_sync_operations" ("status");
CREATE INDEX IF NOT EXISTS "safe_sync_ops_next_retry_idx" ON "safe_owner_sync_operations" ("next_retry_at");

-- Add constraints
ALTER TABLE "safe_owner_sync_operations" ADD CONSTRAINT "operation_type_check"
  CHECK ("operation_type" IN ('add_owner', 'remove_owner', 'change_threshold'));

ALTER TABLE "safe_owner_sync_operations" ADD CONSTRAINT "status_check"
  CHECK ("status" IN ('pending', 'in_progress', 'completed', 'failed'));

ALTER TABLE "safes" ADD CONSTRAINT "sync_status_check"
  CHECK ("sync_status" IN ('synced', 'pending', 'failed'));
