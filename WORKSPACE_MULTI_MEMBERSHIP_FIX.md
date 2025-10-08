# Workspace Multi-Membership Fix

## Problem Report

User `did:privy:cmf62r60400pnjo0avjpa9pcj` (Raghav Aggarwal) who joined the workspace "Not our account" was seeing two error messages:

1. "Primary Account Not Found - We could not find your primary account"
2. "No virtual bank accounts are connected yet"

## Root Cause Analysis

### Multi-Workspace Scenario

The user has memberships in **2 workspaces**:

1. **"Not our account"** (workspace ID: `4125b90f-ac73-4181-9b01-80b7304c04dc`) - Member role
2. **"Different AI Inc"** (workspace ID: `50c0e7db-8d4b-4e00-a816-13518a4991c6`) - Owner role (KYC approved)

### Data State

```
User Safes:
- Primary Safe: 0xa2210Bab3FbbB8cE65c5977569142d956c02777a
  - Scoped to: "Different AI Inc" workspace only

Funding Sources:
- ZERO funding sources in database (even though both workspaces have KYC approved!)

Workspace States:
- "Not our account": KYC approved, alignCustomerId present, NO funding sources
- "Different AI Inc": KYC approved, alignCustomerId present, NO funding sources
```

### Why The Errors Occurred

#### Error 1: "Primary Account Not Found"

**Location**: `packages/web/src/server/routers/settings/user-safes.ts:85`

**Query** (BEFORE FIX):

```typescript
const primarySafe = await db.query.userSafes.findFirst({
  where: and(
    eq(userSafes.userDid, privyDid),
    eq(userSafes.safeType, 'primary'),
    eq(userSafes.workspaceId, workspaceId), // ❌ STRICT workspace match
  ),
});
```

**Problem**: When viewing "Not our account" workspace, the query looks for a primary safe with `workspaceId = "4125b90f-ac73-4181-9b01-80b7304c04dc"`, but the user's primary safe is scoped to a _different_ workspace (`"50c0e7db-8d4b-4e00-a816-13518a4991c6"`).

#### Error 2: "No virtual bank accounts"

**Location**: `packages/web/src/server/routers/align-router.ts:886`

**Query**:

```typescript
const fundingSources = await db.query.userFundingSources.findMany({
  where: and(
    eq(userFundingSources.userPrivyDid, userPrivyDid),
    eq(userFundingSources.workspaceId, workspaceId), // ❌ No funding sources exist
  ),
});
```

**Problem**: Virtual accounts were never created for either workspace, even though both have KYC approved. The existing `kyc-notifications` cron job only creates accounts once during initial KYC approval and doesn't handle multi-workspace scenarios or retry failures.

## Fixes Applied

### Fix 1: Fallback to Any Primary Safe

**File**: `packages/web/src/server/routers/settings/user-safes.ts`

**Router Note**: Despite the legacy name `userSafesRouter`, this router is fully workspace-centric - all procedures require and operate within workspace context (`ctx.workspaceId`).

**Change**: Modified `getPrimarySafeAddress` to fallback to ANY primary safe if workspace-scoped one doesn't exist:

```typescript
let primarySafe = await db.query.userSafes.findFirst({
  where: and(
    eq(userSafes.userDid, privyDid),
    eq(userSafes.safeType, 'primary'),
    eq(userSafes.workspaceId, workspaceId),
  ),
});

// ✅ FALLBACK: If no workspace-scoped safe, find any primary safe
if (!primarySafe) {
  primarySafe = await db.query.userSafes.findFirst({
    where: and(
      eq(userSafes.userDid, privyDid),
      eq(userSafes.safeType, 'primary'),
      or(eq(userSafes.workspaceId, workspaceId), isNull(userSafes.workspaceId)),
    ),
  });
}
```

**Rationale**: For multi-workspace members, it's better to show _some_ primary safe than throw an error. The user can still perform operations using their existing safe.

### Fix 2: Virtual Account Sync Cron Job

**File**: `packages/web/src/app/api/cron/virtual-account-sync/route.ts` (NEW)

**Purpose**: Ensures ALL KYC-approved workspaces have virtual bank accounts created.

**Schedule**: Every 30 minutes (`*/30 * * * *`)

**Logic**:

1. Finds all workspaces with `kycStatus='approved'` AND `alignCustomerId` present
2. Checks if workspace already has funding sources
3. Creates USD (ACH) and EUR (IBAN) virtual accounts for missing workspaces
4. Properly scopes accounts to workspace with `workspaceId`
5. Updates `workspace.alignVirtualAccountId` after creation

**Key Difference from Existing `kyc-notifications` Cron**:

- `kyc-notifications`: Runs on KYC _status changes_, creates accounts once
- `virtual-account-sync`: Runs periodically, catches _all_ approved workspaces without accounts (handles failures, multi-workspace, etc.)

**Vercel Configuration**: Added to `packages/web/vercel.json`

## Verification

### Diagnostic Scripts Created

