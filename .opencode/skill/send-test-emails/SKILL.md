# Send Test Emails

Send test/mock emails programmatically using Resend for demos, testing AI email agent, or video recordings.

## Skill Contract

### Purpose

- Send realistic test emails into the AI inbox for demos and pipeline validation.

### Inputs

- Recipient address, subject, and HTML/text body.

### Outputs

- Resend message ID for traceability.

### Canonical Inbox

- `ben-agent@zerofinance.ai`.

### Credentials

- Requires `RESEND_API_KEY` in `.opencode/skill/send-test-emails/.env`.
- If missing, ask the user to provide it and stop.

### Completion Signals

- `complete` when the message ID is returned.
- `error` when the send fails.

## Quick One-Liner

```bash
cd packages/web && npx tsx -e "
import { Resend } from 'resend';
import { config } from 'dotenv';
import * as path from 'path';

config({ path: path.join(process.cwd(), '../../.opencode/skill/send-test-emails/.env') });

const resend = new Resend(process.env.RESEND_API_KEY);

resend.emails.send({
  from: 'Sender Name <sender@zerofinance.ai>',
  to: 'ben-agent@zerofinance.ai',
  subject: 'Your subject here',
  html: '<p>Your HTML content</p>',
}).then(r => console.log('✅ Sent:', r.data?.id));
"
```

## Available Domains

Only these domains are verified in Resend:

- `zerofinance.ai` - Primary domain for test emails
- `0.finance` - Production domain

**Important:** The "from" email signature should match the from address domain. Don't lie about email addresses (e.g., don't show `@northstarventures.co` in signature when sending from `@zerofinance.ai`).

## Send Email with PDF Attachment

```typescript
import { Resend } from 'resend';
import puppeteer from 'puppeteer';

// Generate PDF from HTML
const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setContent(invoiceHtml, { waitUntil: 'networkidle0' });
const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
await browser.close();

// Send with attachment
await resend.emails.send({
  from: 'Name <name@zerofinance.ai>',
  to: 'ben-agent@zerofinance.ai',
  subject: 'Invoice attached',
  html: '<p>See attached invoice</p>',
  attachments: [
    {
      filename: 'Invoice.pdf',
      content: Buffer.from(pdfBuffer),
    },
  ],
});
```

## Full Script Location

A complete script with mock emails for video demos exists at:

```
packages/web/scripts/send-mock-emails.ts
```

Run it with:

```bash
cd packages/web && npx tsx scripts/send-mock-emails.ts
```

## Environment Variables

The Resend API key is in:

- `.opencode/skill/send-test-emails/.env` - `RESEND_API_KEY`

Load it with:

```typescript
import { config } from 'dotenv';
import * as path from 'path';
config({
  path: path.join(process.cwd(), '../../.opencode/skill/send-test-emails/.env'),
});
```

## Common Use Cases

### 1. Test AI Email Agent

Send an email to your AI agent address to test invoice creation:

```bash
# Send to your AI email agent
to: 'ben-agent@zerofinance.ai'
```

### 2. Mock Client Emails for Demos

Create realistic-looking client emails for video recordings:

- Invoice requests
- Payment confirmations
- Contractor invoices with PDF attachments

### 3. Test Email Parsing

Send emails with specific formats to test the email parser:

- Forwarded emails
- Emails with attachments
- Reply chains

## Tips

1. **Keep signatures consistent** - From address domain should match signature
2. **Use realistic names** - Makes demos look professional
3. **Generate PDFs programmatically** - Use puppeteer for invoices
4. **Check inbox immediately** - Resend delivers within seconds

## Anti-Patterns

- ❌ Don't use fake external domains in signatures (e.g., `@gmail.com`, `@company.co`)
- ❌ Don't hardcode API keys in scripts
- ❌ Don't send to real external emails during testing
