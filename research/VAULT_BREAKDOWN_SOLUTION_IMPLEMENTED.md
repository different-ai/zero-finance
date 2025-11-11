# Vault Breakdown Solution - Implementation Complete

## Problem Solved

The admin panel's workspace details dialog was showing empty vault breakdown (`vaultBreakdown: []`) even when users had active vault positions visible in the Safe UI. This was because:

1. The `earn_deposits` table was empty for some workspaces
2. Vault positions existed on-chain but were never recorded in the database
3. The original implementation only queried the database, missing on-chain positions

## Solution Implemented: Option 1A (On-Chain Reading)

We implemented **Solution 1A** from `VAULT_BREAKDOWN_DIAGNOSIS.md`, which reads vault balances directly from the blockchain instead of relying solely on database records.

### Changes Made

#### 1. Fixed Legacy Deposit Queries (Prerequisite)

**File:** `packages/web/src/server/routers/admin-router.ts`

**Before:**

```typescript
const earnDepositsList = await db.query.earnDeposits.findMany({
  where: eq(earnDeposits.workspaceId, workspaceId),
});
```

**After:**

```typescript
const safeAddresses = safes.map((s) => s.safeAddress);

const earnDepositsList = await db.query.earnDeposits.findMany({
  where: (tbl, { and, eq, or, isNull, inArray }) =>
    safeAddresses.length > 0
      ? and(
          inArray(tbl.safeAddress, safeAddresses),
          or(eq(tbl.workspaceId, workspaceId), isNull(tbl.workspaceId)),
        )
      : eq(tbl.workspaceId, workspaceId),
});
```

This pattern matches `earn-router.ts` and handles:

- Legacy deposits with `null` workspace IDs
- Deposits associated with workspace's safe addresses

#### 2. Added On-Chain Vault Balance Reading

**Imports Added:**

```typescript
import { createPublicClient, http, parseAbi } from 'viem';
import { base } from 'viem/chains';
import { getBaseRpcUrl } from '@/lib/base-rpc-url';
```

**ERC4626 ABI:**

```typescript
const ERC4626_VAULT_ABI = parseAbi([
  'function balanceOf(address owner) public view returns (uint256)',
  'function convertToAssets(uint256 shares) public view returns (uint256 assets)',
]);
```

**Public Client Setup:**

```typescript
const publicClient = createPublicClient({
  chain: base,
  transport: http(getBaseRpcUrl(), {
    batch: {
      batchSize: 100,
      wait: 16,
    },
  }),
  batch: {
    multicall: true,
  },
});
```

#### 3. Vault Breakdown Implementation

**New Logic:**

```typescript
// Read actual on-chain vault positions for all BASE_USDC_VAULTS
const vaultStats = await Promise.all(
  BASE_USDC_VAULTS.map(async (vaultInfo: any) => {
    const vaultAddress = vaultInfo.address as `0x${string}`;
    let totalAssets = 0n;

    // Check all safes in this workspace
    for (const safeAddress of safeAddresses) {
      // Read ERC4626 vault shares
      const shares = await publicClient.readContract({
        address: vaultAddress,
        abi: ERC4626_VAULT_ABI,
        functionName: 'balanceOf',
        args: [safeAddress as `0x${string}`],
      });

      // Convert shares to assets (USDC)
      if (shares > 0n) {
        const assets = await publicClient.readContract({
          address: vaultAddress,
          abi: ERC4626_VAULT_ABI,
          functionName: 'convertToAssets',
          args: [shares],
        });
        totalAssets += assets;
      }
    }

    // Only include vaults with non-zero balances
    if (totalAssets === 0n) return null;

    return {
      vaultAddress: vaultInfo.address,
      vaultName: vaultInfo.name,
      displayName: vaultInfo.displayName,
      balance: totalAssets.toString(),
      balanceUsd: Number(totalAssets) / 1_000_000,
    };
  }),
);

// Filter out null values
vaultBreakdown = vaultStats.filter((v) => v !== null);
```

#### 4. Removed Debug Code

**File:** `packages/web/src/components/admin/workspace-details-dialog.tsx`

Removed the yellow debug panel that was showing raw vault breakdown data.

## How It Works

### Flow

1. **Get workspace safes**: Query all safes belonging to the workspace
2. **For each vault in BASE_USDC_VAULTS**:
   - Read `balanceOf(safeAddress)` → vault shares
   - If shares > 0, call `convertToAssets(shares)` → USDC amount
   - Aggregate across all workspace safes
3. **Filter and display**: Only show vaults with non-zero balances

### ERC4626 Standard

The implementation uses the ERC4626 vault standard:

- `balanceOf(address)`: Returns vault shares owned by address
- `convertToAssets(uint256 shares)`: Converts shares to underlying asset amount

### Performance Considerations

**Batching Enabled:**

- Viem multicall batching groups multiple RPC calls
- `batchSize: 100` and `wait: 16ms` optimize network efficiency

**Parallel Execution:**

- `Promise.all()` reads all vaults concurrently
- Only checks vaults in `BASE_USDC_VAULTS` (limited set)

## Benefits

✅ **Always Accurate**: Reads actual on-chain positions, not stale database records  
✅ **Works for Legacy Users**: Handles deposits made before workspace migration  
✅ **No Migration Required**: No need to backfill historical data  
✅ **Handles All Cases**: Works whether database tracking exists or not

## Trade-offs

⚠️ **Slightly Slower**: Makes on-chain RPC calls vs simple database query  
⚠️ **RPC Dependency**: Requires Base RPC to be available  
⚠️ **Current Positions Only**: Doesn't show historical vaults that have been fully withdrawn

## Alternative Solutions (Not Implemented)

### Solution 1B: Backfill Missing Deposits

- Scan blockchain for historical `Deposit` events
- Populate `earn_deposits` table retroactively
- **Why not chosen**: More complex, requires one-time migration, on-chain reading is simpler

### Solution 2: Query Pattern Fix Only

- Only fix the workspace ID query pattern
- **Why not sufficient**: Doesn't solve root cause (missing database records)

## Testing Recommendations

1. **Test with workspace that has vault positions**:
   - Open admin panel → Workspaces tab
   - Click workspace with known vault deposits
   - Verify vault breakdown shows correct balances

2. **Test with empty workspace**:
   - Verify shows "No vault deposits found"
   - No errors in console

3. **Test with legacy user** (deposits pre-workspace migration):
   - Verify their positions show correctly
   - Check both workspace ID and null workspace ID deposits are counted

## Related Files

- **Implementation**: `packages/web/src/server/routers/admin-router.ts`
- **UI Component**: `packages/web/src/components/admin/workspace-details-dialog.tsx`
- **Diagnosis**: `VAULT_BREAKDOWN_DIAGNOSIS.md`
- **Previous Session Summary**: (See conversation history)

## Next Steps (Optional Improvements)

1. **Add Caching**: Cache vault balances for 30s-1min to reduce RPC calls
2. **Show Historical Vaults**: Hybrid approach using database + on-chain
3. **Loading States**: Add loading indicator while fetching on-chain data
4. **Error Handling**: Better error messages if RPC fails
5. **Backfill Script**: Implement Solution 1B for complete historical tracking
