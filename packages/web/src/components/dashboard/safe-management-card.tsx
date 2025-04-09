'use client';

import React, { useMemo, useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useUserSafes } from '@/hooks/use-user-safes';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle, Building, Info, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { isAddress } from 'viem';
import Link from 'next/link';
import { trpc } from '@/utils/trpc';
import type { RouterOutputs } from '@/utils/trpc';

// Use inferred output type from tRPC
type UserSafeOutput = RouterOutputs['userSafes']['list'][number];
type SafeType = UserSafeOutput['safeType'];
const SECONDARY_SAFE_TYPES: Exclude<SafeType, 'primary'>[] = ['tax', 'liquidity', 'yield'];

function isSecondarySafeType(type: SafeType): type is Exclude<SafeType, 'primary'> {
    return (SECONDARY_SAFE_TYPES as ReadonlyArray<SafeType>).includes(type);
}

interface RegisterPrimarySafePayload {
  safeAddress: string;
}

// TODO: Replace with tRPC mutation when available
const registerPrimarySafeApi = async (
  payload: RegisterPrimarySafePayload,
  getAccessToken: () => Promise<string | null>
): Promise<any> => {
   const token = await getAccessToken();
   if (!token) throw new Error('User not authenticated');
   // This API route /api/user/safes/register-primary still needs to be created or moved to tRPC
   const response = await fetch('/api/user/safes/register-primary', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
     body: JSON.stringify(payload),
   });
   const responseData = await response.json();
   if (!response.ok) throw new Error(responseData.error || 'Failed to register primary safe');
   return responseData;
};

