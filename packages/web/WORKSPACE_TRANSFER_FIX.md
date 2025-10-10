# Bank Transfers Workspace Fix

## Problem

Bank transfers were not showing up in the UI because of a **mismatch between how transfers are fetched and how they're queried**.

### Root Cause

The code had three different concepts mixed together:

1. **Align Customer ID** (which account to fetch from Align API)
   - Used: `workspace.alignCustomerId ?? user.alignCustomerId`

2. **Transfer Storage** (how transfers are saved to DB)
   - Saved with: `userId` AND `workspaceId`

3. **Transfer Queries** (how to find transfers in DB)
   - Queried by: **Only `userId`** ❌

### The Bug Scenario

**When workspace has alignCustomerId:**

1. **Sync runs:**
   - Fetches transfers using `workspace.alignCustomerId` ✅
   - Saves transfers with `workspaceId = workspace.id` ✅
   - Saves transfers with `userId = currentUser.id` ✅

2. **List query runs:**
   - Filters `WHERE userId = currentUser.id` only
   - **MISSES transfers** if another user in the same workspace synced them first!

**When multiple users share a workspace:**

1. User A syncs → saves transfers with `userId = userA.id`
2. User B syncs → tries to save SAME transfers with `userId = userB.id`
3. Conflict on `alignTransferId` (unique constraint)
4. Update triggers → changes `userId` from A to B
5. User A lists → **finds NOTHING** (transfers now belong to B!)

---

## The Fix

### Changes Made

**File: `/packages/web/src/server/routers/align-router.ts`**

#### 1. Import `or` operator from drizzle-orm

Already present at line 19.

#### 2. Fix `listOfframpTransfers` query (lines 2443-2472)

**Before:**

```typescript
const transfers = await db.query.offrampTransfers.findMany({
  where: eq(offrampTransfers.userId, userId), // ❌ Only userId
  // ...
});
```

**After:**

```typescript
// Get user's workspace
const userRecord = await db.query.users.findFirst({
  where: eq(users.privyDid, userId),
  columns: { primaryWorkspaceId: true },
});

if (!userRecord?.primaryWorkspaceId) {
  throw new TRPCError({
    code: 'PRECONDITION_FAILED',
    message: 'User has no primary workspace',
  });
}

// Filter by workspace OR user (backwards compatibility)
const transfers = await db.query.offrampTransfers.findMany({
  where: or(
    eq(offrampTransfers.workspaceId, userRecord.primaryWorkspaceId),
    eq(offrampTransfers.userId, userId),
  ),
  // ...
});
```

#### 3. Fix `listOnrampTransfers` query (lines 2520-2549)

**Same fix as offramp** - filter by `workspaceId OR userId`

#### 4. Preserve `workspaceId` in `syncOnrampTransfers` conflict resolution (lines 2635-2641)

**Before:**

```typescript
.onConflictDoUpdate({
  target: onrampTransfers.alignTransferId,
  set: {
    status: transfer.status,
    updatedAt: new Date(),
  },
});
```

**After:**

```typescript
.onConflictDoUpdate({
  target: onrampTransfers.alignTransferId,
  set: {
    status: transfer.status,
    workspaceId: userRecord.primaryWorkspaceId,  // ✅ Preserve workspace
    updatedAt: new Date(),
  },
});
```

#### 5. Preserve `workspaceId` in `syncOfframpTransfers` update (lines 2702-2710)

**Before:**

```typescript
await db
  .update(offrampTransfers)
  .set({
    status: transfer.status,
    amountToSend: transfer.amount,
    destinationCurrency: transfer.destination_currency,
    depositToken: transfer.source_token,
    depositNetwork: transfer.source_network,
    updatedAt: new Date(),
  })
  .where(eq(offrampTransfers.alignTransferId, transfer.id));
```

**After:**

```typescript
await db
  .update(offrampTransfers)
  .set({
    status: transfer.status,
    amountToSend: transfer.amount,
    destinationCurrency: transfer.destination_currency,
    depositToken: transfer.source_token,
    depositNetwork: transfer.source_network,
    workspaceId: userRecord.primaryWorkspaceId, // ✅ Preserve workspace
    updatedAt: new Date(),
  })
  .where(eq(offrampTransfers.alignTransferId, transfer.id));
```

