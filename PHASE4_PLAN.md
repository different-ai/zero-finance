# Org-First Migration Status

## Completed
- Inventory of remaining user-scoped surfaces that still rely on direct user writes/reads across APIs and background jobs.
- Drafted shared workspace helpers (`ensureUserWorkspace`, `requireWorkspace`) and integrated them into server context and tRPC middleware.

## In Progress / Blockers
- Legacy background jobs still write `workspace_id = NULL`; these need to flow the active workspace context before schema enforcement.
- A handful of API mutations continue to accept only user context and must be shifted to workspace-aware helpers.
- Action ledger entries created via automation paths need consistent workspace scoping.

## Next Phases
1. **Phase 4a – Background Automations**
   - Thread `workspaceId` through cron jobs, webhook handlers, and any residual data processors so inserts land in workspace scope.
   - Add tests/logging to ensure no background pathway requires backfill triggers to stamp workspace data.

2. **Phase 4b – API & UI Surfaces**
   - Update routers and UI APIs that still depend on user-only filters to require `workspaceId` and follow shared workspace behavior.
   - Adjust action ledger writes triggered by front-end actions to carry workspace consistently.

3. **Phase 5 – Schema Hardening**
   - Once Phase 4a/b are merged, enforce `NOT NULL` + FK on the remaining tables touched by these flows and drop migration triggers for this surface.

## Notes
- No code changes committed on this branch yet; the above is preparatory planning so the next contributor can pick up the background automation refactor immediately.
