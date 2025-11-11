# Vault Breakdown Not Showing - Diagnosis & Solutions

## Problem Statement

**Observed Behavior:**

- Workspace "Clayton Farms" shows `depositCount: 0` and `vaultBreakdown: []`
- User can see vault positions in the Safe UI
- Database tables `earn_deposits` and `earn_withdrawals` are empty for this workspace

**Expected Behavior:**

- Vault breakdown should show all vaults with their balances
- Should match what's visible in the Safe UI

---

## Theory 1: Deposits Not Being Tracked in Database

### Root Cause

The vault deposits visible in the Safe UI are on-chain positions, but they were never recorded in our `earn_deposits` table. This could happen if:

- Deposits were made before the tracking system was implemented
- Deposits were made through a different interface (direct Safe interaction)
- Event listeners for deposit tracking weren't running
- Migration to workspace-based deposits didn't backfill historical data

### Evidence from Code

**Current Query Logic** (packages/web/src/server/routers/admin-router.ts:1378-1460):

```typescript
// Gets deposits from DATABASE only
const earnDepositsList = await db.query.earnDeposits.findMany({
  where: eq(earnDeposits.workspaceId, workspaceId),
});

// Get unique vault addresses from deposits
const uniqueVaultAddresses = Array.from(
  new Set(earnDepositsList.map((d) => d.vaultAddress)),
);
// ❌ If earnDepositsList is empty, uniqueVaultAddresses is empty
// ❌ No vaults to show, even if on-chain positions exist
```

### Solution 1A: Query On-Chain Vault Positions Directly

**Approach:** Read vault balances from blockchain instead of database.

```typescript
// NEW: Get on-chain vault positions
const { BASE_USDC_VAULTS } = require('@/server/earn/base-vaults');
const vaultAddresses = BASE_USDC_VAULTS.map((v: any) => v.address);

const vaultStats = await Promise.all(
  vaultAddresses.map(async (vaultAddress: string) => {
    if (!safes[0]?.safeAddress) return null;

    // Read ERC4626 vault balance for this Safe
    const shares = await publicClient.readContract({
      address: vaultAddress as `0x${string}`,
      abi: ERC4626_ABI,
      functionName: 'balanceOf',
      args: [safes[0].safeAddress as `0x${string}`],
    });

    // Convert shares to assets
    const assets = await publicClient.readContract({
      address: vaultAddress as `0x${string}`,
      abi: ERC4626_ABI,
      functionName: 'convertToAssets',
      args: [shares],
    });

    if (assets === 0n) return null;

    const vaultInfo = BASE_USDC_VAULTS.find(
      (v: any) => v.address.toLowerCase() === vaultAddress.toLowerCase(),
    );

    return {
      vaultAddress,
      vaultName: vaultInfo?.name || 'Unknown',
      displayName: vaultInfo?.displayName || vaultAddress,
      balance: assets.toString(),
      balanceUsd: Number(assets) / 1_000_000,
    };
  }),
);

vaultBreakdown = vaultStats.filter((v) => v !== null);
```

**Pros:**

- ✅ Shows actual current on-chain positions
- ✅ Always accurate regardless of database state
- ✅ No need to backfill historical data

**Cons:**

- ⚠️ Slower (multiple RPC calls)
- ⚠️ Doesn't show historical deposits that have been fully withdrawn

---

### Solution 1B: Backfill Missing Deposits from On-Chain Events

**Approach:** Listen to past vault deposit events and populate the database.

```typescript
// Script: scripts/backfill-vault-deposits.ts
import { createPublicClient, http, parseAbiItem } from 'viem';
import { base } from 'viem/chains';

const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.ALCHEMY_RPC_URL),
});

async function backfillVaultDeposits() {
  const safes = await db.query.userSafes.findMany();

  for (const safe of safes) {
    // Get all Deposit events for this Safe across all vaults
    const depositEvents = await publicClient.getLogs({
      address: vaultAddresses,
      event: parseAbiItem(
        'event Deposit(address indexed sender, address indexed owner, uint256 assets, uint256 shares)',
      ),
      args: {
        owner: safe.safeAddress as `0x${string}`,
      },
      fromBlock: 0n, // Or deployment block
      toBlock: 'latest',
    });

    for (const event of depositEvents) {
      // Check if already recorded
      const exists = await db.query.earnDeposits.findFirst({
        where: eq(earnDeposits.txHash, event.transactionHash),
      });

      if (!exists) {
        // Insert missing deposit record
        await db.insert(earnDeposits).values({
          id: crypto.randomUUID(),
          userDid: safe.userDid,
          workspaceId: safe.workspaceId,
          safeAddress: safe.safeAddress,
          vaultAddress: event.address,
          tokenAddress: USDC_ADDRESS,
          assetsDeposited: event.args.assets.toString(),
          sharesReceived: event.args.shares.toString(),
          txHash: event.transactionHash,
          timestamp: new Date(event.blockTimestamp * 1000),
          assetDecimals: 6,
        });
      }
    }
  }
}
```

