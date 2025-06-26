# Gmail Sync Local Development

## Overview
Since Vercel cron jobs don't run locally, we've implemented auto-continuation for Gmail sync in development mode.

## How It Works

### 1. **Automatic Continuation**
When running locally (`NODE_ENV=development`), the app automatically continues processing emails:
- After the initial batch (1 email), it waits 2 seconds
- Then automatically calls `continueSyncJob` to process the next batch
- Continues with progressive batch sizes: 1 → 2 → 4 → 8 → 10

### 2. **Manual Continue Button**
In development mode, a "Continue" button appears when:
- A sync job is in PENDING status
- There are more emails to process (nextPageToken exists)
- Useful for debugging or controlling the pace manually

### 3. **Progressive Batch Processing**
```typescript
function getNextBatchSize(currentProcessedCount: number): number {
  if (currentProcessedCount === 0) return 1;
  if (currentProcessedCount === 1) return 2;
  if (currentProcessedCount === 3) return 4;
  if (currentProcessedCount === 7) return 8;
  return 10; // Max batch size
}
```

## Development Workflow

1. **Start Local Server**
   ```bash
   cd packages/web
   pnpm dev
   ```

2. **Connect Gmail**
   - Navigate to http://localhost:3050/dashboard/inbox
   - Click "Connect Gmail"
   - Authorize with Google

3. **Start Sync**
   - Click "Sync Gmail"
   - Watch as first email is processed immediately
   - Auto-continuation kicks in after 2 seconds
   - Or click "Continue" button manually

## API Endpoints

### `syncGmail`
- Processes first email synchronously
- Sets up job for continuation

### `continueSyncJob`
- Can be called without jobId (finds latest pending job)
- Processes next batch according to progressive sizing
- Returns status: 'pending' or 'completed'

## Environment Detection
The app detects local development using:
```typescript
if (process.env.NODE_ENV === 'development') {
  // Enable auto-continuation
}
```

## Debugging Tips

1. **Check Job Status**
   - Open browser DevTools
   - Watch Network tab for `getSyncJobStatus` queries
   - Check `currentAction` field for detailed progress

2. **Manual Control**
   - Use the "Continue" button to step through batches
   - Cancel and restart to test edge cases

3. **Database Inspection**
   - Check `gmailSyncJobs` table for job state
   - Look for `nextPageToken` to see if more emails exist

## Production vs Development

| Feature | Development | Production |
|---------|-------------|------------|
| Initial Batch | 1 email | 1 email |
| Continuation | Auto (2s delay) | Vercel Cron (2 min) |
| Manual Continue | ✅ Available | ❌ Not shown |
| Max Runtime | Unlimited | 10-900s (plan based) |

## Common Issues

### Sync Stuck
- Check if `continueSyncMutation` is failing
- Look for errors in console
- Verify Gmail token is valid

### Too Fast/Slow
- Adjust delay in `checkAndContinue` function
- Modify batch sizes in `getNextBatchSize`

### Memory Usage
- Large email processing can consume memory
- Consider restarting dev server periodically 