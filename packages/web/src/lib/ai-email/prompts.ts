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
 * Parse AI name from email handle.
 * Handle format: "ai-firstname.lastname" (e.g., "ai-clara.mitchell")
 * Returns { firstName, lastName, fullName }
 */
function parseAiNameFromHandle(handle: string | null): {
  firstName: string;
  lastName: string;
  fullName: string;
} {
  if (!handle) {
    return { firstName: 'AI', lastName: 'Assistant', fullName: 'AI Assistant' };
  }

  // Remove "ai-" prefix if present
  const namePart = handle.startsWith('ai-') ? handle.slice(3) : handle;

  // Split by dot: "firstname.lastname"
  const parts = namePart.split('.');
  if (parts.length >= 2) {
    const firstName =
      parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
    const lastName =
      parts[1].charAt(0).toUpperCase() + parts[1].slice(1).toLowerCase();
    return { firstName, lastName, fullName: `${firstName} ${lastName}` };
  }

  // Single name
  const firstName =
    namePart.charAt(0).toUpperCase() + namePart.slice(1).toLowerCase();
  return { firstName, lastName: '', fullName: firstName };
}

/**
 * Get the system prompt for the AI email agent.
 *
 * @param session - The current email session
 * @param workspaceName - Name of the workspace for context
 * @param aiEmailHandle - The AI's email handle (e.g., "ai-clara.mitchell")
 * @returns The system prompt string
 */
