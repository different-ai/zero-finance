# [Feature Request] Zero Finance Lite - Privy-Only Mode Without Align Dependency

## Summary

Implement a "Lite" mode for Zero Finance that runs with ONLY Privy authentication, removing the hard dependency on Align for KYC/banking features. This allows developers to run the app locally, enables crypto-only deployments, and provides a simpler onboarding path.

## ⚠️ CRITICAL ISSUE FOUND

**The app currently CRASHES on startup without Align credentials:**

- `src/server/services/align-api.ts:340` throws `Error('ALIGN_API_KEY environment variable is required')`
- This prevents ANY local development without Align sandbox credentials
- Blocks open-source contributors and crypto-only deployments

## Motivation

- **Developer Experience**: Currently impossible to run locally without Align credentials
- **International Markets**: Align only works in certain regions
- **Faster Onboarding**: Skip KYC for crypto-only businesses
- **Cost Reduction**: Align has minimum fees that may not suit all users
- **Progressive Enhancement**: Start crypto-only, add banking later

## Current State Analysis (FROM CODEBASE REVIEW)

### 🔴 Blocking Issues Found:

1. **Hard Crash on Missing Align Key** - `align-api.ts:340` throws fatal error
2. **Onboarding Requires KYC** - Can't complete onboarding without Align (line 277-281 `onboarding-router.ts`)
3. **No Conditional UI** - Banking menu items always shown regardless of availability
4. **Payment Methods Hardcoded** - ACH/Wire options shown even when unavailable

### ✅ Good News:

1. **No Database Changes Needed** - Align fields are nullable, tables can remain empty
2. **Clear Separation** - Align code is well-isolated in specific files
3. **Existing Structure** - Code already uses routers/services pattern ideal for feature flags

## Detailed Implementation Plan

### 1. Configuration System

#### 🚨 CRITICAL: First Fix the Crash

**Update: `packages/web/src/server/services/align-api.ts` (Line 339-341)**

```typescript
// CURRENT (CRASHES):
constructor(apiKey = ALIGN_API_KEY, baseUrl = ALIGN_API_BASE_URL) {
  if (!apiKey) {
    throw new Error('ALIGN_API_KEY environment variable is required');
  }

// FIXED (GRACEFUL):
constructor(apiKey = ALIGN_API_KEY, baseUrl = ALIGN_API_BASE_URL) {
  if (!apiKey) {
    console.warn('[Align] Running in Lite mode - banking features disabled');
    this.liteMode = true;
  }
  this.apiKey = apiKey || '';
```

#### Create: `packages/web/src/lib/feature-config.ts`

```typescript
/**
 * Central feature configuration based on environment variables
 * This determines what features are available at runtime
 */
export const featureConfig = {
  align: {
    enabled: !!(
      process.env.ALIGN_API_KEY &&
      process.env.ALIGN_SECRET &&
      process.env.ALIGN_CLIENT_ID &&
      process.env.ALIGN_ENVIRONMENT &&
      process.env.ALIGN_WEBHOOK_SECRET &&
      process.env.NEXT_PUBLIC_ALIGN_PUBLISHABLE_KEY
    ),
    get apiKey() {
      return process.env.ALIGN_API_KEY;
    },
    get environment() {
      return process.env.ALIGN_ENVIRONMENT as 'sandbox' | 'production';
    },
  },

  banking: {
    get enabled() {
      return featureConfig.align.enabled;
    },
    virtualAccounts: {
      get enabled() {
        return featureConfig.align.enabled;
      },
    },
    transfers: {
      get achEnabled() {
        return featureConfig.align.enabled;
      },
      get wireEnabled() {
        return featureConfig.align.enabled;
      },
    },
  },

  kyc: {
    get required() {
      return featureConfig.align.enabled;
    },
    get provider() {
      return featureConfig.align.enabled ? 'align' : null;
    },
  },

  payments: {
    crypto: {
      enabled: true, // Always enabled
      networks: ['base', 'ethereum', 'polygon'],
    },
    fiat: {
      get enabled() {
        return featureConfig.align.enabled;
      },
    },
  },

  earn: {
    enabled: !!process.env.AUTO_EARN_MODULE_ADDRESS,
    get moduleAddress() {
      return process.env.AUTO_EARN_MODULE_ADDRESS;
    },
  },

  ai: {
    enabled: !!process.env.OPENAI_API_KEY,
    invoiceExtraction: !!process.env.OPENAI_API_KEY,
  },

  email: {
    loops: !!process.env.LOOPS_API_KEY,
  },
};

// Export type for use in components
export type FeatureConfig = typeof featureConfig;
```

