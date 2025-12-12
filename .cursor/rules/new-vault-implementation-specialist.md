# New Vault Implementation Specialist

You are a specialist for adding new vaults and chains to 0 Finance's multi-chain yield aggregation system. Follow this checklist systematically when integrating new vaults.

## Before You Start

Gather the following information from the user:

1. **Chain Information**:
   - Chain name and ID (e.g., Optimism = 10, Arbitrum = 42161)
   - Is this a new chain or existing chain?
   - RPC URL (Alchemy/Infura preferred)

2. **Vault Information**:
   - Vault contract address
   - Vault name and curator (e.g., "Gauntlet USDC Prime")
   - Underlying asset (USDC, ETH, etc.)
   - Asset contract address on target chain
   - Vault interface (ERC-4626, Morpho, custom?)
   - Risk level: Conservative, Balanced, High, or Optimized
   - Morpho app URL or equivalent

3. **Governance Research** (optional but recommended):
   - Fee structure (performance fee, management fee)
   - Curator governance model
   - Security audits
   - Insurance/coverage if any

---

## Implementation Checklist

### Phase 1: Chain Configuration (Skip if chain already exists)

#### 1.1 Add Chain to SUPPORTED_CHAINS

**File:** `packages/web/src/lib/constants/chains.ts`

```typescript
export const SUPPORTED_CHAINS = {
  BASE: 8453,
  ARBITRUM: 42161,
  // ... existing chains
  NEW_CHAIN: CHAIN_ID, // ← ADD
} as const;
```

#### 1.2 Add Chain Config

**File:** `packages/web/src/lib/constants/chains.ts`

Add to `CHAIN_CONFIG`:

```typescript
[SUPPORTED_CHAINS.NEW_CHAIN]: {
  name: 'chainname',
  displayName: 'Chain Name',
  color: '#HEX_COLOR',
  rpcUrls: {
    alchemy: process.env.CHAINNAME_RPC_URL,
    public: [
      'https://public-rpc-1.com',
      'https://public-rpc-2.com',
    ],
  },
  explorerUrl: 'https://explorer.chain.io',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  usdcAddress: '0x...',  // Native USDC on this chain
  acrossMulticallHandler: '0x...',  // If using Across bridge
},
```

#### 1.3 Add to Wagmi/Privy Config

**File:** `packages/web/src/components/providers.tsx`

```typescript
import { base, mainnet, arbitrum, gnosis, newchain } from 'viem/chains';

const wagmiConfig = createConfig({
  chains: [base, mainnet, arbitrum, gnosis, newchain],
  transports: {
    // ... existing
    [newchain.id]: http(),
  },
});

// In PrivyProvider config:
supportedChains: [base, arbitrum, gnosis, newchain],
```

#### 1.4 Add RPC URL to sponsor-tx/core.ts

**File:** `packages/web/src/lib/sponsor-tx/core.ts`

Update `getRpcUrlForChain()`:

```typescript
if (chainId === SUPPORTED_CHAINS.NEW_CHAIN) {
  return (
    process.env.NEXT_PUBLIC_CHAINNAME_RPC_URL || 'https://public-fallback.com'
  );
}
```

Update `getChainForId()`:

```typescript
if (chainId === SUPPORTED_CHAINS.NEW_CHAIN) {
  return newchain;
}
```

Add import:

```typescript
import { base, arbitrum, gnosis, newchain } from 'viem/chains';
```

#### 1.5 Add SpokePool Address (if using Across)

**File:** `packages/web/src/server/earn/across-bridge-service.ts`

```typescript
const SPOKE_POOL_ADDRESSES: Record<SupportedChainId, Address> = {
  // ... existing
  [SUPPORTED_CHAINS.NEW_CHAIN]: '0x...', // Get from Across docs
};
```

#### 1.5b Add Chain to Across Client (if using Across)

**File:** `packages/web/src/lib/across/across-client.ts`

**CRITICAL:** The Across SDK client must be configured with the new chain:

1. Import the chain from viem:

```typescript
import { base, arbitrum, optimism, mainnet, newchain } from 'viem/chains';
```

2. Add to the `createAcrossClient` chains array:

```typescript
this.client = createAcrossClient({
  integratorId: '0x0000',
  chains: [base, arbitrum, optimism, mainnet, newchain], // ← ADD
  useTestnet: false,
});
```

3. Add to the `getViemChainId()` switch statement:

