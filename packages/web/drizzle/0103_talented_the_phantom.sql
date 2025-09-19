-- Phase 2: establish primary workspace linkage and backfill workspace_id columns
ALTER TABLE "users" ADD COLUMN "primary_workspace_id" uuid;
ALTER TABLE "users"
  ADD CONSTRAINT "users_primary_workspace_id_workspaces_id_fk"
  FOREIGN KEY ("primary_workspace_id") REFERENCES "workspaces"("id") ON DELETE SET NULL;
CREATE INDEX "users_primary_workspace_idx" ON "users" ("primary_workspace_id");

-- Ensure every user is represented in the workspace tables
WITH missing_users AS (
  SELECT
    u.privy_did,
    COALESCE(
      NULLIF(TRIM(COALESCE(u.company_name, CONCAT_WS(' ', u.first_name, u.last_name))), ''),
      'Workspace ' || LEFT(u.privy_did, 8)
    ) AS ws_name
  FROM users u
  WHERE NOT EXISTS (
    SELECT 1 FROM workspace_members wm WHERE wm.user_id = u.privy_did
  )
),
created_workspaces AS (
  INSERT INTO workspaces (id, name, created_by)
  SELECT gen_random_uuid(), ws_name, privy_did
  FROM missing_users
  RETURNING id, created_by
)
INSERT INTO workspace_members (id, workspace_id, user_id, role, joined_at, is_primary)
SELECT gen_random_uuid(), cw.id, cw.created_by, 'owner', NOW(), true
FROM created_workspaces cw;

-- Normalize is_primary flags so that each user has a single primary workspace
WITH ranked_members AS (
  SELECT
    wm.id,
    ROW_NUMBER() OVER (
      PARTITION BY wm.user_id
      ORDER BY CASE WHEN wm.role = 'owner' THEN 0 ELSE 1 END, wm.joined_at, wm.id
    ) AS rn
  FROM workspace_members wm
)
UPDATE workspace_members wm
SET is_primary = (ranked_members.rn = 1)
FROM ranked_members
WHERE wm.id = ranked_members.id;

-- Populate users.primary_workspace_id
WITH primary_members AS (
  SELECT user_id, workspace_id
  FROM workspace_members
  WHERE is_primary = true
)
UPDATE users u
SET primary_workspace_id = pm.workspace_id
FROM primary_members pm
WHERE u.privy_did = pm.user_id;

-- Fallback: handle any users still lacking a primary workspace after normalization
WITH fallback AS (
  SELECT DISTINCT ON (u.privy_did)
    u.privy_did,
    wm.workspace_id
  FROM users u
  JOIN workspace_members wm ON wm.user_id = u.privy_did
  WHERE u.primary_workspace_id IS NULL
  ORDER BY u.privy_did, CASE WHEN wm.role = 'owner' THEN 0 ELSE 1 END, wm.joined_at, wm.id
)
UPDATE users u
SET primary_workspace_id = fallback.workspace_id
FROM fallback
WHERE u.privy_did = fallback.privy_did;

-- Convenience CTE for reuse in backfill statements
WITH user_workspace AS (
  SELECT privy_did, primary_workspace_id
  FROM users
  WHERE primary_workspace_id IS NOT NULL
)
UPDATE user_wallets uw
SET workspace_id = uw_map.primary_workspace_id
FROM user_workspace uw_map
WHERE uw.workspace_id IS NULL AND uw.user_id = uw_map.privy_did;

WITH user_workspace AS (
  SELECT privy_did, primary_workspace_id
  FROM users
  WHERE primary_workspace_id IS NOT NULL
)
UPDATE user_profiles up
SET workspace_id = uw_map.primary_workspace_id
FROM user_workspace uw_map
WHERE up.workspace_id IS NULL AND up.privy_did = uw_map.privy_did;

WITH user_workspace AS (
  SELECT privy_did, primary_workspace_id
  FROM users
  WHERE primary_workspace_id IS NOT NULL
)
UPDATE user_requests ur
SET workspace_id = uw_map.primary_workspace_id
FROM user_workspace uw_map
WHERE ur.workspace_id IS NULL AND ur.user_id = uw_map.privy_did;

WITH user_workspace AS (
  SELECT privy_did, primary_workspace_id
  FROM users
  WHERE primary_workspace_id IS NOT NULL
)
UPDATE user_safes us
SET workspace_id = uw_map.primary_workspace_id
FROM user_workspace uw_map
WHERE us.workspace_id IS NULL AND us.user_did = uw_map.privy_did;

WITH user_workspace AS (
  SELECT privy_did, primary_workspace_id
  FROM users
  WHERE primary_workspace_id IS NOT NULL
)
UPDATE user_funding_sources ufs
SET workspace_id = uw_map.primary_workspace_id
FROM user_workspace uw_map
WHERE ufs.workspace_id IS NULL AND ufs.user_privy_did = uw_map.privy_did;

