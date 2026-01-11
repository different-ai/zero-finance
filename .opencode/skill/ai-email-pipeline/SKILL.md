# AI Email Pipeline

## Skill Contract

### Purpose

- Run the inbound/outbound AI email workflow for 0 Finance.

### Inputs

- Inbound webhook payload (Resend or SES).
- Session state + attachments.
- Workspace mapping + AI email handle.

### Outputs

- Updated session state, created/updated invoices/transfers, outbound replies.

### Entities + CRUD Coverage

- Session: create/get/update via `packages/web/src/lib/ai-email/session.ts`; delete not supported.
- Message: create (append), read (history), update (follow-up), delete not supported.
- Attachment: create (persist), read (load), update not used, delete not supported.
- Invoice draft: create/update/send via tools.

### Tools Used (Atomic)

- `extractInvoiceDetails`, `createInvoice`, `updateInvoice`, `requestConfirmation`, `sendReplyToUser`.
- `sendInvoiceToRecipient`, `getBalance`, `listSavedBankAccounts`, `createBankAccount`, `proposeTransfer`.

### Completion Signals

- `complete` when a reply is sent or a pending action is finalized.
- `continue` when awaiting user confirmation or clarification.
- `error` on provider failures or invalid webhook signatures.

### Credentials & Config

- Resend: `RESEND_API_KEY`, `RESEND_WEBHOOK_SECRET`.
- SES: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_DEFAULT_REGION`.
- `EMAIL_PROVIDER` = `resend` or `ses`.
- `AI_EMAIL_INBOUND_DOMAIN` default `zerofinance.ai`.

### Missing Credential Behavior

- If provider credentials are missing, ask the user and stop.

### Canonical Inbox

- `ben-agent@zerofinance.ai`.

## Core Mental Model

**The AI email system is a conversation, not a state machine.**

Every email is a message in an ongoing conversation. The LLM reads the full context and decides what to do. There are no hardcoded shortcuts, no regex parsing for intent, no branching logic outside the AI.

## Architecture Principle

```
Email arrives → Parse attachments → Build message history → Send to LLM → LLM calls tools → Done
```

That's it. The LLM handles:

- Understanding user intent ("yes", "no I mean...", "actually change it to...")
- Deciding which tools to call
- Generating responses
- Handling corrections and clarifications

## Anti-Patterns (NEVER DO THESE)

### 1. Regex-based intent detection

```typescript
// BAD - This is what broke "no I mean..."
if (/^no\b/i.test(email.text)) {
  return handleCancellation();
}
```

The LLM understands "no I mean the other one" is a clarification, not a cancellation. Regex doesn't.

### 2. Shortcutting the AI for "simple" cases

```typescript
// BAD - Bypasses AI reasoning
if (looksLikeConfirmation(text)) {
  skipAIAndHandleDirectly();
}
```

There are no "simple" cases in human language. Let the AI decide.

### 3. State machine flows

```typescript
// BAD - Rigid flow that can't handle corrections
if (state === 'awaiting_confirmation') {
  if (confirmed) doThing();
  else cancel();
}
```

Humans don't follow state machines. They say "wait actually" or "no change the amount first".

### 4. Parsing email content outside the AI

```typescript
// BAD - Duplicating AI's job
const amount = extractAmount(email.text);
const recipient = extractRecipient(email.text);
```

The AI extracts information. Give it the raw email and let it work.

## Correct Pattern

```typescript
// GOOD - Everything goes through the AI
const messages = buildConversationHistory(session);
messages.push({
  role: 'user',
  content: [
    { type: 'text', text: formatEmail(email) },
    ...attachmentParts, // PDFs, images passed natively
  ],
});

const result = await generateText({
  model: openai('gpt-5.2'),
  system: systemPrompt,
  messages,
  tools: aiTools,
});
```

## What the System Prompt Should Contain

1. **Identity** - Who the AI is
2. **Capabilities** - What tools are available (briefly)
3. **Principles** - How to behave (ask when unclear, never invent data, etc.)
4. **Context** - Current session state, pending actions, extracted data

The prompt should NOT contain:

- Step-by-step flows ("1. First do X, 2. Then do Y")
- Rigid decision trees
- Pattern matching instructions

## Pending Actions

Pending actions (like "invoice awaiting confirmation") are **context for the AI**, not triggers for hardcoded behavior.

```typescript
// In system prompt:
`
## Pending Action
There's an invoice ready to send:
- To: john@example.com
- Amount: $500

The user's latest message will tell you what they want to do with it.
`;
```

The AI reads this context and the user's message, then decides:

- "yes" → call sendInvoice tool
- "no" → acknowledge cancellation
- "change the amount to $600" → call updateInvoice tool
- "no I mean send it to jane@example.com" → update recipient, ask for confirmation again

## Attachments

Attachments (PDFs, images) are passed directly to the model as native file parts. The AI reads them.

```typescript
const attachmentParts = preparedAttachments
  .filter((a) => a.supported && a.base64Content)
  .map((a) => ({
    type: 'file',
    data: Buffer.from(a.base64Content, 'base64'),
    mediaType: a.contentType,
    filename: a.filename,
  }));
