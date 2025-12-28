import { NextRequest, NextResponse } from 'next/server';
import { generateText, tool, stepCountIs } from 'ai';
import { openai } from '@/lib/ai/providers';
import { z } from 'zod';
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
import type {
  AiEmailMessage,
  AiEmailPendingAction,
} from '@/db/schema/ai-email-sessions';
import { getEmailProviderSingleton } from '@/lib/email-provider';

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
 */
const sendReplyToUserSchema = z.object({
  subject: z.string().describe('Email subject line'),
  body: z.string().describe('Email body text'),
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

    // Get or create session for this email thread
    const session = await getOrCreateSession({
      senderEmail: email.from,
      threadId: messageId,
      workspaceId: workspaceResult.workspaceId,
      creatorUserId: workspaceResult.workspaceCreatorUserId,
    });

    // Add the user's message to the session
    const userMessage: AiEmailMessage = {
      role: 'user',
      content: formatEmailForAI(email),
      timestamp: new Date().toISOString(),
    };
    await addMessageToSession(session.id, userMessage);

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

        await sendInvoiceEmail(
          action.recipientEmail,
          invoiceTemplate.subject,
          invoiceTemplate.body,
          senderDisplayName,
        );

        const sentTemplate = emailTemplates.invoiceSent({
          recipientEmail: action.recipientEmail,
          recipientName: action.recipientName,
          amount: action.amount,
          currency: action.currency,
          invoiceLink: action.invoiceLink,
        });
        await sendReply(
          email.from,
          sentTemplate.subject,
          sentTemplate.body,
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
        await sendReply(
          email.from,
          cancelledTemplate.subject,
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

    // Build conversation history
    const messages = (session.messages || []).map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    if (
      messages.length === 0 ||
      messages[messages.length - 1].content !== userMessage.content
    ) {
      messages.push({ role: 'user', content: userMessage.content });
    }

    // Create tool context for closures
    const toolContext = {
      session,
      workspaceResult,
      email,
      messageId,
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
          const invoice = await createInvoiceForUser(
            toolContext.workspaceResult.workspaceCreatorUserId,
            toolContext.workspaceResult.workspaceId,
            params,
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
          await sendReply(
            toolContext.email.from,
            template.subject,
            template.body,
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
          'Send a reply email to the user (not the invoice recipient). Use for general responses.',
        inputSchema: sendReplyToUserSchema,
        execute: async ({ subject, body }) => {
          console.log('[AI Email] Tool: sendReplyToUser called');
          await sendReply(
            toolContext.email.from,
            subject,
            body,
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

          return { success: true };
        },
      }),
    };

    let result;
    try {
      result = await generateText({
        model: openai('gpt-4o'),
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
      await sendReply(
        email.from,
        `Re: ${email.subject || 'Your message'}`,
        result.text,
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
        // Maintain thread context by including messageId and workspaceId
        await sendReply(
          senderEmail,
          errorTemplate.subject,
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
