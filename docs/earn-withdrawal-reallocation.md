# Earn Withdrawals Reallocated – Root Cause & Follow-Up

## Observed Behaviour
- Withdrawing funds through the Safe UI succeeds on-chain, yet the balance is swept straight back into the primary vault (Morpho Gauntlet USDC Prime) within the next automation cycle.
- Database still shows `isEarnModuleEnabled = true` with `pct = 100`, so the earn worker treats any idle USDC in the Safe as eligible for redeposit.
- Result: users cannot keep withdrawn cash idle; the system auto-reinvests, creating a confusing UX loop.

## Why It Happens
- **Auto-earn allocation never changes**: `setAutoEarnPct` is only called during setup and (optionally) via the savings slider. Withdrawal flows (`withdraw-earn-card.tsx`, `withdraw-earn-card-advanced.tsx`) only log the event with `recordWithdrawal`; they never touch the allocation record.
- **Worker triggers on untouched configuration**: The earn job queries `autoEarnConfigs` for safes flagged as `isEarnModuleEnabled`. When `pct > 0`, it computes the target sweep amount and sends the relayer `autoEarn` call again, regardless of recent withdrawals.
- **No cooldown window**: The backend doesn’t tag withdrawals or pause automation. On the next poll, the Safe still holds USDC and gets rebalanced back into the same vault.

## Action Plan
1. **Session-level toggle**
   - UX: after a manual withdraw, ask whether to keep auto-earn active or pause it.
   - Backend: toggle `pct` to `0` or add a temporary `pausedUntil` timestamp in `autoEarnConfigs`.
2. **Worker guardrail**
   - Update the automation loop to skip the safe for the current sweep window if a withdrawal was recorded within a threshold (e.g., 6 hours).
   - Alternatively, require a minimum idle threshold before redepositing to avoid micro-loops.
3. **Status surfacing**
   - Display the active allocation in the withdraw UI so users understand that automation is still on.
4. **Longer-term**
   - Introduce per-safe automation states: `active`, `paused`, `migrating`. Auto-turn to `paused` post-withdraw until the user explicitly re-enables.
   - Consider storing intended target balances rather than “sweep 100%” to let users hold cash while keeping automation configured.

## Next Steps
- Decide between automatic pause (best UX but deviates from predictable automation) or explicit user confirmation.
- Scope backend changes to add a `pausedUntil` column on `autoEarnConfigs` plus worker logic to honor it.
- Update front-end withdraw modals to surface auto-earn status and offer one-click pause when withdrawing.
