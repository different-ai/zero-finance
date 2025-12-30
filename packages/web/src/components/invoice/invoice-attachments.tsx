'use client';

import React from 'react';
import { trpc } from '@/utils/trpc';
import {
  FileText,
  Image as ImageIcon,
  Download,
  Loader2,
  ExternalLink,
  Paperclip,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface InvoiceAttachmentsProps {
  invoiceId: string;
  className?: string;
  /** If true, shows a compact inline view */
  compact?: boolean;
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
 * Invoice Attachments Component
 *
 * Displays attachments for an invoice (read-only view).
 * Used on invoice detail pages to show documents attached via AI email or manually.
 */
export function InvoiceAttachments({
  invoiceId,
  className,
  compact = false,
}: InvoiceAttachmentsProps) {
  // Fetch existing attachments
  const { data: attachments, isLoading } = trpc.attachments.list.useQuery({
    transactionType: 'invoice',
    transactionId: invoiceId,
  });

  const hasAttachments = attachments && attachments.length > 0;

  // Don't render anything if no attachments and not loading
  if (!isLoading && !hasAttachments) {
    return null;
  }

  // Loading state
  if (isLoading) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 text-[13px] text-[#101010]/40',
          className,
        )}
      >
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Loading attachments...
      </div>
    );
  }

  // Compact view - just show count with link
  if (compact && hasAttachments) {
    return (
      <div
        className={cn(
          'flex items-center gap-1.5 text-[13px] text-[#101010]/60',
          className,
        )}
      >
        <Paperclip className="h-3.5 w-3.5" />
        <span>
          {attachments.length} attachment{attachments.length > 1 ? 's' : ''}
        </span>
      </div>
    );
  }

  // Full view
  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <Paperclip className="h-4 w-4 text-[#101010]/40" />
        <h4 className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
          Attachments
        </h4>
        <span className="text-[11px] text-[#101010]/40">
          ({attachments!.length})
        </span>
      </div>

      {/* Attachments list */}
      <div className="space-y-2">
        {attachments!.map((attachment) => (
          <a
            key={attachment.id}
            href={attachment.blobUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-[#F7F7F2] border border-[#101010]/10 rounded-md hover:border-[#1B29FF]/30 hover:bg-[#F7F7F2]/80 transition-colors group"
          >
            {/* File icon */}
            <div className="text-[#101010]/40 group-hover:text-[#1B29FF]">
              {getFileIcon(attachment.contentType)}
            </div>

            {/* File info */}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] text-[#101010] truncate group-hover:text-[#1B29FF]">
                {attachment.filename}
              </p>
              <p className="text-[11px] text-[#101010]/40">
                {formatFileSize(attachment.fileSize)}
                {attachment.uploadSource === 'ai_email' && (
                  <span className="ml-2 text-[#1B29FF]/60">• via email</span>
                )}
              </p>
            </div>

            {/* Download indicator */}
            <div className="text-[#101010]/30 group-hover:text-[#1B29FF]">
              <ExternalLink className="h-4 w-4" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