export function SafeManagementCard() {
  const queryClient = useQueryClient();
  // useUserSafes already returns data typed as UserSafeOutput[] | undefined
  const { data: safes, isLoading, isError, error: fetchError } = useUserSafes(); 
  const { getAccessToken } = usePrivy();
  const { wallets } = useWallets();
  const [creatingType, setCreatingType] = useState<Exclude<SafeType, 'primary'> | null>(null);
  const [registeringAddress, setRegisteringAddress] = useState('');

  const embeddedWallet = wallets.find((w) => w.walletClientType === 'privy');

  const utils = trpc.useUtils();

  const createSafeMutation = trpc.userSafes.create.useMutation({
    onMutate: (variables) => {
      setCreatingType(variables.safeType);
    },
    onSuccess: (data, variables) => {
      toast.success(data.message || `${variables.safeType} safe created successfully!`);
      utils.userSafes.list.invalidate();
      queryClient.invalidateQueries({ queryKey: ['allocationState'] });
    },
    onError: (error, variables) => {
      toast.error(`Error creating ${variables.safeType} safe: ${error.message}`);
    },
    onSettled: () => {
      setCreatingType(null);
    },
  });

  const registerPrimaryMutation = useMutation<any, Error, RegisterPrimarySafePayload>({
    mutationFn: (payload: RegisterPrimarySafePayload) => registerPrimarySafeApi(payload, getAccessToken),
    onSuccess: (data: any) => {
      toast.success(data.message || `Primary safe registered successfully!`);
      utils.userSafes.list.invalidate();
      setRegisteringAddress('');
    },
    onError: (error: Error) => {
      toast.error(`Error registering primary safe: ${error.message}`);
    },
  });

  const { primarySafe, existingSecondarySafes, missingSecondaryTypes } = useMemo(() => {
    if (!safes) {
      return { primarySafe: null, existingSecondarySafes: [], missingSecondaryTypes: [] };
    }
    const primary = safes.find(s => s.safeType === 'primary');
    // Filter using the type guard. The result 'existingSecondary' will have the correct type.
    const existingSecondary = safes.filter(s => isSecondarySafeType(s.safeType));
    
    const existingTypes = new Set(existingSecondary.map(s => s.safeType));
    const missing = SECONDARY_SAFE_TYPES.filter(type => !existingTypes.has(type));
    // existingSecondary already has the correct narrowed type here
    return { primarySafe: primary, existingSecondarySafes: existingSecondary, missingSecondaryTypes: missing }; 
  }, [safes]);

  const handleCreateClick = (safeType: Exclude<SafeType, 'primary'>) => {
    createSafeMutation.mutate({ safeType });
  };

  const handleRegisterPrimary = () => {
    if (!registeringAddress || !isAddress(registeringAddress)) {
      toast.error("Please enter a valid Ethereum address.");
      return;
    }
    if (!getAccessToken) {
       toast.error("Authentication not ready. Please wait and try again.");
       return;
    }
    registerPrimaryMutation.mutate({ safeAddress: registeringAddress });
  };

  const copyToClipboard = (text: string) => {
     navigator.clipboard.writeText(text).then(() => {
       toast.success("Address copied to clipboard!");
     }, (err) => {
       toast.error("Failed to copy address.");
       console.error('Could not copy text: ', err);
     });
   };

  // --- Render Logic --- 
  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>Safe Management</CardTitle></CardHeader>
        <CardContent className="flex justify-center items-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2">Loading your safes...</span>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader><CardTitle>Safe Management</CardTitle></CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Safes</AlertTitle>
            <AlertDescription>
              {fetchError?.message || 'Could not fetch your safe details. Please try again later.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Safe Management</CardTitle>
        <CardDescription>
          Manage your Gnosis Safes used for allocations. Primary safe needs manual setup.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!primarySafe && (
          <div className="space-y-4">
            {/* Register Primary Safe Alert and Input */}
            <Alert variant="default" className="border-blue-500/50 bg-blue-50 text-blue-800">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-900">Register Your Primary Safe</AlertTitle>
              <AlertDescription className="text-blue-700 space-y-1">
                <p>We couldn&apos;t find a primary safe linked to your account.</p>
                <p>1. Create a new Safe on Base network via{' '}
                  <Link href="https://app.safe.global/new-safe/create" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">app.safe.global</Link>.
                </p>
                <p>2. Add your Privy embedded wallet as an owner/signer:</p>
                {embeddedWallet ? (
                  <div className="flex items-center space-x-2 bg-blue-100 p-1.5 rounded text-xs my-1">
                    <span className="font-mono break-all">{embeddedWallet.address}</span>
                    <Button variant="ghost" size="icon" className="h-5 w-5 text-blue-700 hover:text-blue-900" onClick={() => copyToClipboard(embeddedWallet.address)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <p className="text-xs text-yellow-700">(Loading your wallet address...)</p>
                )}
                <p>3. Paste the new Safe address below and click Register.</p>
              </AlertDescription>
            </Alert>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter Primary Safe Address (0x...)"
                value={registeringAddress}
                onChange={(e) => setRegisteringAddress(e.target.value)}
                disabled={registerPrimaryMutation.isPending}
              />
              <Button
                onClick={handleRegisterPrimary}
                disabled={registerPrimaryMutation.isPending || !registeringAddress || !isAddress(registeringAddress)}
              >
                {registerPrimaryMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Register
              </Button>
            </div>
          </div>
        )}

        {primarySafe && (
          <>
            {/* Primary Safe Connected */}
            <div className="flex items-center p-3 border rounded-md bg-green-50 border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <p className="font-medium text-sm text-green-800">Primary Safe Connected</p>
                <p className="text-xs text-gray-600 truncate">{primarySafe.safeAddress}</p>
              </div>
            </div>

            {/* Existing Secondary Safes */}
            {existingSecondarySafes.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-sm font-medium text-gray-600">Connected Secondary Safes:</h4>
                {existingSecondarySafes.map((safe) => (
                  <div key={safe.id} className="flex items-center p-2 border rounded-md text-sm">
                    <Building className="h-4 w-4 mr-2 text-primary" />
                    <span className="font-medium capitalize mr-2">{safe.safeType} Safe:</span>
                    <span className="text-gray-500 truncate">{safe.safeAddress}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Buttons for Missing Secondary Safes */}
            {missingSecondaryTypes.length > 0 && (
              <div className="space-y-3 pt-4">
                <h4 className="text-sm font-medium text-gray-600">Create Missing Safes:</h4>
                {missingSecondaryTypes.map((type) => (
                  <Button
                    key={type}
                    onClick={() => handleCreateClick(type)}
                    disabled={createSafeMutation.isPending}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    {createSafeMutation.isPending && creatingType === type ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Building className="mr-2 h-4 w-4" />
                    )}
                    Create {type.charAt(0).toUpperCase() + type.slice(1)} Safe
                  </Button>
                ))}
                <p className="text-xs text-gray-500">These safes will be owned by your Primary Safe.</p>
              </div>
            )}

            {/* All connected message */}
            {missingSecondaryTypes.length === 0 && existingSecondarySafes.length === SECONDARY_SAFE_TYPES.length && (
              <p className="text-sm text-green-600 flex items-center"><CheckCircle className="h-4 w-4 mr-1.5" /> All required secondary safes are connected.</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
} 