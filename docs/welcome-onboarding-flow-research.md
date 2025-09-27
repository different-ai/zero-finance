# Welcome → Dashboard Onboarding Flow Research

## Goals & Constraints
- Keep first-run experience inside a single “Welcome” submission before landing on the dashboard.
- Auto-provision the full stack (Privy embedded wallet → Privy smart wallet → Safe primary account → savings module) without manual detours.
- Surface the onboarding task card on the dashboard with updated copy: crypto transfers available immediately; deposits gated on KYC.
- Favor simplicity over exotic flows; lean on existing hooks/components where possible.

## Current User Journey (as shipped)
1. **Auth & routing**
   - `DashboardRedirect` (`src/app/(authenticated)/dashboard/(bank)/dashboard-redirect.tsx`) only runs once the dashboard client code mounts. It reads `workspace.getOrCreateWorkspace` and checks `localStorage.company_name_collected`; if missing, it pushes `/welcome`.
   - Because the redirect lives on the dashboard page, deep-linking or fast redirects can bounce between `/welcome` and `/dashboard`, especially when multiple components try to navigate at once.
2. **Welcome page submission**
   - `src/app/(onboarding)/welcome/page.tsx` collects a workspace name, updates it via `workspace.updateCompanyName`, then sets `localStorage.company_name_collected = 'true'` and immediately pushes `/dashboard`.
   - No on-chain work happens here; the submit button only controls workspace metadata.
3. **Dashboard bootstrapping**
   - `DashboardClientLayout` (`src/app/(authenticated)/dashboard/dashboard-client-layout.tsx`) runs three background effects:
     1. `EnsureEmbeddedWallet` checks Privy state and silently provisions the embedded EOA if missing.
     2. `usePhoneCollection` prompts for phone (unrelated).
     3. `useAutoSafeCreation` kicks off Safe deployment if the user lacks a `userSafes` primary record.
   - `useAutoSafeCreation` (`src/hooks/use-auto-safe-creation.ts`) workflow:
     - Polls TRPC for existing primary Safe; exits if found.
     - Ensures a Privy smart wallet exists (calls `createSmartWallet`, polls for up to ~20 seconds).
     - Predicts and deploys a Safe via Protocol Kit, sending a userOp through `smartWalletClient?.sendTransaction`.
     - Polls Base for bytecode every 4s for up to ~2 minutes before writing the Safe address with `api.onboarding.completeOnboarding`.
   - No user-facing spinner ties into this process; from the dashboard the user just waits, potentially confused.
4. **Savings activation**
   - `OnboardingTasksCard` (`src/app/(authenticated)/dashboard/(bank)/components/dashboard/onboarding-tasks-card.tsx`) renders once the dashboard is visible. It requires the user to click `OpenSavingsAccountButton` manually after Safe creation.
   - `OpenSavingsAccountButton` (`src/components/savings/components/open-savings-account-button.tsx`) chains two long-running relayed calls (enable module → install config) with 60-second polling loops, Sonner toasts, and optimistic UI, then stores configuration via TRPC (`earn.recordInstall`, `earn.setAutoEarnPct`).
5. **KYC task copy**
   - The onboarding card currently blocks KYC until savings is activated. Copy does not mention crypto transfers vs. deposit gating.

## Pain Points & Edge Cases
- **Redirect churn**: redirect checks only happen inside dashboard rendering; initial `/welcome` visit can get interrupted by router pushes from other effects if the dashboard still boots.
- **Local storage flag**: `company_name_collected` is per-device. Signing in on another browser replays the welcome flow even if the backend already has company info. Conversely, clearing local storage bypasses the guard and drops straight onto the dashboard before setup is complete.
- **Async race conditions**:
  - `useAutoSafeCreation` sets `hasCheckedRef` before the Safe exists. If the smart wallet polling exceeds retries, the hook aborts without retrying until refresh.
  - Deploy + savings activation both rely on client-side polling with generous timeouts (2+ minutes total). Without a unified state machine the user can navigate away mid-flight.
- **Multiple Safe entry points**: There is still `/onboarding/create-safe` with `CreateSafeCard`, plus the background auto-creation. Keeping both increases the chance of duplicate deployments or confusing messaging.
- **Savings button UX**: the current button opens toasts but does not expose progress in-page. Auto-triggering it without adjusting UI would hide long operations.
- **EnsureEmbeddedWallet timing**: it only renders inside the dashboard layout. If we trigger Safe creation directly from the welcome page, we must confirm the embedded wallet provisioning already ran or add a safeguard.
- **KYC copy/location**: The tasks card will need new messaging (“Crypto transfers ready; deposits gated by KYC”) once creation happens up front.

