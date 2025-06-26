# Gmail Sync Production Deployment Steps

## Prerequisites
- Ensure you have access to Vercel dashboard
- Have access to environment variables

## Deployment Steps

### 1. Set Environment Variable
In Vercel Dashboard:
1. Go to Project Settings > Environment Variables
2. Add `CRON_SECRET` with a secure random value:
   ```
   CRON_SECRET=<generate-secure-random-string>
   ```
   
   You can generate one with:
   ```bash
   openssl rand -base64 32
   ```

### 2. Deploy the Changes
The changes have been committed. Deploy to Vercel:
```bash
git push origin main
```

### 3. Verify Cron Job Setup
After deployment:
1. Go to Vercel Dashboard > Functions tab
2. Look for `/api/cron/process-gmail-sync`
3. Check that it's scheduled to run every 2 minutes

### 4. Monitor Initial Deployment
1. Watch Vercel Function logs for any errors
2. Test Gmail sync with a small account first
3. Monitor the `currentAction` field in sync jobs

### 5. Database Migration (if needed)
The schema already has the required fields:
- `nextPageToken`
- `processedCount` 
- `currentAction`

No migration needed unless you're on an old schema version.

## Testing Production

1. Connect Gmail account
2. Click "Sync Gmail"
3. Watch for immediate response (should process 5 emails)
4. Check job status - should show "Initial batch complete" if more emails exist
5. Wait 2 minutes for cron job to continue processing
6. Monitor progress via the UI

## Troubleshooting

### If sync still hangs:
1. Check Vercel Function logs for timeout errors
2. Reduce batch size in `inbox-router.ts` from 5 to 3
3. Check if AI processing is taking too long

### If cron job isn't running:
1. Verify `CRON_SECRET` is set correctly
2. Check Vercel dashboard for cron job status
3. Manually trigger: `curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://yourapp.vercel.app/api/cron/process-gmail-sync`

### Performance Optimization:
1. Consider upgrading to Vercel Pro for 60s timeout
2. Implement caching for AI processing
3. Use edge functions for initial response
4. Consider external queue service for heavy processing 