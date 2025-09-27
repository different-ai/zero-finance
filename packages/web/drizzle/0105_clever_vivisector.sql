ALTER TABLE "earn_deposits"
  ADD COLUMN "apy_basis_points" integer,
  ADD COLUMN "asset_decimals" integer NOT NULL DEFAULT 6;

-- backfill existing rows with default decimals
UPDATE "earn_deposits"
SET "asset_decimals" = 6
WHERE "asset_decimals" IS NULL;

-- optional: keep default for future inserts (we will set explicitly in code but keeping default helps)

CREATE TABLE IF NOT EXISTS "earn_vault_apy_snapshots" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "vault_address" varchar(42) NOT NULL,
  "chain_id" integer NOT NULL,
  "apy_basis_points" integer NOT NULL,
  "source" text,
  "captured_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "earn_vault_apy_snapshots_vault_idx" ON "earn_vault_apy_snapshots" ("vault_address");
CREATE INDEX IF NOT EXISTS "earn_vault_apy_snapshots_vault_time_idx" ON "earn_vault_apy_snapshots" ("vault_address", "captured_at" DESC);
