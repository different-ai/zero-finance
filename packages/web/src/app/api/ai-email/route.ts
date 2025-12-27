import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
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
import {
  getEmailProviderSingleton,
  type InboundEmail,
} from '@/lib/email-provider';

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
    // Create new record or reset
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
 */
async function sendReply(
  to: string,
  subject: string,
  body: string,
  inReplyTo?: string,
): Promise<void> {
  const emailHeaders: Record<string, string> = {};
  if (inReplyTo) {
    emailHeaders['In-Reply-To'] = inReplyTo;
    emailHeaders['References'] = inReplyTo;
  }

  await emailProvider.send({
    from: `0 Finance AI <ai@${AI_EMAIL_INBOUND_DOMAIN}>`,
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

// Tool parameter schemas
const extractInvoiceDetailsSchema = z.object({
  recipientEmail: z.string().describe('Email address of the invoice recipient'),
  recipientName: z.string().optional().describe('Name of the recipient'),
  recipientCompany: z
    .string()
    .optional()
    .describe('Company name of the recipient'),
  amount: z.number().describe('Invoice amount as a number'),
  currency: z
    .string()
    .default('USD')
    .describe('Currency code (USD, EUR, etc.)'),
  description: z.string().describe('Description of the work/service'),
});

const createInvoiceSchema = z.object({
  recipientEmail: z.string(),
  recipientName: z.string().optional(),
  recipientCompany: z.string().optional(),
  amount: z.number(),
  currency: z.string(),
  description: z.string(),
});

const requestConfirmationSchema = z.object({
  invoiceId: z.string(),
  recipientEmail: z.string(),
  recipientName: z.string().optional(),
  amount: z.number(),
  currency: z.string(),
  description: z.string(),
  invoiceLink: z.string(),
});

const sendReplyToUserSchema = z.object({
  subject: z.string(),
  body: z.string(),
});

const sendInvoiceToRecipientSchema = z.object({
  recipientEmail: z.string(),
  recipientName: z.string().optional(),
  invoiceLink: z.string(),
  senderName: z.string(),
  amount: z.number(),
  currency: z.string(),
  description: z.string(),
});

/**
 * AI Email Webhook Handler
 *
 * Receives inbound emails from the configured email provider (SES or Resend)
 * and processes them using AI.
 */
export async function POST(request: NextRequest) {
  let rawBody = '';
  let senderEmail = '';

  try {
    // Read raw body for signature verification
    rawBody = await request.text();
    const headersObj = await getHeadersObject();
    const contentType = headersObj['content-type'] || '';

    console.log('[AI Email] Received request, content-type:', contentType);
    console.log('[AI Email] Body preview:', rawBody.substring(0, 200));

    // Parse the payload based on content type
    let payload: unknown;

    if (contentType.includes('application/x-www-form-urlencoded')) {
      // SNS sometimes sends form-urlencoded data for subscription confirmation
      // Parse as URL search params and convert to object
      const params = new URLSearchParams(rawBody);
      const formData: Record<string, string> = {};
      params.forEach((value, key) => {
        formData[key] = value;
      });

      // Check if this is an SNS message embedded in form data
      if (formData.Message) {
        try {
          payload = JSON.parse(formData.Message);
        } catch {
          payload = formData;
        }
      } else {
        payload = formData;
      }
      console.log(
        '[AI Email] Parsed form-urlencoded payload:',
        Object.keys(formData),
      );
    } else {
      // Standard JSON payload
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

    // Check if this is an SNS subscription confirmation (form-urlencoded format)
    // AWS sends form data with Action=ConfirmSubscription or Action=Subscribe
    const formPayload = payload as Record<string, string>;
    if (
      formPayload.Action === 'ConfirmSubscription' ||
      formPayload.Action === 'Subscribe'
    ) {
      console.log(
        '[AI Email] Received SNS subscription request via form-urlencoded',
      );
      // For form-urlencoded subscription requests, we just acknowledge
      // The actual subscription is handled by AWS when we return 200
      return NextResponse.json(
        { message: 'Subscription acknowledged' },
        { status: 200 },
      );
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

    // Parse inbound email using the provider's parser
    const email = await emailProvider.parseInboundWebhook(payload, headersObj);

    // If no email returned (e.g., non-email notification), acknowledge and return
    if (!email) {
      console.log('[AI Email] No email in payload (non-email notification)');
      return NextResponse.json({ success: true, handled: 'no_email' });
    }

    // Store sender for error handling
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
    const messageId = email.messageId || crypto.randomUUID();

    console.log(`[AI Email] Received email from ${email.from} to ${toAddress}`);

    // 1. Map the "to" address to a workspace
    const workspaceResult = await mapToWorkspace(toAddress);

    if (!workspaceResult.isValid) {
      console.log(
        `[AI Email] Workspace mapping failed: ${workspaceResult.error}`,
      );

      // Send error reply to user
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

    // 2. Get or create session for this email thread
    const session = await getOrCreateSession({
      senderEmail: email.from,
      threadId: messageId,
      workspaceId: workspaceResult.workspaceId,
      creatorUserId: workspaceResult.workspaceCreatorUserId,
    });

    // 3. Add the user's message to the session
    const userMessage: AiEmailMessage = {
      role: 'user',
      content: formatEmailForAI(email),
      timestamp: new Date().toISOString(),
    };
    await addMessageToSession(session.id, userMessage);

    // 4. Check if this is a simple confirmation reply
    const confirmationCheck = parseConfirmationReply(email.text);
    if (
      confirmationCheck.isConfirmation &&
      session.state === 'awaiting_confirmation' &&
      session.pendingAction
    ) {
      // Handle confirmation without AI
      if (confirmationCheck.confirmed) {
        // Send the invoice
        const action = session.pendingAction;
        const invoiceTemplate = emailTemplates.invoiceToRecipient({
          senderName: workspaceResult.workspaceName,
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
          workspaceResult.workspaceName,
        );

        // Confirm to user
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
        );

        // Update session
        await updateSession(session.id, {
          state: 'completed',
          pendingAction: null,
        });
      } else {
        // Cancelled
        const cancelledTemplate = emailTemplates.cancelled();
        await sendReply(
          email.from,
          cancelledTemplate.subject,
          cancelledTemplate.body,
          messageId,
        );

        await updateSession(session.id, {
          state: 'completed',
          pendingAction: null,
        });
      }

      return NextResponse.json({ success: true, handled: 'confirmation' });
    }

    // 5. Process with AI for complex requests
    const systemPrompt = getSystemPrompt(
      session,
      workspaceResult.workspaceName,
    );

    // Build conversation history for AI
    const messages = (session.messages || []).map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    // Add current message if not already in history
    if (
      messages.length === 0 ||
      messages[messages.length - 1].content !== userMessage.content
    ) {
      messages.push({
        role: 'user',
        content: userMessage.content,
      });
    }

    // Create tool execution context
    const toolContext = {
      session,
      workspaceResult,
      email,
      messageId,
    };

    const result = await generateText({
      model: openai('gpt-4o'),
      system: systemPrompt,
      messages,
      tools: {
        extractInvoiceDetails: {
          description: 'Extract invoice details from a forwarded email',
          inputSchema: extractInvoiceDetailsSchema,
          execute: async (
            params: z.infer<typeof extractInvoiceDetailsSchema>,
          ) => {
            await updateSession(toolContext.session.id, {
              extractedData: params,
            });
            return { success: true, extracted: params };
          },
        },

        createInvoice: {
          description: 'Create a draft invoice in 0 Finance',
          inputSchema: createInvoiceSchema,
          execute: async (params: z.infer<typeof createInvoiceSchema>) => {
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
        },

        requestConfirmation: {
          description:
            'Ask the user to confirm before sending the invoice. Always use this before sending.',
          inputSchema: requestConfirmationSchema,
          execute: async (
            params: z.infer<typeof requestConfirmationSchema>,
          ) => {
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
            );

            return {
              success: true,
              message: 'Confirmation request sent to user',
            };
          },
        },

        sendReplyToUser: {
          description:
            'Send a reply email to the user (not the invoice recipient)',
          inputSchema: sendReplyToUserSchema,
          execute: async ({
            subject,
            body,
          }: z.infer<typeof sendReplyToUserSchema>) => {
            await sendReply(
              toolContext.email.from,
              subject,
              body,
              toolContext.messageId,
            );
            return { success: true };
          },
        },

        sendInvoiceToRecipient: {
          description:
            'Send the invoice link to the client/recipient. Only use after user confirms.',
          inputSchema: sendInvoiceToRecipientSchema,
          execute: async (
            params: z.infer<typeof sendInvoiceToRecipientSchema>,
          ) => {
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
        },
      },
    });

    // 6. Save AI response to session
    if (result.text) {
      const assistantMessage: AiEmailMessage = {
        role: 'assistant',
        content: result.text,
        timestamp: new Date().toISOString(),
      };
      await addMessageToSession(session.id, assistantMessage);
    }

    console.log(
      `[AI Email] Processed email successfully. Steps: ${result.steps.length}`,
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[AI Email] Webhook error:', error);

    // Try to send error reply if we have sender info
    try {
      // We have senderEmail in outer scope if it was parsed successfully
      if (senderEmail) {
        const errorTemplate = emailTemplates.error(
          error instanceof Error ? error.message : undefined,
        );
        await sendReply(senderEmail, errorTemplate.subject, errorTemplate.body);
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