### 2. Router Updates

#### Update: `packages/web/src/server/routers/align-router.ts`

**Current Issues:**

- Throws errors when Align credentials missing
- No graceful degradation
- Hard crashes on missing env vars

**Changes Required:**

```typescript
// Add at top of file
import { featureConfig } from '@/lib/feature-config';
import { TRPCError } from '@trpc/server';

// Wrap the entire router in a check
export const alignRouter = router({
  // Check if service is available
  isAvailable: publicProcedure.query(() => {
    return {
      available: featureConfig.align.enabled,
      message: featureConfig.align.enabled
        ? 'Align services are available'
        : 'Banking features not available in Lite mode',
    };
  }),

  getCustomerStatus: protectedProcedure.query(async ({ ctx }) => {
    if (!featureConfig.align.enabled) {
      return {
        alignCustomerId: null,
        kycStatus: 'not_required' as const,
        kycSubStatus: null,
        hasVirtualAccount: false,
        virtualAccountStatus: 'not_available' as const,
        alignVirtualAccountId: null,
        accountNumber: null,
        routingNumber: null,
        message: 'KYC not required in Lite mode',
      };
    }

    // ... existing implementation
  }),

  createCustomer: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        fullName: z.string(),
        businessName: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!featureConfig.align.enabled) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message:
            'Banking features not available in Lite mode. Upgrade to enable KYC.',
        });
      }

      // ... existing implementation
    }),

  // Similar pattern for all other procedures:
  // - createVirtualAccount
  // - getVirtualAccountDetails
  // - createACHTransfer
  // - createWireTransfer
  // - getTransferStatus
  // etc.
});
```

#### Update: `packages/web/src/server/routers/onboarding-router.ts`

**Changes Required:**

```typescript
import { featureConfig } from '@/lib/feature-config';

// In getOnboardingSteps procedure
getOnboardingSteps: protectedProcedure.query(async ({ ctx }) => {
  const privyDid = ctx.userId;

  // ... existing user/safe checks

  // Conditional KYC status based on feature config
  let kycStatus = 'not_required' as const;
  let kycRequired = false;

  if (featureConfig.kyc.required) {
    // ... existing Align checks
    kycRequired = true;
  }

  const steps = {
    createSafe: {
      isCompleted: !!primarySafe,
      status: primarySafe ? 'completed' : 'not_started',
    },
    // Only include KYC step if required
    ...(kycRequired && {
      verifyIdentity: {
        isCompleted: kycStatus === 'approved',
        status: kycStatus,
        kycMarkedDone,
        kycSubStatus,
      }
    }),
    // Only include savings if module configured
    ...(featureConfig.earn.enabled && {
      openSavings: {
        isCompleted: hasSavingsAccount,
        status: hasSavingsAccount ? 'completed' : 'not_started',
      }
    })
  };

  // Completion logic changes based on what's required
  const isCompleted = steps.createSafe.isCompleted &&
    (!kycRequired || steps.verifyIdentity?.isCompleted) &&
    (!featureConfig.earn.enabled || steps.openSavings?.isCompleted);

  return { steps, isCompleted };
}),
```

### 3. UI Component Updates

#### Update: `packages/web/src/app/(authenticated)/dashboard/(bank)/page.tsx`

**Current Issues:**

- Always shows banking-related empty states
- Assumes Align is available
- Shows KYC prompts

**Changes Required:**

