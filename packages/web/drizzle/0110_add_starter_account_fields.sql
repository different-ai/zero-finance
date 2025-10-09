-- Add fields to track starter accounts (pre-approved company KYB)
-- Migration: 0110_add_starter_account_fields

-- Add account tier to user_funding_sources
ALTER TABLE user_funding_sources 
ADD COLUMN IF NOT EXISTS account_tier TEXT DEFAULT 'full';

-- Add owner Align customer ID to track which customer owns the virtual account
ALTER TABLE user_funding_sources 
ADD COLUMN IF NOT EXISTS owner_align_customer_id TEXT;

-- Add check constraint for account_tier
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'user_funding_sources_account_tier_check'
  ) THEN
    ALTER TABLE user_funding_sources
    ADD CONSTRAINT user_funding_sources_account_tier_check 
    CHECK (account_tier IN ('starter', 'full'));
  END IF;
END $$;

-- Add index for faster tier-based queries
CREATE INDEX IF NOT EXISTS idx_user_funding_sources_tier 
ON user_funding_sources(account_tier);

-- Add index for owner customer ID lookups
CREATE INDEX IF NOT EXISTS idx_user_funding_sources_owner_customer 
ON user_funding_sources(owner_align_customer_id);
