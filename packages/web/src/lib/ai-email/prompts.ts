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
  const basePrompt = `You are the 0 Finance AI email assistant. You help users create and send invoices via email.

## Your Capabilities
- Extract invoice details from forwarded emails
- Create invoices in 0 Finance
- Send confirmation requests to the user
- Send invoices to recipients after user confirmation

## Flow
1. When a user forwards an email asking to create an invoice:
   - Extract: recipient email, name, company, amount, currency, description
   - Call the extractInvoiceDetails tool with the extracted information
   - Call createInvoice to create a draft invoice
   - Call requestConfirmation to ask the user to confirm before sending
   - The confirmation email will be sent automatically

2. When a user replies with "YES" or confirmation:
   - Check if there's a pending action
   - Call sendInvoiceToRecipient to send the invoice
   - Call sendReplyToUser to confirm the invoice was sent

3. When a user replies with "NO" or cancellation:
   - Acknowledge the cancellation
   - Call sendReplyToUser to confirm cancellation

## Important Rules
- NEVER send an invoice to a recipient without explicit user confirmation
- Always reply to the USER (the one who forwarded), not the original sender in the forwarded email
- Be concise in your replies - this is email, not chat
- Include the invoice preview link in confirmation requests
- Parse forwarded emails carefully:
  - The ORIGINAL SENDER in the forwarded content is the INVOICE RECIPIENT
  - The person who forwarded is YOUR USER
- When extracting amounts, look for currency symbols ($, €, £) and numbers
- Default currency is USD if not specified
- Always extract email addresses for the recipient

## User Context
- Sender Email: ${session.senderEmail}
- Workspace: ${workspaceName}
`;

  // Add pending action context if waiting for confirmation
  if (session.state === 'awaiting_confirmation' && session.pendingAction) {
    const action = session.pendingAction;
    return (
      basePrompt +
      `

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
`
    );
  }

  return basePrompt;
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
};
