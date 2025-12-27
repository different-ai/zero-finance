# AI Email Invoice Agent - Security Upgrade Roadmap

## Current Implementation: Approach A (Unique Email Per Workspace)

Each workspace gets a unique inbound email address:

```
{workspaceId}@ai.0.finance
```

**How it works:**

- Resend catch-all on `ai.0.finance` subdomain routes all emails to webhook
- Webhook parses `to:` address to extract workspaceId
- Instant workspace scoping - no linking required

**Trade-off:** Anyone who knows/guesses a workspace's email address could potentially create invoices for that workspace.

---

## Future Upgrade: Approach B (Email Linking with 2FA-Style Code)

For enhanced security, especially as the product handles more sensitive financial operations.

### Flow

```
1. User emails ai@0.finance (single memorable address)
       │
       ▼
2. System checks if sender email is linked to a workspace
       │
       ├── NOT REGISTERED → Reply: "Sign up at 0.finance"
       │
       ├── REGISTERED BUT NOT LINKED → Reply: "Go to 0.finance/dashboard/connect"
       │
       └── LINKED → Process invoice request normally

3. User visits /dashboard/connect
       │
       ▼
4. Page shows: "Your linking code: X7K2M9" (6-char alphanumeric, 15min expiry)
       │
       ▼
5. User replies to AI email with code: "X7K2M9"
       │
       ▼
6. System stores mapping: {senderEmail → workspaceId}
       │
       ▼
7. Future emails from that address auto-route to linked workspace
```

### Database Schema Addition

```typescript
// packages/web/src/db/schema/email-workspace-links.ts

export const emailWorkspaceLinksTable = pgTable('email_workspace_links', {
  id: uuid('id').defaultRandom().primaryKey(),

  // The external email address (e.g., ben@gmail.com)
  email: text('email').notNull().unique(),

  // Which workspace this email is linked to
  workspaceId: uuid('workspace_id')
    .notNull()
    .references(() => workspacesTable.id),

  // Which user created the link (for audit)
  linkedByUserId: text('linked_by_user_id').notNull(),

  // Timestamps
  linkedAt: timestamp('linked_at').defaultNow().notNull(),

  // Optional: last used for rate limiting / cleanup
  lastUsedAt: timestamp('last_used_at'),
});

// Pending link codes (short-lived)
export const emailLinkCodesTable = pgTable('email_link_codes', {
  id: uuid('id').defaultRandom().primaryKey(),

  // The code shown to the user
  code: text('code').notNull().unique(),

  // Which workspace this code is for
  workspaceId: uuid('workspace_id')
    .notNull()
    .references(() => workspacesTable.id),

  // Which user generated the code
  userId: text('user_id').notNull(),

  // Expiration (15 minutes from creation)
  expiresAt: timestamp('expires_at').notNull(),

  // Whether code has been used
  usedAt: timestamp('used_at'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### Security Benefits

| Aspect                     | Approach A (Current)                                 | Approach B (Future)                                               |
| -------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------- |
| Email spoofing             | Vulnerable - attacker could forward from fake "From" | Protected - must prove access to both email AND 0 Finance account |
| Workspace address guessing | Possible if IDs are predictable                      | N/A - single address for everyone                                 |
| Multi-workspace users      | Multiple addresses to remember                       | Single address, explicit workspace selection                      |
| Audit trail                | Limited - only "from" address                        | Full - linked user ID, timestamp                                  |
| Revocation                 | N/A                                                  | Can unlink emails from dashboard                                  |

### UI Components Needed

1. **Dashboard Connect Page** (`/dashboard/connect`)
   - Generate and display linking code
   - Show which emails are currently linked
   - Allow unlinking emails

2. **Settings Section**
   - List of linked email addresses
   - "Link new email" button
   - Unlink functionality

### Implementation Priority

**Phase 1 (Now):** Ship Approach A for speed

- Unique workspace addresses
- Quick to implement
- Good enough for trusted early users

**Phase 2 (When needed):** Upgrade to Approach B

- When handling larger invoice amounts
- When onboarding less trusted users
- When compliance requires stronger auth
- Estimated effort: 2-3 days

### Migration Path

When upgrading from A to B:

1. Keep existing workspace addresses working (backwards compat)
2. Add linking flow as opt-in enhancement
3. Eventually deprecate unique addresses in favor of linked emails
4. Or keep both as options (power users might prefer unique addresses)

---

---

## Resend DNS & Webhook Setup

### Prerequisites

1. **Resend Account** with inbound email enabled
2. **DNS Access** for 0.finance domain

### DNS Configuration

Add these records to your DNS provider for the `ai.0.finance` subdomain:

```
# MX Record for receiving emails
Type: MX
Host: ai
Value: inbound.resend.com
Priority: 10

# SPF Record for sending emails
Type: TXT
Host: ai
Value: v=spf1 include:resend.com ~all

# DKIM Records (provided by Resend)
Type: CNAME
Host: resend._domainkey.ai
Value: <provided-by-resend>
```

### Resend Dashboard Setup

1. **Add Inbound Domain**
   - Go to Resend Dashboard → Domains → Add Domain
   - Add `ai.0.finance` as an inbound domain
   - Complete DNS verification

2. **Configure Catch-All Webhook**
   - Go to Webhooks → Create Webhook
   - URL: `https://www.0.finance/api/ai-email`
   - Events: `email.received`
   - Note the signing secret for `RESEND_WEBHOOK_SECRET`

3. **Configure Outbound Sending**
   - Verify outbound domain for sending emails from `ai@ai.0.finance` and `invoices@ai.0.finance`

### Environment Variables

Add to `.env.local`:

```bash
# Resend API key for sending emails
RESEND_API_KEY=re_xxxxxxxxxxxx

# Webhook signing secret for verifying inbound webhooks (optional but recommended)
RESEND_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx

# AI email domain (for generating workspace email addresses)
AI_EMAIL_INBOUND_DOMAIN=ai.0.finance

# Public env var for frontend (optional)
NEXT_PUBLIC_AI_EMAIL_DOMAIN=ai.0.finance
```

### Testing

1. **Verify DNS propagation:**

   ```bash
   dig MX ai.0.finance
   ```

2. **Test webhook endpoint:**

   ```bash
   curl -X GET https://www.0.finance/api/ai-email
   ```

3. **Send test email:**
   - Forward an email to `{workspaceId}@ai.0.finance`
   - Check Resend dashboard for delivery status
   - Check application logs for webhook processing

### Troubleshooting

| Issue               | Check                                          |
| ------------------- | ---------------------------------------------- |
| Emails not received | DNS MX record, Resend domain verification      |
| Webhook 401 error   | RESEND_WEBHOOK_SECRET matches Resend dashboard |
| Emails not sent     | RESEND_API_KEY valid, outbound domain verified |
| Rate limit (429)    | Sender exceeded 10 emails/minute               |

---

## Decision Log

| Date       | Decision              | Rationale                                                           |
| ---------- | --------------------- | ------------------------------------------------------------------- |
| 2024-12-26 | Start with Approach A | Faster to ship, lower friction, acceptable security for early users |
| TBD        | Upgrade to Approach B | When security requirements increase                                 |
