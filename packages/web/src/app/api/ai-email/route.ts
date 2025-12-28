import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { openai } from '@/lib/ai/providers';
import { headers } from 'next/headers';
import crypto from 'crypto';

import {
  mapToWorkspace,
  formatEmailForAI,
  getOrCreateSession,
  addMessageToSession,
  emailTemplates,
  AI_EMAIL_INBOUND_DOMAIN,
} from '@/lib/ai-email';
import type { AiEmailMessage } from '@/db/schema/ai-email-sessions';
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

// Simple system prompt for testing basic email responses
const SIMPLE_SYSTEM_PROMPT = `You are 0 Finance AI, a helpful assistant for 0 Finance users.
You're receiving emails from users and should respond helpfully.
Keep responses concise and friendly.
If the user asks about invoices, let them know that invoice creation is coming soon.
For now, just have a helpful conversation.`;

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

    const snsMessageType = headersObj['x-amz-sns-message-type'];
    console.log('[AI Email] Received request, content-type:', contentType);
    console.log('[AI Email] x-amz-sns-message-type:', snsMessageType);
    console.log('[AI Email] Body preview:', rawBody.substring(0, 200));

    // Handle SNS messages based on x-amz-sns-message-type header
    // AWS SNS sends JSON with Content-Type: text/plain and uses this header to indicate message type
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
      // Some requests come as form-urlencoded (not standard SNS)
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

      // If this looks like an AWS API call (has Action parameter), acknowledge it
      if (formData.Action) {
        console.log(
          '[AI Email] Received AWS API-style request, Action:',
          formData.Action,
        );
        return NextResponse.json({ message: 'Acknowledged' }, { status: 200 });
      }
    } else {
      // Standard JSON payload (including SNS Notification messages)
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
    console.log(`[AI Email] Full email.to value:`, JSON.stringify(email.to));

    // 1. Map the "to" address to a workspace
    console.log(`[AI Email] Calling mapToWorkspace with: "${toAddress}"`);
    const workspaceResult = await mapToWorkspace(toAddress);
    console.log(
      `[AI Email] mapToWorkspace result:`,
      JSON.stringify(workspaceResult),
    );

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

    // 4. Process with AI (simplified - no tools for now)

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

    console.log('[AI Email] Starting AI processing (simple mode, no tools)...');
    console.log(
      '[AI Email] OPENAI_API_KEY present:',
      !!process.env.OPENAI_API_KEY,
    );

    let result;
    try {
      result = await generateText({
        model: openai('gpt-4o'),
        system: SIMPLE_SYSTEM_PROMPT,
        messages,
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

    console.log('[AI Email] Processed email successfully');
    console.log(
      `[AI Email] AI response text: ${result.text?.substring(0, 200)}`,
    );

    // Send the AI response back to the user
    if (result.text) {
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
