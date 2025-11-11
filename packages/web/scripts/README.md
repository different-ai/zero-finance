# Debugging Scripts for Cross-Chain Deposits

## Finding Your Workspace and Safe Addresses

### Step 1: Find Your Workspace ID

First, find your workspace ID using your email or Privy DID:

```bash
pnpm --filter @zero-finance/web tsx scripts/find-user-workspace.ts user@example.com
```

This will show:

- Your user ID and Privy DID
- Your workspace ID
- All Safe addresses across all chains

### Step 2: Find All Safe Addresses

**IMPORTANT:** Each chain has a DIFFERENT Safe address (despite the schema documentation claiming CREATE2 deterministic deployment).

```bash
pnpm --filter @zero-finance/web tsx scripts/find-workspace-safes.ts <workspace-id>
```

This will list all your Safes with addresses per chain (Base, Arbitrum, etc.).

## Quick Status Check (Per Chain)

Once you have the correct Safe address for a specific chain:

```bash
pnpm --filter @zero-finance/web tsx scripts/check-deposit-status.ts 0x341Eb50366F22161C90EDD4505d2916Ae275595e
```

**Output:**

```
🔍 Cross-Chain Deposit Status Check

Safe: 0x341Eb50366F22161C90EDD4505d2916Ae275595e
══════════════════════════════════════════════════════════════════

📍 BASE CHAIN
──────────────────────────────────────────────────────────────────
USDC in Safe: $0.00
✅ No USDC on Base (expected after deposit)

📍 ARBITRUM CHAIN
──────────────────────────────────────────────────────────────────
USDC in Safe: $0.00
Vault Shares: 995000
Vault Balance: $0.995 USDC

🎉 SUCCESS! Funds are in the vault earning yield!

══════════════════════════════════════════════════════════════════
📊 SUMMARY

Total on Base:     $0.00
Total on Arbitrum: $0.995
─────────────────────────────────
Grand Total:       $0.995

✅ Everything looks good!
   → View on Morpho: https://app.morpho.org/vault?vault=0x7e97...&network=arbitrum
```

## Detailed Position Check (With Morpho API)

For more detailed information including APY and total vault stats:

```bash
pnpm --filter @zero-finance/web tsx scripts/debug-arbitrum-position.ts 0x341Eb50366F22161C90EDD4505d2916Ae275595e
```

**What it checks:**

1. USDC balance on Base
2. USDC balance on Arbitrum
3. Morpho vault shares and assets
4. Morpho GraphQL API data (vault APY, total assets, your position)

## Common Scenarios

### Scenario 1: Balance shows $0 everywhere

```
📊 SUMMARY
Total on Base:     $0.00
Total on Arbitrum: $0.00
Grand Total:       $0.00

🤔 No funds found on either chain!
```

**Possible reasons:**

- Deposit still processing (wait 60 seconds)
- Deposit transaction failed on Base
- Wrong Safe address

**Next steps:**

1. Wait 60 seconds and run script again
2. Check Base transaction on BaseScan
3. Look for your deposit transaction in browser console logs

### Scenario 2: USDC on Arbitrum but not in vault

```
📍 ARBITRUM CHAIN
USDC in Safe: $1.00
⚠️  USDC on Arbitrum but NOT in vault - multicall may have failed!
Vault Shares: 0
```

**What happened:**

- Across bridge succeeded (USDC arrived on Arbitrum)
- But the automatic vault deposit (multicall) failed

**Fix:**

1. Check Arbiscan for failed transactions
2. Manually deposit the USDC to the vault on Morpho app
3. Or contact support

### Scenario 3: USDC still on Base

```
📍 BASE CHAIN
USDC in Safe: $1.00
⚠️  WARNING: USDC still on Base - deposit may have failed!
```

**What happened:**

- Deposit transaction never completed successfully
- Or Across bridge deposit failed

**Fix:**

1. Check BaseScan for the deposit transaction
2. Look for transaction errors or reverts
3. Try depositing again

## Troubleshooting Checklist

When funds don't appear after 20+ minutes:

- [ ] Run `check-deposit-status.ts` script
- [ ] Check browser console for `[CrossChainDeposit]` logs
- [ ] Find Base transaction hash from UI success screen
- [ ] Check Base transaction on BaseScan
- [ ] Check Arbitrum Safe address on Arbiscan
- [ ] Look for USDC Transfer events on Arbiscan
- [ ] Contact support with transaction hashes

## Environment Variables

These scripts work out of the box, but you can override RPC URLs:

```bash
# In .env.local
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc
```

## Manual Checks

### Check Vault on Morpho App

1. Visit: https://app.morpho.org/vault?vault=0x7e97fa6893871A2751B5fE961978DCCb2c201E65&network=arbitrum
2. Connect your wallet
3. Switch to Arbitrum network
4. View your position

### Query Morpho GraphQL Directly

Visit: https://api.morpho.org/graphql

```graphql
query {
  vaultByAddress(
    address: "0x7e97fa6893871A2751B5fE961978DCCb2c201E65"
    chainId: 42161
  ) {
    state {
      totalAssets
      apy
      netApy
    }
  }
}
```

## Support Information to Provide

If you need help from support, run the status script and provide:

1. Safe address
2. Script output (screenshot or copy/paste)
3. Base transaction hash
4. Timestamp of deposit
5. Amount deposited

## Files

### Workspace & Safe Discovery

- `find-user-workspace.ts` - Find workspace ID by email/Privy DID
- `find-workspace-safes.ts` - List all Safe addresses per chain for a workspace

### Balance & Position Checking

- `check-deposit-status.ts` - Quick balance checker (recommended)
- `debug-arbitrum-position.ts` - Detailed checker with Morpho API
- `trace-across-bridge.ts` - Traces Across bridge transaction (advanced, has errors - don't use yet)

## Important Note: Non-Deterministic Safe Addresses

⚠️ **Critical Issue:** The current implementation creates DIFFERENT Safe addresses per chain, despite the database schema documentation claiming CREATE2 deterministic deployment.

**Why this matters:**

- Your Base Safe address is DIFFERENT from your Arbitrum Safe address
- You cannot assume the same address works across chains
- Always use `find-workspace-safes.ts` to get the correct address per chain

**Root cause:**

- The code uses `saltNonce = Date.now().toString()` in `create-safe-card.tsx:220`
- This creates a unique salt per deployment, resulting in different addresses
- Each chain deployment happens at a different time, so gets a different salt

**Fix needed:**

- Use a deterministic salt (e.g., hash of workspace ID)
- This would allow CREATE2 to generate the same address across all chains