```

Don't pre-extract data from attachments. Don't summarize them. Pass them raw.

## Session History

The session stores the conversation history. Each email adds a message. The AI sees the full thread.

```typescript
const messages = session.messages.map((msg) => ({
  role: msg.role,
  content: msg.content,
}));
```

## Attachment Persistence

**Critical**: Attachments must persist across the conversation.

When an email arrives with a PDF/image:

1. Upload to Vercel Blob immediately
2. Store metadata in `session.attachments[]`

When a reply arrives:

1. Load ALL stored attachments from Vercel Blob
2. Include them in the AI message (along with any new attachments)
3. AI can now "remember" PDFs from earlier in the conversation

```typescript
// Session stores attachment metadata
session.attachments = [
  {
    filename: 'Invoice.pdf',
    contentType: 'application/pdf',
    blobUrl: 'https://xyz.blob.vercel-storage.com/...',
    size: 33192,
    messageIndex: 0,
    uploadedAt: '2024-12-31T...',
  },
];

// On reply, fetch and include all attachments
for (const att of session.attachments) {
  const response = await fetch(att.blobUrl);
  const buffer = Buffer.from(await response.arrayBuffer());
  allAttachmentParts.push({
    type: 'file',
    data: buffer,
    mediaType: att.contentType,
    filename: att.filename,
  });
}
```

Without this, the AI loses access to PDFs when the user replies.

## Tools

Tools are the AI's hands. They do things:

- `createInvoice` - Creates an invoice
- `sendInvoice` - Sends an invoice to recipient
- `getBalance` - Checks user's balance
- `proposeTransfer` - Proposes a bank transfer

The AI decides when to call them based on the conversation.

## Debugging

When something goes wrong, check:

1. **Did the message reach the AI?** - Look for `generateText()` logs
2. **What did the AI see?** - Log the messages array
3. **What tools did it call?** - Log tool invocations
4. **What was the session state?** - Log pending actions, extracted data

## Key Files

- `packages/web/src/app/api/ai-email/route.ts` - Main webhook handler
- `packages/web/src/lib/ai-email/prompts.ts` - System prompt
- `packages/web/src/lib/ai-email/attachment-parser.ts` - Prepares attachments for AI
- `packages/web/src/lib/ai-email/session.ts` - Session management

## Learnings Log

### 2024-12-31: "no I mean..." bug

- **Problem**: User said "no I mean the Cyprien Farvaque Detail is good" and AI cancelled instead of reading the PDF
- **Cause**: `parseConfirmationReply()` regex matched `^no\b` and shortcutted the AI
- **Fix**: Remove all confirmation parsing. Let AI handle everything.
- **Lesson**: Never bypass the AI for "simple" cases. Human language isn't simple.

### 2024-12-31: Attachments lost on reply

- **Problem**: User sends PDF in email 1, references it in email 2, AI says "what PDF?"
- **Cause**: Session only stored text content of messages, not attachments. PDFs were passed to AI in real-time but never persisted.
- **Fix**: Upload attachments to Vercel Blob immediately, store metadata in session.attachments[], fetch and include all stored attachments on every reply.
- **Lesson**: Conversations span multiple emails. State (including attachments) must persist.

### 2024-12-31: Schema changes need migrations

- **Problem**: Added `attachments` column to schema, committed code, but production errored with "column attachments does not exist"
- **Cause**: Schema file change doesn't automatically update the database. Need to generate and run migration.
- **Fix**: `pnpm drizzle-kit generate` then `pnpm db:migrate`
- **Lesson**: Schema changes require TWO steps: (1) update schema file, (2) run migration. Always run migration before pushing code that uses new columns.

### 2024-12-31: Invoice account type selection

- **Problem**: User asked for EUR invoice but it used US bank account
- **Fix**: Added `preferredAccountType` to createInvoice, auto-detects from currency (EUR→iban), added `updateInvoice` tool to change account after creation
- **Lesson**: When adding new capabilities, update both the tool schema AND the system prompt so AI knows when/how to use it.
