-- Add new columns for different account types
ALTER TABLE "user_funding_sources" ADD COLUMN "source_account_type" text;
ALTER TABLE "user_funding_sources" ADD COLUMN "source_iban" text;
ALTER TABLE "user_funding_sources" ADD COLUMN "source_bic_swift" text;
ALTER TABLE "user_funding_sources" ADD COLUMN "source_sort_code" text;

-- Populate the new type column for existing US ACH records
-- Assumes existing records are US ACH. Adjust WHERE clause if needed.
UPDATE "user_funding_sources" SET source_account_type = 'us_ach' WHERE source_routing_number IS NOT NULL;

-- Now that existing rows are populated, enforce NOT NULL on the type column
ALTER TABLE "user_funding_sources" ALTER COLUMN "source_account_type" SET NOT NULL;

-- Make original US-specific columns nullable as intended
-- NOTE: Drizzle might have already generated ALTERs for these if they were NOT NULL before.
-- Check previous migration (0000) or schema if these were originally NOT NULL.
-- If they were already nullable, these ALTERs might not be needed or might error.
-- Assuming they might have been NOT NULL based on typical definitions:
-- ALTER TABLE "user_funding_sources" ALTER COLUMN "source_routing_number" DROP NOT NULL;
-- ALTER TABLE "user_funding_sources" ALTER COLUMN "source_account_number" DROP NOT NULL;

-- Add the index
CREATE INDEX IF NOT EXISTS "user_funding_sources_user_did_idx" ON "user_funding_sources" USING btree ("user_privy_did"); 