import { NextRequest, NextResponse } from 'next/server';
import { generateText, tool, stepCountIs } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });
import { headers } from 'next/headers';
import crypto from 'crypto';

import {
  mapToWorkspace,
  formatEmailForAI,
  parseConfirmationReply,
  getOrCreateSession,
  addMessageToSession,
  updateSession,
  createInvoiceForUser,
  getSystemPrompt,
  emailTemplates,
  AI_EMAIL_INBOUND_DOMAIN,
} from '@/lib/ai-email';
import {
  prepareAttachments,
  buildAttachmentContentParts,
  formatTextAttachmentsForAI,
  getAttachmentSummary,
} from '@/lib/ai-email/attachment-parser';
import type {
  AiEmailMessage,
  AiEmailPendingAction,
} from '@/db/schema/ai-email-sessions';
import { getEmailProviderSingleton } from '@/lib/email-provider';
import { getSpendableBalanceByWorkspace } from '@/server/services/spendable-balance';
import { listBankAccountsByWorkspace } from '@/server/services/bank-accounts';
import { db } from '@/db';
import {
  userDestinationBankAccounts,
  offrampTransfers,
  workspaces,
} from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { alignApi } from '@/server/services/align-api';

// Get the configured email provider (SES or Resend based on EMAIL_PROVIDER env var)
const emailProvider = getEmailProviderSingleton();

// In-memory rate limiter (for production, use Redis)
const rateLimiter = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 emails per minute per sender

/**
 * Check if a sender is rate limited
 */
function isRateLimited(senderEmail: string): boolean {
  const now = Date.now();
  const key = senderEmail.toLowerCase();
  const record = rateLimiter.get(key);

  if (!record || now > record.resetTime) {
    rateLimiter.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  record.count++;
  return false;
}

/**
 * Clean up old rate limit records (call periodically)
 */
function cleanupRateLimiter(): void {
  const now = Date.now();
  for (const [key, record] of rateLimiter.entries()) {
    if (now > record.resetTime) {
      rateLimiter.delete(key);
    }
  }
}

// Cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimiter, 5 * 60 * 1000);
}

/**
 * Get headers as a plain object for the email provider
 */
async function getHeadersObject(): Promise<Record<string, string>> {
  const headersList = await headers();
  const headersObj: Record<string, string> = {};
  headersList.forEach((value, key) => {
    headersObj[key] = value;
  });
  return headersObj;
}

/**
 * Extract the first "to" address if it's an array.
 */
function getToAddress(to: string | string[]): string {
  return Array.isArray(to) ? to[0] : to;
}

/**
 * Format the subject line for a reply.
 * Ensures it starts with "Re:" and maintains threading.
 */
function getReplySubject(originalSubject: string | undefined): string {
  if (!originalSubject) {
    return 'Re: Your message';
  }
  // If it already starts with Re:, don't add another
  if (originalSubject.toLowerCase().startsWith('re:')) {
    return originalSubject;
  }
  return `Re: ${originalSubject}`;
}

/**
 * Format the user's original message as a quote for context.
 */
function formatQuotedMessage(
  originalText: string,
  senderEmail: string,
  timestamp?: Date,
): string {
  const dateStr = timestamp
    ? timestamp.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : 'earlier';

  // Quote each line with >
  const quotedLines = originalText
    .split('\n')
    .map((line) => `> ${line}`)
    .join('\n');

  return `\n\n---\nOn ${dateStr}, ${senderEmail} wrote:\n${quotedLines}`;
}

/**
 * Send an email reply to the user.
 * @param workspaceId - The workspace ID to use in the reply-to address so users can hit "reply"
 */
async function sendReply(
  to: string,
  subject: string,
  body: string,
  inReplyTo?: string,
  workspaceId?: string,
): Promise<void> {
  const emailHeaders: Record<string, string> = {};
  if (inReplyTo) {
    emailHeaders['In-Reply-To'] = inReplyTo;
    emailHeaders['References'] = inReplyTo;
  }

  // Use workspace-specific address so users can hit "reply"
  const fromAddress = workspaceId
    ? `${workspaceId}@${AI_EMAIL_INBOUND_DOMAIN}`
    : `ai@${AI_EMAIL_INBOUND_DOMAIN}`;

  await emailProvider.send({
    from: `0 Finance AI <${fromAddress}>`,
    to,
    subject,
    text: body,
    headers: emailHeaders,
  });
}

