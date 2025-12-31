import {
  pgTable,
  text,
  timestamp,
  jsonb,
  uuid,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { workspaces } from './workspaces';

/**
 * Processed Email Messages (Idempotency)
 *
 * Tracks which email message IDs have already been processed to prevent
 * duplicate webhook processing. Webhooks can be delivered multiple times
 * (retries, duplicates), and processing the same email twice causes race
 * conditions that corrupt session state.
 *
 * TTL: 24 hours (same as session TTL)
 */
export const processedEmailMessages = pgTable(
  'processed_email_messages',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    messageId: text('message_id').notNull(), // Email Message-ID header
    workspaceId: uuid('workspace_id').notNull(),
    processedAt: timestamp('processed_at').defaultNow().notNull(),
    expiresAt: timestamp('expires_at').notNull(), // For cleanup
  },
  (table) => [
    // Unique constraint to prevent duplicates
    uniqueIndex('idx_processed_email_messages_unique').on(
      table.messageId,
      table.workspaceId,
    ),
    // For cleanup job
    index('idx_processed_email_messages_expires').on(table.expiresAt),
  ],
);

export type ProcessedEmailMessage = typeof processedEmailMessages.$inferSelect;
export type NewProcessedEmailMessage =
  typeof processedEmailMessages.$inferInsert;

/**
 * AI Email Sessions
 *
 * Stores conversation state for the AI email invoice agent.
 * Each session tracks an email thread for invoice creation.
 *
 * Flow:
 * 1. User forwards email to {workspaceId}@ai.0.finance
 * 2. Webhook creates session with workspaceId extracted from "to" address
 * 3. AI processes email, creates invoice, asks for confirmation
 * 4. User replies YES/NO
 * 5. Session updated, invoice sent or cancelled
 * 6. Session expires after 24 hours
 */

export type AiEmailSessionState =
  | 'active' // Initial state, processing user request
  | 'awaiting_confirmation' // Waiting for user to confirm invoice send
  | 'completed' // Invoice sent or user cancelled
  | 'expired'; // Session timed out

export interface AiEmailMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

/**
 * Transaction match result for attachment operations
 *
 * For offramp transactions:
 * - sourceAmount/sourceToken: What the user sent (e.g., 3500 USDC)
 * - destinationAmount/destinationCurrency: What recipient received (e.g., 2963.40 EUR)
 *
 * The AI should primarily match on sourceAmount since invoices are typically
 * in USD and USDC ≈ USD. Display format: "$3,500 USDC → €2,963.40 EUR"
 */
export interface TransactionMatch {
  id: string;
  type: 'offramp' | 'crypto_outgoing' | 'crypto_incoming';
  sourceAmount: string; // What user sent (e.g., "3500.00" USDC)
  sourceToken: string; // Usually "usdc"
  destinationAmount: string; // What recipient received (e.g., "2963.40")
  destinationCurrency: string; // e.g., "eur", "usd"
  recipientName?: string;
  recipientBank?: string;
  date: string;
  score: number; // Matching confidence score
}

/**
 * Attachment info for pending actions
 */
export interface AttachmentInfo {
  id: string;
  filename: string;
  contentType: string;
  fileSize: number;
  blobUrl: string;
}

/**
 * Attachment-to-transaction match for multi-attach
 * Stores the temp blob URL so attachment persists across confirmation round-trip
 */
export interface AttachmentTransactionMatch {
  tempBlobUrl: string; // Uploaded to Vercel Blob immediately
  filename: string;
  contentType: string;
  fileSize: number;
  transaction: TransactionMatch;
}

/**
 * Payment account details for sharing
 */
export interface PaymentAccountDetails {
  type: 'us_ach' | 'iban';
  currency: string;
  bankName: string | null;
  routingNumber?: string | null;
  accountNumber?: string | null;
  iban?: string | null;
  bicSwift?: string | null;
  beneficiaryName: string;
}

/**
 * Pending action types for confirmation flow
 */
