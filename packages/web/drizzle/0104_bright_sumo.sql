ALTER TABLE "user_requests" ALTER COLUMN "id" SET DEFAULT 'b3953cae-b9b4-43df-896c-e3e0b5480e63';-- Function to populate workspace_id from a user-linked column
CREATE OR REPLACE FUNCTION ensure_workspace_from_user()
RETURNS trigger AS $$
DECLARE
  user_identifier text;
  resolved_workspace uuid;
BEGIN
  IF NEW.workspace_id IS NOT NULL THEN
    RETURN NEW;
  END IF;

  EXECUTE format('SELECT ($1).%I', TG_ARGV[0]) INTO user_identifier USING NEW;

  IF user_identifier IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT primary_workspace_id
  INTO resolved_workspace
  FROM users
  WHERE privy_did = user_identifier;

  NEW.workspace_id := resolved_workspace;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to populate workspace_id from a company-linked column
CREATE OR REPLACE FUNCTION ensure_workspace_from_company()
RETURNS trigger AS $$
DECLARE
  company_identifier uuid;
  resolved_workspace uuid;
BEGIN
  IF NEW.workspace_id IS NOT NULL THEN
    RETURN NEW;
  END IF;

  EXECUTE format('SELECT ($1).%I', TG_ARGV[0]) INTO company_identifier USING NEW;

  IF company_identifier IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT workspace_id
  INTO resolved_workspace
  FROM companies
  WHERE id = company_identifier;

  NEW.workspace_id := resolved_workspace;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Helper to create or replace a trigger succinctly
CREATE OR REPLACE FUNCTION create_workspace_trigger(
  target_table regclass,
  trigger_name text,
  referenced_column text,
  resolver text
) RETURNS void AS $$
BEGIN
  EXECUTE format('DROP TRIGGER IF EXISTS %I ON %s', trigger_name, target_table);
  EXECUTE format(
    'CREATE TRIGGER %I BEFORE INSERT OR UPDATE ON %s FOR EACH ROW EXECUTE FUNCTION %s(%L)',
    trigger_name,
    target_table,
    resolver,
    referenced_column
  );
END;
$$ LANGUAGE plpgsql;

-- User-scoped tables
SELECT create_workspace_trigger('user_wallets', 'set_workspace_user_wallets', 'user_id', 'ensure_workspace_from_user');
SELECT create_workspace_trigger('user_profiles', 'set_workspace_user_profiles', 'privy_did', 'ensure_workspace_from_user');
SELECT create_workspace_trigger('user_requests', 'set_workspace_user_requests', 'user_id', 'ensure_workspace_from_user');
SELECT create_workspace_trigger('user_safes', 'set_workspace_user_safes', 'user_did', 'ensure_workspace_from_user');
SELECT create_workspace_trigger('user_funding_sources', 'set_workspace_user_funding_sources', 'user_privy_did', 'ensure_workspace_from_user');
SELECT create_workspace_trigger('user_destination_bank_accounts', 'set_workspace_user_destination_accounts', 'user_id', 'ensure_workspace_from_user');
SELECT create_workspace_trigger('allocation_strategies', 'set_workspace_allocation_strategies', 'user_did', 'ensure_workspace_from_user');
SELECT create_workspace_trigger('offramp_transfers', 'set_workspace_offramp_transfers', 'user_id', 'ensure_workspace_from_user');
SELECT create_workspace_trigger('onramp_transfers', 'set_workspace_onramp_transfers', 'user_id', 'ensure_workspace_from_user');
SELECT create_workspace_trigger('earn_deposits', 'set_workspace_earn_deposits', 'user_did', 'ensure_workspace_from_user');
SELECT create_workspace_trigger('earn_withdrawals', 'set_workspace_earn_withdrawals', 'user_did', 'ensure_workspace_from_user');
SELECT create_workspace_trigger('incoming_deposits', 'set_workspace_incoming_deposits', 'user_did', 'ensure_workspace_from_user');
SELECT create_workspace_trigger('auto_earn_configs', 'set_workspace_auto_earn_configs', 'user_did', 'ensure_workspace_from_user');
SELECT create_workspace_trigger('inbox_cards', 'set_workspace_inbox_cards', 'user_id', 'ensure_workspace_from_user');
SELECT create_workspace_trigger('action_ledger', 'set_workspace_action_ledger', 'approved_by', 'ensure_workspace_from_user');
SELECT create_workspace_trigger('chats', 'set_workspace_chats', 'user_id', 'ensure_workspace_from_user');
SELECT create_workspace_trigger('gmail_oauth_tokens', 'set_workspace_gmail_oauth_tokens', 'user_privy_did', 'ensure_workspace_from_user');
SELECT create_workspace_trigger('oauth_states', 'set_workspace_oauth_states', 'user_privy_did', 'ensure_workspace_from_user');
SELECT create_workspace_trigger('gmail_sync_jobs', 'set_workspace_gmail_sync_jobs', 'user_id', 'ensure_workspace_from_user');
SELECT create_workspace_trigger('gmail_processing_prefs', 'set_workspace_gmail_processing_prefs', 'user_id', 'ensure_workspace_from_user');
SELECT create_workspace_trigger('user_classification_settings', 'set_workspace_user_classification', 'user_id', 'ensure_workspace_from_user');
SELECT create_workspace_trigger('user_features', 'set_workspace_user_features', 'user_privy_did', 'ensure_workspace_from_user');
SELECT create_workspace_trigger('invoice_templates', 'set_workspace_invoice_templates', 'user_privy_did', 'ensure_workspace_from_user');
SELECT create_workspace_trigger('user_invoice_preferences', 'set_workspace_user_invoice_preferences', 'user_privy_did', 'ensure_workspace_from_user');
SELECT create_workspace_trigger('card_actions', 'set_workspace_card_actions', 'user_id', 'ensure_workspace_from_user');

-- Company-scoped tables
SELECT create_workspace_trigger('companies', 'set_workspace_companies', 'owner_privy_did', 'ensure_workspace_from_user');
SELECT create_workspace_trigger('company_members', 'set_workspace_company_members', 'company_id', 'ensure_workspace_from_company');
SELECT create_workspace_trigger('shared_company_data', 'set_workspace_shared_company_data', 'company_id', 'ensure_workspace_from_company');
SELECT create_workspace_trigger('company_clients', 'set_workspace_company_clients', 'user_privy_did', 'ensure_workspace_from_user');
SELECT create_workspace_trigger('company_invite_links', 'set_workspace_company_invite_links', 'company_id', 'ensure_workspace_from_company');

-- Clean up helper function to avoid leaving DDL helpers around
DROP FUNCTION create_workspace_trigger(regclass, text, text, text);