WITH user_workspace AS (
  SELECT privy_did, primary_workspace_id
  FROM users
  WHERE primary_workspace_id IS NOT NULL
)
UPDATE user_destination_bank_accounts udba
SET workspace_id = uw_map.primary_workspace_id
FROM user_workspace uw_map
WHERE udba.workspace_id IS NULL AND udba.user_id = uw_map.privy_did;

WITH user_workspace AS (
  SELECT privy_did, primary_workspace_id
  FROM users
  WHERE primary_workspace_id IS NOT NULL
)
UPDATE allocation_strategies als
SET workspace_id = uw_map.primary_workspace_id
FROM user_workspace uw_map
WHERE als.workspace_id IS NULL AND als.user_did = uw_map.privy_did;

WITH user_workspace AS (
  SELECT privy_did, primary_workspace_id
  FROM users
  WHERE primary_workspace_id IS NOT NULL
)
UPDATE offramp_transfers ot
SET workspace_id = uw_map.primary_workspace_id
FROM user_workspace uw_map
WHERE ot.workspace_id IS NULL AND ot.user_id = uw_map.privy_did;

WITH user_workspace AS (
  SELECT privy_did, primary_workspace_id
  FROM users
  WHERE primary_workspace_id IS NOT NULL
)
UPDATE onramp_transfers ont
SET workspace_id = uw_map.primary_workspace_id
FROM user_workspace uw_map
WHERE ont.workspace_id IS NULL AND ont.user_id = uw_map.privy_did;

WITH user_workspace AS (
  SELECT privy_did, primary_workspace_id
  FROM users
  WHERE primary_workspace_id IS NOT NULL
)
UPDATE earn_deposits ed
SET workspace_id = uw_map.primary_workspace_id
FROM user_workspace uw_map
WHERE ed.workspace_id IS NULL AND ed.user_did = uw_map.privy_did;

WITH user_workspace AS (
  SELECT privy_did, primary_workspace_id
  FROM users
  WHERE primary_workspace_id IS NOT NULL
)
UPDATE earn_withdrawals ew
SET workspace_id = uw_map.primary_workspace_id
FROM user_workspace uw_map
WHERE ew.workspace_id IS NULL AND ew.user_did = uw_map.privy_did;

WITH user_workspace AS (
  SELECT privy_did, primary_workspace_id
  FROM users
  WHERE primary_workspace_id IS NOT NULL
)
UPDATE incoming_deposits id
SET workspace_id = uw_map.primary_workspace_id
FROM user_workspace uw_map
WHERE id.workspace_id IS NULL AND id.user_did = uw_map.privy_did;

WITH user_workspace AS (
  SELECT privy_did, primary_workspace_id
  FROM users
  WHERE primary_workspace_id IS NOT NULL
)
UPDATE auto_earn_configs aec
SET workspace_id = uw_map.primary_workspace_id
FROM user_workspace uw_map
WHERE aec.workspace_id IS NULL AND aec.user_did = uw_map.privy_did;

WITH user_workspace AS (
  SELECT privy_did, primary_workspace_id
  FROM users
  WHERE primary_workspace_id IS NOT NULL
)
UPDATE inbox_cards ic
SET workspace_id = uw_map.primary_workspace_id
FROM user_workspace uw_map
WHERE ic.workspace_id IS NULL AND ic.user_id = uw_map.privy_did;

WITH user_workspace AS (
  SELECT privy_did, primary_workspace_id
  FROM users
  WHERE primary_workspace_id IS NOT NULL
)
UPDATE action_ledger al
SET workspace_id = uw_map.primary_workspace_id
FROM user_workspace uw_map
WHERE al.workspace_id IS NULL AND al.approved_by = uw_map.privy_did;

WITH user_workspace AS (
  SELECT privy_did, primary_workspace_id
  FROM users
  WHERE primary_workspace_id IS NOT NULL
)
UPDATE chats c
SET workspace_id = uw_map.primary_workspace_id
FROM user_workspace uw_map
WHERE c.workspace_id IS NULL AND c.user_id = uw_map.privy_did;

WITH user_workspace AS (
  SELECT privy_did, primary_workspace_id
  FROM users
  WHERE primary_workspace_id IS NOT NULL
)
UPDATE gmail_oauth_tokens got
SET workspace_id = uw_map.primary_workspace_id
FROM user_workspace uw_map
WHERE got.workspace_id IS NULL AND got.user_privy_did = uw_map.privy_did;

WITH user_workspace AS (
  SELECT privy_did, primary_workspace_id
  FROM users
  WHERE primary_workspace_id IS NOT NULL
)
UPDATE oauth_states os
SET workspace_id = uw_map.primary_workspace_id
FROM user_workspace uw_map
WHERE os.workspace_id IS NULL AND os.user_privy_did = uw_map.privy_did;

