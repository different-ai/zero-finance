# Virtual Account Workspace Migration Analysis

## Executive Summary

The virtual account system in 0 Finance needs to be updated to properly use workspace-level data instead of user-level data. This is critical for proper multi-workspace isolation where each workspace should have its own banking credentials and virtual accounts.

## Problem Statement

Currently, virtual accounts are being retrieved **without workspace context**, which means:

1. Users see the same virtual account details across all workspaces
2. Virtual accounts aren't properly isolated per workspace
3. Switching workspaces doesn't update the displayed banking information

## Key Files & Issues

### 🔴 **CRITICAL ISSUE 1: `align-router.ts` - `getVirtualAccountDetails`**

**File**: `packages/web/src/server/routers/align-router.ts:856-890`

**Current Implementation** (WRONG):

```typescript
getVirtualAccountDetails: protectedProcedure.query(async ({ ctx }) => {
  const userFromPrivy = await getUser();

  // ❌ PROBLEM: Queries by user ID, not workspace
  const fundingSources = await db.query.userFundingSources.findMany({
    where: eq(userFundingSources.userPrivyDid, userFromPrivy.id),
  });

  // ❌ PROBLEM: Gets user data, not workspace data
  const user = await db.query.users.findFirst({
    where: eq(users.privyDid, userFromPrivy.id),
    columns: {
      firstName: true,
      lastName: true,
      companyName: true,
      beneficiaryType: true,
    },
  });

  return {
    fundingSources: alignSources,
    userData: user,
  };
}),
```

**What Should Happen**:

```typescript
getVirtualAccountDetails: protectedProcedure.query(async ({ ctx }) => {
  const userFromPrivy = await getUser();
  if (!userFromPrivy?.id) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'User not found',
    });
  }

  const workspaceId = ctx.workspaceId;
  if (!workspaceId) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Workspace context is unavailable.',
    });
  }

  // ✅ CORRECT: Filter funding sources by workspace
  const fundingSources = await db.query.userFundingSources.findMany({
    where: and(
      eq(userFundingSources.userPrivyDid, userFromPrivy.id),
      eq(userFundingSources.workspaceId, workspaceId)
    ),
  });

  // Filter for Align-provided sources
  const alignSources = fundingSources.filter(
    (source) => source.sourceProvider === 'align',
  );

  // ✅ CORRECT: Get workspace data for beneficiary info
  const workspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.id, workspaceId),
    columns: {
      firstName: true,
      lastName: true,
      companyName: true,
      beneficiaryType: true,
    },
  });

  return {
    fundingSources: alignSources,
    userData: workspace, // Use workspace data instead of user data
  };
}),
```

**Impact**: HIGH

- Users see wrong banking details when switching workspaces
- Virtual accounts not isolated per workspace
- KYC data mismatch (showing user data instead of workspace entity data)

---

### ✅ **CORRECT: `getAllVirtualAccounts`**

**File**: `packages/web/src/server/routers/align-router.ts:895-937`

This procedure is **already correct** - it properly uses workspace context:

```typescript
getAllVirtualAccounts: protectedProcedure.query(async ({ ctx }) => {
  const user = await db.query.users.findFirst({
    where: eq(users.privyDid, userFromPrivy.id),
  });

  if (!user?.primaryWorkspaceId) {
    return [];
  }

  // ✅ Gets workspace
  const workspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.id, user.primaryWorkspaceId),
  });

  if (!workspace?.alignCustomerId) {
    return [];
  }

  // ✅ Uses workspace's alignCustomerId
  const response = await alignApi.listVirtualAccounts(
    workspace.alignCustomerId,
  );

  return response.items || [];
}),
```

---

### 🔴 **CRITICAL ISSUE 2: `userFundingSources` Table - Schema Check**

**File**: `packages/web/src/db/schema.ts:213-275`

**Current Schema** (Line 221):

```typescript
export const userFundingSources = pgTable(
  'user_funding_sources',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userPrivyDid: text('user_privy_did')
      .notNull()
      .references(() => users.privyDid, { onDelete: 'cascade' }),
    workspaceId: uuid('workspace_id'), // ✅ Field exists

    // ... other fields
  },
  (table) => ({
    userDidIdx: index('user_funding_sources_user_did_idx').on(
      table.userPrivyDid,
    ),
    workspaceIdx: index('user_funding_sources_workspace_idx').on(
      table.workspaceId, // ✅ Index exists
    ),
  }),
);
```

**Status**: ✅ Schema is correct - `workspaceId` field and index exist

---

## Components Using Virtual Account Data

