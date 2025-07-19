# PostHog Email Tracking Integration

This document explains how email tracking is integrated between Privy authentication and PostHog analytics in the Zero Finance application.

## Overview

The integration ensures that:
1. Every user who signs up or logs in via Privy is automatically identified in PostHog with their email
2. All events are tracked with email context for better user analytics
3. Both client-side and server-side tracking are implemented for reliability

## Components

### 1. Client-Side User Identification (`/src/components/posthog-user-identification.tsx`)

This component automatically identifies users in PostHog when they log in via Privy:

- Runs whenever authentication state changes
- Identifies users with email, name, and other properties
- Sets super properties that are included with all events
- Tracks login/logout events
- Resets PostHog on logout for privacy

**Key features:**
- Email domain tracking for segmentation
- Linked accounts tracking
- Wallet information tracking
- Automatic session management

### 2. Server-Side Webhook Tracking (`/src/app/api/webhooks/auth/route.ts`)

The Privy webhook handler also sends user data to PostHog:

- Captures `user.created` events from Privy
- Sends user identification to PostHog
- Tracks signup events with email context
- Works in Edge runtime with direct API calls

**Benefits:**
- Ensures users are tracked even if client-side fails
- Captures users immediately on signup
- Provides server-side event reliability

### 3. PostHog Tracking Utilities (`/src/lib/posthog-tracking.ts`)

Helper functions for consistent email tracking throughout the app:

```typescript
// Track any event with email context
await trackUserEvent('invoice_created', {
  userId: user.id,
  email: user.email,
  properties: {
    invoice_amount: 1000,
    currency: 'USD'
  }
});

// Identify a user
await identifyUser({
  userId: user.id,
  email: user.email,
  name: user.name,
  properties: {
    plan: 'premium',
    company: 'Acme Corp'
  }
});
```

## Email Properties Tracked

### User Properties (set on identification)
- `email` - User's email address
- `email_domain` - Domain part of email (for B2B segmentation)
- `email_verified` - Whether email is verified in Privy
- `name` - User's display name
- `created_at` - Account creation timestamp
- `source` - Where the user came from (privy, webhook, etc.)

### Super Properties (included with all events)
- `user_email` - Always included for email-based filtering
- `user_id` - Privy user ID for correlation

## Common Events with Email Context

- `user_signed_up` - New user registration
- `user_logged_in` - User authentication
- `user_logged_out` - User logout
- `onboarding_started/completed` - Onboarding funnel
- `invoice_created/sent/paid` - Invoice lifecycle
- `kyc_started/completed/failed` - KYC process

## Usage in Components

### In React Components

```typescript
import { usePostHog } from 'posthog-js/react';

function MyComponent() {
  const posthog = usePostHog();
  
  const handleAction = () => {
    // Email is automatically included via super properties
    posthog.capture('custom_action', {
      additional_property: 'value'
    });
  };
}
```

### In Server Functions

```typescript
import { trackUserEvent, PostHogEvents } from '@/lib/posthog-tracking';

// In API routes or server actions
await trackUserEvent(PostHogEvents.INVOICE_CREATED, {
  userId: session.userId,
  email: session.userEmail,
  properties: {
    invoice_id: invoice.id,
    amount: invoice.amount
  }
});
```

## PostHog Dashboard Setup

To make the most of email tracking:

1. **Create Email-based Cohorts**
   - Segment users by email domain
   - Track verified vs unverified emails
   - Monitor signup sources

2. **Set up Email Funnels**
   - Signup → Onboarding → First Transaction
   - Track drop-off by email domain
   - Compare conversion rates

3. **Configure Email Alerts**
   - Alert on high-value user signups
   - Monitor specific email domains
   - Track feature adoption by email segment

## Privacy Considerations

- Emails are only tracked for authenticated users
- PostHog is reset on logout to prevent cross-user contamination
- All tracking respects user privacy settings
- Sensitive data is never included in event properties

## Testing

1. Sign up with a test email via Privy
2. Check PostHog dashboard for user identification
3. Verify email appears in user properties
4. Confirm events include email context
5. Test logout clears the session

## Troubleshooting

### Email not appearing in PostHog

1. Check browser console for "PostHog user identified" logs
2. Verify NEXT_PUBLIC_POSTHOG_KEY is set
3. Ensure user has email in Privy profile
4. Check network tab for PostHog API calls

### Server-side tracking not working

1. Verify PostHog API key in environment
2. Check webhook logs for errors
3. Ensure PostHog host is accessible
4. Review Edge runtime logs

### Events missing email context

1. Confirm user is authenticated
2. Check super properties are set
3. Verify identification happened before events
4. Review PostHog session recordings