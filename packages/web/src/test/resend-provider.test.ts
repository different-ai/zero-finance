import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Set environment variables before any imports
process.env.RESEND_API_KEY = 're_test_123456789';
process.env.RESEND_WEBHOOK_SECRET = 'whsec_test_secret';

// Mock the Resend SDK
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: vi.fn().mockResolvedValue({
        data: { id: 'email_123' },
        error: null,
      }),
    },
  })),
}));

// Mock svix
vi.mock('svix', () => ({
  Webhook: vi.fn().mockImplementation(() => ({
    verify: vi.fn().mockReturnValue(true),
  })),
}));

// Mock fetch for API calls
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Import after mocks are set up
import { ResendProvider } from '../lib/email-provider/resend-provider';

describe('ResendProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  describe('send', () => {
    it('should send an email successfully', async () => {
      const provider = new ResendProvider();

      const result = await provider.send({
        from: 'test@example.com',
        to: 'recipient@example.com',
        subject: 'Test Subject',
        text: 'Test body',
      });

      expect(result.messageId).toBe('email_123');
      expect(result.provider).toBe('resend');
    });

    it('should handle array of recipients', async () => {
      const provider = new ResendProvider();

      const result = await provider.send({
        from: 'test@example.com',
        to: ['recipient1@example.com', 'recipient2@example.com'],
        subject: 'Test Subject',
        text: 'Test body',
      });

      expect(result.messageId).toBe('email_123');
    });
  });

  describe('parseInboundWebhook', () => {
    it('should return null for non-email.received events', async () => {
      const provider = new ResendProvider();

      const result = await provider.parseInboundWebhook(
        {
          type: 'email.sent',
          created_at: '2024-01-01T00:00:00Z',
          data: { id: 'email_123' },
        },
        {},
      );

      expect(result).toBeNull();
    });

    it('should return null if no email_id in payload', async () => {
      const provider = new ResendProvider();

      const result = await provider.parseInboundWebhook(
        {
          type: 'email.received',
          created_at: '2024-01-01T00:00:00Z',
          data: {},
        },
        {},
      );

      expect(result).toBeNull();
    });

    it('should fetch full email content for email.received events', async () => {
      const provider = new ResendProvider();

      // Mock the API response for fetching received email
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          object: 'email',
          id: 'email_123',
          from: 'sender@example.com',
          to: ['recipient@example.com'],
          subject: 'Test Subject',
          text: 'Test body content',
          html: '<p>Test body content</p>',
          headers: { 'message-id': '<msg123@example.com>' },
          message_id: '<msg123@example.com>',
          attachments: [],
        }),
      });

      const result = await provider.parseInboundWebhook(
        {
          type: 'email.received',
          created_at: '2024-01-01T00:00:00Z',
          data: {
            email_id: 'email_123',
            from: 'sender@example.com',
            to: ['recipient@example.com'],
            subject: 'Test Subject',
          },
        },
        {},
      );

      expect(result).not.toBeNull();
      expect(result?.from).toBe('sender@example.com');
      expect(result?.to).toEqual(['recipient@example.com']);
      expect(result?.subject).toBe('Test Subject');
      expect(result?.text).toBe('Test body content');
      expect(result?.html).toBe('<p>Test body content</p>');
      expect(result?.messageId).toBe('<msg123@example.com>');
    });

    it('should fetch attachments when present', async () => {
      const provider = new ResendProvider();

      // Mock the API response for fetching received email
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          object: 'email',
          id: 'email_123',
          from: 'sender@example.com',
          to: ['recipient@example.com'],
          subject: 'Test with attachment',
          text: 'See attached',
          html: null,
          headers: {},
          message_id: '<msg123@example.com>',
          attachments: [
            {
              id: 'att_123',
              filename: 'invoice.pdf',
              content_type: 'application/pdf',
            },
          ],
        }),
      });

      // Mock the API response for fetching attachment
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          object: 'attachment',
          id: 'att_123',
          filename: 'invoice.pdf',
          content: 'JVBERi0xLjQK...', // base64 encoded PDF
          content_type: 'application/pdf',
        }),
      });

      const result = await provider.parseInboundWebhook(
        {
          type: 'email.received',
          created_at: '2024-01-01T00:00:00Z',
          data: {
            email_id: 'email_123',
          },
        },
        {},
      );

      expect(result).not.toBeNull();
      expect(result?.attachments).toHaveLength(1);
      expect(result?.attachments?.[0].filename).toBe('invoice.pdf');
      expect(result?.attachments?.[0].contentType).toBe('application/pdf');
      expect(result?.attachments?.[0].content).toBe('JVBERi0xLjQK...');
    });

    it('should return basic info if API call fails', async () => {
      const provider = new ResendProvider();

      // Mock API failure
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Internal Server Error',
      });

      const result = await provider.parseInboundWebhook(
        {
          type: 'email.received',
          created_at: '2024-01-01T00:00:00Z',
          data: {
            email_id: 'email_123',
            from: 'sender@example.com',
            to: ['recipient@example.com'],
            subject: 'Test Subject',
            message_id: '<msg123@example.com>',
          },
        },
        {},
      );

      expect(result).not.toBeNull();
      expect(result?.from).toBe('sender@example.com');
      expect(result?.to).toEqual(['recipient@example.com']);
      expect(result?.subject).toBe('Test Subject');
      expect(result?.text).toBe(''); // No content available
    });
  });

  describe('verifyWebhookSignature', () => {
    it('should verify signature using Svix', async () => {
      const provider = new ResendProvider();

      const result = await provider.verifyWebhookSignature(
        '{"type":"email.received"}',
        {
          'svix-id': 'msg_123',
          'svix-timestamp': '1234567890',
          'svix-signature': 'v1,signature123',
        },
      );

      expect(result).toBe(true);
    });

    it('should return false if headers are missing', async () => {
      const provider = new ResendProvider();

      const result = await provider.verifyWebhookSignature(
        '{"type":"email.received"}',
        {},
      );

      expect(result).toBe(false);
    });
  });

  describe('handleWebhookHandshake', () => {
    it('should return null (no handshake needed for Resend)', async () => {
      const provider = new ResendProvider();

      const result = await provider.handleWebhookHandshake({}, {});

      expect(result).toBeNull();
    });
  });
});
