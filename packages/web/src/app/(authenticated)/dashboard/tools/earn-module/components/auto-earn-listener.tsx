'use client';

import { useState, useCallback } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Zap, CheckCircle, XCircle, Send } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/trpc/react';
import { type Address, getAddress, parseUnits, isAddress } from 'viem';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

const USDC_ADDRESS = getAddress('0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'); // Base USDC
const USDC_DECIMALS = 6;

interface ManualAutoEarnTriggerProps {
  safeAddress?: Address;
  isEarnModuleEnabled?: boolean;
}

export function AutoEarnListener({ safeAddress, isEarnModuleEnabled }: ManualAutoEarnTriggerProps) {
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [lastError, setLastError] = useState<string | null>(null);
  const [lastSuccessMessage, setLastSuccessMessage] = useState<string | null>(null);

  const triggerAutoEarnMutation = api.earn.triggerAutoEarn.useMutation();

  const handleManualTrigger = useCallback(async () => {
    if (!safeAddress || !isEarnModuleEnabled) {
      setLastError('Cannot trigger: Safe address missing or earn module not enabled.');
      toast.error('Pre-requisites not met to trigger auto-earn.');
      return;
    }
    if (!isAddress(safeAddress)) {
      setLastError('Invalid Safe address provided.');
      toast.error('Invalid Safe address.');
      return;
    }

    let amountInUnits: bigint;
    try {
      amountInUnits = parseUnits(depositAmount, USDC_DECIMALS);
      if (amountInUnits <= 0n) {
        setLastError('Deposit amount must be greater than 0.');
        toast.error('Amount must be positive.');
        return;
      }
    } catch (e) {
      setLastError('Invalid deposit amount format.');
      toast.error('Invalid amount entered.');
      return;
    }

    setLastError(null);
    setLastSuccessMessage(null);
    toast.loading('Manually triggering auto-earn...', { id: 'manual-earn-trigger' });

    try {
      const result = await triggerAutoEarnMutation.mutateAsync({
        tokenAddress: USDC_ADDRESS,
        amount: amountInUnits.toString(),
        safeAddress: safeAddress,
      });
      const successMsg = `Auto-earn successfully triggered for ${depositAmount} USDC. Tx: ${result.txHash.slice(0,10)}...`;
      setLastSuccessMessage(successMsg);
      toast.success(successMsg, { id: 'manual-earn-trigger' });
      setDepositAmount(''); // Reset input
    } catch (error: any) {
      console.error('Failed to manually trigger auto-earn:', error);
      const errorMessage = error.data?.message || error.message || 'Unknown error while triggering auto-earn';
      setLastError(errorMessage);
      toast.error(`Trigger failed: ${errorMessage}`, { id: 'manual-earn-trigger' });
    }
  }, [safeAddress, isEarnModuleEnabled, depositAmount, triggerAutoEarnMutation]);

  if (!safeAddress) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Safe Address Missing</AlertTitle>
        <AlertDescription>Cannot initialize manual auto-earn trigger without a Safe address.</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Send className="mr-2 h-5 w-5" /> Manually Trigger Auto-Earn
        </CardTitle>
        <CardDescription>
          If a USDC deposit to your Safe ({safeAddress ? `${safeAddress.slice(0,6)}...${safeAddress.slice(-4)}` : 'N/A'}) was not automatically processed, or you want to process an existing balance, you can manually trigger the auto-earn function here.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="depositAmount">USDC Amount to Process</Label>
          <Input 
            id="depositAmount"
            type="text" 
            placeholder="e.g., 100.50"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            disabled={!isEarnModuleEnabled || triggerAutoEarnMutation.isPending}
          />
        </div>

        {triggerAutoEarnMutation.isError && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Trigger Error</AlertTitle>
            <AlertDescription>{lastError || triggerAutoEarnMutation.error?.message || 'An unknown error occurred'}</AlertDescription>
          </Alert>
        )}
        {lastError && !triggerAutoEarnMutation.isError && (
           <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Input Error</AlertTitle>
            <AlertDescription>{lastError}</AlertDescription>
          </Alert>
        )}
        {lastSuccessMessage && (
          <Alert variant="default">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Trigger Successful</AlertTitle>
            <AlertDescription>{lastSuccessMessage}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-stretch space-y-2">
        <Button 
          onClick={handleManualTrigger} 
          disabled={!isEarnModuleEnabled || triggerAutoEarnMutation.isPending || !depositAmount}
        >
          {triggerAutoEarnMutation.isPending ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
          ) : (
            <><Send className="mr-2 h-4 w-4" /> Trigger for {depositAmount || '0'} USDC</>
          )}
        </Button>
        {!isEarnModuleEnabled && 
          <Badge variant="outline" className="self-center">
            Enable Earn Module in settings to use this feature.
          </Badge>
        }
      </CardFooter>
    </Card>
  );
} 