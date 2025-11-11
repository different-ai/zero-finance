# Database Foreign Key Constraint Issue - Diagnosis Report

**Date:** October 8, 2025  
**Database:** Production (ep-spring-recipe-a44xpq2g-pooler.us-east-1.aws.neon.tech)  
**Affected Endpoint:** `/api/trpc/workspace.getOrCreateWorkspaceV2`

## Executive Summary

The production application is experiencing a **foreign key constraint violation** error when certain users attempt to access the application. The error occurs during user context creation in the tRPC API route handler.

### Error Message
```
error: insert or update on table "users" violates foreign key constraint "users_primary_workspace_id_workspaces_id_fk"
Detail: Key (primary_workspace_id)=(a7189b92-ba75-4160-8fa0-426bfe8fa33a) is not present in table "workspaces".
```

## Current Database State

### Statistics (as of diagnosis)
- **Total Users:** 179
- **Total Workspaces:** 179
- **Total Workspace Memberships:** 183
- **Users without primary_workspace_id:** 0
- **Users with INVALID primary_workspace_id:** 0

✅ **No existing foreign key constraint violations found in the database**

## Root Cause Analysis

The issue is **NOT a data corruption problem** but rather a **race condition** in the `ensureUserWorkspace` function during user creation.

### The Problem

Located in `/packages/web/src/server/utils/workspace.ts` (lines 186-252):

```typescript
if (!user) {
  // User doesn't exist yet, check for existing workspace membership
  const existingMembershipRows = await tx
    .select()
    .from(workspaceMembers)
    .where(eq(workspaceMembers.userId, userId))
    .orderBy(
      desc(workspaceMembers.isPrimary),
      desc(workspaceMembers.joinedAt),
    )
    .limit(1);

  const existingMembership = existingMembershipRows[0];
  let primaryWorkspaceId: string;

  if (existingMembership) {
    primaryWorkspaceId = existingMembership.workspaceId; // ⚠️ ISSUE HERE
    
    const inserted = await tx
      .insert(users)
      .values({ privyDid: userId, primaryWorkspaceId }) // ⚠️ FK violation if workspace doesn't exist
      .onConflictDoNothing()
      .returning();
    // ...
  }
}
```

### The Race Condition Scenario

1. **Step 1:** A workspace membership is created for a new user (e.g., through an invite system)
2. **Step 2:** The workspace that membership references is deleted (or was never properly created)
3. **Step 3:** New user tries to log in for the first time
4. **Step 4:** `ensureUserWorkspace` finds the orphaned membership
5. **Step 5:** Attempts to create user record with non-existent `primary_workspace_id`
6. **Step 6:** PostgreSQL foreign key constraint rejects the insert → **500 error**

### Why Current Database is Clean

The diagnosis shows no violations because:
- Successfully created users have valid workspace references
- Failed user creations **rolled back** the transaction (no partial data)
- The error prevents the bad data from being committed

### Affected User Example from Logs

```
User: did:privy:cmgiqkpg0001wl40cqhofcvo4
Invalid Workspace ID Referenced: a7189b92-ba75-4160-8fa0-426bfe8fa33a
```

This user likely has a workspace membership pointing to a deleted/non-existent workspace.

## Impact Assessment

### Severity: **HIGH**
- Users cannot access the application (500 error)
- Blocks onboarding for affected users
- Silent failure - no user-friendly error message

### Affected Users
- New users with orphaned workspace memberships
- Users whose workspaces were deleted but memberships remain
- Any user created through invite flows where workspace creation failed

## Recommended Fix Strategy

### Option 1: Defensive Validation (Recommended)

Modify `ensureUserWorkspace` to validate workspace existence before using it:

```typescript
if (existingMembership) {
  // ✅ VERIFY workspace exists before using it
  const workspaceExists = await tx
    .select()
    .from(workspaces)
    .where(eq(workspaces.id, existingMembership.workspaceId))
    .limit(1);

  if (workspaceExists.length > 0) {
    primaryWorkspaceId = existingMembership.workspaceId;
    // Proceed with user creation
  } else {
    // Orphaned membership detected - create new workspace instead
    const tempWorkspaceId = randomUUID();
    // Follow the "no membership" path
  }
}
```

### Option 2: Database Cleanup + Fix

1. **Cleanup orphaned memberships:**
   ```sql
   DELETE FROM workspace_members wm
   WHERE NOT EXISTS (
     SELECT 1 FROM workspaces w WHERE w.id = wm.workspace_id
   );
   ```

2. **Add defensive check** (same as Option 1)

### Option 3: Database Constraints Enhancement

