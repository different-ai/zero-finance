# Cross-Chain Vault Deployment Guide

## What Was Built

Complete integration for cross-chain vaults (Arbitrum Morpho + Hyperliquid HLP) with manual deposit/withdraw workflows.

### Files Created

#### Configuration
- `packages/web/src/server/earn/cross-chain-vaults.ts` - Vault definitions for Arbitrum & HLP
- `packages/web/src/lib/constants/across.ts` - Across Protocol addresses & constants

#### Smart Contracts
- `packages/fluidkey-earn-module/src/HLPVoucher.sol` - NFT voucher for HLP positions
- `packages/fluidkey-earn-module/script/DeployHLPVoucher.s.sol` - Deployment script

#### React Hooks
- `packages/web/src/lib/hooks/use-across-bridge.ts` - Across Protocol bridging hook

#### UI Components
- `packages/web/src/app/(authenticated)/dashboard/savings/components/cross-chain-deposit-card.tsx` - Arbitrum deposits via Across
- `packages/web/src/app/(authenticated)/dashboard/savings/components/cross-chain-withdraw-card.tsx` - Arbitrum withdrawals
- `packages/web/src/app/(authenticated)/dashboard/savings/components/hlp-deposit-card.tsx` - HLP deposits (contact team)
- `packages/web/src/app/(authenticated)/dashboard/savings/components/hlp-withdraw-card.tsx` - HLP withdrawals (contact team)

#### Integration
- `packages/web/src/app/(authenticated)/dashboard/savings/page-wrapper.tsx` - Updated to show cross-chain vaults

## Deployment Steps

### Step 1: Deploy HLP Voucher Contract (Base Mainnet)

```bash
cd packages/fluidkey-earn-module

# Set environment variables
export PRIVATE_KEY="your_private_key"
export BASE_RPC_URL="https://mainnet.base.org"
export BASESCAN_API_KEY="your_basescan_key"

# Deploy
forge script script/DeployHLPVoucher.s.sol:DeployHLPVoucher \
  --rpc-url $BASE_RPC_URL \
  --broadcast \
  --verify \
  --etherscan-api-key $BASESCAN_API_KEY

# Save the deployed address
# Output will show: "HLPVoucher deployed to: 0x..."
```

### Step 2: Update Environment Variables

```bash
# packages/web/.env.local

# Add HLP Voucher contract address from Step 1
NEXT_PUBLIC_HLP_VOUCHER_ADDRESS=0x...

# Across Protocol works out of the box (addresses hardcoded in code)
# No additional env vars needed for Across
```

### Step 3: Authorize Solver (HLP Only)

For HLP deposits to work, you need to authorize a solver address:

```bash
# Using cast (from Foundry)
cast send $HLP_VOUCHER_ADDRESS \
  "setAuthorizedSolver(address,bool)" \
  $SOLVER_ADDRESS \
  true \
  --rpc-url $BASE_RPC_URL \
  --private-key $PRIVATE_KEY

# Verify
cast call $HLP_VOUCHER_ADDRESS \
  "authorizedSolvers(address)" \
  $SOLVER_ADDRESS \
  --rpc-url $BASE_RPC_URL
```

## How It Works

### Arbitrum Morpho Vault (via Across Protocol)

#### Deposit Flow
1. User clicks "Deposit" on Arbitrum vault in savings page
2. UI shows `CrossChainDepositCard`
3. User enters amount (e.g., 1000 USDC)
4. Hook calls Across Protocol:
   - Approves USDC on Base to Across SpokePool
   - Calls `depositV3()` to bridge USDC from Base → Arbitrum
   - Across relayer fronts USDC to user's Safe on Arbitrum (~20 seconds)
5. User manually deposits to Morpho vault on Arbitrum using Morpho app

#### Withdraw Flow
1. User clicks "Withdraw" on Arbitrum vault
2. UI shows `CrossChainWithdrawCard` with instructions
3. User switches to Arbitrum network
4. User visits Morpho app directly
5. User withdraws from vault to their Safe on Arbitrum
6. (Optional) User bridges back to Base using Across

### Hyperliquid HLP Vault (via Voucher System)

#### Deposit Flow
1. User clicks "Deposit" on HLP vault
2. UI shows `HLPDepositCard`
3. User clicks "Contact Team to Deposit"
4. Manual process:
   - User contacts support@0finance.com
   - Team manually processes deposit to HLP on Hyperliquid
   - Team mints HLP Voucher NFT to user's Safe on Base
   - User receives NFT representing HLP position

#### Withdraw Flow
1. User clicks "Withdraw" on HLP vault
2. UI shows `HLPWithdrawCard`
3. User clicks "Contact Team to Withdraw"
4. Manual process:
   - User contacts support@0finance.com
   - Team processes withdrawal from HLP
   - Team bridges USDC back to Base
   - User receives USDC in Safe on Base

