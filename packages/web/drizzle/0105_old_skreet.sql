CREATE TABLE "earn_vault_apy_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vault_address" varchar(42) NOT NULL,
	"chain_id" integer NOT NULL,
	"apy_basis_points" integer NOT NULL,
	"source" text,
	"captured_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "action_ledger" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "card_actions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "gmail_oauth_tokens" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "gmail_processing_prefs" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "gmail_sync_jobs" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "inbox_cards" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "oauth_states" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "action_ledger" CASCADE;--> statement-breakpoint
DROP TABLE "card_actions" CASCADE;--> statement-breakpoint
DROP TABLE "gmail_oauth_tokens" CASCADE;--> statement-breakpoint
DROP TABLE "gmail_processing_prefs" CASCADE;--> statement-breakpoint
DROP TABLE "gmail_sync_jobs" CASCADE;--> statement-breakpoint
DROP TABLE "inbox_cards" CASCADE;--> statement-breakpoint
DROP TABLE "oauth_states" CASCADE;--> statement-breakpoint
ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT '74b917fd-69c1-4098-8914-ca1f730561e2';--> statement-breakpoint
ALTER TABLE "earn_deposits" ADD COLUMN "apy_basis_points" integer;--> statement-breakpoint
ALTER TABLE "earn_deposits" ADD COLUMN "asset_decimals" integer DEFAULT 6 NOT NULL;--> statement-breakpoint
CREATE INDEX "earn_vault_apy_snapshots_vault_idx" ON "earn_vault_apy_snapshots" USING btree ("vault_address");--> statement-breakpoint
CREATE INDEX "earn_vault_apy_snapshots_vault_time_idx" ON "earn_vault_apy_snapshots" USING btree ("vault_address","captured_at");