---
name: testability
description: Make features testable by design. Testing pyramid from fast (local) to slow (UI). Expose APIs securely for testing.
license: MIT
compatibility: opencode
metadata:
  audience: developers
  workflow: development
  trigger: before-writing-code
---

## What I Do

Ensure every feature you build is **testable from the start**. This skill teaches:

1. Testing pyramid (fast → slow)
2. API exposure patterns for testability
3. Local testing setup
4. Integration with staging tests
5. When to use each testing layer

## Core Philosophy

> **"If you can't test it locally, you can't test it."**

Every feature should be testable at multiple levels. Design for testability, don't bolt it on later.

---

## Testing Pyramid

From **fastest** (run constantly) to **slowest** (run occasionally):

```
                    ▲
                   /U\        UI Tests (E2E)
                  / I \       - Browser automation
                 /-----\      - Run on staging only
                / API   \     API/Integration Tests
               / TESTS   \    - tRPC procedures
              /-----------\   - Can run locally
             /   UNIT      \  Unit Tests
            /    TESTS      \ - Pure functions
           /------------------\ - Fastest, run always
```

| Layer           | Speed  | Where          | When to Use                         |
| --------------- | ------ | -------------- | ----------------------------------- |
| Unit            | <1s    | Local          | Pure logic, utils, calculations     |
| API/Integration | 1-10s  | Local + CI     | tRPC, DB operations, business logic |
| Staging         | 30s-2m | Vercel preview | Full flow verification              |
| UI/E2E          | 2-5m   | Staging only   | Critical user journeys              |

---

## Layer 1: Unit Tests (Fastest)

### When to Use

- Pure functions with no side effects
- Calculations, formatting, validation
- Business logic that doesn't touch DB/APIs

### Pattern

```typescript
// packages/web/src/lib/utils/calculate-fee.ts
export function calculateFee(amount: number, feePercent: number): number {
  return amount * (feePercent / 100);
}

// packages/web/src/lib/utils/calculate-fee.test.ts
import { describe, it, expect } from 'vitest';
import { calculateFee } from './calculate-fee';

describe('calculateFee', () => {
  it('calculates 1% fee correctly', () => {
    expect(calculateFee(1000, 1)).toBe(10);
  });

  it('handles zero amount', () => {
    expect(calculateFee(0, 5)).toBe(0);
  });
});
```

### Running Unit Tests

```bash
cd packages/web
pnpm test                           # Run all tests (watch mode)
pnpm test -- --run                  # Run once and exit
pnpm test:watch                     # Watch mode
pnpm test -- --run --grep "fee"     # Filter by name
```

---

## Layer 2: API/Integration Tests

### When to Use

- tRPC procedures
- Database operations
- External API integrations (mocked)
- Business logic with dependencies

### Pattern: Testing tRPC Procedures

```typescript
// packages/web/src/server/routers/earn/get-balance.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTestContext } from '@/test/context';
import { earnRouter } from './index';

describe('earn.getBalance', () => {
  let ctx: ReturnType<typeof createTestContext>;

  beforeEach(() => {
    ctx = createTestContext({
      user: { privyDid: 'test-user-did' },
      workspaceId: 'test-workspace-id',
    });
  });

  it('returns balance for valid user', async () => {
    const caller = earnRouter.createCaller(ctx);
    const result = await caller.getBalance({ chainId: 8453 });

    expect(result).toHaveProperty('balance');
    expect(typeof result.balance).toBe('string');
  });
});
```

### Pattern: Mocking External Services

```typescript
// Mock Privy
vi.mock('@privy-io/server-auth', () => ({
  PrivyClient: vi.fn().mockImplementation(() => ({
    getUser: vi.fn().mockResolvedValue({ id: 'test-user' }),
  })),
}));

// Mock Database
vi.mock('@/db', () => ({
  db: {
    query: {
      userSafes: {
        findFirst: vi.fn().mockResolvedValue({
          safeAddress: '0x1234...',
          chainId: 8453,
        }),
      },
    },
  },
}));
```

### Test Database Setup

For tests that need a real database:

```typescript
// packages/web/src/test/setup-db.ts
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

export async function createTestDb() {
  // Use a test-specific database
  const sql = neon(process.env.TEST_DATABASE_URL!);
  return drizzle(sql);
}
```

---

## Layer 3: Staging Tests (Vercel Preview)

### When to Use

- Full end-to-end flows
- Features that involve multiple services
- UI changes that need visual verification
- Flows that can't be mocked locally

### Workflow

```bash
# 1. Push your branch
git push -u origin feat/my-feature

# 2. Wait for deployment
LATEST=$(vercel ls --scope prologe 2>/dev/null | head -1)
vercel inspect "$LATEST" --scope prologe --wait --timeout 5m

# 3. Test on preview URL
# Use Chrome MCP or manual testing
```

### Integration with test-staging-branch Skill

Load the `test-staging-branch` skill for:

- Chrome automation login flow
- Gmail OTP extraction
- PR reporting

```
skill("test-staging-branch")
```

---

## Layer 4: UI/E2E Tests (Slowest)

### When to Use

- Critical user journeys only
- After all other layers pass
- For regression prevention

### Playwright Tests

