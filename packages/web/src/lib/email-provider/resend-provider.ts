import { Resend } from 'resend';
import { Webhook } from 'svix';
import type {
  EmailProvider,
  SendEmailOptions,
  SendEmailResult,
  InboundEmail,
} from './types';

/**
 * Resend webhook event types
 */
interface ResendWebhookEvent {
  type: string;
  created_at: string;
  data: {
    email_id?: string;
    created_at?: string;
    from?: string;
    to?: string[];
    cc?: string[];
    bcc?: string[];
    subject?: string;
    message_id?: string;
    attachments?: Array<{
      id: string;
      filename: string;
      content_type: string;
      content_disposition?: string;
      content_id?: string;
    }>;
    // For sent email events
    id?: string;
    object?: string;
  };
}

/**
 * Resend received email response (from API)
 */
interface ResendReceivedEmail {
  object: string;
  id: string;
  to: string[];
  from: string;
  created_at: string;
  subject: string;
  html: string | null;
  text: string | null;
  headers: Record<string, string>;
  bcc: string[];
  cc: string[];
  reply_to: string[];
  message_id: string;
  attachments: Array<{
    id: string;
    filename: string;
    content_type: string;
    content_disposition?: string;
    content_id?: string;
  }>;
}

/**
 * Resend attachment content response
 */
interface ResendAttachmentContent {
  object: string;
  id: string;
  filename: string;
  content: string; // base64 encoded
  content_type: string;
}

/**
 * Resend Email Provider
 *
 * Uses Resend API for sending and receiving emails.
 * https://resend.com/docs
 *
 * Inbound email flow:
 * 1. Email arrives at your Resend domain (e.g., anything@yourteam.resend.app)
 * 2. Resend sends webhook with type: 'email.received' containing metadata
 * 3. We call Resend API to fetch full email content and attachments
 */
