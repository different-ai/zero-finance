# Onboarding Skip Implementation

## Overview
Implemented a backend-persistent solution for the onboarding stepper skip functionality, replacing the previous localStorage-based approach.

## Changes Made

### Database Schema
- Added `skippedOrCompletedOnboardingStepper` boolean field to `userProfilesTable` with default value `false`
- Generated and applied migration: `0029_cynical_masque.sql`

### Backend API
- Updated `updateProfile` mutation in `user-router.ts` to accept the new field
- The `getProfile` query automatically returns this field as part of the user profile

### Frontend Components

#### New Hook: `useSkipOnboarding`
- Created `packages/web/src/hooks/use-skip-onboarding.ts`
- Handles updating the backend flag and navigating to dashboard
- Provides loading state during the skip operation

#### Updated Onboarding Pages
All onboarding pages now use the `useSkipOnboarding` hook for their "Skip for now" buttons:
- `welcome/page.tsx`
- `add-email/page.tsx`
- `create-safe/page.tsx`
- `kyc/page.tsx`
- `kyc-pending-review/page.tsx`

#### Onboarding Completion
- `complete/page.tsx` now sets `skippedOrCompletedOnboardingStepper` to `true` when user completes the stepper

#### OnboardingTasksCard
- Updated to check the backend flag instead of localStorage
- The "Skip for now" button updates the backend flag via tRPC mutation

### Authentication Layout Fix
- **Issue**: Users who skipped onboarding were being redirected back to `/onboarding/welcome` due to the authenticated layout only checking `hasCompletedOnboarding`
- **Solution**: Updated `packages/web/src/app/(authenticated)/layout.tsx` to also check `skippedOrCompletedOnboardingStepper`
- Now users who have either completed or skipped the onboarding stepper can access the dashboard

### Safe Creation UI Embedding
- **Issue**: When users have no primary safe, the AllocationSummaryCard was showing an error instead of helping them create one
- **Solution**: Embedded the `CreateSafePage` component directly in the `AllocationSummaryCard` when no primary safe exists
- Used dynamic import with `ssr: false` to avoid SSR issues with Privy wallet creation

### Graceful Error Handling for New Users
- **Issue**: The allocations.getStatus and useUserSafes queries were throwing errors for new users with no safes
- **Solutions**:
  1. Modified `allocations-router.ts` to return empty status instead of throwing NOT_FOUND error when no safes exist
  2. Updated `AllocationSummaryCard` to properly handle empty safes data without showing error state
  3. Only show error cards for actual fetch errors, not missing data states

## How It Works

1. **Skip Flow**: User clicks "Skip for now" → `useSkipOnboarding` hook → Updates backend flag → Navigates to dashboard
2. **Complete Flow**: User completes all steps → Reaches complete page → Backend flag is set → User goes to dashboard
3. **Dashboard Access**: Authenticated layout checks both `hasCompletedOnboarding` OR `skippedOrCompletedOnboardingStepper`
4. **Tasks Card**: Only shows if `skippedOrCompletedOnboardingStepper` is `false`
5. **Safe Creation**: New users see embedded safe creation UI instead of errors

## Benefits

- Persistent across sessions (stored in database)
- Works across devices (tied to user account)
- Cleaner code with centralized skip logic
- No more localStorage cleanup issues
- Better user experience for new users with embedded safe creation
- No more error states for expected new user conditions

## Testing

Created test script: `packages/web/scripts/test-onboarding-skip.ts` to verify the implementation works correctly. 