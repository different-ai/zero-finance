/**
 * Transaction Attachments Router
 *
 * Handles file attachments for transactions (invoices, receipts, etc.)
 * Files stored in Vercel Blob, metadata in Postgres.
 */

import { z } from 'zod';
import { router, protectedProcedure } from '../create-router';
import { TRPCError } from '@trpc/server';
import { db } from '@/db';
import {
  transactionAttachments,
  ATTACHMENT_TRANSACTION_TYPES,
  type AttachmentTransactionType,
} from '@/db/schema/transaction-attachments';
import { eq, and, isNull } from 'drizzle-orm';
// Note: Vercel Blob operations (put/del) are handled in the upload API route

/**
 * Max file size: 10MB
 */
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Allowed content types
 */
const ALLOWED_CONTENT_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
  'text/plain',
];

/**
 * Input schema for transaction type
 */
const transactionTypeSchema = z.enum(ATTACHMENT_TRANSACTION_TYPES);

export const attachmentsRouter = router({
  /**
   * List attachments for a transaction
   */
  list: protectedProcedure
    .input(
      z.object({
        transactionType: transactionTypeSchema,
        transactionId: z.string().min(1),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { transactionType, transactionId } = input;
      const workspaceId = ctx.workspaceId;

      if (!workspaceId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Workspace context required',
        });
      }

      const attachments = await db
        .select()
        .from(transactionAttachments)
        .where(
          and(
            eq(transactionAttachments.transactionType, transactionType),
            eq(transactionAttachments.transactionId, transactionId),
            eq(transactionAttachments.workspaceId, workspaceId),
            isNull(transactionAttachments.deletedAt),
          ),
        )
        .orderBy(transactionAttachments.createdAt);

      return attachments;
    }),

  /**
   * Upload an attachment
   *
   * Note: File upload is handled via a separate API route that accepts FormData.
   * This mutation is called after the file is uploaded to get the blob URL.
   */
  create: protectedProcedure
    .input(
      z.object({
        transactionType: transactionTypeSchema,
        transactionId: z.string().min(1),
        blobUrl: z.string().url(),
        filename: z.string().min(1).max(255),
        contentType: z.string().min(1),
        fileSize: z.number().int().positive().max(MAX_FILE_SIZE),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const {
        transactionType,
        transactionId,
        blobUrl,
        filename,
        contentType,
        fileSize,
      } = input;
      const workspaceId = ctx.workspaceId;
      const userId = ctx.user?.id;

      if (!workspaceId || !userId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Workspace and user context required',
        });
      }

      // Validate content type
      if (!ALLOWED_CONTENT_TYPES.includes(contentType)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `File type not allowed. Allowed types: ${ALLOWED_CONTENT_TYPES.join(', ')}`,
        });
      }

      const [attachment] = await db
        .insert(transactionAttachments)
        .values({
          transactionType,
          transactionId,
          blobUrl,
          filename,
          contentType,
          fileSize,
          uploadedBy: userId,
          uploadSource: 'manual',
          workspaceId,
        })
        .returning();

      console.log(
        `[Attachments] Created attachment ${attachment.id} for ${transactionType}/${transactionId}`,
      );

      return attachment;
    }),

  /**
   * Delete an attachment (soft delete)
   */
  delete: protectedProcedure
    .input(
      z.object({
        attachmentId: z.string().uuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { attachmentId } = input;
      const workspaceId = ctx.workspaceId;

      if (!workspaceId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Workspace context required',
        });
      }

      // Find the attachment and verify ownership
      const [attachment] = await db
        .select()
        .from(transactionAttachments)
        .where(
          and(
            eq(transactionAttachments.id, attachmentId),
            eq(transactionAttachments.workspaceId, workspaceId),
            isNull(transactionAttachments.deletedAt),
          ),
        )
        .limit(1);

      if (!attachment) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Attachment not found',
        });
      }

      // Soft delete
      await db
        .update(transactionAttachments)
        .set({ deletedAt: new Date() })
        .where(eq(transactionAttachments.id, attachmentId));

      // Optionally delete from Vercel Blob (uncomment if you want hard delete)
      // try {
      //   await del(attachment.blobUrl);
      // } catch (error) {
      //   console.error(`[Attachments] Failed to delete blob: ${error}`);
      // }

      console.log(`[Attachments] Soft deleted attachment ${attachmentId}`);

      return { success: true };
    }),

  /**
   * Get a single attachment by ID
   */
  get: protectedProcedure
    .input(
      z.object({
        attachmentId: z.string().uuid(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { attachmentId } = input;
      const workspaceId = ctx.workspaceId;

      if (!workspaceId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Workspace context required',
        });
      }

      const [attachment] = await db
        .select()
        .from(transactionAttachments)
        .where(
          and(
            eq(transactionAttachments.id, attachmentId),
            eq(transactionAttachments.workspaceId, workspaceId),
            isNull(transactionAttachments.deletedAt),
          ),
        )
        .limit(1);

      if (!attachment) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Attachment not found',
        });
      }

      return attachment;
    }),
});
