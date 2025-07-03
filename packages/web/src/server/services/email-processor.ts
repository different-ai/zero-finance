import { v4 as uuidv4 } from 'uuid';
import type { InboxCard, SourceDetails, SourceType } from '@/types/inbox';
import { 
    type SimplifiedEmail, 
    type GmailAttachmentMetadata as GmailServiceAttachmentMetadata,
    downloadAttachment // Import downloadAttachment
} from './gmail-service';
import { processDocumentFromEmailText, AiProcessedDocument } from './ai-service';
import { processPdfAttachments, mergePdfResultsWithEmail } from './pdf-processor';
import fs from 'fs'; // For temporary file saving (simulated)
import path from 'path'; // For temporary file path construction (simulated)
import crypto from 'crypto'; // For subject hashing
import { db } from '@/db';
import { inboxCards, userClassificationSettings } from '@/db/schema';
import { eq, and, asc, desc, or, gte } from 'drizzle-orm';

// Define attachment metadata structure for InboxCard an attachment from an email.
// This mirrors what GmailAttachmentMetadata provides from gmail-service.
interface InboxAttachmentMetadata {
    filename: string;
    mimeType: string;
    size: number;
    attachmentId?: string; // Optional: if needed for direct download later
    tempPath?: string; // Path where the attachment is temporarily saved
    extractedText?: string; // Text extracted from PDF attachments
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

// Helper function to create a content hash for better duplicate detection
function createContentHash(email: SimplifiedEmail): string {
  // Combine key fields that should be unique
  const contentToHash = [
    email.subject?.toLowerCase().replace(/^(re:|fwd?:|fw:)\s*/gi, '').trim() || '',
    email.from?.toLowerCase() || '',
    email.snippet?.toLowerCase() || '',
    // Include attachment names for better uniqueness
    ...email.attachments.map(att => att.filename.toLowerCase())
  ].filter(Boolean).join('|');
  
  return crypto.createHash('sha256').update(contentToHash).digest('hex');
}

// Helper function to check for similar existing cards
async function findSimilarExistingCards(
  userId: string,
  email: SimplifiedEmail,
  subjectHash: string | null,
  contentHash: string
): Promise<boolean> {
  // First check by exact logId (email ID)
  const exactMatch = await db.query.inboxCards.findFirst({
    where: and(
      eq(inboxCards.userId, userId),
      eq(inboxCards.logId, email.id)
    ),
  });
  if (exactMatch) {
    console.log(`[EmailProcessor - Duplicate] Found exact match by logId: ${email.id}`);
    return true;
  }

  // Check by subject hash if available
  if (subjectHash) {
    const subjectMatch = await db.query.inboxCards.findFirst({
      where: and(
        eq(inboxCards.userId, userId),
        eq(inboxCards.subjectHash, subjectHash)
      ),
    });
    if (subjectMatch) {
      console.log(`[EmailProcessor - Duplicate] Found match by subject hash: ${subjectHash.substring(0, 8)}...`);
      return true;
    }
  }

  // Check for recent cards with similar content (within last 24 hours)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentCards = await db.query.inboxCards.findMany({
    where: and(
      eq(inboxCards.userId, userId),
      gte(inboxCards.timestamp, oneDayAgo),
      eq(inboxCards.sourceType, 'email')
    ),
    limit: 100,
  });

  // Check if any recent card has very similar content
  for (const card of recentCards) {
    const sourceDetails = card.sourceDetails as any;
    if (!sourceDetails) continue;

    // Compare key fields
    const isSimilar = (
      // Same sender
      sourceDetails.fromAddress?.toLowerCase() === email.from?.toLowerCase() &&
      // Similar subject (after normalization)
      sourceDetails.subject?.toLowerCase().replace(/^(re:|fwd?:|fw:)\s*/gi, '').trim() === 
        email.subject?.toLowerCase().replace(/^(re:|fwd?:|fw:)\s*/gi, '').trim() &&
      // Same number of attachments
      (sourceDetails.attachments?.length || 0) === email.attachments.length
    );

    if (isSimilar) {
      console.log(`[EmailProcessor - Duplicate] Found similar recent card: ${card.cardId}`);
      return true;
    }
  }

  return false;
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

