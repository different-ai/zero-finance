import { v4 as uuidv4 } from 'uuid';
import type { InboxCard, SourceDetails, SourceType } from '@/types/inbox';
import { 
    type SimplifiedEmail, 
    type GmailAttachmentMetadata as GmailServiceAttachmentMetadata,
    downloadAttachment // Import downloadAttachment
} from './gmail-service';
import { processDocumentFromEmailText, AiProcessedDocument } from './ai-service';
import fs from 'fs'; // For temporary file saving (simulated)
import path from 'path'; // For temporary file path construction (simulated)
import crypto from 'crypto'; // For subject hashing
import { db } from '@/db';
import { inboxCards, userClassificationSettings } from '@/db/schema';
import { eq, and, asc, desc } from 'drizzle-orm';
import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';

// Define attachment metadata structure for InboxCard an attachment from an email.
// This mirrors what GmailAttachmentMetadata provides from gmail-service.
interface InboxAttachmentMetadata {
    filename: string;
    mimeType: string;
    size: number;
    attachmentId?: string; // Optional: if needed for direct download later
    tempPath?: string; // Path where the attachment is temporarily saved
}

// Define a more specific SourceDetails for emails, extending the base SourceDetails
// This helps in providing type safety for email-specific details within the card.
interface EmailSourceDetails extends SourceDetails {
  emailId: string; // Gmail's unique message ID
  threadId?: string | null; // Gmail's thread ID
  subject?: string | null; // Email subject
  fromAddress?: string | null; // Full "From" header of the email
  attachments: InboxAttachmentMetadata[]; // List of attachments with their metadata
  textBody?: string | null; // Optional: raw text body of the email
  htmlBody?: string | null; // Optional: raw HTML body of the email
}

// Helper function to create a hash of the email subject for duplicate detection
function createSubjectHash(subject: string | null | undefined): string | null {
  if (!subject || subject.trim() === '') {
    return null;
  }
  // Normalize subject by removing common prefixes and whitespace
  const normalizedSubject = subject
    .toLowerCase()
    .replace(/^(re:|fwd?:|fw:)\s*/gi, '') // Remove reply/forward prefixes
    .trim();
  
  if (normalizedSubject === '') {
    return null;
  }
  
  return crypto.createHash('sha256').update(normalizedSubject).digest('hex');
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

// Return type is now InboxCard['icon']
function mapDocumentTypeToIcon(docType?: AiProcessedDocument['documentType']): InboxCard['icon'] {
    switch (docType) {
        case 'invoice': return 'invoice';
        case 'receipt': return 'receipt'; // Assumes 'receipt' is a valid InboxCardIcon
        case 'payment_reminder': return 'bell'; // Assumes 'bell' is a valid InboxCardIcon
        case 'other_document': return 'file-text'; // Assumes 'file-text' is valid
        default: return 'email'; // Fallback for email sourceType if AI gives no type
    }
}

// Helper to compute cosine similarity between two vectors
function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (normA * normB);
}

const EMBEDDING_DUP_THRESHOLD = 0.9;

