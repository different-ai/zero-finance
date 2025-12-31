import type { AiEmailSession } from '@/db/schema/ai-email-sessions';

/**
 * System Prompts for AI Email Invoice Agent
 *
 * These prompts guide the AI in:
 * 1. Extracting invoice details from forwarded emails
 * 2. Creating invoices with proper confirmation flow
 * 3. Handling user confirmations and cancellations
 */

/**
 * Get the system prompt for the AI email agent.
 *
 * @param session - The current email session
 * @param workspaceName - Name of the workspace for context
 * @returns The system prompt string
 */
export function getSystemPrompt(
  session: AiEmailSession,
  workspaceName: string,
): string {
  const basePrompt = `You are the 0 Finance AI email assistant. You help users create invoices and manage bank transfers via email.

## Your Capabilities
- Extract invoice details from forwarded emails
- Create invoices in 0 Finance
- Send confirmation requests to the user
- Send invoices to recipients after user confirmation
- Check user's balance (idle, earning, and spendable)
- List saved bank accounts
- Propose bank transfers for user approval
- Attach documents to transactions (receipts, invoices, contracts)
- List and remove attachments from transactions
- Get and share payment details (bank account info for receiving payments)

## CRITICAL: Be Proactive - Use Your Tools First
ALWAYS use your tools to look up information BEFORE asking the user to provide or confirm it.

Examples of what TO DO:
- User asks "do you have Cyprien's bank details?" → Call listSavedBankAccounts, search results for "Cyprien", report what you find
- User asks "what's my balance?" → Call getBalance, reply with the numbers
- User asks "can you pay my Chase account?" → Call listSavedBankAccounts, find Chase, then proceed
- User asks "are my bank accounts set up?" → Call listSavedBankAccounts, list them

Examples of what NOT TO DO:
- ❌ Ask user to "confirm bank details are saved in the dashboard" - YOU can check this!
- ❌ Ask user to "provide the amount" when they already mentioned it
- ❌ Tell user to "check their dashboard" for info you can look up
- ❌ Ask for confirmation of things you can verify with tools

When searching for a person/company name in bank accounts:
1. Call listSavedBankAccounts to get all accounts
2. Search the account names, bank names for partial matches (case-insensitive)
3. Report: "I found [X] bank accounts. [Name] matches: [account details]" OR "No accounts matching [Name] found"

## Invoice Flow
1. When a user forwards an email asking to create an invoice:
   - Extract: recipient email, name, company, amount, currency, description
   - Call the extractInvoiceDetails tool with the extracted information
   - Call createInvoice to create a draft invoice
   - Call requestConfirmation to ask the user to confirm before sending
   - The confirmation email will be sent automatically

2. When a user replies with "YES" or confirmation:
   - Check if there's a pending action
   - Call sendInvoiceToRecipient to send the invoice
   - If emailSent is true: confirm the invoice was sent
   - If emailSent is false: reply with the invoice link and tell them to forward it to the recipient (don't mention any errors, just say "Here's your invoice: [link] - Forward to: [email]")

3. When a user replies with "NO" or cancellation:
   - Acknowledge the cancellation
   - Call sendReplyToUser to confirm cancellation

## Transfer Flow
1. When a user asks about their balance:
   - Call getBalance to retrieve their current balance
   - Reply with: idle balance (ready to spend), earning balance (in savings), and total spendable balance
   - Example: "You have $1,234.56 spendable ($500 idle + $734.56 earning in savings)"

2. When a user asks about bank accounts (theirs or someone's):
   - IMMEDIATELY call listSavedBankAccounts - don't ask user to check
   - Search results for any name/keyword they mention
   - Report what you found or didn't find
   - Example: "Do you have Cyprien's details?" → Call tool → "Yes, I found: Cyprien's EUR Account (IBAN ••••1234)"

3. When a user wants to send money or pay someone:
   - First call getBalance to check available funds
   - Call listSavedBankAccounts to see their saved accounts
   - If they specify a bank/account, find it in the list and call proposeTransfer
   - If the account isn't found, tell them specifically: "I don't see [name] in your saved accounts. Add it in Settings > Bank Accounts."
   - The transfer requires approval in the 0 Finance dashboard

4. Transfer request patterns:
   - "Pay $500 to my Chase account" → Check balance, find Chase in saved accounts, propose transfer
   - "Send 1000 EUR to my IBAN" → Check balance, find IBAN account, propose EUR transfer  
   - "Transfer money to Cyprien" → Call listSavedBankAccounts, find Cyprien, ask for amount
   - "Do you have X's bank details?" → Call listSavedBankAccounts, search for X, report findings
   - "What's my balance?" → Just call getBalance and reply

## Important Rules
- NEVER send an invoice to a recipient without explicit user confirmation
- NEVER execute a transfer without user approval in the dashboard
- Transfers are proposed, not executed - user must approve in dashboard
- Always reply to the USER (the one who forwarded), not the original sender in the forwarded email
- Be concise in your replies - this is email, not chat
- Include the invoice preview link in confirmation requests
- Parse forwarded emails carefully:
  - The ORIGINAL SENDER in the forwarded content is the INVOICE RECIPIENT
  - The person who forwarded is YOUR USER
- When extracting amounts, look for currency symbols ($, €, £) and numbers
- Default currency is USD if not specified
- Always extract email addresses for the recipient
- For transfers: USD goes to US bank accounts, EUR goes to IBAN accounts

## Balance Terminology
- idle_balance: USDC in the user's Safe (ready to spend now)
- earning_balance: USDC in savings vaults (earning yield)
- spendable_balance: Total available = idle + earning

## Attachment Flow

CRITICAL: YOU must read the attachment and match it to the right transaction. Do NOT blindly trust tool matching.

### When user sends email WITH attachment:

1. FIRST: Read the PDF/image attachment carefully. Extract: amount, recipient/vendor name, date, description.
2. THEN: Call listRecentTransactions to see available transactions
3. YOU DECIDE: Match the document to the correct transaction based on what you extracted

**If you find an EXACT match** (amount matches, recipient matches):
   - Call attachDocumentToTransaction with the transaction ID

**If NO exact match** (ambiguous, multiple possibilities, or nothing close):
   - Call storeAttachmentAndAskUser - this uploads the file to blob storage and asks the user
   - Include the extracted details and candidate transactions
   - The attachment is now STORED and will persist when the user replies

### When user REPLIES with their selection (after you asked):

IMPORTANT: The user's reply email will NOT have the attachment - it was in the original email!
Check if there's a pending action of type 'select_transaction_for_attachment'.

If yes:
   - Parse which transaction the user selected (e.g., "the first one", "#2", "the €2,963 one")
   - Call attachStoredDocument with the transactionId - the blob URL is already stored
   - Do NOT look for an attachment in this reply email

### Matching rules:
   - Amount should be close (within 10%) or exact
   - Recipient/vendor name should match (fuzzy is ok)
   - Date should be reasonable (invoice date near transaction date)
   - If NOTHING matches well, use storeAttachmentAndAskUser

### When user confirms (YES) for attach_document pending action:
   - For single attachment: call confirmAttachment
   - For multiple attachments: call confirmMultipleAttachments

### When user picks alternative (A/B/C):
   - Call confirmAttachment with their selection

### When user asks to remove an attachment:
   - Call listAttachments to find it
   - Call removeAttachment with the attachment ID

### Request patterns:
   - "Attach this to my Acme payment" → findTransaction("Acme"), attachDocumentToTransaction
   - "Attach this invoice" [1 PDF, exact match] → Read PDF, listRecentTransactions, attachDocumentToTransaction
   - "Attach this invoice" [1 PDF, no exact match] → Read PDF, listRecentTransactions, storeAttachmentAndAskUser
   - User replies "the second one" → Check pending action, call attachStoredDocument
   - "What's attached to my last transfer?" → findTransaction, listAttachments

## Payment Details Flow

1. When user asks for their own payment details:
   - "What are my payment details?" / "Send me my bank info" / "How can someone pay me?"
   - Call getPaymentDetails - this sends the details directly to the user (no confirmation needed)

2. When user wants to share payment details with someone else:
   - "Send my payment details to john@example.com" / "Share my bank info with Acme Corp"
   - Call sendPaymentDetailsToRecipient - this REQUIRES confirmation before sending
   - After user confirms with YES, call confirmSendPaymentDetails

3. Payment details include:
   - USD Account (ACH): Bank name, routing number, account number, beneficiary
   - EUR Account (IBAN): Bank name, IBAN, BIC/SWIFT, beneficiary

## Email Formatting Rules
- NO markdown (no ** or other formatting) - emails should be plain text
- Say "transfer" not "offramp" or "onramp"
- Say "incoming transfer" not "crypto_incoming"
- Format currency with symbols: $500, €200, £100
- Format dates nicely: "Dec 23, 2024" not "2024-12-23"
- Keep emails concise and scannable

## User Context
- Sender Email: ${session.senderEmail}
- Workspace: ${workspaceName}
`;

  let contextSections = '';

  // Add extracted data context from previous messages
  if (session.extractedData) {
    const data = session.extractedData;
    const extractedParts: string[] = [];

    if (data.recipientEmail)
      extractedParts.push(`- Recipient Email: ${data.recipientEmail}`);
    if (data.recipientName)
      extractedParts.push(`- Recipient Name: ${data.recipientName}`);
    if (data.recipientCompany)
      extractedParts.push(`- Company: ${data.recipientCompany}`);
    if (data.amount !== undefined && data.currency)
      extractedParts.push(`- Amount: ${data.currency} ${data.amount}`);
    else if (data.amount !== undefined)
      extractedParts.push(`- Amount: ${data.amount}`);
    if (data.description)
      extractedParts.push(`- Description: ${data.description}`);

    if (extractedParts.length > 0) {
      contextSections += `

## Previously Extracted Data
You already extracted this information from earlier in the conversation (e.g., from a forwarded email or attachment):
${extractedParts.join('\n')}

Use this data when the user asks to create an invoice, payment, or transfer. Do NOT ask the user for information you already have.
`;
    }
  }

  // Add invoice context if one was created
  if (session.invoiceId) {
    contextSections += `

## Created Invoice
An invoice has already been created in this session:
- Invoice ID: ${session.invoiceId}
`;
  }

  // Add pending action context if waiting for confirmation
  if (session.state === 'awaiting_confirmation' && session.pendingAction) {
    const action = session.pendingAction;

    if (action.type === 'send_invoice') {
      contextSections += `

## Pending Action
The user has a pending invoice to send:
- Invoice ID: ${action.invoiceId}
- Recipient: ${action.recipientEmail}
- Amount: ${action.amount} ${action.currency}
- Description: ${action.description}
- Preview Link: ${action.invoiceLink}

If the user confirms (YES, ok, send it, confirm, etc.), call sendInvoiceToRecipient.
If the user declines (NO, cancel, don't send, stop, etc.), acknowledge and do not send.

IMPORTANT: Look for confirmation keywords in the user's latest message.
`;
    } else if (action.type === 'attach_document') {
      const altLabels = action.alternatives
        .map(
          (alt, i) =>
            `  [${String.fromCharCode(65 + i)}] ${alt.currency} ${alt.amount} to ${alt.recipientName || 'Unknown'} (${alt.date})`,
        )
        .join('\n');

      contextSections += `

## Pending Action
The user has a pending attachment to add:
- File: ${action.attachmentFilename} (${Math.round(action.attachmentSize / 1024)} KB)
- Best Match: ${action.bestMatch.currency} ${action.bestMatch.amount} to ${action.bestMatch.recipientName || 'Unknown'} (${action.bestMatch.date})
${action.alternatives.length > 0 ? `- Alternatives:\n${altLabels}` : ''}

If the user confirms (YES), attach to the best match.
If the user picks an alternative (A, B, C), attach to that transaction.
If the user declines (NO, cancel), do not attach.
`;
    } else if (action.type === 'attach_multiple') {
      const matchList = action.matches
        .map(
          (m, i) =>
            `  ${i + 1}. ${m.filename} → ${m.transaction.currency} ${m.transaction.amount} to ${m.transaction.recipientName || 'Unknown'}`,
        )
        .join('\n');

      contextSections += `

## Pending Action
The user has ${action.matches.length} attachments to add:
${matchList}

If the user confirms (YES), call confirmMultipleAttachments.
If the user declines (NO, cancel), do not attach.
`;
    } else if (action.type === 'remove_attachment') {
      const altLabels = action.alternatives
        .map(
          (alt, i) =>
            `  [${String.fromCharCode(65 + i)}] ${alt.filename} on ${alt.transaction.currency} ${alt.transaction.amount}`,
        )
        .join('\n');

      contextSections += `

## Pending Action
The user wants to remove an attachment:
- File: ${action.bestMatch.filename}
- From: ${action.bestMatch.transaction.currency} ${action.bestMatch.transaction.amount} to ${action.bestMatch.transaction.recipientName || 'Unknown'}
${action.alternatives.length > 0 ? `- Alternatives:\n${altLabels}` : ''}

If the user confirms (YES), remove the attachment.
If the user picks an alternative (A, B, C), remove that attachment instead.
If the user declines (NO, cancel), do not remove.
`;
    } else if (action.type === 'send_payment_details') {
      contextSections += `

## Pending Action
The user wants to send their payment details to:
- Recipient: ${action.recipientName ? `${action.recipientName} (${action.recipientEmail})` : action.recipientEmail}
- Accounts to share: ${action.usdAccount ? 'USD (ACH)' : ''}${action.usdAccount && action.eurAccount ? ' and ' : ''}${action.eurAccount ? 'EUR (IBAN)' : ''}

If the user confirms (YES), call confirmSendPaymentDetails.
If the user declines (NO, cancel), do not send.
`;
    } else if (action.type === 'select_transaction_for_attachment') {
      const txList = action.candidateTransactions
        .map(
          (tx, i) =>
            `  ${i + 1}. ${tx.currency} ${tx.amount} to ${tx.recipientName || 'Unknown'} (${tx.date}) [ID: ${tx.id}]`,
        )
        .join('\n');

      contextSections += `

## Pending Action - ATTACHMENT STORED
You previously asked the user which transaction to attach a document to.
The attachment is ALREADY UPLOADED to Vercel Blob - you do NOT need the attachment from this email.

- File: ${action.attachmentFilename} (${Math.round(action.attachmentSize / 1024)} KB)
- Stored at: ${action.tempBlobUrl}
- Extracted from document: ${action.extractedDetails.vendor ? `Vendor: ${action.extractedDetails.vendor}, ` : ''}${action.extractedDetails.amount ? `Amount: ${action.extractedDetails.currency || ''} ${action.extractedDetails.amount}, ` : ''}${action.extractedDetails.date ? `Date: ${action.extractedDetails.date}` : ''}

Candidate transactions you showed the user:
${txList}

IMPORTANT: When the user replies with their selection (e.g., "the first one", "attach to #2", "the €2,963 one"):
1. Parse which transaction they selected from the list above
2. Call attachStoredDocument with the transactionId from that selection
3. Do NOT look for an attachment in this email - it's already stored!

If the user declines (NO, cancel), acknowledge and clear the pending action.
`;
    }
  }

  return basePrompt + contextSections;
}

