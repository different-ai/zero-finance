import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { simpleParser } from 'mailparser';
import type { AddressObject, Attachment } from 'mailparser';
import crypto from 'crypto';
import type {
  EmailProvider,
  SendEmailOptions,
  SendEmailResult,
  InboundEmail,
} from './types';

/**
 * AWS SES Email Provider
 *
 * Uses AWS SES for sending emails and SNS for receiving inbound emails.
 * https://docs.aws.amazon.com/ses/latest/dg/Welcome.html
 *
 * Inbound email flow:
 * Email → SES Receipt Rule → SNS Topic → HTTPS POST to webhook
 */
export class SESProvider implements EmailProvider {
  private client: SESClient;
  private region: string;

  constructor() {
    this.region = process.env.AWS_REGION || 'us-east-1';

    this.client = new SESClient({
      region: this.region,
      credentials: process.env.AWS_ACCESS_KEY_ID
        ? {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
          }
        : undefined, // Use default credential chain (IAM role, etc.)
    });
  }

  async send(options: SendEmailOptions): Promise<SendEmailResult> {
    const toAddresses = Array.isArray(options.to) ? options.to : [options.to];

    console.log('[SESProvider] Sending email:', {
      from: options.from,
      to: toAddresses,
      subject: options.subject,
    });

    const command = new SendEmailCommand({
      Source: options.from,
      Destination: {
        ToAddresses: toAddresses,
      },
      Message: {
        Subject: {
          Data: options.subject,
          Charset: 'UTF-8',
        },
        Body: {
          Text: {
            Data: options.text,
            Charset: 'UTF-8',
          },
          ...(options.html && {
            Html: {
              Data: options.html,
              Charset: 'UTF-8',
            },
          }),
        },
      },
      ReplyToAddresses: options.replyTo ? [options.replyTo] : undefined,
    });

    try {
      const result = await this.client.send(command);
      console.log(
        '[SESProvider] Email sent successfully, MessageId:',
        result.MessageId,
      );
      return {
        messageId: result.MessageId || '',
        provider: 'ses',
      };
    } catch (error) {
      console.error('[SESProvider] Failed to send email:', error);
      throw error;
    }
  }

  async parseInboundWebhook(
    payload: unknown,
    _headers: Record<string, string>,
  ): Promise<InboundEmail | null> {
    const snsMessage = payload as {
      Type: string;
      Message: string;
      MessageId: string;
    };

    console.log('[SESProvider] parseInboundWebhook called');
    console.log('[SESProvider] SNS Message Type:', snsMessage.Type);

    // Handle SNS subscription confirmation (handled separately)
    if (snsMessage.Type === 'SubscriptionConfirmation') {
      return null;
    }

    // Handle actual notification
    if (snsMessage.Type !== 'Notification') {
      console.log('[SESProvider] Unknown SNS message type:', snsMessage.Type);
      return null;
    }

    // Parse the SES notification from SNS message
    let sesNotification: {
      notificationType: string;
      content: string;
      receipt: {
        recipients: string[]; // The actual envelope RCPT TO addresses
      };
      mail: {
        messageId: string;
        source: string;
        destination: string[];
        commonHeaders: {
          from: string[];
          to: string[];
          subject: string;
          messageId: string;
        };
      };
    };

    try {
      sesNotification = JSON.parse(snsMessage.Message);
      console.log(
        '[SESProvider] Parsed SES notification type:',
        sesNotification.notificationType,
      );
      console.log(
        '[SESProvider] SES receipt.recipients (envelope RCPT TO):',
        sesNotification.receipt?.recipients,
      );
      console.log(
        '[SESProvider] SES mail.destination:',
        sesNotification.mail?.destination,
      );
      console.log(
        '[SESProvider] SES mail.commonHeaders.to:',
        sesNotification.mail?.commonHeaders?.to,
      );
      console.log(
        '[SESProvider] SES mail.source:',
        sesNotification.mail?.source,
      );
      console.log(
        '[SESProvider] Has content:',
        !!sesNotification.content,
        'length:',
        sesNotification.content?.length,
      );
    } catch (err) {
      console.log('[SESProvider] Failed to parse SNS message:', err);
      return null;
    }

    // Only handle received emails
    if (sesNotification.notificationType !== 'Received') {
      console.log(
        '[SESProvider] Ignoring notification type:',
        sesNotification.notificationType,
      );
      return null;
    }

    // Parse the raw email content (MIME format)
    const rawEmail = sesNotification.content;
    const parsedEmail = await this.parseRawEmail(rawEmail);

    // ALWAYS use receipt.recipients as the authoritative "to" address
    // This is the envelope RCPT TO which contains the actual destination
    // The MIME "to" header might be different (e.g., display name or alias)
    const authoritativeToAddresses =
      sesNotification.receipt?.recipients ||
      sesNotification.mail?.destination ||
      [];

    console.log(
      '[SESProvider] Authoritative to (receipt.recipients):',
      authoritativeToAddresses,
    );

    if (!parsedEmail) {
      // Fallback to headers if MIME parsing fails
      console.log(
        '[SESProvider] MIME parsing failed, using fallback from mail headers',
      );
      const mail = sesNotification.mail;
      const fallbackEmail = {
        from: mail.commonHeaders.from?.[0] || mail.source,
        to: authoritativeToAddresses,
        subject: mail.commonHeaders.subject || '',
        text: rawEmail, // Raw content as fallback
        headers: {},
        messageId: mail.messageId,
      };
      console.log('[SESProvider] Fallback email from:', fallbackEmail.from);
      console.log('[SESProvider] Fallback email to:', fallbackEmail.to);
      return fallbackEmail;
    }

    // Always override the MIME "to" with receipt.recipients
    parsedEmail.to = authoritativeToAddresses;

    console.log('[SESProvider] Parsed email from:', parsedEmail.from);
    console.log('[SESProvider] Parsed email to:', parsedEmail.to);
    return parsedEmail;
  }

