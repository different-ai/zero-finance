# Admin Panel - User & Workspace States

## Overview

This document outlines the key states tracked for users and workspaces that should be visible in the admin panel.

## User States

### Identity & Profile

- **`privyDid`** - Unique identifier
- **`firstName`, `lastName`** - User name
- **`companyName`** - Business name
- **`userRole`** - `'startup'` | `'contractor'`
- **`beneficiaryType`** - `'individual'` | `'business'`
- **`createdAt`** - Registration date

### KYC & Compliance

- **`kycStatus`** - `'none'` | `'pending'` | `'approved'` | `'rejected'`
- **`kycProvider`** - `'align'` | `'other'`
- **`kycSubStatus`** - Additional status details
- **`kycFlowLink`** - URL to KYC flow
- **`kycMarkedDone`** - Boolean flag
- **`kycNotificationSent`** - Timestamp
- **`kycNotificationStatus`** - `'pending'` | `'sent'` | `'failed'`

### Banking & Virtual Accounts

- **`alignCustomerId`** - Align customer ID
- **`alignVirtualAccountId`** - Virtual account ID
- **Source**: Align API `/customers/{id}`

### Marketing & Sync

- **`loopsContactSynced`** - Boolean flag
- **`contractorInviteCode`** - Invite tracking

### Workspace Association

- **`primaryWorkspaceId`** - Default workspace

---

## Workspace States

### Identity

- **`id`** - UUID
- **`name`** - Workspace name
- **`createdBy`** - Creator privy DID
- **`workspaceType`** - `'personal'` | `'business'`
- **`createdAt`, `updatedAt`** - Timestamps

### Entity Information

- **`beneficiaryType`** - `'individual'` | `'business'`
- **`companyName`** - Business name
- **`firstName`, `lastName`** - Individual name

### KYB (Know Your Business)

- **`kycStatus`** - `'none'` | `'pending'` | `'approved'` | `'rejected'`
- **`kycProvider`** - `'align'` | `'other'`
- **`kycSubStatus`** - Additional details
- **`kycFlowLink`** - Verification URL
- **`kycMarkedDone`** - Boolean
- **`kycNotificationSent`**, **`kycNotificationStatus`** - Notification tracking

### Banking

- **`alignCustomerId`** - Workspace-level Align integration
- **`alignVirtualAccountId`** - Workspace banking account

---

## Auto-Earn States

**Table**: `autoEarnConfigs`

- **`userDid`** - Owner
- **`safeAddress`** - Which Safe (0x address)
- **`pct`** - Percentage allocated (1-100)
- **`lastTrigger`** - Last execution timestamp
- **`workspaceId`** - Workspace association

**Status Indicators**:

- ✅ Enabled: `pct > 0`
- ⏱️ Last Run: `lastTrigger`
- 📊 Allocation: `${pct}%`

---

## Savings/Earn Positions

**Table**: `earnDeposits`

### Per-Deposit Tracking

- **`assetsDeposited`** - Amount (in USDC, 6 decimals)
- **`sharesReceived`** - Vault shares (18 decimals)
- **`vaultAddress`** - Which vault (blockchain)
- **`apyBasisPoints`** - Yield rate at deposit time
- **`depositPercentage`** - % from auto-earn config
- **`timestamp`** - When deposited
- **`workspaceId`** - Workspace ownership

### Aggregated Metrics (requires calculation)

- **Total Deposited** - Sum of `assetsDeposited` per user/workspace
- **Current Value** - Requires blockchain call to vault
- **Total Earnings** - `currentValue - totalDeposited`
- **Effective APY** - Calculated from earnings over time

---

## Safe (Smart Wallet) States

**Table**: `userSafes`

- **`safeAddress`** - Blockchain address (42 chars)
- **`safeType`** - `'primary'` | `'tax'` | `'liquidity'` | `'yield'`
- **`isEarnModuleEnabled`** - Auto-earn activation
- **`workspaceId`** - Workspace association

### Blockchain Data (requires RPC call)

- **USDC Balance** - `getSafeBalance(safeAddress)`
- **Transaction History** - Safe Transaction Service API
- **Module Status** - Check if earn module is actually enabled on-chain

