'use client';

import React, { useRef, useState } from 'react';
import { trpc } from '@/utils/trpc';
import { Button } from '@/components/ui/button';
import {
  Paperclip,
  FileText,
  Image as ImageIcon,
  X,
  Download,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { AttachmentTransactionType } from '@/db/schema/transaction-attachments';

interface TransactionAttachmentsProps {
  transactionType: AttachmentTransactionType;
  transactionId: string;
  className?: string;
}

/**
 * Get icon for file type
 */
function getFileIcon(contentType: string) {
  if (contentType.startsWith('image/')) {
    return <ImageIcon className="h-4 w-4" />;
  }
  return <FileText className="h-4 w-4" />;
}

/**
 * Format file size for display
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Transaction Attachments Component
 *
 * Displays and manages file attachments for a transaction.
 * Supports upload, view, and delete operations.
 */
export function TransactionAttachments({
  transactionType,
  transactionId,
  className,
}: TransactionAttachmentsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const utils = trpc.useUtils();

  // Fetch existing attachments
  const { data: attachments, isLoading } = trpc.attachments.list.useQuery({
    transactionType,
    transactionId,
  });

  // Create attachment record mutation
  const createAttachment = trpc.attachments.create.useMutation({
    onSuccess: () => {
      utils.attachments.list.invalidate({ transactionType, transactionId });
      toast.success('File attached successfully');
    },
    onError: (error) => {
      toast.error(`Failed to attach file: ${error.message}`);
    },
  });

  // Delete attachment mutation
  const deleteAttachment = trpc.attachments.delete.useMutation({
    onSuccess: () => {
      utils.attachments.list.invalidate({ transactionType, transactionId });
      toast.success('Attachment removed');
    },
    onError: (error) => {
      toast.error(`Failed to remove attachment: ${error.message}`);
    },
  });

  /**
   * Handle file selection and upload
   */
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setIsUploading(true);

    try {
      // Upload file to Vercel Blob
      const formData = new FormData();
      formData.append('file', file);

      const uploadUrl = `/api/upload?transactionType=${transactionType}&transactionId=${transactionId}`;
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const { url, filename, contentType, fileSize } = await response.json();

      // Create attachment record in database
      await createAttachment.mutateAsync({
        transactionType,
        transactionId,
        blobUrl: url,
        filename,
        contentType,
        fileSize,
      });
    } catch (error) {
      console.error('[Attachments] Upload error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to upload file',
      );
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Handle attachment deletion
   */
  const handleDelete = async (attachmentId: string) => {
    await deleteAttachment.mutateAsync({ attachmentId });
  };

  const hasAttachments = attachments && attachments.length > 0;

  return (
    <div className={cn('space-y-2', className)}>
      {/* Header with upload button */}
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-[#101010]/60">Attachments</span>
        <label
          className={cn(
            'cursor-pointer text-[#1B29FF] text-[13px] hover:underline inline-flex items-center gap-1',
            isUploading && 'opacity-50 pointer-events-none',
          )}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Paperclip className="h-3.5 w-3.5" />
              Add file
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept=".pdf,.png,.jpg,.jpeg,.webp,.gif,.txt"
            disabled={isUploading}
          />
        </label>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center gap-2 text-[13px] text-[#101010]/40">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Loading attachments...
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !hasAttachments && (
        <p className="text-[12px] text-[#101010]/40 italic">
          No attachments yet
        </p>
      )}

      {/* Attachments list */}
      {hasAttachments && (
        <div className="space-y-1.5">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center gap-2 p-2 bg-white border border-[#101010]/10 rounded-md group"
            >
              {/* File icon */}
              <div className="text-[#101010]/40">
                {getFileIcon(attachment.contentType)}
              </div>

              {/* File info */}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-[#101010] truncate">
                  {attachment.filename}
                </p>
                <p className="text-[11px] text-[#101010]/40">
                  {formatFileSize(attachment.fileSize)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* View/Download */}
                <a
                  href={attachment.blobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-[#101010]/40 hover:text-[#1B29FF] rounded"
                  title="Open file"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(attachment.id)}
                  disabled={deleteAttachment.isPending}
                  className="p-1.5 text-[#101010]/40 hover:text-red-500 rounded disabled:opacity-50"
                  title="Remove attachment"
                >
                  {deleteAttachment.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <X className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
