# Multi-User Workspace Follow-Up Issues

_Tracking outstanding gaps before shipping the multi-user workspace feature._

## 1. Invited Users Forced Through Welcome Flow
- **Impact**: Invited teammates hit `/welcome` and must stand up a new personal workspace before landing in the shared workspace. This blocks contractors/teammates who only need access to the inviter's workspace.
- **Observed Flow**: Accept invite → redirected to dashboard → immediately pushed into welcome onboarding to create a workspace or safe.
- **Expected**: Invited members should skip the personal workspace creation and land inside the inviter's workspace, with `primaryWorkspaceId` set accordingly.
- **Ideas**:
  - Detect active invite acceptance and mark onboarding as complete without provisioning a new workspace.
  - Short-circuit `getOrCreateWorkspace` after invite acceptance to prefer the shared workspace.

## 2. Inviter Guidance For Adding Invitee Wallet Owners
- **Impact**: After a teammate joins, the inviter sees no guided next step for adding the new wallet as a Safe co-owner, so joint control of the savings account stalls.
- **Current State**: Workspace invite can flag `addAsSafeOwner`, but we only surface a `pendingSafeOwnership` response—UI never prompts the inviter to complete the Safe owner add.
- **Expected**: Surface a clear CTA/checklist for the inviter to finish wallet ownership (e.g., banner in dashboard or team tab with the exact Safe transaction steps).
- **Ideas**:
  - Persist `pendingSafeOwnership` and surface actionable UI with transaction instructions or a one-click relay.
  - Notify both inviter and invitee via in-app banner or email with the remaining steps to co-own the Safe.

---
**Next Steps**: Prioritise these before GA; both issues block frictionless team onboarding onto shared safes.
