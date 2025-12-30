/**
 * Attachment Copying Utilities
 *
 * Functions for copying attachments between transactions.
 * Used for payment linking (invoice → offramp) and similar flows.
 */

import { db } from '@/db';
import {
  transactionAttachments,
  type AttachmentTransactionType,
  type AttachmentUploadSource,
} from '@/db/schema/transaction-attachments';
import { eq, and, isNull } from 'drizzle-orm';

/**
 * Copy all attachments from one transaction to another.
 *
 * This is used for payment linking: when an invoice is paid via offramp,
 * the invoice's attachments are linked to the offramp transaction so they
 * appear in the transaction history.
 *
 * Note: This doesn't re-upload files - it creates new database records
 * pointing to the same Vercel Blob URLs.
 *
 * @param sourceType - The source transaction type (e.g., 'invoice')
 * @param sourceId - The source transaction ID
 * @param targetType - The target transaction type (e.g., 'offramp')
 * @param targetId - The target transaction ID
 * @param workspaceId - The workspace ID for scoping
 * @returns Number of attachments copied
 */
export async function copyAttachmentsBetweenTransactions(
  sourceType: AttachmentTransactionType,
  sourceId: string,
  targetType: AttachmentTransactionType,
  targetId: string,
  workspaceId: string,
): Promise<number> {
  // Find all active attachments for the source transaction
  const sourceAttachments = await db
    .select()
    .from(transactionAttachments)
    .where(
      and(
        eq(transactionAttachments.transactionType, sourceType),
        eq(transactionAttachments.transactionId, sourceId),
        eq(transactionAttachments.workspaceId, workspaceId),
        isNull(transactionAttachments.deletedAt),
      ),
    );

  if (sourceAttachments.length === 0) {
    console.log(
      `[Attachments] No attachments to copy from ${sourceType}/${sourceId}`,
    );
    return 0;
  }

  // Create new attachment records for the target transaction
  // Using the same blob URLs (no re-upload needed)
  const newAttachments = sourceAttachments.map((att) => ({
    transactionType: targetType,
    transactionId: targetId,
    workspaceId,
    blobUrl: att.blobUrl,
    filename: att.filename,
    contentType: att.contentType,
    fileSize: att.fileSize,
    uploadedBy: att.uploadedBy, // Preserve original uploader
    uploadSource: att.uploadSource as AttachmentUploadSource, // Preserve original source
  }));

  await db.insert(transactionAttachments).values(newAttachments);

  console.log(
    `[Attachments] Copied ${newAttachments.length} attachments from ${sourceType}/${sourceId} to ${targetType}/${targetId}`,
  );

  return newAttachments.length;
}

/**
 * Copy invoice attachments to an offramp transaction.
 *
 * Convenience wrapper for the common payment linking use case.
 *
 * @param invoiceId - The invoice ID
 * @param offrampId - The offramp transfer ID
 * @param workspaceId - The workspace ID
 * @returns Number of attachments copied
 */
export async function copyInvoiceAttachmentsToOfframp(
  invoiceId: string,
  offrampId: string,
  workspaceId: string,
): Promise<number> {
  return copyAttachmentsBetweenTransactions(
    'invoice',
    invoiceId,
    'offramp',
    offrampId,
    workspaceId,
  );
}
