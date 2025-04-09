'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/');
    }
  }, [ready, authenticated, router]);

  if (!ready || !authenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-gray-600">Loading Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-primary/20 rounded-lg p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="mb-4">
          Welcome to your HyprSQRL dashboard. Here you&apos;ll find an overview of your finances, invoices, and more.
        </p>
        
        <div className="p-4 border border-blue-200 rounded-md bg-blue-50 text-blue-800">
          <h2 className="text-lg font-semibold mb-2">Quick Links:</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Go to <a href="/dashboard/bank" className="underline">Banking Features</a></li>
            <li>Manage your <a href="/dashboard/invoices" className="underline">Invoices</a></li>
            <li>Update your <a href="/dashboard/settings" className="underline">Settings</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
} 