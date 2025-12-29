/**
 * Attachment Parser for AI Email Agent
 *
 * Extracts text content from email attachments (PDFs, etc.)
 * so the AI can process invoice data from attached files.
 */

// pdf-parse v2 uses a class-based API
// eslint-disable-next-line @typescript-eslint/no-require-imports
const PDFParse = require('pdf-parse').PDFParse;

export interface ParsedAttachment {
  filename: string;
  contentType: string;
  /** Extracted text content from the attachment */
  textContent: string | null;
  /** Whether parsing was successful */
  parsed: boolean;
  /** Error message if parsing failed */
  error?: string;
}

export interface EmailAttachment {
  filename: string;
  content: string; // base64 encoded
  contentType: string;
}

/**
 * Parse a PDF attachment and extract its text content.
 *
 * @param base64Content - Base64 encoded PDF content
 * @returns Extracted text or null if parsing fails
 */
async function parsePdf(base64Content: string): Promise<string | null> {
  try {
    const buffer = Buffer.from(base64Content, 'base64');
    const uint8Array = new Uint8Array(buffer);

    // PDFParse constructor takes LoadParameters with data property
    const parser = new PDFParse({ data: uint8Array });
    const result = await parser.getText();

    // Clean up parser resources
    await parser.destroy();

    // TextResult has .text property with concatenated text
    return result?.text?.trim() || null;
  } catch (error) {
    console.error('[AttachmentParser] Failed to parse PDF:', error);
    return null;
  }
}

/**
 * Check if a content type is a PDF.
 */
function isPdf(contentType: string): boolean {
  return (
    contentType === 'application/pdf' ||
    contentType.startsWith('application/pdf')
  );
}

/**
 * Check if a content type is plain text.
 */
function isPlainText(contentType: string): boolean {
  return contentType === 'text/plain' || contentType.startsWith('text/plain');
}

/**
 * Check if a content type is a supported document format.
 */
function isSupportedDocument(contentType: string): boolean {
  return isPdf(contentType) || isPlainText(contentType);
}

/**
 * Parse a single attachment and extract its text content.
 *
 * Currently supports:
 * - PDF files
 * - Plain text files
 *
 * @param attachment - The email attachment to parse
 * @returns Parsed attachment with extracted text
 */
export async function parseAttachment(
  attachment: EmailAttachment,
): Promise<ParsedAttachment> {
  const { filename, content, contentType } = attachment;

  // Handle PDF files
  if (isPdf(contentType)) {
    const textContent = await parsePdf(content);
    if (textContent) {
      return {
        filename,
        contentType,
        textContent,
        parsed: true,
      };
    }
    return {
      filename,
      contentType,
      textContent: null,
      parsed: false,
      error: 'Failed to extract text from PDF',
    };
  }

  // Handle plain text files
  if (isPlainText(contentType)) {
    try {
      const textContent = Buffer.from(content, 'base64').toString('utf-8');
      return {
        filename,
        contentType,
        textContent: textContent.trim(),
        parsed: true,
      };
    } catch (error) {
      return {
        filename,
        contentType,
        textContent: null,
        parsed: false,
        error: 'Failed to decode text file',
      };
    }
  }

  // Unsupported format
  return {
    filename,
    contentType,
    textContent: null,
    parsed: false,
    error: `Unsupported file type: ${contentType}`,
  };
}

/**
 * Parse all attachments from an email and extract text content.
 *
 * @param attachments - Array of email attachments
 * @returns Array of parsed attachments with extracted text
 */
export async function parseAttachments(
  attachments: EmailAttachment[] | undefined,
): Promise<ParsedAttachment[]> {
  if (!attachments || attachments.length === 0) {
    return [];
  }

  const results: ParsedAttachment[] = [];

  for (const attachment of attachments) {
    // Only try to parse supported document types
    if (isSupportedDocument(attachment.contentType)) {
      const parsed = await parseAttachment(attachment);
      results.push(parsed);
    } else {
      // Skip unsupported types (images, etc.) but log them
      console.log(
        `[AttachmentParser] Skipping unsupported attachment: ${attachment.filename} (${attachment.contentType})`,
      );
      results.push({
        filename: attachment.filename,
        contentType: attachment.contentType,
        textContent: null,
        parsed: false,
        error: `Unsupported file type: ${attachment.contentType}`,
      });
    }
  }

  return results;
}

/**
 * Format parsed attachments for AI context.
 *
 * Creates a structured summary of attachment contents that
 * can be included in the AI prompt.
 *
 * @param parsedAttachments - Array of parsed attachments
 * @returns Formatted string for AI context, or empty string if no content
 */
export function formatAttachmentsForAI(
  parsedAttachments: ParsedAttachment[],
): string {
  const successfulParsings = parsedAttachments.filter(
    (a) => a.parsed && a.textContent,
  );

  if (successfulParsings.length === 0) {
    return '';
  }

  const attachmentSections = successfulParsings.map((attachment, index) => {
    return `
--- ATTACHMENT ${index + 1}: ${attachment.filename} ---
${attachment.textContent}
--- END ATTACHMENT ${index + 1} ---`;
  });

  return `

=== EMAIL ATTACHMENTS ===
The email included ${parsedAttachments.length} attachment(s). Here is the extracted content:
${attachmentSections.join('\n')}
=== END ATTACHMENTS ===

IMPORTANT: The above attachment(s) may contain invoice details, amounts, recipient information, 
or other relevant data. Please analyze both the email body AND the attachment content to 
extract complete invoice information.`;
}

/**
 * Get a summary of attachment parsing results.
 *
 * @param parsedAttachments - Array of parsed attachments
 * @returns Summary object with counts
 */
export function getAttachmentSummary(parsedAttachments: ParsedAttachment[]): {
  total: number;
  parsed: number;
  failed: number;
  types: string[];
} {
  return {
    total: parsedAttachments.length,
    parsed: parsedAttachments.filter((a) => a.parsed).length,
    failed: parsedAttachments.filter((a) => !a.parsed).length,
    types: [...new Set(parsedAttachments.map((a) => a.contentType))],
  };
}