```typescript
// packages/web/tests/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test('user can view dashboard balance', async ({ page }) => {
  // Login would use test fixtures
  await page.goto('/dashboard');

  await expect(page.getByText('Total Balance')).toBeVisible();
  await expect(page.getByTestId('balance-amount')).toBeVisible();
});
```

### Running E2E Tests

```bash
cd packages/web
pnpm exec playwright test
pnpm exec playwright test --ui  # Interactive mode
```

---

## Making Code Testable

### Pattern 1: Dependency Injection

```typescript
// BAD - Hard to test
export async function getBalance() {
  const safe = await db.query.userSafes.findFirst({...});
  const balance = await fetch(`https://api.example.com/balance/${safe.address}`);
  return balance;
}

// GOOD - Testable
export async function getBalance(
  deps: {
    getSafe: () => Promise<UserSafe>,
    fetchBalance: (address: string) => Promise<string>,
  }
) {
  const safe = await deps.getSafe();
  const balance = await deps.fetchBalance(safe.address);
  return balance;
}
```

### Pattern 2: Extract Pure Functions

```typescript
// BAD - Logic mixed with I/O
export async function processTransfer(amount: number) {
  const fee = amount * 0.01;
  const total = amount + fee;
  await db.insert(transfers).values({ amount, fee, total });
  return { amount, fee, total };
}

// GOOD - Pure function extractable
export function calculateTransferFees(amount: number) {
  const fee = amount * 0.01;
  const total = amount + fee;
  return { amount, fee, total };
}

export async function processTransfer(amount: number) {
  const calculated = calculateTransferFees(amount);
  await db.insert(transfers).values(calculated);
  return calculated;
}

// Now calculateTransferFees is easily unit testable!
```

### Pattern 3: Test IDs in UI

```tsx
// Add data-testid for E2E tests
<div data-testid="balance-card">
  <span data-testid="balance-amount">{balance}</span>
</div>
```

### Pattern 4: API Routes for Testing

Expose internal state via API routes that are:

- Only available in development/test
- Protected in production

```typescript
// packages/web/src/app/api/test/state/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // Only in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available' }, { status: 403 });
  }

  // Return internal state for testing
  return NextResponse.json({
    safesCount: await db.select().from(userSafes).count(),
    // ... other debug info
  });
}
```

---

## Local Testing Setup

### Environment Files

```bash
# .env.test - Test-specific config
DATABASE_URL="postgres://test:test@localhost:5432/test_db"
PRIVY_APP_ID="test-app-id"
# ... mocked values
```

### Test Utilities

Create reusable test helpers:

```typescript
// packages/web/src/test/fixtures.ts
export const testUser = {
  privyDid: 'did:privy:test-user',
  email: 'test@example.com',
};

export const testSafe = {
  address: '0x1234567890123456789012345678901234567890',
  chainId: 8453,
};

// packages/web/src/test/context.ts
export function createTestContext(overrides = {}) {
  return {
    user: testUser,
    workspaceId: 'test-workspace',
    db: mockDb,
    ...overrides,
  };
}
```

---

## Testing Checklist (Per Feature)

Before considering a feature "done":

```
[ ] Unit tests for pure functions
[ ] Integration tests for tRPC procedures
[ ] Mocks for external services
[ ] Test IDs in UI components
[ ] Manual test on staging (if applicable)
[ ] E2E test for critical paths only
```

---

## Common Anti-Patterns

### Don't: Test implementation details

```typescript
// BAD - Tests internal state
expect(component.state.isLoading).toBe(false);

// GOOD - Tests observable behavior
expect(screen.getByText('Loading...')).not.toBeVisible();
```

### Don't: Over-mock

```typescript
// BAD - Mock everything
vi.mock('@/db');
vi.mock('@/lib/api');
vi.mock('@/hooks/use-user');
// ... 10 more mocks

// GOOD - Mock only external boundaries
vi.mock('@/lib/external-api'); // Third-party only
```

### Don't: Write E2E tests for everything

```typescript
// BAD - E2E for simple validation
test('email validation shows error', async ({ page }) => {
  // This should be a unit test!
});

// GOOD - E2E for critical flows only
test('user can complete payment flow', async ({ page }) => {
  // Multi-step, multi-service flow
});
```

---

## Integration with Other Skills

| Scenario                 | Skill to Use          |
| ------------------------ | --------------------- |
| Testing fails on staging | `test-staging-branch` |
| Need to debug prod data  | `debug prod issues`   |
| After completing tests   | `skill-reinforcement` |
| Need Chrome automation   | `chrome-devtools-mcp` |

---

## Learnings Log

> Add new learnings here as they're discovered

### 2024-12-29: Initial skill created

- Established testing pyramid hierarchy
- Created patterns for dependency injection and pure function extraction
- Added integration with other skills

### 2026-01-12: Next.js 16 async route params

- Dynamic API routes now receive `params` as a Promise; `await params` before reading `slug` to avoid 404s in local CLI testing.

### 2026-01-12: Privy user provisioning defaults

- Privy create-user rejects `wallet_index` and `create_direct_signer`; omit defaults and only send those fields when explicitly provided.

---

## Quick Reference

```bash
# Unit tests
pnpm --filter @zero-finance/web test

# Watch mode
pnpm --filter @zero-finance/web test:watch

# E2E tests
pnpm --filter @zero-finance/web exec playwright test

# Type check (catches many bugs)
pnpm typecheck

# Lint
pnpm lint
```
