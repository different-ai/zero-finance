# Database Foreign Key Constraint Issue - FINAL DIAGNOSIS

**Date:** October 8, 2025  
**Status:** 🔴 **CRITICAL - Root Cause Identified**

## The Smoking Gun

### Database Constraint Conflict

The `users` table has a **schema inconsistency**:

```
Column: users.primary_workspace_id
- Data Type: uuid
- Nullable: NO  ← Column does NOT allow NULL
- FK Constraint: users_primary_workspace_id_workspaces_id_fk
  - ON DELETE: SET NULL  ← But FK tries to SET NULL on delete!
```

### The Problem

1. **Schema Definition** (`packages/web/src/db/schema/users.ts:48`):
   ```typescript
   primaryWorkspaceId: uuid('primary_workspace_id').notNull(),
   ```
   Declares the column as NOT NULL.

2. **Foreign Key Constraint** (in database):
   ```sql
   CONSTRAINT users_primary_workspace_id_workspaces_id_fk
   FOREIGN KEY (primary_workspace_id)
   REFERENCES workspaces(id)
   ON DELETE SET NULL  ← Tries to set NULL on workspace deletion
   ```

3. **The Conflict**:
   - Column cannot be NULL (NOT NULL constraint)
   - FK wants to SET NULL when workspace is deleted
   - **Result:** Impossible state = errors

### How This Causes the Error

**Scenario 1: Workspace Deletion**
When a workspace is deleted:
1. PostgreSQL tries to `SET NULL` on `users.primary_workspace_id`
2. Column doesn't allow NULL → **ERROR**
3. Transaction rolls back
4. Result: Workspace can't be deleted if users reference it

**Scenario 2: User Creation with Invalid Workspace**
During `ensureUserWorkspace`:
1. Finds a membership with `workspace_id = 'xxx'`
2. Tries to create user with `primary_workspace_id = 'xxx'`
3. But workspace 'xxx' doesn't exist → **FK VIOLATION**
4. Transaction fails with the error we're seeing

## Root Causes

### 1. Schema Inconsistency
The schema was likely migrated/changed without updating the FK constraint, or vice versa.

### 2. Missing Validation in `ensureUserWorkspace`
File: `packages/web/src/server/utils/workspace.ts:186-218`

The code assumes if a membership exists, its workspace exists:
```typescript
if (existingMembership) {
  primaryWorkspaceId = existingMembership.workspaceId; // ← No validation!
  
  const inserted = await tx
    .insert(users)
    .values({ privyDid: userId, primaryWorkspaceId }) // ← Can fail if workspace doesn't exist
```

No check to verify the workspace actually exists before using its ID.

## Complete Fix Strategy

### Fix 1: Update Foreign Key Constraint (Database Migration)

Change the FK constraint from `SET NULL` to match the NOT NULL requirement.

**Option A: Prevent Deletion** (Recommended)
```sql
-- Drop existing constraint
ALTER TABLE users 
DROP CONSTRAINT users_primary_workspace_id_workspaces_id_fk;

-- Add new constraint with NO ACTION (prevent workspace deletion if users reference it)
ALTER TABLE users
ADD CONSTRAINT users_primary_workspace_id_workspaces_id_fk
  FOREIGN KEY (primary_workspace_id)
  REFERENCES workspaces(id)
  ON DELETE NO ACTION;
```

This prevents workspaces from being deleted if users still reference them as primary.

**Option B: Allow NULL** (Alternative)
```sql
-- Allow the column to be NULL
ALTER TABLE users
ALTER COLUMN primary_workspace_id DROP NOT NULL;
```

Then update schema:
```typescript
primaryWorkspaceId: uuid('primary_workspace_id'), // Remove .notNull()
```

### Fix 2: Add Defensive Validation (Code Change)

File: `packages/web/src/server/utils/workspace.ts:186-218`

```typescript
if (existingMembership) {
  // ✅ CRITICAL: Verify workspace exists before using it
  const workspaceRows = await tx
    .select()
    .from(workspaces)
    .where(eq(workspaces.id, existingMembership.workspaceId))
    .limit(1);

  if (workspaceRows.length > 0) {
    // Workspace exists - safe to use
    primaryWorkspaceId = existingMembership.workspaceId;
    
    const inserted = await tx
      .insert(users)
      .values({ privyDid: userId, primaryWorkspaceId })
      .onConflictDoNothing()
      .returning();
    
    // ... existing logic
  } else {
    // Orphaned membership - workspace doesn't exist
    console.warn(
      `[ensureUserWorkspace] Orphaned membership detected for user ${userId}, ` +
      `workspace ${existingMembership.workspaceId} does not exist. Creating new workspace.`
    );
    
    // Delete the orphaned membership
    await tx
      .delete(workspaceMembers)
      .where(eq(workspaceMembers.id, existingMembership.id));
    
    // Fall through to create new workspace
    const tempWorkspaceId = randomUUID();
    // ... follow the "no membership" path
  }
}
```

