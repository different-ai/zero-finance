'use client';

import React, { useMemo } from 'react';
import { useWallets } from '@privy-io/react-auth';
import { useSmartWallet } from '@/hooks/use-smart-wallet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Copy, Settings, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export function WalletAddressCard() {
  const { wallets } = useWallets();
  const { smartWalletAddress } = useSmartWallet();

  const embeddedWallet = useMemo(() => 
    wallets.find((w: any) => w.walletClientType === 'privy'), 
    [wallets]
  );

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copied to clipboard!`);
    }, (err) => {
      toast.error(`Failed to copy ${label.toLowerCase()}.`);
      console.error('Could not copy text: ', err);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Advanced Wallet Settings
        </CardTitle>
        <CardDescription>
          Developer wallet addresses - for advanced users only
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive" className="border-red-500/50 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-900">⚠️ Do Not Send Funds to These Addresses</AlertTitle>
          <AlertDescription className="text-red-700">
            These are internal wallet addresses used by the application. Sending funds directly to these addresses may result in permanent loss of funds. Use your primary Safe account for receiving payments.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Privy Smart Wallet Address</label>
          <p className="text-xs text-gray-500 mb-2">Internal smart wallet managed by Privy</p>
          {smartWalletAddress ? (
            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md border">
              <span className="font-mono text-sm break-all flex-1">{smartWalletAddress}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-500 hover:text-gray-700"
                onClick={() => copyToClipboard(smartWalletAddress, 'Smart wallet address')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="p-3 bg-gray-50 rounded-md border">
              <span className="text-sm text-gray-500">No smart wallet found</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Privy Embedded Wallet Address</label>
          <p className="text-xs text-gray-500 mb-2">Internal embedded wallet managed by Privy</p>
          {embeddedWallet?.address ? (
            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md border">
              <span className="font-mono text-sm break-all flex-1">{embeddedWallet.address}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-500 hover:text-gray-700"
                onClick={() => copyToClipboard(embeddedWallet.address, 'Embedded wallet address')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="p-3 bg-gray-50 rounded-md border">
              <span className="text-sm text-gray-500">Loading embedded wallet...</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
