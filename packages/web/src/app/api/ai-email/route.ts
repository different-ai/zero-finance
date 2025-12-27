import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
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

const resend = new Resend(process.env.RESEND_API_KEY);

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
 * Verify Resend webhook signature (if configured)
 * https://resend.com/docs/dashboard/webhooks/verify-webhooks
 */
async function verifyWebhookSignature(
  request: NextRequest,
  rawBody: string,
): Promise<boolean> {
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

  // If no secret configured, skip verification (development mode)
  if (!webhookSecret) {
    console.log(
      '[AI Email] Webhook signature verification skipped (no secret configured)',
    );
    return true;
  }

  const headersList = await headers();
  const signature = headersList.get('svix-signature');
  const timestamp = headersList.get('svix-timestamp');
  const svixId = headersList.get('svix-id');

  if (!signature || !timestamp || !svixId) {
    console.log('[AI Email] Missing webhook signature headers');
    return false;
  }

  // Verify timestamp is recent (within 5 minutes)
  const timestampNum = parseInt(timestamp, 10);
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestampNum) > 300) {
    console.log('[AI Email] Webhook timestamp too old');
    return false;
  }

  // Verify signature using HMAC-SHA256
  const signedPayload = `${svixId}.${timestamp}.${rawBody}`;
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(signedPayload)
    .digest('base64');

  // Signature header contains multiple signatures separated by space
  const signatures = signature.split(' ');
  const isValid = signatures.some((sig) => {
    const [, sigValue] = sig.split(',');
    return sigValue === expectedSignature;
  });

  if (!isValid) {
    console.log('[AI Email] Invalid webhook signature');
  }

  return isValid;
}

/**
 * Resend inbound email payload type.
 * https://resend.com/docs/dashboard/webhooks/event-types#emailreceived
 */
interface ResendInboundEmail {
  from: string;
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  headers: Record<string, string>;
  attachments?: Array<{
    filename: string;
    content: string; // base64
    content_type: string;
  }>;
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
  const headers: Record<string, string> = {};
  if (inReplyTo) {
    headers['In-Reply-To'] = inReplyTo;
    headers['References'] = inReplyTo;
  }

  await resend.emails.send({
    from: `0 Finance AI <ai@${AI_EMAIL_INBOUND_DOMAIN}>`,
    to,
    subject,
    text: body,
    headers,
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
 * Receives inbound emails from Resend and processes them using AI.
 */
export async function POST(request: NextRequest) {
  let rawBody = '';
  let senderEmail = '';

  try {
    // Read raw body for signature verification
    rawBody = await request.text();

    // Verify webhook signature
    const isValidSignature = await verifyWebhookSignature(request, rawBody);
    if (!isValidSignature) {
      console.log('[AI Email] Webhook signature verification failed');
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 },
      );
    }

    // Parse the webhook payload
    const payload = JSON.parse(rawBody);

    // For inbound emails, the payload structure is the email directly
    const email = payload as ResendInboundEmail;

    // Validate we have the required fields
    if (!email.from || !email.to || !email.text) {
      console.log('[AI Email] Invalid payload - missing required fields');
      return NextResponse.json(
        { error: 'Invalid email payload' },
        { status: 400 },
      );
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
    const messageId =
      email.headers?.['Message-ID'] ||
      email.headers?.['message-id'] ||
      crypto.randomUUID();

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

        await resend.emails.send({
          from: `${workspaceResult.workspaceName} via 0 Finance <invoices@${AI_EMAIL_INBOUND_DOMAIN}>`,
          to: action.recipientEmail,
          subject: invoiceTemplate.subject,
          text: invoiceTemplate.body,
        });

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

            await resend.emails.send({
              from: `${params.senderName} via 0 Finance <invoices@${AI_EMAIL_INBOUND_DOMAIN}>`,
              to: params.recipientEmail,
              subject: template.subject,
              text: template.body,
            });

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
