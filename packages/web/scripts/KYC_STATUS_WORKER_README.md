# KYC Status Worker

## Overview

The KYC Status Worker is a scheduled job that periodically checks for users whose KYC (Know Your Customer) status has changed from pending/none/rejected to approved in the Align API. When a user's KYC is approved, it automatically sends a notification email via the Loops API.

## Purpose

- **Automated Status Monitoring**: Continuously monitors KYC status changes without manual intervention
- **Real-time Notifications**: Sends email notifications immediately when KYC is approved
- **Database Synchronization**: Keeps the local database in sync with Align's KYC status

## How It Works

1. Queries the database for all users who have an Align customer ID but don't have an approved KYC status
2. For each user, fetches the latest KYC status from the Align API
3. Updates the database with the latest status
4. If the status changed to "approved", fetches the user's email from Privy and sends a notification via Loops

## Running the Worker

### Manually (for testing)
```bash
cd packages/web
pnpm kyc-status:worker
```

### As a Cron Job
The worker is designed to be run as a scheduled cron job. Example cron configuration:

```bash
# Run every 15 minutes
*/15 * * * * cd /path/to/zerofinance/packages/web && pnpm kyc-status:worker >> /var/log/kyc-status-worker.log 2>&1
```

### Environment Variables Required
- `ALIGN_API_KEY`: API key for Align service
- `ALIGN_API_BASE_URL`: Base URL for Align API
- `LOOPS_API_KEY`: API key for Loops email service
- `NEXT_PUBLIC_PRIVY_APP_ID`: Privy application ID
- `PRIVY_APP_SECRET`: Privy application secret
- `DATABASE_URL`: PostgreSQL connection string

## Testing

Run the unit tests:
```bash
cd packages/web
pnpm test kyc-status-worker.test.ts
```

## Monitoring

The worker logs detailed information about its operations:
- Number of users checked
- Status changes detected
- Notifications sent
- Any errors encountered

Example log output:
```
[kyc-status-worker] Starting KYC status check...
[kyc-status-worker] Found 5 users to check
[kyc-status-worker] Updated KYC status for user did:privy:xxx: pending -> approved
[kyc-status-worker] Sent KYC approved notification to user@example.com
[kyc-status-worker] Completed. Processed 5 users, sent 1 notifications
```

## Error Handling

- If the Align API is unavailable, the worker continues to the next user
- If email sending fails, the worker logs the error but continues processing
- All errors are logged with context for debugging

## Performance Considerations

- The worker includes a 100ms delay between API calls to avoid rate limiting
- Consider adjusting the cron frequency based on your user volume and API rate limits 