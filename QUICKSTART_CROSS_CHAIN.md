# Quick Start: Cross-Chain Arbitrum Vault

## Goal
Add Morpho Gauntlet USDC Core vault on Arbitrum (`0x7e97fa6893871A2751B5fE961978DCCb2c201E65`) to your Base-only Safe.

## What You'll Need
- Deployer private key with ETH on Base and Arbitrum
- RPC URLs for both chains
- 10 minutes

## Step 1: Deploy Contracts (5 min)

```bash
cd packages/fluidkey-earn-module

# Set your private key
export DEPLOYER_PRIVATE_KEY=0x...

# Deploy on Arbitrum first
forge script script/DeployCrossChainVaults.s.sol:DeployCrossChainVaults \
  --sig "deployReceiver()" \
  --rpc-url https://arb1.arbitrum.io/rpc \
  --broadcast

# Save the receiver address
export CROSS_CHAIN_VAULT_RECEIVER_ARBITRUM=0x...

# Deploy on Base
forge script script/DeployCrossChainVaults.s.sol:DeployCrossChainVaults \
  --sig "deployManager()" \
  --rpc-url https://mainnet.base.org \
  --broadcast

# Save the manager address
export CROSS_CHAIN_VAULT_MANAGER_BASE=0x...
```

## Step 2: Configure Frontend (2 min)

```bash
cd packages/web

# Add to .env.local
echo "NEXT_PUBLIC_CROSS_CHAIN_VAULT_MANAGER_BASE=$CROSS_CHAIN_VAULT_MANAGER_BASE" >> .env.local
echo "NEXT_PUBLIC_CROSS_CHAIN_VAULT_RECEIVER_ARBITRUM=$CROSS_CHAIN_VAULT_RECEIVER_ARBITRUM" >> .env.local
echo "ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc" >> .env.local
```

## Step 3: Test It (3 min)

```bash
# Start dev server
pnpm dev

# Navigate to:
# http://localhost:3000/dashboard/vaults/cross-chain

# Test deposit:
# 1. Enter amount (e.g., 10 USDC for testing)
# 2. Click "Deposit via Across Bridge"
# 3. Wait ~30 seconds
# 4. Check balance updates

# Test withdrawal:
# 1. Enter amount
# 2. Click "Withdraw (on Arbitrum)"
# 3. Confirm transaction
# 4. USDC appears in Safe on Arbitrum
```

## That's It!

You now have:
- ✅ Cross-chain deposit functionality
- ✅ Vault balance tracking on Arbitrum
- ✅ Direct withdrawal from Arbitrum

## Costs

- Deployment: ~$55 one-time
- Per deposit: ~0.5% bridge fee + gas
- Per withdrawal: ~$1-2 gas on Arbitrum

## Architecture

```
BASE                          ARBITRUM
----                          --------
User's Safe                   
    ↓ deposit                 
CrossChainVaultManager        
    ↓ Across Bridge          
                              CrossChainVaultReceiver
                                  ↓
                              Morpho Vault
                                  ↓
                              Shares to User's Safe
```

## Files Created

**Smart Contracts:**
- `packages/fluidkey-earn-module/src/CrossChainVaultReceiver.sol`
- `packages/fluidkey-earn-module/src/CrossChainVaultManager.sol`
- `packages/fluidkey-earn-module/script/DeployCrossChainVaults.s.sol`

**Frontend:**
- `packages/web/src/lib/across-constants.ts`
- `packages/web/src/lib/hooks/use-cross-chain-deposit.ts`
- `packages/web/src/lib/hooks/use-cross-chain-vault-balance.ts`
- `packages/web/src/server/earn/cross-chain-vaults.ts`
- `packages/web/src/components/vault/cross-chain-deposit-card.tsx`
- `packages/web/src/components/vault/cross-chain-withdraw-card.tsx`
- `packages/web/src/app/(authenticated)/dashboard/vaults/cross-chain/page.tsx`

## Documentation

- **Full spec:** `roadmap/across-arbitrum-morpho-implementation.md`
- **Simple guide:** `roadmap/across-arbitrum-morpho-simple.md`
- **Summary:** `CROSS_CHAIN_VAULT_SUMMARY.md`

## Troubleshooting

**"Cross-chain vault manager not configured"**
- Check environment variables are set correctly
- Restart dev server after adding env vars

**"Vault not allowed"**
- Run on receiver contract:
  ```bash
  cast send $RECEIVER_ADDRESS \
    "setVaultAllowed(address,bool)" \
    0x7e97fa6893871A2751B5fE961978DCCb2c201E65 \
    true \
    --rpc-url https://arb1.arbitrum.io/rpc
  ```

**Deposit stuck**
- Check Across bridge status: https://across.to/
- Typical bridge time: 10-30 seconds
- Max wait: 2 minutes before investigating

**Need help?**
- Across docs: https://docs.across.to/
- Morpho docs: https://docs.morpho.org/
