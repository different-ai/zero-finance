/**
 * Transaction Attachments Schema
 *
 * Stores file attachments linked to transactions for compliance/record-keeping.
 * Supports multiple transaction types (offramp, crypto, invoices, etc.)
 *
 * Files are stored in Vercel Blob, metadata stored here.
 */

import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { workspaces } from './workspaces';

/**
 * Transaction types that can have attachments
 */
export const ATTACHMENT_TRANSACTION_TYPES = [
  'offramp', // Outgoing bank transfer
  'crypto_outgoing', // Outgoing crypto transfer
  'crypto_incoming', // Incoming crypto transfer
  'bank_receive', // Incoming bank deposit
  'invoice', // Invoice (created or received)
] as const;

export type AttachmentTransactionType =
  (typeof ATTACHMENT_TRANSACTION_TYPES)[number];

/**
 * How the attachment was uploaded
 */
export const ATTACHMENT_UPLOAD_SOURCES = [
  'manual', // User uploaded via UI
  'ai_email', // Extracted from forwarded email
  'mcp', // Uploaded via MCP agent
] as const;

export type AttachmentUploadSource = (typeof ATTACHMENT_UPLOAD_SOURCES)[number];

/**
 * Transaction attachments table
 */
export const transactionAttachments = pgTable(
  'transaction_attachments',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    // Polymorphic link to any transaction type
    transactionType: text('transaction_type', {
      enum: ATTACHMENT_TRANSACTION_TYPES,
    }).notNull(),
    transactionId: text('transaction_id').notNull(), // offramp ID, tx hash, or invoice ID

    // File storage (Vercel Blob)
    blobUrl: text('blob_url').notNull(),
    filename: text('filename').notNull(),
    contentType: text('content_type').notNull(),
    fileSize: integer('file_size').notNull(), // bytes

    // Audit trail
    uploadedBy: text('uploaded_by').notNull(), // privy DID or 'system:ai-email'
    uploadSource: text('upload_source', {
      enum: ATTACHMENT_UPLOAD_SOURCES,
    })
      .notNull()
      .default('manual'),

    // Workspace scoping
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),

    // Timestamps
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }), // soft delete
  },
  (table) => ({
    // Fast lookup by transaction
    txLookupIdx: index('tx_attachments_tx_lookup_idx').on(
      table.transactionType,
      table.transactionId,
    ),
    // Workspace scoping
    workspaceIdx: index('tx_attachments_workspace_idx').on(table.workspaceId),
    // Find non-deleted attachments
    activeIdx: index('tx_attachments_active_idx').on(
      table.workspaceId,
      table.deletedAt,
    ),
  }),
);

/**
 * Relations
 */
export const transactionAttachmentsRelations = relations(
  transactionAttachments,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [transactionAttachments.workspaceId],
      references: [workspaces.id],
    }),
  }),
);

/**
 * Type for inserting new attachments
 */
export type TransactionAttachment = typeof transactionAttachments.$inferSelect;
export type NewTransactionAttachment =
  typeof transactionAttachments.$inferInsert;
