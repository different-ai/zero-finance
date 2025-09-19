-- add workspace scoping columns across user-centric tables
ALTER TABLE "user_wallets" ADD COLUMN IF NOT EXISTS "workspace_id" uuid;
CREATE INDEX IF NOT EXISTS "user_wallets_workspace_idx" ON "user_wallets" ("workspace_id");

ALTER TABLE "user_profiles" ADD COLUMN IF NOT EXISTS "workspace_id" uuid;
CREATE INDEX IF NOT EXISTS "user_profiles_workspace_idx" ON "user_profiles" ("workspace_id");

ALTER TABLE "user_requests" ADD COLUMN IF NOT EXISTS "workspace_id" uuid;
CREATE INDEX IF NOT EXISTS "user_requests_workspace_idx" ON "user_requests" ("workspace_id");

ALTER TABLE "user_safes" ADD COLUMN IF NOT EXISTS "workspace_id" uuid;
CREATE INDEX IF NOT EXISTS "user_safes_workspace_idx" ON "user_safes" ("workspace_id");

ALTER TABLE "user_funding_sources" ADD COLUMN IF NOT EXISTS "workspace_id" uuid;
CREATE INDEX IF NOT EXISTS "user_funding_sources_workspace_idx" ON "user_funding_sources" ("workspace_id");

ALTER TABLE "user_destination_bank_accounts" ADD COLUMN IF NOT EXISTS "workspace_id" uuid;
CREATE INDEX IF NOT EXISTS "user_dest_bank_accounts_workspace_idx" ON "user_destination_bank_accounts" ("workspace_id");

ALTER TABLE "allocation_strategies" ADD COLUMN IF NOT EXISTS "workspace_id" uuid;
CREATE INDEX IF NOT EXISTS "allocation_strategies_workspace_idx" ON "allocation_strategies" ("workspace_id");

ALTER TABLE "offramp_transfers" ADD COLUMN IF NOT EXISTS "workspace_id" uuid;
CREATE INDEX IF NOT EXISTS "offramp_transfers_workspace_idx" ON "offramp_transfers" ("workspace_id");

ALTER TABLE "onramp_transfers" ADD COLUMN IF NOT EXISTS "workspace_id" uuid;
CREATE INDEX IF NOT EXISTS "onramp_transfers_workspace_idx" ON "onramp_transfers" ("workspace_id");

ALTER TABLE "earn_deposits" ADD COLUMN IF NOT EXISTS "workspace_id" uuid;
CREATE INDEX IF NOT EXISTS "earn_workspace_idx" ON "earn_deposits" ("workspace_id");

ALTER TABLE "earn_withdrawals" ADD COLUMN IF NOT EXISTS "workspace_id" uuid;
CREATE INDEX IF NOT EXISTS "earn_withdrawals_workspace_idx" ON "earn_withdrawals" ("workspace_id");

ALTER TABLE "incoming_deposits" ADD COLUMN IF NOT EXISTS "workspace_id" uuid;
CREATE INDEX IF NOT EXISTS "incoming_deposits_workspace_idx" ON "incoming_deposits" ("workspace_id");

ALTER TABLE "auto_earn_configs" ADD COLUMN IF NOT EXISTS "workspace_id" uuid;
CREATE INDEX IF NOT EXISTS "auto_earn_workspace_idx" ON "auto_earn_configs" ("workspace_id");

ALTER TABLE "inbox_cards" ADD COLUMN IF NOT EXISTS "workspace_id" uuid;
CREATE INDEX IF NOT EXISTS "inbox_cards_workspace_idx" ON "inbox_cards" ("workspace_id");

ALTER TABLE "action_ledger" ADD COLUMN IF NOT EXISTS "workspace_id" uuid;
CREATE INDEX IF NOT EXISTS "action_ledger_workspace_idx" ON "action_ledger" ("workspace_id");