export type AiEmailPendingAction =
  | {
      type: 'send_invoice';
      invoiceId: string;
      recipientEmail: string;
      recipientName?: string;
      amount: number;
      currency: string;
      description: string;
      invoiceLink: string;
    }
  | {
      type: 'attach_document';
      bestMatch: TransactionMatch;
      alternatives: TransactionMatch[];
      // Attachment is uploaded to Vercel Blob immediately so it persists across confirmation round-trip
      tempBlobUrl: string; // Already uploaded to attachments/temp/{sessionId}/{filename}
      attachmentFilename: string;
      attachmentContentType: string;
      attachmentSize: number;
    }
  | {
      type: 'attach_multiple';
      matches: AttachmentTransactionMatch[];
    }
  | {
      type: 'remove_attachment';
      bestMatch: AttachmentInfo & { transaction: TransactionMatch };
      alternatives: Array<AttachmentInfo & { transaction: TransactionMatch }>;
    }
  | {
      type: 'send_payment_details';
      recipientEmail: string;
      recipientName?: string;
      usdAccount: {
        type: 'us_ach';
        currency: string;
        bankName: string | null;
        routingNumber: string | null;
        accountNumber: string | null;
        beneficiaryName: string;
      } | null;
      eurAccount: {
        type: 'iban';
        currency: string;
        bankName: string | null;
        iban: string | null;
        bicSwift: string | null;
        beneficiaryName: string;
      } | null;
      senderName: string;
      senderCompany?: string;
    }
  | {
      /**
       * User sent an attachment, AI read it, but no exact transaction match found.
       * AI uploaded the attachment to Vercel Blob and asked user which transaction to attach to.
       * When user replies with their selection, use attachStoredDocument tool.
       */
      type: 'select_transaction_for_attachment';
      tempBlobUrl: string; // Already uploaded to Vercel Blob
      attachmentFilename: string;
      attachmentContentType: string;
      attachmentSize: number;
      extractedDetails: {
        vendor?: string;
        amount?: number;
        currency?: string;
        date?: string;
        description?: string;
      };
      candidateTransactions: Array<{
        id: string;
        amount: string;
        currency: string;
        recipientName?: string;
        date: string;
      }>;
    };

export interface AiEmailExtractedData {
  recipientEmail?: string;
  recipientName?: string;
  recipientCompany?: string;
  amount?: number;
  currency?: string;
  description?: string;
  billingAddress?: string;
}

export const aiEmailSessions = pgTable(
  'ai_email_sessions',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    // Session identification
    senderEmail: text('sender_email').notNull(), // Who forwarded the email (e.g., ben@gmail.com)
    threadId: text('thread_id').notNull(), // From Message-ID header for threading replies

    // Workspace mapping (extracted from "to" address: {workspaceId}@ai.0.finance)
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id),

    // The user ID who will own the invoice (workspace creator)
    creatorUserId: text('creator_user_id').notNull(),

    // Session state machine
    state: text('state')
      .$type<AiEmailSessionState>()
      .notNull()
      .default('active'),

    // Pending action for confirmation flow
    pendingAction: jsonb('pending_action').$type<AiEmailPendingAction | null>(),

    // Conversation history for AI context
    messages: jsonb('messages').$type<AiEmailMessage[]>().notNull().default([]),

    // Extracted invoice data (accumulated across messages)
    extractedData: jsonb('extracted_data').$type<AiEmailExtractedData | null>(),

    // Created invoice ID (if any)
    invoiceId: uuid('invoice_id'),

    // Timestamps
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    expiresAt: timestamp('expires_at').notNull(), // 24hr TTL
  },
  (table) => [
    // Fast lookup by sender + thread for reply handling
    index('idx_ai_email_sessions_lookup').on(table.senderEmail, table.threadId),
    // Find sessions by workspace
    index('idx_ai_email_sessions_workspace').on(table.workspaceId),
    // Cleanup expired sessions
    index('idx_ai_email_sessions_expires').on(table.expiresAt),
  ],
);

export const aiEmailSessionsRelations = relations(
  aiEmailSessions,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [aiEmailSessions.workspaceId],
      references: [workspaces.id],
    }),
  }),
);

// Type exports
export type AiEmailSession = typeof aiEmailSessions.$inferSelect;
export type NewAiEmailSession = typeof aiEmailSessions.$inferInsert;
