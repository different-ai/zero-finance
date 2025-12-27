/**
 * Email Provider Abstraction
 *
 * Allows switching between email providers (Resend, SES, etc.) via environment variable.
 * This is useful for:
 * - Failover when a provider suspends your account
 * - Testing with different providers
 * - Cost optimization
 */

export interface SendEmailOptions {
  from: string;
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  headers?: Record<string, string>;
  replyTo?: string;
}

export interface SendEmailResult {
  messageId: string;
  provider: 'resend' | 'ses';
}

export interface InboundEmail {
  from: string;
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  headers: Record<string, string>;
  messageId: string;
  attachments?: Array<{
    filename: string;
    content: string; // base64
    contentType: string;
  }>;
}

export interface EmailProvider {
  /**
   * Send an email
   */
  send(options: SendEmailOptions): Promise<SendEmailResult>;

  /**
   * Parse an inbound email webhook payload
   * Returns null if the payload is not a valid email (e.g., SNS subscription confirmation)
   */
  parseInboundWebhook(
    payload: unknown,
    headers: Record<string, string>,
  ): Promise<InboundEmail | null>;

  /**
   * Verify webhook signature
   * Returns true if valid, false if invalid
   */
  verifyWebhookSignature(
    payload: string,
    headers: Record<string, string>,
  ): Promise<boolean>;

  /**
   * Handle any provider-specific webhook handshakes (e.g., SNS subscription confirmation)
   * Returns a response to send back, or null if no special handling needed
   */
  handleWebhookHandshake?(
    payload: unknown,
    headers: Record<string, string>,
  ): Promise<{ status: number; body: string } | null>;
}

export type EmailProviderType = 'resend' | 'ses';
