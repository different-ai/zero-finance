# Event-Based Earnings Implementation — Summary & Next Steps

## What Landed

- **API** — `earn.getEarningsEvents` (`packages/web/src/server/routers/earn-router.ts`)
  - Returns a chronological deposit/withdrawal feed for a Safe (id, type, ISO timestamp, amount/shares as strings, vaultAddress, apy, decimals).
  - Persists APY-at-deposit (`earn_deposits.apy_basis_points`) and asset decimals, backfilling older rows on demand.
  - Resolves vault APY via cached snapshots (`earn_vault_apy_snapshots`) with a 10‑minute TTL before reaching Morpho.
  - Ensures events are workspace-scoped and sorted server-side so the FE receives ready-to-use history.

- **APY snapshots** — `earn_vault_apy_snapshots` (`packages/web/src/db/schema.ts` + `packages/web/drizzle/0105_clever_vivisector.sql`)
  - Records the latest APY basis points per vault, chain, and source (`morpho`, `fallback_default`, etc.).
  - Shared helper (`packages/web/src/server/earn/vault-apy-service.ts`) exposes cached reads for routers, cron jobs, and future tasks.

- **Calculation engine** — `event-based-earnings.ts` (`packages/web/src/lib/utils`)
  - Uses pure `bigint` math to build per-vault positions, apply proportional withdrawals, and keep precision.
  - Normalises all aggregates to 18 decimals so mixed-asset vaults sum correctly.
  - Exposes helpers for total earnings, earnings-per-second, formatting, and `initializeEarningsAnimation` (drives the UI animation seed + rate).
  - Accepts per-event decimals (default 6) and carries them through proportional withdrawals.

- **UI components** — `AnimatedEarningsV2` & `AnimatedTotalEarnedV2` (`packages/web/src/components`)
  - Never start from $0; they hydrate immediately with the accumulated total from events.
  - Fall back to a 14-day earnings estimate when no history exists but a balance/APY is provided.
  - Smoothly animate via `requestAnimationFrame` and expose a lightweight loading state (“Calculating…”).

- **Verification routes** — `/test-earnings`, `/test-earnings-fixed`, `/test-earnings-events`
  - Cover the legacy baseline vs. new initializer, small value handling, and multi-vault event playback with withdrawals.

## Dashboard Integration (Live)

- File: packages/web/src/app/(authenticated)/dashboard/savings/page-wrapper.tsx
  - Uses `AnimatedTotalEarnedV2` for real safes, auto-passing `safeAddress`, `fallbackApy={averageInstantApy * 100}`, and `fallbackBalance={totalSaved}`.
  - Retains `AnimatedTotalEarned` for demo mode to keep canned flows intact.
  - Shows a lightweight placeholder if a real safe is not yet available.

## How the Pieces Fit Together

1. **API call**: Dashboard asks `earn.getEarningsEvents` for the authenticated Safe.
2. **Transport format**: Server returns stringified amounts (asset units), persisted APY basis points, and decimals per event.
3. **Client transform**: `AnimatedTotalEarnedV2` converts strings to `bigint` and funnels them into `initializeEarningsAnimation`.
4. **Initializer output**: Helper returns `{ initialValue, earningsPerSecond }` as floats for display.
5. **Animation loop**: Component seeds the counter with `initialValue` immediately, then increments each frame using the computed rate.

For bespoke visualizations, use `AnimatedEarningsV2` and pass pre-fetched events alongside optional `fallbackApy`/`fallbackBalance` props.

## Design Notes & Pitfalls Addressed

- No $0 start: accumulated earnings seed the counter even on first paint.
- Time zones: everything stays in ISO/UTC until display; no local math.
- Precision: `bigint` throughout, float conversion happens only once for rendering.
- Multiple vaults: events group by vault, earnings roll up across positions.
- Withdrawals: proportional reductions keep the math audit-friendly without FIFO/LIFO disputes.
- APY: captured per deposit and cached via snapshots so historical math is stable while network traffic stays low.
- Fallback path: when the API returns no events, we estimate ~14 days of earnings off the provided balance/APY so the UI still moves.

## Gaps / Follow-ups

1. Extend `resolveVaultDecimals` to pull real token metadata instead of defaulting to 6 (pre-work for non-USDC assets).
2. Add scheduled snapshotting so APY history is captured even without fresh deposits/withdrawals.
3. Add regression tests around multi-decimal event mixes (e.g., 6 vs 18 decimals) to prevent future math regressions.

## Validation Checklist

- Confirm `packages/web/src/app/(authenticated)/dashboard/savings/page-wrapper.tsx` renders `AnimatedTotalEarnedV2` (non-demo path) with `safeAddress`, `fallbackApy={averageInstantApy * 100}`, `fallbackBalance={totalSaved}` and keeps demo mode on the legacy counter.
- Confirm `packages/web/src/server/routers/earn-router.ts` exposes `earn.getEarningsEvents` with persisted APY/decimals and chronological ordering.
- With real deposits, “Earnings (Live)” should hydrate above $0 instead of counting from zero.
- Add deposits/withdrawals in `/test-earnings-events` and ensure proportional reductions behave as expected.
- Validate multiple vaults aggregate correctly by comparing against manual calculations (18-decimal normalisation).
- Inspect `earn_vault_apy_snapshots` to ensure new entries are written during deposits and snapshot refreshes.

## Key Files

- API: packages/web/src/server/routers/earn-router.ts (`getEarningsEvents`)
- Calc: packages/web/src/lib/utils/event-based-earnings.ts
- UI: packages/web/src/components/animated-total-earned-v2.tsx, animated-earnings-v2.tsx
- Demo pages: packages/web/src/app/(authenticated)/test-earnings[-fixed|-events]/page.tsx
- Dashboard (to migrate): packages/web/src/app/(authenticated)/dashboard/savings/page-wrapper.tsx
