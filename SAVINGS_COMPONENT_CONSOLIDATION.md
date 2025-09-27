# Savings Experience Consolidation Plan

## Goals
- Eliminate long skeleton state on the savings dashboard by providing data at first paint.
- Merge checking balance (`FundsData`) and savings detail (`SavingsPageWrapper`) into a cohesive "Savings" surface.
- Maintain interactive capabilities (deposits, withdrawals, insurance CTAs) without regressing demo-mode behaviors.
- Align the combined experience with the typography, layout, and surface rules in `packages/web/DESIGN-LANGUAGE.md`.

## Current Pain Points
- `SavingsPageWrapper` is dynamically imported with `ssr: false`, so the browser always renders a skeleton while the module and subsequent client-side TRPC queries resolve.
- Data for the savings UI originates from multiple hooks (`useUserSafes`, `useRealSavingsState`, several `trpc` queries). Each fires client-side, compounding the perceived loading time.
- `FundsData` fetches checking balances server-side, but the UI lives in a separate card, making the "cash" story feel fragmented.
- Styling diverges slightly from the dashboard rules (e.g. nested card borders, inconsistent padding) because layouts are composed piecemeal.

## Proposed Architecture
1. **Server Aggregator Component**
   - Introduce a new server component (working name `SavingsSection`) inside `packages/web/src/app/(authenticated)/dashboard/(bank)/components/`.
   - Fetch all required savings data via `appRouter.createCaller({ userId, db, log })`, mirroring the loaders used by `FundsData`.
   - Return both the checking balance and savings aggregates in one object so the client component can render without waiting on hooks.

2. **Client Experience Component**
   - Refactor the existing `packages/web/src/app/(authenticated)/dashboard/savings/page-wrapper.tsx` into a lean client component (rename to `SavingsExperienceClient`) that receives a typed `initialData` prop instead of orchestrating its own bootstrap fetches.
   - Keep the interactive affordances (animated counters, modals) in this client layer, but gate follow-up React Query calls with `initialData` to avoid blank states.

3. **React Query Hydration**
   - On the server, prefetch the TRPC queries that the client will keep fresh (`earn.stats`, `earn.statsByVault`, `earn.userPositions`, `earn.getState`, etc.) using `createServerSideHelpers` from `@trpc/react-query/server`.
   - Wrap `SavingsExperienceClient` with `<HydrationBoundary state={dehydratedState}>` so its `trpc.useQuery` hooks start with `initialData` and `staleTime` instead of issuing immediate network calls.

4. **Unified Presentation**
   - Fold the withdrawable balance header from `FundsDisplayWithDemo` into the top of the savings layout.
   - Present the combined card stack with a single outer wrapper that follows the dashboard spec: `bg-[#F7F7F2]` canvas, white cards with `border-[#101010]/10`, typography scale defined in the design language.

## Data to Prefetch & Propagate
| Purpose | Existing source | Server fetch strategy | Client usage |
| --- | --- | --- | --- |
| Primary safe address | `caller.user.getPrimarySafeAddress()` (used by `FundsData`) | Fetch once; bail out to empty state if missing | `SavingsExperienceClient` uses for deposit/withdraw buttons and TRPC keys |
| Checking balance | `caller.safe.getBalance` | Include in initial payload | Display "Withdrawable Balance" summary |
| Insurance status | `caller.user.getProfile` | Include `isInsured` boolean | Controls insurance banner & contact panel |
| Auto-earn config / state | `caller.earn.getAutoEarnConfig`, `caller.earn.getState`, `caller.earn.getRecentEarnDeposits` | Prefetch via helpers | Hydrate `useRealSavingsState` replacement |
| Earn module status | `caller.earn.getEarnModuleOnChainInitializationStatus` | Prefetch | Gate activation UI |
| Vault stats | `caller.earn.stats`, `caller.earn.statsByVault`, `caller.earn.userPositions` | Prefetch with `vaultAddresses` from `BASE_USDC_VAULTS` | Populate vault table & totals |

## Implementation Steps
1. **Create a shared server-side loader** (`packages/web/src/server/savings/get-savings-overview.ts`)
   - Accept `userId`, gather the data listed above, and return a normalized shape (with graceful fallbacks for missing safes or demo mode).
   - Handle demo-mode branching so the client can still leverage `useDemoSavings*` helpers.

2. **Build `SavingsSection` server component**
   - Use the loader and `createServerSideHelpers` to prefetch TRPC queries and to produce `dehydratedState`.
   - Render `<HydrationBoundary>` with `SavingsExperienceClient initialData={...}`.

3. **Refactor the client component**
   - Extract the presentation + interaction logic from the current `page-wrapper.tsx` into `SavingsExperienceClient`.
   - Replace all direct bootstrap hooks with props or hydratable queries.
   - Embed the withdrawable balance UI snippet directly (either import `FundsDisplayWithDemo` as a presentational child or inline the essentials so the component tree is flatter).

4. **Update dashboard page composition**
   - Replace `<Suspense><FundsData/></Suspense>` and `<SavingsWrapper/>` with a single `<SavingsSection/>`.
   - Remove the dynamic import + `SavingsWrapper` indirection; make sure client components inside the new section still render on the client.

5. **Audit styling**
   - Ensure all surfaces use the dashboard palette, consistent padding (`p-6` inside cards), and typographic scale per `DESIGN-LANGUAGE.md`.
   - Confirm Tailwind class ordering follows layout → spacing → color.

6. **Cleanup & Type Safety**
   - Remove now-unused hooks/exports (e.g., `FundsData`, `SavingsWrapper` if obsolete) or retain thin wrappers that delegate to the new component to avoid breaking other imports.
   - Tighten prop types (`SavingsExperienceInitialData`) so future additions require explicit wiring through the server loader.

7. **Verification**
   - Manually test real mode with an account to ensure initial data renders immediately and modals still function.
   - Toggle demo mode (if still supported) to confirm fallback data paths.
   - Run `pnpm --filter @zero-finance/web lint`, `typecheck`, and targeted tests touching savings logic if any exist.

## UX & Styling Notes
- Keep the outer savings section anchored within the dashboard grid (`max-w-[1200px]`, consistent horizontal padding) to avoid layout jumps.
- Maintain uppercase labels with `tracking-[0.14em] text-[11px] text-[#101010]/60` for section headers.
- Use `font-serif` headlines at `text-[28px]` for major savings totals, and rely on `tabular-nums` for any currency figures.
- When combining cards, prefer a single shadow (`shadow-[0_2px_8px_rgba(16,16,16,0.04)]`) and avoid stacking multiple bordered wrappers.

## Risks & Open Questions
- Server-side prefetch increases the amount of work done per request; need to ensure TRPC calls remain parallelized to keep TTFB reasonable.
- Some client hooks (`useRealSavingsState`) currently sync with `localStorage`. Refactoring must preserve that behavior (e.g., by injecting the initial allocation values directly).
- Demo-mode pathways rely on local hooks. Confirm the merged component still respects demo toggles and doesn't accidentally call protected TRPC procedures when in demo mode.
- If any consumer outside the dashboard imports `SavingsPageWrapper` or `FundsData`, we may need transitional re-exports to avoid breaking builds.

---
This plan should unlock an implementation path where the savings experience loads with real data immediately, while consolidating related cash information into a single, polished module.