## Recommended Implementation Plan

### Phase 1: Immediate Code Fix (Emergency)
1. ✅ Deploy defensive validation to `ensureUserWorkspace` **immediately**
2. This prevents the error from occurring even if data inconsistencies exist
3. Adds logging to detect when orphaned memberships are found

### Phase 2: Database Migration (Scheduled)
1. Create Drizzle migration to update FK constraint
2. Choose between Option A (NO ACTION) or Option B (ALLOW NULL)
3. Test in staging environment
4. Deploy to production during maintenance window

### Phase 3: Prevention (Long-term)
1. Add database integrity checks to CI/CD
2. Implement workspace deletion guards (prevent deletion if users reference it)
3. Add unit tests for workspace creation/deletion edge cases
4. Consider adding a migration validator that checks FK constraint consistency

## Migration Scripts

### Emergency Code Fix
```bash
# Edit packages/web/src/server/utils/workspace.ts
# Apply the defensive validation code above
# Deploy immediately
```

### Database Migration (Option A - Recommended)
```typescript
// File: packages/web/drizzle/XXXX_fix_workspace_fk.sql
-- Update FK constraint to prevent orphaning
ALTER TABLE users 
DROP CONSTRAINT IF EXISTS users_primary_workspace_id_workspaces_id_fk;

ALTER TABLE users
ADD CONSTRAINT users_primary_workspace_id_workspaces_id_fk
  FOREIGN KEY (primary_workspace_id)
  REFERENCES workspaces(id)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;
```

### Database Migration (Option B - Allow NULL)
```typescript
// File: packages/web/drizzle/XXXX_allow_null_primary_workspace.sql
-- Allow NULL in primary_workspace_id
ALTER TABLE users
ALTER COLUMN primary_workspace_id DROP NOT NULL;

-- Update FK to SET NULL on delete (now it will work)
ALTER TABLE users 
DROP CONSTRAINT IF EXISTS users_primary_workspace_id_workspaces_id_fk;

ALTER TABLE users
ADD CONSTRAINT users_primary_workspace_id_workspaces_id_fk
  FOREIGN KEY (primary_workspace_id)
  REFERENCES workspaces(id)
  ON DELETE SET NULL
  ON UPDATE NO ACTION;
```

## Impact Analysis

### Current State
- **Users affected:** Users with orphaned workspace memberships
- **Error rate:** Unknown (no metrics on frequency)
- **Severity:** 🔴 Critical - users cannot log in

### After Code Fix Only
- **Error prevented:** ✅ Users can log in
- **Data cleaned:** ✅ Orphaned memberships auto-deleted on encounter
- **Logging added:** ✅ Can track frequency of issue

### After Code Fix + Migration
- **Schema consistent:** ✅ FK constraint matches column constraints
- **Future prevention:** ✅ Database enforces referential integrity correctly
- **Performance:** No change

## Testing Checklist

### Before Deployment
- [ ] Code review of defensive validation
- [ ] Unit tests for orphaned membership scenario
- [ ] Integration test for workspace deletion
- [ ] Load test for concurrent user creation

### After Code Deployment
- [ ] Monitor logs for orphaned membership warnings
- [ ] Check error rates on workspace creation endpoint
- [ ] Verify no new FK violations in error logs

### After Database Migration
- [ ] Verify FK constraint updated correctly
- [ ] Test workspace deletion (should prevent if users reference it)
- [ ] Test user creation with non-existent workspace (should fail gracefully)
- [ ] Verify existing users unaffected

## Approval Required

**Immediate Action (Code Fix):**
- ✅ Ready to implement
- Low risk, high reward
- Can deploy without database changes
- **Recommendation:** Deploy ASAP

**Database Migration:**
- ⚠️  Requires testing in staging
- Medium risk (schema change)
- Should be scheduled maintenance window
- **Recommendation:** Plan for next maintenance window

---

**Status:** Awaiting approval for immediate code deployment  
**Next Update:** After deployment of defensive validation
