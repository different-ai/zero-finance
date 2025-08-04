import { redirect } from 'next/navigation';

export default function VirtualAccountsRedirect() {
  redirect('/dashboard/settings/payment-accounts');
}