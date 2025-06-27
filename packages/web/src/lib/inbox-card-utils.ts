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
    metadata: dbCard.metadata || undefined,
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