**Pros:**

- ✅ Populates database with historical data
- ✅ Future queries work without changes
- ✅ Can track full deposit/withdrawal history

**Cons:**

- ⚠️ One-time migration effort
- ⚠️ Need to handle events before workspace migration

---

## Theory 2: Workspace ID Mismatch

### Root Cause

The Safe has a `workspaceId` but the deposits were recorded with a different (or null) `workspaceId`. This could happen during the workspace migration.

### Evidence to Check

```sql
-- Check if deposits exist but with wrong workspace ID
SELECT
  ed.safe_address,
  ed.workspace_id as deposit_workspace_id,
  us.workspace_id as safe_workspace_id,
  COUNT(*) as deposit_count
FROM earn_deposits ed
LEFT JOIN user_safes us ON ed.safe_address = us.safe_address
WHERE ed.safe_address = '0x...' -- Clayton's safe address
GROUP BY ed.safe_address, ed.workspace_id, us.workspace_id;
```

### Solution 2A: Fix Workspace ID References

```typescript
// Update query to check both workspace ID and safe address
const earnDepositsList = await db.query.earnDeposits.findMany({
  where: or(
    eq(earnDeposits.workspaceId, workspaceId),
    and(
      inArray(
        earnDeposits.safeAddress,
        safes.map((s) => s.safeAddress),
      ),
      isNull(earnDeposits.workspaceId), // Legacy deposits
    ),
  ),
});
```

### Solution 2B: Migration Script to Fix Workspace IDs

```typescript
// Update all deposits to match their Safe's workspace ID
await db.execute(sql`
  UPDATE earn_deposits ed
  SET workspace_id = us.workspace_id
  FROM user_safes us
  WHERE ed.safe_address = us.safe_address
  AND (ed.workspace_id IS NULL OR ed.workspace_id != us.workspace_id)
`);
```

---

## Theory 3: Using Wrong Data Source (User DID vs Workspace)

### Root Cause

The deposits might be indexed by `userDid` but we're querying by `workspaceId`. If the workspace migration didn't update all records, we'll miss deposits.

### Solution 3: Query by Both Workspace and User DIDs

```typescript
// Get all member user DIDs for this workspace
const memberDids = members.map((m) => m.userId);

// Get deposits by either workspace ID or member DIDs
const earnDepositsList = await db.query.earnDeposits.findMany({
  where: or(
    eq(earnDeposits.workspaceId, workspaceId),
    inArray(earnDeposits.userDid, memberDids),
  ),
});
```

---

## Recommended Solution: Hybrid Approach

**Best approach combines Theory 1A (on-chain reading) with database fallback:**

```typescript
// 1. Try database first (fast)
const earnDepositsList = await db.query.earnDeposits.findMany({
  where: eq(earnDeposits.workspaceId, workspaceId),
});

let vaultBreakdown: any[] = [];

if (earnDepositsList.length > 0) {
  // Use database tracking (existing logic)
  vaultBreakdown = await calculateFromDatabase(earnDepositsList);
} else if (safes.length > 0) {
  // Fallback: Read on-chain positions
  vaultBreakdown = await readOnChainPositions(safes[0].safeAddress);
}
```

**Benefits:**

- ✅ Fast when database has data
- ✅ Still works for legacy/untracked deposits
- ✅ Shows actual current positions
- ✅ No migration required

---

## Quick Diagnostic Query

Run this to understand the data gap:

```sql
-- Check Clayton's workspace deposits
SELECT
  ws.id as workspace_id,
  ws.name as workspace_name,
  us.safe_address,
  COUNT(ed.id) as deposit_count,
  SUM(ed.assets_deposited::numeric) as total_deposited
FROM workspaces ws
LEFT JOIN user_safes us ON us.workspace_id = ws.id
LEFT JOIN earn_deposits ed ON ed.workspace_id = ws.id
WHERE ws.name = 'Clayton Farms'
GROUP BY ws.id, ws.name, us.safe_address;
```

---

## Recommendation

**Go with Solution 1A (On-Chain Reading) as primary approach:**

1. **Immediate fix:** Read actual vault balances from blockchain
2. **Why:** Always accurate, no migration needed, works for all users
3. **Trade-off:** Slightly slower but we can cache the results
4. **Long-term:** Implement proper deposit tracking + backfill script

Would you like me to proceed with implementing Solution 1A (on-chain vault reading)?