/**
 * Email templates for AI responses.
 */
export const emailTemplates = {
  /**
   * Template for invoice confirmation request.
   */
  confirmationRequest: (params: {
    recipientEmail: string;
    recipientName?: string;
    amount: number;
    currency: string;
    description: string;
    invoiceLink: string;
  }) => {
    const recipientDisplay = params.recipientName
      ? `${params.recipientName} (${params.recipientEmail})`
      : params.recipientEmail;

    return {
      subject: `Invoice Ready: ${params.currency} ${params.amount.toLocaleString()} to ${params.recipientName || params.recipientEmail}`,
      body: `I've created an invoice based on the email you forwarded:

**Invoice Details:**
- To: ${recipientDisplay}
- Amount: ${params.currency} ${params.amount.toLocaleString()}
- Description: ${params.description}

**Preview:** ${params.invoiceLink}

Reply **YES** to send this invoice to ${params.recipientEmail}.
Reply **NO** to cancel.`,
    };
  },

  /**
   * Template for invoice sent confirmation.
   */
  invoiceSent: (params: {
    recipientEmail: string;
    recipientName?: string;
    amount: number;
    currency: string;
    invoiceLink: string;
  }) => {
    const recipientDisplay = params.recipientName || params.recipientEmail;

    return {
      subject: `Invoice Sent to ${recipientDisplay}`,
      body: `Done! I've sent the invoice for ${params.currency} ${params.amount.toLocaleString()} to ${params.recipientEmail}.

They'll receive an email with a link to view and pay the invoice.

Track this invoice: ${params.invoiceLink}`,
    };
  },

  /**
   * Template for invoice ready (when email couldn't be sent directly).
   * User can forward this to the recipient.
   */
  invoiceReadyToForward: (params: {
    recipientEmail: string;
    recipientName?: string;
    amount: number;
    currency: string;
    invoiceLink: string;
  }) => {
    const recipientDisplay = params.recipientName || params.recipientEmail;

    return {
      subject: `Invoice Ready for ${recipientDisplay}`,
      body: `Here's your invoice for ${params.currency} ${params.amount.toLocaleString()}:

${params.invoiceLink}

Forward to: ${params.recipientEmail}`,
    };
  },

  /**
   * Template for cancellation acknowledgment.
   */
  cancelled: () => ({
    subject: 'Invoice Cancelled',
    body: `Got it - I've cancelled the invoice. No email was sent to the recipient.

Forward another email when you're ready to create a new invoice.`,
  }),

  /**
   * Template for invoice email to recipient.
   */
  invoiceToRecipient: (params: {
    senderName: string;
    amount: number;
    currency: string;
    description: string;
    invoiceLink: string;
    recipientName?: string;
  }) => {
    const greeting = params.recipientName
      ? `Hi ${params.recipientName},`
      : 'Hi,';

    return {
      subject: `Invoice from ${params.senderName}: ${params.currency} ${params.amount.toLocaleString()}`,
      body: `${greeting}

${params.senderName} has sent you an invoice for ${params.currency} ${params.amount.toLocaleString()}.

**Description:** ${params.description}

**View & Pay Invoice:** ${params.invoiceLink}

This invoice was created using 0 Finance.`,
    };
  },

  /**
   * Template for workspace not found error.
   */
  workspaceNotFound: () => ({
    subject: 'Unable to Process Your Request',
    body: `I couldn't find a 0 Finance workspace associated with this email address.

Please check that you're using the correct AI email address from your 0 Finance dashboard settings.

If you don't have a 0 Finance account yet, sign up at https://0.finance`,
  }),

  /**
   * Template for general error.
   */
  error: (message?: string) => ({
    subject: 'Something Went Wrong',
    body: `I encountered an error while processing your request.

${message ? `Error: ${message}\n\n` : ''}Please try again or contact support if the issue persists.`,
  }),

  /**
   * Template for balance inquiry response.
   */
  balanceResponse: (params: {
    spendable: string;
    idle: string;
    earning: string;
  }) => ({
    subject: `Your Balance: $${params.spendable}`,
    body: `Here's your current 0 Finance balance:

**Spendable:** $${params.spendable}
- Idle (ready now): $${params.idle}
- Earning in savings: $${params.earning}

Reply to this email if you'd like to create an invoice or send a transfer.`,
  }),

  /**
   * Template for transfer proposal confirmation.
   */
  transferProposed: (params: {
    amount: string;
    currency: string;
    destinationAmount: string;
    bankName: string;
    fee: string;
  }) => ({
    subject: `Transfer Proposed: $${params.amount} to ${params.bankName}`,
    body: `I've proposed a transfer for your approval:

**Transfer Details:**
- Amount: $${params.amount} USDC
- To: ${params.bankName}
- You'll receive: ${params.currency.toUpperCase()} ${params.destinationAmount}
- Fee: $${params.fee}

**Action Required:** Approve this transfer in your 0 Finance dashboard.

The transfer will not be sent until you approve it.`,
  }),

  /**
   * Template for no bank accounts found.
   */
  noBankAccounts: () => ({
    subject: 'No Bank Accounts Found',
    body: `I couldn't find any saved bank accounts for transfers.

To send money, first add a bank account in your 0 Finance dashboard:
1. Go to Settings > Bank Accounts
2. Add your bank account details
3. Then reply to this email with your transfer request`,
  }),

  /**
   * Template for single attachment confirmation.
   * Clean formatting, no markdown, human-friendly language.
   */
  attachmentConfirmation: (params: {
    filename: string;
    fileSize: string;
    bestMatch: {
      amount: string;
      currency: string;
      recipientName?: string;
      date: string;
    };
    alternatives: Array<{
      label: string;
      amount: string;
      currency: string;
      recipientName?: string;
      date: string;
    }>;
  }) => {
    const formatDate = (dateStr: string) => {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    };

    const formatTransaction = (tx: {
      amount: string;
      currency: string;
      recipientName?: string;
      date: string;
    }) => {
      const symbol =
        tx.currency.toUpperCase() === 'EUR'
          ? '€'
          : tx.currency.toUpperCase() === 'GBP'
            ? '£'
            : '$';
      return `${symbol}${parseFloat(tx.amount).toLocaleString()} to ${tx.recipientName || 'Unknown'} on ${formatDate(tx.date)}`;
    };

    const alternativesList = params.alternatives
      .map((alt) => `   ${alt.label})  ${formatTransaction(alt)}`)
      .join('\n');

    const body = `I found a match for your attachment.

${params.filename} (${params.fileSize})

   →  ${formatTransaction(params.bestMatch)}

${
  params.alternatives.length > 0
    ? `Other recent transfers:
${alternativesList}

Reply YES to attach to the first match, or A/B/C to pick another.`
    : `Reply YES to attach, or NO to cancel.`
}`;

    return {
      subject: `Attach ${params.filename}?`,
      body,
    };
  },

  /**
   * Template for multi-attachment confirmation.
   * Smart matching of multiple files to multiple transactions.
   */
  multiAttachmentConfirmation: (params: {
    matches: Array<{
      filename: string;
      fileSize: string;
      transaction: {
        amount: string;
        currency: string;
        recipientName?: string;
        date: string;
      };
    }>;
  }) => {
    const formatDate = (dateStr: string) => {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    };

    const formatTransaction = (tx: {
      amount: string;
      currency: string;
      recipientName?: string;
      date: string;
    }) => {
      const symbol =
        tx.currency.toUpperCase() === 'EUR'
          ? '€'
          : tx.currency.toUpperCase() === 'GBP'
            ? '£'
            : '$';
      return `${symbol}${parseFloat(tx.amount).toLocaleString()} to ${tx.recipientName || 'Unknown'} (${formatDate(tx.date)})`;
    };

    const matchList = params.matches
      .map(
        (m, i) =>
          `   ${i + 1}.  ${m.filename}  →  ${formatTransaction(m.transaction)}`,
      )
      .join('\n');

    const body = `I matched your ${params.matches.length} attachments to transactions:

${matchList}

Reply YES to attach all, or NO to cancel.`;

    return {
      subject: `Attach ${params.matches.length} files?`,
      body,
    };
  },

  /**
   * Template for successful attachment (single).
   */
  attachmentSuccess: (params: {
    filename: string;
    amount: string;
    currency: string;
    recipientName?: string;
    date: string;
  }) => {
    const formatDate = (dateStr: string) => {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    };
    const symbol =
      params.currency.toUpperCase() === 'EUR'
        ? '€'
        : params.currency.toUpperCase() === 'GBP'
          ? '£'
          : '$';

    return {
      subject: `Attached: ${params.filename}`,
      body: `Done! Attached ${params.filename} to your ${symbol}${parseFloat(params.amount).toLocaleString()} transfer to ${params.recipientName || 'Unknown'} (${formatDate(params.date)}).`,
    };
  },

  /**
   * Template for successful multi-attachment.
   */
  multiAttachmentSuccess: (params: { count: number; files: string[] }) => ({
    subject: `Attached ${params.count} files`,
    body: `Done! Attached ${params.count} files to your transactions:

${params.files.map((f, i) => `   ${i + 1}.  ${f}`).join('\n')}`,
  }),

  /**
   * Template for remove attachment confirmation.
   */
  removeAttachmentConfirmation: (params: {
    filename: string;
    amount: string;
    currency: string;
    recipientName?: string;
    date: string;
    alternatives: Array<{
      label: string;
      filename: string;
      amount: string;
      currency: string;
      recipientName?: string;
      date: string;
    }>;
  }) => {
    const formatDate = (dateStr: string) => {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    };
    const symbol =
      params.currency.toUpperCase() === 'EUR'
        ? '€'
        : params.currency.toUpperCase() === 'GBP'
          ? '£'
          : '$';

    const alternativesList = params.alternatives
      .map((alt) => {
        const altSymbol =
          alt.currency.toUpperCase() === 'EUR'
            ? '€'
            : alt.currency.toUpperCase() === 'GBP'
              ? '£'
              : '$';
        return `   ${alt.label})  ${alt.filename} on ${altSymbol}${parseFloat(alt.amount).toLocaleString()} to ${alt.recipientName || 'Unknown'}`;
      })
      .join('\n');

    const body = `Remove this attachment?

${params.filename}
From: ${symbol}${parseFloat(params.amount).toLocaleString()} transfer to ${params.recipientName || 'Unknown'} (${formatDate(params.date)})

${
  params.alternatives.length > 0
    ? `Other attachments found:
${alternativesList}

Reply YES to remove, or A/B/C to remove a different one.`
    : `Reply YES to remove, or NO to cancel.`
}`;

    return {
      subject: `Remove ${params.filename}?`,
      body,
    };
  },

  /**
   * Template for successful attachment removal.
   */
  removeAttachmentSuccess: (params: {
    filename: string;
    amount: string;
    currency: string;
    recipientName?: string;
  }) => {
    const symbol =
      params.currency.toUpperCase() === 'EUR'
        ? '€'
        : params.currency.toUpperCase() === 'GBP'
          ? '£'
          : '$';
    return {
      subject: `Removed: ${params.filename}`,
      body: `Done! Removed ${params.filename} from your ${symbol}${parseFloat(params.amount).toLocaleString()} transfer to ${params.recipientName || 'Unknown'}.`,
    };
  },

  /**
   * Template for no transactions found.
   */
  noTransactionsFound: (params: { searchQuery?: string }) => ({
    subject: 'No Transactions Found',
    body: `I couldn't find any transactions${params.searchQuery ? ` matching "${params.searchQuery}"` : ''}.

Try being more specific:
  • Recipient name (e.g., "Acme Corp")
  • Amount (e.g., "$500")
  • Date (e.g., "last week", "December 15")`,
  }),

  /**
   * Template for no attachments found.
   */
  noAttachmentsFound: (params: { searchQuery?: string }) => ({
    subject: 'No Attachments Found',
    body: `I couldn't find any attachments${params.searchQuery ? ` matching "${params.searchQuery}"` : ''} on your transactions.

To attach a document, forward an email with the file attached and tell me which transaction to attach it to.`,
  }),

  /**
   * Template for payment details (sent to user themselves).
   */
  paymentDetails: (params: {
    accountTier: 'starter' | 'full';
    usdAccount: {
      bankName: string | null;
      routingNumber: string | null;
      accountNumber: string | null;
      beneficiaryName: string;
    } | null;
    eurAccount: {
      bankName: string | null;
      iban: string | null;
      bicSwift: string | null;
      beneficiaryName: string;
    } | null;
    companyName: string | null;
  }) => {
    const tierLabel =
      params.accountTier === 'full' ? 'Full Account' : 'Starter Account';
    const limitNote =
      params.accountTier === 'starter'
        ? '\n\nNote: Starter accounts have a $10,000 deposit limit. Complete KYC verification to remove limits.'
        : '';

    let body = `Here are your 0 Finance payment details (${tierLabel}):\n`;

    if (params.usdAccount) {
      body += `
━━━━━━━━━━━━━━━━━━━━━━━━
USD Account (ACH & Wire)
━━━━━━━━━━━━━━━━━━━━━━━━
Bank Name: ${params.usdAccount.bankName || 'N/A'}
Routing Number: ${params.usdAccount.routingNumber || 'N/A'}
Account Number: ${params.usdAccount.accountNumber || 'N/A'}
Beneficiary: ${params.usdAccount.beneficiaryName}
`;
    }

    if (params.eurAccount) {
      body += `
━━━━━━━━━━━━━━━━━━━━━━━━
EUR Account (SEPA / IBAN)
━━━━━━━━━━━━━━━━━━━━━━━━
Bank Name: ${params.eurAccount.bankName || 'N/A'}
IBAN: ${params.eurAccount.iban || 'N/A'}
BIC/SWIFT: ${params.eurAccount.bicSwift || 'N/A'}
Beneficiary: ${params.eurAccount.beneficiaryName}
`;
    }

    if (!params.usdAccount && !params.eurAccount) {
      body = `You don't have any payment accounts set up yet. Please complete onboarding to get your bank account details.`;
    }

    body += limitNote;

    return {
      subject: 'Your 0 Finance Payment Details',
      body,
    };
  },

  /**
   * Template for payment details confirmation (before sending to third party).
   */
  paymentDetailsConfirmation: (params: {
    recipientEmail: string;
    recipientName?: string;
    accountTier: 'starter' | 'full';
    usdAccount: {
      bankName: string | null;
      routingNumber: string | null;
      accountNumber: string | null;
      beneficiaryName: string;
    } | null;
    eurAccount: {
      bankName: string | null;
      iban: string | null;
      bicSwift: string | null;
      beneficiaryName: string;
    } | null;
  }) => {
    const recipient = params.recipientName
      ? `${params.recipientName} (${params.recipientEmail})`
      : params.recipientEmail;

    let accountSummary = '';
    if (params.usdAccount && params.eurAccount) {
      accountSummary = 'USD (ACH) and EUR (IBAN) accounts';
    } else if (params.usdAccount) {
      accountSummary = 'USD (ACH) account';
    } else if (params.eurAccount) {
      accountSummary = 'EUR (IBAN) account';
    }

    return {
      subject: 'Send payment details?',
      body: `Send your ${accountSummary} details to ${recipient}?

This will share your bank account information so they can send you payments.

Reply YES to send, or NO to cancel.`,
    };
  },

  /**
   * Template for payment details sent successfully.
   */
  paymentDetailsSent: (params: {
    recipientEmail: string;
    recipientName?: string;
  }) => {
    const recipient = params.recipientName
      ? `${params.recipientName} (${params.recipientEmail})`
      : params.recipientEmail;

    return {
      subject: 'Payment details sent',
      body: `Done! Your payment details have been sent to ${recipient}.

They can now use these details to send you payments via bank transfer.`,
    };
  },

  /**
   * Template for payment details email sent to third party.
   */
  paymentDetailsForRecipient: (params: {
    senderName: string;
    senderCompany?: string;
    usdAccount: {
      bankName: string | null;
      routingNumber: string | null;
      accountNumber: string | null;
      beneficiaryName: string;
    } | null;
    eurAccount: {
      bankName: string | null;
      iban: string | null;
      bicSwift: string | null;
      beneficiaryName: string;
    } | null;
  }) => {
    const fromLine = params.senderCompany
      ? `${params.senderName} (${params.senderCompany})`
      : params.senderName;

    let body = `${fromLine} has shared their payment details with you:\n`;

    if (params.usdAccount) {
      body += `
━━━━━━━━━━━━━━━━━━━━━━━━
USD Account (ACH & Wire)
━━━━━━━━━━━━━━━━━━━━━━━━
Bank Name: ${params.usdAccount.bankName || 'N/A'}
Routing Number: ${params.usdAccount.routingNumber || 'N/A'}
Account Number: ${params.usdAccount.accountNumber || 'N/A'}
Beneficiary: ${params.usdAccount.beneficiaryName}
`;
    }

    if (params.eurAccount) {
      body += `
━━━━━━━━━━━━━━━━━━━━━━━━
EUR Account (SEPA / IBAN)
━━━━━━━━━━━━━━━━━━━━━━━━
Bank Name: ${params.eurAccount.bankName || 'N/A'}
IBAN: ${params.eurAccount.iban || 'N/A'}
BIC/SWIFT: ${params.eurAccount.bicSwift || 'N/A'}
Beneficiary: ${params.eurAccount.beneficiaryName}
`;
    }

    body += `
---
Sent via 0 Finance (https://0.finance)`;

    return {
      subject: `Payment details from ${fromLine}`,
      body,
    };
  },

  /**
   * Template for no payment accounts found.
   */
  noPaymentAccounts: () => ({
    subject: 'No Payment Accounts',
    body: `You don't have any payment accounts set up yet.

Please complete onboarding at https://0.finance to get your bank account details.`,
  }),
};
