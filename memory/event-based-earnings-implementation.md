# Event-Based Earnings Implementation — Summary & Next Steps

## What Landed

- API: New TRPC endpoint `earn.getEarningsEvents` (packages/web/src/server/routers/earn-router.ts)

  - Returns chronological list of deposit/withdrawal events for a Safe.
  - Event shape (stringified amounts/shares for transport):
    - id, type: 'deposit' | 'withdrawal', timestamp (ISO), amount (string), shares (string), vaultAddress, apy (number).
  - APY pulled live per vault via Morpho GraphQL (current rate used; historical APY not yet captured).

- Calc engine: `event-based-earnings.ts` (packages/web/src/lib/utils)

  - Pure BigInt math for accuracy; deposits tracked with timestamps; withdrawals applied proportionally across positions.
  - Helpers: build positions from events, compute accumulated earnings, earnings/sec, and an initializer suitable for live animation.

- UI components:

  - `AnimatedEarningsV2` and `AnimatedTotalEarnedV2` (packages/web/src/components)
    - Initialize from accumulated earnings (never start at $0 if data exists).
    - Smooth animation via requestAnimationFrame; handles loading/mount correctly.

- Test pages to verify behavior:
  - `/test-earnings` and `/test-earnings-fixed` (basic and accumulated start, small amounts enabled).
  - `/test-earnings-events` (interactive event-based demo across multiple vaults).

## Current Dashboard State

- File: packages/web/src/app/(authenticated)/dashboard/savings/page-wrapper.tsx

  - Still uses `AnimatedTotalEarned` (legacy) with computed `initialEarned`/`balance`.
  - Not yet wired to event-based flow.

- File: packages/web/src/server/routers/earn-router.ts
  - `getEarningsEvents` is implemented and available for the FE.

## Recommended Integration (Dashboard)

- Replace the legacy component with the V2 animated component when not in demo mode:

  - Import `AnimatedTotalEarnedV2`.
  - Render as soon as `safeAddress` is available:
    - `<AnimatedTotalEarnedV2 safeAddress={safeAddress} fallbackApy={averageInstantApy * 100 /* if decimal */} fallbackBalance={totalSaved} />`
    - Note: `averageInstantApy` in the page is a decimal (e.g., 0.08). `AnimatedTotalEarnedV2` expects APY as percentage. Pass `averageInstantApy * 100`.
  - Keep existing skeleton/loading guard; V2 shows "Calculating..." while events load.

- Retain the legacy display in demo mode.

## Design Notes & Pitfalls Addressed

- No $0 start: initial value is the accumulated earnings computed from actual deposit times.
- Time zones: timestamps are handled in UTC with ISO strings.
- Precision: calculations use BigInt; convert to decimal only for display.
- Multiple vaults: computed per vault then summed.
- Withdrawals: applied proportionally across positions to avoid FIFO/LIFO complexity.
- APY: currently uses live APY at calculation time; historical APY per deposit is not yet persisted.

## Gaps / Follow-ups

1. Persist APY-at-deposit (and optionally APY changes over time) to improve historical accuracy.
2. Consider server-side pre-aggregation or hourly checkpoints to reduce client work and ensure continuity.
3. Migrate dashboard to `AnimatedTotalEarnedV2` (see Recommended Integration) and validate on real data.

## Validation Checklist

- With real deposits, "Earnings (Live)" should no longer appear to start at $0 on mount.
- Add deposits/withdrawals and confirm proportional effects in `/test-earnings-events`.
- Multiple vaults show accumulated earnings based on each deposit timestamp.

## Key Files

- API: packages/web/src/server/routers/earn-router.ts (`getEarningsEvents`)
- Calc: packages/web/src/lib/utils/event-based-earnings.ts
- UI: packages/web/src/components/animated-total-earned-v2.tsx, animated-earnings-v2.tsx
- Demo pages: packages/web/src/app/(authenticated)/test-earnings[-fixed|-events]/page.tsx
- Dashboard (to migrate): packages/web/src/app/(authenticated)/dashboard/savings/page-wrapper.tsx
