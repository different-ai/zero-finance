/**
 * Email Parser for AI Email Agent
 *
 * Parses forwarded emails to extract:
 * - Original sender (invoice recipient)
 * - Original subject
 * - Original body content
 * - User's additional message
 */

export interface ParsedForwardedEmail {
  /** Name of original sender (invoice recipient) */
  originalFrom: string;
  /** Email of original sender (invoice recipient) */
  originalFromEmail: string;
  /** Original email subject */
  originalSubject: string;
  /** Original email body */
  originalBody: string;
  /** The full forwarded message including headers */
  forwardedMessage: string;
  /** User's message before the forwarded content */
  userMessage: string;
}

/**
 * Common patterns for forwarded email headers across email clients.
 * Order matters - more specific patterns first.
 */
const FORWARD_PATTERNS = [
  // Gmail style
  {
    start: /---------- Forwarded message ---------/i,
    parse:
      /---------- Forwarded message ---------\s*\n(?:From:\s*(.+?)\s*<(.+?)>|From:\s*(.+?))\s*\n(?:Date:\s*.+?\n)?Subject:\s*(.+?)\n(?:To:\s*.+?\n)?\n([\s\S]+)/i,
    groups: {
      name: [1, 3],
      email: [2],
      subject: [4],
      body: [5],
    },
  },
  // Outlook style
  {
    start: /-----Original Message-----/i,
    parse:
      /-----Original Message-----\s*\n(?:From:\s*(.+?)\s*<(.+?)>|From:\s*(.+?))\s*\n(?:Sent:\s*.+?\n)?(?:To:\s*.+?\n)?Subject:\s*(.+?)\n\n([\s\S]+)/i,
    groups: {
      name: [1, 3],
      email: [2],
      subject: [4],
      body: [5],
    },
  },
  // Apple Mail style
  {
    start: /Begin forwarded message:/i,
    parse:
      /Begin forwarded message:\s*\n+(?:From:\s*(.+?)\s*<(.+?)>|From:\s*(.+?))\s*\n(?:Subject:\s*(.+?)\n)?(?:Date:\s*.+?\n)?(?:To:\s*.+?\n)?\n([\s\S]+)/i,
    groups: {
      name: [1, 3],
      email: [2],
      subject: [4],
      body: [5],
    },
  },
  // Generic "Fwd:" in subject, inline forward
  {
    start: /^>?\s*From:/m,
    parse:
      /^>?\s*From:\s*(.+?)\s*<(.+?)>\s*\n(?:>?\s*Date:\s*.+?\n)?(?:>?\s*Subject:\s*(.+?)\n)?(?:>?\s*To:\s*.+?\n)?\n?([\s\S]+)/m,
    groups: {
      name: [1],
      email: [2],
      subject: [3],
      body: [4],
    },
  },
];

/**
 * Extract email address from various formats.
 *
 * Handles:
 * - "Name <email@example.com>"
 * - "<email@example.com>"
 * - "email@example.com"
 */
function extractEmail(text: string): string {
  if (!text) return '';

  // Try to extract from angle brackets
  const bracketMatch = text.match(/<([^>]+)>/);
  if (bracketMatch) {
    return bracketMatch[1].trim();
  }

  // Check if the whole thing is an email
  const emailPattern = /[\w.-]+@[\w.-]+\.\w+/;
  const match = text.match(emailPattern);
  return match ? match[0].trim() : text.trim();
}

/**
 * Extract name from "Name <email>" format.
 */
