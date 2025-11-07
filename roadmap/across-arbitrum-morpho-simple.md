# Simple Cross-Chain Vault Access: Arbitrum Morpho via Across

## Goal

Enable users with a Safe on Base to manually deposit and withdraw from the Gauntlet USDC Core vault on Arbitrum Morpho.

**Target Vault:** https://app.morpho.org/arbitrum/vault/0x7e97fa6893871A2751B5fE961978DCCb2c201E65/gauntlet-usdc-core

## Architecture Overview

```
USER'S SAFE (BASE)
       ↓
   [Deposit]
       ↓
Across Bridge (Base → Arbitrum)
       ↓
CrossChainVaultReceiver (Arbitrum)
       ↓
Morpho Vault (Arbitrum)
       ↓
   Shares to User's Safe

[Withdraw]
       ↓
Direct call from Safe to Vault (on Arbitrum)
       ↓
USDC to Safe (on Arbitrum)
       ↓
User bridges back manually if needed
```

## Smart Contracts

### 1. CrossChainVaultReceiver.sol (Arbitrum)

Already created above - handles receiving USDC from Across and depositing into vault.

### 2. CrossChainVaultManager.sol (Base)

Already created above - handles initiating cross-chain deposits via Across.

## Frontend Components

### 1. Update Vault Configuration

```typescript
// packages/web/src/server/earn/cross-chain-vaults.ts

import { type Address } from 'viem';

export const ARBITRUM_CHAIN_ID = 42161;
export const BASE_CHAIN_ID = 8453;

export interface CrossChainVault {
  id: string;
  name: string;
  displayName: string;
  address: Address;
  chainId: number;
  chainName: string;
  risk: 'Conservative' | 'Balanced' | 'High' | 'Optimized';
  curator: string;
  appUrl: string;
  requiresBridge: boolean;
  bridgeTimeSeconds: number;
  bridgeFeeBps: number;
}

export const ARBITRUM_MORPHO_VAULT: CrossChainVault = {
  id: 'morpho-arbitrum-gauntlet-usdc-core',
  name: 'Gauntlet USDC Core',
  displayName: 'High Yield (Arbitrum)',
  address: '0x7e97fa6893871A2751B5fE961978DCCb2c201E65',
  chainId: ARBITRUM_CHAIN_ID,
  chainName: 'Arbitrum',
  risk: 'Optimized',
  curator: 'Morpho × Gauntlet',
  appUrl: 'https://app.morpho.org/arbitrum/vault/0x7e97fa6893871A2751B5fE961978DCCb2c201E65/gauntlet-usdc-core',
  requiresBridge: true,
  bridgeTimeSeconds: 30,
  bridgeFeeBps: 50, // 0.5%
};

export const CROSS_CHAIN_VAULTS: CrossChainVault[] = [
  ARBITRUM_MORPHO_VAULT,
];
```

### 2. Simple Deposit Component

```tsx
// packages/web/src/components/vault/cross-chain-deposit-card.tsx

'use client';

import { useState } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { useCrossChainDeposit, calculateCrossChainFee } from '@/lib/hooks/use-cross-chain-deposit';
import { ARBITRUM_MORPHO_VAULT } from '@/server/earn/cross-chain-vaults';

export function CrossChainDepositCard() {
  const [amount, setAmount] = useState('');
  const deposit = useCrossChainDeposit();
  
  const handleDeposit = async () => {
    if (!amount) return;
    
    try {
      const result = await deposit.mutateAsync({
        vaultAddress: ARBITRUM_MORPHO_VAULT.address,
        amount,
        chainId: ARBITRUM_MORPHO_VAULT.chainId,
      });
      
      alert(`Deposit initiated! Tx: ${result.txHash}\nExpected time: 30 seconds`);
      setAmount('');
    } catch (error) {
      console.error('Deposit failed:', error);
      alert(`Deposit failed: ${error.message}`);
    }
  };
  
  const fee = amount ? calculateCrossChainFee(amount) : 0;
  const received = amount ? parseFloat(amount) - fee : 0;
  
  return (
    <div className="p-6 border rounded-lg space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Deposit to Arbitrum Vault</h3>
        <p className="text-sm text-gray-600">
          {ARBITRUM_MORPHO_VAULT.displayName} • {ARBITRUM_MORPHO_VAULT.curator}
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">
          Amount (USDC)
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="1000"
          className="w-full px-3 py-2 border rounded-lg"
          disabled={deposit.isPending}
        />
      </div>
      
      {amount && (
        <div className="text-sm space-y-1 p-3 bg-gray-50 rounded">
          <div className="flex justify-between">
            <span className="text-gray-600">Bridge Fee (0.5%):</span>
            <span className="font-medium">${fee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">You'll receive:</span>
            <span className="font-semibold">${received.toFixed(2)} USDC</span>
          </div>
          <div className="flex justify-between text-xs pt-1 border-t">
            <span className="text-gray-500">Estimated time:</span>
            <span>~30 seconds</span>
          </div>
        </div>
      )}
      
      <button
        onClick={handleDeposit}
        disabled={!amount || deposit.isPending}
        className="
          w-full py-3 bg-blue-600 text-white rounded-lg font-medium
          hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors
        "
      >
        {deposit.isPending ? 'Processing...' : 'Deposit via Across Bridge'}
      </button>
      
      <div className="text-xs text-gray-500">
        💡 Your vault shares will appear in ~30 seconds on Arbitrum
      </div>
    </div>
  );
}
```

