# Admin "View Workspace As" Feature - Feasibility Research

## Executive Summary

**Complexity Level:** Medium-High  
**Estimated Effort:** 3-5 days  
**Risk Level:** Medium (many cross-cutting concerns)

**Key Finding:** The feature is feasible but requires careful handling of authentication state, context overrides, and user session management. The main challenge is safely overriding the user's context without breaking existing functionality.

---

## Feature Requirement

Allow admins to view any workspace's dashboard as if they were that workspace's user, while maintaining:

- Admin's actual authentication
- Workspace-specific data isolation
- Read-only access (optional enhancement)
- Easy way to exit "impersonation mode"

---

## Current Architecture Analysis

### 1. Authentication Flow

**Current Implementation:**

```typescript
// src/app/(authenticated)/layout.tsx
const privyUser = await getUser(); // Gets current logged-in user
const privyDid = privyUser.id;

// src/lib/auth.ts
const cookieStore = await cookies();
const authorizationToken = cookieStore.get('privy-token')?.value;
const { userId } = await privyClient.verifyAuthToken(authorizationToken);
```

**Key Points:**

- Authentication is cookie-based (`privy-token`)
- User ID extracted from Privy JWT token
- Cannot be easily "spoofed" without new approach

**Challenge Rating: 🔴 HIGH**

