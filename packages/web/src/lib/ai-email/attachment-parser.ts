/**
 * Attachment Parser for AI Email Agent
 *
 * Prepares email attachments for native AI processing.
 * PDFs and images are passed directly to the AI model (GPT-5.2 supports native PDF/image understanding).
 * Text files are decoded and included as text content.
 */

export interface PreparedAttachment {
  filename: string;
  contentType: string;
  /** Base64 encoded content for file types (PDF, images) */
  base64Content: string | null;
  /** Decoded text content for text files */
  textContent: string | null;
  /** Whether this attachment can be processed by the AI */
  supported: boolean;
  /** Error message if preparation failed */
  error?: string;
}

export interface EmailAttachment {
  filename: string;
  content: string; // base64 encoded
  contentType: string;
}

/**
 * Content types that can be passed directly to the AI model as file parts.
 * GPT-4o/GPT-5 series models natively support these formats.
 */
const AI_NATIVE_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

/**
 * Check if a content type can be processed natively by the AI model.
 */
function isAINativeFileType(contentType: string): boolean {
  return AI_NATIVE_FILE_TYPES.some(
    (type) => contentType === type || contentType.startsWith(type),
  );
}

/**
 * Check if a content type is plain text.
 */
function isPlainText(contentType: string): boolean {
  return contentType === 'text/plain' || contentType.startsWith('text/plain');
}

/**
 * Check if a content type is supported for AI processing.
 */
function isSupportedType(contentType: string): boolean {
  return isAINativeFileType(contentType) || isPlainText(contentType);
}

/**
 * Prepare a single attachment for AI processing.
 *
 * - PDF and image files: Returns base64 content for native AI file input
 * - Text files: Decodes and returns text content
 * - Other types: Marked as unsupported
 *
 * @param attachment - The email attachment to prepare
 * @returns Prepared attachment ready for AI processing
 */
export function prepareAttachment(
  attachment: EmailAttachment,
): PreparedAttachment {
  const { filename, content, contentType } = attachment;

  // Handle AI-native file types (PDF, images) - pass through as base64
  if (isAINativeFileType(contentType)) {
    return {
      filename,
      contentType,
      base64Content: content,
      textContent: null,
      supported: true,
    };
  }

  // Handle plain text files - decode to string
  if (isPlainText(contentType)) {
    try {
      const textContent = Buffer.from(content, 'base64').toString('utf-8');
      return {
        filename,
        contentType,
        base64Content: null,
        textContent: textContent.trim(),
        supported: true,
      };
    } catch (error) {
      return {
        filename,
        contentType,
        base64Content: null,
        textContent: null,
        supported: false,
        error: 'Failed to decode text file',
      };
    }
  }

  // Unsupported format
  return {
    filename,
    contentType,
    base64Content: null,
    textContent: null,
    supported: false,
    error: `Unsupported file type: ${contentType}`,
  };
}

/**
 * Prepare all attachments from an email for AI processing.
 *
 * @param attachments - Array of email attachments
 * @returns Array of prepared attachments
 */
export function prepareAttachments(
  attachments: EmailAttachment[] | undefined,
): PreparedAttachment[] {
  if (!attachments || attachments.length === 0) {
    return [];
  }

  return attachments.map((attachment) => {
    if (isSupportedType(attachment.contentType)) {
      return prepareAttachment(attachment);
    }

    // Log and skip unsupported types
    console.log(
      `[AttachmentParser] Skipping unsupported attachment: ${attachment.filename} (${attachment.contentType})`,
    );
    return {
      filename: attachment.filename,
      contentType: attachment.contentType,
      base64Content: null,
      textContent: null,
      supported: false,
      error: `Unsupported file type: ${attachment.contentType}`,
    };
  });
}

/**
 * Build AI SDK message content parts from prepared attachments.
 *
 * Returns an array of content parts that can be spread into a message's content array:
 * - File parts for PDFs and images (native AI processing)
 * - Text parts for text file contents
 *
 * @param preparedAttachments - Array of prepared attachments
 * @returns Array of AI SDK content parts
 */
export function buildAttachmentContentParts(
  preparedAttachments: PreparedAttachment[],
): Array<
  | { type: 'file'; data: Buffer; mediaType: string; filename?: string }
  | { type: 'text'; text: string }
> {
  const parts: Array<
    | { type: 'file'; data: Buffer; mediaType: string; filename?: string }
    | { type: 'text'; text: string }
  > = [];

  for (const attachment of preparedAttachments) {
    if (!attachment.supported) continue;

    // File types (PDF, images) - pass as native file content
    if (attachment.base64Content) {
      parts.push({
        type: 'file',
        data: Buffer.from(attachment.base64Content, 'base64'),
        mediaType: attachment.contentType,
        filename: attachment.filename,
      });
    }

    // Text files - include as text content
    if (attachment.textContent) {
      parts.push({
        type: 'text',
        text: `\n--- ATTACHMENT: ${attachment.filename} ---\n${attachment.textContent}\n--- END ATTACHMENT ---\n`,
      });
    }
  }

  return parts;
}

/**
 * Format text-only attachments for AI context (legacy format for session storage).
 *
 * Creates a structured summary of text attachment contents.
 * File attachments (PDF, images) are handled separately via native file input.
 *
 * @param preparedAttachments - Array of prepared attachments
 * @returns Formatted string for text attachments, or empty string if none
 */
export function formatTextAttachmentsForAI(
  preparedAttachments: PreparedAttachment[],
): string {
  const textAttachments = preparedAttachments.filter(
    (a) => a.supported && a.textContent,
  );

  if (textAttachments.length === 0) {
    return '';
  }

  const attachmentSections = textAttachments.map((attachment, index) => {
    return `
--- TEXT ATTACHMENT ${index + 1}: ${attachment.filename} ---
${attachment.textContent}
--- END TEXT ATTACHMENT ${index + 1} ---`;
  });

  return `

=== TEXT ATTACHMENTS ===
${attachmentSections.join('\n')}
=== END TEXT ATTACHMENTS ===`;
}

/**
 * Get a summary of attachment preparation results.
 *
 * @param preparedAttachments - Array of prepared attachments
 * @returns Summary object with counts
 */
export function getAttachmentSummary(
  preparedAttachments: PreparedAttachment[],
): {
  total: number;
  supported: number;
  unsupported: number;
  fileCount: number;
  textCount: number;
  types: string[];
} {
  return {
    total: preparedAttachments.length,
    supported: preparedAttachments.filter((a) => a.supported).length,
    unsupported: preparedAttachments.filter((a) => !a.supported).length,
    fileCount: preparedAttachments.filter((a) => a.base64Content).length,
    textCount: preparedAttachments.filter((a) => a.textContent).length,
    types: [...new Set(preparedAttachments.map((a) => a.contentType))],
  };
}

// Legacy exports for backward compatibility during migration
export type ParsedAttachment = PreparedAttachment;
export const parseAttachments = prepareAttachments;
export const formatAttachmentsForAI = formatTextAttachmentsForAI;
