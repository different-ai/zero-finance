import { redirect } from 'next/navigation';

export default function SafelessRedirect() {
  redirect('/dashboard/settings/payment-accounts');
}