```typescript
import { featureConfig } from '@/lib/feature-config';

// In the component
export default async function DashboardPage() {
  // ... existing code

  // Conditional features based on config
  const showBanking = featureConfig.banking.enabled;
  const showKYC = featureConfig.kyc.required;

  return (
    <div>
      {/* Always show */}
      <WalletOverview />
      <RecentInvoices />

      {/* Conditionally show banking features */}
      {showBanking ? (
        <BankingDashboard />
      ) : (
        <CryptoOnlyDashboard />
      )}

      {/* Only show KYC if required */}
      {showKYC && !kycComplete && (
        <KYCPrompt />
      )}
    </div>
  );
}
```

#### Update: `packages/web/src/app/(authenticated)/dashboard/(bank)/components/dashboard/onboarding-tasks-card.tsx`

**Changes Required:**

```typescript
import { featureConfig } from '@/lib/feature-config';

export function OnboardingTasksCard({ initialData }: OnboardingTasksProps) {
  // ... existing code

  // Filter steps based on configuration
  const steps = [
    {
      id: 'create-safe',
      title: 'Activate Primary Account',
      enabled: true, // Always enabled
    },
    {
      id: 'verify-identity',
      title: 'Verify Identity',
      enabled: featureConfig.kyc.required,
    },
    {
      id: 'open-savings',
      title: 'Activate High-Yield Savings',
      enabled: featureConfig.earn.enabled,
    },
  ].filter((step) => step.enabled);

  // Don't show card if only one step and it's complete
  if (steps.length === 1 && safeComplete) {
    return null;
  }

  // ... render filtered steps
}
```

#### Update: `packages/web/src/app/onboarding/constants.ts`

**Changes Required:**

```typescript
import { featureConfig } from '@/lib/feature-config';

// Dynamic steps based on configuration
export const steps = [
  { name: 'Activate Primary Account', path: '/onboarding/create-safe' },
  ...(featureConfig.kyc.required
    ? [{ name: 'Verify Identity', path: '/onboarding/kyc' }]
    : []),
  { name: 'Complete', path: '/onboarding/complete' },
];
```

#### Update: `packages/web/src/app/onboarding/layout.tsx`

**Changes Required:**

```typescript
import { featureConfig } from '@/lib/feature-config';
import { steps } from './constants';

export default function OnboardingLayout({ children }) {
  // Skip KYC checks if not required
  const { data: customerStatus } = api.align.getCustomerStatus.useQuery(
    undefined,
    {
      enabled: ready && authenticated && featureConfig.kyc.required,
    },
  );

  // Simplified completion check
  const isOnboardingComplete = featureConfig.kyc.required
    ? customerStatus?.kycStatus === 'approved'
    : true; // Auto-complete if KYC not required

  // ... rest of component
}
```

### 4. Navigation & Sidebar Updates

#### Update: `packages/web/src/components/layout/sidebar.tsx`

**Line 41-100** - Navigation items configuration
**Changes Required:**

```typescript
import { featureConfig } from '@/lib/feature-config';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, enabled: true },
  {
    name: 'Invoices',
    href: '/dashboard/invoices',
    icon: FileText,
    enabled: true,
  },
  {
    name: 'Contractors',
    href: '/dashboard/contractors',
    icon: Users,
    enabled: true,
  },

  // Banking features - only if Align enabled
  {
    name: 'Transfers',
    href: '/dashboard/transfers',
    icon: ArrowUpDown,
    enabled: featureConfig.banking.transfers.achEnabled,
  },
  {
    name: 'Banking',
    href: '/dashboard/banking',
    icon: Building,
    enabled: featureConfig.banking.virtualAccounts.enabled,
  },

  // Savings - only if module configured
  {
    name: 'Savings',
    href: '/dashboard/earn',
    icon: TrendingUp,
    enabled: featureConfig.earn.enabled,
  },

  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    enabled: true,
  },
].filter((item) => item.enabled);
```

### 5. Payment Method Updates

#### Update: `packages/web/src/components/invoice/simple-invoice-form.tsx`

**Lines 115-117** - Payment methods configuration
**Changes Required:**

