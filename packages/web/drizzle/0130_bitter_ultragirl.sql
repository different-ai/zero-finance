CREATE TABLE IF NOT EXISTS "action_proposals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_did" text NOT NULL,
	"workspace_id" uuid NOT NULL,
	"proposal_type" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"proposed_by_agent" boolean DEFAULT true NOT NULL,
	"proposal_message" text,
	"payload" jsonb NOT NULL,
	"tx_hash" text,
	"dismissed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "audit_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid,
	"actor" text,
	"event_type" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sandbox_faucet_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"token_id" uuid NOT NULL,
	"recipient_address" text NOT NULL,
	"amount" numeric(78, 0) NOT NULL,
	"tx_hash" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sandbox_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"symbol" text NOT NULL,
	"name" text,
	"address" text NOT NULL,
	"chain_id" integer NOT NULL,
	"decimals" integer NOT NULL,
	"faucet_enabled" boolean DEFAULT true NOT NULL,
	"max_daily_mint" numeric(78, 0),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vault_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"address" text NOT NULL,
	"chain_id" integer NOT NULL,
	"symbol" text NOT NULL,
	"decimals" integer NOT NULL,
	"name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vault_insurance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vault_id" text NOT NULL,
	"provider" text NOT NULL,
	"coverage_usd" numeric(78, 0),
	"coverage_currency" text DEFAULT 'USD' NOT NULL,
	"policy_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vaults" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"display_name" text,
	"address" text NOT NULL,
	"chain_id" integer NOT NULL,
	"asset_id" uuid,
	"protocol" text NOT NULL,
	"risk_tier" text NOT NULL,
	"curator" text NOT NULL,
	"app_url" text,
	"is_insured" boolean DEFAULT false NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"sandbox_only" boolean DEFAULT false NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "webhook_deliveries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"endpoint_id" uuid NOT NULL,
	"event_type" text NOT NULL,
	"payload" jsonb NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"next_retry_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "webhook_endpoints" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"url" text NOT NULL,
	"secret" text NOT NULL,
	"events" jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN IF NOT EXISTS "insurance_status" text DEFAULT 'sandbox' NOT NULL;--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN IF NOT EXISTS "insurance_activated_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN IF NOT EXISTS "insurance_activated_by" varchar(255);--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN IF NOT EXISTS "insurance_coverage_usd" integer DEFAULT 100000 NOT NULL;--> statement-breakpoint
DO $$
BEGIN
	ALTER TABLE "action_proposals" ADD CONSTRAINT "action_proposals_user_did_users_privy_did_fk" FOREIGN KEY ("user_did") REFERENCES "public"."users"("privy_did") ON DELETE cascade ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN NULL;
END $$;--> statement-breakpoint
DO $$
BEGIN
	ALTER TABLE "action_proposals" ADD CONSTRAINT "action_proposals_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN NULL;
END $$;--> statement-breakpoint
DO $$
BEGIN
	ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN NULL;
END $$;--> statement-breakpoint
DO $$
BEGIN
	ALTER TABLE "sandbox_faucet_events" ADD CONSTRAINT "sandbox_faucet_events_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN NULL;
END $$;--> statement-breakpoint
DO $$
BEGIN
	ALTER TABLE "sandbox_faucet_events" ADD CONSTRAINT "sandbox_faucet_events_token_id_sandbox_tokens_id_fk" FOREIGN KEY ("token_id") REFERENCES "public"."sandbox_tokens"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN NULL;
END $$;--> statement-breakpoint
DO $$
BEGIN
	ALTER TABLE "vault_insurance" ADD CONSTRAINT "vault_insurance_vault_id_vaults_id_fk" FOREIGN KEY ("vault_id") REFERENCES "public"."vaults"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN NULL;
END $$;--> statement-breakpoint
DO $$
BEGIN
	ALTER TABLE "vaults" ADD CONSTRAINT "vaults_asset_id_vault_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."vault_assets"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN NULL;
END $$;--> statement-breakpoint
DO $$
BEGIN
	ALTER TABLE "webhook_deliveries" ADD CONSTRAINT "webhook_deliveries_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN NULL;
END $$;--> statement-breakpoint
DO $$
BEGIN
	ALTER TABLE "webhook_deliveries" ADD CONSTRAINT "webhook_deliveries_endpoint_id_webhook_endpoints_id_fk" FOREIGN KEY ("endpoint_id") REFERENCES "public"."webhook_endpoints"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN NULL;
END $$;--> statement-breakpoint
DO $$
BEGIN
	ALTER TABLE "webhook_endpoints" ADD CONSTRAINT "webhook_endpoints_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN NULL;
END $$;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "action_proposals_workspace_idx" ON "action_proposals" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "action_proposals_user_idx" ON "action_proposals" USING btree ("user_did");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "action_proposals_status_idx" ON "action_proposals" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "action_proposals_type_idx" ON "action_proposals" USING btree ("proposal_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "action_proposals_dismissed_idx" ON "action_proposals" USING btree ("dismissed");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_events_workspace_idx" ON "audit_events" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_events_event_type_idx" ON "audit_events" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sandbox_faucet_events_workspace_idx" ON "sandbox_faucet_events" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sandbox_faucet_events_recipient_idx" ON "sandbox_faucet_events" USING btree ("recipient_address");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sandbox_faucet_events_token_idx" ON "sandbox_faucet_events" USING btree ("token_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "sandbox_tokens_chain_address_idx" ON "sandbox_tokens" USING btree ("chain_id","address");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "vault_assets_chain_address_idx" ON "vault_assets" USING btree ("chain_id","address");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "vault_insurance_vault_idx" ON "vault_insurance" USING btree ("vault_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "vaults_chain_idx" ON "vaults" USING btree ("chain_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "vaults_insured_idx" ON "vaults" USING btree ("is_insured");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "vaults_status_idx" ON "vaults" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "vaults_sandbox_idx" ON "vaults" USING btree ("sandbox_only");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "webhook_deliveries_workspace_idx" ON "webhook_deliveries" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "webhook_deliveries_endpoint_idx" ON "webhook_deliveries" USING btree ("endpoint_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "webhook_deliveries_status_idx" ON "webhook_deliveries" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "webhook_endpoints_workspace_idx" ON "webhook_endpoints" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "webhook_endpoints_active_idx" ON "webhook_endpoints" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "workspaces_insurance_status_idx" ON "workspaces" USING btree ("insurance_status");
