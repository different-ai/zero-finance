# Auto-Earn Historical Percentage Fix

## Problem
The `getRecentEarnDeposits` procedure was incorrectly calculating historical original deposit amounts. It was using the *current* auto-earn percentage (defaulting to 10% if no configuration exists) to reverse-calculate the original amount from the saved amount. This led to inaccurate transaction history displays when users changed their auto-earn percentage after deposits were made.

## Solution
1. Added a new column `depositPercentage` to the `earnDeposits` table to store the percentage used at the time of each deposit
2. Updated `triggerAutoEarn` in `earn-router.ts` to fetch and store the current auto-earn percentage when creating deposits
3. Updated the `auto-earn-worker.ts` script to store the percentage when creating deposits
4. Fixed `getRecentEarnDeposits` to use the stored percentage instead of the current percentage for accurate historical calculations

## Implementation Details

### Database Schema Change
```sql
ALTER TABLE "earn_deposits" ADD COLUMN "deposit_percentage" integer;
```

### Code Changes
- `packages/web/src/db/schema.ts`: Added `depositPercentage: integer('deposit_percentage')` to earnDeposits table
- `packages/web/src/server/routers/earn-router.ts`: 
  - `triggerAutoEarn`: Now fetches current percentage and stores it with the deposit
  - `getRecentEarnDeposits`: Uses stored percentage for calculations (defaults to 10% for historical deposits without stored percentage)
- `packages/web/scripts/auto-earn-worker.ts`: Updated to store percentage when creating deposits

### Migration
- Generated and applied migration: `0056_smooth_darkstar.sql`

## Result
Historical transaction displays now accurately show the original deposit amount based on the percentage that was active at the time of the deposit, not the current percentage. This ensures that changing the auto-earn percentage doesn't retroactively affect the display of past transactions. 