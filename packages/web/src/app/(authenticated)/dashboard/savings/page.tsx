import { redirect } from 'next/navigation';

// Redirect to main dashboard since savings is now integrated there
export default function SavingsPage() {
  redirect('/dashboard');
}
