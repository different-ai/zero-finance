# Alchemy API Rate Limiting Mitigation Strategy

## Problem Summary

The admin dashboard is experiencing 429 errors (compute units per second capacity exceeded) when fetching Safe wallet balances via Alchemy's RPC endpoint.

**Error Details:**

```
{
  "code": 429,
  "message": "Your app has exceeded its compute units per second capacity. If you have retries enabled, you can safely ignore this message. If not, check out https://docs.alchemy.com/reference/throughput"
}
```

## Current Mitigation (Already Implemented)

### Exponential Backoff Retry Logic

**Status**: ✅ Implemented  
**Impact**: Gracefully handles temporary rate limits

RPC calls are wrapped with retry logic that backs off exponentially on 429 errors:

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

## Future Optimization: Caching

**Impact**: Would reduce RPC calls by 80-95%  
**Recommended TTL**: 60 seconds  
**Status**: Not yet implemented

Choose **one** of the following caching strategies based on your infrastructure needs:

### Option A: Redis Caching

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

### Option B: Database-level Caching

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

## Implementation Plan (For Caching)

**Choose ONE caching option:**

### If Redis:

- [ ] Set up Redis infrastructure
- [ ] Implement `SafeBalanceCache` class
- [ ] Integrate into `admin.listWorkspacesWithMembers`
- [ ] Test and monitor cache hit rates

### If Database:

- [ ] Add `safe_balance_cache` table to schema
- [ ] Generate and apply Drizzle migration
- [ ] Implement DB caching queries
- [ ] Integrate into `admin.listWorkspacesWithMembers`
- [ ] Test and monitor cache hit rates

## Expected Impact (With Caching Added)

Current state (with retry logic):

- **Rate limit errors**: Reduced, but still possible under high load

With caching implemented:

- **RPC call reduction**: 80-95%
- **Rate limit errors**: <1%
- **Admin panel load time**: Significantly improved

## References

- [Alchemy Throughput Documentation](https://docs.alchemy.com/reference/throughput)
