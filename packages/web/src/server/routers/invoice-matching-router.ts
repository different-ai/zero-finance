import { z } from 'zod';
import { router, protectedProcedure } from '../create-router';
import { db } from '@/db';
import { rawTransactionsTable, invoicesTable, matchesTable } from '@/db/schema';
import { eq, and, desc, sql, gte, lte } from 'drizzle-orm';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { put } from '@vercel/blob';
import {
  matchProposalSchema,
  csvTransactionSchema,
  bulkTransactionImportSchema,
} from '@/lib/reconciliation-schemas';
import { aiDocumentProcessSchema } from '@/lib/ai-schemas';
import { TRPCError } from '@trpc/server';
import Papa from 'papaparse';

// Helper to extract text from PDF
async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    // TODO: Implement PDF parsing when pdf-parse is installed
    // const data = await pdfParse(buffer);
    // return data.text || '';
    return 'PDF content extraction not implemented';
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    return '';
  }
}

export const invoiceMatchingRouter = router({
  // Upload and parse invoice (PDF or image)
  uploadInvoice: protectedProcedure
    .input(
      z.object({
        file: z.object({
          data: z.string(), // Base64 encoded file data
          name: z.string(),
          type: z.string(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const { file } = input;

      try {
        // Decode base64 to buffer
        const buffer = Buffer.from(file.data, 'base64');

        // Store the raw file
        const blob = await put(
          `invoices/${crypto.randomUUID()}-${file.name}`,
          buffer,
          {
            access: 'public',
            contentType: file.type || 'application/octet-stream',
          },
        );

        const docUrl = blob.url;
        let processed;

        if (file.type === 'application/pdf') {
          // Extract text from PDF
          const text = await extractPdfText(buffer);

          if (!text || text.trim().length < 20) {
            throw new TRPCError({
              code: 'UNPROCESSABLE_CONTENT',
              message: 'PDF has no extractable text',
            });
          }

          // Use AI to parse the text
          const { object } = await generateObject({
            model: openai('gpt-4o-mini'),
            schema: aiDocumentProcessSchema,
            temperature: 0,
            prompt:
              `You are extracting structured invoice data from text.\n` +
              `Return ONLY the schema.\n\n` +
              `TEXT:\n${text.slice(0, 40000)}`,
          });

          processed = object;
        } else if (file.type.startsWith('image/')) {
          // Multimodal extraction with the image directly
          const dataUrl = `data:${file.type};base64,${file.data}`;

          const { object } = await generateObject({
            model: openai('gpt-4o-mini'),
            schema: aiDocumentProcessSchema,
            temperature: 0,
            messages: [
              {
                role: 'system',
                content:
                  'Extract structured invoice data from the provided image.',
              },
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: 'Please parse this invoice image into the schema.',
                  },
                  {
                    type: 'image',
                    image: dataUrl,
                  },
                ] as any,
              },
            ],
          });

          processed = object;
        } else {
          throw new TRPCError({
            code: 'UNSUPPORTED_MEDIA_TYPE',
            message: 'Unsupported file type',
          });
        }

        // Extract key fields with fallbacks
        const amount = processed.amount ?? 0;
        const number = processed.invoiceNumber ?? null;
        const vendor = processed.sellerName ?? processed.extractedTitle ?? null;
        const due = processed.dueDate ?? null;
        const issue = processed.issueDate ?? null;
        const confidence = processed.confidence ?? 0;

        // Save to database
        const [invoice] = await db
          .insert(invoicesTable)
          .values({
            userId,
            invoiceNumber: number,
            vendor,
            issueDate: issue ? new Date(issue) : null,
            dueDate: due ? new Date(due) : null,
            currency: processed.currency || 'USD',
            totalAmount: amount.toString(),
            parsedConfidence: confidence.toString(),
            docUrl,
            raw: processed,
          })
          .returning();

        return { invoice };
      } catch (error) {
        console.error('[InvoiceMatching] Error uploading invoice:', error);
        throw error;
      }
    }),

  // Import transactions from CSV
  importTransactions: protectedProcedure
    .input(
      z.object({
        csvData: z.string(),
        source: z.string().default('csv_import'),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      try {
        // Parse CSV
        const parseResult = Papa.parse(input.csvData, {
          header: true,
          skipEmptyLines: true,
        });

        if (parseResult.errors.length > 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `CSV parsing errors: ${parseResult.errors.map((e) => e.message).join(', ')}`,
          });
        }

        const rows = parseResult.data as any[];
        const transactions = [];

        // Process each row
        for (const row of rows) {
          // Flexible field mapping
          const date =
            row.Date || row.date || row.TransactionDate || row.txn_date;
          const amount = row.Amount || row.amount || row.Value || row.value;
          const description =
            row.Description || row.description || row.Memo || row.memo || '';
          const counterparty =
            row.Counterparty ||
            row.counterparty ||
            row.Vendor ||
            row.vendor ||
            '';
          const reference =
            row.Reference || row.reference || row.ID || row.id || '';
          const currency = row.Currency || row.currency || 'USD';

          if (!date || !amount) {
            continue; // Skip rows without essential data
          }

          transactions.push({
            userId,
            source: input.source,
            externalId: reference || null,
            txnDate: new Date(date),
            amount: parseFloat(
              amount.toString().replace(/[^0-9.-]/g, ''),
            ).toString(),
            currency,
            counterparty: counterparty || null,
            memo: description || null,
            raw: row,
          });
        }

        if (transactions.length === 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'No valid transactions found in CSV',
          });
        }

        // Bulk insert transactions
        const inserted = await db
          .insert(rawTransactionsTable)
          .values(transactions)
          .returning();

        return {
          success: true,
          imported: inserted.length,
          message: `Successfully imported ${inserted.length} transactions`,
        };
      } catch (error) {
        console.error('[InvoiceMatching] Error importing transactions:', error);
        throw error;
      }
    }),

  // Propose matches using AI
  proposeMatches: protectedProcedure
    .input(
      z.object({
        windowDays: z.number().default(90),
        amountTolerancePct: z.number().default(1.0),
        maxInvoices: z.number().default(150),
        maxTransactions: z.number().default(400),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      try {
        // Calculate date window
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - input.windowDays);

        // Fetch unmatched invoices
        const existingInvoiceMatches = await db
          .select({ invoiceId: matchesTable.invoiceId })
          .from(matchesTable)
          .where(eq(matchesTable.userId, userId));

        const matchedInvoiceIds = existingInvoiceMatches.map(
          (m) => m.invoiceId,
        );

        const invoicesQuery = db
          .select()
          .from(invoicesTable)
          .where(
            and(
              eq(invoicesTable.userId, userId),
              matchedInvoiceIds.length > 0
                ? sql`${invoicesTable.id} NOT IN (${sql.join(
                    matchedInvoiceIds.map((id) => sql`${id}`),
                    sql`, `,
                  )})`
                : sql`true`,
            ),
          )
          .limit(input.maxInvoices);

        const invoices = await invoicesQuery;

        // Fetch unmatched transactions
        const existingTxMatches = await db
          .select({ transactionId: matchesTable.transactionId })
          .from(matchesTable)
          .where(eq(matchesTable.userId, userId));

        const matchedTxIds = existingTxMatches.map((m) => m.transactionId);

        const transactionsQuery = db
          .select()
          .from(rawTransactionsTable)
          .where(
            and(
              eq(rawTransactionsTable.userId, userId),
              gte(rawTransactionsTable.txnDate, startDate),
              lte(rawTransactionsTable.txnDate, endDate),
              matchedTxIds.length > 0
                ? sql`${rawTransactionsTable.id} NOT IN (${sql.join(
                    matchedTxIds.map((id) => sql`${id}`),
                    sql`, `,
                  )})`
                : sql`true`,
            ),
          )
          .limit(input.maxTransactions);

        const transactions = await transactionsQuery;

        // Build compact payloads for AI
        const invoicesPayload = invoices.map((i) => ({
          id: i.id,
          number: i.invoiceNumber || null,
          vendor: i.vendor || null,
          date: i.issueDate?.toISOString().slice(0, 10) || null,
          due: i.dueDate?.toISOString().slice(0, 10) || null,
          amount: parseFloat(i.totalAmount),
          currency: i.currency,
        }));

        const txPayload = transactions.map((t) => ({
          id: t.id,
          date: t.txnDate.toISOString().slice(0, 10),
          amount: parseFloat(t.amount),
          currency: t.currency,
          counterparty: t.counterparty || null,
          memo: t.memo || null,
        }));

        // Prepare AI prompt
        const system = [
          'You link invoices to bank transactions.',
          'Rules:',
          `- amount tolerance percent: ${input.amountTolerancePct}`,
          `- date window days: ${input.windowDays}`,
          '- only one transaction per invoice',
          '- prefer exact invoice number matches when present',
          '- normalize vendor names for fuzzy matches',
          '- if unsure, leave unmatched',
        ].join('\n');

        const userPrompt = JSON.stringify({
          invoices: invoicesPayload,
          transactions: txPayload,
        });

        // Get AI suggestions
        const { object } = await generateObject({
          model: openai('gpt-4o-mini'),
          schema: matchProposalSchema,
          temperature: 0,
          prompt: `${system}\n\nReturn JSON only for this data:\n${userPrompt}`,
        });

        // Save suggestions to database
        const savedMatches = [];
        for (const match of object.matches) {
          try {
            const [saved] = await db
              .insert(matchesTable)
              .values({
                userId,
                invoiceId: match.invoice_id,
                transactionId: match.transaction_id,
                status: 'suggested',
                score: match.score?.toString(),
                rationale: match.rationale || null,
                adjustments: match.adjustments || [],
              })
              .onConflictDoNothing()
              .returning();

            if (saved) {
              savedMatches.push(saved);
            }
          } catch (error) {
            console.error('Error saving match:', error);
          }
        }

        return {
          suggested: savedMatches.length,
          unmatchedInvoices: object.unmatched_invoices,
        };
      } catch (error) {
        console.error('[InvoiceMatching] Error proposing matches:', error);
        throw error;
      }
    }),

  // Confirm a match
  confirmMatch: protectedProcedure
    .input(
      z.object({
        matchId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const [updated] = await db
        .update(matchesTable)
        .set({
          status: 'confirmed',
          decidedBy: userId,
          decidedAt: new Date(),
        })
        .where(
          and(
            eq(matchesTable.id, input.matchId),
            eq(matchesTable.userId, userId),
          ),
        )
        .returning();

      if (!updated) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Match not found',
        });
      }

      return { success: true };
    }),

  // Reject a match
  rejectMatch: protectedProcedure
    .input(
      z.object({
        matchId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const [updated] = await db
        .update(matchesTable)
        .set({
          status: 'rejected',
          decidedBy: userId,
          decidedAt: new Date(),
        })
        .where(
          and(
            eq(matchesTable.id, input.matchId),
            eq(matchesTable.userId, userId),
          ),
        )
        .returning();

      if (!updated) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Match not found',
        });
      }

      return { success: true };
    }),

  // Get all data for reconciliation page
  getReconciliationData: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    // Fetch all data in parallel
    const [transactions, invoices, matches] = await Promise.all([
      db
        .select()
        .from(rawTransactionsTable)
        .where(eq(rawTransactionsTable.userId, userId))
        .orderBy(desc(rawTransactionsTable.txnDate)),

      db
        .select()
        .from(invoicesTable)
        .where(eq(invoicesTable.userId, userId))
        .orderBy(desc(invoicesTable.createdAt)),

      db
        .select({
          match: matchesTable,
          invoice: invoicesTable,
          transaction: rawTransactionsTable,
        })
        .from(matchesTable)
        .leftJoin(invoicesTable, eq(matchesTable.invoiceId, invoicesTable.id))
        .leftJoin(
          rawTransactionsTable,
          eq(matchesTable.transactionId, rawTransactionsTable.id),
        )
        .where(eq(matchesTable.userId, userId))
        .orderBy(desc(matchesTable.createdAt)),
    ]);

    return {
      transactions,
      invoices,
      matches,
    };
  }),
});
