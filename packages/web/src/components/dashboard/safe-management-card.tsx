'use client';

import { useState } from 'react';
import { useUserSafes } from '@/hooks/use-user-safes';
import { Loader2 } from 'lucide-react';

export function SafeManagementCard() {
  const { data: userSafesData, isLoading } = useUserSafes();
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-primary/20 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
          <span>Loading Safe information...</span>
        </div>
      </div>
    );
  }

  const primarySafe = userSafesData?.find(s => s.safeType === 'primary');

  if (!primarySafe) {
    return (
      <div className="bg-white border border-primary/20 rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-medium mb-4">Safe Management</h2>
        <div className="border border-yellow-200 bg-yellow-50 p-4 rounded-md text-yellow-800">
          No primary safe found. Please create a Safe to continue.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-primary/20 rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-medium mb-4">Safe Management</h2>
      
      <div className="border rounded-md p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium">{primarySafe.name}</h3>
            <div className="text-sm text-gray-500 mt-1">
              <div className="flex items-center">
                <span className="truncate max-w-[220px] md:max-w-md">
                  {primarySafe.safeAddress}
                </span>
                <button 
                  onClick={() => handleCopyAddress(primarySafe.safeAddress)}
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-medium">{primarySafe.balance} {primarySafe.currency}</div>
            <div className="text-sm text-gray-500">Current Balance</div>
          </div>
        </div>
      </div>
    </div>
  );
} 