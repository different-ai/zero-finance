import type { InboxCard } from '@/types/inbox';
import type { InboxCardDB } from '@/db/schema';
import type { AiProcessedDocument } from '@/server/services/ai-service';

/**
 * Convert UI InboxCard to database format for insertion
 */
export function uiCardToDbCard(card: InboxCard): Omit<InboxCardDB, 'id' | 'userId' | 'createdAt' | 'updatedAt'> {
  return {
    cardId: card.id,
    icon: card.icon,
    title: card.title,
    subtitle: card.subtitle,
    confidence: card.confidence,
    status: card.status,
    blocked: card.blocked,
    timestamp: new Date(card.timestamp),
    snoozedTime: card.snoozedTime || null,
    isAiSuggestionPending: card.isAiSuggestionPending || false,
    requiresAction: card.requiresAction || false,
    suggestedActionLabel: card.suggestedActionLabel || null,
    amount: card.amount || null,
    currency: card.currency || null,
    fromEntity: card.from || null,
    toEntity: card.to || null,
    logId: card.logId,
    subjectHash: card.subjectHash || null,
    rationale: card.rationale,
    codeHash: card.codeHash,
    chainOfThought: card.chainOfThought,
    impact: card.impact,
    parsedInvoiceData: card.parsedInvoiceData || null,
    sourceDetails: card.sourceDetails,
    comments: card.comments || [],
    suggestedUpdate: card.suggestedUpdate || null,
    metadata: card.metadata || null,
    sourceType: card.sourceType,
    embedding: null,
    // Financial fields
    dueDate: card.dueDate ? new Date(card.dueDate) : null,
    paymentStatus: card.paymentStatus || 'unpaid',
    paidAt: card.paidAt ? new Date(card.paidAt) : null,
    paidAmount: card.paidAmount || null,
    paymentMethod: card.paymentMethod || null,
    reminderDate: card.reminderDate ? new Date(card.reminderDate) : null,
    reminderSent: card.reminderSent || false,
    expenseCategory: card.expenseCategory || null,
    expenseNote: card.expenseNote || null,
    expenseAddedAt: card.expenseAddedAt ? new Date(card.expenseAddedAt) : null,
    addedToExpenses: card.addedToExpenses || false,
    // Fraud fields
    markedAsFraud: card.markedAsFraud || false,
    fraudMarkedAt: card.fraudMarkedAt ? new Date(card.fraudMarkedAt) : null,
    fraudReason: card.fraudReason || null,
    fraudMarkedBy: card.fraudMarkedBy || null,
    // Attachment fields
    hasAttachments: card.hasAttachments || false,
    attachmentUrls: card.attachmentUrls || null,
    // Classification fields
    appliedClassifications: card.appliedClassifications || [],
    classificationTriggered: card.classificationTriggered || false,
    autoApproved: card.autoApproved || false,
    categories: card.categories || [],
    // Raw text content for better extraction
    rawTextContent: null, // UI cards don't store raw text content
  };
}

/**
 * Convert database InboxCardDB to UI InboxCard format
 */
export function dbCardToUiCard(dbCard: InboxCardDB): InboxCard {
  return {
    id: dbCard.cardId,
    icon: dbCard.icon as any, // Type assertion for icon enum
    title: dbCard.title,
    subtitle: dbCard.subtitle,
    confidence: dbCard.confidence,
    status: dbCard.status as any, // Type assertion for status enum
    blocked: dbCard.blocked,
    timestamp: dbCard.timestamp.toISOString(),
    snoozedTime: dbCard.snoozedTime || undefined,
    isAiSuggestionPending: dbCard.isAiSuggestionPending || undefined,
    requiresAction: dbCard.requiresAction || undefined,
    suggestedActionLabel: dbCard.suggestedActionLabel || undefined,
    amount: dbCard.amount || undefined,
    currency: dbCard.currency || undefined,
    from: dbCard.fromEntity || undefined,
    to: dbCard.toEntity || undefined,
    metadata: dbCard.metadata as any || {},
    logId: dbCard.logId,
    subjectHash: dbCard.subjectHash || undefined,
    rationale: dbCard.rationale,
    codeHash: dbCard.codeHash,
    chainOfThought: dbCard.chainOfThought,
    impact: dbCard.impact as any,
    parsedInvoiceData: (dbCard.parsedInvoiceData && Object.keys(dbCard.parsedInvoiceData).length > 0) ? dbCard.parsedInvoiceData as AiProcessedDocument : undefined,
    sourceType: dbCard.sourceType as any, // Type assertion for source type enum
    sourceDetails: dbCard.sourceDetails as any,
    comments: (dbCard.comments as any) || [],
    suggestedUpdate: dbCard.suggestedUpdate || undefined,
    // Financial fields
    dueDate: dbCard.dueDate ? dbCard.dueDate.toISOString() : undefined,
    paymentStatus: dbCard.paymentStatus as any,
    paidAt: dbCard.paidAt ? dbCard.paidAt.toISOString() : undefined,
    paidAmount: dbCard.paidAmount || undefined,
    paymentMethod: dbCard.paymentMethod || undefined,
    reminderDate: dbCard.reminderDate ? dbCard.reminderDate.toISOString() : undefined,
    reminderSent: dbCard.reminderSent || undefined,
    expenseCategory: dbCard.expenseCategory || undefined,
    expenseNote: dbCard.expenseNote || undefined,
    expenseAddedAt: dbCard.expenseAddedAt ? dbCard.expenseAddedAt.toISOString() : undefined,
    addedToExpenses: dbCard.addedToExpenses || undefined,
    // Fraud fields
    markedAsFraud: dbCard.markedAsFraud || undefined,
    fraudMarkedAt: dbCard.fraudMarkedAt ? dbCard.fraudMarkedAt.toISOString() : undefined,
    fraudReason: dbCard.fraudReason || undefined,
    fraudMarkedBy: dbCard.fraudMarkedBy || undefined,
    // Attachment fields
    hasAttachments: dbCard.hasAttachments || undefined,
    attachmentUrls: dbCard.attachmentUrls || undefined,
    // Classification fields
    appliedClassifications: dbCard.appliedClassifications as any || [],
    classificationTriggered: dbCard.classificationTriggered || false,
    autoApproved: dbCard.autoApproved || false,
    categories: dbCard.categories || [],
  };
}

/**
 * Prepare UI card data for tRPC input (handle dates and required fields)
 */
export function prepareCardForTrpc(card: InboxCard) {
  return {
    cardId: card.id,
    icon: card.icon,
    title: card.title,
    subtitle: card.subtitle,
    confidence: card.confidence,
    status: card.status,
    blocked: card.blocked,
    timestamp: card.timestamp,
    snoozedTime: card.snoozedTime,
    isAiSuggestionPending: card.isAiSuggestionPending || false,
    requiresAction: card.requiresAction || false,
    suggestedActionLabel: card.suggestedActionLabel,
    amount: card.amount,
    currency: card.currency,
    fromEntity: card.from,
    toEntity: card.to,
    logId: card.logId,
    subjectHash: card.subjectHash || null,
    rationale: card.rationale,
    codeHash: card.codeHash,
    chainOfThought: card.chainOfThought,
    impact: card.impact,
    parsedInvoiceData: card.parsedInvoiceData,
    sourceDetails: card.sourceDetails,
    comments: card.comments || [],
    suggestedUpdate: card.suggestedUpdate,
    metadata: card.metadata,
    sourceType: card.sourceType,
  };
} 