---

## Data Sources

### Database (Drizzle ORM)

```typescript
// Available directly from DB
-users -
  workspaces -
  workspaceMembers -
  autoEarnConfigs -
  earnDeposits -
  earnWithdrawals -
  incomingDeposits -
  userSafes -
  userFeatures;
```

### Blockchain (Base RPC)

```typescript
import { getSafeBalance } from '@/server/services/safe.service';

// Current Safe balances
const balance = await getSafeBalance({ safeAddress });

// Vault positions (requires vault contract calls)
const vaultBalance = await vaultContract.balanceOf(safeAddress);
const shareValue = await vaultContract.convertToAssets(vaultBalance);
```

### Align API

```typescript
import { alignApi } from '@/server/services/align-api';

// Real-time KYC status
const customer = await alignApi.getCustomer(alignCustomerId);
const kycStatus = customer.kycs[0]?.status;

// Virtual account details
const virtualAccount = await alignApi.getVirtualAccount(alignVirtualAccountId);
```

### Safe Transaction Service

```typescript
// Incoming transfers
const url = `${SAFE_TRANSACTION_SERVICE_URL}/api/v1/safes/${safeAddress}/incoming-transfers/`;
const response = await fetch(url);
const transfers = await response.json();
```

---

## Recommended Admin Panel Enhancements

### 1. Workspace-Focused View

Instead of only user-centric, add workspace dashboard showing:

- Workspace KYB status
- Total assets under management per workspace
- Auto-earn allocation percentages
- Member count and roles

### 2. Financial Metrics Card

```typescript
interface WorkspaceFinancials {
  totalDeposited: string; // From earnDeposits
  currentValue: string; // From blockchain
  totalEarnings: string; // Calculated
  effectiveAPY: number; // Calculated
  autoEarnPercentage: number; // From autoEarnConfigs
  lastAutoEarnRun: Date | null; // From autoEarnConfigs
}
```

### 3. KYC/KYB Status Dashboard

Show unified view of:

- User-level KYC status
- Workspace-level KYB status
- Pending verifications
- Failed/rejected cases needing attention

### 4. Auto-Earn Monitoring

Track:

- Which users/workspaces have auto-earn enabled
- Last execution timestamp
- Unswept deposits (from `incomingDeposits` where `swept = false`)
- Sweep success rate

### 5. Blockchain Data Integration

Add tab for:

- Real-time Safe balances
- Vault positions and APYs
- Recent transactions
- Gas costs for auto-earn operations

---

## Implementation Priority

1. ✅ Add workspace-level fields to user details dialog
2. ⚙️ Create workspace-specific admin queries
3. 📊 Add financial metrics calculations
4. 🔗 Integrate blockchain data fetching
5. 📈 Build auto-earn monitoring dashboard
6. 🔔 Add alerts for stuck/failed auto-earn operations

---

## Example Query: Get Workspace Financial Summary

```typescript
async function getWorkspaceFinancials(workspaceId: string) {
  // Get all safes for this workspace
  const safes = await db.query.userSafes.findMany({
    where: eq(userSafes.workspaceId, workspaceId),
  });

  // Get all earn deposits
  const deposits = await db.query.earnDeposits.findMany({
    where: eq(earnDeposits.workspaceId, workspaceId),
  });

  const totalDeposited = deposits.reduce(
    (sum, d) => sum + BigInt(d.assetsDeposited),
    0n,
  );

  // Fetch current blockchain values
  const currentValues = await Promise.all(
    safes.map((s) => getSafeBalance({ safeAddress: s.safeAddress })),
  );

  const totalCurrent = currentValues.reduce(
    (sum, b) => sum + (b?.raw ?? 0n),
    0n,
  );

  return {
    totalDeposited: formatUnits(totalDeposited, 6),
    currentValue: formatUnits(totalCurrent, 6),
    earnings: formatUnits(totalCurrent - totalDeposited, 6),
    percentGain:
      (Number(totalCurrent - totalDeposited) / Number(totalDeposited)) * 100,
  };
}
```
