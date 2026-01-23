CREATE TABLE IF NOT EXISTS "action_proposals" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_did" text NOT NULL REFERENCES "users"("privy_did") ON DELETE cascade,
  "workspace_id" uuid NOT NULL REFERENCES "workspaces"("id") ON DELETE cascade,
  "proposal_type" text NOT NULL,
  "status" text NOT NULL DEFAULT 'pending',
  "proposed_by_agent" boolean NOT NULL DEFAULT true,
  "proposal_message" text,
  "payload" jsonb NOT NULL,
  "tx_hash" text,
  "dismissed" boolean NOT NULL DEFAULT false,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "action_proposals_workspace_idx" ON "action_proposals" ("workspace_id");
CREATE INDEX IF NOT EXISTS "action_proposals_user_idx" ON "action_proposals" ("user_did");
CREATE INDEX IF NOT EXISTS "action_proposals_status_idx" ON "action_proposals" ("status");
CREATE INDEX IF NOT EXISTS "action_proposals_type_idx" ON "action_proposals" ("proposal_type");
CREATE INDEX IF NOT EXISTS "action_proposals_dismissed_idx" ON "action_proposals" ("dismissed");
