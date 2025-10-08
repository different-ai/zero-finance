-- Migration: Copy KYC data from users to workspaces and ensure all users have workspaces
-- This populates the workspace financial context with existing user data
-- Phase 2: Data migration - no deletions, purely copying data

-- Step 1: Copy KYC data from workspace owners (created_by) to their workspaces
-- Only update if user has KYC data (align_customer_id is not null)
UPDATE "workspaces" w
SET 
  "align_customer_id" = u.align_customer_id,
  "kyc_provider" = u.kyc_provider,
  "kyc_status" = COALESCE(u.kyc_status, 'none'),
  "kyc_flow_link" = u.kyc_flow_link,
  "kyc_sub_status" = u.kyc_sub_status,
  "kyc_marked_done" = COALESCE(u.kyc_marked_done, false),
  "kyc_notification_sent" = u.kyc_notification_sent,
  "kyc_notification_status" = u.kyc_notification_status,
  "align_virtual_account_id" = u.align_virtual_account_id,
  "beneficiary_type" = u.beneficiary_type,
  "company_name" = u.company_name,
  "first_name" = u.first_name,
  "last_name" = u.last_name,
  "workspace_type" = CASE 
    WHEN u.beneficiary_type = 'individual' THEN 'personal'
    WHEN u.beneficiary_type = 'business' THEN 'business'
    ELSE 'business'
  END
FROM "users" u
WHERE w.created_by = u.privy_did
  AND u.align_customer_id IS NOT NULL
  AND w.align_customer_id IS NULL; -- Only update if not already set

-- Step 2: Create default workspace for users who don't have one
-- This ensures every user has at least one workspace they own
WITH users_without_workspace AS (
  SELECT 
    u.privy_did, 
    u.first_name, 
    u.last_name, 
    u.company_name,
    u.align_customer_id,
    u.kyc_provider,
    u.kyc_status,
    u.kyc_flow_link,
    u.kyc_sub_status,
    u.kyc_marked_done,
    u.kyc_notification_sent,
    u.kyc_notification_status,
    u.align_virtual_account_id,
    u.beneficiary_type
  FROM "users" u
  LEFT JOIN "workspace_members" wm ON wm.user_id = u.privy_did
  WHERE wm.id IS NULL
),
inserted_workspaces AS (
  INSERT INTO "workspaces" (
    name, 
    created_by,
    align_customer_id,
    kyc_provider,
    kyc_status,
    kyc_flow_link,
    kyc_sub_status,
    kyc_marked_done,
    kyc_notification_sent,
    kyc_notification_status,
    align_virtual_account_id,
    beneficiary_type,
    company_name,
    first_name,
    last_name,
    workspace_type
  )
  SELECT 
    COALESCE(
      NULLIF(company_name, ''),
      CONCAT(COALESCE(first_name, 'User'), '''s Workspace')
    ) as name,
    privy_did as created_by,
    align_customer_id,
    kyc_provider,
    COALESCE(kyc_status, 'none'),
    kyc_flow_link,
    kyc_sub_status,
    COALESCE(kyc_marked_done, false),
    kyc_notification_sent,
    kyc_notification_status,
    align_virtual_account_id,
    beneficiary_type,
    company_name,
    first_name,
    last_name,
    CASE 
      WHEN beneficiary_type = 'individual' THEN 'personal'
      WHEN beneficiary_type = 'business' THEN 'business'
      ELSE 'business'
    END as workspace_type
  FROM users_without_workspace
  RETURNING id, created_by
)
-- Step 3: Add workspace membership for newly created workspaces
INSERT INTO "workspace_members" (workspace_id, user_id, role, is_primary)
SELECT id, created_by, 'owner', true
FROM inserted_workspaces;

-- Step 4: Set primary_workspace_id for users who don't have one
-- First, set it to the workspace they own (created_by)
UPDATE "users" u
SET primary_workspace_id = (
  SELECT w.id 
  FROM "workspaces" w
  WHERE w.created_by = u.privy_did
  LIMIT 1
)
WHERE u.primary_workspace_id IS NULL
  AND EXISTS (SELECT 1 FROM "workspaces" w WHERE w.created_by = u.privy_did);

-- Fallback: Set primary_workspace_id to first workspace they're a member of
UPDATE "users" u
SET primary_workspace_id = (
  SELECT wm.workspace_id
  FROM "workspace_members" wm
  WHERE wm.user_id = u.privy_did
  ORDER BY wm.joined_at ASC
  LIMIT 1
)
WHERE u.primary_workspace_id IS NULL;

-- Step 5: Link financial data to workspaces
-- Update user_funding_sources to link to user's primary workspace
UPDATE "user_funding_sources" ufs
SET workspace_id = u.primary_workspace_id
FROM "users" u
WHERE ufs.user_privy_did = u.privy_did
  AND ufs.workspace_id IS NULL
  AND u.primary_workspace_id IS NOT NULL;

-- Update user_destination_bank_accounts to link to workspace
UPDATE "user_destination_bank_accounts" udba
SET workspace_id = u.primary_workspace_id
FROM "users" u
WHERE udba.user_id = u.privy_did
  AND udba.workspace_id IS NULL
  AND u.primary_workspace_id IS NOT NULL;

-- Update offramp_transfers to link to workspace
UPDATE "offramp_transfers" ot
SET workspace_id = u.primary_workspace_id
FROM "users" u
WHERE ot.user_id = u.privy_did
  AND ot.workspace_id IS NULL
  AND u.primary_workspace_id IS NOT NULL;

-- Update onramp_transfers to link to workspace
UPDATE "onramp_transfers" ont
SET workspace_id = u.primary_workspace_id
FROM "users" u
WHERE ont.user_id = u.privy_did
  AND ont.workspace_id IS NULL
  AND u.primary_workspace_id IS NOT NULL;

-- Update user_safes to link to workspace
UPDATE "user_safes" us
SET workspace_id = u.primary_workspace_id
FROM "users" u
WHERE us.user_did = u.privy_did
  AND us.workspace_id IS NULL
  AND u.primary_workspace_id IS NOT NULL;

-- Step 6: Make primary_workspace_id NOT NULL
-- All users should now have a workspace
ALTER TABLE "users" ALTER COLUMN "primary_workspace_id" SET NOT NULL;

-- Step 7: Make workspace_id NOT NULL for user_safes
-- All safes should now be linked to a workspace
ALTER TABLE "user_safes" ALTER COLUMN "workspace_id" SET NOT NULL;
