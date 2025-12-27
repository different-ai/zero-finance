import { Resend } from 'resend';
import crypto from 'crypto';
import type {
  EmailProvider,
  SendEmailOptions,
  SendEmailResult,
  InboundEmail,
} from './types';

/**
 * Resend Email Provider
 *
 * Uses Resend API for sending and receiving emails.
 * https://resend.com/docs
 */
export class ResendProvider implements EmailProvider {
  private client: Resend;
  private webhookSecret?: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is required');
    }
    this.client = new Resend(apiKey);
    this.webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
  }

  async send(options: SendEmailOptions): Promise<SendEmailResult> {
    const headers: Record<string, string> = { ...options.headers };
    if (options.replyTo) {
      headers['Reply-To'] = options.replyTo;
    }

    const result = await this.client.emails.send({
      from: options.from,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      text: options.text,
      html: options.html,
      headers: Object.keys(headers).length > 0 ? headers : undefined,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return {
      messageId: result.data?.id || '',
      provider: 'resend',
    };
  }

  async parseInboundWebhook(
    payload: unknown,
    _headers: Record<string, string>,
  ): Promise<InboundEmail | null> {
    // Resend sends the email directly in the webhook payload
    const email = payload as {
      from: string;
      to: string | string[];
      subject: string;
      text: string;
      html?: string;
      headers: Record<string, string>;
      attachments?: Array<{
        filename: string;
        content: string;
        content_type: string;
      }>;
    };

    if (!email.from || !email.to || !email.text) {
      return null;
    }

    const messageId =
      email.headers?.['Message-ID'] ||
      email.headers?.['message-id'] ||
      crypto.randomUUID();

    return {
      from: email.from,
      to: email.to,
      subject: email.subject || '',
      text: email.text,
      html: email.html,
      headers: email.headers || {},
      messageId,
      attachments: email.attachments?.map((att) => ({
        filename: att.filename,
        content: att.content,
        contentType: att.content_type,
      })),
    };
  }

  async verifyWebhookSignature(
    payload: string,
    headers: Record<string, string>,
  ): Promise<boolean> {
    // If no secret configured, skip verification (development mode)
    if (!this.webhookSecret) {
      console.log(
        '[ResendProvider] Webhook signature verification skipped (no secret configured)',
      );
      return true;
    }

    const signature = headers['svix-signature'];
    const timestamp = headers['svix-timestamp'];
    const svixId = headers['svix-id'];

    if (!signature || !timestamp || !svixId) {
      console.log('[ResendProvider] Missing webhook signature headers');
      return false;
    }

    // Verify timestamp is recent (within 5 minutes)
    const timestampNum = parseInt(timestamp, 10);
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - timestampNum) > 300) {
      console.log('[ResendProvider] Webhook timestamp too old');
      return false;
    }

    // Verify signature using HMAC-SHA256
    const signedPayload = `${svixId}.${timestamp}.${payload}`;
    const expectedSignature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(signedPayload)
      .digest('base64');

    // Signature header contains multiple signatures separated by space
    const signatures = signature.split(' ');
    const isValid = signatures.some((sig) => {
      const [, sigValue] = sig.split(',');
      return sigValue === expectedSignature;
    });

    if (!isValid) {
      console.log('[ResendProvider] Invalid webhook signature');
    }

    return isValid;
  }
}