function extractName(text: string): string {
  if (!text) return '';

  // If it contains angle brackets, everything before is the name
  const bracketIndex = text.indexOf('<');
  if (bracketIndex > 0) {
    return text
      .slice(0, bracketIndex)
      .trim()
      .replace(/^["']|["']$/g, '');
  }

  // Otherwise it's just the text (might be email)
  return text.trim();
}

/**
 * Parse a forwarded email to extract original sender details.
 *
 * @param body - The full email body text
 * @returns Parsed email data or null if not a forwarded email
 */
export function parseForwardedEmail(body: string): ParsedForwardedEmail | null {
  if (!body) return null;

  for (const pattern of FORWARD_PATTERNS) {
    // Check if this pattern's start marker exists
    const startMatch = body.match(pattern.start);
    if (!startMatch) continue;

    // Try to parse with the full pattern
    const match = body.match(pattern.parse);
    if (!match) continue;

    // Extract groups based on pattern definition
    const groups = pattern.groups;

    // Get name from possible group indices
    let originalFrom = '';
    for (const idx of groups.name) {
      if (match[idx]) {
        originalFrom = extractName(match[idx]);
        break;
      }
    }

    // Get email from possible group indices
    let originalFromEmail = '';
    for (const idx of groups.email) {
      if (match[idx]) {
        originalFromEmail = extractEmail(match[idx]);
        break;
      }
    }

    // If no email found but we have a name, try to extract email from name
    if (!originalFromEmail && originalFrom) {
      originalFromEmail = extractEmail(originalFrom);
      if (originalFromEmail === originalFrom) {
        // The name was actually an email, clear the name
        originalFrom = '';
      }
    }

    const originalSubject = match[groups.subject[0]]?.trim() || '';
    const originalBody = match[groups.body[0]]?.trim() || '';

    // Extract user's message (everything before the forward marker)
    const userMessage = body.slice(0, startMatch.index).trim();

    return {
      originalFrom,
      originalFromEmail,
      originalSubject,
      originalBody,
      forwardedMessage: body.slice(startMatch.index),
      userMessage,
    };
  }

  return null;
}

/**
 * Format an email for AI processing.
 *
 * Creates a structured prompt that clearly identifies:
 * - Who forwarded the email (our user)
 * - Who the original sender is (invoice recipient)
 * - The content and context
 * - Any attachment contents (PDFs, text files)
 *
 * @param email - Email data from webhook
 * @param attachmentContent - Optional pre-parsed attachment content string
 * @returns Formatted string for AI context
 */
export function formatEmailForAI(
  email: {
    from: string;
    subject: string;
    text: string;
  },
  attachmentContent?: string,
): string {
  const parsed = parseForwardedEmail(email.text);
  const attachmentSection = attachmentContent || '';

  if (parsed) {
    const recipientInfo = parsed.originalFromEmail
      ? `${parsed.originalFrom || 'Unknown'} <${parsed.originalFromEmail}>`
      : parsed.originalFrom || 'Unknown';

    return `
USER (who forwarded this email): ${email.from}
SUBJECT: ${email.subject}

--- FORWARDED EMAIL ---
ORIGINAL SENDER (this is the INVOICE RECIPIENT): ${recipientInfo}
ORIGINAL SUBJECT: ${parsed.originalSubject || '(no subject)'}

CONTENT:
${parsed.originalBody}
--- END FORWARDED EMAIL ---

USER'S MESSAGE TO YOU:
${parsed.userMessage || '(no additional message - please extract invoice details from the forwarded email)'}
${attachmentSection}
`.trim();
  }

  // Not a forwarded email - direct message to the agent
  return `
USER: ${email.from}
SUBJECT: ${email.subject}

MESSAGE:
${email.text}
${attachmentSection}
`.trim();
}

/**
 * Check if an email appears to be a forwarded email.
 */
export function isForwardedEmail(body: string): boolean {
  return FORWARD_PATTERNS.some((pattern) => pattern.start.test(body));
}

/**
 * Check if a message appears to be a confirmation reply.
 *
 * @param text - The email body text
 * @returns Object indicating if this is a confirmation and whether it's positive
 */
export function parseConfirmationReply(text: string): {
  isConfirmation: boolean;
  confirmed: boolean;
} {
  const normalizedText = text.toLowerCase().trim();

  // Positive confirmations
  const positivePatterns = [
    /^yes\b/i,
    /^y\b/i,
    /^confirm/i,
    /^send\s*(it|invoice)?/i,
    /^ok\b/i,
    /^go\s*ahead/i,
    /^approve/i,
    /^do\s*it/i,
    /^please\s*send/i,
  ];

  // Negative responses
  const negativePatterns = [
    /^no\b/i,
    /^n\b/i,
    /^cancel/i,
    /^don'?t\s*send/i,
    /^stop/i,
    /^abort/i,
    /^never\s*mind/i,
    /^wait/i,
  ];

  for (const pattern of positivePatterns) {
    if (pattern.test(normalizedText)) {
      return { isConfirmation: true, confirmed: true };
    }
  }

  for (const pattern of negativePatterns) {
    if (pattern.test(normalizedText)) {
      return { isConfirmation: true, confirmed: false };
    }
  }

  return { isConfirmation: false, confirmed: false };
}