export async function processEmailsToInboxCards(
  emails: SimplifiedEmail[],
  userId: string, // Add userId parameter for duplicate checking
): Promise<InboxCard[]> {
  const processedCards: InboxCard[] = [];
  console.log(`[EmailProcessor] Starting processing for ${emails.length} emails.`);

  // Pre-fetch up to 300 recent embeddings for duplicate checks
  const recentCardsWithEmbeddings = await db
    .select({ embedding: inboxCards.embedding })
    .from(inboxCards)
    .where(eq(inboxCards.userId, userId))
    .orderBy(desc(inboxCards.createdAt))
    .limit(300);

  const recentEmbeddings: number[][] = recentCardsWithEmbeddings
    .map((r) => (Array.isArray(r.embedding) ? (r.embedding as number[]) : null))
    .filter((v): v is number[] => v !== null);

  // Fetch user's classification settings
  const classificationSettings = await db
    .select()
    .from(userClassificationSettings)
    .where(and(
      eq(userClassificationSettings.userId, userId),
      eq(userClassificationSettings.enabled, true)
    ))
    .orderBy(asc(userClassificationSettings.priority));

  const userPrompts = classificationSettings.map(setting => setting.prompt);
  if (userPrompts.length > 0) {
    console.log(`[EmailProcessor] Found ${userPrompts.length} active classification prompts for user ${userId}`);
  }

  for (const email of emails) {
    console.log(`[EmailProcessor] Processing email ID: ${email.id}, Subject: "${email.subject}"`);
    
    // Create subject hash for duplicate detection
    const subjectHash = createSubjectHash(email.subject);
    
    // Check for duplicate via subjectHash (quick path)
    if (subjectHash) {
      const existingCard = await db.query.inboxCards.findFirst({
        where: and(
          eq(inboxCards.userId, userId),
          eq(inboxCards.subjectHash, subjectHash)
        ),
      });
      if (existingCard) {
        console.log(`[EmailProcessor - Duplicate Detected] Skipping email with subject hash: ${subjectHash.substring(0, 8)}..., Subject: "${email.subject}".`);
        continue; // Skip processing this email
      }
    }

    const emailContentForAI = `${email.subject || ''}\n\n${email.textBody || email.htmlBody || ''}`.trim();
    let aiData: AiProcessedDocument | null = null;
    let embeddingVector: number[] | undefined;

    if (emailContentForAI) {
      // Generate embedding for semantic duplicate detection
      try {
        const { embedding } = await embed({
          model: openai.embedding('text-embedding-3-small'),
          value: emailContentForAI.slice(0, 8000), // safeguard token length
        });
        embeddingVector = embedding;
      } catch (err) {
        console.error('[EmailProcessor] Failed to compute embedding:', err);
      }

      // Semantic duplicate check
      if (embeddingVector) {
        const isSemDup = recentEmbeddings.some((e) => cosineSimilarity(e, embeddingVector!) >= EMBEDDING_DUP_THRESHOLD);
        if (isSemDup) {
          console.log('[EmailProcessor - Embedding Duplicate] Skipping email due to high cosine similarity.');
          continue;
        }
      }

      // If embedding duplicate check passed, proceed with AI doc processing
      aiData = await processDocumentFromEmailText(
        emailContentForAI,
        email.subject === null ? undefined : email.subject,
        userPrompts
      );
    }

    // Apply LLM-based filtering
    const relevantDocumentTypes = ["invoice", "receipt", "payment_reminder"];
    const meetsFilteringCriteria = aiData && 
                                   relevantDocumentTypes.includes(aiData.documentType) && 
                                   aiData.confidence > 80;

    if (!meetsFilteringCriteria) {
      console.log(`[EmailProcessor - Filtered Out] Email ID: ${email.id}, Subject: "${email.subject}", Type: ${aiData?.documentType || 'N/A'}, Confidence: ${aiData?.confidence || 'N/A'}. Does not meet display criteria.`);
      continue; // Skip creating an InboxCard for this email
    }

    // If criteria are met, proceed to create the InboxCard
    const cardId = uuidv4();
    const senderName = extractSenderName(email.from);

    // Transform attachment metadata from Gmail service to our InboxCard format
    // And attempt to download attachments
    const inboxAttachments: InboxAttachmentMetadata[] = [];
    for (const att of email.attachments) {
        let tempPath: string | undefined = undefined;
        if (att.attachmentId) {
            console.log(`[EmailProcessor] Attempting to download attachment: ${att.filename} (ID: ${att.attachmentId}) for email ${email.id}`);
            const attachmentBuffer = await downloadAttachment(email.id, att.attachmentId);
            if (attachmentBuffer) {
                // For Day 1: Simulate saving to /tmp and record path
                const tempDir = '/tmp/zerofinance-attachments'; // Simulated base temp directory
                // Ensure filename is safe for file system
                const safeFilename = att.filename.replace(/[^a-zA-Z0-9._-]/g, '_');
                tempPath = path.join(tempDir, `${cardId}-${safeFilename}`);
                
                // Create directory if it doesn't exist (simulation for now)
                // if (!fs.existsSync(tempDir)) {
                //   fs.mkdirSync(tempDir, { recursive: true });
                // }
                // fs.writeFileSync(tempPath, attachmentBuffer);
                console.log(`[EmailProcessor] SIMULATED: Attachment ${att.filename} for email ${email.id} would be saved to ${tempPath} (${attachmentBuffer.length} bytes).`);
                // On Day 2, this will be actual fs.writeFileSync after ensuring /tmp is accessible
            } else {
                console.warn(`[EmailProcessor] Failed to download attachment: ${att.filename} for email ${email.id}`);
            }
        }
        inboxAttachments.push({
            filename: att.filename,
            mimeType: att.mimeType,
            size: att.size,
            attachmentId: att.attachmentId,
            tempPath: tempPath, // Add the temporary path
        });
    }

    const cardTitle = aiData?.extractedTitle || email.subject || 'No Subject';
    const cardSubtitle = aiData?.extractedSummary || `From: ${senderName} - ${email.snippet?.substring(0, 100) || ''}...`;
    const cardConfidence = aiData?.confidence || 30; // Fallback confidence if AI fails
    const cardIcon = aiData?.documentType ? mapDocumentTypeToIcon(aiData.documentType) : 'email';
    const cardRationale = aiData?.aiRationale || 'Email processed; AI analysis result pending or unavailable.';
    const cardRequiresAction = aiData?.requiresAction || false; // Get from AI or default to false
    const cardSuggestedActionLabel = aiData?.suggestedActionLabel; // Get from AI

    const card: InboxCard = {
      id: cardId,
      icon: cardIcon,
      title: cardTitle,
      subtitle: cardSubtitle,
      confidence: cardConfidence,
      status: 'pending',
      blocked: false,
      timestamp: email.date ? new Date(email.date).toISOString() : new Date().toISOString(),
      rationale: cardRationale,
      requiresAction: cardRequiresAction, // Map new field
      suggestedActionLabel: cardSuggestedActionLabel, // Map new field
      codeHash: 'N/A',
      chainOfThought: aiData?.aiRationale ? [aiData.aiRationale] : [`Initial processing of email from: ${email.from}`],
      impact: { currentBalance: 0, postActionBalance: 0 },
      logId: email.id,
      subjectHash: subjectHash, // Add subject hash for duplicate prevention
      sourceType: 'email' as SourceType,
      sourceDetails: {
        name: `Email from ${senderName}`,
        identifier: email.subject || email.id,
        icon: 'Mail',
        emailId: email.id,
        threadId: email.threadId,
        subject: email.subject,
        fromAddress: email.from,
        attachments: inboxAttachments,
        textBody: email.textBody?.substring(0, 2000),
        htmlBody: email.htmlBody?.substring(0, 4000),
      } as EmailSourceDetails,
      parsedInvoiceData: aiData === null ? undefined : aiData,
      comments: [],
      isAiSuggestionPending: false,
      embedding: embeddingVector,
    };
    processedCards.push(card);
  }
  console.log(`[EmailProcessor] Finished processing. Generated ${processedCards.length} cards.`);
  return processedCards;
} 