## Target Flow (high level)
1. **Post-auth routing**
   - Perform the “do you have a primary Safe or recorded workspace?” check before loading any dashboard shells—either via middleware or a lightweight client guard shared by both `/dashboard` and `/welcome`.
   - If the user lacks a recorded Safe address (and possibly workspace metadata), send them to `/welcome` and keep them there until orchestration completes.
2. **Welcome submission orchestration**
   - On submit, combine three responsibilities:
     1. Ensure the workspace metadata is set (current mutation).
     2. Ensure the Privy embedded wallet & smart wallet are provisioned (reuse `EnsureEmbeddedWallet`/`useSmartWallet`).
     3. Deploy the primary Safe (`useAutoSafeCreation` logic) and, once confirmed, immediately kick off savings activation (`OpenSavingsAccountButton` logic) with a consolidated progress surface.
   - Only navigate to `/dashboard` when Safe + savings modules are confirmed or when an unrecoverable error occurs (with ability to retry).
3. **Dashboard entry**
   - When user lands on dashboard:
     - Show onboarding card already acknowledging “Primary account active, savings configured.”
     - Present KYC task with updated copy highlighting crypto transfers vs. deposit gating.
     - Optionally gate `useAutoSafeCreation` to no-op if the new welcome orchestration already writes the Safe.
4. **Fallback handling**
   - Provide a recovery path (e.g., link to `/onboarding/create-safe`) if the automated flow fails repeatedly, but hide it during the happy path.

## Implementation Touchpoints
- **Routing & guards**
  - `src/app/(authenticated)/dashboard/(bank)/dashboard-redirect.tsx`: broaden checks beyond local storage; consider server-side redirect in the page (`page.tsx`) or middleware to avoid race conditions.
  - Possibly introduce a shared hook/component to gate both `/dashboard` and `/welcome` until workspace + Privy context resolved.
- **Welcome page**
  - Extend `welcome/page.tsx` to orchestrate async steps with a progress UI. Potential approaches:
    - Extract the core Safe deployment from `useAutoSafeCreation` into a reusable function/hook that exposes granular status updates.
    - Reuse portions of `CreateSafeCard` for user feedback (progress accordion, status text) without rendering the full card UI.
  - Integrate savings activation logic by exposing an imperative API from `OpenSavingsAccountButton` (e.g., a hook that runs the same relay flow) instead of triggering via button clicks.
- **Background hooks**
  - Refactor `useAutoSafeCreation` so it can be called both imperatively (awaitable) and passively (background). Ensure idempotency when the Safe already exists.
  - Revisit `EnsureEmbeddedWallet` placement; we may need to render it within the welcome route or ensure the orchestration waits for its completion.
- **Onboarding card**
  - Update copy and ordering in `onboarding-tasks-card.tsx` to reflect new messaging.
  - Guard against re-triggering savings activation if the welcome flow already marked it complete (check TRPC status before showing the button).
- **State persistence**
  - Replace or augment the `localStorage.company_name_collected` flag with a server-side field (e.g., mark the workspace/company record), so routing decisions survive device changes.

## Risks & Mitigations
- **Long on-chain waits**: sequential Safe → savings setup can exceed one minute. Mitigate with clear progress states (e.g., “Creating smart wallet”, “Deploying Safe”, “Activating savings module”, “Configuring auto-earn”) and timeouts that surface actionable retry options.
- **Privy race**: creating a smart wallet requires refreshed Privy user state. Ensure we poll via `refreshUser` as in `useSmartWallet` before continuing.
- **Double submissions**: disable the welcome form while orchestration runs and prevent navigation until completion or explicit cancellation.
- **Error recovery**: capture and categorize failure modes (wallet rejection, relay failure, timeout) so users can retry without hitting inconsistent DB state.
- **Mobile constraints**: toasts alone are insufficient on smaller devices; inline status or modal flow will be clearer.

## Open Questions / Follow-ups
1. Should we keep `useAutoSafeCreation` running on the dashboard as a safety net, or disable it after introducing the new welcome flow?
2. Where should we persist “welcome completed” server-side? (User profile flag vs. workspace record.)
3. Are we comfortable auto-enabling the savings module for every user, or do we need a toggle/checkbox acknowledging intent?
4. Do we need to support skipping the long activation (e.g., “Set up later”) for users who cannot wait, and how would that affect dashboard copy?
5. Can we rely exclusively on the relay for savings activation, or do we need a fallback if the relay is unavailable?

## Next Steps
- Prototype a shared `usePrimaryAccountOrchestration` hook that merges logic from `useAutoSafeCreation`, `CreateSafeCard`, and `OpenSavingsAccountButton` with a single state machine.
- Update routing guards to prefer backend-derived flags over local storage.
- Draft revised onboarding card copy and align with product on messaging (crypto transfers vs. bank deposits).
- Validate with design/PM whether the welcome screen should show a multi-step progress UI or switch to a dedicated fullscreen wizard.
