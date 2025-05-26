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

#### Updated Components:
1. **OnboardingTasksCard** (`packages/web/src/app/(authenticated)/dashboard/(bank)/components/dashboard/onboarding-tasks-card.tsx`)
   - Removed localStorage logic
   - Now uses backend flag to determine visibility
   - Skip button updates backend via tRPC mutation

2. **All Onboarding Pages**:
   - `welcome/page.tsx`
   - `add-email/page.tsx`
   - `create-safe/page.tsx`
   - `kyc/page.tsx`
   - `kyc-pending-review/page.tsx`
   - All now use `useSkipOnboarding` hook for consistent skip behavior

3. **Complete Page** (`complete/page.tsx`)
   - Automatically sets `skippedOrCompletedOnboardingStepper` to `true` when reached
   - Ensures the flag is set whether user completes or skips individual steps

## How It Works

1. When a user clicks "Skip for now" on any onboarding page or the OnboardingTasksCard:
   - The `useSkipOnboarding` hook calls the `updateProfile` mutation
   - Sets `skippedOrCompletedOnboardingStepper` to `true` in the database
   - Navigates the user to `/dashboard`

2. When the OnboardingTasksCard renders:
   - It checks the user's profile for `skippedOrCompletedOnboardingStepper`
   - If `true`, the card doesn't render
   - This persists across sessions and devices

3. When a user completes the onboarding flow:
   - The `complete` page automatically sets the flag to `true`
   - This ensures the stepper is hidden for users who complete it normally

## Testing
- Created test script: `packages/web/scripts/test-onboarding-skip.ts`
- Verifies database operations work correctly
- Can be run with: `pnpm tsx scripts/test-onboarding-skip.ts`

## Benefits
- ✅ Persistent across devices and sessions
- ✅ Survives browser cache clears
- ✅ Consistent UX for all users
- ✅ Backend source of truth
- ✅ No more localStorage dependencies 