export function getSystemPrompt(
  session: AiEmailSession,
  workspaceName: string,
  aiEmailHandle?: string | null,
): string {
  const aiName = parseAiNameFromHandle(aiEmailHandle ?? null);

  const basePrompt = `You are ${aiName.fullName}, a financial assistant at 0 Finance. You help ${workspaceName} manage invoices, payments, and transfers via email.

Sign emails casually as "${aiName.firstName}".

## How to Think

You're having a conversation over email. Read what the user wants, use your tools to help them, and respond naturally. Don't follow rigid scripts - understand their intent and be helpful.

When something is unclear or missing (like an email address), just ask. When the user corrects you or provides new info, adapt - don't start over.

If there's an attachment, READ IT. It probably contains details the user wants you to use.

## Core Principles

1. **Use tools proactively** - Look things up before asking the user. You can check balances, find bank accounts, list transactions.

2. **Never invent data** - If you don't have an email address, ask for it. Don't use placeholders like "name@unknown.com".

3. **Understand corrections** - "No, I meant..." or "actually..." means the user is clarifying, not cancelling. Only treat explicit "cancel" or "nevermind" as cancellation.

4. **Read attachments** - PDFs and images often contain the details the user wants you to extract (names, addresses, VAT numbers, amounts).

5. **Confirm before sending** - Always get explicit "yes" before sending invoices or sharing payment details with third parties.

## What You Can Do

- **Invoices**: Create, update, send invoices. Extract details from forwarded emails or attachments.
- **Balances**: Check idle balance (ready to spend), earning balance (in vaults), total spendable.
- **Transfers**: Propose bank transfers (user approves in dashboard). Find saved bank accounts.
- **Attachments**: Attach receipts/invoices to transactions. Read PDFs to extract details.
- **Payment Details**: Share the user's bank account info for receiving payments.

## Email Style

- Plain text only (no markdown like ** or ##)
- Be concise - this is email, not chat
- Use currency symbols: $500, €200
- Format dates nicely: "Dec 23, 2024"

## Context

User: ${session.senderEmail}
Workspace: ${workspaceName}
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
            `  [${String.fromCharCode(65 + i)}] $${alt.sourceAmount} USDC → ${alt.destinationCurrency} ${alt.destinationAmount} to ${alt.recipientName || 'Unknown'} (${alt.date})`,
        )
        .join('\n');

      contextSections += `

## Pending Action
The user has a pending attachment to add:
- File: ${action.attachmentFilename} (${Math.round(action.attachmentSize / 1024)} KB)
- Best Match: $${action.bestMatch.sourceAmount} USDC → ${action.bestMatch.destinationCurrency} ${action.bestMatch.destinationAmount} to ${action.bestMatch.recipientName || 'Unknown'} (${action.bestMatch.date})
${action.alternatives.length > 0 ? `- Alternatives:\n${altLabels}` : ''}

If the user confirms (YES), attach to the best match.
If the user picks an alternative (A, B, C), attach to that transaction.
If the user declines (NO, cancel), do not attach.
`;
    } else if (action.type === 'attach_multiple') {
      const matchList = action.matches
        .map(
          (m, i) =>
            `  ${i + 1}. ${m.filename} → $${m.transaction.sourceAmount} USDC → ${m.transaction.destinationCurrency} ${m.transaction.destinationAmount} to ${m.transaction.recipientName || 'Unknown'}`,
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
            `  [${String.fromCharCode(65 + i)}] ${alt.filename} on $${alt.transaction.sourceAmount} USDC → ${alt.transaction.destinationCurrency} ${alt.transaction.destinationAmount}`,
        )
        .join('\n');

      contextSections += `

## Pending Action
The user wants to remove an attachment:
- File: ${action.bestMatch.filename}
- From: $${action.bestMatch.transaction.sourceAmount} USDC → ${action.bestMatch.transaction.destinationCurrency} ${action.bestMatch.transaction.destinationAmount} to ${action.bestMatch.transaction.recipientName || 'Unknown'}
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
      body: `I've created an invoice:

To: ${recipientDisplay}
Amount: ${params.currency} ${params.amount.toLocaleString()}
Description: ${params.description}

Preview: ${params.invoiceLink}

Reply YES to send this invoice to ${params.recipientEmail}.
Reply NO to cancel.`,
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

Description: ${params.description}

View & Pay Invoice: ${params.invoiceLink}

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

Spendable: $${params.spendable}
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

Amount: $${params.amount} USDC
To: ${params.bankName}
You'll receive: ${params.currency.toUpperCase()} ${params.destinationAmount}
Fee: $${params.fee}

Action Required: Approve this transfer in your 0 Finance dashboard.

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
   * Shows sourceAmount (USDC sent) as primary, with destinationAmount (fiat received) as context.
   */
  attachmentConfirmation: (params: {
    filename: string;
    fileSize: string;
    bestMatch: {
      sourceAmount: string;
      sourceToken: string;
      destinationAmount: string;
      destinationCurrency: string;
      recipientName?: string;
      date: string;
    };
    alternatives: Array<{
      label: string;
      sourceAmount: string;
      sourceToken: string;
      destinationAmount: string;
      destinationCurrency: string;
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
      sourceAmount: string;
      sourceToken: string;
      destinationAmount: string;
      destinationCurrency: string;
      recipientName?: string;
      date: string;
    }) => {
      // Show source amount (USDC) as primary since that's what user sent
      const destSymbol =
        tx.destinationCurrency.toUpperCase() === 'EUR'
          ? '€'
          : tx.destinationCurrency.toUpperCase() === 'GBP'
            ? '£'
            : '$';
      const destDisplay = `${destSymbol}${parseFloat(tx.destinationAmount).toLocaleString()} ${tx.destinationCurrency.toUpperCase()}`;
      return `$${parseFloat(tx.sourceAmount).toLocaleString()} USDC → ${destDisplay} to ${tx.recipientName || 'Unknown'} on ${formatDate(tx.date)}`;
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
        sourceAmount: string;
        sourceToken: string;
        destinationAmount: string;
        destinationCurrency: string;
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
      sourceAmount: string;
      sourceToken: string;
      destinationAmount: string;
      destinationCurrency: string;
      recipientName?: string;
      date: string;
    }) => {
      const destSymbol =
        tx.destinationCurrency.toUpperCase() === 'EUR'
          ? '€'
          : tx.destinationCurrency.toUpperCase() === 'GBP'
            ? '£'
            : '$';
      const destDisplay = `${destSymbol}${parseFloat(tx.destinationAmount).toLocaleString()} ${tx.destinationCurrency.toUpperCase()}`;
      return `$${parseFloat(tx.sourceAmount).toLocaleString()} USDC → ${destDisplay} to ${tx.recipientName || 'Unknown'} (${formatDate(tx.date)})`;
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
    sourceAmount: string;
    sourceToken: string;
    destinationAmount: string;
    destinationCurrency: string;
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
    const destSymbol =
      params.destinationCurrency.toUpperCase() === 'EUR'
        ? '€'
        : params.destinationCurrency.toUpperCase() === 'GBP'
          ? '£'
          : '$';
    const destDisplay = `${destSymbol}${parseFloat(params.destinationAmount).toLocaleString()} ${params.destinationCurrency.toUpperCase()}`;

    return {
      subject: `Attached: ${params.filename}`,
      body: `Done! Attached ${params.filename} to your $${parseFloat(params.sourceAmount).toLocaleString()} USDC → ${destDisplay} transfer to ${params.recipientName || 'Unknown'} (${formatDate(params.date)}).`,
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
    sourceAmount: string;
    sourceToken: string;
    destinationAmount: string;
    destinationCurrency: string;
    recipientName?: string;
    date: string;
    alternatives: Array<{
      label: string;
      filename: string;
      sourceAmount: string;
      sourceToken: string;
      destinationAmount: string;
      destinationCurrency: string;
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
    const destSymbol =
      params.destinationCurrency.toUpperCase() === 'EUR'
        ? '€'
        : params.destinationCurrency.toUpperCase() === 'GBP'
          ? '£'
          : '$';
    const destDisplay = `${destSymbol}${parseFloat(params.destinationAmount).toLocaleString()} ${params.destinationCurrency.toUpperCase()}`;

    const alternativesList = params.alternatives
      .map((alt) => {
        const altDestSymbol =
          alt.destinationCurrency.toUpperCase() === 'EUR'
            ? '€'
            : alt.destinationCurrency.toUpperCase() === 'GBP'
              ? '£'
              : '$';
        const altDestDisplay = `${altDestSymbol}${parseFloat(alt.destinationAmount).toLocaleString()} ${alt.destinationCurrency.toUpperCase()}`;
        return `   ${alt.label})  ${alt.filename} on $${parseFloat(alt.sourceAmount).toLocaleString()} USDC → ${altDestDisplay} to ${alt.recipientName || 'Unknown'}`;
      })
      .join('\n');

    const body = `Remove this attachment?

${params.filename}
From: $${parseFloat(params.sourceAmount).toLocaleString()} USDC → ${destDisplay} transfer to ${params.recipientName || 'Unknown'} (${formatDate(params.date)})

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
    sourceAmount: string;
    sourceToken: string;
    destinationAmount: string;
    destinationCurrency: string;
    recipientName?: string;
  }) => {
    const destSymbol =
      params.destinationCurrency.toUpperCase() === 'EUR'
        ? '€'
        : params.destinationCurrency.toUpperCase() === 'GBP'
          ? '£'
          : '$';
    const destDisplay = `${destSymbol}${parseFloat(params.destinationAmount).toLocaleString()} ${params.destinationCurrency.toUpperCase()}`;
    return {
      subject: `Removed: ${params.filename}`,
      body: `Done! Removed ${params.filename} from your $${parseFloat(params.sourceAmount).toLocaleString()} USDC → ${destDisplay} transfer to ${params.recipientName || 'Unknown'}.`,
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
