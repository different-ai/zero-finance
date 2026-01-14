# PRD: Balance / Earning / Spendable — Admin + Dashboard Optimization

## Summary

We’re currently hitting EVM JSON-RPC endpoints too hard (especially Base) due to:

- Dashboard polling every 10s across multiple endpoints.
- Admin endpoints doing nested vault×safe reads.
- Missing multicall/batching on some hot paths.
- Inconsistent RPC configuration practices (server code sometimes uses `NEXT_PUBLIC_*` RPC vars, which may contain provider keys and are not appropriate as server-side canonical RPCs).

This PRD proposes a consolidated, cached, multicall-first approach for retrieving:

- **Idle balance**: USDC in Safe (spendable now)
- **Earning balance**: USDC in vaults (earning yield)
- **Spendable balance**: idle + earning

Goal: fast, reliable, and simple balance retrieval for **admin + dashboard**, with a shared server-side implementation.

---

## Goals

- Reduce RPC call volume for dashboard/admin by 5–20×.
- Make balance reads robust on Vercel (cold starts, parallel instances).
- Ensure balances use the correct chain RPC and the correct Safe address source.
- Provide a single “spendable balance” interface usable by dashboard, admin, and tools.

## Non-goals

- Adding a full indexer.
- Rewriting earn module logic.
- UI redesign (aside from polling strategy changes during implementation).

---

## Current State (Key Hot Paths)

### Dashboard

`packages/web/src/app/(authenticated)/dashboard/(bank)/components/dashboard-summary-wrapper.tsx`

Current polling:

- `trpc.safe.getBalance` every 10s
- `trpc.earn.userPositions` every 10s
- `trpc.earn.statsByVault` every 30s

Issues:

- Multiple queries for what is conceptually one number (spendable).
- `earn.userPositions` does per-vault `balanceOf` + `convertToAssets` **without multicall**.

### Admin

Admin page: `packages/web/src/app/(public)/admin/page.tsx`

Key endpoints:

- `admin.getPlatformStats` (60s cache in-memory)
  - `packages/web/src/server/routers/admin-router.ts`
  - Computes vault totals via multicall across `vaults × safes`.
  - Cache is in-memory → weak on Vercel.

- `admin.listWorkspacesWithMembers`
  - `packages/web/src/server/routers/admin-router.ts`
  - Performs **1 RPC multicall per workspace** to compute Safe balances.

- `admin.getWorkspaceDetails`
  - `packages/web/src/server/routers/admin-router.ts`
  - Performs **nested loops** for vault breakdown:
    - For each vault → for each safe → `balanceOf` and maybe `convertToAssets` (unbatched).

---

## RPC Configuration Findings (Vercel)

Correct Vercel scope/project is `prologe/zerofinance`.

After linking to the correct scope and pulling env vars:

- Server RPC vars exist (Alchemy origins): `BASE_RPC_URL`, `ARBITRUM_RPC_URL`, `GNOSIS_RPC_URL`, `OPTIMISM_RPC_URL`
- `NEXT_PUBLIC_*_RPC_URL` also exist and look like they include provider keys.

Implications:

- Server-side code should treat `*_RPC_URL` as canonical.
- Avoid using `NEXT_PUBLIC_*` RPC URLs as a server-side source of truth.
- Avoid exposing provider keys client-side via `NEXT_PUBLIC_*`.

Verification script:

- `pnpm tsx packages/web/scripts/rpc-env-audit.ts`

---

## Benchmark Findings (Sanitized)

Script:

- `TSX_TSCONFIG_PATH=packages/web/tsconfig.json pnpm tsx packages/web/scripts/balance-rpc-bench.ts`

Results (high level):

- Alchemy Base RPC handles multicall scans reliably and quickly.
- Public Base RPC (`https://mainnet.base.org`) is inconsistent under parallel `eth_call` load.

Takeaway:

- Multicall is mandatory for vault/safe scans.
- Polling must be reduced / made event-driven.

---

## Proposed Solution

### 1) One canonical balance service

Add a server-side balance service (and a single tRPC endpoint) that returns:

- `idleBalanceUsd`
- `earningBalanceUsd`
- `spendableBalanceUsd`
- optional `vaultBreakdown[]`

Constraints:

- Uses multicall for USDC `balanceOf` and vault `balanceOf` + `convertToAssets`.
- Uses consistent Safe address sourcing (user-scoped vs workspace-scoped rules).

### 2) Caching that works on Vercel

- Short TTL per-safe cache (15–60s) for spendable balance.
- Admin aggregates should be precomputed (cron → DB/KV) instead of “scan entire platform on request”.

### 3) Admin endpoint improvements

- `listWorkspacesWithMembers`: do **one batch read for all unique safes**, then group by workspace.
- `getWorkspaceDetails`: replace nested per-safe loops with multicall across all contracts.
- `getPlatformStats`: move platform totals to DB/KV refreshed via cron.

### 4) Dashboard polling strategy

- Replace 3 polling queries with 1 query.
- Poll only during expected state transitions (pending transfer/bridge), not continuously.

---

## Acceptance Criteria

Performance:

- Dashboard spendable balance returns < 500ms p95 on Base.
- Admin workspace list returns < 1s p95 for 100 workspaces.

RPC Budget:

- Dashboard refresh ≤ 2 Base RPC calls (multicall shares + multicall convertToAssets; USDC can be included).
- Admin platform stats steady-state: 0 RPC calls (DB/KV cached).

Security:

- No provider keys in `NEXT_PUBLIC_*` RPC vars.

---

## Implementation Plan (Follow-up)

Phase 0 — RPC + configuration cleanup

- Ensure Vercel has `BASE_RPC_URL` and other server RPC vars set.
- Stop using `NEXT_PUBLIC_*` as server RPC source.

Phase 1 — Dashboard consolidation

- Implement unified spendable balance endpoint.
- Replace dashboard polling with a single query + event-based refresh.

Phase 2 — Admin batching

- Batch all workspace safe balances in one multicall.
- Replace workspace vault breakdown loops with multicall.

Phase 3 — Precompute aggregates

- Cron refresh totals → DB/KV.

---

## Appendix: Related scripts

- Env audit: `packages/web/scripts/rpc-env-audit.ts`
- RPC bench: `packages/web/scripts/balance-rpc-bench.ts`
