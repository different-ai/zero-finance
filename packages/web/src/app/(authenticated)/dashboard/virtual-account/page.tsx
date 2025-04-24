'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function VirtualAccountPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the settings page
    router.push('/settings/funding-sources/align');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-gray-600">Redirecting to Virtual Bank Account setup...</p>
      </div>
    </div>
  );
} 