```typescript
import { featureConfig } from '@/lib/feature-config';

// Line 115 - Update payment options
const paymentOptions = [
  {
    value: 'crypto_base',
    label: 'Base (USDC)',
    network: 'base',
    currency: 'USDC',
  },
  {
    value: 'crypto_eth',
    label: 'Ethereum (USDC)',
    network: 'ethereum',
    currency: 'USDC',
  },
  ...(featureConfig.banking.transfers.achEnabled
    ? [
        {
          value: 'fiat',
          label: 'Bank Transfer (ACH)',
          network: 'fiat',
          currency: 'USD',
        },
      ]
    : []),
];
```

#### Update: `packages/web/src/components/invoice/invoice-form.tsx`

**Similar changes to limit payment methods when banking not available**

### 6. Settings Page Updates

#### Update: `packages/web/src/app/(authenticated)/settings/page.tsx`

**Changes Required:**

```typescript
import { featureConfig } from '@/lib/feature-config';

// In the settings sections
const settingsSections = [
  { id: 'profile', label: 'Profile', enabled: true },
  { id: 'company', label: 'Company', enabled: true },
  { id: 'security', label: 'Security', enabled: true },
  {
    id: 'banking',
    label: 'Banking',
    enabled: featureConfig.banking.enabled,
    message: 'Banking features not available in Lite mode',
  },
  {
    id: 'kyc',
    label: 'Identity Verification',
    enabled: featureConfig.kyc.required,
    message: 'KYC not required in crypto-only mode',
  },
].filter((section) => section.enabled);
```

### 7. Error Boundaries & Fallbacks

#### Create: `packages/web/src/components/feature-boundaries/align-boundary.tsx`

```typescript
import { featureConfig } from '@/lib/feature-config';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function AlignBoundary({ children, fallback }: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  if (!featureConfig.align.enabled) {
    return fallback || (
      <Alert>
        <AlertDescription>
          Banking features are not available in Lite mode.
          Contact support to enable ACH/Wire transfers.
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
}
```

### 8. API Route Updates

#### Update: `packages/web/src/app/api/align/webhook/route.ts`

**Changes Required:**

```typescript
import { featureConfig } from '@/lib/feature-config';

export async function POST(request: Request) {
  // Early return if Align not configured
  if (!featureConfig.align.enabled) {
    return NextResponse.json(
      { error: 'Webhook endpoint not available' },
      { status: 404 },
    );
  }

  // ... existing webhook handling
}
```

### 9. Database Migration Considerations

No schema changes needed! Tables remain the same:

- `align_customers` - Will be empty in Lite mode
- `align_virtual_accounts` - Will be empty in Lite mode
- `align_transfers` - Will be empty in Lite mode
- `users.kycMarkedDone` - Will always be false in Lite mode
- `users.kycSubStatus` - Will be null in Lite mode

### 10. Testing Requirements

#### Create: `packages/web/src/test/lite-mode.test.ts`

```typescript
describe('Zero Finance Lite Mode', () => {
  beforeEach(() => {
    // Clear Align env vars to simulate Lite mode
    delete process.env.ALIGN_API_KEY;
    delete process.env.ALIGN_SECRET;
  });

  it('should skip KYC in onboarding', async () => {
    const steps = getOnboardingSteps();
    expect(steps).not.toContain('kyc');
  });

  it('should hide banking navigation items', () => {
    const nav = getNavigationItems();
    expect(nav).not.toContain('Transfers');
    expect(nav).not.toContain('Banking');
  });

  it('should only show crypto payment methods', () => {
    const methods = getPaymentMethods();
    expect(methods).not.toContain('ACH');
    expect(methods).not.toContain('Wire');
  });

  it('should return graceful errors for banking operations', async () => {
    const result = await createVirtualAccount();
    expect(result.error).toBe('Banking features not available in Lite mode');
  });
});
```

### 11. Documentation Updates

#### Update: `packages/web/README.md`

Add section about Lite mode:

```markdown
## Running in Lite Mode (Crypto Only)

Zero Finance can run without banking features using only Privy for auth:

### Minimal Setup

\`\`\`bash

# Create .env.local with just these:

POSTGRES_URL=postgresql://localhost:5432/zero_finance
NEXT_PUBLIC_PRIVY_APP_ID=xxx
PRIVY_APP_SECRET=xxx
DEPLOYER_PRIVATE_KEY=xxx

# Run

pnpm dev
\`\`\`

This enables:

- ✅ Crypto invoicing
- ✅ Smart wallets
- ✅ Contractor management
- ❌ ACH/Wire transfers (disabled)
- ❌ KYC (not required)
```

