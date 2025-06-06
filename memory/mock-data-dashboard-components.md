# Mock Data in Dashboard Components

This file tracks mock data that needs to be replaced with real data from the backend.

## Components with Mock Data

### 1. FundsDisplay Component
**File**: `packages/web/src/app/(authenticated)/dashboard/(bank)/components/dashboard/funds-display.tsx`

**Mock Data**:
- `mockIBAN`: 'LT06 3250 0582 7846 2873'
- `mockBIC`: 'REVOLT21'
- `beneficiaryName`: 'Benjamin Shafii'

**TODO**: These should come from the Align integration API or user settings.

### 2. TransactionHistoryList Component
**File**: `packages/web/src/app/(authenticated)/dashboard/(bank)/components/dashboard/transaction-history-list.tsx`

**Mock Data**:
- `mockTransactions`: Array of 10 mock transactions with hardcoded data including:
  - Transaction names (Different Ai, Audible, Fitness Sf Fillmore E, etc.)
  - Amounts and dates
  - Status and descriptions
  - Balance information

**TODO**: This should be fetched from the actual transaction history API endpoint.

## Implementation Notes

When replacing mock data:
1. Create appropriate tRPC endpoints to fetch real data
2. Update components to use `useQuery` hooks instead of hardcoded data
3. Ensure proper loading and error states are maintained
4. Keep the same UI structure and styling 