/**
 * Send an invoice email to the recipient.
 */
async function sendInvoiceEmail(
  to: string,
  subject: string,
  body: string,
  senderName: string,
): Promise<void> {
  await emailProvider.send({
    from: `${senderName} via 0 Finance <invoices@${AI_EMAIL_INBOUND_DOMAIN}>`,
    to,
    subject,
    text: body,
  });
}

// =============================================================================
// AI SDK 6 Tool Definitions
// =============================================================================

/**
 * Schema for extracting invoice details from an email.
 * This is what the AI will parse from the forwarded email content.
 */
const extractInvoiceDetailsSchema = z.object({
  recipientEmail: z
    .string()
    .email()
    .describe(
      'Email address of the person/company to invoice (the original sender in forwarded emails)',
    ),
  recipientName: z
    .string()
    .optional()
    .describe('Name of the invoice recipient (person or contact name)'),
  recipientCompany: z
    .string()
    .optional()
    .describe('Company/business name of the invoice recipient'),
  amount: z
    .number()
    .positive()
    .describe('Invoice amount as a positive number (e.g., 2500.00)'),
  currency: z
    .string()
    .default('USD')
    .describe('Currency code: USD, EUR, GBP, USDC, etc. Default is USD'),
  description: z
    .string()
    .describe('Description of the work/services being invoiced for'),
});

/**
 * Schema for creating the invoice after extraction.
 */
const createInvoiceSchema = z.object({
  recipientEmail: z.string().email(),
  recipientName: z.string().optional(),
  recipientCompany: z.string().optional(),
  amount: z.number().positive(),
  currency: z.string(),
  description: z.string(),
});

/**
 * Schema for requesting user confirmation before sending.
 */
const requestConfirmationSchema = z.object({
  invoiceId: z.string().describe('The ID of the created invoice'),
  recipientEmail: z.string().email(),
  recipientName: z.string().optional(),
  amount: z.number().positive(),
  currency: z.string(),
  description: z.string(),
  invoiceLink: z.string().url().describe('Public link to preview the invoice'),
});

/**
 * Schema for sending a reply email to the user.
 * Note: Subject is auto-generated as "Re: [original]" to maintain threading.
 */
const sendReplyToUserSchema = z.object({
  body: z
    .string()
    .describe('Email body text - the response to send to the user'),
});

/**
 * Schema for sending the invoice to the recipient.
 */
const sendInvoiceToRecipientSchema = z.object({
  recipientEmail: z.string().email(),
  recipientName: z.string().optional(),
  invoiceLink: z.string().url(),
  senderName: z
    .string()
    .describe('Name of the person/company sending the invoice'),
  amount: z.number().positive(),
  currency: z.string(),
  description: z.string(),
});

/**
 * Schema for proposing a bank transfer.
 */
const proposeTransferSchema = z.object({
  amount_usdc: z.string().describe('Amount in USDC to send (e.g., "1000.00")'),
  destination_currency: z
    .enum(['usd', 'eur'])
    .describe('Target currency for the bank transfer'),
  saved_bank_account_id: z
    .string()
    .describe('ID of the saved bank account to send to'),
  reason: z
    .string()
    .optional()
    .describe('Why is this transfer being proposed? (shown to user)'),
});

/**
 * AI Email Webhook Handler
 *
 * Receives inbound emails from the configured email provider (SES or Resend)
 * and processes them using AI with tool calling.
 */
/**
 * Get the display name for invoice sender based on workspace info.
 * Priority: companyName > firstName lastName > workspaceName
 */
