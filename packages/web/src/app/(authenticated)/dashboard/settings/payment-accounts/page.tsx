import { Metadata } from 'next';
import { PaymentAccountsContent } from './payment-accounts-content';

export const metadata: Metadata = {
  title: 'Payment & Virtual Accounts | Settings',
  description: 'Manage your virtual bank accounts and payment routes',
};

export default function PaymentAccountsPage() {
  return <PaymentAccountsContent />;
}