# API Waitlist Email Setup (Loops)

## Environment Variables to Add

Add these to your `.env` file:

```bash
# Loops API key
LOOPS_API_KEY=your_loops_api_key

# Transactional email IDs from Loops dashboard
LOOPS_TRANSACTIONAL_ID_API_WAITLIST_CONFIRMATION=<get_from_loops_dashboard>
LOOPS_TRANSACTIONAL_ID_API_WAITLIST_INTERNAL=<get_from_loops_dashboard>

# Internal notification email (where to send API waitlist alerts)
INTERNAL_NOTIFICATION_EMAIL=team@yourdomain.com
```

---

## Email Templates to Create in Loops

Go to https://app.loops.so/transactional and create these two emails:

### 1. User Confirmation Email

**Email Name:** `API Waitlist Confirmation`

**Subject:** `You're on the API waitlist! 🚀`

**Available Variables:**
- `{{companyName}}` (string)
- `{{useCase}}` (string)
- `{{calLink}}` (string)

**Email Body:**

```
Hi {{companyName}} team,

Thanks for your interest in 0 Finance's API!

We're excited to help you embed high-yield savings into your product. We handle the DeFi complexity, insurance, and compliance — you get a clean REST API.

**What's Next:**

Want to get started faster? Book a 30-minute call with our team to discuss your integration:
👉 {{calLink}}

We'll be rolling out API access in Q1 2025 and will reach out as soon as we're ready.

**In the meantime:**
- Check out our direct product: https://0.finance
- Questions? Just reply to this email

Best,
Benjamin & Raghav
0 Finance Team

---
{{#if useCase}}
Your use case: {{useCase}}
{{/if}}
```

**After creating:** Copy the transactional ID and set it as `LOOPS_TRANSACTIONAL_ID_API_WAITLIST_CONFIRMATION`

---

### 2. Internal Notification Email

**Email Name:** `API Waitlist Internal Notification`

**Subject:** `🎯 New API Waitlist Signup: {{companyName}}`

**Available Variables:**
- `{{companyName}}` (string)
- `{{email}}` (string)
- `{{useCase}}` (string)
- `{{privyDid}}` (string)
- `{{timestamp}}` (string)

**Email Body:**

```
New API waitlist signup!

**Company:** {{companyName}}
**Email:** {{email}}
**Use Case:** {{useCase}}
**Privy DID:** {{privyDid}}

**Joined:** {{timestamp}}

---

Reach out to discuss their integration needs.
Book a call: https://cal.com/team/0finance/30
```

**Send To:** `ben@0.finance` (hardcoded in the action file)

**After creating:** Copy the transactional ID and set it as `LOOPS_TRANSACTIONAL_ID_API_WAITLIST_INTERNAL`

---

## Testing

1. Go to your API waitlist form: `http://localhost:3000/#api-access` (or production URL)
2. Fill out the form and submit
3. Check both email inboxes:
   - User should receive confirmation with cal.com link
   - `ben@0.finance` should receive notification

---

## Current Setup

✅ Code updated in `/packages/web/src/actions/api-waitlist.ts`
✅ Database insert working
✅ Email sending logic added (matching existing pattern from waitlist-router.ts)

⏳ Need to create email templates in Loops dashboard
⏳ Need to add environment variables

---

## Notes

- Emails are sent concurrently using `Promise.all`
- If emails fail, the user is still added to the waitlist (graceful degradation)
- Pattern matches existing waitlist implementation
- Cal.com link: `https://cal.com/team/0finance/30`
