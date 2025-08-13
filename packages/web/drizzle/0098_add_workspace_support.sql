-- Create workspaces table
CREATE TABLE IF NOT EXISTS "workspaces" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" varchar(255) NOT NULL,
  "created_by" varchar(255) NOT NULL REFERENCES "users"("privy_did") ON DELETE CASCADE,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

-- Create workspace_members table
CREATE TABLE IF NOT EXISTS "workspace_members" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "workspace_id" uuid NOT NULL REFERENCES "workspaces"("id") ON DELETE CASCADE,
  "user_id" varchar(255) NOT NULL REFERENCES "users"("privy_did") ON DELETE CASCADE,
  "role" varchar(50) NOT NULL DEFAULT 'member', -- 'owner', 'admin', 'member'
  "joined_at" timestamp with time zone DEFAULT now(),
  UNIQUE("workspace_id", "user_id")
);

-- Add workspace support to inbox_cards
ALTER TABLE "inbox_cards" 
ADD COLUMN IF NOT EXISTS "workspace_id" uuid REFERENCES "workspaces"("id"),
ADD COLUMN IF NOT EXISTS "paid_by" varchar(255) REFERENCES "users"("privy_did"),
ADD COLUMN IF NOT EXISTS "paid_for" text[], -- Array of user IDs this expense is for
ADD COLUMN IF NOT EXISTS "split_type" varchar(50) DEFAULT 'equal', -- 'equal', 'custom', 'full'
ADD COLUMN IF NOT EXISTS "split_amounts" jsonb; -- Custom split amounts if needed

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "workspaces_created_by_idx" ON "workspaces"("created_by");
CREATE INDEX IF NOT EXISTS "workspace_members_workspace_id_idx" ON "workspace_members"("workspace_id");
CREATE INDEX IF NOT EXISTS "workspace_members_user_id_idx" ON "workspace_members"("user_id");
CREATE INDEX IF NOT EXISTS "inbox_cards_workspace_id_idx" ON "inbox_cards"("workspace_id");
CREATE INDEX IF NOT EXISTS "inbox_cards_paid_by_idx" ON "inbox_cards"("paid_by");