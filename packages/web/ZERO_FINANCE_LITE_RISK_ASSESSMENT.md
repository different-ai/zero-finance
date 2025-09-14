# Zero Finance Lite Mode - Risk Assessment & Implementation Analysis

## Executive Summary

After analyzing the Zero Finance codebase, implementing a "Lite" mode that removes the Align dependency is **FEASIBLE** with **MEDIUM complexity** and **LOW risk** when properly implemented. The codebase is already well-structured with clear separation of concerns, making the changes straightforward.

## Current State Analysis

### 1. Align Integration Points (CRITICAL)

**Current Issues Found:**

- `align-api.ts:340` - **HARD CRASH**: Constructor throws error when `ALIGN_API_KEY` is missing
- Onboarding flow **REQUIRES** KYC verification (lines 277-281 in `onboarding-router.ts`)
- Dashboard assumes banking features exist (no conditional rendering)
- Sidebar navigation shows Banking/Transfers regardless of availability

**Align Touch Points:**

- `/src/server/services/align-api.ts` - Core API service (throws on missing env)
- `/src/server/routers/align-router.ts` - TRPC router for Align operations
- `/src/server/routers/onboarding-router.ts` - KYC embedded in onboarding
- `/src/app/onboarding/kyc/` - KYC UI components
- `/src/components/settings/align-integration/` - Align-specific UI components
- Database tables: `users` (kyc fields), `onramp_transfers`, `offramp_transfers`

### 2. Database Impact (LOW RISK)

**Good News:** No schema changes required!

- Align-related tables will simply remain empty in Lite mode
- Fields like `kycStatus`, `alignCustomerId` can be null
- No migrations needed, just conditional logic

**Affected Tables:**

```sql
users:
  - alignCustomerId (nullable)
  - kycProvider (nullable)
  - kycStatus (nullable)
  - kycMarkedDone (default: false)
  - alignVirtualAccountId (nullable)

offramp_transfers: (empty in Lite mode)
onramp_transfers: (empty in Lite mode)
```

### 3. UI/UX Components (MEDIUM COMPLEXITY)

**Components Requiring Updates:**

- `/src/components/layout/sidebar.tsx` - Hide Banking/Transfers menu items
- `/src/app/onboarding/constants.ts` - Remove KYC step
- `/src/app/onboarding/layout.tsx` - Skip KYC checks
- `/src/app/(authenticated)/dashboard/(bank)/page.tsx` - Conditional banking UI
- `/src/components/invoice/simple-invoice-form.tsx` - Remove ACH payment options

## Risk Assessment

### ✅ Low Risk Areas

1. **Database** - No schema changes, graceful degradation
2. **Authentication** - Privy works independently
3. **Smart Contracts** - Completely separate from Align
4. **Crypto Operations** - Unaffected

### ⚠️ Medium Risk Areas

1. **Onboarding Flow** - Needs careful testing to ensure smooth skip of KYC
2. **Router Errors** - Need proper error boundaries
3. **Feature Discovery** - Users might not understand what's available

### ❌ High Risk Areas

1. **Production Data** - Must ensure existing users aren't affected
2. **API Crashes** - Current code throws errors immediately

## Implementation Strategy

### Phase 1: Core Configuration (Day 1)

```typescript
// src/lib/feature-config.ts
export const featureConfig = {
  align: {
    enabled: !!(
      process.env.ALIGN_API_KEY &&
      process.env.ALIGN_SECRET &&
      process.env.ALIGN_CLIENT_ID
    ),
  },
  banking: {
    get enabled() {
      return featureConfig.align.enabled;
    },
  },
  kyc: {
    get required() {
      return featureConfig.align.enabled;
    },
  },
};
```

### Phase 2: Service Layer Protection (Day 1)

```typescript
// src/server/services/align-api.ts
constructor(apiKey = ALIGN_API_KEY, baseUrl = ALIGN_API_BASE_URL) {
  // CHANGE FROM:
  // if (!apiKey) {
  //   throw new Error('ALIGN_API_KEY environment variable is required');
  // }

  // TO:
  if (!apiKey) {
    console.warn('[Align] Running in Lite mode - banking features disabled');
    this.liteMode = true;
  }
  this.apiKey = apiKey || '';
  this.baseUrl = baseUrl;
}
```

### Phase 3: Router Updates (Day 2)

```typescript
// src/server/routers/align-router.ts
export const alignRouter = router({
  isAvailable: publicProcedure.query(() => ({
    available: featureConfig.align.enabled,
  })),

  getCustomerStatus: protectedProcedure.query(async ({ ctx }) => {
    if (!featureConfig.align.enabled) {
      return {
        alignCustomerId: null,
        kycStatus: 'not_required' as const,
        hasVirtualAccount: false,
      };
    }
    // ... existing implementation
  }),
});
```