#### Update: `packages/web/.env.example`

```bash
# ============================================
# MINIMAL SETUP (Zero Finance Lite)
# ============================================
# These 4 variables are ALL you need for Lite mode:

# Required: Database
POSTGRES_URL=postgresql://user:pass@localhost:5432/zero_finance

# Required: Privy Authentication
NEXT_PUBLIC_PRIVY_APP_ID=
PRIVY_APP_SECRET=

# Required: Wallet Deployment
DEPLOYER_PRIVATE_KEY=

# ============================================
# OPTIONAL: Enable Banking (Align)
# ============================================
# Add these to enable ACH/Wire transfers and KYC:

# ALIGN_API_KEY=
# ALIGN_SECRET=
# ALIGN_CLIENT_ID=
# ALIGN_ENVIRONMENT=sandbox
# ALIGN_WEBHOOK_SECRET=
# NEXT_PUBLIC_ALIGN_PUBLISHABLE_KEY=

# ... rest of optional services
```

### 12. Migration Scripts

#### Create: `packages/web/scripts/check-lite-mode.ts`

```typescript
#!/usr/bin/env node
/**
 * Script to verify Lite mode configuration
 */

import { featureConfig } from '../src/lib/feature-config';

console.log('🔍 Zero Finance Configuration Check\n');

console.log(
  'Mode:',
  featureConfig.align.enabled
    ? '💼 FULL (with Banking)'
    : '⚡ LITE (Crypto Only)',
);
console.log('\nEnabled Features:');
console.log('✅ Authentication (Privy)');
console.log('✅ Smart Wallets');
console.log('✅ Crypto Invoicing');
console.log('✅ Contractor Management');

if (featureConfig.align.enabled) {
  console.log('✅ KYC/Identity Verification');
  console.log('✅ Virtual Bank Accounts');
  console.log('✅ ACH Transfers');
  console.log('✅ Wire Transfers');
} else {
  console.log('❌ KYC/Identity Verification (not required)');
  console.log('❌ Virtual Bank Accounts');
  console.log('❌ ACH Transfers');
  console.log('❌ Wire Transfers');
}

if (featureConfig.earn.enabled) {
  console.log('✅ Savings/Earn Module');
} else {
  console.log('❌ Savings/Earn Module');
}

if (featureConfig.ai.enabled) {
  console.log('✅ AI Invoice Extraction');
} else {
  console.log('❌ AI Invoice Extraction');
}

console.log('\n📝 Summary:');
if (!featureConfig.align.enabled) {
  console.log(
    'Running in LITE mode - perfect for development and crypto-only use cases!',
  );
  console.log(
    'To enable banking features, add Align credentials to your .env file.',
  );
} else {
  console.log('Running in FULL mode with all features enabled.');
}
```

### 13. Type Safety Updates

#### Update: `packages/web/src/types/align.ts`

```typescript
// Add discriminated union types for better type safety
export type AlignCustomerStatus =
  | {
      available: false;
      kycStatus: 'not_required';
      message: string;
    }
  | {
      available: true;
      kycStatus: 'pending' | 'approved' | 'rejected';
      alignCustomerId: string;
      // ... other fields
    };
```

## Acceptance Criteria

- [ ] App starts with only Privy credentials (no Align required)
- [ ] Onboarding flow skips KYC when Align not configured
- [ ] Banking menu items hidden when Align not configured
- [ ] Payment methods limited to crypto when banking disabled
- [ ] All Align API calls return graceful errors when not configured
- [ ] Settings page hides banking/KYC sections appropriately
- [ ] Dashboard shows appropriate empty states for Lite mode
- [ ] No console errors about missing Align credentials
- [ ] Clear user messaging about what features are available
- [ ] Easy upgrade path (just add Align credentials and restart)

## Testing Checklist