  /**
   * Parse raw MIME email content
   * Uses mailparser library
   */
  private async parseRawEmail(rawEmail: string): Promise<InboundEmail | null> {
    try {
      const parsed = await simpleParser(rawEmail);

      // Extract 'from' address
      let from = '';
      if (parsed.from?.value?.[0]) {
        const fromAddr = parsed.from.value[0];
        from = fromAddr.address || '';
      }

      // Extract 'to' addresses
      let to: string[] = [];
      if (parsed.to) {
        const toValue: AddressObject[] = Array.isArray(parsed.to)
          ? parsed.to
          : [parsed.to];
        to = toValue.flatMap((t: AddressObject) =>
          t.value
            .map((addr: { address?: string }) => addr.address || '')
            .filter(Boolean),
        );
      }

      // Extract headers
      const headers: Record<string, string> = {};
      if (parsed.headers) {
        parsed.headers.forEach((value: string | object, key: string) => {
          headers[key] = typeof value === 'string' ? value : String(value);
        });
      }

      return {
        from,
        to,
        subject: parsed.subject || '',
        text: parsed.text || '',
        html: parsed.html || undefined,
        headers,
        messageId: parsed.messageId || crypto.randomUUID(),
        attachments: parsed.attachments?.map((att: Attachment) => ({
          filename: att.filename || 'attachment',
          content: att.content.toString('base64'),
          contentType: att.contentType || 'application/octet-stream',
        })),
      };
    } catch (error) {
      console.log('[SESProvider] Failed to parse raw email:', error);
      return null;
    }
  }

  /**
   * Build the string to sign for SNS message verification.
   * Fields must be in alphabetical order and only include fields that exist.
   */
  private buildStringToSign(message: Record<string, unknown>): string {
    // Keys that can be signed, in alphabetical order
    const signableKeysNotification = [
      'Message',
      'MessageId',
      'Subject',
      'SubscribeURL',
      'Timestamp',
      'TopicArn',
      'Type',
    ];
    const signableKeysSubscription = [
      'Message',
      'MessageId',
      'Subject',
      'SubscribeURL',
      'Timestamp',
      'Token',
      'TopicArn',
      'Type',
    ];

    const keys =
      message.Type === 'Notification'
        ? signableKeysNotification
        : signableKeysSubscription;

    let stringToSign = '';
    for (const key of keys) {
      // CRITICAL: Only include keys that exist and are not null/undefined
      if (key in message && message[key] != null) {
        stringToSign += key + '\n' + message[key] + '\n';
      }
    }
    return stringToSign;
  }

  async verifyWebhookSignature(
    payload: string,
    _headers: Record<string, string>,
  ): Promise<boolean> {
    try {
      const message = JSON.parse(payload) as {
        Type: string;
        SignatureVersion: string;
        Signature: string;
        SigningCertURL: string;
        Message: string;
        MessageId: string;
        Timestamp: string;
        TopicArn: string;
        Subject?: string;
        SubscribeURL?: string;
        Token?: string;
      };

      // Verify the signing cert URL is from AWS
      const certUrl = new URL(message.SigningCertURL);
      if (
        !certUrl.hostname.endsWith('.amazonaws.com') ||
        certUrl.protocol !== 'https:'
      ) {
        console.log('[SESProvider] Invalid signing cert URL:', certUrl.href);
        return false;
      }

      // Build the string to sign (alphabetical order, only existing fields)
      const stringToSign = this.buildStringToSign(
        message as unknown as Record<string, unknown>,
      );

      // Fetch the certificate
      const cert = await this.fetchCertificate(message.SigningCertURL);

      // Use correct algorithm based on SignatureVersion
      const algorithm =
        message.SignatureVersion === '2' ? 'RSA-SHA256' : 'RSA-SHA1';
      const verifier = crypto.createVerify(algorithm);
      verifier.update(stringToSign, 'utf8');
      const isValid = verifier.verify(cert, message.Signature, 'base64');

      if (!isValid) {
        console.log('[SESProvider] Invalid SNS signature');
        console.log('[SESProvider] String to sign:', stringToSign);
      }

      return isValid;
    } catch (error) {
      console.log('[SESProvider] Signature verification error:', error);
      return false;
    }
  }

  /**
   * Fetch the signing certificate from AWS
   */
  private async fetchCertificate(url: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch certificate: ${response.status}`);
    }
    return response.text();
  }

  /**
   * Handle SNS subscription confirmation
   */
  async handleWebhookHandshake(
    payload: unknown,
    _headers: Record<string, string>,
  ): Promise<{ status: number; body: string } | null> {
    const snsMessage = payload as {
      Type: string;
      SubscribeURL: string;
      Token: string;
      TopicArn: string;
    };

    if (snsMessage.Type !== 'SubscriptionConfirmation') {
      return null;
    }

    console.log('[SESProvider] Confirming SNS subscription...');
    console.log('[SESProvider] SubscribeURL:', snsMessage.SubscribeURL);

    try {
      // Confirm the subscription by visiting the SubscribeURL
      const response = await fetch(snsMessage.SubscribeURL);
      if (response.ok) {
        console.log('[SESProvider] SNS subscription confirmed');
        return { status: 200, body: 'Subscription confirmed' };
      } else {
        console.error(
          '[SESProvider] Failed to confirm subscription:',
          response.status,
        );
        return { status: 500, body: 'Failed to confirm subscription' };
      }
    } catch (err) {
      console.error('[SESProvider] Failed to confirm subscription:', err);
      return { status: 500, body: 'Failed to confirm subscription' };
    }
  }
}