### 3. Withdrawal Component (Direct on Arbitrum)

```tsx
// packages/web/src/components/vault/cross-chain-withdraw-card.tsx

'use client';

import { useState } from 'react';
import { useWallets } from '@privy-io/react-auth';
import { encodeFunctionData, parseUnits, type Address } from 'viem';
import { arbitrum } from 'viem/chains';
import { ARBITRUM_MORPHO_VAULT } from '@/server/earn/cross-chain-vaults';

const ERC4626_ABI = [
  {
    name: 'withdraw',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'assets', type: 'uint256' },
      { name: 'receiver', type: 'address' },
      { name: 'owner', type: 'address' },
    ],
    outputs: [{ name: 'shares', type: 'uint256' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'convertToAssets',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'shares', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

export function CrossChainWithdrawCard() {
  const { wallets } = useWallets();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleWithdraw = async () => {
    if (!amount || !wallets[0]?.address) return;
    
    setIsLoading(true);
    try {
      const amountInSmallestUnit = parseUnits(amount, 6);
      const userAddress = wallets[0].address;
      
      // Encode withdraw call
      const data = encodeFunctionData({
        abi: ERC4626_ABI,
        functionName: 'withdraw',
        args: [
          amountInSmallestUnit,
          userAddress, // receiver (user's Safe on Arbitrum)
          userAddress, // owner (user's Safe on Arbitrum)
        ],
      });
      
      // Execute on Arbitrum
      const txHash = await wallets[0].sendTransaction({
        to: ARBITRUM_MORPHO_VAULT.address,
        data,
        chain: arbitrum,
      });
      
      alert(`Withdrawal initiated!\nTx: ${txHash}\n\nNote: USDC will be on Arbitrum. Bridge to Base if needed.`);
      setAmount('');
    } catch (error) {
      console.error('Withdrawal failed:', error);
      alert(`Withdrawal failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="p-6 border rounded-lg space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Withdraw from Arbitrum Vault</h3>
        <p className="text-sm text-gray-600">
          {ARBITRUM_MORPHO_VAULT.displayName}
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">
          Amount (USDC)
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="1000"
          className="w-full px-3 py-2 border rounded-lg"
          disabled={isLoading}
        />
      </div>
      
      <button
        onClick={handleWithdraw}
        disabled={!amount || isLoading}
        className="
          w-full py-3 bg-red-600 text-white rounded-lg font-medium
          hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors
        "
      >
        {isLoading ? 'Processing...' : 'Withdraw (on Arbitrum)'}
      </button>
      
      <div className="text-xs text-gray-500 space-y-1">
        <p>⚠️ This withdraws USDC to your Safe on Arbitrum</p>
        <p>🌉 To get USDC back to Base, use a bridge separately</p>
      </div>
    </div>
  );
}
```

### 4. Vault Balance Tracker

```typescript
// packages/web/src/lib/hooks/use-cross-chain-vault-balance.ts

import { useQuery } from '@tanstack/react-query';
import { createPublicClient, http, parseAbi, type Address } from 'viem';
import { arbitrum } from 'viem/chains';

const ERC4626_ABI = parseAbi([
  'function balanceOf(address owner) view returns (uint256)',
  'function convertToAssets(uint256 shares) view returns (uint256)',
]);

export function useCrossChainVaultBalance(
  vaultAddress: Address,
  userAddress: Address | undefined,
  chainId: number,
) {
  return useQuery({
    queryKey: ['cross-chain-vault-balance', vaultAddress, userAddress, chainId],
    queryFn: async () => {
      if (!userAddress) return null;
      
      // Create client for target chain
      const client = createPublicClient({
        chain: chainId === 42161 ? arbitrum : arbitrum, // Add more chains as needed
        transport: http(),
      });
      
      // Get shares balance
      const shares = await client.readContract({
        address: vaultAddress,
        abi: ERC4626_ABI,
        functionName: 'balanceOf',
        args: [userAddress],
      });
      
      if (shares === 0n) {
        return { shares: 0n, assets: 0n };
      }
      
      // Convert to assets
      const assets = await client.readContract({
        address: vaultAddress,
        abi: ERC4626_ABI,
        functionName: 'convertToAssets',
        args: [shares],
      });
      
      return { shares, assets };
    },
    enabled: !!userAddress,
    refetchInterval: 10000, // Refresh every 10 seconds
  });
}
```

### 5. Combined Vault Management Page

```tsx
// packages/web/src/app/(authenticated)/dashboard/vaults/cross-chain/page.tsx

