# Page Load Slowdown – Candidate Culprits  
_Diff range: 926c0adb4ff83be52da1dfcae4ff852fe8a3d34b → HEAD_

## 1. Starter accounts created on page load
- The checking card now wires `api.align.createStarterAccountsRetroactively` straight into the client (`src/app/(authenticated)/dashboard/savings/components/checking-actions-card.tsx:47`) and auto-triggers it whenever the virtual account query returns an empty list (`src/app/(authenticated)/dashboard/savings/components/checking-actions-card.tsx:77`).
- The mutation calls `createStarterVirtualAccounts` (`src/server/services/align-starter-accounts.ts:12`), which issues two sequential `alignApi.createVirtualAccount` requests for USD and EUR (`src/server/services/align-starter-accounts.ts:43`, `src/server/services/align-starter-accounts.ts:85`) and persists both records before the mutation resolves.
- First principles impact: each fresh dashboard visit without cached funding sources now performs two external Align API calls plus two database inserts before the UI can settle. That adds round-trip latency and can easily dominate the perceived load time (seconds) if Align responds slowly or times out.
- Follow-up ideas: instrument how often this mutation fires, guard it behind explicit user intent, or offload starter-account provisioning to a background job so initial render is not blocked on Align.

## 2. Animated earnings counter now hits a heavy TRPC path
- The new `AnimatedTotalEarnedV2` component fetches live earnings events (`src/components/animated-total-earned-v2.tsx:35`) and keeps a per-frame animation running via `requestAnimationFrame` (`src/components/animated-total-earned-v2.tsx:91`).
- On the server, `earn.getEarningsEvents` traverses deposits and withdrawals (`src/server/routers/earn-router.ts:678` onwards) and calls `getVaultApyBasisPoints` for every vault (`src/server/routers/earn-router.ts:728`). That helper performs network requests to Morpho’s GraphQL API whenever cached APY data is stale (`src/server/earn/vault-apy-service.ts:18`).
- Net effect: every page load (and each 60 s refetch) can trigger multiple DB queries, optional external GraphQL calls, and 60 FPS React state updates. If the APY cache is cold or there are many events, the TRPC response can take hundreds of milliseconds to several seconds, and the continuous animation may keep re-rendering ancestors, contributing to UI jank.
- Follow-up ideas: memoise or precompute earnings server-side, throttle the animation updates, and ensure APY snapshots are proactively refreshed so the TRPC handler stays hot.

## 3. Verbose Align KYC logging on hot paths
- `fetchAndUpdateWorkspaceKycStatus` now stringifies and logs the full Align customer payload (`src/server/routers/align-router.ts:84`, `src/server/routers/align-router.ts:93`) as well as the resulting KYC object (`src/server/routers/align-router.ts:121`) on every invocation.
- Multiple TRPC procedures call this helper while pages load (e.g., customer status checks, onboarding flows), so each request spends extra CPU time serialising large JSON blobs and writing them to stdout.
- Heavy synchronous logging inflates response latency and can easily account for multi-second slowdowns under load, especially in serverless environments where console output is slow.
- Follow-up ideas: downgrade these logs to debug mode, truncate large payloads, or remove the stringification from production paths.

## 4. Dev server no longer uses Turbopack
- The dev script now runs plain `next dev` without the `--turbo` flag (`package.json:6`), whereas the earlier setup used Turbopack on port 3050.
- In practice this switches the local bundler back to webpack, which is noticeably slower at rebuilding and serving pages (often 2–5× slower for medium-sized projects).
- If the slowdown was observed in local development rather than production, re-enabling Turbopack or profiling rebuild timings should be the first experiment.
