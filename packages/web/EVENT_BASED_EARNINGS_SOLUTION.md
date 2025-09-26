# Event-Based Earnings Solution

## Problem Solved

The earnings animation was starting from $0 because it didn't properly account for historical deposits and their accumulated earnings over time.

## Solution: Event-Based Accumulated Earnings

### Core Concept

Track every deposit and withdrawal as an event with timestamp and calculate earnings for each period independently, then sum them up.

### Key Components

1. **`event-based-earnings.ts`** - Core calculation engine

   - Uses BigInt for all calculations to avoid floating point errors
   - Tracks deposits with their original timestamps and APY
   - Handles proportional withdrawals
   - Calculates accumulated earnings from deposit time to now

2. **`animated-earnings-v2.tsx`** - Improved animation component

   - Starts from accumulated earnings, never from 0
   - Uses requestAnimationFrame for smooth animation
   - Shows "Calculating..." during initialization
   - Handles edge cases gracefully

3. **`test-earnings-events`** - Interactive test page
   - Add/remove deposits and withdrawals
   - See real-time calculation
   - Test multiple vaults

## Pitfalls Avoided

### 1. **Time Zone Issues** ✅

- Always use ISO strings or Date objects
- Calculate in UTC timestamps
- Convert to milliseconds for precision

### 2. **Floating Point Errors** ✅

- Use BigInt for all money calculations
- Convert to decimals only for display
- Store amounts in smallest unit (cents/wei)

### 3. **Missing Events** ✅

- Use transaction hash as unique ID
- Validate events before processing
- Handle duplicate detection

### 4. **APY Changes** ✅

- Store APY at deposit time
- Each deposit tracks its own rate
- Don't apply current APY to old deposits

### 5. **Withdrawal Complexity** ✅

- Use proportional reduction
- All deposits reduced equally
- Avoids FIFO/LIFO complexity

### 6. **Race Conditions** ✅

- Show "Calculating..." during load
- Initialize with accumulated value immediately
- Never start from 0 if data exists

### 7. **Multi-Vault Support** ✅

- Calculate each vault separately
- Sum earnings across vaults
- Track vault-specific APYs

## How It Works

```typescript
// Example: User deposits $1000 30 days ago at 8% APY
const event: EarningsEvent = {
  id: 'tx123',
  type: 'deposit',
  timestamp: '2024-02-26T10:00:00Z',
  amount: 1000000000n, // $1000 in 6 decimals
  vaultAddress: '0xVault1',
  apy: 8.0,
};

// Calculate accumulated earnings
const earnings = (amount * apy * days) / (100 * 365);
// = (1000 * 8 * 30) / (100 * 365)
// = $6.57 accumulated

// Animation starts from $6.57, not $0!
```

## Integration Path

1. **Update deposit/withdrawal recording** to include timestamps and APY
2. **Fetch events** from database with full history
3. **Replace AnimatedTotalEarned** with AnimatedEarningsV2
4. **Pass events** instead of just initial value and current APY

## Benefits

- **Accurate**: Reflects actual deposit history
- **Smooth**: No jarring "start from 0" experience
- **Robust**: Handles complex scenarios (multiple deposits, withdrawals, vaults)
- **Precise**: BigInt math avoids rounding errors
- **Scalable**: Works with any number of events

## Testing

Visit `/test-earnings-events` to see the solution in action. Try:

1. Adding multiple deposits at different times
2. Adding withdrawals
3. Watching how earnings accumulate correctly
4. Observing that animation never starts from 0

## Next Steps

1. Update the database schema to ensure all deposits have timestamps
2. Modify the earn router to return events instead of aggregated stats
3. Deploy AnimatedEarningsV2 to production
4. Add historical APY tracking for even more accuracy
