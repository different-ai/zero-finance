'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the demo page content with no SSR
const DemoPageContent = dynamic(() => import('./demo-page-content'), {
  ssr: false,
  loading: () => <div>Loading demo...</div>,
});

export default function DemoPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DemoPageContent />
    </Suspense>
  );
}
