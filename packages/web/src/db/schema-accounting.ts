import {
  pgTable,
  text,
  timestamp,
  varchar,
  uuid,
  boolean,
  jsonb,
  numeric,
  index,
  integer,
  date,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { inboxCards } from './schema';

// Accounting system sources
export type AccountingSource = 'xero' | 'quickbooks' | 'manual' | 'bank_feed';

// Transaction types
export type TransactionType =
  | 'invoice' // Bill from supplier
  | 'bill_payment' // Payment to supplier
  | 'receipt' // Money received
  | 'expense' // Direct expense
  | 'journal' // Journal entry
  | 'transfer' // Bank transfer
  | 'credit_note' // Credit note
  | 'prepayment' // Prepayment
  | 'overpayment'; // Overpayment

// Transaction status in accounting system
export type TransactionStatus =
  | 'draft'
  | 'submitted'
  | 'authorised'
  | 'paid'
  | 'voided'
  | 'deleted';

// Reconciliation status
export type ReconciliationStatus =
  | 'unmatched' // No match found
  | 'suggested' // System suggested match
  | 'matched' // Manually matched
  | 'auto_matched' // Automatically matched
  | 'disputed' // Match disputed
  | 'confirmed'; // Match confirmed

// Accounting Transactions table - stores data from Xero/QuickBooks
export const accountingTransactions = pgTable(
  'accounting_transactions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: varchar('user_id', { length: 255 }).notNull(),

    // Source system info
    source: text('source').$type<AccountingSource>().notNull(),
    externalId: varchar('external_id', { length: 255 }).notNull(), // ID in Xero/QB
    externalUrl: text('external_url'), // Link to transaction in Xero/QB

    // Transaction details
    transactionType: text('transaction_type')
      .$type<TransactionType>()
      .notNull(),
    transactionNumber: varchar('transaction_number', { length: 100 }), // Invoice/Bill number
    reference: varchar('reference', { length: 255 }), // Reference number

    // Dates
    transactionDate: date('transaction_date').notNull(),
    dueDate: date('due_date'),
    paidDate: date('paid_date'),

    // Parties
    contactName: varchar('contact_name', { length: 255 }),
    contactId: varchar('contact_id', { length: 255 }), // ID in accounting system

    // Financial details
    subtotal: numeric('subtotal', { precision: 20, scale: 2 }),
    taxAmount: numeric('tax_amount', { precision: 20, scale: 2 }),
    totalAmount: numeric('total_amount', { precision: 20, scale: 2 }).notNull(),
    amountPaid: numeric('amount_paid', { precision: 20, scale: 2 }).default(
      '0',
    ),
    amountDue: numeric('amount_due', { precision: 20, scale: 2 }),
    currency: varchar('currency', { length: 3 }).notNull().default('USD'),
    exchangeRate: numeric('exchange_rate', { precision: 10, scale: 6 }).default(
      '1',
    ),

    // Accounting details
    status: text('status').$type<TransactionStatus>().notNull(),
    lineItems: jsonb('line_items'), // Array of line items with GL codes
    glCode: varchar('gl_code', { length: 50 }), // Primary GL code
    glAccountName: varchar('gl_account_name', { length: 255 }),
    taxCode: varchar('tax_code', { length: 50 }),
    trackingCategories: jsonb('tracking_categories'), // Xero tracking or QB classes

    // Bank details
    bankAccountCode: varchar('bank_account_code', { length: 50 }),
    bankAccountName: varchar('bank_account_name', { length: 255 }),

    // Additional metadata
    attachments: jsonb('attachments'), // URLs to attachments
    notes: text('notes'),
    metadata: jsonb('metadata'), // Store additional system-specific data

    // Sync info
    lastSyncedAt: timestamp('last_synced_at').notNull().defaultNow(),
    syncError: text('sync_error'),

    // Timestamps
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('accounting_transactions_user_id_idx').on(table.userId),
    externalIdIdx: uniqueIndex('accounting_transactions_external_id_idx').on(
      table.source,
      table.externalId,
    ),
    transactionDateIdx: index('accounting_transactions_date_idx').on(
      table.transactionDate,
    ),
    statusIdx: index('accounting_transactions_status_idx').on(table.status),
    contactIdx: index('accounting_transactions_contact_idx').on(
      table.contactName,
    ),
  }),
);

