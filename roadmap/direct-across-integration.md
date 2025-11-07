# Direct Across Protocol Integration (No Custom Contracts)

## The Simple Way

You can use Across Protocol's **existing SpokePool contracts** directly. No need to deploy your own contracts!

## How Across Already Works

Across has contracts deployed on Base and Arbitrum. You just need to:
1. Call their SpokePool on Base to bridge USDC
2. USDC arrives at your Safe address on Arbitrum
3. Have your Safe on Arbitrum deposit into the Morpho vault

## Architecture

```
USER'S SAFE (BASE)
       ↓
   Approve USDC to Across SpokePool
       ↓
   Call deposit() on Across SpokePool
       ↓
   [Across bridges USDC]
       ↓
USER'S SAFE (ARBITRUM) receives USDC
       ↓
   Safe deposits to Morpho Vault
```

## The Problem

**You need a Safe on Arbitrum** to receive the USDC and deposit into the vault.

## Three Solutions (No Custom Contracts)

### Option 1: Deploy Safe on Arbitrum (Simplest)

**Cost:** ~$15-25 one-time

```typescript
// 1. Deploy Safe on Arbitrum with same address as Base
// 2. Bridge USDC from Base to Arbitrum using Across
// 3. Deposit to Morpho vault on Arbitrum

// Frontend code:
async function depositCrossChain() {
  // Step 1: Bridge USDC from Base to Arbitrum
  await safeOnBase.sendTransaction({
    to: ACROSS_SPOKE_POOL_BASE,
    data: encodeFunctionData({
      abi: ACROSS_ABI,
      functionName: 'depositV3',
      args: [
        safeAddress, // recipient on Arbitrum (your Safe)
        USDC_BASE,
        amount,
        USDC_ARBITRUM,
        amount,
        42161, // Arbitrum chain ID
        // ... other params
      ],
    }),
  });
  
  // Step 2: Wait ~30 seconds for bridge
  await sleep(30000);
  
  // Step 3: Deposit to Morpho on Arbitrum
  await safeOnArbitrum.sendTransaction({
    to: MORPHO_VAULT_ARBITRUM,
    data: encodeFunctionData({
      abi: ERC4626_ABI,
      functionName: 'deposit',
      args: [amount, safeAddress],
    }),
  });
}
```

**Pros:**
- ✅ No custom contracts needed
- ✅ Full control on both chains
- ✅ Can use any bridge (Across, Stargate, etc.)
- ✅ Straightforward implementation

**Cons:**
- ❌ Need to deploy Safe on Arbitrum (~$15-25)
- ❌ User needs gas on Arbitrum for deposits
- ❌ Two transactions (bridge, then deposit)

### Option 2: Use Across with Message Passing (Medium)

Across V3 supports **arbitrary message passing** - you can include a call to execute on the destination chain.

```typescript
// On Base: Bridge + auto-deposit in one transaction
await safeOnBase.sendTransaction({
  to: ACROSS_SPOKE_POOL_BASE,
  data: encodeFunctionData({
    abi: ACROSS_ABI,
    functionName: 'depositV3',
    args: [
      MORPHO_VAULT_ARBITRUM, // Send directly to vault
      USDC_BASE,
      amount,
      USDC_ARBITRUM,
      amount,
      42161, // Arbitrum
      address(0), // no exclusive relayer
      quoteTimestamp,
      fillDeadline,
      0, // no exclusivity
      encodeFunctionData({ // Message to execute on Arbitrum
        abi: ERC4626_ABI,
        functionName: 'deposit',
        args: [amount, safeAddress], // Shares minted to your Safe
      }),
    ],
  }),
});
```

**Problem:** Morpho vault's `deposit()` function expects the caller to have the USDC, but Across relayer is calling it. **This won't work** without a receiver contract.

### Option 3: Use Intent-Based Bridges (Most Advanced)

Use protocols like:
- **Socket Protocol** - Aggregates multiple bridges
- **Li.Fi** - Cross-chain intent solver
- **Bungee** - Bridge aggregation

These can sometimes handle "bridge + deposit" as a single intent.

**Problem:** Still experimental, higher fees, less control.

## Recommended: Option 1 (Deploy Safe on Arbitrum)

This is the **simplest and most reliable** approach:

### Implementation

