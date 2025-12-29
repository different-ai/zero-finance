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
};