WITH user_workspace AS (
  SELECT privy_did, primary_workspace_id
  FROM users
  WHERE primary_workspace_id IS NOT NULL
)
UPDATE gmail_sync_jobs gsj
SET workspace_id = uw_map.primary_workspace_id
FROM user_workspace uw_map
WHERE gsj.workspace_id IS NULL AND gsj.user_id = uw_map.privy_did;

WITH user_workspace AS (
  SELECT privy_did, primary_workspace_id
  FROM users
  WHERE primary_workspace_id IS NOT NULL
)
UPDATE gmail_processing_prefs gpp
SET workspace_id = uw_map.primary_workspace_id
FROM user_workspace uw_map
WHERE gpp.workspace_id IS NULL AND gpp.user_id = uw_map.privy_did;

WITH user_workspace AS (
  SELECT privy_did, primary_workspace_id
  FROM users
  WHERE primary_workspace_id IS NOT NULL
)
UPDATE user_classification_settings ucs
SET workspace_id = uw_map.primary_workspace_id
FROM user_workspace uw_map
WHERE ucs.workspace_id IS NULL AND ucs.user_id = uw_map.privy_did;

WITH user_workspace AS (
  SELECT privy_did, primary_workspace_id
  FROM users
  WHERE primary_workspace_id IS NOT NULL
)
UPDATE user_features uf
SET workspace_id = uw_map.primary_workspace_id
FROM user_workspace uw_map
WHERE uf.workspace_id IS NULL AND uf.user_privy_did = uw_map.privy_did;

WITH user_workspace AS (
  SELECT privy_did, primary_workspace_id
  FROM users
  WHERE primary_workspace_id IS NOT NULL
)
UPDATE invoice_templates it
SET workspace_id = uw_map.primary_workspace_id
FROM user_workspace uw_map
WHERE it.workspace_id IS NULL AND it.user_privy_did = uw_map.privy_did;

WITH user_workspace AS (
  SELECT privy_did, primary_workspace_id
  FROM users
  WHERE primary_workspace_id IS NOT NULL
)
UPDATE user_invoice_preferences uip
SET workspace_id = uw_map.primary_workspace_id
FROM user_workspace uw_map
WHERE uip.workspace_id IS NULL AND uip.user_privy_did = uw_map.privy_did;

WITH user_workspace AS (
  SELECT privy_did, primary_workspace_id
  FROM users
  WHERE primary_workspace_id IS NOT NULL
)
UPDATE card_actions ca
SET workspace_id = uw_map.primary_workspace_id
FROM user_workspace uw_map
WHERE ca.workspace_id IS NULL AND ca.user_id = uw_map.privy_did;

-- Company-scoped tables leverage the owner's workspace
UPDATE companies c
SET workspace_id = uw_map.primary_workspace_id
FROM (
  SELECT privy_did, primary_workspace_id
  FROM users
  WHERE primary_workspace_id IS NOT NULL
) AS uw_map
WHERE c.workspace_id IS NULL AND c.owner_privy_did = uw_map.privy_did;

UPDATE company_members cm
SET workspace_id = c.workspace_id
FROM companies c
WHERE cm.workspace_id IS NULL AND cm.company_id = c.id AND c.workspace_id IS NOT NULL;

UPDATE shared_company_data scd
SET workspace_id = c.workspace_id
FROM companies c
WHERE scd.workspace_id IS NULL AND scd.company_id = c.id AND c.workspace_id IS NOT NULL;

WITH user_workspace AS (
  SELECT privy_did, primary_workspace_id
  FROM users
  WHERE primary_workspace_id IS NOT NULL
)
UPDATE company_clients cc
SET workspace_id = uw_map.primary_workspace_id
FROM user_workspace uw_map
WHERE cc.workspace_id IS NULL AND cc.user_privy_did = uw_map.privy_did;

UPDATE company_invite_links cil
SET workspace_id = c.workspace_id
FROM companies c
WHERE cil.workspace_id IS NULL AND cil.company_id = c.id AND c.workspace_id IS NOT NULL;

-- Fallbacks for user requests that rely on company context
UPDATE user_requests ur
SET workspace_id = sender.workspace_id
FROM companies sender
WHERE ur.workspace_id IS NULL AND ur.sender_company_id = sender.id AND sender.workspace_id IS NOT NULL;

UPDATE user_requests ur
SET workspace_id = recipient.workspace_id
FROM companies recipient
WHERE ur.workspace_id IS NULL AND ur.recipient_company_id = recipient.id AND recipient.workspace_id IS NOT NULL;

UPDATE user_requests ur
SET workspace_id = company.workspace_id
FROM companies company
WHERE ur.workspace_id IS NULL AND ur.company_id = company.id AND company.workspace_id IS NOT NULL;
