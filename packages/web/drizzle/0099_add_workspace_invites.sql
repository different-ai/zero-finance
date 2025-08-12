-- Create workspace invites table for team collaboration
CREATE TABLE IF NOT EXISTS "workspace_invites" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "workspace_id" uuid NOT NULL REFERENCES "workspaces"("id") ON DELETE CASCADE,
  "company_id" uuid REFERENCES "companies"("id"),
  "token" varchar(255) UNIQUE NOT NULL,
  "created_by" varchar(255) NOT NULL REFERENCES "users"("privy_did"),
  "email" varchar(255),
  "role" varchar(50) DEFAULT 'member',
  "share_inbox" boolean DEFAULT true,
  "share_company_data" boolean DEFAULT true,
  "expires_at" timestamp with time zone,
  "used_at" timestamp with time zone,
  "used_by" varchar(255) REFERENCES "users"("privy_did"),
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Create extended permissions for workspace members
CREATE TABLE IF NOT EXISTS "workspace_members_extended" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "member_id" uuid NOT NULL REFERENCES "workspace_members"("id") ON DELETE CASCADE,
  "can_view_inbox" boolean DEFAULT true,
  "can_edit_expenses" boolean DEFAULT false,
  "can_view_company_data" boolean DEFAULT true
);

-- Create indexes for performance
CREATE UNIQUE INDEX IF NOT EXISTS "workspace_invites_token_idx" ON "workspace_invites"("token");
CREATE INDEX IF NOT EXISTS "workspace_invites_workspace_idx" ON "workspace_invites"("workspace_id");
CREATE INDEX IF NOT EXISTS "workspace_invites_created_by_idx" ON "workspace_invites"("created_by");

-- Add company link to workspaces if not exists
ALTER TABLE "workspaces" ADD COLUMN IF NOT EXISTS "company_id" uuid REFERENCES "companies"("id");
ALTER TABLE "workspaces" ADD COLUMN IF NOT EXISTS "share_inbox" boolean DEFAULT true;
ALTER TABLE "workspaces" ADD COLUMN IF NOT EXISTS "share_company_data" boolean DEFAULT true;
