import { Metadata } from 'next';
import { CreateInvoiceContent } from './create-invoice-content';

export const metadata: Metadata = {
  title: 'Create Retro Invoice | Zero Finance',
  description: 'Create retroactive invoices from transaction history',
};

export default function CreateInvoicePage() {
  return <CreateInvoiceContent />;
}