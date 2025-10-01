'use client';

import { cn } from '@/lib/utils';
import { memo } from 'react';
import ReactMarkdown from 'react-markdown';

interface ResponseProps {
  children: string;
  className?: string;
}

export const Response = memo(
  ({ className, children }: ResponseProps) => (
    <div
      className={cn(
        'size-full prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0',
        className,
      )}
    >
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  ),
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);

Response.displayName = 'Response';
