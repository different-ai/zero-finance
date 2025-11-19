# Cross-Chain Deposit Implementation

## Goal

Enable users to deposit USDC from Base to vaults on Arbitrum via Across Protocol bridge, with automatic vault deposit on the destination chain.

## Current Status: Safe Deployment Flow Complete

The implementation is ~90% complete. The main flow works, but needs testing.

## Architecture

### Flow Overview

1. User selects Arbitrum vault and enters deposit amount
2. System checks if user has a Safe on Arbitrum (database lookup)
3. **If no Safe exists**: Show "Set Up Arbitrum Account" UI
   - User deploys Safe on Arbitrum using Privy smart wallet
   - Safe is registered in database
4. **If Safe exists**: Proceed with bridge deposit
   - Approve SpokePool on Base
   - Bridge USDC via Across with multicall message
   - Across relayer executes approve+deposit on Arbitrum

## Key Files

### Backend

- **`src/server/routers/earn-router.ts`**
  - `depositToVaultWithBridge` - Returns bridge tx data or `needsDeployment` flag
  - `registerDeployedSafe` - Saves deployed Safe to database with chainId
  - `getBridgeQuote` - Gets Across quote for cross-chain transfer

- **`src/server/earn/multi-chain-safe-manager.ts`**
  - `getSafeOnChain()` - Check if Safe exists in database
  - `createSafeRecord()` - Insert new Safe record
  - `getSafeDeploymentTransaction()` - Get deployment tx data

- **`src/server/earn/across-bridge-service.ts`**
  - `getBridgeQuoteForVault()` - Get Across quote
  - `encodeBridgeWithVaultDeposit()` - Encode bridge + multicall

### Frontend

- **`src/app/(authenticated)/dashboard/tools/earn-module/components/deposit-earn-card.tsx`**
  - Main deposit UI component
  - Handles both same-chain and cross-chain deposits
  - Arbitrum Safe deployment flow (lines 720-815)

- **`src/app/(authenticated)/dashboard/savings/page-wrapper.tsx`**
  - Passes `chainId` to vault rows and deposit cards

## What's Done

- [x] Backend returns `needsDeployment: true` when no Arbitrum Safe exists
- [x] Frontend shows "Account Setup Required" UI
- [x] Arbitrum Safe deployment using Privy smart wallet
- [x] `registerDeployedSafe` endpoint to save Safe to database
- [x] Bridge quote fetching and display
- [x] Cross-chain deposit transaction encoding

## What Needs Testing

1. Full Arbitrum Safe deployment flow
2. Bridge deposit after Safe is deployed
3. Across multicall execution on Arbitrum
4. Error handling and edge cases

## Technical Notes

### Safe Address Determinism

We use the Base Safe address as `saltNonce` when deploying on Arbitrum:

```typescript
const saltNonce = safeAddress.toLowerCase(); // Base Safe address
```

This creates a deterministic but different address on Arbitrum.

### No Relayer Needed

Privy smart wallets handle gas sponsorship on both Base and Arbitrum, so no separate relayer infrastructure is needed for Arbitrum transactions.

### Database-First Approach

We never predict addresses for bridge recipients. The bridge only proceeds when a Safe actually exists in the `userSafes` table with the correct `chainId`.
