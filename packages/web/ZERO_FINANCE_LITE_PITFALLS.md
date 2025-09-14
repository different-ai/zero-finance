# Zero Finance Lite Implementation - Critical Pitfalls & Hidden Dependencies

## ⚠️ CRITICAL WARNING

**This document maps ALL the hidden failure points that could break your Zero Finance Lite implementation. These are the places where AI-assisted coding might miss crucial dependencies or create subtle bugs.**

## 🔴 Immediate Crash Points (App Won't Start)

### 1. **Global Align API Instance**

**File:** `src/server/services/align-api.ts:1028`

```typescript
// THIS CRASHES ON STARTUP!
export const alignApi = new AlignApiClient();
// Constructor throws at line 340 if no ALIGN_API_KEY
```

**Impact:** App crashes before any route is even accessed
**Fix Required:** Lazy initialization or conditional instantiation

### 2. **Align Router Import in Main App**

**File:** `src/server/routers/_app.ts:9,44`

```typescript
import { alignRouter } from './align-router';
// ...
align: alignRouter, // This gets evaluated on startup
```

**Impact:** Router initialization may fail
**Fix Required:** Conditional router registration or safe wrapper

## 🟡 Runtime Failures (Breaks on User Action)

### 3. **Onboarding Router Hard Dependencies**

**File:** `src/server/routers/onboarding-router.ts`

```typescript
// Line 207-208: Creates Align caller without checking
const alignCaller = alignRouter.createCaller(ctx);
const alignCustomerPromise = alignCaller.getCustomerStatus();

// Line 277-281: REQUIRES KYC for completion
const isCompleted =
  steps.createSafe.isCompleted &&
  steps.verifyIdentity.isCompleted && // ← Always required!
  steps.openSavings.isCompleted;
```

**Impact:** Users can't complete onboarding without KYC
**Hidden Issue:** Even if UI hides KYC, backend still requires it

### 4. **Dashboard Page Queries**

**File:** `src/app/onboarding/layout.tsx:32`

```typescript
const { data: customerStatus } = api.align.getCustomerStatus.useQuery(
  undefined,
  { enabled: ready && authenticated },
);
// No error handling if Align unavailable
```

**Impact:** Page crashes if query fails
**Fix Required:** Add error boundaries and fallback UI

### 5. **Payment Form Virtual Accounts**

**File:** `src/components/invoice/payment-details-form.tsx:70`

```typescript
const { data: virtualAccounts, isLoading: loadingAccounts } =
  api.align.getAllVirtualAccounts.useQuery();
// Assumes this always works
```

**Impact:** Invoice creation may fail
**Fix Required:** Conditional query based on feature availability

## 🟠 Hidden UI Dependencies

### 6. **Hardcoded Navigation Items**

**File:** `src/components/layout/sidebar.tsx:56-71`

```typescript
navigationItems: [
  {
    name: 'Banking', // Always shown!
    href: '/dashboard',
    icon: Banknote,
  },
  // No conditional logic
];
```

**Impact:** Users see banking options that don't work

### 7. **Onboarding Steps Constants**

**File:** `src/app/onboarding/constants.ts:2-6`

```typescript
export const steps = [
  { name: 'Activate Primary Account', path: '/onboarding/create-safe' },
  { name: 'Verify Identity', path: '/onboarding/kyc' }, // Always included!
  { name: 'Complete', path: '/onboarding/complete' },
];
```

**Impact:** Onboarding flow shows KYC step even when not available

### 8. **Invoice Form Payment Methods**

**File:** `src/components/invoice/simple-invoice-form.tsx:97`

```typescript
paymentMethod: 'ach', // Default to ACH bank transfer
// No check if ACH is actually available
```

**Impact:** Default payment method may not be available

## 🔵 Background Process Failures

### 9. **Cron Job: KYC Notifications**

**File:** `src/app/api/cron/kyc-notifications/route.ts`

```typescript
// Line 88: Directly calls Align API
const customer = await alignApi.getCustomer(alignCustomerId);
```

**Impact:** Cron job fails, error logs pile up
**Fix Required:** Skip if Align not configured

### 10. **Admin Sync Endpoint**

**File:** `src/app/api/admin/sync-all-kyc/route.ts`

```typescript
// Line 57: No check if Align is available
const customer = await alignApi.getCustomer(user.alignCustomerId);
```

**Impact:** Admin tools break
**Fix Required:** Return early if no Align

## 🟣 Database Assumptions

### 11. **User Table KYC Fields**

While nullable, many queries assume these have values:

- `alignCustomerId`
- `kycStatus`
- `kycMarkedDone`
- `alignVirtualAccountId`

**Files with assumptions:**

- `src/components/admin/admin-panel.tsx` - Shows KYC status columns
- `src/components/admin/kyc-kanban-board.tsx` - Filters by KYC status
- `src/app/(authenticated)/dashboard/(bank)/components/dashboard/onboarding-tasks-card.tsx`

## 🔴 Critical Test File Dependencies

### 12. **Test Setup Forces Align**

**File:** `vitest.setup.ts:2-3`

