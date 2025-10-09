-- Fix workspace FK constraint inconsistency
-- Problem: users.primary_workspace_id is NOT NULL but FK has ON DELETE SET NULL
-- Solution: Change FK to ON DELETE NO ACTION to match NOT NULL constraint
-- This prevents workspaces from being deleted if users still reference them

ALTER TABLE "users" 
  DROP CONSTRAINT IF EXISTS "users_primary_workspace_id_workspaces_id_fk";

ALTER TABLE "users"
  ADD CONSTRAINT "users_primary_workspace_id_workspaces_id_fk"
  FOREIGN KEY ("primary_workspace_id") 
  REFERENCES "workspaces"("id") 
  ON DELETE NO ACTION
  ON UPDATE NO ACTION
  DEFERRABLE INITIALLY DEFERRED;