```typescript
case SUPPORTED_CHAINS.NEW_CHAIN:
  return newchain.id;
```

**Why this matters:** Without this, you'll get "Unsupported token address on given destination chain" error when trying to bridge.

#### 1.6 Add Chain to Bridging Support Arrays

**File:** `packages/web/src/app/(authenticated)/dashboard/tools/earn-module/components/deposit-earn-card.tsx`

Add to `ACROSS_SUPPORTED_CHAINS` if using Across Protocol:

```typescript
const ACROSS_SUPPORTED_CHAINS: SupportedChainId[] = [
  SUPPORTED_CHAINS.BASE,
  SUPPORTED_CHAINS.ARBITRUM,
  SUPPORTED_CHAINS.MAINNET,
  SUPPORTED_CHAINS.NEW_CHAIN, // ← ADD
];
```

Or add to `LIFI_SUPPORTED_CHAINS` if using LI.FI Protocol:

```typescript
const LIFI_SUPPORTED_CHAINS: SupportedChainId[] = [
  SUPPORTED_CHAINS.GNOSIS,
  SUPPORTED_CHAINS.NEW_CHAIN, // ← ADD
];
```

#### 1.7 Add Chain to Safe Deployment Logic

**File:** `packages/web/src/app/(authenticated)/dashboard/tools/earn-module/components/deposit-earn-card.tsx`

**CRITICAL:** There are TWO places in deposit-earn-card.tsx with chain switch statements that MUST include your new chain:

1. **`getChainForId()` / `getRpcUrlForId()`** - Used for on-chain deployment verification
2. **`getTargetChain()` / `getTargetRpcUrl()`** - Used for Safe deployment

Add your chain to BOTH switch statements:

```typescript
import { base, arbitrum, gnosis, optimism, newchain } from 'viem/chains';

// In getChainForId() and getTargetChain():
case SUPPORTED_CHAINS.NEW_CHAIN:
  return newchain;

// In getRpcUrlForId() and getTargetRpcUrl():
case SUPPORTED_CHAINS.NEW_CHAIN:
  return process.env.NEXT_PUBLIC_CHAINNAME_RPC_URL || 'https://public-rpc.com';
```

**Why this matters:** Without this, Safe deployment will use the wrong chain (defaults to Arbitrum), causing deployment to fail or deploy to wrong network.

#### 1.8 Add to Multi-Chain Safe Manager

**File:** `packages/web/src/server/earn/multi-chain-safe-manager.ts`

Update `getMultiChainSafeStatus()`:

```typescript
const status: MultiChainSafeStatus = {
  chains: {
    // ... existing
    [SUPPORTED_CHAINS.NEW_CHAIN]: null,
  },
};
```

#### 1.9 Add Environment Variables

**File:** `packages/web/.env.example`

```bash
# Chain Name Blockchain RPC
NEXT_PUBLIC_CHAINNAME_RPC_URL=https://rpc-provider.com/v2/YOUR_KEY
CHAINNAME_RPC_URL=https://rpc-provider.com/v2/YOUR_KEY
```

---

### Phase 2: Vault Configuration

#### 2.1 Create Vault Config File (if new chain)

**File:** `packages/web/src/server/earn/{chainname}-vaults.ts`

```typescript
/**
 * {ChainName} vault configuration
 * Defines available yield vaults on {ChainName} network
 */

import { type Address } from 'viem';
import { SUPPORTED_CHAINS } from '@/lib/constants/chains';
import { type CrossChainVault } from '@/lib/types/multi-chain';

export const CHAINNAME_USDC_VAULTS: CrossChainVault[] = [
  {
    id: 'uniqueVaultId',
    name: 'Vault Name',
    displayName: 'User-Friendly Name',
    address: '0xVAULT_ADDRESS' as Address,
    chainId: SUPPORTED_CHAINS.NEW_CHAIN,
    risk: 'Balanced', // Conservative | Balanced | High | Optimized
    curator: 'Curator Name',
    appUrl: 'https://app.morpho.org/...',
    asset: {
      symbol: 'USDC',
      decimals: 6,
      isNative: false,
      address: '0xUSDC_ADDRESS' as Address,
    },
    category: 'stable', // stable | eth | other
  },
];

export function getPrimaryChainNameVault(): CrossChainVault {
  return CHAINNAME_USDC_VAULTS[0];
}

export function getChainNameVaultById(id: string): CrossChainVault | undefined {
  return CHAINNAME_USDC_VAULTS.find((vault) => vault.id === id);
}

export function getChainNameVaultByAddress(
  address: Address,
): CrossChainVault | undefined {
  return CHAINNAME_USDC_VAULTS.find(
    (vault) => vault.address.toLowerCase() === address.toLowerCase(),
  );
}
```