### Manual Testing

1. **Fresh Install Test**

   - [ ] Clone repo
   - [ ] Create minimal .env.local (4 lines)
   - [ ] Run `pnpm install && pnpm dev`
   - [ ] Verify app starts without errors

2. **Onboarding Flow**

   - [ ] Create account with Privy
   - [ ] Complete safe creation
   - [ ] Verify KYC step is skipped
   - [ ] Reach dashboard successfully

3. **Feature Availability**

   - [ ] Create crypto invoice ✅
   - [ ] Invite contractor ✅
   - [ ] Manage companies ✅
   - [ ] Try ACH transfer (should show "not available") ❌
   - [ ] Access banking settings (should be hidden) ❌

4. **Upgrade Path**
   - [ ] Add Align credentials to .env
   - [ ] Restart app
   - [ ] Verify banking features appear
   - [ ] Complete KYC flow
   - [ ] Verify virtual account creation works

### Automated Testing

```bash
# Run Lite mode tests
LITE_MODE=true pnpm test:lite

# Run with minimal env
env -i \
  POSTGRES_URL=test \
  NEXT_PUBLIC_PRIVY_APP_ID=test \
  PRIVY_APP_SECRET=test \
  DEPLOYER_PRIVATE_KEY=test \
  pnpm test
```

## Implementation Priority

### 🚨 Phase 0: CRITICAL FIX (Immediate)

- [ ] Fix `align-api.ts:340` to not throw on missing env var
- [ ] Add liteMode flag to prevent crashes
- **Without this, the app is unusable for new developers**

### Phase 1: Core Config (Day 1)

- [ ] Create feature-config.ts
- [ ] Update align-router.ts with guards
- [ ] Update onboarding flow (skip KYC when not available)

### Phase 2: UI Updates (Day 2)

- [ ] Update navigation/sidebar (hide Banking when unavailable)
- [ ] Update dashboard components
- [ ] Update settings pages
- [ ] Fix payment method options in invoice forms

### Phase 3: Testing & Docs (Day 3)

- [ ] Add test coverage
- [ ] Update documentation
- [ ] Create migration guide

## Rollout Strategy

1. **Alpha**: Test internally with development team
2. **Beta**: Deploy to staging with feature flag
3. **Production**: Gradual rollout with monitoring

## Success Metrics

- 90% reduction in onboarding time (no KYC wait)
- 80% reduction in initial setup complexity
- 0 required external service dependencies (except Privy)
- <5 minute time to first invoice created

## Related Issues

- Relates to: #[Previous Issue Number] - "Simplify local development"
- Relates to: #[Previous Issue Number] - "Support international users"
- Blocks: #[Future Issue] - "Docker containerization"

## Resources

- [ZERO_FINANCE_LITE_RISK_ASSESSMENT.md](./ZERO_FINANCE_LITE_RISK_ASSESSMENT.md) - **NEW: Detailed codebase analysis and risk assessment**
- [ZERO_FINANCE_LITE.md](./ZERO_FINANCE_LITE.md) - Original proposal documentation
- [ENV_DEPENDENCIES_REPORT.md](./ENV_DEPENDENCIES_REPORT.md) - Full environment analysis
- [Privy Documentation](https://docs.privy.io)

## Questions/Concerns

1. **Q: Will this create maintenance burden?**
   A: No, it's the same codebase with conditional feature flags.

2. **Q: Can users migrate from Lite to Full?**
   A: Yes, just add Align credentials and restart.

3. **Q: What about existing users?**
   A: No impact. Full mode remains default if Align is configured.

## Definition of Done

- [ ] Code implementation complete
- [ ] All tests passing
- [ ] Documentation updated
- [ ] PR reviewed and approved
- [ ] Deployed to staging
- [ ] Verified in production environment
- [ ] Announcement sent to users

---

**Labels:** `enhancement`, `developer-experience`, `high-priority`, `backend`, `frontend`

**Assignees:** @[developer-name]

**Milestone:** v2.0 - Lite Mode

**Estimate:** 3-4 days (based on codebase analysis)

**Dependencies:** None (that's the point! 🎉)

---