Add `ON DELETE CASCADE` to workspace_members foreign key (requires migration):
```sql
ALTER TABLE workspace_members
DROP CONSTRAINT IF EXISTS workspace_members_workspace_id_workspaces_id_fk;

ALTER TABLE workspace_members
ADD CONSTRAINT workspace_members_workspace_id_workspaces_id_fk
  FOREIGN KEY (workspace_id) 
  REFERENCES workspaces(id) 
  ON DELETE CASCADE;
```

This would prevent orphaned memberships from existing in the first place.

## Proposed Fix (Combined Approach)

### Immediate Fix: Code Change

Location: `/packages/web/src/server/utils/workspace.ts:186-218`

Replace the problematic section with defensive validation:

```typescript
if (existingMembership) {
  // Validate that the workspace actually exists
  const workspaceRows = await tx
    .select()
    .from(workspaces)
    .where(eq(workspaces.id, existingMembership.workspaceId))
    .limit(1);

  if (workspaceRows.length > 0) {
    // Workspace exists - use it
    primaryWorkspaceId = existingMembership.workspaceId;
    
    const inserted = await tx
      .insert(users)
      .values({ privyDid: userId, primaryWorkspaceId })
      .onConflictDoNothing()
      .returning();
    
    // ... rest of logic
  } else {
    // Orphaned membership detected - clean it up and create new workspace
    console.warn(`Orphaned workspace membership detected for user ${userId}, workspace ${existingMembership.workspaceId}`);
    
    // Delete orphaned membership
    await tx
      .delete(workspaceMembers)
      .where(eq(workspaceMembers.id, existingMembership.id));
    
    // Follow the "no membership" code path
    const tempWorkspaceId = randomUUID();
    // ... existing code for creating new workspace
  }
} else {
  // No existing membership - create new workspace
  // ... existing code
}
```

### Follow-up: Database Cleanup Script

Create a maintenance script to identify and clean orphaned memberships:

```typescript
// scripts/cleanup-orphaned-memberships.ts
// Run periodically or as needed
```

## Verification Plan

1. **Apply code fix** to production
2. **Monitor logs** for "Orphaned workspace membership detected" warnings
3. **Track error rates** for workspace.getOrCreateWorkspaceV2
4. **Run cleanup script** if warnings appear
5. **Consider migration** to add CASCADE constraints for long-term prevention

## Prevention Measures

1. **Always create workspace before membership** in invite flows
2. **Use database transactions** for workspace + membership creation
3. **Add CASCADE constraints** on foreign keys
4. **Implement monitoring** for orphaned records
5. **Add unit tests** for edge cases in workspace creation

## Related Files

- `/packages/web/src/server/utils/workspace.ts` - Main issue location
- `/packages/web/src/app/api/trpc/[trpc]/route.ts` - Error occurs here
- `/packages/web/src/db/schema/workspaces.ts` - Schema definitions
- `/packages/web/src/db/schema/users.ts` - User schema with FK

## Next Steps

**Awaiting approval to:**
1. Create fix script for `workspace.ts`
2. Create cleanup script for orphaned memberships
3. Deploy to production
4. Monitor and verify fix

---

**Prepared by:** AI Assistant  
**Reviewed by:** _Pending_  
**Status:** Ready for Implementation

## Updated Findings (Post-Investigation)

### Orphaned Membership Check
✅ **No orphaned memberships found** in the current database state.

This confirms that the issue is happening **during the transaction** itself, not due to pre-existing bad data.

### The Real Problem: Race Condition in Transaction

The error occurs when:
1. User logs in for the first time (no user record exists)
2. System finds a workspace membership for that user
3. System attempts to use that membership's workspace_id for the new user record
4. **BUT** the workspace_id in that membership points to a workspace that doesn't exist
5. Transaction fails with FK constraint violation

### Key Insight

The workspace_members table has a foreign key to workspaces with `ON DELETE CASCADE`:

```typescript
workspaceId: uuid('workspace_id')
  .notNull()
  .references(() => workspaces.id, { onDelete: 'cascade' }),
```

This means when a workspace is deleted, all its memberships should be automatically deleted. However, the orphaned membership query returned 0 results, which means either:

1. **Concurrent deletion**: Workspace is being deleted in a separate transaction while user creation is happening
2. **Failed workspace creation**: Workspace creation failed but membership was created (shouldn't happen if using transactions correctly)
3. **Database replication lag**: In rare cases with read replicas

The most likely scenario is **concurrent transactions** where:
- Transaction A: User invite creates workspace membership
- Transaction B: Workspace gets deleted (admin action or cleanup)
- Transaction C: New user tries to log in, reads the membership (before CASCADE delete completes)
- Result: FK violation

### Additional Evidence Needed

To confirm, we should:
1. Check application logs for the specific user `did:privy:cmgiqkpg0001wl40cqhofcvo4`
2. Look for recent workspace deletions around the time of the error
3. Check if there's any code path that creates memberships without workspaces