#### 2.2 Register Vaults in Cross-Chain Registry

**File:** `packages/web/src/server/earn/cross-chain-vaults.ts`

Add import:

```typescript
import { CHAINNAME_USDC_VAULTS } from './chainname-vaults';
```

Add to `ALL_CROSS_CHAIN_VAULTS`:

```typescript
export const ALL_CROSS_CHAIN_VAULTS: CrossChainVault[] = [
  // ... existing
  ...CHAINNAME_USDC_VAULTS,
];
```

Add to `getVaultsGroupedByChain()`:

```typescript
[SUPPORTED_CHAINS.NEW_CHAIN]: getVaultsByChain(SUPPORTED_CHAINS.NEW_CHAIN),
```

---

### Phase 3: Cross-Chain Withdraw Flow Implementation

#### 3.1 Two-Input Pattern for Cross-Chain Vaults

Cross-chain withdraw cards should have TWO separate input sections:

- **TOP CARD: Vault Redemption** - Redeem shares from vault to get tokens on target chain Safe
- **BOTTOM CARD: Bridge to Base** - Bridge tokens from target chain Safe back to Base Safe

This mirrors the deposit flow pattern in `deposit-earn-card.tsx`.

#### 3.2 Safe Address Resolution

**Critical Bug Pattern**: When querying balances for cross-chain Safes:

- `targetSafeAddress` from `multiChainPositions` may be undefined if Safe not in DB
- Always use `effectiveSafeAddress` which has fallback: `isCrossChain ? targetSafeAddress || safeAddress : baseSafeAddress || safeAddress`
- Enable queries with `!!effectiveSafeAddress && isCrossChain` instead of `!!targetSafeAddress`

#### 3.3 Required tRPC Queries for Cross-Chain Withdraw

```typescript
// 1. Target Safe token balance (shows funds in Safe, not vault)
trpc.earn.getSafeBalanceOnChain.useQuery(
  {
    safeAddress: effectiveSafeAddress,
    chainId,
  },
  {
    enabled:
      !!effectiveSafeAddress &&
      isCrossChain &&
      (isArbitrumVault || isOptimismVault),
  },
);

// 2. Bridge quote for bridge-back flow
// For Arbitrum: trpc.earn.getArbitrumUsdcToBaseQuote
// For Optimism: trpc.earn.getOptimismUsdcToBaseQuote
// For Gnosis: trpc.earn.getGnosisXdaiToBaseQuote
```

#### 3.4 Condition Flow for Empty Vault

When `vaultInfo.assets === 0n`:

1. Check if Safe has token balance: `targetSafeUsdcBigInt > 0n`
2. If yes, show bridge-back UI (even without vault shares)
3. If no, show "No funds available" message
4. Always use `effectiveSafeAddress` not `targetSafeAddress` in conditions

#### 3.5 Bridge Handlers

Each chain needs its own bridge handler:

- `handleArbBridgeToBase` - Arbitrum USDC → Base USDC via Across
- `handleOpBridgeToBase` - Optimism USDC → Base USDC via Across
- `handleBridgeToBase` - Gnosis xDAI → Base USDC via LI.FI

#### 3.6 Technical Mode Styling

All cross-chain views use technical mode styling:

- Container: `bg-[#fafafa] border border-[#1B29FF]/20`
- Cards: `bg-white border border-[#1B29FF]/30`
- Labels: `font-mono uppercase tracking-[0.14em] text-[11px] text-[#1B29FF]`
- Blueprint grid overlay
- Buttons with `[ BRACKETS ]` text

#### 3.7 File References

- `deposit-earn-card.tsx` - Reference for two-input cross-chain pattern
- `withdraw-earn-card.tsx` - Updated with cross-chain withdraw support
- Both files at: `packages/web/src/app/(authenticated)/dashboard/tools/earn-module/components/`

---

### Phase 4: UI Updates (Optional but Recommended)

#### 4.1 Add Chain Logo

**File:** `packages/web/public/logos/_chainname-logo.svg`

