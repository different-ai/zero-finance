# Savings Earnings Remediation – March 2025

## Background
A production savings account displayed `+$-8.4268…` under **Earnings (Live)** despite holding a positive balance. The negative number made the primary dashboard card unreliable for users already deposited in a vault.

Investigation showed the issue stemmed from the ledger math inside `earnRouter.statsByVault`. The API returns `yield` as `(current assets + total withdrawn) - total deposited`. When we missed a deposit share record, the ledger thought more principal remained in the vault than the on-chain ERC-4626 shares actually represented. The delta surfaced as a negative “yield”, even though the user’s real position was profitable.

## Changes Landed

### 1. Hardened server-side aggregation
_File: `packages/web/src/server/routers/earn-router.ts`_
- Default `yieldAmount` to `totalWithdrawn - totalDeposited` to keep zero-share vaults deterministic.
- Capture ledger totals and add a correction step when `ledgerPrincipal > currentAssets`.
  - Clamp the displayed principal to the on-chain value.
  - Zero the unrealised yield and flag the correction (`yieldCorrectionApplied`).
  - Preserve raw numbers (`principalRecorded`, `yieldRecorded`) for deep inspection.
- Treat small rounding noise (< $0.001) as zero to avoid flicker.

### 2. UI safeguards and messaging
_File: `packages/web/src/app/(authenticated)/dashboard/savings/page-wrapper.tsx`_
- Consume the new API metadata and fall back to `balance - principal` when needed.
- Clamp harmless negatives to zero and prefer positive fallbacks.
- Surface a banner (“Earnings counter resynced”) with a manual refresh when any vault is corrected.
- Link to the checking balance to explain why live earnings might reset.

_File: `packages/web/src/components/animated-total-earned.tsx`_
- Stop the ticker when balance/APY are invalid.
- Render the sign explicitly and normalise sub-nano drifts to zero.

### 3. Dashboard composition cleanup
_Files: `packages/web/src/app/(authenticated)/dashboard/(bank)/components/{funds-data,loading-card}.tsx`, `.../(bank)/page.tsx`_
- Extracted shared Suspense components so the savings page can reuse them without tripping Next’s server/component type constraints.

### 4. Post-incident remediation script
_File: `packages/web/scripts/fix-negative-yield-ledger.ts`_
- Audits every safe/vault pair.
- Compares summed deposits/withdrawals to `convertToAssets(shares)` on-chain.
- Shaves excess deposits (old ledgers) in-place inside a DB transaction until the ledger matches actual assets.
- Logs adjustments with USD formatting for auditing.

Execution (prod credentials via `.env.prod.local`):
```bash
pnpm --filter @zero-finance/web exec dotenv -e .env.prod.local -- tsx scripts/fix-negative-yield-ledger.ts
```

Run on 2025-03-XX adjusted three legacy deposits for safe `0x1FB6…` in the Seamless vault, cutting ledger principal from $17.30 to $2.14.

## Testing
- `pnpm --filter @zero-finance/web lint`
- `pnpm --filter @zero-finance/web typecheck`
- Manual verification in staging recommended after deploy (banner visibility + live counter stays ≥ 0).

## Follow-ups
1. Schedule the new script (or port to a cron job) so future ledger drifts self-heal.
2. Instrument Sentry/Slack alerts using the `yieldCorrectionApplied` flag to catch future anomalies faster.
3. Backfill any other safes flagged by the script and ensure deposit ingestion records shares reliably going forward.
