'use client';

import React from 'react';

interface InvoiceNotesProps {
  note?: string;
  terms?: string;
}

export const InvoiceNotes: React.FC<InvoiceNotesProps> = ({ note, terms }) => {
  if (!note && !terms) {
    return null;
  }

  return (
    <div className="space-y-4 pt-6 border-t border-neutral-200 dark:border-neutral-700">
      {note && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
            Notes
          </h4>
          <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
            {note}
          </p>
        </div>
      )}
      {terms && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
            Terms & Conditions
          </h4>
          <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
            {terms}
          </p>
        </div>
      )}
    </div>
  );
};

InvoiceNotes.displayName = 'InvoiceNotes';