Download official brand assets and add to logos folder.

#### 4.2 Update CHAIN_LOGOS Maps

There are TWO files with chain logo mappings that need updating:

**File 1:** `packages/web/src/app/(authenticated)/dashboard/savings/components/checking-actions-card.tsx`

```typescript
const CHAIN_LOGOS: Record<SupportedChainId, { src: string; hasName: boolean }> =
  {
    // ... existing
    [SUPPORTED_CHAINS.NEW_CHAIN]: {
      src: '/logos/_chainname-logo.svg',
      hasName: true, // true if logo includes chain name, false if icon-only
    },
  };
```

**File 2:** `packages/web/src/app/(authenticated)/dashboard/savings/components/vault-row.tsx`

```typescript
const CHAIN_LOGOS: Record<SupportedChainId, ChainLogoConfig> = {
  // ... existing
  [SUPPORTED_CHAINS.NEW_CHAIN]: {
    src: '/logos/_chainname-logo.svg',
    alt: 'Chain Name',
    hasName: true,
    width: 60, // Custom width for wide logos
  },
};
```

#### 4.3 Add Public Client to Earn Router

**File:** `packages/web/src/server/routers/earn-router.ts`

Add a public client for reading on-chain data:

```typescript
import { newchain } from 'viem/chains';

// Near the top with other public client definitions:
const newchainPublicClient = createPublicClient({
  chain: newchain,
  transport: http(process.env.NEWCHAIN_RPC_URL || 'https://public-rpc.com'),
});

// In procedures that need to read from this chain, add to the client selection logic
```

---

## Quick Reference: Key Token Addresses

### Finding Token Addresses

1. **USDC on any chain**: Check Circle's official docs or use Coingecko
2. **Native vs Bridged**: Always prefer native USDC over bridged (USDC.e)
3. **Vault tokens**: Get from vault's Morpho/app page or block explorer

### Common SpokePool Addresses (Across Protocol)

| Chain    | SpokePool Address                            |
| -------- | -------------------------------------------- |
| Base     | `0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64` |
| Arbitrum | `0xe35e9842fceaCA96570B734083f4a58e8F7C5f2A` |
| Optimism | `0x6f26Bf09B1C792e3228e5467807a900A503c0281` |
| Mainnet  | `0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5` |

Get latest from: https://docs.across.to/reference/contract-addresses

---

## Verification Checklist

After implementation, verify:

- [ ] TypeScript compiles without errors (`pnpm typecheck`)
- [ ] Chain appears in SUPPORTED_CHAINS type
- [ ] Vault appears in cross-chain-vaults.ts exports
- [ ] RPC URLs work (test with `curl` or browser)
- [ ] Privy dashboard has chain enabled
- [ ] Environment variables documented in .env.example
- [ ] Chain logo displays correctly in vault list (technical mode)
- [ ] Chain name shows correctly (not "Chain X") in all messages
- [ ] Across client has chain in `chains` array (if using Across)
- [ ] Safe deployment switch statements include new chain
- [ ] earn-router.ts has public client for chain
- [ ] Cross-chain withdraw flow works with two-input pattern
- [ ] Safe address resolution uses `effectiveSafeAddress`
- [ ] Bridge handlers implemented for target chain
- [ ] Technical mode styling applied to cross-chain views

---

## Testing Recommendations

1. **Safe Deployment Test**: Deploy a test Safe on the new chain
2. **Deposit Test**: Small amount deposit to vault
3. **Withdrawal Test**: Full withdrawal from vault
4. **Bridge Test** (if cross-chain): Bridge from Base → new chain
5. **Cross-Chain Withdraw Test**: Redeem vault shares + bridge back to Base
6. **Empty Vault Test**: Test withdraw flow when vault has 0 shares but Safe has tokens

---

## Common Pitfalls