### Phase 4: UI Conditionals (Day 2-3)

```typescript
// src/app/onboarding/constants.ts
export const steps = [
  { name: 'Activate Primary Account', path: '/onboarding/create-safe' },
  ...(featureConfig.kyc.required
    ? [{ name: 'Verify Identity', path: '/onboarding/kyc' }]
    : []),
  { name: 'Complete', path: '/onboarding/complete' },
];
```

## Testing Requirements

### Critical Test Cases

1. **Fresh Install** - App starts with minimal .env (4 lines)
2. **Onboarding** - Completes without KYC step
3. **Invoice Creation** - Works with crypto-only payments
4. **Existing Users** - Not affected by changes
5. **Upgrade Path** - Adding Align credentials enables features

### Performance Testing

- Ensure no performance degradation
- Check bundle size doesn't increase
- Verify no extra API calls in Lite mode

## Migration Guide

### For New Users (Lite Mode)

```bash
# Minimal .env.local
POSTGRES_URL=postgresql://...
NEXT_PUBLIC_PRIVY_APP_ID=xxx
PRIVY_APP_SECRET=xxx
DEPLOYER_PRIVATE_KEY=xxx

# Start app
pnpm dev
```

### For Existing Users (Full Mode)

No changes required - app continues working with all features.

### Upgrading from Lite to Full

1. Add Align credentials to .env
2. Restart application
3. Complete KYC through Settings
4. Banking features automatically appear

## Recommendations

### Must Have (P0)

1. ✅ Feature configuration system
2. ✅ Graceful error handling in align-api.ts
3. ✅ Conditional onboarding flow
4. ✅ Update navigation menus

### Should Have (P1)

1. Clear messaging about available features
2. Upgrade prompts for Lite users
3. Feature comparison table in docs

### Nice to Have (P2)

1. Analytics to track Lite vs Full usage
2. Progressive feature unlocking
3. Self-service upgrade flow

## Timeline Estimate

- **Day 1**: Core configuration + Service layer (4-6 hours)
- **Day 2**: Router updates + Onboarding flow (6-8 hours)
- **Day 3**: UI conditionals + Testing (6-8 hours)
- **Day 4**: Documentation + Edge cases (4-6 hours)

**Total: 3-4 days of development**

## Potential Issues & Mitigations

| Issue                         | Risk   | Mitigation                                |
| ----------------------------- | ------ | ----------------------------------------- |
| API throws on missing env     | HIGH   | Add liteMode flag, return graceful errors |
| Users confused about features | MEDIUM | Clear UI indicators for Lite mode         |
| Existing users affected       | HIGH   | Feature flag rollout, thorough testing    |
| Complex onboarding logic      | MEDIUM | Simplify step management                  |
| Hidden dependencies           | LOW    | Comprehensive grep search completed       |

## Decision Points

### Option 1: Minimal Changes (Recommended)

- Add feature config
- Update critical error paths
- Conditional UI rendering
- **Time: 3-4 days**
- **Risk: LOW**

### Option 2: Full Refactor

- Abstract all banking features
- Create separate routers
- Plugin architecture
- **Time: 2-3 weeks**
- **Risk: MEDIUM**

## Conclusion

The Zero Finance Lite implementation is **RECOMMENDED** with Option 1 approach. The codebase is already well-structured for this change, requiring primarily conditional logic rather than architectural changes. The main risks are around proper error handling and clear user communication.

## Appendix: Key Files to Modify

### Priority 1 (Blocking)

- [ ] `/src/server/services/align-api.ts` - Remove throw on missing key
- [ ] `/src/server/routers/align-router.ts` - Add availability checks
- [ ] `/src/app/onboarding/constants.ts` - Dynamic steps
- [ ] `/src/server/routers/onboarding-router.ts` - Skip KYC logic

### Priority 2 (Core Features)

- [ ] `/src/components/layout/sidebar.tsx` - Conditional navigation
- [ ] `/src/app/(authenticated)/dashboard/(bank)/page.tsx` - Conditional UI
- [ ] `/src/components/invoice/simple-invoice-form.tsx` - Payment methods
- [ ] `/src/app/onboarding/layout.tsx` - Skip KYC redirect

### Priority 3 (Polish)

- [ ] `/src/app/(authenticated)/dashboard/settings/page.tsx` - Hide banking settings
- [ ] Create `/src/lib/feature-config.ts` - Central configuration
- [ ] Update `.env.example` with clear sections
- [ ] Add migration script for checking mode

## Next Steps

1. Create feature branch: `feature/zero-finance-lite`
2. Implement Phase 1 (Core Config)
3. Test minimal .env startup
4. Proceed with phases 2-4
5. Comprehensive testing
6. Documentation update
7. PR review and merge
