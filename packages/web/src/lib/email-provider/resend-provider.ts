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
 * Note: Resend returns a download_url, not inline base64 content
 */
interface ResendAttachmentContent {
  object: string;
  id: string;
  filename: string;
  content_type: string;
  content_id?: string;
  content_disposition?: string;
  size: number;
  download_url: string; // URL to download the actual file content
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
  private _client: Resend | null = null;
  private webhookSecret?: string;
  private svixWebhook?: Webhook;

  constructor() {
    // Lazy initialization - don't throw during build time
    // The client will be initialized on first use
    this.webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

    // Initialize Svix webhook verifier if secret is provided
    if (this.webhookSecret) {
      this.svixWebhook = new Webhook(this.webhookSecret);
    }
  }

  /**
   * Get the Resend client, initializing lazily on first use.
   * This allows the provider to be instantiated during build time
   * without requiring RESEND_API_KEY to be present.
   */
  private get client(): Resend {
    if (!this._client) {
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey) {
        throw new Error('RESEND_API_KEY environment variable is required');
      }
      this._client = new Resend(apiKey);
    }
    return this._client;
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

    // ==========================================================================
    // ATTACHMENT TRACKING: Log webhook payload attachment info
    // ==========================================================================
    const webhookAttachmentCount = event.data.attachments?.length || 0;
    console.log(`[ResendProvider] [ATTACHMENT TRACKING] Webhook payload:`);
    console.log(
      `[ResendProvider] [ATTACHMENT TRACKING]   - email_id: ${event.data.email_id}`,
    );
    console.log(
      `[ResendProvider] [ATTACHMENT TRACKING]   - subject: "${event.data.subject}"`,
    );
    console.log(
      `[ResendProvider] [ATTACHMENT TRACKING]   - attachments in webhook: ${webhookAttachmentCount}`,
    );
    if (webhookAttachmentCount > 0) {
      event.data.attachments?.forEach((att, i) => {
        console.log(
          `[ResendProvider] [ATTACHMENT TRACKING]   - Webhook attachment ${i}: id="${att.id}" filename="${att.filename}" type="${att.content_type}"`,
        );
      });
    }

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

      // Try to fetch attachments using webhook metadata as fallback
      const webhookAttachments = event.data.attachments;
      let attachments: Array<{
        filename: string;
        content: string;
        contentType: string;
      }> = [];

      if (webhookAttachments && webhookAttachments.length > 0) {
        console.log(
          '[ResendProvider] Attempting to fetch attachments from webhook metadata:',
          webhookAttachments.length,
        );
        attachments = await this.fetchAttachments(emailId, webhookAttachments);
      }

      // Return basic info from webhook if API call fails
      return {
        from: event.data.from || '',
        to: event.data.to || [],
        subject: event.data.subject || '',
        text: '', // No content available
        headers: {},
        messageId: event.data.message_id || emailId,
        attachments,
      };
    }

    // Use attachments from full email response, or fall back to webhook metadata
    const attachmentMeta =
      fullEmail.attachments?.length > 0
        ? fullEmail.attachments
        : event.data.attachments;

    // ==========================================================================
    // ATTACHMENT TRACKING: Log which source we're using for attachments
    // ==========================================================================
    const metaSource =
      fullEmail.attachments?.length > 0 ? 'fullEmail API' : 'webhook';
    console.log(
      `[ResendProvider] [ATTACHMENT TRACKING] Attachment metadata decision:`,
    );
    console.log(
      `[ResendProvider] [ATTACHMENT TRACKING]   - fullEmail.attachments count: ${fullEmail.attachments?.length || 0}`,
    );
    console.log(
      `[ResendProvider] [ATTACHMENT TRACKING]   - webhook attachments count: ${event.data.attachments?.length || 0}`,
    );
    console.log(
      `[ResendProvider] [ATTACHMENT TRACKING]   - Using source: ${metaSource}`,
    );
    console.log(
      `[ResendProvider] [ATTACHMENT TRACKING]   - Final attachmentMeta count: ${attachmentMeta?.length || 0}`,
    );

    // Fetch attachments if present
    const attachments = await this.fetchAttachments(emailId, attachmentMeta);

    // ==========================================================================
    // ATTACHMENT TRACKING: Log final fetched attachments
    // ==========================================================================
    console.log(
      `[ResendProvider] [ATTACHMENT TRACKING] After fetchAttachments():`,
    );
    console.log(
      `[ResendProvider] [ATTACHMENT TRACKING]   - Fetched count: ${attachments.length}`,
    );
    if (attachments.length > 0) {
      attachments.forEach((att, i) => {
        console.log(
          `[ResendProvider] [ATTACHMENT TRACKING]   - Fetched ${i}: "${att.filename}" (${att.contentType}, ${att.content.length} chars base64)`,
        );
      });
    } else {
      console.log(
        `[ResendProvider] [ATTACHMENT TRACKING]   - NO ATTACHMENTS FETCHED`,
      );
    }

    console.log('[ResendProvider] Parsed email from:', fullEmail.from);
    console.log('[ResendProvider] Parsed email to:', fullEmail.to);

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
      console.log('[ResendProvider] No attachment metadata to fetch');
      return [];
    }

    console.log(
      `[ResendProvider] Fetching ${attachmentMeta.length} attachments for email ${emailId}`,
    );
    console.log(
      '[ResendProvider] Attachment IDs:',
      attachmentMeta.map((m) => m.id),
    );

    const attachments: Array<{
      filename: string;
      content: string;
      contentType: string;
    }> = [];

    for (const meta of attachmentMeta) {
      try {
        const url = `https://api.resend.com/emails/receiving/${emailId}/attachments/${meta.id}`;
        console.log(`[ResendProvider] Fetching attachment from: ${url}`);

        // Fetch attachment content from Resend API
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(
            `[ResendProvider] Failed to fetch attachment ${meta.id}:`,
            response.status,
            errorText,
          );
          continue;
        }

        const attachmentData =
          (await response.json()) as ResendAttachmentContent;

        if (!attachmentData.download_url) {
          console.error(
            `[ResendProvider] Attachment ${meta.id} has no download_url`,
          );
          console.log(
            '[ResendProvider] Attachment response:',
            JSON.stringify(attachmentData).substring(0, 500),
          );
          continue;
        }

        // Download the actual file content from the signed URL
        console.log(
          `[ResendProvider] Downloading attachment from: ${attachmentData.download_url.substring(0, 100)}...`,
        );
        const fileResponse = await fetch(attachmentData.download_url);

        if (!fileResponse.ok) {
          console.error(
            `[ResendProvider] Failed to download attachment ${meta.id}:`,
            fileResponse.status,
          );
          continue;
        }

        // Convert to base64
        const arrayBuffer = await fileResponse.arrayBuffer();
        const base64Content = Buffer.from(arrayBuffer).toString('base64');

        attachments.push({
          filename: attachmentData.filename || meta.filename,
          content: base64Content,
          contentType: attachmentData.content_type || meta.content_type,
        });

        console.log(
          `[ResendProvider] Successfully fetched attachment: ${meta.filename} (${meta.content_type}, ${base64Content.length} chars base64, ${attachmentData.size} bytes)`,
        );
      } catch (error) {
        console.error(
          `[ResendProvider] Error fetching attachment ${meta.id}:`,
          error,
        );
      }
    }

    console.log(
      `[ResendProvider] Total attachments fetched: ${attachments.length}/${attachmentMeta.length}`,
    );
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