---

## How It Works Now

### Data Flow (Fixed)

```
1. SYNC (syncOnrampTransfers / syncOfframpTransfers):
   - Get user's primaryWorkspaceId
   - Get workspace's alignCustomerId (or fallback to user's)
   - Fetch transfers from Align API using alignCustomerId
   - Save transfers with BOTH userId AND workspaceId
   - On conflict: UPDATE and preserve workspaceId

2. LIST (listOnrampTransfers / listOfframpTransfers):
   - Get user's primaryWorkspaceId
   - Query transfers WHERE:
     * workspaceId = user's workspace ID  ← All workspace transfers
     OR
     * userId = current user ID           ← Old user-level transfers (backwards compat)
```

### Workspace-Level Transfers

Now transfers are properly **workspace-scoped**:

- ✅ All users in a workspace see the same transfers
- ✅ No conflicts when multiple users sync
- ✅ Transfers persist with workspace, not individual users
- ✅ Backwards compatible with old user-level transfers

---

## Testing the Fix

### 1. Check Database State

```sql
-- See which transfers exist and their ownership
SELECT
  align_transfer_id,
  user_id,
  workspace_id,
  status,
  amount,
  created_at
FROM onramp_transfers
ORDER BY created_at DESC
LIMIT 10;

-- Check for orphaned transfers (no workspace)
SELECT COUNT(*)
FROM onramp_transfers
WHERE workspace_id IS NULL;
```

### 2. Test Multi-User Scenario

1. **User A** logs in and triggers sync
2. Check DB: transfers should have `workspaceId = userA's workspace`
3. **User B** (same workspace) logs in and triggers sync
4. Check DB: same transfers should still have `workspaceId`, not switched to userB
5. Both users should see the same transfers in UI

### 3. Debug Logging

Add these logs to verify the fix:

```typescript
// In syncOnrampTransfers
console.log('[syncOnrampTransfers] Debug:', {
  userId,
  primaryWorkspaceId: userRecord.primaryWorkspaceId,
  workspaceAlignId: primaryWorkspace?.alignCustomerId,
  userAlignId: userRecord.alignCustomerId,
  selectedAlignId: alignCustomerId,
  transferCount: transfers.length,
});

// In listOnrampTransfers
console.log('[listOnrampTransfers] Querying:', {
  userId,
  workspaceId: userRecord.primaryWorkspaceId,
});
console.log('[listOnrampTransfers] Found:', transfers.length);
```

---

## Migration Notes

### Existing Data

If you have existing transfers in the database with:

- `userId` set
- `workspaceId = NULL`

The fix handles this via **backwards compatibility** - the `OR` clause in the query will still find these old user-level transfers.

### Optional: Migrate Old Transfers

To clean up old data and make everything workspace-level:

```sql
-- Update old transfers to use workspace ownership
UPDATE onramp_transfers
SET workspace_id = (
  SELECT primary_workspace_id
  FROM users
  WHERE privy_did = onramp_transfers.user_id
)
WHERE workspace_id IS NULL
  AND user_id IS NOT NULL;

UPDATE offramp_transfers
SET workspace_id = (
  SELECT primary_workspace_id
  FROM users
  WHERE privy_did = offramp_transfers.user_id
)
WHERE workspace_id IS NULL
  AND user_id IS NOT NULL;
```

---

## Why This Matters

### Before Fix:

- Transfers were tied to individual users
- Multiple users in workspace caused conflicts
- Sync from one user could "steal" transfers from another
- Users saw different/missing transfers

### After Fix:

- Transfers are workspace-scoped
- All workspace members see the same data
- No conflicts when multiple users sync
- Consistent experience across the team

---

## Related Files

- `/packages/web/src/server/routers/align-router.ts` - Core fix
- `/packages/web/src/app/(authenticated)/dashboard/(bank)/components/dashboard/bank-transfers-list.tsx` - UI component
- `/packages/web/src/db/schema.ts` - Database schema (lines 380-480)
- `/packages/web/src/server/services/align-api.ts` - Align API client

---

**Fixed:** October 10, 2025  
**Issue:** Workspace transfers not showing due to userId-only filtering  
**Solution:** Filter by workspaceId OR userId for backwards compatibility