function getSenderDisplayName(workspaceResult: {
  workspaceName: string;
  companyName: string | null;
  firstName: string | null;
  lastName: string | null;
}): string {
  if (workspaceResult.companyName) {
    return workspaceResult.companyName;
  }
  if (workspaceResult.firstName && workspaceResult.lastName) {
    return `${workspaceResult.firstName} ${workspaceResult.lastName}`;
  }
  if (workspaceResult.firstName) {
    return workspaceResult.firstName;
  }
  return workspaceResult.workspaceName;
}

export async function POST(request: NextRequest) {
  let rawBody = '';
  let senderEmail = '';
  let messageId: string | undefined;
  let workspaceId: string | undefined;
  let originalSubject: string | undefined;

  try {
    // Read raw body for signature verification
    rawBody = await request.text();
    const headersObj = await getHeadersObject();
    const contentType = headersObj['content-type'] || '';

    const snsMessageType = headersObj['x-amz-sns-message-type'];
    console.log('[AI Email] Received request, content-type:', contentType);
    console.log('[AI Email] x-amz-sns-message-type:', snsMessageType);
    console.log('[AI Email] Body preview:', rawBody.substring(0, 200));

    // Handle SNS SubscriptionConfirmation
    if (snsMessageType === 'SubscriptionConfirmation') {
      console.log('[AI Email] Handling SNS SubscriptionConfirmation');
      try {
        const snsPayload = JSON.parse(rawBody);
        const subscribeUrl = snsPayload.SubscribeURL;
        if (subscribeUrl) {
          console.log(
            '[AI Email] Visiting SubscribeURL to confirm subscription...',
          );
          const confirmResponse = await fetch(subscribeUrl);
          if (confirmResponse.ok) {
            console.log('[AI Email] SNS subscription confirmed successfully');
            return NextResponse.json(
              { message: 'Subscription confirmed' },
              { status: 200 },
            );
          } else {
            console.error(
              '[AI Email] Failed to confirm subscription:',
              confirmResponse.status,
            );
            return NextResponse.json(
              { error: 'Failed to confirm subscription' },
              { status: 500 },
            );
          }
        }
      } catch (err) {
        console.error(
          '[AI Email] Error handling SubscriptionConfirmation:',
          err,
        );
        return NextResponse.json(
          { error: 'Failed to process subscription confirmation' },
          { status: 500 },
        );
      }
    }

    // Parse the payload based on content type
    let payload: unknown;

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const params = new URLSearchParams(rawBody);
      const formData: Record<string, string> = {};
      params.forEach((value, key) => {
        formData[key] = value;
      });
      payload = formData;
      console.log(
        '[AI Email] Parsed form-urlencoded payload:',
        Object.keys(formData),
      );

      if (formData.Action) {
        console.log(
          '[AI Email] Received AWS API-style request, Action:',
          formData.Action,
        );
        return NextResponse.json({ message: 'Acknowledged' }, { status: 200 });
      }
    } else {
      try {
        payload = JSON.parse(rawBody);
      } catch (parseError) {
        console.log('[AI Email] Failed to parse JSON body:', parseError);
        return NextResponse.json(
          { error: 'Invalid JSON payload' },
          { status: 400 },
        );
      }
    }

    if (emailProvider.handleWebhookHandshake) {
      const handshakeResponse = await emailProvider.handleWebhookHandshake(
        payload,
        headersObj,
      );
      if (handshakeResponse) {
        console.log('[AI Email] Handled webhook handshake');
        return NextResponse.json(
          { message: handshakeResponse.body },
          { status: handshakeResponse.status },
        );
      }
    }

    // Verify webhook signature
    const isValidSignature = await emailProvider.verifyWebhookSignature(
      rawBody,
      headersObj,
    );
    if (!isValidSignature) {
      console.log('[AI Email] Webhook signature verification failed');
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 },
      );
    }

    // Parse inbound email
    const email = await emailProvider.parseInboundWebhook(payload, headersObj);

    if (!email) {
      console.log('[AI Email] No email in payload (non-email notification)');
      return NextResponse.json({ success: true, handled: 'no_email' });
    }

    senderEmail = email.from;
    originalSubject = email.subject;

    // Check rate limit
    if (isRateLimited(email.from)) {
      console.log(`[AI Email] Rate limited: ${email.from}`);
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 },
      );
    }

    const toAddress = getToAddress(email.to);
    messageId = email.messageId || crypto.randomUUID();

    console.log(`[AI Email] Received email from ${email.from} to ${toAddress}`);

    // Map the "to" address to a workspace
    const workspaceResult = await mapToWorkspace(toAddress);
    console.log(
      `[AI Email] mapToWorkspace result:`,
      JSON.stringify(workspaceResult),
    );

    if (!workspaceResult.isValid) {
      console.log(
        `[AI Email] Workspace mapping failed: ${workspaceResult.error}`,
      );
      const errorTemplate = emailTemplates.workspaceNotFound();
      await sendReply(
        email.from,
        errorTemplate.subject,
        errorTemplate.body,
        messageId,
      );
      return NextResponse.json({
        success: true,
        handled: 'workspace_not_found',
      });
    }

    // Track workspaceId for error handling
    workspaceId = workspaceResult.workspaceId;

    // Get sender display name from workspace company info
    const senderDisplayName = getSenderDisplayName(workspaceResult);

    // Extract thread headers for session continuity
    // When user replies, the In-Reply-To header references the previous message
    const inReplyTo =
      email.headers?.['in-reply-to'] || email.headers?.['In-Reply-To'];
    const references =
      email.headers?.['references'] || email.headers?.['References'];

    console.log(
      `[AI Email] Thread headers - In-Reply-To: ${inReplyTo}, References: ${references?.substring(0, 100)}`,
    );

    // Get or create session for this email thread
    const session = await getOrCreateSession({
      senderEmail: email.from,
      threadId: messageId,
      workspaceId: workspaceResult.workspaceId,
      creatorUserId: workspaceResult.workspaceCreatorUserId,
      inReplyTo,
      references,
    });

    // Prepare attachments for native AI processing (PDF, images passed directly to model)
    const preparedAttachments = prepareAttachments(email.attachments);
    const attachmentContentParts =
      buildAttachmentContentParts(preparedAttachments);
    const textAttachmentContent =
      formatTextAttachmentsForAI(preparedAttachments);

    if (preparedAttachments.length > 0) {
      const summary = getAttachmentSummary(preparedAttachments);
      console.log(
        `[AI Email] Prepared ${summary.supported}/${summary.total} attachments (${summary.fileCount} files, ${summary.textCount} text):`,
        preparedAttachments.map((a) => ({
          filename: a.filename,
          supported: a.supported,
          hasFile: !!a.base64Content,
          error: a.error,
        })),
      );
    }

    // Add the user's message to the session (text content only for storage)
    const userMessage: AiEmailMessage = {
      role: 'user',
      content: formatEmailForAI(email, textAttachmentContent),
      timestamp: new Date().toISOString(),
    };
    await addMessageToSession(session.id, userMessage);

    // Prepare reply subject for threading
    const replySubject = getReplySubject(email.subject);

    // Check if this is a simple confirmation reply (YES/NO)
    const confirmationCheck = parseConfirmationReply(email.text);
    if (
      confirmationCheck.isConfirmation &&
      session.state === 'awaiting_confirmation' &&
      session.pendingAction
    ) {
      if (confirmationCheck.confirmed) {
        // User confirmed - send the invoice
        const action = session.pendingAction;
        const invoiceTemplate = emailTemplates.invoiceToRecipient({
          senderName: senderDisplayName,
          amount: action.amount,
          currency: action.currency,
          description: action.description,
          invoiceLink: action.invoiceLink,
          recipientName: action.recipientName,
        });

        let emailSentSuccessfully = false;
        try {
          await sendInvoiceEmail(
            action.recipientEmail,
            invoiceTemplate.subject,
            invoiceTemplate.body,
            senderDisplayName,
          );
          emailSentSuccessfully = true;
        } catch (emailError) {
          console.log(
            '[AI Email] Email send failed, will provide invoice link for manual forwarding:',
            emailError,
          );
        }

        // Choose template based on whether email was sent
        const responseTemplate = emailSentSuccessfully
          ? emailTemplates.invoiceSent({
              recipientEmail: action.recipientEmail,
              recipientName: action.recipientName,
              amount: action.amount,
              currency: action.currency,
              invoiceLink: action.invoiceLink,
            })
          : emailTemplates.invoiceReadyToForward({
              recipientEmail: action.recipientEmail,
              recipientName: action.recipientName,
              amount: action.amount,
              currency: action.currency,
              invoiceLink: action.invoiceLink,
            });

        // Use Re: subject for threading
        await sendReply(
          email.from,
          replySubject,
          responseTemplate.body,
          messageId,
          workspaceResult.workspaceId,
        );

        await updateSession(session.id, {
          state: 'completed',
          pendingAction: null,
        });
      } else {
        // User cancelled
        const cancelledTemplate = emailTemplates.cancelled();
        // Use Re: subject for threading
        await sendReply(
          email.from,
          replySubject,
          cancelledTemplate.body,
          messageId,
          workspaceResult.workspaceId,
        );
        await updateSession(session.id, {
          state: 'completed',
          pendingAction: null,
        });
      }

      return NextResponse.json({ success: true, handled: 'confirmation' });
    }

    // Process with AI for invoice extraction and creation
    const systemPrompt = getSystemPrompt(
      session,
      workspaceResult.workspaceName,
    );

    // Build conversation history (historical messages as text)
    const messages: Array<{
      role: 'user' | 'assistant';
      content:
        | string
        | Array<
            | { type: 'text'; text: string }
            | {
                type: 'file';
                data: Buffer;
                mediaType: string;
                filename?: string;
              }
          >;
    }> = (session.messages || []).map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    // Build current message with native file attachments for AI processing
    const currentMessageContent: Array<
      | { type: 'text'; text: string }
      | { type: 'file'; data: Buffer; mediaType: string; filename?: string }
    > = [
      { type: 'text', text: userMessage.content },
      ...attachmentContentParts,
    ];

    if (
      messages.length === 0 ||
      messages[messages.length - 1].content !== userMessage.content
    ) {
      // If we have file attachments, use multimodal content; otherwise use text
      if (attachmentContentParts.length > 0) {
        messages.push({ role: 'user', content: currentMessageContent });
      } else {
        messages.push({ role: 'user', content: userMessage.content });
      }
    }

    // Create tool context for closures
    const quotedOriginal = formatQuotedMessage(
      email.text || '',
      email.from,
      new Date(),
    );

    const toolContext = {
      session,
      workspaceResult,
      email,
      messageId,
      replySubject,
      quotedOriginal,
    };

    console.log('[AI Email] Starting AI processing with tools...');

    // Define tools using AI SDK 6 pattern
    const aiTools = {
      extractInvoiceDetails: tool({
        description:
          'Extract invoice details from a forwarded email. Call this first to parse the email content.',
        inputSchema: extractInvoiceDetailsSchema,
        execute: async (params) => {
          console.log(
            '[AI Email] Tool: extractInvoiceDetails called with:',
            params,
          );
          await updateSession(toolContext.session.id, {
            extractedData: params,
          });
          return { success: true, extracted: params };
        },
      }),

      createInvoice: tool({
        description:
          'Create a draft invoice in 0 Finance. Call this after extracting details.',
        inputSchema: createInvoiceSchema,
        execute: async (params) => {
          console.log('[AI Email] Tool: createInvoice called with:', params);
          // Include the sender's email so the invoice FROM field shows who created it
          const invoice = await createInvoiceForUser(
            toolContext.workspaceResult.workspaceCreatorUserId,
            toolContext.workspaceResult.workspaceId,
            {
              ...params,
              senderEmail: toolContext.email.from,
            },
          );

          await updateSession(toolContext.session.id, {
            invoiceId: invoice.invoiceId,
          });

          return {
            success: true,
            invoiceId: invoice.invoiceId,
            invoiceLink: invoice.publicLink,
          };
        },
      }),

      requestConfirmation: tool({
        description:
          'Ask the user to confirm before sending the invoice. ALWAYS call this before sending an invoice.',
        inputSchema: requestConfirmationSchema,
        execute: async (params) => {
          console.log(
            '[AI Email] Tool: requestConfirmation called with:',
            params,
          );
          const pendingAction: AiEmailPendingAction = {
            type: 'send_invoice',
            ...params,
          };

          await updateSession(toolContext.session.id, {
            pendingAction,
            state: 'awaiting_confirmation',
          });

          const template = emailTemplates.confirmationRequest(params);
          // Use Re: subject for threading and include quoted original
          await sendReply(
            toolContext.email.from,
            toolContext.replySubject,
            template.body + toolContext.quotedOriginal,
            toolContext.messageId,
            toolContext.workspaceResult.workspaceId,
          );

          return {
            success: true,
            message: 'Confirmation request sent to user',
          };
        },
      }),

      sendReplyToUser: tool({
        description:
          'Send a reply email to the user (not the invoice recipient). Use for general responses. Subject is auto-set to maintain threading.',
        inputSchema: sendReplyToUserSchema,
        execute: async ({ body }) => {
          console.log('[AI Email] Tool: sendReplyToUser called');
          // Use Re: subject for threading and include quoted original
          await sendReply(
            toolContext.email.from,
            toolContext.replySubject,
            body + toolContext.quotedOriginal,
            toolContext.messageId,
            toolContext.workspaceResult.workspaceId,
          );
          return { success: true };
        },
      }),

      sendInvoiceToRecipient: tool({
        description:
          'Send the invoice to the client/recipient. Only use AFTER user confirms with YES.',
        inputSchema: sendInvoiceToRecipientSchema,
        execute: async (params) => {
          console.log(
            '[AI Email] Tool: sendInvoiceToRecipient called with:',
            params,
          );
          const template = emailTemplates.invoiceToRecipient({
            senderName: params.senderName,
            amount: params.amount,
            currency: params.currency,
            description: params.description,
            invoiceLink: params.invoiceLink,
            recipientName: params.recipientName,
          });

          try {
            await sendInvoiceEmail(
              params.recipientEmail,
              template.subject,
              template.body,
              params.senderName,
            );

            await updateSession(toolContext.session.id, {
              state: 'completed',
              pendingAction: null,
            });

            return { success: true, emailSent: true };
          } catch (emailError) {
            // Email sending failed (likely SES verification issue)
            // Return success with the invoice link so user can forward manually
            console.log(
              '[AI Email] Email send failed, returning invoice link for manual forwarding:',
              emailError,
            );

            await updateSession(toolContext.session.id, {
              state: 'completed',
              pendingAction: null,
            });

            return {
              success: true,
              emailSent: false,
              invoiceLink: params.invoiceLink,
              recipientEmail: params.recipientEmail,
              message: `Invoice ready! Forward to ${params.recipientEmail}`,
            };
          }
        },
      }),

      // =========================================================================
      // Transfer Tools
      // =========================================================================

      getBalance: tool({
        description:
          "Get the user's current USDC balance. Returns idle (in Safe), earning (in vaults), and total spendable balance.",
        inputSchema: z.object({}),
        execute: async () => {
          console.log('[AI Email] Tool: getBalance called');
          const result = await getSpendableBalanceByWorkspace(
            toolContext.workspaceResult.workspaceId,
          );
          return result;
        },
      }),

      listSavedBankAccounts: tool({
        description:
          "List user's saved bank accounts that can receive transfers. Returns bank accounts with IDs for use in proposeTransfer.",
        inputSchema: z.object({}),
        execute: async () => {
          console.log('[AI Email] Tool: listSavedBankAccounts called');

          // Get workspace to find owner
          const workspace = await db.query.workspaces.findFirst({
            where: eq(workspaces.id, toolContext.workspaceResult.workspaceId),
          });

          if (!workspace) {
            return {
              error: 'Workspace not found',
              bank_accounts: [],
              count: 0,
            };
          }

          // Get destination bank accounts for transfers
          const bankAccounts = await db
            .select({
              id: userDestinationBankAccounts.id,
              accountName: userDestinationBankAccounts.accountName,
              accountType: userDestinationBankAccounts.accountType,
              bankName: userDestinationBankAccounts.bankName,
              ibanLast4: userDestinationBankAccounts.ibanNumber,
              accountNumberLast4: userDestinationBankAccounts.accountNumber,
            })
            .from(userDestinationBankAccounts)
            .where(eq(userDestinationBankAccounts.userId, workspace.createdBy));

          const sanitized = bankAccounts.map((acc) => ({
            id: acc.id,
            name: acc.accountName || `${acc.bankName || 'Bank'} Account`,
            type: acc.accountType,
            bank_name: acc.bankName,
            last_4:
              acc.ibanLast4?.slice(-4) ||
              acc.accountNumberLast4?.slice(-4) ||
              '****',
          }));

          return {
            bank_accounts: sanitized,
            count: sanitized.length,
          };
        },
      }),

      proposeTransfer: tool({
        description:
          'Propose a bank transfer for user approval. The user must approve this in the 0 Finance dashboard before funds are sent. Use this when the user wants to send money to a bank account.',
        inputSchema: proposeTransferSchema,
        execute: async (params) => {
          console.log('[AI Email] Tool: proposeTransfer called with:', params);

          // Get workspace
          const workspace = await db.query.workspaces.findFirst({
            where: eq(workspaces.id, toolContext.workspaceResult.workspaceId),
          });

          if (!workspace) {
            return { error: 'Workspace not found' };
          }

          if (!workspace.alignCustomerId) {
            return {
              error:
                'KYC not completed. User must complete KYC in the dashboard before transfers.',
            };
          }

          // Get bank account details
          const bankAccount =
            await db.query.userDestinationBankAccounts.findFirst({
              where: and(
                eq(
                  userDestinationBankAccounts.id,
                  params.saved_bank_account_id,
                ),
                eq(userDestinationBankAccounts.userId, workspace.createdBy),
              ),
            });

          if (!bankAccount) {
            return { error: 'Bank account not found' };
          }

          try {
            // Get a quote from Align
            const paymentRails =
              params.destination_currency === 'eur' ? 'sepa' : 'ach';

            const quote = await alignApi.getOfframpQuote(
              workspace.alignCustomerId,
              {
                source_amount: params.amount_usdc,
                source_token: 'usdc',
                source_network: 'base',
                destination_currency: params.destination_currency,
                destination_payment_rails: paymentRails,
              },
            );

            // Build bank account payload for Align
            const alignBankAccount: import('@/server/services/align-api').AlignDestinationBankAccount =
              {
                bank_name: bankAccount.bankName || 'Bank',
                account_holder_type: bankAccount.accountHolderType as
                  | 'individual'
                  | 'business',
                account_holder_address: {
                  country: bankAccount.country || 'US',
                  city: bankAccount.city || '',
                  street_line_1: bankAccount.streetLine1 || '',
                  postal_code: bankAccount.postalCode || '',
                },
                account_type: bankAccount.accountType as 'us' | 'iban',
                ...(bankAccount.accountHolderType === 'individual' && {
                  account_holder_first_name:
                    bankAccount.accountHolderFirstName ?? undefined,
                  account_holder_last_name:
                    bankAccount.accountHolderLastName ?? undefined,
                }),
                ...(bankAccount.accountHolderType === 'business' && {
                  account_holder_business_name:
                    bankAccount.accountHolderBusinessName ?? undefined,
                }),
                ...(bankAccount.accountType === 'us' && {
                  us: {
                    account_number: bankAccount.accountNumber!,
                    routing_number: bankAccount.routingNumber!,
                  },
                }),
                ...(bankAccount.accountType === 'iban' && {
                  iban: {
                    iban_number: bankAccount.ibanNumber!.replace(/\s/g, ''),
                    bic: bankAccount.bicSwift!.replace(/\s/g, ''),
                  },
                }),
              };

            // Create transfer from quote
            const transfer = await alignApi.createTransferFromQuote(
              workspace.alignCustomerId,
              quote.quote_id,
              alignBankAccount,
            );

            // Store in our DB with agent proposal flags
            await db.insert(offrampTransfers).values({
              userId: workspace.createdBy,
              workspaceId: toolContext.workspaceResult.workspaceId,
              alignTransferId: transfer.id,
              status: transfer.status as any,
              amountToSend: params.amount_usdc,
              destinationCurrency: params.destination_currency,
              destinationPaymentRails: paymentRails,
              destinationBankAccountId: params.saved_bank_account_id,
              destinationBankAccountSnapshot: JSON.stringify({
                bankName: bankAccount.bankName,
                accountType: bankAccount.accountType,
                last4:
                  bankAccount.ibanNumber?.slice(-4) ||
                  bankAccount.accountNumber?.slice(-4),
              }),
              depositAmount: transfer.quote.deposit_amount,
              depositToken: transfer.quote.deposit_token,
              depositNetwork: transfer.quote.deposit_network,
              depositAddress: transfer.quote.deposit_blockchain_address,
              feeAmount: transfer.quote.fee_amount,
              quoteExpiresAt: transfer.quote.expires_at
                ? new Date(transfer.quote.expires_at)
                : null,
              // Agent proposal fields
              proposedByAgent: true,
              agentProposalMessage:
                params.reason || 'Proposed via AI Email Agent',
            });

            return {
              success: true,
              proposal_id: transfer.id,
              status: 'pending_user_approval',
              message:
                'Transfer proposed! User must approve in the 0 Finance dashboard.',
              details: {
                amount_usdc: params.amount_usdc,
                destination_currency: params.destination_currency,
                destination_amount: quote.destination_amount,
                fee_usdc: transfer.quote.fee_amount,
                bank_account: bankAccount.bankName,
                expires_at: transfer.quote.expires_at,
              },
            };
          } catch (error) {
            console.error('[AI Email] proposeTransfer error:', error);
            return {
              error: error instanceof Error ? error.message : 'Unknown error',
            };
          }
        },
      }),
    };

    let result;
    try {
      result = await generateText({
        model: openai('gpt-5.2'),
        system: systemPrompt,
        messages,
        tools: aiTools,
        stopWhen: stepCountIs(5), // Allow up to 5 steps for multi-tool execution
      });
    } catch (aiError) {
      console.error('[AI Email] AI processing failed:', aiError);
      throw aiError;
    }

    // Save AI response to session
    if (result.text) {
      const assistantMessage: AiEmailMessage = {
        role: 'assistant',
        content: result.text,
        timestamp: new Date().toISOString(),
      };
      await addMessageToSession(session.id, assistantMessage);
    }

    // Log tool calls for debugging
    const toolCallsMade = result.steps.flatMap(
      (step) => step.toolCalls?.map((tc) => tc.toolName) || [],
    );
    console.log(
      `[AI Email] Processed email. Steps: ${result.steps.length}, Tools called: ${toolCallsMade.join(', ') || 'none'}`,
    );

    // If AI generated text but didn't send a reply via tool, send it now
    const sentReply =
      toolCallsMade.includes('sendReplyToUser') ||
      toolCallsMade.includes('requestConfirmation');

    if (result.text && !sentReply) {
      console.log('[AI Email] Sending AI text response as email');
      // Include quoted original for context
      const quotedOriginal = formatQuotedMessage(
        email.text || '',
        email.from,
        new Date(),
      );
      await sendReply(
        email.from,
        toolContext.replySubject,
        result.text + quotedOriginal,
        messageId,
        workspaceResult.workspaceId,
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[AI Email] Webhook error:', error);

    try {
      if (senderEmail) {
        const errorTemplate = emailTemplates.error(
          error instanceof Error ? error.message : undefined,
        );
        // Maintain thread context - use Re: subject format
        const errorSubject = originalSubject
          ? getReplySubject(originalSubject)
          : errorTemplate.subject;
        await sendReply(
          senderEmail,
          errorSubject,
          errorTemplate.body,
          messageId, // Include In-Reply-To header to maintain thread
          workspaceId, // Use workspace-specific from address
        );
      }
    } catch {
      // Ignore error in error handler
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

/**
 * Handle GET requests (for webhook verification if needed)
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'AI Email Invoice Agent',
    domain: AI_EMAIL_INBOUND_DOMAIN,
  });
}