### 1. **Savings Page Wrapper** (✅ Transparent - No Changes Needed)

**File**: `packages/web/src/app/(authenticated)/dashboard/savings/page-wrapper.tsx:170-176`

```typescript
const {
  data: accountData,
  isLoading: isLoadingFundingSources,
  refetch: refetchFundingSources,
} = api.align.getVirtualAccountDetails.useQuery(undefined, {
  enabled: !isDemoMode && ready && authenticated && !!user?.id,
});
```

**Status**: ✅ Component correctly calls the procedure - fix is transparent

---

### 2. **Funds Display Components**

All these components call `getVirtualAccountDetails` and will automatically benefit from the fix:

- `packages/web/src/app/(authenticated)/dashboard/(bank)/components/dashboard/funds-display.tsx:90`
- `packages/web/src/app/(authenticated)/dashboard/(bank)/components/dashboard/funds-display-with-demo.tsx:127`
- `packages/web/src/app/(authenticated)/dashboard/(bank)/components/dashboard/funds-display-demo.tsx:11`
- `packages/web/src/components/settings/align-integration/align-account-display.tsx:97`

**Status**: ✅ All transparent - no component changes needed

---

## Database Schema Status

### ✅ **Workspaces Table** (Line 46)

```typescript
export const workspaces = pgTable('workspaces', {
  // ... other fields
  alignVirtualAccountId: text('align_virtual_account_id'), // ✅ EXISTS
  // ... other fields
});
```

### ✅ **User Funding Sources Table** (Line 221)

```typescript
export const userFundingSources = pgTable('user_funding_sources', {
  // ... other fields
  workspaceId: uuid('workspace_id'), // ✅ EXISTS with INDEX
  // ... other fields
});
```

### ✅ **Offramp Transfers Table**

```typescript
export const offrampTransfers = pgTable('offramp_transfers', {
  // ... other fields
  workspaceId: uuid('workspace_id'), // ✅ EXISTS with INDEX
  // ... other fields
});
```

### ✅ **Onramp Transfers Table**

```typescript
export const onrampTransfers = pgTable('onramp_transfers', {
  // ... other fields
  workspaceId: uuid('workspace_id'), // ✅ EXISTS with INDEX
  // ... other fields
});
```

**Status**: ✅ All tables have proper workspace fields and indexes

---

## Related Procedures to Verify

### ✅ **Already Workspace-Aware**

These procedures already use workspace context correctly:

1. **`getCustomerStatus`** (align-router.ts:204-264)
   - Uses workspace KYC data
   - Queries `workspaces` table
2. **`initiateKyc`** (align-router.ts:269-390)
   - Creates customer with workspace context
   - Stores `alignCustomerId` in workspace
3. **`refreshKycStatus`** (align-router.ts:395-474)
   - Updates workspace KYC status
   - Uses `fetchAndUpdateWorkspaceKycStatus`

4. **`getAllVirtualAccounts`** (align-router.ts:895-937)
   - Uses workspace's `alignCustomerId`
   - Properly scoped to workspace

---

## Fixes Required

### 🔴 **FIX 1: Update `getVirtualAccountDetails` Procedure**

**File**: `packages/web/src/server/routers/align-router.ts:856-890`

**Changes**:

1. Add workspace context check
2. Filter funding sources by `workspaceId`
3. Return workspace entity data instead of user data

**Code**:

```typescript
getVirtualAccountDetails: protectedProcedure.query(async ({ ctx }) => {
  const userFromPrivy = await getUser();
  if (!userFromPrivy?.id) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'User not found',
    });
  }

  const workspaceId = ctx.workspaceId;
  if (!workspaceId) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Workspace context is unavailable.',
    });
  }

  // Get workspace funding sources
  const fundingSources = await db.query.userFundingSources.findMany({
    where: and(
      eq(userFundingSources.userPrivyDid, userFromPrivy.id),
      eq(userFundingSources.workspaceId, workspaceId)
    ),
  });

  // Filter for Align-provided sources
  const alignSources = fundingSources.filter(
    (source) => source.sourceProvider === 'align',
  );

  // Get workspace details for beneficiary information
  const workspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.id, workspaceId),
    columns: {
      firstName: true,
      lastName: true,
      companyName: true,
      beneficiaryType: true,
    },
  });

  return {
    fundingSources: alignSources,
    userData: workspace, // Return workspace entity data
  };
}),
```

---

## Testing Checklist

### ✅ **Scenarios to Test**

#### Scenario 1: Single Workspace User