```typescript
// packages/web/src/lib/hooks/use-multi-chain-deposit.ts

import { useMutation } from '@tanstack/react-query';
import { encodeFunctionData, parseUnits, type Address } from 'viem';
import { useSafeRelay } from '@/hooks/use-safe-relay';
import { arbitrum } from 'viem/chains';

const ACROSS_SPOKE_POOL_BASE = '0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64';
const MORPHO_VAULT_ARBITRUM = '0x7e97fa6893871A2751B5fE961978DCCb2c201E65';
const USDC_BASE = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const USDC_ARBITRUM = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831';

const ACROSS_ABI = [{
  name: 'depositV3',
  type: 'function',
  inputs: [
    { name: 'depositor', type: 'address' },
    { name: 'recipient', type: 'address' },
    { name: 'inputToken', type: 'address' },
    { name: 'outputToken', type: 'address' },
    { name: 'inputAmount', type: 'uint256' },
    { name: 'outputAmount', type: 'uint256' },
    { name: 'destinationChainId', type: 'uint256' },
    { name: 'exclusiveRelayer', type: 'address' },
    { name: 'quoteTimestamp', type: 'uint32' },
    { name: 'fillDeadline', type: 'uint32' },
    { name: 'exclusivityDeadline', type: 'uint32' },
    { name: 'message', type: 'bytes' },
  ],
}] as const;

export function useMultiChainDeposit(
  safeAddressBase: Address,
  safeAddressArbitrum: Address,
) {
  const { send: sendOnBase } = useSafeRelay(safeAddressBase);
  const { send: sendOnArbitrum } = useSafeRelay(safeAddressArbitrum);
  
  return useMutation({
    mutationFn: async ({ amount }: { amount: string }) => {
      const amountWei = parseUnits(amount, 6);
      
      // Step 1: Bridge from Base to Arbitrum
      console.log('Bridging USDC from Base to Arbitrum...');
      
      const bridgeTx = await sendOnBase([{
        to: ACROSS_SPOKE_POOL_BASE,
        data: encodeFunctionData({
          abi: ACROSS_ABI,
          functionName: 'depositV3',
          args: [
            safeAddressBase, // depositor
            safeAddressArbitrum, // recipient (your Safe on Arbitrum)
            USDC_BASE, // input token
            USDC_ARBITRUM, // output token
            amountWei,
            amountWei,
            42161n, // Arbitrum
            '0x0000000000000000000000000000000000000000', // no exclusive relayer
            Math.floor(Date.now() / 1000) - 60, // quote timestamp
            Math.floor(Date.now() / 1000) + 3600, // fill deadline (1 hour)
            0, // no exclusivity
            '0x', // no message
          ],
        }),
        value: '0',
      }]);
      
      console.log('Bridge transaction:', bridgeTx);
      
      // Step 2: Wait for bridge (poll for USDC balance on Arbitrum)
      console.log('Waiting for bridge to complete...');
      await waitForBridge(safeAddressArbitrum, amountWei);
      
      // Step 3: Deposit to Morpho vault on Arbitrum
      console.log('Depositing to Morpho vault on Arbitrum...');
      
      const depositTx = await sendOnArbitrum([{
        to: MORPHO_VAULT_ARBITRUM,
        data: encodeFunctionData({
          abi: [{
            name: 'deposit',
            type: 'function',
            inputs: [
              { name: 'assets', type: 'uint256' },
              { name: 'receiver', type: 'address' },
            ],
          }],
          functionName: 'deposit',
          args: [amountWei, safeAddressArbitrum],
        }),
        value: '0',
      }]);
      
      console.log('Deposit transaction:', depositTx);
      
      return { bridgeTx, depositTx };
    },
  });
}

// Helper to wait for bridge
async function waitForBridge(
  safeAddress: Address,
  expectedAmount: bigint,
  maxWaitMs = 120000, // 2 minutes max
) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWaitMs) {
    // Check USDC balance on Arbitrum
    const balance = await checkUSDCBalance(safeAddress);
    
    if (balance >= expectedAmount) {
      console.log('Bridge complete!');
      return;
    }
    
    // Wait 5 seconds before checking again
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  throw new Error('Bridge timeout - USDC did not arrive within 2 minutes');
}
```

### UI Component

```tsx
// packages/web/src/components/vault/multi-chain-deposit.tsx

'use client';

import { useState } from 'react';
import { useMultiChainDeposit } from '@/lib/hooks/use-multi-chain-deposit';

export function MultiChainDeposit({ 
  safeBase, 
  safeArbitrum 
}: { 
  safeBase: Address; 
  safeArbitrum: Address;
}) {
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<'idle' | 'bridging' | 'depositing'>('idle');
  
  const deposit = useMultiChainDeposit(safeBase, safeArbitrum);
  
  const handleDeposit = async () => {
    try {
      setStatus('bridging');
      await deposit.mutateAsync({ amount });
      setStatus('idle');
      alert('Success! Deposited to Arbitrum vault');
    } catch (error) {
      setStatus('idle');
      alert(`Failed: ${error.message}`);
    }
  };
  
  return (
    <div className="space-y-4">
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount (USDC)"
        disabled={status !== 'idle'}
      />
      
      <button 
        onClick={handleDeposit}
        disabled={status !== 'idle'}
      >
        {status === 'bridging' && 'Bridging (30s)...'}
        {status === 'depositing' && 'Depositing to vault...'}
        {status === 'idle' && 'Deposit to Arbitrum Vault'}
      </button>
      
      <div className="text-sm text-gray-600">
        <p>Step 1: Bridge USDC to Arbitrum (~30 sec)</p>
        <p>Step 2: Deposit to Morpho vault</p>
        <p>Fee: ~0.5% bridge fee</p>
      </div>
    </div>
  );
}
```

## Comparison

| Approach | Custom Contracts | Safe on Arbitrum | Bridge Fee | Complexity |
|----------|-----------------|------------------|------------|------------|
| **Custom receiver** | 2 contracts | ❌ No | 0.5% | High |
| **Multi-chain Safe** | ❌ None | ✅ Yes (~$20) | 0.5% | Low |
| **Intent-based** | ❌ None | ❌ No | 1-2% | Medium |

## Recommendation

**Use Option 1: Multi-chain Safe**

1. Deploy Safe on Arbitrum (~$20 one-time)
2. Use Across directly (no custom contracts)
3. Two-step flow: bridge → deposit

This is:
- ✅ Simplest to implement
- ✅ No custom contracts to audit/maintain
- ✅ Most flexible (can switch bridges)
- ✅ Most reliable
- ✅ Standard flow users understand

**Total cost:**
- Setup: $20 (deploy Safe on Arbitrum)
- Per deposit: 0.5% bridge fee + gas
- Per withdrawal: $1-2 gas

The custom contract approach I showed earlier is only needed if you want to avoid deploying a Safe on Arbitrum entirely.