'use client';

import { useWallets } from '@privy-io/react-auth';
import { formatUnits } from 'viem';
import { CrossChainDepositCard } from '@/components/vault/cross-chain-deposit-card';
import { CrossChainWithdrawCard } from '@/components/vault/cross-chain-withdraw-card';
import { useCrossChainVaultBalance } from '@/lib/hooks/use-cross-chain-vault-balance';
import { ARBITRUM_MORPHO_VAULT } from '@/server/earn/cross-chain-vaults';

export default function CrossChainVaultsPage() {
  const { wallets } = useWallets();
  const userAddress = wallets[0]?.address;
  
  const balance = useCrossChainVaultBalance(
    ARBITRUM_MORPHO_VAULT.address,
    userAddress,
    ARBITRUM_MORPHO_VAULT.chainId,
  );
  
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Cross-Chain Vaults</h1>
        <p className="text-gray-600">
          Access high-yield vaults on other chains without deploying a Safe there
        </p>
      </div>
      
      {/* Balance Display */}
      <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
        <div className="text-sm text-gray-600 mb-1">Your Balance</div>
        {balance.isLoading ? (
          <div className="text-2xl font-bold">Loading...</div>
        ) : balance.data ? (
          <div>
            <div className="text-3xl font-bold">
              ${parseFloat(formatUnits(balance.data.assets, 6)).toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">
              {parseFloat(formatUnits(balance.data.shares, 6)).toFixed(2)} shares
            </div>
          </div>
        ) : (
          <div className="text-xl text-gray-500">No balance</div>
        )}
      </div>
      
      {/* Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <CrossChainDepositCard />
        <CrossChainWithdrawCard />
      </div>
      
      {/* Info */}
      <div className="p-4 bg-blue-50 rounded-lg text-sm">
        <h4 className="font-semibold mb-2">How it works</h4>
        <ul className="space-y-1 text-gray-700">
          <li>• Deposits: USDC bridges from Base to Arbitrum (~30s) and deposits into vault</li>
          <li>• Vault shares are held in your Safe address on Arbitrum</li>
          <li>• Withdrawals: Direct from vault on Arbitrum to your Safe</li>
          <li>• Bridge fee: 0.5% via Across Protocol</li>
        </ul>
      </div>
    </div>
  );
}
```

## Deployment Instructions

### 1. Deploy Contracts

```bash
# Set environment variables
export DEPLOYER_PRIVATE_KEY=0x...
export ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc
export BASE_RPC_URL=https://mainnet.base.org

# Deploy receiver on Arbitrum
cd packages/fluidkey-earn-module
forge script script/DeployCrossChainVaults.s.sol:DeployCrossChainVaults \
  --sig "deployReceiver()" \
  --rpc-url $ARBITRUM_RPC_URL \
  --broadcast \
  --verify

# Copy the receiver address from output
export CROSS_CHAIN_VAULT_RECEIVER_ARBITRUM=0x...

# Deploy manager on Base
forge script script/DeployCrossChainVaults.s.sol:DeployCrossChainVaults \
  --sig "deployManager()" \
  --rpc-url $BASE_RPC_URL \
  --broadcast \
  --verify
```

### 2. Update Environment Variables

```bash
# packages/web/.env.local
NEXT_PUBLIC_CROSS_CHAIN_VAULT_MANAGER_BASE=0x...
NEXT_PUBLIC_CROSS_CHAIN_VAULT_RECEIVER_ARBITRUM=0x...
ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc
```

### 3. Test Flow

```bash
# 1. User approves USDC on Base for CrossChainVaultManager
# 2. User calls CrossChainVaultManager.initiateDeposit()
# 3. Wait ~30 seconds
# 4. Check balance on Arbitrum vault
# 5. To withdraw: call vault.withdraw() on Arbitrum
```

## Cost Summary

| Item | Cost |
|------|------|
| Deploy receiver (Arbitrum) | ~$25 |
| Deploy manager (Base) | ~$20 |
| Configure contracts | ~$10 |
| **Total Setup** | **~$55** |
| | |
| Per $1000 deposit | ~$5-6 |
| Per withdrawal | ~$1-2 |

## What's NOT Included (No Auto-Earn)

- ❌ Automatic sweeping of deposits
- ❌ Percentage-based allocations
- ❌ Cron jobs for automation
- ❌ Auto-rebalancing

## What IS Included (Manual Only)

- ✅ Manual deposits via UI
- ✅ Cross-chain bridging via Across
- ✅ Balance tracking
- ✅ Manual withdrawals
- ✅ Simple, clean UX

This is a **manual vault access system only** - users decide when to deposit and withdraw.