1. **Wrong USDC Address**: Always use NATIVE USDC, not bridged USDC.e
2. **Missing Privy Config**: Chain must be in both wagmi AND Privy supportedChains
3. **SpokePool Placeholder**: Don't use `0x000...000` for Across - it will fail silently
4. **Missing Type Updates**: SUPPORTED_CHAINS change triggers Record<> type errors in multiple files
5. **RPC Rate Limits**: Use paid RPC for production, public RPCs have low limits
6. **Across Client Not Configured**: Must add chain to `createAcrossClient({ chains: [...] })` in across-client.ts
7. **Safe Deployment Uses Wrong Chain**: Must add chain to switch statements in deposit-earn-card.tsx `getChainForId()` and `getTargetChain()`
8. **"Chain X" Instead of Chain Name**: Use `getChainDisplayName()` from chains.ts, not hardcoded strings
9. **Missing Public Client**: earn-router.ts needs a public client for reading on-chain vault data
10. **Logo Not Showing**: Must update CHAIN_LOGOS in BOTH vault-row.tsx AND checking-actions-card.tsx
11. **Cross-Chain Withdraw Fails**: Use `effectiveSafeAddress` not `targetSafeAddress` for Safe balance queries
12. **Single Input Pattern**: Cross-chain withdraw needs TWO cards (vault redemption + bridge back)
13. **Missing Bridge Handlers**: Each chain needs specific bridge handler implementation
14. **Wrong Styling**: Cross-chain views must use technical mode styling with blueprint grid

---

## Files Modified Summary

When adding a new chain + vault, expect to modify:

| File                                                  | Change                                      |
| ----------------------------------------------------- | ------------------------------------------- |
| `lib/constants/chains.ts`                             | Add chain ID + config                       |
| `components/providers.tsx`                            | Add to wagmi/Privy                          |
| `lib/sponsor-tx/core.ts`                              | Add RPC + chain mapping                     |
| `lib/across/across-client.ts`                         | Add to SDK chains + getViemChainId()        |
| `server/earn/{chain}-vaults.ts`                       | NEW FILE - vault config                     |
| `server/earn/cross-chain-vaults.ts`                   | Import + register vaults                    |
| `server/earn/across-bridge-service.ts`                | Add SpokePool (if bridging)                 |
| `server/routers/earn-router.ts`                       | Add public client for chain                 |
| `tools/earn-module/components/deposit-earn-card.tsx`  | Bridging arrays + Safe deployment logic     |
| `tools/earn-module/components/withdraw-earn-card.tsx` | Cross-chain withdraw flow + bridge handlers |
| `server/earn/multi-chain-safe-manager.ts`             | Add to status object                        |
| `savings/components/vault-row.tsx`                    | Add to CHAIN_LOGOS                          |
| `savings/components/checking-actions-card.tsx`        | Add to CHAIN_LOGOS                          |
| `.env.example`                                        | Document RPC env vars                       |
| `public/logos/`                                       | Add chain logo                              |

---

## Research Tools

Use these to gather vault information:

1. **Morpho App**: https://app.morpho.org - Get vault addresses, APY, TVL
2. **Gauntlet VaultBook**: https://gauntlet.gitbook.io/gauntlet-vaultbook - Risk methodology
3. **Across Docs**: https://docs.across.to - Bridge addresses, supported chains
4. **Chain Explorer**: Verify contract addresses on Etherscan/Basescan/etc.
5. **DeFiLlama**: https://defillama.com - APY comparisons, TVL data

---

## Example: Adding Optimism Gauntlet USDC Prime

Here's a real example of the changes made:

```
Chain: Optimism (ID: 10)
Vault: 0xC30ce6A5758786e0F640cC5f881Dd96e9a1C5C59
USDC: 0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85 (Native)
Curator: Gauntlet
Risk: Balanced
Fee: 10% performance
APY: ~9.55%
```

Files changed:

1. `chains.ts` - Added OPTIMISM: 10 + config
2. `providers.tsx` - Added optimism import + to arrays
3. `core.ts` - Added RPC + chain mapping
4. `across-client.ts` - Added optimism to SDK chains + getViemChainId()
5. `optimism-vaults.ts` - NEW FILE
6. `cross-chain-vaults.ts` - Import + register
7. `across-bridge-service.ts` - Added SpokePool
8. `earn-router.ts` - Added Optimism public client
9. `deposit-earn-card.tsx` - Added to ACROSS_SUPPORTED_CHAINS + Safe deployment switches
10. `withdraw-earn-card.tsx` - Added cross-chain withdraw flow + bridge handler
11. `multi-chain-safe-manager.ts` - Added to status
12. `vault-row.tsx` - Added to CHAIN_LOGOS
13. `checking-actions-card.tsx` - Added to CHAIN_LOGOS
14. `.env.example` - Added OPTIMISM_RPC_URL
15. `public/logos/_optimism-logo-long.svg` - Chain logo
