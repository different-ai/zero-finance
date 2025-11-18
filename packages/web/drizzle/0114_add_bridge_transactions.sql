-- Migration: Add bridge_transactions table for cross-chain vault deposits
-- Purpose: Track Across Protocol bridge transactions for monitoring and debugging
-- Created: 2025-11-17

CREATE TABLE IF NOT EXISTS bridge_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_did TEXT NOT NULL,
  source_chain_id INTEGER NOT NULL,
  dest_chain_id INTEGER NOT NULL,
  vault_address VARCHAR(42) NOT NULL,
  amount NUMERIC(78, 0) NOT NULL,
  bridge_fee NUMERIC(78, 0) NOT NULL,
  lp_fee NUMERIC(78, 0),
  relayer_gas_fee NUMERIC(78, 0),
  relayer_capital_fee NUMERIC(78, 0),
  deposit_tx_hash VARCHAR(66),
  fill_tx_hash VARCHAR(66),
  deposit_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'filled', 'failed')),
  created_at TIMESTAMP DEFAULT NOW(),
  filled_at TIMESTAMP,
  failed_at TIMESTAMP,
  error_message TEXT
);

-- Indexes for efficient queries
CREATE INDEX bridge_transactions_user_did_idx ON bridge_transactions(user_did);
CREATE INDEX bridge_transactions_status_idx ON bridge_transactions(status);
CREATE INDEX bridge_transactions_deposit_tx_hash_idx ON bridge_transactions(deposit_tx_hash);
CREATE INDEX bridge_transactions_created_at_idx ON bridge_transactions(created_at DESC);

-- Comments for documentation
COMMENT ON TABLE bridge_transactions IS 'Tracks cross-chain bridge transactions via Across Protocol for vault deposits';
COMMENT ON COLUMN bridge_transactions.amount IS 'Input amount in smallest unit (e.g., USDC has 6 decimals)';
COMMENT ON COLUMN bridge_transactions.bridge_fee IS 'Total bridge fee charged by Across';
COMMENT ON COLUMN bridge_transactions.lp_fee IS 'Liquidity provider fee component';
COMMENT ON COLUMN bridge_transactions.relayer_gas_fee IS 'Gas fee paid to relayers';
COMMENT ON COLUMN bridge_transactions.relayer_capital_fee IS 'Capital fee for relayer liquidity';
COMMENT ON COLUMN bridge_transactions.status IS 'Bridge status: pending (initiated), filled (complete), failed (error)';
