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
  transactionAttachments,
} from '@/db/schema';
import { eq, and, desc, isNull, or, ilike } from 'drizzle-orm';
import { alignApi } from '@/server/services/align-api';
import { put } from '@vercel/blob';
import type { PreparedAttachment } from '@/lib/ai-email/attachment-parser';

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

/**
 * Store email attachments for an invoice in Vercel Blob and database.
 * Called after invoice creation to persist forwarded documents.
 */
async function storeInvoiceAttachments(
  invoiceId: string,
  workspaceId: string,
  preparedAttachments: PreparedAttachment[],
): Promise<number> {
  const supportedAttachments = preparedAttachments.filter(
    (a) => a.supported && a.base64Content,
  );

  if (supportedAttachments.length === 0) {
    return 0;
  }

  let storedCount = 0;

  for (const attachment of supportedAttachments) {
    try {
      // Convert base64 to buffer
      const fileBuffer = Buffer.from(attachment.base64Content!, 'base64');

      // Upload to Vercel Blob with workspace-scoped path
      const blob = await put(
        `attachments/invoice/${invoiceId}/${attachment.filename}`,
        fileBuffer,
        {
          access: 'public',
          contentType: attachment.contentType,
          addRandomSuffix: true,
        },
      );

      // Store metadata in database
      await db.insert(transactionAttachments).values({
        transactionType: 'invoice',
        transactionId: invoiceId,
        workspaceId,
        blobUrl: blob.url,
        filename: attachment.filename,
        contentType: attachment.contentType,
        fileSize: fileBuffer.length,
        uploadedBy: 'system:ai-email',
        uploadSource: 'ai_email',
      });

      storedCount++;
      console.log(
        `[AI Email] Stored attachment: ${attachment.filename} for invoice ${invoiceId}`,
      );
    } catch (error) {
      console.error(
        `[AI Email] Failed to store attachment ${attachment.filename}:`,
        error,
      );
      // Continue with other attachments even if one fails
    }
  }

  return storedCount;
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

    // Check if this is a simple confirmation reply (YES/NO/A/B/C)
    const confirmationCheck = parseConfirmationReply(email.text);
    if (
      confirmationCheck.isConfirmation &&
      session.state === 'awaiting_confirmation' &&
      session.pendingAction
    ) {
      const action = session.pendingAction;

      // Handle invoice confirmation
      if (action.type === 'send_invoice') {
        if (confirmationCheck.confirmed) {
          // User confirmed - send the invoice
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

      // Handle attachment confirmation (attach_document or remove_attachment)
      // These are handled by the AI tools, so let the AI process the reply
      // The AI will check the pending action and handle A/B/C selection
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
      preparedAttachments, // Include attachments for invoice creation
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

          // Store email attachments (PDFs, images) with the invoice
          if (toolContext.preparedAttachments.length > 0) {
            const storedCount = await storeInvoiceAttachments(
              invoice.invoiceId,
              toolContext.workspaceResult.workspaceId,
              toolContext.preparedAttachments,
            );
            console.log(
              `[AI Email] Stored ${storedCount} attachments for invoice ${invoice.invoiceId}`,
            );
          }

          return {
            success: true,
            invoiceId: invoice.invoiceId,
            invoiceLink: invoice.publicLink,
            attachmentsStored: toolContext.preparedAttachments.filter(
              (a) => a.supported && a.base64Content,
            ).length,
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
                bank_name: bankAccount.bankName,
                account_type: bankAccount.accountType,
                account_holder_type: bankAccount.accountHolderType,
                account_holder_first_name: bankAccount.accountHolderFirstName,
                account_holder_last_name: bankAccount.accountHolderLastName,
                account_holder_business_name:
                  bankAccount.accountHolderBusinessName,
                us:
                  bankAccount.accountType === 'us'
                    ? {
                        account_number: bankAccount.accountNumber,
                        routing_number: bankAccount.routingNumber,
                      }
                    : undefined,
                iban:
                  bankAccount.accountType === 'iban'
                    ? {
                        iban_number: bankAccount.ibanNumber,
                        bic: bankAccount.bicSwift,
                      }
                    : undefined,
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

      // =========================================================================
      // Attachment Tools
      // =========================================================================

      findTransaction: tool({
        description:
          "Search user's transaction history to find a specific transaction. Returns best match and alternatives. Use this when user wants to attach a document to a transaction or asks about a specific payment.",
        inputSchema: z.object({
          searchQuery: z
            .string()
            .optional()
            .describe(
              'Search query - recipient name, amount, or description (e.g., "Acme", "$500", "consulting")',
            ),
          amount: z.number().optional().describe('Approximate amount to match'),
          recipientName: z
            .string()
            .optional()
            .describe('Recipient name to match (fuzzy)'),
          dateRange: z
            .enum(['last_week', 'last_month', 'last_3_months', 'all'])
            .optional()
            .default('last_month')
            .describe('Date range to search'),
        }),
        execute: async (params) => {
          console.log('[AI Email] Tool: findTransaction called with:', params);

          // Get workspace
          const workspace = await db.query.workspaces.findFirst({
            where: eq(workspaces.id, toolContext.workspaceResult.workspaceId),
          });

          if (!workspace) {
            return { error: 'Workspace not found', transactions: [] };
          }

          // Calculate date filter
          const now = new Date();
          let dateFilter: Date | null = null;
          switch (params.dateRange) {
            case 'last_week':
              dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              break;
            case 'last_month':
              dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
              break;
            case 'last_3_months':
              dateFilter = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
              break;
            default:
              dateFilter = null;
          }

          // Query offramp transfers
          const transfers = await db
            .select({
              id: offrampTransfers.id,
              alignTransferId: offrampTransfers.alignTransferId,
              amount: offrampTransfers.amountToSend,
              currency: offrampTransfers.destinationCurrency,
              status: offrampTransfers.status,
              bankAccountSnapshot:
                offrampTransfers.destinationBankAccountSnapshot,
              createdAt: offrampTransfers.createdAt,
            })
            .from(offrampTransfers)
            .where(
              and(
                eq(
                  offrampTransfers.workspaceId,
                  toolContext.workspaceResult.workspaceId,
                ),
                eq(offrampTransfers.status, 'completed'),
              ),
            )
            .orderBy(desc(offrampTransfers.createdAt))
            .limit(50);

          // Score and rank transactions
          type ScoredTransaction = {
            id: string;
            type: 'offramp';
            amount: string;
            currency: string;
            recipientName?: string;
            recipientBank?: string;
            date: string;
            score: number;
          };

          const scoredTransactions: ScoredTransaction[] = transfers
            .filter((tx) => {
              if (dateFilter && tx.createdAt < dateFilter) return false;
              return true;
            })
            .map((tx) => {
              let score = 0;
              const snapshot = tx.bankAccountSnapshot as Record<
                string,
                unknown
              > | null;
              const recipientName =
                (snapshot?.account_holder_first_name as string) ||
                (snapshot?.account_holder_business_name as string) ||
                '';
              const bankName = (snapshot?.bank_name as string) || '';

              // Score by recipient name match
              if (params.recipientName && recipientName) {
                const searchLower = params.recipientName.toLowerCase();
                const nameLower = recipientName.toLowerCase();
                if (
                  nameLower.includes(searchLower) ||
                  searchLower.includes(nameLower)
                ) {
                  score += 50;
                }
              }

              // Score by search query match
              if (params.searchQuery) {
                const queryLower = params.searchQuery.toLowerCase();
                if (recipientName.toLowerCase().includes(queryLower))
                  score += 40;
                if (bankName.toLowerCase().includes(queryLower)) score += 20;
                if (tx.amount.includes(params.searchQuery)) score += 30;
              }

              // Score by amount match
              if (params.amount) {
                const txAmount = parseFloat(tx.amount);
                const diff = Math.abs(txAmount - params.amount) / params.amount;
                if (diff < 0.05)
                  score += 40; // Within 5%
                else if (diff < 0.1)
                  score += 20; // Within 10%
                else if (diff < 0.2) score += 10; // Within 20%
              }

              // Recency bonus
              const daysAgo =
                (now.getTime() - tx.createdAt.getTime()) /
                (24 * 60 * 60 * 1000);
              if (daysAgo < 7) score += 10;
              else if (daysAgo < 30) score += 5;

              return {
                id: tx.id,
                type: 'offramp' as const,
                amount: tx.amount,
                currency: tx.currency.toUpperCase(),
                recipientName: recipientName || undefined,
                recipientBank: bankName || undefined,
                date: tx.createdAt.toISOString().split('T')[0],
                score,
              };
            })
            .sort((a, b) => b.score - a.score);

          if (scoredTransactions.length === 0) {
            return {
              found: false,
              message: 'No matching transactions found',
              transactions: [],
            };
          }

          const bestMatch = scoredTransactions[0];
          const alternatives = scoredTransactions.slice(1, 4); // Up to 3 alternatives

          return {
            found: true,
            bestMatch,
            alternatives,
            totalFound: scoredTransactions.length,
          };
        },
      }),

      attachDocumentToTransaction: tool({
        description:
          'Attach a document (from the email) to a transaction. ALWAYS requires user confirmation. Shows best match and alternatives for user to choose.',
        inputSchema: z.object({
          transactionId: z
            .string()
            .describe('Transaction ID to attach to (from findTransaction)'),
          transactionType: z
            .enum(['offramp', 'crypto_outgoing', 'crypto_incoming'])
            .default('offramp')
            .describe('Type of transaction'),
          attachmentIndex: z
            .number()
            .default(0)
            .describe('Index of attachment from email (0 = first attachment)'),
        }),
        execute: async (params) => {
          console.log(
            '[AI Email] Tool: attachDocumentToTransaction called with:',
            params,
          );

          // Check if we have attachments
          if (toolContext.preparedAttachments.length === 0) {
            return {
              error: 'No attachments found in this email',
              success: false,
            };
          }

          const attachment =
            toolContext.preparedAttachments[params.attachmentIndex];
          if (
            !attachment ||
            !attachment.supported ||
            !attachment.base64Content
          ) {
            return {
              error: `Attachment at index ${params.attachmentIndex} not found or not supported`,
              success: false,
            };
          }

          // Find the transaction to get details for confirmation
          const result = await (async () => {
            if (params.transactionType === 'offramp') {
              const tx = await db.query.offrampTransfers.findFirst({
                where: and(
                  eq(offrampTransfers.id, params.transactionId),
                  eq(
                    offrampTransfers.workspaceId,
                    toolContext.workspaceResult.workspaceId,
                  ),
                ),
              });
              if (!tx) return null;

              const snapshot = tx.destinationBankAccountSnapshot as Record<
                string,
                unknown
              > | null;
              return {
                id: tx.id,
                type: 'offramp' as const,
                amount: tx.amountToSend,
                currency: tx.destinationCurrency.toUpperCase(),
                recipientName:
                  (snapshot?.account_holder_first_name as string) ||
                  (snapshot?.account_holder_business_name as string) ||
                  undefined,
                date: tx.createdAt.toISOString().split('T')[0],
                score: 100,
              };
            }
            return null;
          })();

          if (!result) {
            return {
              error: 'Transaction not found',
              success: false,
            };
          }

          // Find alternatives (other recent transactions)
          const alternatives = await (async () => {
            const transfers = await db
              .select({
                id: offrampTransfers.id,
                amount: offrampTransfers.amountToSend,
                currency: offrampTransfers.destinationCurrency,
                bankAccountSnapshot:
                  offrampTransfers.destinationBankAccountSnapshot,
                createdAt: offrampTransfers.createdAt,
              })
              .from(offrampTransfers)
              .where(
                and(
                  eq(
                    offrampTransfers.workspaceId,
                    toolContext.workspaceResult.workspaceId,
                  ),
                  eq(offrampTransfers.status, 'completed'),
                ),
              )
              .orderBy(desc(offrampTransfers.createdAt))
              .limit(5);

            return transfers
              .filter((tx) => tx.id !== params.transactionId)
              .slice(0, 3)
              .map((tx) => {
                const snapshot = tx.bankAccountSnapshot as Record<
                  string,
                  unknown
                > | null;
                return {
                  id: tx.id,
                  type: 'offramp' as const,
                  amount: tx.amount,
                  currency: tx.currency.toUpperCase(),
                  recipientName:
                    (snapshot?.account_holder_first_name as string) ||
                    (snapshot?.account_holder_business_name as string) ||
                    undefined,
                  date: tx.createdAt.toISOString().split('T')[0],
                  score: 50,
                };
              });
          })();

          // Upload attachment to Vercel Blob IMMEDIATELY so it persists across confirmation round-trip
          // This is critical: when user replies "YES", the reply email has no attachment
          const fileBuffer = Buffer.from(attachment.base64Content, 'base64');
          const tempBlobPath = `attachments/temp/${toolContext.session.id}/${attachment.filename}`;

          console.log(
            `[AI Email] Uploading attachment to temp blob: ${tempBlobPath}`,
          );
          const tempBlob = await put(tempBlobPath, fileBuffer, {
            access: 'public',
            contentType: attachment.contentType,
            addRandomSuffix: true,
          });
          console.log(`[AI Email] Uploaded to: ${tempBlob.url}`);

          // Store pending action with blob URL (not attachment index)
          const pendingAction: AiEmailPendingAction = {
            type: 'attach_document',
            bestMatch: result,
            alternatives,
            tempBlobUrl: tempBlob.url, // Persisted in Vercel Blob
            attachmentFilename: attachment.filename,
            attachmentContentType: attachment.contentType,
            attachmentSize: fileBuffer.length,
          };

          await updateSession(toolContext.session.id, {
            pendingAction,
            state: 'awaiting_confirmation',
          });

          // Format file size
          const fileSizeKB = Math.round(fileBuffer.length / 1024);
          const fileSize =
            fileSizeKB > 1024
              ? `${(fileSizeKB / 1024).toFixed(1)} MB`
              : `${fileSizeKB} KB`;

          // Send confirmation email
          const template = emailTemplates.attachmentConfirmation({
            filename: attachment.filename,
            fileSize,
            bestMatch: {
              amount: result.amount,
              currency: result.currency,
              recipientName: result.recipientName,
              date: result.date,
            },
            alternatives: alternatives.map((alt, i) => ({
              label: String.fromCharCode(65 + i), // A, B, C
              amount: alt.amount,
              currency: alt.currency,
              recipientName: alt.recipientName,
              date: alt.date,
            })),
          });

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
            awaitingConfirmation: true,
          };
        },
      }),

      attachAllDocuments: tool({
        description:
          'Smart attach ALL email attachments to matching transactions. Reads each file, extracts vendor/amount/date, and matches to the best transaction. Use this when user sends multiple attachments or says "attach these" without specifying which transaction. ALWAYS requires user confirmation.',
        inputSchema: z.object({
          searchHint: z
            .string()
            .optional()
            .describe(
              'Optional hint from user about which transactions to match (e.g., "Acme", "last week")',
            ),
        }),
        execute: async (params) => {
          console.log(
            '[AI Email] Tool: attachAllDocuments called with:',
            params,
          );

          const supportedAttachments = toolContext.preparedAttachments.filter(
            (a) => a.supported && a.base64Content,
          );

          if (supportedAttachments.length === 0) {
            return {
              error: 'No supported attachments found in this email',
              success: false,
            };
          }

          // Get recent transactions to match against
          const transfers = await db
            .select({
              id: offrampTransfers.id,
              amount: offrampTransfers.amountToSend,
              currency: offrampTransfers.destinationCurrency,
              bankAccountSnapshot:
                offrampTransfers.destinationBankAccountSnapshot,
              createdAt: offrampTransfers.createdAt,
            })
            .from(offrampTransfers)
            .where(
              and(
                eq(
                  offrampTransfers.workspaceId,
                  toolContext.workspaceResult.workspaceId,
                ),
                eq(offrampTransfers.status, 'completed'),
              ),
            )
            .orderBy(desc(offrampTransfers.createdAt))
            .limit(20);

          if (transfers.length === 0) {
            return {
              error: 'No completed transactions found to attach to',
              success: false,
            };
          }

          // Build transaction list with recipient info
          const transactionList = transfers.map((tx) => {
            const snapshot = tx.bankAccountSnapshot as Record<
              string,
              unknown
            > | null;
            return {
              id: tx.id,
              type: 'offramp' as const,
              amount: tx.amount,
              currency: tx.currency.toUpperCase(),
              recipientName:
                (snapshot?.account_holder_first_name as string) ||
                (snapshot?.account_holder_business_name as string) ||
                (snapshot?.bank_name as string) ||
                undefined,
              date: tx.createdAt.toISOString().split('T')[0],
              score: 0,
            };
          });

          // Upload ALL attachments to Vercel Blob IMMEDIATELY
          // This is critical: when user replies "YES", the reply email has no attachments
          console.log(
            `[AI Email] Uploading ${supportedAttachments.length} attachments to temp blob storage`,
          );

          const matches: Array<{
            tempBlobUrl: string;
            filename: string;
            contentType: string;
            fileSize: number;
            transaction: (typeof transactionList)[0];
          }> = [];

          for (let i = 0; i < supportedAttachments.length; i++) {
            const attachment = supportedAttachments[i];

            // Find best matching transaction (not already used)
            const usedTxIds = matches.map((m) => m.transaction.id);
            const availableTx = transactionList.find(
              (tx) => !usedTxIds.includes(tx.id),
            );

            if (availableTx) {
              // Upload to temp blob storage
              const fileBuffer = Buffer.from(
                attachment.base64Content!,
                'base64',
              );
              const tempBlobPath = `attachments/temp/${toolContext.session.id}/${attachment.filename}`;

              const tempBlob = await put(tempBlobPath, fileBuffer, {
                access: 'public',
                contentType: attachment.contentType,
                addRandomSuffix: true,
              });
              console.log(
                `[AI Email] Uploaded ${attachment.filename} to: ${tempBlob.url}`,
              );

              matches.push({
                tempBlobUrl: tempBlob.url,
                filename: attachment.filename,
                contentType: attachment.contentType,
                fileSize: fileBuffer.length,
                transaction: availableTx,
              });
            }
          }

          if (matches.length === 0) {
            return {
              error: 'Could not match any attachments to transactions',
              success: false,
            };
          }

          // Store pending action with blob URLs (not attachment indices)
          const pendingAction: AiEmailPendingAction = {
            type: 'attach_multiple',
            matches: matches.map((m) => ({
              tempBlobUrl: m.tempBlobUrl,
              filename: m.filename,
              contentType: m.contentType,
              fileSize: m.fileSize,
              transaction: { ...m.transaction, score: 100 },
            })),
          };

          await updateSession(toolContext.session.id, {
            pendingAction,
            state: 'awaiting_confirmation',
          });

          // Format file sizes
          const formatSize = (bytes: number) => {
            if (bytes > 1024 * 1024)
              return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
            return `${Math.round(bytes / 1024)} KB`;
          };

          // Send confirmation email
          const template = emailTemplates.multiAttachmentConfirmation({
            matches: matches.map((m) => ({
              filename: m.filename,
              fileSize: formatSize(m.fileSize),
              transaction: m.transaction,
            })),
          });

          await sendReply(
            toolContext.email.from,
            toolContext.replySubject,
            template.body + toolContext.quotedOriginal,
            toolContext.messageId,
            toolContext.workspaceResult.workspaceId,
          );

          return {
            success: true,
            message: `Matched ${matches.length} attachments to transactions, awaiting confirmation`,
            matchCount: matches.length,
            awaitingConfirmation: true,
          };
        },
      }),

      confirmMultipleAttachments: tool({
        description:
          'Complete attaching multiple documents after user confirms with YES. Call this when user replies YES to a multi-attachment confirmation.',
        inputSchema: z.object({}),
        execute: async () => {
          console.log('[AI Email] Tool: confirmMultipleAttachments called');

          const pendingAction = toolContext.session.pendingAction;
          if (!pendingAction || pendingAction.type !== 'attach_multiple') {
            return {
              error: 'No pending multi-attachment to confirm',
              success: false,
            };
          }

          const results: Array<{
            filename: string;
            success: boolean;
            error?: string;
          }> = [];

          for (const match of pendingAction.matches) {
            // Attachment was already uploaded to temp blob storage when user first sent the email
            // Now we just need to create the DB record pointing to it
            // The tempBlobUrl is already a permanent Vercel Blob URL

            if (!match.tempBlobUrl) {
              results.push({
                filename: match.filename,
                success: false,
                error: 'Attachment blob URL not found in pending action',
              });
              continue;
            }

            try {
              // Store in database - file is already in Vercel Blob from initial upload
              await db.insert(transactionAttachments).values({
                transactionType: match.transaction.type,
                transactionId: match.transaction.id,
                workspaceId: toolContext.workspaceResult.workspaceId,
                blobUrl: match.tempBlobUrl, // Already uploaded during attachAllDocuments
                filename: match.filename,
                contentType: match.contentType,
                fileSize: match.fileSize,
                uploadedBy: 'system:ai-email',
                uploadSource: 'ai_email',
              });

              results.push({ filename: match.filename, success: true });
              console.log(
                `[AI Email] Attached ${match.filename} to ${match.transaction.id} (using pre-uploaded blob)`,
              );
            } catch (error) {
              console.error(
                `[AI Email] Failed to attach ${match.filename}:`,
                error,
              );
              results.push({
                filename: match.filename,
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
              });
            }
          }

          // Clear pending action
          await updateSession(toolContext.session.id, {
            state: 'completed',
            pendingAction: null,
          });

          const successCount = results.filter((r) => r.success).length;
          const successFiles = results
            .filter((r) => r.success)
            .map((r) => r.filename);

          // Send success email
          const template = emailTemplates.multiAttachmentSuccess({
            count: successCount,
            files: successFiles,
          });

          await sendReply(
            toolContext.email.from,
            toolContext.replySubject,
            template.body,
            toolContext.messageId,
            toolContext.workspaceResult.workspaceId,
          );

          return {
            success: true,
            message: `Attached ${successCount}/${pendingAction.matches.length} files`,
            results,
          };
        },
      }),

      confirmAttachment: tool({
        description:
          'Complete the attachment after user confirms. Call this when user replies YES or picks an alternative (A/B/C) to a pending attachment.',
        inputSchema: z.object({
          selection: z
            .enum(['yes', 'a', 'b', 'c'])
            .describe(
              'User selection: "yes" for best match, or "a"/"b"/"c" for alternatives',
            ),
        }),
        execute: async (params) => {
          console.log(
            '[AI Email] Tool: confirmAttachment called with:',
            params,
          );

          const pendingAction = toolContext.session.pendingAction;
          if (!pendingAction || pendingAction.type !== 'attach_document') {
            return {
              error: 'No pending attachment to confirm',
              success: false,
            };
          }

          // Determine which transaction to attach to
          let targetTransaction = pendingAction.bestMatch;
          if (params.selection !== 'yes') {
            const altIndex = params.selection.charCodeAt(0) - 97; // 'a' = 0, 'b' = 1, 'c' = 2
            if (altIndex >= 0 && altIndex < pendingAction.alternatives.length) {
              targetTransaction = pendingAction.alternatives[altIndex];
            } else {
              return {
                error: `Invalid selection: ${params.selection}`,
                success: false,
              };
            }
          }

          // Attachment was already uploaded to temp blob storage when user first sent the email
          // The tempBlobUrl is stored in the pending action
          if (!pendingAction.tempBlobUrl) {
            return {
              error: 'Attachment blob URL not found in pending action',
              success: false,
            };
          }

          try {
            // Store in database - file is already in Vercel Blob from initial upload
            await db.insert(transactionAttachments).values({
              transactionType: targetTransaction.type,
              transactionId: targetTransaction.id,
              workspaceId: toolContext.workspaceResult.workspaceId,
              blobUrl: pendingAction.tempBlobUrl, // Already uploaded during attachDocumentToTransaction
              filename: pendingAction.attachmentFilename,
              contentType: pendingAction.attachmentContentType,
              fileSize: pendingAction.attachmentSize,
              uploadedBy: 'system:ai-email',
              uploadSource: 'ai_email',
            });

            // Clear pending action
            await updateSession(toolContext.session.id, {
              state: 'completed',
              pendingAction: null,
            });

            // Send success email
            const template = emailTemplates.attachmentSuccess({
              filename: pendingAction.attachmentFilename,
              amount: targetTransaction.amount,
              currency: targetTransaction.currency,
              recipientName: targetTransaction.recipientName,
              date: targetTransaction.date,
            });

            await sendReply(
              toolContext.email.from,
              toolContext.replySubject,
              template.body,
              toolContext.messageId,
              toolContext.workspaceResult.workspaceId,
            );

            return {
              success: true,
              message: `Attached ${pendingAction.attachmentFilename} to ${targetTransaction.currency} ${targetTransaction.amount} payment`,
              attachmentUrl: pendingAction.tempBlobUrl,
            };
          } catch (error) {
            console.error('[AI Email] confirmAttachment error:', error);
            return {
              error:
                error instanceof Error
                  ? error.message
                  : 'Failed to attach document',
              success: false,
            };
          }
        },
      }),

      listAttachments: tool({
        description:
          "List attachments on a transaction or search for attachments across user's transactions.",
        inputSchema: z.object({
          transactionId: z
            .string()
            .optional()
            .describe('Specific transaction ID to list attachments for'),
          transactionType: z
            .enum(['offramp', 'crypto_outgoing', 'crypto_incoming', 'invoice'])
            .optional()
            .describe('Type of transaction'),
          searchQuery: z.string().optional().describe('Search by filename'),
        }),
        execute: async (params) => {
          console.log('[AI Email] Tool: listAttachments called with:', params);

          const conditions = [
            eq(
              transactionAttachments.workspaceId,
              toolContext.workspaceResult.workspaceId,
            ),
            isNull(transactionAttachments.deletedAt),
          ];

          if (params.transactionId) {
            conditions.push(
              eq(transactionAttachments.transactionId, params.transactionId),
            );
          }
          if (params.transactionType) {
            conditions.push(
              eq(
                transactionAttachments.transactionType,
                params.transactionType,
              ),
            );
          }

          const attachments = await db
            .select()
            .from(transactionAttachments)
            .where(and(...conditions))
            .orderBy(desc(transactionAttachments.createdAt))
            .limit(20);

          // Filter by search query if provided
          const filtered = params.searchQuery
            ? attachments.filter((a) =>
                a.filename
                  .toLowerCase()
                  .includes(params.searchQuery!.toLowerCase()),
              )
            : attachments;

          return {
            attachments: filtered.map((a) => ({
              id: a.id,
              filename: a.filename,
              contentType: a.contentType,
              fileSize: a.fileSize,
              transactionId: a.transactionId,
              transactionType: a.transactionType,
              uploadedAt: a.createdAt.toISOString(),
              uploadSource: a.uploadSource,
            })),
            count: filtered.length,
          };
        },
      }),

      removeAttachment: tool({
        description:
          'Remove an attachment from a transaction. Requires user confirmation.',
        inputSchema: z.object({
          attachmentId: z
            .string()
            .uuid()
            .describe('ID of the attachment to remove'),
        }),
        execute: async (params) => {
          console.log('[AI Email] Tool: removeAttachment called with:', params);

          // Find the attachment
          const [attachment] = await db
            .select()
            .from(transactionAttachments)
            .where(
              and(
                eq(transactionAttachments.id, params.attachmentId),
                eq(
                  transactionAttachments.workspaceId,
                  toolContext.workspaceResult.workspaceId,
                ),
                isNull(transactionAttachments.deletedAt),
              ),
            )
            .limit(1);

          if (!attachment) {
            return {
              error: 'Attachment not found',
              success: false,
            };
          }

          // Get transaction details
          let transactionDetails: {
            id: string;
            type: 'offramp' | 'crypto_outgoing' | 'crypto_incoming';
            amount: string;
            currency: string;
            recipientName?: string;
            date: string;
            score: number;
          } | null = null;

          if (attachment.transactionType === 'offramp') {
            const tx = await db.query.offrampTransfers.findFirst({
              where: eq(offrampTransfers.id, attachment.transactionId),
            });
            if (tx) {
              const snapshot = tx.destinationBankAccountSnapshot as Record<
                string,
                unknown
              > | null;
              transactionDetails = {
                id: tx.id,
                type: 'offramp',
                amount: tx.amountToSend,
                currency: tx.destinationCurrency.toUpperCase(),
                recipientName:
                  (snapshot?.account_holder_first_name as string) ||
                  (snapshot?.account_holder_business_name as string) ||
                  undefined,
                date: tx.createdAt.toISOString().split('T')[0],
                score: 100,
              };
            }
          }

          if (!transactionDetails) {
            transactionDetails = {
              id: attachment.transactionId,
              type: attachment.transactionType as
                | 'offramp'
                | 'crypto_outgoing'
                | 'crypto_incoming',
              amount: 'Unknown',
              currency: 'USD',
              date: attachment.createdAt.toISOString().split('T')[0],
              score: 100,
            };
          }

          // Find other attachments as alternatives
          const otherAttachments = await db
            .select()
            .from(transactionAttachments)
            .where(
              and(
                eq(
                  transactionAttachments.workspaceId,
                  toolContext.workspaceResult.workspaceId,
                ),
                isNull(transactionAttachments.deletedAt),
              ),
            )
            .orderBy(desc(transactionAttachments.createdAt))
            .limit(5);

          const alternatives = otherAttachments
            .filter((a) => a.id !== params.attachmentId)
            .slice(0, 3)
            .map((a) => ({
              id: a.id,
              filename: a.filename,
              contentType: a.contentType,
              fileSize: a.fileSize,
              blobUrl: a.blobUrl,
              transaction: {
                id: a.transactionId,
                type: a.transactionType as
                  | 'offramp'
                  | 'crypto_outgoing'
                  | 'crypto_incoming',
                amount: 'Unknown',
                currency: 'USD',
                recipientName: undefined as string | undefined,
                date: a.createdAt.toISOString().split('T')[0],
                score: 50,
              },
            }));

          // Store pending action
          const pendingAction: AiEmailPendingAction = {
            type: 'remove_attachment',
            bestMatch: {
              id: attachment.id,
              filename: attachment.filename,
              contentType: attachment.contentType,
              fileSize: attachment.fileSize,
              blobUrl: attachment.blobUrl,
              transaction: transactionDetails,
            },
            alternatives,
          };

          await updateSession(toolContext.session.id, {
            pendingAction,
            state: 'awaiting_confirmation',
          });

          // Send confirmation email
          const template = emailTemplates.removeAttachmentConfirmation({
            filename: attachment.filename,
            amount: transactionDetails.amount,
            currency: transactionDetails.currency,
            recipientName: transactionDetails.recipientName,
            date: transactionDetails.date,
            alternatives: alternatives.map((alt, i) => ({
              label: String.fromCharCode(65 + i),
              filename: alt.filename,
              amount: alt.transaction.amount,
              currency: alt.transaction.currency,
              recipientName: alt.transaction.recipientName,
              date: alt.transaction.date,
            })),
          });

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
            awaitingConfirmation: true,
          };
        },
      }),

      confirmRemoveAttachment: tool({
        description:
          'Complete the attachment removal after user confirms. Call this when user replies YES or picks an alternative (A/B/C).',
        inputSchema: z.object({
          selection: z
            .enum(['yes', 'a', 'b', 'c'])
            .describe(
              'User selection: "yes" for best match, or "a"/"b"/"c" for alternatives',
            ),
        }),
        execute: async (params) => {
          console.log(
            '[AI Email] Tool: confirmRemoveAttachment called with:',
            params,
          );

          const pendingAction = toolContext.session.pendingAction;
          if (!pendingAction || pendingAction.type !== 'remove_attachment') {
            return {
              error: 'No pending removal to confirm',
              success: false,
            };
          }

          // Determine which attachment to remove
          let targetAttachment = pendingAction.bestMatch;
          if (params.selection !== 'yes') {
            const altIndex = params.selection.charCodeAt(0) - 97;
            if (altIndex >= 0 && altIndex < pendingAction.alternatives.length) {
              targetAttachment = pendingAction.alternatives[altIndex];
            } else {
              return {
                error: `Invalid selection: ${params.selection}`,
                success: false,
              };
            }
          }

          try {
            // Soft delete the attachment
            await db
              .update(transactionAttachments)
              .set({ deletedAt: new Date() })
              .where(eq(transactionAttachments.id, targetAttachment.id));

            // Clear pending action
            await updateSession(toolContext.session.id, {
              state: 'completed',
              pendingAction: null,
            });

            // Send success email
            const template = emailTemplates.removeAttachmentSuccess({
              filename: targetAttachment.filename,
              amount: targetAttachment.transaction.amount,
              currency: targetAttachment.transaction.currency,
              recipientName: targetAttachment.transaction.recipientName,
            });

            await sendReply(
              toolContext.email.from,
              toolContext.replySubject,
              template.body,
              toolContext.messageId,
              toolContext.workspaceResult.workspaceId,
            );

            return {
              success: true,
              message: `Removed ${targetAttachment.filename}`,
            };
          } catch (error) {
            console.error('[AI Email] confirmRemoveAttachment error:', error);
            return {
              error:
                error instanceof Error
                  ? error.message
                  : 'Failed to remove attachment',
              success: false,
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
  const providerType = (process.env.EMAIL_PROVIDER || 'resend').trim();
  return NextResponse.json({
    status: 'ok',
    service: 'AI Email Invoice Agent',
    domain: AI_EMAIL_INBOUND_DOMAIN,
    provider: providerType,
    providerConfigured:
      providerType === 'resend'
        ? !!process.env.RESEND_API_KEY
        : !!(
            process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
          ),
  });
}
