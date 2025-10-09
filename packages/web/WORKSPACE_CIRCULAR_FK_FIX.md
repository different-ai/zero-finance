# Workspace Circular Foreign Key Fix

## Problem

The `users` and `workspaces` tables had a circular foreign key dependency:

- `users.primary_workspace_id` → `workspaces.id`
- `workspaces.created_by` → `users.privy_did`

This caused a chicken-and-egg problem during user creation:

1. Cannot insert user without workspace existing (FK constraint violation)
2. Cannot insert workspace without user existing (FK constraint violation)

**Error:**

```
insert or update on table "workspaces" violates foreign key constraint
"workspaces_created_by_users_privy_did_fk"
```

## Solution

Made both foreign key constraints **DEFERRABLE INITIALLY DEFERRED** using migration `0111_make_workspace_fks_deferrable.sql`.

This allows both inserts to happen in any order within a transaction, and the FK constraints are only validated at COMMIT time.

### Migration Applied

```sql
ALTER TABLE "users"
  ADD CONSTRAINT "users_primary_workspace_id_workspaces_id_fk"
  FOREIGN KEY ("primary_workspace_id")
  REFERENCES "workspaces"("id")
  ON DELETE SET NULL
  DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE "workspaces"
  ADD CONSTRAINT "workspaces_created_by_users_privy_did_fk"
  FOREIGN KEY ("created_by")
  REFERENCES "users"("privy_did")
  ON DELETE CASCADE
  DEFERRABLE INITIALLY DEFERRED;
```

### Code Changes

Updated `packages/web/src/server/utils/workspace.ts` `ensureUserWorkspace()`:

- Check for existing workspace memberships first
- If membership exists, use that workspace ID
- If no membership, insert user and workspace in correct order within transaction
- Both inserts complete before COMMIT, satisfying both FK constraints

## Verification

### Constraint Verification

```bash
pnpm exec tsx scripts/verify-workspace-constraints.ts
```

**Expected output:**

```
✅ All constraints are DEFERRABLE INITIALLY DEFERRED - Circular dependency resolved!
```

### Manual Database Test

```bash
pnpm exec tsx scripts/test-workspace-creation.ts
```

Tests raw SQL inserts with circular FKs.

### Application Function Test

```bash
pnpm exec tsx scripts/test-ensure-user-workspace.ts
```

Tests the actual `ensureUserWorkspace()` function with a new user.

## Scripts Created

1. **verify-workspace-constraints.ts** - Checks if FK constraints are properly configured
2. **apply-deferrable-constraints.ts** - Manually applies the deferrable constraints (if migration didn't run)
3. **test-workspace-creation.ts** - Tests raw SQL user/workspace creation
4. **test-ensure-user-workspace.ts** - Tests the application function

## Database Migration Notes

If the migration didn't auto-apply (as happened during development), run:

```bash
pnpm exec tsx scripts/apply-deferrable-constraints.ts
```

This directly applies the SQL from the migration file.

## Key Takeaways

- **DEFERRABLE INITIALLY DEFERRED** constraints are essential for circular FK dependencies
- Constraints are checked at COMMIT time, not at each INSERT
- Both inserts must happen within the same transaction
- Verification scripts help ensure the fix is properly deployed
