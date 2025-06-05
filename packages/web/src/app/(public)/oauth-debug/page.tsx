'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function OauthDebugContent() {
  const searchParams = useSearchParams();
  const [params, setParams] = useState<string | null>(null);

  useEffect(() => {
    setParams(searchParams.toString());
  }, [searchParams]);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>OAuth Callback Debug</h1>
      <p>If you see this page, the server-side callback issued its redirect.</p>
      <h2>Query Parameters Received:</h2>
      <pre>{params ? params : 'Loading params...'}</pre>
      <p><a href="/dashboard/settings/integrations">Go to Integrations Page</a></p>
      <p><a href="/">Go to Homepage</a></p>
    </div>
  );
}

export default function OauthDebugPage() {
  return (
    <Suspense fallback={
      <div style={{ padding: '20px', fontFamily: 'monospace' }}>
        <h1>OAuth Callback Debug</h1>
        <p>Loading...</p>
      </div>
    }>
      <OauthDebugContent />
    </Suspense>
  );
} 