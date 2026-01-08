'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { trpc } from '@/lib/trpc';

export default function DevLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [setupLogs, setSetupLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const setupDemoMutation = trpc.dev.setupDemoData.useMutation({
    onSuccess: (data) => {
      setSetupLogs(data.logs);
      // Set cookie that expires in 1 day
      document.cookie =
        'x-dev-user-id=did:privy:demo_user; path=/; max-age=86400';

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    },
    onError: (err) => {
      setError(err.message);
      setLoading(false);
    },
  });

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    setSetupLogs([]);

    // Setup demo data via tRPC endpoint
    setupDemoMutation.mutate();
  };

  const handleLogout = () => {
    document.cookie = 'x-dev-user-id=; path=/; max-age=0';
    setSetupLogs([]);
    router.refresh();
  };

  if (process.env.NODE_ENV !== 'development') {
    return <div>Not available in production</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-2">Dev Login</h1>
        <p className="text-gray-500 mb-6">
          Login as the Demo User for MCP testing.
        </p>

        <div className="space-y-4">
          <Button
            onClick={handleLogin}
            disabled={loading || setupDemoMutation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {setupDemoMutation.isPending
              ? 'Setting up demo data...'
              : loading
                ? 'Logging in...'
                : 'Login as Demo User'}
          </Button>

          <Button onClick={handleLogout} variant="outline" className="w-full">
            Clear Dev Session
          </Button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm text-left">
            <strong>Error:</strong> {error}
          </div>
        )}

        {setupLogs.length > 0 && (
          <div className="mt-4 p-3 bg-gray-100 rounded-md text-xs text-left font-mono max-h-48 overflow-y-auto">
            {setupLogs.map((log, i) => (
              <div key={i} className="text-gray-700">
                {log}
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 text-xs text-gray-400">
          User DID: did:privy:demo_user
          <br />
          Email: demo@0.finance
        </div>
      </div>
    </div>
  );
}