```typescript
process.env.ALIGN_API_KEY = process.env.ALIGN_API_KEY || 'test-key';
process.env.ALIGN_API_BASE_URL =
  process.env.ALIGN_API_BASE_URL || 'https://align.test';
```

**Impact:** Tests may pass but production fails
**Fix Required:** Conditional test setup

## 💀 The "AI Assistant" Traps

### 13. **Partial Updates Create Inconsistent State**

**Common AI Mistake:** Updates UI to hide banking but leaves API calls
**Result:** Users click hidden buttons → API calls fail → cryptic errors

### 14. **Copy-Paste Feature Flags**

**Common AI Mistake:** Creates feature flag in one file, forgets to import/use elsewhere
**Example:**

```typescript
// Created in feature-config.ts
export const featureConfig = { align: { enabled: false } }

// But in align-router.ts:
if (featureConfig.align.enabled) { // Forgot to import!
```

### 15. **Async Race Conditions**

**Files:** `src/server/routers/onboarding-router.ts:207-214`

```typescript
// These run in parallel
const [user, primarySafe, alignCustomer] = await Promise.all([
  userPromise,
  primarySafePromise,
  alignCustomerPromise, // This might fail!
]);
```

**AI Fix Attempt:** Wraps in try-catch
**Problem:** Other promises might depend on failed one

### 16. **Cached Query Invalidation**

**Files:** Multiple components using `queryClient.invalidateQueries`

```typescript
// src/components/settings/align-integration/align-kyc-status.tsx:98
queryClient.invalidateQueries({ queryKey: getCustomerStatusQueryKey });
```

**Problem:** If query doesn't exist in Lite mode, invalidation might cause errors

## 🎯 Most Likely Failure Scenarios

### Scenario 1: Fresh Install

1. Developer clones repo
2. Sets minimal .env (no Align)
3. Runs `pnpm dev`
4. **CRASH** at `align-api.ts:340`

### Scenario 2: Onboarding Flow

1. User creates account
2. Creates safe successfully
3. Tries to complete onboarding
4. **STUCK** - Backend requires KYC completion

### Scenario 3: Invoice Creation

1. User navigates to create invoice
2. Form loads with ACH as default
3. User fills form and submits
4. **ERROR** - Payment method validation fails

### Scenario 4: Dashboard Load

1. User logs in successfully
2. Dashboard queries run in parallel
3. Align query fails
4. **WHITE SCREEN** - No error boundary

## ✅ Complete Checklist for Safe Implementation

### Phase 1: Prevent Crashes

- [ ] Fix `align-api.ts` constructor to not throw
- [ ] Make `alignApi` export conditional/lazy
- [ ] Add error boundary to dashboard
- [ ] Fix onboarding completion logic

### Phase 2: Fix UI/UX

- [ ] Make navigation items conditional
- [ ] Update onboarding constants
- [ ] Fix payment method defaults
- [ ] Add feature availability checks to all forms

### Phase 3: Background Processes

- [ ] Update cron jobs to check Align availability
- [ ] Fix admin endpoints
- [ ] Add proper error handling to all API routes

### Phase 4: Testing

- [ ] Update test setup for conditional Align
- [ ] Add Lite mode specific tests
- [ ] Test upgrade path from Lite to Full

## 🚨 Red Flags in Code Review

Watch for these patterns that indicate missed dependencies:

1. **Direct imports of Align services**

   ```typescript
   import { alignApi } from '@/server/services/align-api';
   ```

2. **Unconditional queries**

   ```typescript
   api.align.someMethod.useQuery(); // No enabled condition
   ```

3. **Hardcoded payment types**

   ```typescript
   paymentMethod: 'ach'; // Should check availability
   ```

4. **Missing error boundaries**

   ```typescript
   const { data } = useQuery(); // No error handling
   ```

5. **Parallel promises without individual error handling**
   ```typescript
   Promise.all([...]) // One failure crashes all
   ```

## 🔧 Quick Fixes vs Proper Solutions

### Quick Fix (Risky)

```typescript
// Just wrap everything in try-catch
try {
  const result = await alignApi.someMethod();
} catch {
  return null; // Silent failure!
}
```

### Proper Solution

```typescript
// Check availability first
if (!featureConfig.align.enabled) {
  return { available: false, message: 'Banking not available' };
}
// Then make the call with proper error handling
```

## 📊 Risk Matrix

| Component                | Risk Level | User Impact           | Fix Complexity |
| ------------------------ | ---------- | --------------------- | -------------- |
| align-api.ts constructor | CRITICAL   | App won't start       | Low            |
| Onboarding completion    | HIGH       | Can't complete signup | Medium         |
| Dashboard queries        | HIGH       | White screen          | Medium         |
| Navigation items         | MEDIUM     | Confusion             | Low            |
| Cron jobs                | LOW        | Background errors     | Low            |
| Payment defaults         | MEDIUM     | Form errors           | Low            |

## 🎬 Final Warning

**The biggest risk is not the code you change, but the code you don't know needs changing.**

Every file that imports from `@/server/services/align-api` or uses `api.align.*` is a potential failure point. The TypeScript compiler won't catch these at build time if the types still exist.

**Remember:** An AI assistant might fix 90% of the issues but miss the 10% that causes production outages. This document contains that critical 10%.
