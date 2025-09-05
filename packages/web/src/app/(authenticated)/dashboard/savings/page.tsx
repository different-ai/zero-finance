'use client';

import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/ui/loading-spinner';

// Dynamically import the wrapper to avoid SSR issues with demo mode
const SavingsPageWrapper = dynamic(() => import('./page-wrapper'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner />
    </div>
  ),
});

export default function SavingsPage() {
  return <SavingsPageWrapper />;
}