export async function processEmailsToInboxCards(
  emails: SimplifiedEmail[],
  userId: string, // Add userId parameter for duplicate checking
  accessToken?: string, // Add accessToken for PDF downloads
): Promise<InboxCard[]> {
  const processedCards: InboxCard[] = [];
  console.log(`[EmailProcessor] Starting processing for ${emails.length} emails.`);

  for (const email of emails) {
    try {
      // Check for duplicates first
      const subjectHash = createSubjectHash(email.subject);
      const contentHash = createContentHash(email);
      
      const isDuplicate = await findSimilarExistingCards(userId, email, subjectHash, contentHash);
      if (isDuplicate) {
        console.log(`[EmailProcessor] Skipping duplicate email ${email.id}`);
        continue;
      }

      // PHASE 1: Extract and analyze email content WITHOUT classification rules
      const aiData = await processDocumentFromEmailText(
        email.textBody || email.htmlBody || '', 
        email.subject || undefined
      );

      if (!aiData) {
        console.log(`[EmailProcessor] Skipping email ${email.id} - AI processing failed`);
        continue;
      }

      // Validate financial relevance
      const isFinancialEmail = (
        // Has financial data
        (aiData.amount !== null && aiData.amount !== undefined && aiData.amount > 0) ||
        // Is identified as a financial document type
        ['invoice', 'receipt', 'payment_reminder'].includes(aiData.documentType || '') ||
        // Has high confidence and financial keywords
        (aiData.confidence >= 70 && (
          aiData.extractedSummary?.toLowerCase().includes('invoice') ||
          aiData.extractedSummary?.toLowerCase().includes('payment') ||
          aiData.extractedSummary?.toLowerCase().includes('receipt') ||
          aiData.extractedSummary?.toLowerCase().includes('bill') ||
          aiData.extractedSummary?.toLowerCase().includes('statement')
        ))
      );

      if (!isFinancialEmail) {
        console.log(`[EmailProcessor] Skipping non-financial email ${email.id}`);
        continue;
      }

      // PHASE 2: Process PDF attachments if present
      let pdfResults: any[] = [];
      let attachmentUrls: string[] = [];
      
      if (email.attachments && email.attachments.length > 0 && accessToken) {
        console.log(`[EmailProcessor] Processing ${email.attachments.length} attachments for email ${email.id}`);
        pdfResults = await processPdfAttachments(email.id, email.attachments, accessToken);
        
        // Extract blob URLs from successful PDF processing results
        attachmentUrls = pdfResults
          .filter(result => result.success && result.blobUrl)
          .map(result => result.blobUrl);
          
        // Merge PDF results with email AI data if we have better data from PDFs
        const mergedData = mergePdfResultsWithEmail(aiData, pdfResults);
        if (mergedData) {
          // Use the merged data which may have better accuracy from PDF content
          Object.assign(aiData, mergedData);
        }
      }

      // PHASE 3: Apply classification rules
      const { applyClassificationRules, applyClassificationToCard } = await import('./classification-service');
      const classificationResult = await applyClassificationRules(
        aiData, 
        userId,
        email.textBody || email.htmlBody || ''
      );

      // Extract sender information
      const fromMatch = email.from?.match(/^(.*?)\s*<(.+)>$/);
      const senderName = fromMatch ? fromMatch[1].trim() : email.from?.split('@')[0] || 'Unknown';
      const senderEmail = fromMatch ? fromMatch[2] : email.from || '';

      // Generate unique card ID
      const cardId = uuidv4();

      // Determine icon based on document type or sender
      let cardIcon: InboxCard['icon'] = 'email';
      if (aiData.documentType === 'invoice') cardIcon = 'invoice';
      else if (aiData.documentType === 'receipt') cardIcon = 'receipt';
      else if (aiData.documentType === 'payment_reminder') cardIcon = 'bell';
      else if (senderEmail.includes('bank') || senderEmail.includes('chase') || senderEmail.includes('wells')) cardIcon = 'bank';

      // Process attachments
      const inboxAttachments: InboxAttachmentMetadata[] = email.attachments.map(att => ({
        filename: att.filename,
        mimeType: att.mimeType,
        size: att.size,
        attachmentId: att.attachmentId,
      }));

      // Create the base inbox card
      let inboxCard: InboxCard = {
        id: cardId,
        icon: cardIcon,
        title: aiData.cardTitle || aiData.extractedTitle || email.subject || 'Untitled',
        subtitle: aiData.extractedSummary || email.snippet || 'No description',
        confidence: aiData.confidence || 50,
        status: 'pending',
        blocked: false,
        timestamp: email.date ? new Date(email.date).toISOString() : new Date().toISOString(),
        requiresAction: aiData.requiresAction ?? true,
        suggestedActionLabel: aiData.suggestedActionLabel || 'Review',
        amount: aiData.amount ? String(aiData.amount) : undefined,
        currency: aiData.currency || undefined,
        from: senderName,
        to: undefined, // Could be extracted from email 'to' field if needed
        logId: email.id,
        subjectHash: subjectHash,
        rationale: aiData.aiRationale || 'Email processed by AI',
        codeHash: 'email-processor-v2', // Version identifier
        chainOfThought: [],
        impact: {
          currentBalance: 0,
          postActionBalance: 0,
        },
        parsedInvoiceData: aiData.documentType === 'invoice' ? aiData : undefined,
        sourceType: 'email',
        sourceDetails: {
          name: 'Gmail',
          provider: 'gmail',
          emailId: email.id,
          fromAddress: senderEmail,
          subject: email.subject,
          receivedAt: email.date || new Date().toISOString(),
          snippet: email.snippet,
          attachments: inboxAttachments,
          threadId: email.threadId,
        } as EmailSourceDetails,
        // Payment tracking
        paymentStatus: aiData.documentType === 'invoice' || aiData.documentType === 'payment_reminder' ? 'unpaid' : 'not_applicable',
        dueDate: aiData.dueDate || undefined,
        // Initialize empty classification fields
        appliedClassifications: [],
        classificationTriggered: false,
        autoApproved: false,
        categories: [],
        // Set attachment fields
        hasAttachments: email.attachments && email.attachments.length > 0,
        attachmentUrls: attachmentUrls,
      };

      // Apply classification results to the card
      inboxCard = applyClassificationToCard(classificationResult, inboxCard);

      // Track AI classification actions if any rules matched
      if (classificationResult.matchedRules.length > 0) {
        // Import the card actions service
        const { CardActionsService } = await import('./card-actions-service');
        
        // Track each matched rule as an AI action
        for (const rule of classificationResult.matchedRules) {
          await CardActionsService.trackAction({
            cardId: cardId,
            userId: userId,
            actionType: 'ai_classified',
            actor: 'ai',
            actorDetails: {
              aiModel: 'gpt-4o-mini',
              confidence: rule.confidence,
              ruleName: rule.ruleName,
              ruleId: rule.ruleId,
            },
            newValue: {
              appliedRule: rule.ruleName,
              actions: rule.actions,
              confidence: rule.confidence,
            },
            details: {
              ruleName: rule.ruleName,
              confidence: rule.confidence,
              actions: rule.actions,
              overallConfidence: classificationResult.overallConfidence,
            },
            status: 'success',
          });
        }
        
        // Track auto-approval separately if it happened
        if (classificationResult.shouldAutoApprove) {
          await CardActionsService.trackAction({
            cardId: cardId,
            userId: userId,
            actionType: 'ai_auto_approved',
            actor: 'ai',
            actorDetails: {
              aiModel: 'gpt-4o-mini',
              confidence: classificationResult.overallConfidence,
            },
            previousValue: { status: 'pending' },
            newValue: { status: 'auto' },
            details: {
              reason: 'Matched auto-approval rules',
              matchedRules: classificationResult.matchedRules.map(r => r.ruleName),
              overallConfidence: classificationResult.overallConfidence,
            },
            status: 'success',
          });
        }
      }

      processedCards.push(inboxCard);
      console.log(`[EmailProcessor] Successfully processed email ${email.id} with classification and ${attachmentUrls.length} PDF attachments`);

    } catch (error) {
      console.error(`[EmailProcessor] Error processing email ${email.id}:`, error);
      continue; // Skip this email and continue with the next
    }
  }

  console.log(`[EmailProcessor] Processed ${processedCards.length} cards from ${emails.length} emails.`);
  return processedCards;
} 