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
4. **No Rate Limiting**: No throttling mechanism in place
5. **Synchronous Loading**: All balance checks happen simultaneously on page load

## Recommended Solutions (Priority Order)

### 1. Immediate: Implement Request Batching with Multicall

**Impact**: Reduces RPC calls by 10-100x  
**Effort**: Medium  
**Location**: `src/server/services/safe.service.ts`

```typescript
// Use viem's multicall to batch balance checks
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

### 2. Immediate: Add Redis Caching Layer

**Impact**: Reduces RPC calls by 80-95%  
**Effort**: Low  
**TTL**: 60 seconds

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

### 3. Short-term: Database-level Caching

**Impact**: Provides persistent fallback when Redis is unavailable  
**Effort**: Medium

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

### 4. Medium-term: Implement Fallback RPC Providers

**Impact**: Prevents complete service outage, distributes load  
**Effort**: Low

```typescript
import { fallback, http } from 'viem';

const transport = fallback(
  [
    http(process.env.ALCHEMY_BASE_URL, { timeout: 3000 }),
    http(process.env.QUICKNODE_BASE_URL, { timeout: 5000 }),
    http('https://rpc.ankr.com/base', { timeout: 8000 }),
    http('https://mainnet.base.org', { timeout: 10000 }),
  ],
  {
    rank: false,
    retryCount: 2,
    retryDelay: 200,
  },
);
```

### 5. Medium-term: Request Queue with Rate Limiting

**Impact**: Prevents rate limit errors  
**Effort**: Medium

```typescript
// src/lib/rpc/rate-limiter.ts
import { RateLimiter } from 'limiter';

export class AlchemyRateLimiter {
  private limiter = new RateLimiter(25, 'second'); // 25 req/sec conservative

  async executeRequest<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.limiter.removeTokens(1, (err) => {
        if (err) return reject(err);
        request().then(resolve).catch(reject);
      });
    });
  }
}
```

### 6. Long-term: Exponential Backoff Retry Logic

**Impact**: Gracefully handles temporary rate limits  
**Effort**: Low

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

## Implementation Plan

### Phase 1 (Week 1) - Critical Fixes

- [ ] Implement multicall for batch balance checks
- [ ] Add Redis caching with 60s TTL
- [ ] Add basic retry logic with exponential backoff
- [ ] Update `admin.listWorkspacesWithMembers` to use cached data

### Phase 2 (Week 2) - Optimization

- [ ] Add database-level caching
- [ ] Implement request queue
- [ ] Add rate limiting middleware
- [ ] Set up fallback RPC providers

### Phase 3 (Week 3) - Monitoring

- [ ] Add compute unit tracking
- [ ] Set up alerts for rate limit hits
- [ ] Monitor cache hit rates
- [ ] Optimize cache TTLs based on usage patterns

## Monitoring & Metrics

Track these metrics to measure success:

1. **Rate Limit Hit Rate**: Should drop to <1%
2. **Cache Hit Rate**: Target >85%
3. **Average Response Time**: Target <500ms
4. **Error Rate**: Target <0.1%
5. **Compute Units Used**: Monitor via Alchemy dashboard

## Cost Analysis

### Current Alchemy Plan

- **Growth Plan**: 330 CUPS, ~3M compute units/month
- **Estimated Current Usage**: ~1-2M CU/month (high variance during admin access)

### Options

1. **Optimize First** (Recommended): Implement caching + batching → Expect 80-95% reduction
2. **Upgrade to Scale Plan**: $199/month for 2000 CUPS if optimization insufficient

## Alternative Solutions Considered

### GraphQL Subgraph (Not Recommended)

- **Pros**: No rate limits, cached data
- **Cons**: Requires subgraph deployment, data lag, maintenance overhead

### WebSocket Subscriptions (Future Enhancement)

- **Pros**: Real-time updates, efficient
- **Cons**: Complex implementation, requires connection management

### Self-hosted Archive Node (Not Recommended)

- **Pros**: No rate limits
- **Cons**: Very expensive ($500+/month), high maintenance

## References

- [Alchemy Throughput Documentation](https://docs.alchemy.com/reference/throughput)
- [Viem Multicall Guide](https://viem.sh/docs/contract/multicall.html)
- [Safe Smart Account SDK](https://docs.safe.global/sdk/protocol-kit)

## Questions?

Contact the team or see implementation examples in:

- `src/server/services/safe.service.ts`
- `src/lib/cache/balance-cache.ts`
- `src/server/routers/admin-router.ts`
