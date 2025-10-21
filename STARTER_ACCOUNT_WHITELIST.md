# Starter Account Whitelist System

## Overview

This feature implements an email-based whitelist system for controlling which users can receive starter virtual accounts. Unless a user's email is in the whitelist, they won't be able to get starter accounts.

## How It Works

### Database Schema

A new table `starter_account_whitelist` stores whitelisted emails:

```sql
CREATE TABLE "starter_account_whitelist" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email" text NOT NULL UNIQUE,
  "added_by" text NOT NULL REFERENCES "admins"("privy_did"),
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
```

### Behavior

1. **Whitelist Check**: When a user signs up or requests starter accounts, their email is checked against the whitelist
2. **Case-Insensitive**: Emails are stored and compared in lowercase
3. **Admin-Only Management**: Only admins can add/remove emails from the whitelist
4. **Graceful Failure**: If email is not whitelisted, starter account creation silently skips (doesn't block user signup)

### User Flow

1. User signs up and registers a primary Safe
2. System extracts user's email from Privy (email auth, Google, etc.)
3. System checks if email exists in `starter_account_whitelist`
4. If whitelisted: Creates USD + EUR starter virtual accounts
5. If not whitelisted: Skips starter account creation, user proceeds normally

## Admin Dashboard

### Accessing the Whitelist Manager

1. Navigate to `/admin` (requires admin privileges)
2. Click on "Starter Whitelist" tab
3. You'll see a list of all whitelisted emails

### Adding an Email

1. Click "Add Email" button
2. Enter email address
3. Optionally add notes (e.g., "VIP user", "Early adopter")
4. Click "Add to Whitelist"

### Removing an Email

1. Find the email in the list
2. Click the trash icon
3. Confirm deletion

### Features

- Real-time list of whitelisted emails
- Shows who added each email and when
- Optional notes field for context
- Search and filter capabilities (future enhancement)

## Technical Implementation

### Files Modified

1. **Database**:
   - `src/db/schema.ts` - Added `starterAccountWhitelist` table definition
   - `drizzle/0113_amused_black_bird.sql` - Migration file

2. **Backend**:
   - `src/server/services/align-starter-accounts.ts` - Added whitelist check
   - `src/server/routers/admin-router.ts` - Added TRPC procedures
   - `src/server/routers/align-router.ts` - Pass user email
   - `src/app/api/user/safes/register-primary/route.ts` - Pass user email

3. **Frontend**:
   - `src/components/admin/starter-whitelist-panel.tsx` - New whitelist UI
   - `src/app/(public)/admin/page.tsx` - Integrated whitelist tab

### API Endpoints (TRPC)

```typescript
// List all whitelisted emails
api.admin.listStarterWhitelist.useQuery()

// Add email to whitelist
api.admin.addToStarterWhitelist.useMutation({
  email: string,
  notes?: string
})

// Remove email from whitelist
api.admin.removeFromStarterWhitelist.useMutation({
  id: string
})
```

### Service Function

```typescript
createStarterVirtualAccounts({
  userId: string,
  workspaceId: string,
  destinationAddress: string,
  userEmail?: string  // New parameter
})
```

## Migration Guide

### Development Environment

The migration has already been generated:

```bash
# Migration is auto-generated in drizzle/0113_amused_black_bird.sql
# To apply to dev database, restart the app
pnpm dev
```

### Production Deployment

```bash
# Run migration on production database
pnpm --filter @zero-finance/web db:migrate:prod
```

## Security Considerations

1. **Admin-Only Access**: All whitelist operations require admin privileges
2. **Email Validation**: Emails are validated using Zod schema
3. **Foreign Key Constraint**: `added_by` references `admins` table
4. **Audit Trail**: Tracks who added each email and when

## Future Enhancements

1. **Bulk Import**: Allow CSV upload of emails
2. **Expiration Dates**: Set time-limited whitelist entries
3. **Usage Tracking**: See which whitelisted emails have claimed accounts
4. **Email Verification**: Require email confirmation before granting access
5. **Regex Patterns**: Allow domain-based whitelisting (e.g., `*@company.com`)

## Testing Checklist

- [x] Database migration runs successfully
- [x] Admin can view whitelist
- [x] Admin can add emails
- [x] Admin can remove emails
- [x] Non-whitelisted user doesn't get starter accounts
- [x] Whitelisted user gets starter accounts
- [x] Email comparison is case-insensitive
- [x] UI shows proper error messages
- [x] TRPC procedures are protected by admin check

## Troubleshooting

### User not receiving starter accounts

1. Check if email is in whitelist: Query `starter_account_whitelist` table
2. Verify email extraction: Check Privy user object for email field
3. Check logs: Look for "[Starter Accounts]" messages

### Cannot add email to whitelist

1. Verify you're logged in as admin
2. Check if email already exists (unique constraint)
3. Validate email format

### Migration errors

1. Ensure admins table exists first
2. Check database connection
3. Run migrations in order
