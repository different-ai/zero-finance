CREATE TABLE raw_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  source TEXT NOT NULL,
  external_id TEXT,
  txn_date DATE NOT NULL,
  amount NUMERIC(18,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  counterparty TEXT,
  memo TEXT,
  raw JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  invoice_number TEXT,
  vendor TEXT,
  issue_date DATE,
  due_date DATE,
  currency TEXT NOT NULL DEFAULT 'USD',
  total_amount NUMERIC(18,2) NOT NULL,
  parsed_confidence NUMERIC(5,2),
  doc_url TEXT,
  raw JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  transaction_id UUID NOT NULL REFERENCES raw_transactions(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'suggested',
  score NUMERIC(5,2),
  rationale TEXT,
  adjustments JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  decided_by TEXT,
  decided_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uniq_match ON matches(invoice_id, transaction_id);
CREATE INDEX ON raw_transactions(user_id, txn_date);
CREATE INDEX ON invoices(user_id, due_date);
