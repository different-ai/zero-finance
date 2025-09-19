# Org-First Migration Status

## Completed
- Retired the legacy inbox/gmail stack (schemas, routers, cron jobs, and UI) so the workspace migration can focus on active surfaces.
- Drafted shared workspace helpers (`ensureUserWorkspace`, `requireWorkspace`) and integrated them into server context and tRPC middleware.

## In Progress / Blockers
- Audit remaining background jobs (auto-earn, manual sync utilities) to confirm they stamp `workspace_id` and drop any vestigial inbox references.
- A handful of API mutations continue to accept only user context and must be shifted to workspace-aware helpers.
- Confirm feature flags (`user_features`) and workspace settings no longer assume inbox semantics.

## Next Phases
1. **Phase 4a – Background Automations**
   - Thread `workspaceId` through cron jobs, webhook handlers, and any residual data processors so inserts land in workspace scope.
   - Add tests/logging to ensure no background pathway requires backfill triggers to stamp workspace data.

2. **Phase 4b – API & UI Surfaces**
   - Update routers and UI APIs that still depend on user-only filters to require `workspaceId` and follow shared workspace behavior.
   - Adjust action ledger writes triggered by front-end actions to carry workspace consistently.

3. **Phase 5 – Schema Hardening**
   - Once Phase 4a/b are merged, enforce `NOT NULL` + FK on the remaining workspace tables and prune retired columns (e.g., `shareInbox`).

## Notes
- Inbox/Gmail footprints are removed; next work should focus on workspace-scoped automations and schema tightening without the legacy surface.
