-- Make foreign key constraints deferrable to handle circular dependencies during user/workspace creation
-- This allows us to insert user and workspace in a single transaction without violating FK constraints

ALTER TABLE "users" 
  DROP CONSTRAINT IF EXISTS "users_primary_workspace_id_workspaces_id_fk";

ALTER TABLE "users"
  ADD CONSTRAINT "users_primary_workspace_id_workspaces_id_fk"
  FOREIGN KEY ("primary_workspace_id") 
  REFERENCES "workspaces"("id") 
  ON DELETE SET NULL
  DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE "workspaces"
  DROP CONSTRAINT IF EXISTS "workspaces_created_by_users_privy_did_fk";

ALTER TABLE "workspaces"
  ADD CONSTRAINT "workspaces_created_by_users_privy_did_fk"
  FOREIGN KEY ("created_by")
  REFERENCES "users"("privy_did")
  ON DELETE CASCADE
  DEFERRABLE INITIALLY DEFERRED;
