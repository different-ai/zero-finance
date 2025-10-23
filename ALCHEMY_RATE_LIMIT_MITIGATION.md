# Alchemy API Rate Limiting Mitigation Strategy

## Problem Summary

The admin dashboard is experiencing 429 errors (compute units per second capacity exceeded) when fetching Safe wallet balances via Alchemy's RPC endpoint. The error occurs when making multiple `eth_call` requests to check balances across many Safe wallets.

**Error Details:**

```
{
  "code": 429,
  "message": "Your app has exceeded its compute units per second capacity. If you have retries enabled, you can safely ignore this message. If not, check out https://docs.alchemy.com/reference/throughput"
}
```

## Root Causes

1. **Multiple Sequential Requests**: The admin panel fetches balances for each Safe individually
2. **No Caching**: Every page load triggers fresh RPC calls
3. **No Request Batching**: Balance checks are not grouped into multicall transactions

## Solutions

### 1. Request Batching with Multicall (Primary Solution)

**Impact**: Reduces RPC calls by 10-100x  
**Effort**: Medium  
**Location**: `src/server/services/safe.service.ts`

Use viem's multicall to batch balance checks into a single RPC request:

```typescript
import { createPublicClient, http, parseAbi } from 'viem';
import { base } from 'viem/chains';

const client = createPublicClient({
  chain: base,
  transport: http(process.env.ALCHEMY_BASE_URL, {
    batch: {
      batchSize: 1024,
      wait: 16,
    },
  }),
  batch: {
    multicall: true,
  },
});

export async function getBatchSafeBalances(addresses: string[]) {
  const contracts = addresses.map((address) => ({
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC
    abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
    functionName: 'balanceOf',
    args: [address],
  }));

  const results = await client.multicall({ contracts, batchSize: 100 });

  return results.reduce((acc, result, i) => {
    acc[addresses[i]] = result.status === 'success' ? result.result : 0n;
    return acc;
  }, {});
}
```

### 2. Exponential Backoff Retry Logic

**Impact**: Gracefully handles temporary rate limits  
**Effort**: Low

Wrap RPC calls with retry logic that backs off exponentially on 429 errors:

```typescript
export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  maxAttempts = 5,
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;

      if (error.status !== 429 || attempt === maxAttempts) {
        throw error;
      }

      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 30000);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}
```

### 3. Caching (Choose ONE Implementation)

**Impact**: Reduces RPC calls by 80-95%  
**TTL**: 60 seconds

Choose **either** database-level caching **or** Redis based on your infrastructure. Do not implement both.

#### Option A: Redis Caching

**Pros**: Fast, simple, minimal overhead  
**Cons**: Requires Redis infrastructure

```typescript
// src/lib/cache/balance-cache.ts
import Redis from 'ioredis';

export class SafeBalanceCache {
  private redis = new Redis(process.env.REDIS_URL);
  private readonly TTL = 60; // 1 minute

  async get(safeAddress: string): Promise<string | null> {
    return this.redis.get(`safe:balance:${safeAddress.toLowerCase()}`);
  }

  async set(safeAddress: string, balance: string): Promise<void> {
    await this.redis.setex(
      `safe:balance:${safeAddress.toLowerCase()}`,
      this.TTL,
      balance,
    );
  }

  async mget(addresses: string[]): Promise<Record<string, string | null>> {
    const keys = addresses.map((a) => `safe:balance:${a.toLowerCase()}`);
    const values = await this.redis.mget(...keys);

    return addresses.reduce((acc, addr, i) => {
      acc[addr] = values[i];
      return acc;
    }, {});
  }
}
```

#### Option B: Database-level Caching

**Pros**: No additional infrastructure, persistent  
**Cons**: Slower than Redis, adds DB load

```sql
-- Add to drizzle schema
CREATE TABLE safe_balance_cache (
  safe_address VARCHAR(42) PRIMARY KEY,
  chain_id INTEGER NOT NULL,
  balance VARCHAR(78) NOT NULL,
  block_number BIGINT,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(safe_address, chain_id)
);

CREATE INDEX idx_balance_cache_updated ON safe_balance_cache(updated_at);
```

```typescript
// Query with TTL check
export async function getCachedBalance(safeAddress: string) {
  const cached = await db
    .select()
    .from(safeBalanceCache)
    .where(
      and(
        eq(safeBalanceCache.safeAddress, safeAddress.toLowerCase()),
        gt(safeBalanceCache.updatedAt, new Date(Date.now() - 60000)),
      ),
    )
    .limit(1);

  return cached[0]?.balance || null;
}
```

## Implementation Plan

### Step 1: Implement Multicall Batching

- [ ] Update `src/server/services/safe.service.ts` to use multicall
- [ ] Configure viem client with batch settings
- [ ] Test with multiple Safe addresses

### Step 2: Add Exponential Backoff

- [ ] Create retry wrapper function
- [ ] Wrap all RPC calls with `executeWithRetry`
- [ ] Configure max attempts and backoff delays

### Step 3: Choose and Implement Caching

**Choose ONE:**

- [ ] **Option A**: Set up Redis and implement `SafeBalanceCache` class
- [ ] **Option B**: Add database schema and implement DB caching queries

### Step 4: Integration

- [ ] Update `admin.listWorkspacesWithMembers` to use batched + cached calls
- [ ] Test end-to-end in admin panel
- [ ] Monitor Alchemy dashboard for reduced compute unit usage

## Expected Impact

With all three solutions implemented:

- **RPC call reduction**: 90-99%
- **Rate limit errors**: <1%
- **Admin panel load time**: <500ms

## References

- [Alchemy Throughput Documentation](https://docs.alchemy.com/reference/throughput)
- [Viem Multicall Guide](https://viem.sh/docs/contract/multicall.html)
- [Safe Smart Account SDK](https://docs.safe.global/sdk/protocol-kit)