1. User completes KYC in their workspace
2. Virtual account is created by cron
3. User navigates to `/dashboard/savings`
4. Verify: Correct banking details displayed
5. Verify: ACH/IBAN account numbers match workspace

#### Scenario 2: Multi-Workspace User

1. User has 2 workspaces (A and B)
2. Workspace A has KYC approved, virtual account created
3. Workspace B has no KYC
4. User on workspace A → sees virtual account details
5. User switches to workspace B → sees "no account" state
6. User switches back to workspace A → sees virtual account again

#### Scenario 3: Workspace Switching

1. User has 2 workspaces with different entity types
2. Workspace A: Individual account (John Doe)
3. Workspace B: Business account (Acme Corp)
4. User on workspace A → sees "John Doe" as beneficiary
5. User switches to workspace B → sees "Acme Corp" as beneficiary

---

## Migration Impact

### ✅ **Safe Migration**

This fix is **safe to deploy** because:

1. **No Schema Changes**: All required fields (`workspaceId`) already exist
2. **Transparent to UI**: Components don't need updates
3. **Backward Compatible**: Existing funding sources will work
4. **Data Integrity**: No data loss or migration scripts needed

### ⚠️ **Potential Edge Cases**

1. **Legacy Funding Sources**: Some funding sources may have `null` workspace ID
   - **Solution**: Cron job already handles this (see `kyc-notifications/route.ts:298,345`)
2. **In-Progress Transfers**: Active transfers may reference old funding sources
   - **Solution**: Transfers also have `workspaceId` field for proper scoping

---

## Priority & Severity

| Issue                             | Severity | Priority | Blocker? | Status       |
| --------------------------------- | -------- | -------- | -------- | ------------ |
| getVirtualAccountDetails wrong    | 🔴 HIGH  | HIGH     | YES      | ✅ **FIXED** |
| Multi-workspace isolation broken  | 🔴 HIGH  | HIGH     | YES      | ✅ **FIXED** |
| Banking details show wrong entity | 🔴 HIGH  | HIGH     | YES      | ✅ **FIXED** |

---

## Fix Applied

### ✅ **Updated `getVirtualAccountDetails` Procedure**

**File**: `packages/web/src/server/routers/align-router.ts:856-901`

**Changes Made**:

1. ✅ Added workspace context validation
2. ✅ Filter funding sources by `workspaceId`
3. ✅ Return workspace entity data instead of user data
4. ✅ Updated documentation comment

**New Implementation**:

```typescript
getVirtualAccountDetails: protectedProcedure.query(async ({ ctx }) => {
  const userFromPrivy = await getUser();
  if (!userFromPrivy?.id) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'User not found',
    });
  }

  const workspaceId = ctx.workspaceId;
  if (!workspaceId) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Workspace context is unavailable.',
    });
  }

  // Get workspace funding sources from DB (filtered by workspace)
  const fundingSources = await db.query.userFundingSources.findMany({
    where: and(
      eq(userFundingSources.userPrivyDid, userFromPrivy.id),
      eq(userFundingSources.workspaceId, workspaceId),
    ),
  });

  // Filter for Align-provided sources
  const alignSources = fundingSources.filter(
    (source) => source.sourceProvider === 'align',
  );

  // Get workspace details for beneficiary information
  const workspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.id, workspaceId),
    columns: {
      firstName: true,
      lastName: true,
      companyName: true,
      beneficiaryType: true,
    },
  });

  return {
    fundingSources: alignSources,
    userData: workspace, // Return workspace entity data
  };
}),
```

---

## Conclusion

### Summary

**Problem**: Virtual account details were retrieved without workspace context, breaking multi-workspace isolation.

**Solution**: Updated `getVirtualAccountDetails` to filter by workspace and return workspace entity data.

**Impact**: Single procedure fix with zero UI changes - all components automatically inherit the fix.

**Risk**: Low - no schema changes, backward compatible, type checking passes.

**Status**: ✅ **FIXED and Ready to Test**

### Completed Steps

1. ✅ Updated `getVirtualAccountDetails` procedure
2. ✅ Added workspace context validation
3. ✅ Filter funding sources by workspace
4. ✅ Return workspace entity data
5. ⏳ Test multi-workspace scenarios (pending)
6. ⏳ Verify banking details display correctly (pending)

### Testing Required

Before merge, verify:

- [ ] Single workspace user sees correct virtual account details
- [ ] Multi-workspace user sees different details per workspace
- [ ] Switching workspaces updates displayed banking info
- [ ] Beneficiary name matches workspace entity type

**Merge Readiness**: ✅ **Ready to merge after testing**
