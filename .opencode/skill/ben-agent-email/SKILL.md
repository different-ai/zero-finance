---
name: ben-agent-email
description: Canonical Resend inbox for ben-agent@zerofinance.ai
license: MIT
compatibility: opencode
metadata:
  service: resend
  category: email
  inbox: ben-agent@zerofinance.ai
---

# Ben-Agent Email (Resend)

Canonical email inbox for 0 Finance operations.

## Purpose

Manage inbound and outbound email for `ben-agent@zerofinance.ai` using Resend and the existing AI email pipeline.

## Canonical Inbox

- `ben-agent@zerofinance.ai`
- Domain defaults to `zerofinance.ai` via `AI_EMAIL_INBOUND_DOMAIN`.

## Inbound Flow (Required)

1. Resend catch-all or routed domain receives inbound email.
2. Resend webhook posts to `POST /api/ai-email`.
3. Webhook signature verified with `RESEND_WEBHOOK_SECRET`.
4. AI email pipeline parses, responds, and updates session state.

## Outbound Flow

- Send via Resend with `from: "Ben Agent <ben-agent@zerofinance.ai>"`.
- Replies and confirmations are sent through `packages/web/src/lib/email-provider/resend-provider.ts`.

## Environment (.env)

Create a collocated `.env` file at:

```
.opencode/skill/ben-agent-email/.env
```

Required values:

```
RESEND_API_KEY=
RESEND_WEBHOOK_SECRET=
EMAIL_PROVIDER=resend
AI_EMAIL_INBOUND_DOMAIN=zerofinance.ai
```

## Credential Missing Behavior

- If `RESEND_API_KEY` or `RESEND_WEBHOOK_SECRET` is missing, ask the user to provide them and stop.
- Do not invent credentials or proceed without explicit access.

## Entities + CRUD Coverage

- Email sessions: create/read/update via AI email pipeline; delete not supported.
- Messages: create (send/reply), read (session history), update (follow-up), delete not supported.
- Attachments: create (persist), read (load), update not used, delete not supported.

## Tools / Interfaces

- `packages/web/src/app/api/ai-email/route.ts` - inbound webhook handler.
- `packages/web/src/lib/email-provider/resend-provider.ts` - Resend send/receive.
- `packages/web/src/lib/ai-email/*` - session state, prompts, attachment handling.

## Completion Signals

- `complete`: inbound message processed and response sent.
- `continue`: awaiting user clarification or confirmation.
- `error`: provider failures or invalid webhook signature.

## Example Prompts

- "Check `ben-agent@zerofinance.ai` for new invoices and summarize."
- "Reply to the latest sender confirming we received their request."
- "Draft a follow-up asking for missing bank details."
