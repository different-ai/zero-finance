import { Metadata } from 'next';
import { InvoicePreviewContent } from './invoice-preview-content';

export const metadata: Metadata = {
  title: 'Invoice Preview | Zero Finance',
  description: 'Preview and edit your invoice',
};

export default function InvoicePreviewPage() {
  return <InvoicePreviewContent />;
}