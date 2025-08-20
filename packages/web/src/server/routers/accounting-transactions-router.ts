import { z } from 'zod';
import { db } from '@/db';
import {
  accountingTransactions,
  invoiceReconciliations,
} from '@/db/schema-accounting';
import { protectedProcedure, router } from '../create-router';
import { TRPCError } from '@trpc/server';
import {
  eq,
  and,
  desc,
  asc,
  inArray,
  gte,
  lte,
  sql,
  or,
  ilike,
} from 'drizzle-orm';

// Schema for creating/updating accounting transactions
const accountingTransactionSchema = z.object({
  source: z.enum(['xero', 'quickbooks', 'manual', 'bank_feed']),
  externalId: z.string(),
  externalUrl: z.string().optional(),
  transactionType: z.enum([
    'invoice',
    'bill_payment',
    'receipt',
    'expense',
    'journal',
    'transfer',
    'credit_note',
    'prepayment',
    'overpayment',
  ]),
  transactionNumber: z.string().optional(),
  reference: z.string().optional(),
  transactionDate: z.string(), // ISO date string
  dueDate: z.string().optional(),
  paidDate: z.string().optional(),
  contactName: z.string().optional(),
  contactId: z.string().optional(),
  subtotal: z.string().optional(),
  taxAmount: z.string().optional(),
  totalAmount: z.string(),
  amountPaid: z.string().optional(),
  amountDue: z.string().optional(),
  currency: z.string().default('USD'),
  exchangeRate: z.string().optional(),
  status: z.enum([
    'draft',
    'submitted',
    'authorised',
    'paid',
    'voided',
    'deleted',
  ]),
  lineItems: z.array(z.any()).optional(),
  glCode: z.string().optional(),
  glAccountName: z.string().optional(),
  taxCode: z.string().optional(),
  trackingCategories: z.record(z.string()).optional(),
  bankAccountCode: z.string().optional(),
  bankAccountName: z.string().optional(),
  attachments: z.array(z.any()).optional(),
  notes: z.string().optional(),
  metadata: z.any().optional(),
});