- Need alternative authentication mechanism for admin impersonation
- Cannot modify Privy token (it's cryptographically signed)

---

### 2. Server Context & TRPC

**Current Implementation:**

```typescript
// src/server/context.ts
export interface Context {
  userId?: string | null;
  user?: any | null;
  workspaceId?: string | null;
  workspaceMembershipId?: string | null;
}

// src/server/create-router.ts
const isAuthed = middleware(async ({ ctx, next }) => {
  const privyDid = ctx.userId; // From Privy token
  const { workspaceId, membership } = await ensureUserWorkspace(db, privyDid);

  return next({
    ctx: {
      userId: privyDid,
      workspaceId,
      workspaceMembershipId: membership.id,
    },
  });
});
```

**Key Points:**

- All TRPC procedures rely on `ctx.userId` and `ctx.workspaceId`
- ~12,597 lines of router code depend on this context
- 104 dashboard component files make TRPC calls

**Challenge Rating: 🟡 MEDIUM**

- Can be overridden at middleware level
- Need to inject "impersonated" workspace ID
- All existing queries should work unchanged

---

### 3. Workspace Resolution

**Current Implementation:**

```typescript
// src/server/utils/workspace.ts
export async function ensureUserWorkspace(
  dbExecutor: DatabaseExecutor,
  userId: string,
): Promise<EnsureWorkspaceResult> {
  // Finds or creates workspace for user
  const membership = await tx
    .select()
    .from(workspaceMembers)
    .where(eq(workspaceMembers.userId, userId))
    .limit(1);

  return { workspaceId, membership };
}
```

**Key Points:**

- Workspace ID derived from `userId`
- Used in every authenticated request
- Safe addresses, balances, transactions all tied to workspace

**Challenge Rating: 🟢 LOW**

- Easy to override with target workspace ID
- Just need to pass different ID to existing functions

---

### 4. Client-Side State

**Current Implementation:**

```typescript
// src/app/(authenticated)/dashboard/(bank)/page.tsx
const { user } = usePrivy(); // Client-side Privy hook
const email = user?.email?.address;
const walletAddress = user?.wallet?.address;
```

**Key Points:**

- 106+ files reference safe addresses or user data
- Client components use `usePrivy()` hook directly
- User object comes from Privy Provider

**Challenge Rating: 🔴 HIGH**

- Client still sees admin's Privy user
- Would need React Context to override user data
- UI might show admin's email/wallet instead of target user

---

## Proposed Solutions

### Solution 1: Server-Side Context Override (RECOMMENDED)

**Approach:**

1. Add admin impersonation mode via URL parameter or cookie
2. Override TRPC context at middleware level
3. Keep client-side minimal changes

**Implementation:**

```typescript
// New: src/lib/admin-impersonation.ts
export async function getImpersonationWorkspaceId(
  adminUserId: string,
): Promise<string | null> {
  // Check if admin is in impersonation mode
  const cookies = await cookies();
  const impersonationCookie = cookies.get('admin-impersonate-workspace');

  if (!impersonationCookie?.value) return null;

  // Verify user is admin
  const admin = await db.query.admins.findFirst({
    where: eq(admins.privyDid, adminUserId),
  });

  if (!admin) {
    throw new Error('Unauthorized: Not an admin');
  }

  return impersonationCookie.value;
}

// Modified: src/server/create-router.ts
const isAuthed = middleware(async ({ ctx, next }) => {
  const privyDid = ctx.userId;

  // Check for admin impersonation
  const impersonatedWorkspaceId = await getImpersonationWorkspaceId(privyDid);

  let workspaceId: string;
  let membership: WorkspaceMember;

  if (impersonatedWorkspaceId) {
    // Admin is viewing another workspace
    workspaceId = impersonatedWorkspaceId;

    // Get workspace details
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, impersonatedWorkspaceId),
    });

    // Get primary member of target workspace
    membership = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, impersonatedWorkspaceId),
        eq(workspaceMembers.isPrimary, true),
      ),
    });

    if (!workspace || !membership) {
      throw new Error('Workspace not found');
    }
  } else {
    // Normal user flow
    const result = await ensureUserWorkspace(db, privyDid);
    workspaceId = result.workspaceId;
    membership = result.membership;
  }

  return next({
    ctx: {
      userId: privyDid, // Keep admin's ID for audit trail
      workspaceId, // Impersonated or own workspace
      workspaceMembershipId: membership.id,
      isImpersonating: !!impersonatedWorkspaceId,
    },
  });
});
```

**Pros:**

- ✅ Minimal changes to existing code
- ✅ Server queries work unchanged
- ✅ Safe and auditable (admin ID preserved)
- ✅ Easy to implement read-only restrictions

**Cons:**

- ⚠️ Client still shows admin's Privy user data
- ⚠️ Need UI indicators for impersonation mode
- ⚠️ Some client-side components may show wrong user info

**Estimated Effort:** 2-3 days

---

### Solution 2: Full Context Override with React Context

**Approach:**

1. Server-side workspace override (like Solution 1)
2. Add React Context Provider to override client-side user data
3. Fetch target workspace owner's info from server

**Implementation:**

```typescript
// New: src/context/admin-impersonation-context.tsx
interface ImpersonationContext {
  isImpersonating: boolean;
  targetWorkspaceId: string | null;
  targetUser: {
    privyDid: string;
    email: string;
    firstName: string;
    lastName: string;
  } | null;
  exitImpersonation: () => void;
}

export const ImpersonationProvider = ({ children }) => {
  const { data: impersonationData } = api.admin.getImpersonationContext.useQuery();

  // Override Privy user data if impersonating
  const effectiveUser = impersonationData?.isImpersonating
    ? impersonationData.targetUser
    : realPrivyUser;

  return (
    <ImpersonationContext.Provider value={impersonationData}>
      {children}
    </ImpersonationContext.Provider>
  );
};

// New: src/server/routers/admin-router.ts
getImpersonationContext: protectedProcedure.query(async ({ ctx }) => {
  const impersonatedWorkspaceId = await getImpersonationWorkspaceId(ctx.userId);

  if (!impersonatedWorkspaceId) {
    return { isImpersonating: false, targetWorkspaceId: null, targetUser: null };
  }

  // Get target workspace owner
  const membership = await db.query.workspaceMembers.findFirst({
    where: and(
      eq(workspaceMembers.workspaceId, impersonatedWorkspaceId),
      eq(workspaceMembers.isPrimary, true),
    ),
  });

  const user = await db.query.users.findFirst({
    where: eq(users.privyDid, membership.userId),
  });

  return {
    isImpersonating: true,
    targetWorkspaceId: impersonatedWorkspaceId,
    targetUser: {
      privyDid: user.privyDid,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  };
}),
```

**Pros:**

- ✅ Complete impersonation (server + client)
- ✅ UI shows target user's information correctly
- ✅ More realistic user experience

**Cons:**

- ⚠️ More complex implementation
- ⚠️ Need to update many client components
- ⚠️ Risk of Privy SDK conflicts

**Estimated Effort:** 4-5 days

---

### Solution 3: Dedicated Admin Dashboard Route

**Approach:**

1. Create separate route: `/admin/workspace/[workspaceId]/dashboard`
2. Duplicate dashboard structure for admin view
3. Pass workspace ID as prop, bypass normal auth

**Implementation:**

```typescript
// New: src/app/(public)/admin/workspace/[workspaceId]/layout.tsx
export default async function AdminWorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { workspaceId: string };
}) {
  const adminUser = await getUser();

  // Verify admin
  const admin = await db.query.admins.findFirst({
    where: eq(admins.privyDid, adminUser.id),
  });

  if (!admin) {
    redirect('/admin');
  }

  // Get workspace data
  const workspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.id, params.workspaceId),
  });

  // Render dashboard with workspace context
  return (
    <AdminWorkspaceProvider workspaceId={params.workspaceId}>
      <DashboardClientLayout>
        {children}
      </DashboardClientLayout>
    </AdminWorkspaceProvider>
  );
}

// Reuse existing dashboard components
// New: src/app/(public)/admin/workspace/[workspaceId]/page.tsx
export default async function AdminWorkspaceDashboard({
  params,
}: {
  params: { workspaceId: string };
}) {
  // Import existing dashboard page component
  const DashboardPage = await import('@/app/(authenticated)/dashboard/(bank)/page');
  return <DashboardPage.default />;
}
```

**Pros:**

- ✅ Clean separation of concerns
- ✅ No risk of breaking user dashboard
- ✅ Easy to add admin-only features

**Cons:**

- ⚠️ Code duplication
- ⚠️ Need to maintain two dashboard structures
- ⚠️ More routes to manage

**Estimated Effort:** 3-4 days

---

## Key Challenges Identified

### 1. Authentication vs Authorization Split

**Issue:** Current system conflates authentication (who you are) with authorization (what workspace you access)

**Impact:**

- `ctx.userId` used for both identity and workspace resolution
- No concept of "acting as" another workspace

**Solution:**

- Add `ctx.actualUserId` (admin) and `ctx.effectiveWorkspaceId` (target)
- Update audit logs to track both IDs

---

### 2. Safe Address Dependencies

**Issue:** 106 files reference safe addresses directly

**Examples:**

```typescript
// Many components do this:
const { data: balance } = api.safe.getBalance.useQuery({ safeAddress });
const { data: transactions } = api.safe.getTransactions.useQuery({
  safeAddress,
});
```

**Impact:**

- Need to ensure safe addresses come from target workspace, not admin's
- Components assume safe addresses belong to logged-in user

**Solution:**

- Ensure TRPC context override propagates to all safe-related queries
- Most queries already use `ctx.workspaceId` to fetch safes

---

### 3. Privy SDK Client Hooks

**Issue:** Client components use `usePrivy()` which returns admin's data

**Examples:**

```typescript
const { user } = usePrivy();
const email = user?.email?.address; // Shows admin's email!
const wallet = user?.wallet?.address; // Shows admin's wallet!
```

**Impact:**

- UI might display misleading information
- Wallet operations could fail or execute with wrong account

**Solution Options:**

- Option A: Override via React Context (Solution 2)
- Option B: Add clear UI warnings "Viewing as Admin"
- Option C: Disable wallet operations in impersonation mode

---

### 4. Real-Time Operations

**Issue:** Some operations require actual wallet signing

**Examples:**

- Depositing to vaults
- Withdrawing from safes
- Approving transactions
- Signing invoices

**Impact:**

- Admin cannot perform these actions (no private keys for target user)
- Need read-only mode enforcement

**Solution:**

- Detect impersonation mode
- Disable/hide action buttons
- Show "Read-Only Mode" banner
- Optionally: allow specific whitelisted actions

---

### 5. Session Management

**Issue:** How does admin enter/exit impersonation mode?

**Current Cookies:**

- `privy-token`: Admin's auth token (cannot be changed)
- Need new: `admin-impersonate-workspace`: Target workspace ID

**Challenges:**

- Cookie management across page navigation
- Secure against CSRF attacks
- Handle cookie expiration
- What happens if target workspace is deleted mid-session?

**Solution:**

```typescript
// Set impersonation
export async function setImpersonation(workspaceId: string) {
  'use server';
  const cookies = await cookies();

  // Verify admin
  const adminUserId = await getUserId();
  const admin = await db.query.admins.findFirst({
    where: eq(admins.privyDid, adminUserId),
  });

  if (!admin) {
    throw new Error('Unauthorized');
  }

  // Set secure cookie
  cookies.set('admin-impersonate-workspace', workspaceId, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 4, // 4 hours
  });

  // Log audit event
  await db.insert(adminAuditLogs).values({
    adminUserId,
    action: 'impersonate_workspace',
    targetWorkspaceId: workspaceId,
    timestamp: new Date(),
  });
}

// Clear impersonation
export async function exitImpersonation() {
  'use server';
  const cookies = await cookies();
  cookies.delete('admin-impersonate-workspace');
}
```

---

## Recommended Approach

### Phase 1: Core Infrastructure (Day 1-2)

1. **Add impersonation cookie mechanism**
   - Server action to set/clear impersonation
   - Middleware to read impersonation state

2. **Modify TRPC context**
   - Add `isImpersonating` flag
   - Override `workspaceId` when impersonating
   - Keep `userId` as admin for audit trail

3. **Create admin audit log**
   ```sql
   CREATE TABLE admin_audit_logs (
     id UUID PRIMARY KEY,
     admin_user_id TEXT NOT NULL,
     action TEXT NOT NULL,
     target_workspace_id TEXT,
     timestamp TIMESTAMPTZ NOT NULL
   );
   ```

### Phase 2: UI Integration (Day 2-3)

1. **Add workspace details action**

   ```typescript
   // In workspace-details-dialog.tsx
   <Button onClick={() => viewAsWorkspace(workspace.id)}>
     View Dashboard As This Workspace
   </Button>
   ```

2. **Create impersonation banner**

   ```tsx
   // New: src/components/admin/impersonation-banner.tsx
   export function ImpersonationBanner() {
     const { data } = api.admin.getImpersonationContext.useQuery();

     if (!data?.isImpersonating) return null;

     return (
       <div className="bg-yellow-500 text-black px-4 py-2 flex items-center justify-between">
         <span>
           ⚠️ Viewing as {data.targetUser.firstName} {data.targetUser.lastName}(
           {data.targetWorkspaceId})
         </span>
         <Button onClick={exitImpersonation}>Exit Admin View</Button>
       </div>
     );
   }
   ```

3. **Add to dashboard layout**
   - Show banner at top of dashboard
   - Maybe change theme color to indicate admin mode

### Phase 3: Safety & Polish (Day 3-4)

1. **Implement read-only mode**
   - Detect mutation procedures
   - Block or warn when in impersonation mode
   - Alternative: allow specific actions with extra confirmation

2. **Handle edge cases**
   - What if workspace is deleted during session?
   - What if admin loses admin status mid-session?
   - Handle refresh/navigation correctly

3. **Add analytics/logging**
   - Track which admins view which workspaces
   - How long they stay in impersonation mode
   - What actions they attempt

---

## Risk Assessment

### Security Risks

| Risk                                           | Severity | Mitigation                                      |
| ---------------------------------------------- | -------- | ----------------------------------------------- |
| Admin accidentally performs destructive action | HIGH     | Implement read-only mode, require confirmations |
| Cookie hijacking                               | MEDIUM   | Use httpOnly, secure, sameSite cookies          |
| CSRF attacks                                   | MEDIUM   | Add CSRF tokens to impersonation actions        |
| Privilege escalation                           | LOW      | Always verify admin status on every request     |
| Audit trail gaps                               | MEDIUM   | Log all impersonation events and actions        |

### Technical Risks

| Risk                        | Severity | Mitigation                                  |
| --------------------------- | -------- | ------------------------------------------- |
| Breaking existing dashboard | HIGH     | Thorough testing, feature flag rollout      |
| Client state conflicts      | MEDIUM   | Clear documentation, React Context override |
| Performance impact          | LOW      | Impersonation check is simple cookie read   |
| Wallet operation failures   | MEDIUM   | Disable wallet actions in admin mode        |

---

## Alternative: Simple Link Approach (Quick Win)

If full impersonation is too complex, consider simpler approach:

**Just add deep links to existing data:**

```tsx
// In workspace-details-dialog.tsx
<div className="space-y-2">
  <h3>Quick Links</h3>
  <Link href={`/dashboard?workspace=${workspace.id}`}>View Safes →</Link>
  <Link href={`/dashboard/savings?workspace=${workspace.id}`}>
    View Savings →
  </Link>
  <Link href={`/admin/workspace/${workspace.id}/raw-data`}>
    View Raw Data →
  </Link>
</div>
```

Then create read-only views that just display data without full dashboard:

- Simpler to implement (1-2 days)
- Lower risk
- Still provides value
- Can upgrade to full impersonation later

---

## Conclusion

**Recommended Path:** Solution 1 (Server-Side Context Override) + Phase 1-3 implementation

**Effort Breakdown:**

- Phase 1 (Core): 1-2 days
- Phase 2 (UI): 1-2 days
- Phase 3 (Safety): 1 day
- **Total: 3-5 days**

**Key Success Factors:**

1. Thorough testing of context override
2. Clear visual indicators of admin mode
3. Read-only enforcement (or careful action controls)
4. Comprehensive audit logging
5. Graceful error handling

**Blockers/Dependencies:**

- None identified - all current architecture supports this
- Need product decision on read-only vs. read-write access

**Next Steps:**

1. Get product approval on approach
2. Create feature flag for gradual rollout
3. Start with Phase 1 implementation
4. Test with single admin before wider release