export class ResendProvider implements EmailProvider {
  private client: Resend;
  private webhookSecret?: string;
  private svixWebhook?: Webhook;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is required');
    }
    this.client = new Resend(apiKey);
    this.webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

    // Initialize Svix webhook verifier if secret is provided
    if (this.webhookSecret) {
      this.svixWebhook = new Webhook(this.webhookSecret);
    }
  }

  async send(options: SendEmailOptions): Promise<SendEmailResult> {
    const headers: Record<string, string> = { ...options.headers };
    if (options.replyTo) {
      headers['Reply-To'] = options.replyTo;
    }

    console.log('[ResendProvider] Sending email:', {
      from: options.from,
      to: options.to,
      subject: options.subject,
    });

    const result = await this.client.emails.send({
      from: options.from,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      text: options.text,
      html: options.html,
      headers: Object.keys(headers).length > 0 ? headers : undefined,
    });

    if (result.error) {
      console.error('[ResendProvider] Failed to send email:', result.error);
      throw new Error(result.error.message);
    }

    console.log(
      '[ResendProvider] Email sent successfully, ID:',
      result.data?.id,
    );

    return {
      messageId: result.data?.id || '',
      provider: 'resend',
    };
  }

  /**
   * Parse an inbound email webhook from Resend.
   *
   * Resend webhooks for inbound emails:
   * - type: 'email.received'
   * - data.email_id: ID to fetch full content
   * - data.from, data.to, data.subject: metadata
   *
   * We need to call the Resend API to get the full email content.
   */
  async parseInboundWebhook(
    payload: unknown,
    _headers: Record<string, string>,
  ): Promise<InboundEmail | null> {
    const event = payload as ResendWebhookEvent;

    console.log('[ResendProvider] parseInboundWebhook called');
    console.log('[ResendProvider] Event type:', event.type);

    // Only handle email.received events
    if (event.type !== 'email.received') {
      console.log(
        '[ResendProvider] Ignoring non-email.received event:',
        event.type,
      );
      return null;
    }

    const emailId = event.data.email_id;
    if (!emailId) {
      console.log('[ResendProvider] No email_id in webhook payload');
      return null;
    }

    console.log('[ResendProvider] Fetching full email content for:', emailId);

    // Fetch full email content from Resend API
    const fullEmail = await this.fetchReceivedEmail(emailId);

    if (!fullEmail) {
      console.log(
        '[ResendProvider] Failed to fetch email content, using webhook metadata',
      );
      // Return basic info from webhook if API call fails
      return {
        from: event.data.from || '',
        to: event.data.to || [],
        subject: event.data.subject || '',
        text: '', // No content available
        headers: {},
        messageId: event.data.message_id || emailId,
      };
    }

    // Fetch attachments if present
    const attachments = await this.fetchAttachments(
      emailId,
      fullEmail.attachments,
    );

    console.log('[ResendProvider] Parsed email from:', fullEmail.from);
    console.log('[ResendProvider] Parsed email to:', fullEmail.to);
    console.log('[ResendProvider] Attachments:', attachments.length, 'fetched');

    return {
      from: fullEmail.from,
      to: fullEmail.to,
      subject: fullEmail.subject || '',
      text: fullEmail.text || '',
      html: fullEmail.html || undefined,
      headers: fullEmail.headers || {},
      messageId: fullEmail.message_id || emailId,
      attachments,
    };
  }

  /**
   * Fetch full email content from Resend API
   */
  private async fetchReceivedEmail(
    emailId: string,
  ): Promise<ResendReceivedEmail | null> {
    try {
      // Use direct API call for receiving endpoint
      // The SDK's emails.get() is for sent emails, not received
      const apiResponse = await fetch(
        `https://api.resend.com/emails/receiving/${emailId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
        },
      );

      if (!apiResponse.ok) {
        console.error(
          '[ResendProvider] Failed to fetch received email:',
          apiResponse.status,
          await apiResponse.text(),
        );
        return null;
      }

      return (await apiResponse.json()) as ResendReceivedEmail;
    } catch (error) {
      console.error('[ResendProvider] fetchReceivedEmail error:', error);
      return null;
    }
  }

  /**
   * Fetch attachment content from Resend API
   */
  private async fetchAttachments(
    emailId: string,
    attachmentMeta?: Array<{
      id: string;
      filename: string;
      content_type: string;
    }>,
  ): Promise<
    Array<{
      filename: string;
      content: string;
      contentType: string;
    }>
  > {
    if (!attachmentMeta || attachmentMeta.length === 0) {
      return [];
    }

    const attachments: Array<{
      filename: string;
      content: string;
      contentType: string;
    }> = [];

    for (const meta of attachmentMeta) {
      try {
        // Fetch attachment content from Resend API
        const response = await fetch(
          `https://api.resend.com/emails/receiving/${emailId}/attachments/${meta.id}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            },
          },
        );

        if (!response.ok) {
          console.error(
            `[ResendProvider] Failed to fetch attachment ${meta.id}:`,
            response.status,
          );
          continue;
        }

        const attachmentData =
          (await response.json()) as ResendAttachmentContent;

        attachments.push({
          filename: attachmentData.filename || meta.filename,
          content: attachmentData.content, // base64 encoded
          contentType: attachmentData.content_type || meta.content_type,
        });

        console.log(
          `[ResendProvider] Fetched attachment: ${meta.filename} (${meta.content_type})`,
        );
      } catch (error) {
        console.error(
          `[ResendProvider] Error fetching attachment ${meta.id}:`,
          error,
        );
      }
    }

    return attachments;
  }

  /**
   * Verify webhook signature using Svix (Resend uses Svix for webhooks)
   *
   * Headers required:
   * - svix-id: Unique message ID
   * - svix-timestamp: Unix timestamp
   * - svix-signature: Signature(s)
   */
  async verifyWebhookSignature(
    payload: string,
    headers: Record<string, string>,
  ): Promise<boolean> {
    // If no secret configured, skip verification (development mode)
    if (!this.webhookSecret || !this.svixWebhook) {
      console.log(
        '[ResendProvider] Webhook signature verification skipped (no secret configured)',
      );
      return true;
    }

    const svixId = headers['svix-id'];
    const svixTimestamp = headers['svix-timestamp'];
    const svixSignature = headers['svix-signature'];

    if (!svixId || !svixTimestamp || !svixSignature) {
      console.log('[ResendProvider] Missing Svix webhook headers');
      console.log('[ResendProvider] Headers received:', Object.keys(headers));
      return false;
    }

    try {
      // Use Svix library to verify
      this.svixWebhook.verify(payload, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      });

      console.log('[ResendProvider] Webhook signature verified successfully');
      return true;
    } catch (error) {
      console.error(
        '[ResendProvider] Webhook signature verification failed:',
        error,
      );
      return false;
    }
  }

  /**
   * No special handshake needed for Resend webhooks
   */
  async handleWebhookHandshake(
    _payload: unknown,
    _headers: Record<string, string>,
  ): Promise<{ status: number; body: string } | null> {
    // Resend doesn't require subscription confirmation like SNS
    return null;
  }
}