// Invoice Reconciliation table - matches inbox cards (invoices) with accounting transactions
export const invoiceReconciliations = pgTable(
  'invoice_reconciliations',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: varchar('user_id', { length: 255 }).notNull(),

    // References
    inboxCardId: varchar('inbox_card_id', { length: 255 }).notNull(), // Reference to inbox card
    transactionId: uuid('transaction_id').references(
      () => accountingTransactions.id,
    ),

    // Match details
    matchStatus: text('match_status')
      .$type<ReconciliationStatus>()
      .notNull()
      .default('unmatched'),
    matchConfidence: numeric('match_confidence', { precision: 5, scale: 2 }), // 0-100
    matchMethod: varchar('match_method', { length: 50 }), // 'manual', 'auto_amount', 'auto_vendor', 'auto_invoice_number', etc.

    // Match criteria used
    matchedOn: jsonb('matched_on'), // { amount: true, vendor: true, date: false, invoice_number: true }

    // Discrepancies
    amountDiscrepancy: numeric('amount_discrepancy', {
      precision: 20,
      scale: 2,
    }),
    dateDiscrepancy: integer('date_discrepancy'), // Days difference
    discrepancyNotes: text('discrepancy_notes'),

    // User actions
    matchedBy: varchar('matched_by', { length: 255 }), // User who made the match
    matchedAt: timestamp('matched_at'),
    confirmedBy: varchar('confirmed_by', { length: 255 }),
    confirmedAt: timestamp('confirmed_at'),
    disputedBy: varchar('disputed_by', { length: 255 }),
    disputedAt: timestamp('disputed_at'),
    disputeReason: text('dispute_reason'),

    // GL Coding (can override transaction coding)
    glCode: varchar('gl_code', { length: 50 }),
    glAccountName: varchar('gl_account_name', { length: 255 }),
    costCenter: varchar('cost_center', { length: 100 }),
    department: varchar('department', { length: 100 }),
    project: varchar('project', { length: 100 }),

    // Approval workflow
    approvalStatus: varchar('approval_status', { length: 50 }).default(
      'pending',
    ), // pending, approved, rejected
    approvedBy: varchar('approved_by', { length: 255 }),
    approvedAt: timestamp('approved_at'),
    approvalNotes: text('approval_notes'),

    // Additional metadata
    metadata: jsonb('metadata'),

    // Timestamps
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('invoice_reconciliations_user_id_idx').on(table.userId),
    inboxCardIdx: index('invoice_reconciliations_inbox_card_idx').on(
      table.inboxCardId,
    ),
    transactionIdx: index('invoice_reconciliations_transaction_idx').on(
      table.transactionId,
    ),
    statusIdx: index('invoice_reconciliations_status_idx').on(
      table.matchStatus,
    ),
    uniqueMatch: uniqueIndex('invoice_reconciliations_unique_match').on(
      table.inboxCardId,
      table.transactionId,
    ),
  }),
);

// Relations
export const accountingTransactionsRelations = relations(
  accountingTransactions,
  ({ many }) => ({
    reconciliations: many(invoiceReconciliations),
  }),
);

export const invoiceReconciliationsRelations = relations(
  invoiceReconciliations,
  ({ one }) => ({
    transaction: one(accountingTransactions, {
      fields: [invoiceReconciliations.transactionId],
      references: [accountingTransactions.id],
    }),
  }),
);

// Helper type for line items
export interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  taxAmount?: number;
  glCode?: string;
  glAccountName?: string;
  taxCode?: string;
  trackingCategories?: Record<string, string>;
}

// Helper type for attachments
export interface Attachment {
  id: string;
  fileName: string;
  url: string;
  mimeType: string;
  size?: number;
  uploadedAt?: Date;
}

// Helper type for tracking categories (Xero) / Classes (QuickBooks)
export interface TrackingCategory {
  name: string;
  option: string;
}