export const accountingTransactionsRouter = router({
  // Sync transactions from accounting system
  syncTransactions: protectedProcedure
    .input(
      z.object({
        source: z.enum(['xero', 'quickbooks']),
        transactions: z.array(accountingTransactionSchema),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      try {
        const results = await Promise.all(
          input.transactions.map(async (txn) => {
            // Check if transaction already exists
            const existing = await db
              .select()
              .from(accountingTransactions)
              .where(
                and(
                  eq(accountingTransactions.source, input.source),
                  eq(accountingTransactions.externalId, txn.externalId),
                ),
              )
              .limit(1);

            if (existing.length > 0) {
              // Update existing transaction
              const updated = await db
                .update(accountingTransactions)
                .set({
                  ...txn,
                  transactionDate: txn.transactionDate,
                  dueDate: txn.dueDate || null,
                  paidDate: txn.paidDate || null,
                  lastSyncedAt: new Date(),
                  updatedAt: new Date(),
                })
                .where(eq(accountingTransactions.id, existing[0].id))
                .returning();

              return { action: 'updated', transaction: updated[0] };
            } else {
              // Create new transaction
              const created = await db
                .insert(accountingTransactions)
                .values({
                  ...txn,
                  userId,
                  transactionDate: txn.transactionDate,
                  dueDate: txn.dueDate || null,
                  paidDate: txn.paidDate || null,
                  lastSyncedAt: new Date(),
                })
                .returning();

              return { action: 'created', transaction: created[0] };
            }
          }),
        );

        const createdCount = results.filter(
          (r) => r.action === 'created',
        ).length;
        const updatedCount = results.filter(
          (r) => r.action === 'updated',
        ).length;

        console.log(
          `[Accounting] Synced ${input.transactions.length} transactions for user ${userId}:`,
          {
            source: input.source,
            created: createdCount,
            updated: updatedCount,
          },
        );

        return {
          success: true,
          created: createdCount,
          updated: updatedCount,
          transactions: results.map((r) => r.transaction),
        };
      } catch (error) {
        console.error('[Accounting] Error syncing transactions:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to sync accounting transactions',
          cause: error,
        });
      }
    }),

  // Get transactions with filters
  getTransactions: protectedProcedure
    .input(
      z.object({
        source: z
          .enum(['xero', 'quickbooks', 'manual', 'bank_feed'])
          .optional(),
        transactionType: z
          .enum([
            'invoice',
            'bill_payment',
            'receipt',
            'expense',
            'journal',
            'transfer',
            'credit_note',
            'prepayment',
            'overpayment',
          ])
          .optional(),
        status: z
          .enum([
            'draft',
            'submitted',
            'authorised',
            'paid',
            'voided',
            'deleted',
          ])
          .optional(),
        dateFrom: z.string().optional(),
        dateTo: z.string().optional(),
        contactName: z.string().optional(),
        searchQuery: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
        sortBy: z
          .enum(['transactionDate', 'totalAmount', 'contactName', 'status'])
          .default('transactionDate'),
        sortOrder: z.enum(['asc', 'desc']).default('desc'),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      try {
        const whereConditions = [eq(accountingTransactions.userId, userId)];

        if (input.source) {
          whereConditions.push(eq(accountingTransactions.source, input.source));
        }

        if (input.transactionType) {
          whereConditions.push(
            eq(accountingTransactions.transactionType, input.transactionType),
          );
        }

        if (input.status) {
          whereConditions.push(eq(accountingTransactions.status, input.status));
        }

        if (input.dateFrom) {
          whereConditions.push(
            gte(accountingTransactions.transactionDate, input.dateFrom),
          );
        }

        if (input.dateTo) {
          whereConditions.push(
            lte(accountingTransactions.transactionDate, input.dateTo),
          );
        }

        if (input.contactName) {
          whereConditions.push(
            ilike(accountingTransactions.contactName, `%${input.contactName}%`),
          );
        }

        if (input.searchQuery) {
          const searchCondition = or(
            ilike(
              accountingTransactions.transactionNumber,
              `%${input.searchQuery}%`,
            ),
            ilike(accountingTransactions.reference, `%${input.searchQuery}%`),
            ilike(accountingTransactions.contactName, `%${input.searchQuery}%`),
            ilike(accountingTransactions.notes, `%${input.searchQuery}%`),
          );
          if (searchCondition) {
            whereConditions.push(searchCondition);
          }
        }

        const orderByColumn =
          input.sortBy === 'transactionDate'
            ? accountingTransactions.transactionDate
            : input.sortBy === 'totalAmount'
              ? accountingTransactions.totalAmount
              : input.sortBy === 'contactName'
                ? accountingTransactions.contactName
                : accountingTransactions.status;

        const orderBy =
          input.sortOrder === 'asc' ? asc(orderByColumn) : desc(orderByColumn);

        const transactions = await db
          .select()
          .from(accountingTransactions)
          .where(and(...whereConditions))
          .orderBy(orderBy)
          .limit(input.limit)
          .offset(input.offset);

        // Get total count for pagination
        const countResult = await db
          .select({ count: sql`count(*)` })
          .from(accountingTransactions)
          .where(and(...whereConditions));

        const total = Number(countResult[0]?.count || 0);

        return {
          transactions,
          total,
          hasMore: input.offset + transactions.length < total,
        };
      } catch (error) {
        console.error('[Accounting] Error fetching transactions:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch accounting transactions',
          cause: error,
        });
      }
    }),

  // Get unmatched transactions for reconciliation
  getUnmatchedTransactions: protectedProcedure
    .input(
      z.object({
        source: z.enum(['xero', 'quickbooks']).optional(),
        dateFrom: z.string().optional(),
        dateTo: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      try {
        // Get all transaction IDs that have been matched
        const matchedTransactions = await db
          .select({ transactionId: invoiceReconciliations.transactionId })
          .from(invoiceReconciliations)
          .where(eq(invoiceReconciliations.userId, userId));

        const matchedIds = matchedTransactions
          .map((m) => m.transactionId)
          .filter(Boolean) as string[];

        const whereConditions = [
          eq(accountingTransactions.userId, userId),
          eq(accountingTransactions.transactionType, 'invoice'),
        ];

        if (matchedIds.length > 0) {
          whereConditions.push(
            sql`${accountingTransactions.id} NOT IN (${sql.join(
              matchedIds.map((id) => sql`${id}`),
              sql`, `,
            )})`,
          );
        }

        if (input.source) {
          whereConditions.push(eq(accountingTransactions.source, input.source));
        }

        if (input.dateFrom) {
          whereConditions.push(
            gte(accountingTransactions.transactionDate, input.dateFrom),
          );
        }

        if (input.dateTo) {
          whereConditions.push(
            lte(accountingTransactions.transactionDate, input.dateTo),
          );
        }

        const unmatched = await db
          .select()
          .from(accountingTransactions)
          .where(and(...whereConditions))
          .orderBy(desc(accountingTransactions.transactionDate))
          .limit(input.limit);

        return {
          transactions: unmatched,
          total: unmatched.length,
        };
      } catch (error) {
        console.error(
          '[Accounting] Error fetching unmatched transactions:',
          error,
        );
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch unmatched transactions',
          cause: error,
        });
      }
    }),

  // Update transaction GL coding
  updateGLCoding: protectedProcedure
    .input(
      z.object({
        transactionId: z.string(),
        glCode: z.string(),
        glAccountName: z.string().optional(),
        trackingCategories: z.record(z.string()).optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      try {
        const updated = await db
          .update(accountingTransactions)
          .set({
            glCode: input.glCode,
            glAccountName: input.glAccountName,
            trackingCategories: input.trackingCategories,
            notes: input.notes,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(accountingTransactions.id, input.transactionId),
              eq(accountingTransactions.userId, userId),
            ),
          )
          .returning();

        if (updated.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message:
              'Transaction not found or you do not have permission to update it',
          });
        }

        console.log(
          `[Accounting] Updated GL coding for transaction ${input.transactionId}`,
        );

        return {
          success: true,
          transaction: updated[0],
        };
      } catch (error) {
        console.error('[Accounting] Error updating GL coding:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update GL coding',
          cause: error,
        });
      }
    }),

  // Get transaction statistics
  getStatistics: protectedProcedure
    .input(
      z.object({
        dateFrom: z.string().optional(),
        dateTo: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      try {
        const whereConditions = [eq(accountingTransactions.userId, userId)];

        if (input.dateFrom) {
          whereConditions.push(
            gte(accountingTransactions.transactionDate, input.dateFrom),
          );
        }

        if (input.dateTo) {
          whereConditions.push(
            lte(accountingTransactions.transactionDate, input.dateTo),
          );
        }

        // Get all transactions
        const transactions = await db
          .select()
          .from(accountingTransactions)
          .where(and(...whereConditions));

        // Calculate statistics
        const stats = {
          totalTransactions: transactions.length,
          totalAmount: transactions.reduce(
            (sum, t) => sum + parseFloat(t.totalAmount || '0'),
            0,
          ),
          byType: {} as Record<string, number>,
          byStatus: {} as Record<string, number>,
          bySource: {} as Record<string, number>,
          unpaidAmount: 0,
          overdueAmount: 0,
        };

        const today = new Date();

        transactions.forEach((txn) => {
          // By type
          stats.byType[txn.transactionType] =
            (stats.byType[txn.transactionType] || 0) + 1;

          // By status
          stats.byStatus[txn.status] = (stats.byStatus[txn.status] || 0) + 1;

          // By source
          stats.bySource[txn.source] = (stats.bySource[txn.source] || 0) + 1;

          // Unpaid amount
          if (txn.status !== 'paid' && txn.amountDue) {
            stats.unpaidAmount += parseFloat(txn.amountDue);

            // Overdue amount
            if (txn.dueDate && new Date(txn.dueDate) < today) {
              stats.overdueAmount += parseFloat(txn.amountDue);
            }
          }
        });

        return stats;
      } catch (error) {
        console.error('[Accounting] Error calculating statistics:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to calculate statistics',
          cause: error,
        });
      }
    }),
});