ALTER TABLE "chats" ADD COLUMN IF NOT EXISTS "workspace_id" uuid;
CREATE INDEX IF NOT EXISTS "chats_workspace_idx" ON "chats" ("workspace_id");

ALTER TABLE "gmail_oauth_tokens" ADD COLUMN IF NOT EXISTS "workspace_id" uuid;
CREATE INDEX IF NOT EXISTS "gmail_oauth_tokens_workspace_idx" ON "gmail_oauth_tokens" ("workspace_id");

ALTER TABLE "oauth_states" ADD COLUMN IF NOT EXISTS "workspace_id" uuid;
CREATE INDEX IF NOT EXISTS "oauth_states_workspace_idx" ON "oauth_states" ("workspace_id");

ALTER TABLE "gmail_sync_jobs" ADD COLUMN IF NOT EXISTS "workspace_id" uuid;
CREATE INDEX IF NOT EXISTS "gmail_sync_jobs_workspace_idx" ON "gmail_sync_jobs" ("workspace_id");

ALTER TABLE "gmail_processing_prefs" ADD COLUMN IF NOT EXISTS "workspace_id" uuid;
CREATE INDEX IF NOT EXISTS "gmail_processing_prefs_workspace_idx" ON "gmail_processing_prefs" ("workspace_id");

ALTER TABLE "user_classification_settings" ADD COLUMN IF NOT EXISTS "workspace_id" uuid;
CREATE INDEX IF NOT EXISTS "user_classification_settings_workspace_idx" ON "user_classification_settings" ("workspace_id");

ALTER TABLE "user_features" ADD COLUMN IF NOT EXISTS "workspace_id" uuid;
CREATE INDEX IF NOT EXISTS "user_features_workspace_idx" ON "user_features" ("workspace_id");

ALTER TABLE "invoice_templates" ADD COLUMN IF NOT EXISTS "workspace_id" uuid;
CREATE INDEX IF NOT EXISTS "invoice_templates_workspace_idx" ON "invoice_templates" ("workspace_id");

ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "workspace_id" uuid;
CREATE INDEX IF NOT EXISTS "companies_workspace_idx" ON "companies" ("workspace_id");

ALTER TABLE "company_members" ADD COLUMN IF NOT EXISTS "workspace_id" uuid;
CREATE INDEX IF NOT EXISTS "company_members_workspace_idx" ON "company_members" ("workspace_id");

ALTER TABLE "shared_company_data" ADD COLUMN IF NOT EXISTS "workspace_id" uuid;
CREATE INDEX IF NOT EXISTS "shared_company_data_workspace_idx" ON "shared_company_data" ("workspace_id");

ALTER TABLE "company_clients" ADD COLUMN IF NOT EXISTS "workspace_id" uuid;
CREATE INDEX IF NOT EXISTS "company_clients_workspace_idx" ON "company_clients" ("workspace_id");

ALTER TABLE "company_invite_links" ADD COLUMN IF NOT EXISTS "workspace_id" uuid;
CREATE INDEX IF NOT EXISTS "company_invite_links_workspace_idx" ON "company_invite_links" ("workspace_id");

ALTER TABLE "user_invoice_preferences" ADD COLUMN IF NOT EXISTS "workspace_id" uuid;
CREATE INDEX IF NOT EXISTS "user_invoice_prefs_workspace_idx" ON "user_invoice_preferences" ("workspace_id");

ALTER TABLE "card_actions" ADD COLUMN IF NOT EXISTS "workspace_id" uuid;
CREATE INDEX IF NOT EXISTS "card_actions_workspace_idx" ON "card_actions" ("workspace_id");

ALTER TABLE "workspace_members" ADD COLUMN IF NOT EXISTS "is_primary" boolean DEFAULT false;
UPDATE "workspace_members" SET "is_primary" = false WHERE "is_primary" IS NULL;
ALTER TABLE "workspace_members" ALTER COLUMN "is_primary" SET NOT NULL;