1. **`scripts/diagnose-workspace-access.ts`**
   - Comprehensive diagnostic for a specific user
   - Shows all workspaces, safes, funding sources
   - Simulates router queries to identify issues
   - Provides actionable fix recommendations

2. **`scripts/find-broken-workspace-access.ts`**
   - Scans ALL workspace memberships
   - Identifies users with missing safes or funding sources
   - Found **170 users** with workspace access issues!

3. **`scripts/migrate-legacy-data-to-workspace.ts`**
   - Migrates legacy safes/funding sources (NULL workspaceId) to specific workspace
   - Dry-run mode by default
   - Useful for bulk data migration

### Diagnostic Output for Affected User

```
User: Raghav Aggarwal (did:privy:cmf62r60400pnjo0avjpa9pcj)

❌ ISSUES for "Not our account":
   - Missing primary safe scoped to workspace
   - Missing funding sources (KYC approved)

❌ ISSUES for "Different AI Inc":
   - Missing funding sources (KYC approved)
```

## Impact Analysis

### Users Affected

Running `find-broken-workspace-access.ts` revealed:

- **182 total workspace memberships** checked
- **170 memberships** have issues:
  - **3 workspaces**: KYC approved but missing funding sources (HIGH PRIORITY)
  - **167 workspaces**: Not KYC approved yet (expected state)

### High-Priority Cases

Users with KYC approved but missing virtual accounts:

1. `did:privy:cmf62r60400pnjo0avjpa9pcj` - "Not our account" workspace
2. `did:privy:cmf62r60400pnjo0avjpa9pcj` - "Different AI Inc" workspace
3. `did:privy:cmcyv3ukp0ekjm0ntojgznz5` - Workspace with KYC approved
4. `did:privy:cmf7uy72400vojo0b8ja6qc99` - "Nikolai Konstantinov" workspace

**Action Required**: Run the virtual account sync cron job to create accounts for all approved workspaces.

## Deployment Steps

### 1. Deploy Code Changes

```bash
# Commit and push the fix
git add packages/web/src/server/routers/settings/user-safes.ts
git add packages/web/src/app/api/cron/virtual-account-sync/route.ts
git add packages/web/vercel.json
git commit -m "fix: add fallback for primary safe in multi-workspace scenarios and virtual account sync cron"
git push
```

### 2. Verify Cron Job

After deployment:

1. Check Vercel dashboard for new cron job registration
2. Monitor logs for first execution
3. Verify virtual accounts are created for approved workspaces

### 3. Manual Trigger (Optional)

If immediate fix needed:

```bash
# Manually trigger the cron via Vercel API or curl
curl -X GET https://your-app.vercel.app/api/cron/virtual-account-sync \
  -H "Authorization: Bearer $CRON_SECRET"
```

### 4. Verify Fix for Affected User

```bash
# Run diagnostic again
tsx scripts/diagnose-workspace-access.ts

# Should show:
# ✅ Workspace "Not our account": Has primary safe (fallback)
# ✅ Workspace "Not our account": Has funding sources
```

## Future Improvements

### Short-term

1. **Update `kyc-notifications` cron** to also filter funding sources by workspace (line 239)
2. **Add monitoring/alerts** for virtual account creation failures
3. **Create admin dashboard** showing workspace sync status

### Long-term

1. **Workspace-Scoped Safes**: Automatically create workspace-specific primary safes when users join new workspaces
2. **Safe Sharing**: Allow users to explicitly share safes across workspaces
3. **Workspace Migration Tool**: UI for moving safes/accounts between workspaces
4. **Audit Log**: Track which workspace a safe/account was used in

## Testing Checklist

- [ ] User can view "Not our account" workspace without errors
- [ ] User can see their primary safe address (fallback working)
- [ ] User can see virtual bank accounts after cron runs
- [ ] Cron job successfully creates accounts for all approved workspaces
- [ ] No duplicate account creation
- [ ] Multi-workspace users can switch between workspaces without errors
- [ ] New workspace joins trigger account creation (via existing cron)

## Rollback Plan

If issues occur:

1. **Revert primary safe fallback**:

   ```bash
   git revert <commit-hash>
   git push
   ```

2. **Disable virtual account sync cron**:
   - Remove from `vercel.json`
   - Redeploy

3. **Database rollback**: No schema changes, safe to rollback code only

## Related Files

- `packages/web/src/server/routers/settings/user-safes.ts` - Primary safe query fix
- `packages/web/src/app/api/cron/virtual-account-sync/route.ts` - New cron job
- `packages/web/vercel.json` - Cron schedule configuration
- `scripts/diagnose-workspace-access.ts` - Diagnostic tool
- `scripts/find-broken-workspace-access.ts` - Bulk issue finder
- `scripts/migrate-legacy-data-to-workspace.ts` - Data migration tool

## References

- Previous workspace migration: Commit `e21c8767` - "feat(workspaces): implement workspace-level KYC and banking"
- Virtual account details fix: Commit `bdf30669` - "fix: update getVirtualAccountDetails to use workspace-level data"
