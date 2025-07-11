# Gmail Sync Production Fix

## Problem
Gmail sync was hanging on production (Vercel) with status "Sync in progress" for hours. The issue was caused by:

1. **Vercel Function Timeout Limits**: 
   - Hobby: 10 seconds
   - Pro: 60 seconds
   - Enterprise: 900 seconds

2. **Background Processing**: The sync was using `waitUntil()` to process all emails in background, which doesn't work on Vercel due to timeout limits.

## Solution Implemented

### 1. Synchronous Processing with Small Batches
Modified `syncGmail` in `inbox-router.ts` to:
- Process only 5 emails synchronously in the initial request
- Save progress (nextPageToken) to the database
- Mark job as PENDING if more work is needed

### 2. Vercel Cron Job for Continuation
Created `/api/cron/process-gmail-sync/route.ts`:
- Runs every 2 minutes (`*/2 * * * *`)
- Picks up PENDING jobs with saved progress
- Processes 3 pages (15 emails) per cron run
- Updates job progress in database

### 3. Configuration

#### Environment Variables
Add to `.env`:
```
CRON_SECRET=your-secure-random-string-here
```

#### Vercel Cron Configuration
Already added to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/process-gmail-sync",
      "schedule": "*/2 * * * *"
    }
  ]
}
```

### 4. Database Schema
The `gmailSyncJobs` table already has necessary fields:
- `nextPageToken`: Stores Gmail pagination cursor
- `processedCount`: Tracks total emails processed
- `currentAction`: Shows current processing status

## How It Works Now

1. User clicks "Sync Gmail"
2. Initial request processes 5 emails synchronously (< 10 seconds)
3. If more emails exist, job is marked PENDING with saved cursor
4. Cron job runs every 2 minutes, picks up PENDING jobs
5. Each cron run processes up to 15 more emails per job
6. Process continues until all emails are processed

## Benefits

- Works within Vercel timeout limits
- Provides real-time progress updates
- Resilient to failures (can resume from saved state)
- Scales to any number of emails

## Performance Tips

1. Reduce initial batch size if still timing out
2. Adjust cron frequency based on load
3. Consider using external queue service (Upstash, QStash) for better reliability
4. Monitor Vercel function logs for timeout warnings

## Alternative Solutions

For better performance at scale:
1. **QStash by Upstash**: Message queue with HTTP callbacks
2. **Inngest**: Event-driven background jobs
3. **Trigger.dev**: Long-running background jobs
4. **External Worker**: Dedicated server/container for processing 