## Testing

### Test Arbitrum Deposits (Mainnet)

```bash
# 1. Make sure you have USDC on Base
# 2. Visit savings page
# 3. Find "Arbitrum High-Yield" vault
# 4. Click "Deposit"
# 5. Enter amount (start small, e.g., $10)
# 6. Approve + Bridge
# 7. Wait ~20 seconds
# 8. Check USDC arrived on Arbitrum at your Safe address
# 9. Visit Morpho app to complete deposit
```

### Test HLP (Mainnet - Manual)

```bash
# 1. Visit savings page
# 2. Find "HLP Trading Vault"
# 3. Click "Deposit"
# 4. Click "Contact Team"
# 5. Email support@0finance.com with:
#    - Your Safe address
#    - Amount to deposit
#    - Confirmation you understand risks
# 6. Team processes manually
# 7. Receive HLP Voucher NFT
```

## Vault Configuration

### Adding More Vaults

Edit `packages/web/src/server/earn/cross-chain-vaults.ts`:

```typescript
// Add a new Arbitrum vault
export const ARBITRUM_MORPHO_VAULTS: CrossChainVault[] = [
  // Existing vault
  {
    id: 'morpho-arb-gauntlet',
    name: 'Gauntlet USDC Core (Arbitrum)',
    // ...
  },
  
  // New vault
  {
    id: 'morpho-arb-new-vault',
    name: 'New Vault Name',
    displayName: 'User-Friendly Name',
    address: '0x...',
    risk: 'Balanced',
    curator: 'Curator Name',
    appUrl: 'https://app.morpho.org/...',
    chainId: ARBITRUM_CHAIN_ID,
    chainName: 'Arbitrum',
    type: 'morpho',
    bridgeProtocol: 'across',
  },
];
```

Vault appears automatically on savings page - no other changes needed!

## Costs

### Deployment
- HLP Voucher contract: ~$30-50 (one-time, Base mainnet)

### Operations
- Arbitrum deposit via Across: ~$0.50-$1 (0.5% fee) per transfer
- HLP deposit: Manual (team processing)
- Arbitrum withdraw: ~$1-2 gas (on Arbitrum, cheap)
- HLP withdraw: Manual (team processing)

## Security Notes

### Across Protocol
- Battle-tested: $6B+ volume
- Decentralized relayer network
- Optimistic verification (2-hour challenge period)
- Users get refund if transfer fails

### HLP Voucher
- Owner-controlled (you control authorized solvers)
- NFT represents off-chain position
- User can't be rugged (they own the NFT)
- Manual redemption process adds safety layer

## Monitoring

### Check Across Deposits

```bash
# Check if USDC arrived on Arbitrum
cast balance $SAFE_ADDRESS --erc20 $USDC_ARBITRUM --rpc-url $ARBITRUM_RPC_URL

# View Across deposit events
cast logs --from-block latest --to-block latest \
  --address $ACROSS_SPOKE_POOL_BASE \
  --event-name "V3FundsDeposited" \
  --rpc-url $BASE_RPC_URL
```

### Check HLP Vouchers

```bash
# Get all vouchers owned by a Safe
cast call $HLP_VOUCHER_ADDRESS \
  "getVouchersByOwner(address)" \
  $SAFE_ADDRESS \
  --rpc-url $BASE_RPC_URL

# Get voucher details
cast call $HLP_VOUCHER_ADDRESS \
  "getPosition(uint256)" \
  $TOKEN_ID \
  --rpc-url $BASE_RPC_URL
```

## Troubleshooting

### Across bridge stuck
- Check Across status: https://app.across.to/
- Typical fill time: 15-30 seconds
- Max fill time: 30 minutes (then auto-refund)

### HLP voucher not minted
- Verify solver is authorized
- Check solver has enough gas on Base
- Check `VoucherMinted` events in contract

### Vault not showing on UI
- Check vault added to `CROSS_CHAIN_VAULTS`
- Restart dev server (`pnpm dev`)
- Clear browser cache

## Support

For issues:
1. Check deployment addresses in `.env.local`
2. Verify contracts on Basescan
3. Check Across status dashboard
4. Contact team for HLP-related issues

## Summary

You now have:
- ✅ Arbitrum Morpho vault with Across Protocol bridging
- ✅ HLP vault with voucher NFT system
- ✅ Both visible on savings page
- ✅ Manual deposit/withdraw workflows
- ✅ No automation (as requested)

Next steps:
1. Deploy HLP Voucher to Base mainnet
2. Test Arbitrum deposits with small amounts
3. Set up manual HLP processing workflow
4. Monitor usage and iterate
