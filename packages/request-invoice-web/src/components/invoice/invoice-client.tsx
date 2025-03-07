'use client';

import React from 'react';
import { InvoiceContainer } from './invoice-container';

export interface InvoiceContainerClientProps {
  requestId: string;
  decryptionKey: string;
}

export function InvoiceContainerClient({ requestId, decryptionKey }: InvoiceContainerClientProps) {
  return (
    <InvoiceContainer requestId={requestId} decryptionKey={decryptionKey} />
  );
}