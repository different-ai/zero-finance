ALTER TABLE "workspaces"
  ADD COLUMN "insurance_status" text NOT NULL DEFAULT 'sandbox',
  ADD COLUMN "insurance_activated_at" timestamp with time zone,
  ADD COLUMN "insurance_activated_by" varchar(255);

CREATE TABLE "vault_assets" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "address" text NOT NULL,
  "chain_id" integer NOT NULL,
  "symbol" text NOT NULL,
  "decimals" integer NOT NULL,
  "name" text,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX "vault_assets_chain_address_idx" ON "vault_assets" ("chain_id", "address");

CREATE TABLE "vaults" (
  "id" text PRIMARY KEY,
  "name" text NOT NULL,
  "display_name" text,
  "address" text NOT NULL,
  "chain_id" integer NOT NULL,
  "asset_id" uuid REFERENCES "vault_assets"("id"),
  "protocol" text NOT NULL,
  "risk_tier" text NOT NULL,
  "curator" text NOT NULL,
  "app_url" text,
  "is_insured" boolean NOT NULL DEFAULT false,
  "is_primary" boolean NOT NULL DEFAULT false,
  "status" text NOT NULL DEFAULT 'active',
  "sandbox_only" boolean NOT NULL DEFAULT false,
  "notes" text,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX "vaults_chain_idx" ON "vaults" ("chain_id");
CREATE INDEX "vaults_insured_idx" ON "vaults" ("is_insured");
CREATE INDEX "vaults_status_idx" ON "vaults" ("status");
CREATE INDEX "vaults_sandbox_idx" ON "vaults" ("sandbox_only");

CREATE TABLE "vault_insurance" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "vault_id" text NOT NULL REFERENCES "vaults"("id") ON DELETE cascade,
  "provider" text NOT NULL,
  "coverage_usd" numeric(78, 0),
  "coverage_currency" text NOT NULL DEFAULT 'USD',
  "policy_url" text,
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX "vault_insurance_vault_idx" ON "vault_insurance" ("vault_id");

CREATE TABLE "sandbox_tokens" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "symbol" text NOT NULL,
  "name" text,
  "address" text NOT NULL,
  "chain_id" integer NOT NULL,
  "decimals" integer NOT NULL,
  "faucet_enabled" boolean NOT NULL DEFAULT true,
  "max_daily_mint" numeric(78, 0),
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX "sandbox_tokens_chain_address_idx" ON "sandbox_tokens" ("chain_id", "address");

CREATE TABLE "sandbox_faucet_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "workspace_id" uuid NOT NULL REFERENCES "workspaces"("id") ON DELETE cascade,
  "token_id" uuid NOT NULL REFERENCES "sandbox_tokens"("id"),
  "recipient_address" text NOT NULL,
  "amount" numeric(78, 0) NOT NULL,
  "tx_hash" text,
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX "sandbox_faucet_events_workspace_idx" ON "sandbox_faucet_events" ("workspace_id");
CREATE INDEX "sandbox_faucet_events_recipient_idx" ON "sandbox_faucet_events" ("recipient_address");
CREATE INDEX "sandbox_faucet_events_token_idx" ON "sandbox_faucet_events" ("token_id");

CREATE TABLE "webhook_endpoints" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "workspace_id" uuid NOT NULL REFERENCES "workspaces"("id") ON DELETE cascade,
  "url" text NOT NULL,
  "secret" text NOT NULL,
  "events" jsonb NOT NULL,
  "is_active" boolean NOT NULL DEFAULT true,
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX "webhook_endpoints_workspace_idx" ON "webhook_endpoints" ("workspace_id");
CREATE INDEX "webhook_endpoints_active_idx" ON "webhook_endpoints" ("is_active");

CREATE TABLE "webhook_deliveries" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "workspace_id" uuid NOT NULL REFERENCES "workspaces"("id") ON DELETE cascade,
  "endpoint_id" uuid NOT NULL REFERENCES "webhook_endpoints"("id") ON DELETE cascade,
  "event_type" text NOT NULL,
  "payload" jsonb NOT NULL,
  "status" text NOT NULL DEFAULT 'pending',
  "attempts" integer NOT NULL DEFAULT 0,
  "next_retry_at" timestamp with time zone,
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX "webhook_deliveries_workspace_idx" ON "webhook_deliveries" ("workspace_id");
CREATE INDEX "webhook_deliveries_endpoint_idx" ON "webhook_deliveries" ("endpoint_id");
CREATE INDEX "webhook_deliveries_status_idx" ON "webhook_deliveries" ("status");

CREATE TABLE "audit_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "workspace_id" uuid REFERENCES "workspaces"("id") ON DELETE set null,
  "actor" text,
  "event_type" text NOT NULL,
  "metadata" jsonb,
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX "audit_events_workspace_idx" ON "audit_events" ("workspace_id");
CREATE INDEX "audit_events_event_type_idx" ON "audit_events" ("event_type");
