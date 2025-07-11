# Email Sync Timeout Fix - Migration Notes

## Problem
- Vercel Runtime Timeout Error: Task timed out after 90 seconds
- Email sync was trying to process too many emails at once

## Solution Implemented
Used **Option 2: Pagination with Resume Support**

### Changes Made:

1. **Database Schema Updates** (`packages/web/src/db/schema.ts`):
   - Added `nextPageToken` field to store Gmail pagination cursor
   - Added `processedCount` field to track total emails processed

2. **Gmail Service Updates** (`packages/web/src/server/services/gmail-service.ts`):
   - Modified `fetchEmails` to return `FetchEmailsResult` with emails and nextPageToken
   - Added pagination support with pageToken parameter

3. **Inbox Router Updates** (`packages/web/src/server/routers/inbox-router.ts`):
   - Modified `syncGmail` to process emails in pages (20 per page)
   - Added progress tracking and cursor saving
   - Added `resumeSyncJob` mutation to continue failed jobs
   - Added 1-second delay between pages to avoid rate limiting

### Migration Applied
- Generated migration: `0048_dashing_blue_blade.sql`
- Applied successfully to database

### Key Features:
- Processes emails in chunks of 20
- Saves progress after each chunk
- Can resume from where it left off if timeout occurs
- Prevents duplicate processing
- Rate limiting protection

### Usage:
```typescript
// Start a sync
await trpc.inbox.syncGmail.mutate({ 
  count: 100, // Total emails to fetch
  pageSize: 20 // Emails per page
});

// Resume a failed job
await trpc.inbox.resumeSyncJob.mutate({ 
  jobId: "job-id-here" 
});
```

## Status: COMPLETED ✅
- Migrations applied successfully
- Code changes committed and pushed to main branch
- Ready for testing 