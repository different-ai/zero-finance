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
    
    // Create hashes for duplicate detection
    const subjectHash = createSubjectHash(email.subject);
    const contentHash = createContentHash(email);
    
    // Check for duplicates using multiple strategies
    const isDuplicate = await findSimilarExistingCards(userId, email, subjectHash, contentHash);
    if (isDuplicate) {
      console.log(`[EmailProcessor - Skipping Duplicate] Email ID: ${email.id}, Subject: "${email.subject}"`);
      continue;
    }

    const emailContentForAI = `${email.subject || ''}\n\n${email.textBody || email.htmlBody || ''}`.trim();
    let aiData: AiProcessedDocument | null = null;

    if (emailContentForAI) {
      // Directly process the email content with the AI service.
      aiData = await processDocumentFromEmailText(
        emailContentForAI,
        email.subject === null ? undefined : email.subject,
        userPrompts
      );
    }

    // Process PDF attachments if any
    let pdfResults: Awaited<ReturnType<typeof processPdfAttachments>> = [];
    if (email.attachments.length > 0) {
      console.log(`[EmailProcessor] Processing ${email.attachments.length} attachments for email ${email.id}`);
      pdfResults = await processPdfAttachments(email.id, email.attachments, accessToken, userPrompts);
      
      // Merge PDF results with email analysis
      if (pdfResults.length > 0) {
        aiData = mergePdfResultsWithEmail(aiData, pdfResults);
      }
    }

    // Since we're already filtering at Gmail API level with keywords,
    // we don't need additional filtering here. Just check if AI processing succeeded.
    if (!aiData) {
      console.log(`[EmailProcessor - AI Failed] Email ID: ${email.id}, Subject: "${email.subject}". Skipping due to AI processing failure.`);
      continue;
    }

    // If criteria are met, proceed to create the InboxCard
    const cardId = uuidv4();
    const senderName = extractSenderName(email.from);

    // Transform attachment metadata from Gmail service to our InboxCard format
    // And attempt to download attachments
    const inboxAttachments: InboxAttachmentMetadata[] = [];
    
    // Add extracted text from PDFs to attachment metadata
    for (let i = 0; i < email.attachments.length; i++) {
        const att = email.attachments[i];
        let tempPath: string | undefined = undefined;
        let extractedText: string | undefined = undefined;
        
        // Find corresponding PDF result if this is a PDF
        if (att.mimeType.includes('pdf') && pdfResults.length > 0) {
            const pdfResult = pdfResults.find(result => 
                result.success && 
                result.extractedText && 
                email.attachments.findIndex(a => a.filename === att.filename) !== -1
            );
            if (pdfResult) {
                extractedText = pdfResult.extractedText || undefined;
            }
        }
        
        if (att.attachmentId) {
            console.log(`[EmailProcessor] Attachment: ${att.filename} (ID: ${att.attachmentId}) for email ${email.id}`);
            // Note: We already downloaded and processed PDFs above, no need to download again
            if (att.mimeType.includes('pdf')) {
                console.log(`[EmailProcessor] PDF already processed: ${att.filename}`);
            }
        }
        
        inboxAttachments.push({
            filename: att.filename,
            mimeType: att.mimeType,
            size: att.size,
            attachmentId: att.attachmentId,
            tempPath: tempPath, // Add the temporary path
            extractedText: extractedText, // Add extracted text from PDFs
        });
    }

    const cardTitle = aiData?.extractedTitle || email.subject || 'No Subject';
    const cardSubtitle = aiData?.extractedSummary || `From: ${senderName} - ${email.snippet?.substring(0, 100) || ''}...`;
    const cardConfidence = aiData?.confidence || 30; // Fallback confidence if AI fails
    const cardIcon = aiData?.documentType ? mapDocumentTypeToIcon(aiData.documentType) : 'email';
    const cardRationale = aiData?.aiRationale || 'Email processed; AI analysis result pending or unavailable.';
    const cardRequiresAction = aiData?.requiresAction || false; // Get from AI or default to false
    const cardSuggestedActionLabel = aiData?.suggestedActionLabel; // Get from AI

    // Extract financial data for the new fields
    const hasFinancialData = aiData?.amount !== undefined && aiData?.amount !== null;
    const paymentStatus = hasFinancialData ? 'unpaid' : 'not_applicable';
    const dueDate = aiData?.dueDate ? new Date(aiData.dueDate).toISOString() : undefined;

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
      codeHash: `email-processor-v1-${process.env.VERCEL_GIT_COMMIT_SHA?.substring(0, 8) || 'local'}`,
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
      // New financial fields
      amount: aiData?.amount?.toString(),
      currency: aiData?.currency === null ? undefined : aiData?.currency,
      paymentStatus: paymentStatus as any,
      dueDate: dueDate,
      hasAttachments: inboxAttachments.length > 0,
      from: senderName === null ? undefined : senderName,
      to: aiData?.buyerName === null ? undefined : aiData?.buyerName,
    };
    processedCards.push(card);
    console.log(`[EmailProcessor] Created card for email: ${email.id}, Subject: "${email.subject}", Card ID: ${cardId}`);
  }
  console.log(`[EmailProcessor] Finished processing. Generated ${processedCards.length} cards from ${emails.length} emails.`);
  return processedCards;
} 