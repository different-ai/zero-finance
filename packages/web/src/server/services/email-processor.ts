import { v4 as uuidv4 } from 'uuid';
import type { InboxCard, SourceDetails, SourceType } from '@/types/inbox';
import type { SimplifiedEmail, GmailAttachmentMetadata as GmailServiceAttachmentMetadata } from './gmail-service';
import { getSimpleEmailConfidence } from './ai-service';

// Define attachment metadata structure for InboxCard an attachment from an email.
// This mirrors what GmailAttachmentMetadata provides from gmail-service.
interface InboxAttachmentMetadata {
    filename: string;
    mimeType: string;
    size: number;
    attachmentId?: string; // Optional: if needed for direct download later
}

// Define a more specific SourceDetails for emails, extending the base SourceDetails
// This helps in providing type safety for email-specific details within the card.
interface EmailSourceDetails extends SourceDetails {
  emailId: string; // Gmail's unique message ID
  threadId?: string | null; // Gmail's thread ID
  subject?: string | null; // Email subject
  fromAddress?: string | null; // Full "From" header of the email
  attachments: InboxAttachmentMetadata[]; // List of attachments with their metadata
}

// Helper function to extract a display name from the email "From" header.
function extractSenderName(fromHeader?: string | null): string {
  if (!fromHeader) return 'Unknown Sender';
  // Matches common email format "Display Name <email@example.com>"
  const match = fromHeader.match(/^(.*)<.*>$/);
  if (match && match[1]) {
    // Return the display name part, trimmed and with surrounding quotes removed
    return match[1].trim().replace(/^"|"$/g, '');
  }
  // Fallback to the full header if no specific display name is found
  return fromHeader;
}

export async function processEmailsToInboxCards(
  emails: SimplifiedEmail[],
): Promise<InboxCard[]> {
  const inboxCards: InboxCard[] = [];
  console.log(`[EmailProcessor] Starting processing for ${emails.length} emails.`);

  for (const email of emails) {
    console.log(`[EmailProcessor] Processing email ID: ${email.id}, Subject: "${email.subject}"`);
    const confidence = await getSimpleEmailConfidence(
      email.subject,
      email.snippet,
      email.attachments.length,
    );

    const cardId = uuidv4();
    const senderName = extractSenderName(email.from);

    // Transform attachment metadata from Gmail service to our InboxCard format
    const inboxAttachments: InboxAttachmentMetadata[] = email.attachments.map((att: GmailServiceAttachmentMetadata) => ({
        filename: att.filename,
        mimeType: att.mimeType,
        size: att.size,
        attachmentId: att.attachmentId,
    }));

    const card: InboxCard = {
      id: cardId,
      icon: 'invoice', // Default icon for email-originated cards
      title: email.subject || 'No Subject',
      subtitle: `From: ${senderName} - ${email.snippet?.substring(0, 100) || ''}...`,
      confidence,
      status: 'pending',
      blocked: false,
      timestamp: email.date ? new Date(email.date).toISOString() : new Date().toISOString(),
      rationale: 'Email identified based on keywords and attachments.', // Basic rationale for Day 1
      codeHash: 'N/A', // Not applicable for email cards initially
      chainOfThought: [ // Simple chain of thought for Day 1
        `Email received from: ${email.from}`,
        `Subject: ${email.subject}`,
        `Keywords matched: (implicit based on query)`,
        `Attachments found: ${email.attachments.length}`,
      ],
      // Placeholder impact; structure confirmed from packages/web/types/inbox.ts
      impact: {
        currentBalance: 0,
        postActionBalance: 0,
        // yield is optional and not relevant here
      },
      logId: email.id, // Use Gmail message ID as a log identifier
      sourceType: 'email' as SourceType, // Asserting 'email' is a valid SourceType
      // Populate sourceDetails with email-specific information
      sourceDetails: {
        name: `Email from ${senderName}`, // Display name for the source
        identifier: email.subject || email.id, // Primary identifier (subject or email ID)
        icon: 'Mail', // Suggesting a Lucide icon name for emails
        
        // Email-specific data, fitting into the EmailSourceDetails structure
        emailId: email.id,
        threadId: email.threadId,
        subject: email.subject,
        fromAddress: email.from,
        attachments: inboxAttachments,
      } as EmailSourceDetails, 
      comments: [],
      isAiSuggestionPending: false,
    };
    inboxCards.push(card);
  }
  console.log(`[EmailProcessor] Finished processing. Generated ${inboxCards.length} cards.`);
  return inboxCards;
} 