-- Add reconciliation tables for invoice matching
CREATE TABLE IF NOT EXISTS raw_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  source text NOT NULL,
  external_id text,
  txn_date date NOT NULL,
  amount numeric(18,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  counterparty text,
  memo text,
  raw jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  invoice_number text,
  vendor text,
  issue_date date,
  due_date date,
  currency text NOT NULL DEFAULT 'USD',
  total_amount numeric(18,2) NOT NULL,
  parsed_confidence numeric(5,2),
  doc_url text,
  raw jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  invoice_id uuid NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  transaction_id uuid NOT NULL REFERENCES raw_transactions(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'suggested',
  score numeric(5,2),
  rationale text,
  adjustments jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  decided_by text,
  decided_at timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS uniq_match ON matches(invoice_id, transaction_id);
CREATE INDEX IF NOT EXISTS idx_raw_transactions_user_date ON raw_transactions(user_id, txn_date);
CREATE INDEX IF NOT EXISTS idx_invoices_user_due ON invoices(user_id, due_date);
