import {
  pgTable,
  text,
  timestamp,
  jsonb,
  uuid,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { workspaces } from './workspaces';

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

export interface AiEmailPendingAction {
  type: 'send_invoice';
  invoiceId: string;
  recipientEmail: string;
  recipientName?: string;
  amount: number;
  currency: string;
  description: string;
  invoiceLink: string;
}

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
