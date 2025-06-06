# Virtual Account Simplification - Complete

## Summary
Successfully simplified the virtual account creation process as requested.

## Changes Made

### 1. Backend - Added `createAllVirtualAccounts` mutation
- Location: `packages/web/src/server/routers/align-router.ts`
- Automatically creates both USD (ACH) and EUR (IBAN) virtual accounts
- Uses the user's primary safe address as the destination
- Handles errors gracefully and continues if one currency fails
- Provides detailed logging and results

### 2. Frontend - Updated Onboarding Card
- Location: `packages/web/src/app/(authenticated)/dashboard/(bank)/components/dashboard/onboarding-tasks-card.tsx`
- Replaced "Set Up Account" link with "Set Up Accounts" button
- Added loading state with spinner when creating accounts
- Integrated success/error toast notifications
- Button is only enabled when KYC is approved

### 3. Cleanup
- Deleted: `packages/web/src/components/settings/align-integration/align-virtual-account-request-form.tsx`
- Deleted: `packages/web/src/app/(authenticated)/settings/funding-sources/align/page.tsx`
- Updated: `packages/web/src/components/settings/align-integration/index.ts` to remove export

## Current User Flow
1. User completes KYC verification
2. User sees "Set Up Accounts" button in onboarding card
3. User clicks button
4. Both USD and EUR virtual accounts are created automatically
5. Success/error message is shown
6. Onboarding card updates to show completion

## Error Fixed
The "Module not found: Can't resolve './align-virtual-account-request-form'" error has been resolved by:
- Removing the export from the index.ts file
- Deleting the component file itself
- Deleting the settings page that used it