# Across Protocol Integration Guide

Quick reference for using the Across bridge integration for cross-chain vault deposits.

## Quick Start

### 1. Get a Bridge Quote

```typescript
import { getAcrossBridgeQuote } from '@/lib/across/across-client';
import { SUPPORTED_CHAINS } from '@/lib/constants/chains';
import { parseUnits } from 'viem';

const quote = await getAcrossBridgeQuote({
  amount: parseUnits('100', 6), // 100 USDC
  originChainId: SUPPORTED_CHAINS.BASE,
  destinationChainId: SUPPORTED_CHAINS.ARBITRUM,
});

console.log('Bridge fee:', quote.bridgeFee);
console.log('LP fee:', quote.lpFee);
console.log('Relayer gas fee:', quote.relayerGasFee);
console.log('Output amount:', quote.outputAmount);
console.log('Estimated fill time:', quote.estimatedFillTime, 'seconds');
```

### 2. Encode Multicall for Vault Deposit

```typescript
import { encodeVaultDepositMulticall } from '@/lib/across/encode-multicall';
import { getUSDCAddress } from '@/lib/constants/chains';

const actions = encodeVaultDepositMulticall({
  tokenAddress: getUSDCAddress(SUPPORTED_CHAINS.ARBITRUM),
  vaultAddress: '0x...', // Your vault address on Arbitrum
  amount: quote.outputAmount,
  recipient: '0x...', // Destination Safe address
});

// actions is an array of CrossChainAction:
// [
//   { target: USDC, callData: approve(...), value: 0n },
//   { target: Vault, callData: deposit(...), value: 0n }
// ]
```

### 3. Build Bridge Transaction (TODO)

```typescript
import { encodeBridgeWithVaultDeposit } from '@/server/earn/across-bridge-service';

// NOTE: This is not yet fully implemented
const tx = await encodeBridgeWithVaultDeposit({
  depositor: '0x...',
  vaultAddress: '0x...',
  destinationSafeAddress: '0x...',
  amount: '100000000', // 100 USDC (6 decimals)
  sourceChainId: SUPPORTED_CHAINS.BASE,
  destChainId: SUPPORTED_CHAINS.ARBITRUM,
});

// User signs and sends transaction
const hash = await walletClient.sendTransaction(tx);
```

### 4. Track Bridge Status (TODO)

```typescript
import { trackBridgeDeposit } from '@/server/earn/across-bridge-service';

// NOTE: This is not yet fully implemented
const status = await trackBridgeDeposit(depositId, txHash);

if (status === 'filled') {
  console.log('Bridge complete!');
} else if (status === 'failed') {
  console.log('Bridge failed');
}
```

## Database Integration

### Create Bridge Transaction Record

```typescript
import { db } from '@/db';
import { bridgeTransactions } from '@/db/schema';

await db.insert(bridgeTransactions).values({
  userDid: user.did,
  sourceChainId: SUPPORTED_CHAINS.BASE,
  destChainId: SUPPORTED_CHAINS.ARBITRUM,
  vaultAddress: '0x...',
  amount: '100000000',
  bridgeFee: quote.bridgeFee.toString(),
  lpFee: quote.lpFee.toString(),
  relayerGasFee: quote.relayerGasFee.toString(),
  relayerCapitalFee: quote.relayerCapitalFee.toString(),
  depositTxHash: txHash,
  status: 'pending',
});
```

### Update Bridge Status

```typescript
import { eq } from 'drizzle-orm';

await db
  .update(bridgeTransactions)
  .set({
    status: 'filled',
    fillTxHash: '0x...',
    filledAt: new Date(),
  })
  .where(eq(bridgeTransactions.depositTxHash, txHash));
```

### Query User's Bridges

```typescript
const userBridges = await db
  .select()
  .from(bridgeTransactions)
  .where(eq(bridgeTransactions.userDid, userDid))
  .orderBy(desc(bridgeTransactions.createdAt));
```

## Fee Breakdown

All fees are returned from the Across API in real-time:

| Fee Type            | Description                              | Included in Output |
| ------------------- | ---------------------------------------- | ------------------ |
| `lpFee`             | Liquidity provider fee                   | No                 |
| `relayerGasFee`     | Gas cost for relayers                    | No                 |
| `relayerCapitalFee` | Capital cost for relayers                | No                 |
| `bridgeFee`         | Total fee (sum of above)                 | No                 |
| `outputAmount`      | Amount user receives (input - bridgeFee) | Yes                |

**Example:**

```
Input:  100 USDC
LP Fee: 0.05 USDC
Gas Fee: 0.02 USDC
Capital Fee: 0.03 USDC
Total Fee: 0.10 USDC
Output: 99.90 USDC (what user receives on destination)
```

## Supported Routes

Currently supported:

- Base (8453) ↔ Arbitrum (42161) - USDC

## Important Notes

1. **Integrator ID**: Currently using placeholder `0x0000`. Need to get real ID from Across team.

2. **Testnet**: Set `useTestnet: true` in client creation for testing:

   ```typescript
   const client = createAcrossClient({
     integratorId: '0x0000',
     chains: [base, arbitrum],
     useTestnet: true, // Use testnet
   });
   ```

3. **Fill Times**:
   - Mainnet: ~2 seconds
   - Testnet: ~1 minute

4. **Deposit Limits**: Check limits before bridging:
   ```typescript
   const quote = await getAcrossBridgeQuote(...);
   if (quote.rawQuote.isAmountTooLow) {
     console.error('Amount below minimum');
   }
   console.log('Min deposit:', quote.rawQuote.limits.minDeposit);
   console.log('Max deposit:', quote.rawQuote.limits.maxDeposit);
   ```

## Error Handling

```typescript
try {
  const quote = await getAcrossBridgeQuote({...});
} catch (error) {
  if (error.message.includes('Failed to get bridge quote')) {
    // Handle Across API error
    console.error('Across API is down or returned an error');
  }
  // Handle other errors
}
```

## Testing

### Unit Tests (TODO)

```typescript
import { describe, it, expect } from 'vitest';
import { encodeVaultDepositMulticall } from '@/lib/across/encode-multicall';

describe('encodeVaultDepositMulticall', () => {
  it('should encode approve + deposit', () => {
    const actions = encodeVaultDepositMulticall({
      tokenAddress: '0x...',
      vaultAddress: '0x...',
      amount: parseUnits('100', 6),
      recipient: '0x...',
    });

    expect(actions).toHaveLength(2);
    expect(actions[0].target).toBe('0x...'); // USDC
    expect(actions[1].target).toBe('0x...'); // Vault
  });
});
```

### Integration Tests (TODO)

Test on Across testnet:

1. Get quote for small amount (~$10)
2. Execute bridge
3. Monitor fill status
4. Verify vault deposit on destination

## Resources

- [Across Docs](https://docs.across.to/)
- [Across SDK GitHub](https://github.com/across-protocol/toolkit)
- [Get Integrator ID](https://docs.google.com/forms/d/e/1FAIpQLSe-HY6mzTeGZs91HxObkQmwkMQuH7oy8ngZ1ROiu-f4SR4oMw/viewform)
- [Contract Addresses](https://docs.across.to/reference/contract-addresses)

## Next Steps

1. Complete `encodeBridgeWithVaultDeposit()` - needs SpokePool ABI
2. Complete `trackBridgeDeposit()` - needs indexer API integration
3. Add database CRUD functions
4. Build UI components
5. Add comprehensive tests
6. Get production integrator ID from Across team
