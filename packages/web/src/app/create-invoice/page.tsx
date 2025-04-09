'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Redirect from the old path to the new path
export default function RedirectToNewPath() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/create-invoice');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">Redirecting to new invoice creation page...</p>
    </div>
  );
}