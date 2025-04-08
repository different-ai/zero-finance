'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Label } from './ui/label';
import { CheckCircle, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { usePrivy } from '@privy-io/react-auth';

interface ManualAllocationFormProps {
  taxCurrent: string;
  liquidityCurrent: string;
  yieldCurrent: string;
  onSuccess: () => void;
}

export function ManualAllocationForm({ 
  taxCurrent, 
  liquidityCurrent, 
  yieldCurrent, 
  onSuccess 
}: ManualAllocationFormProps) {
  const { getAccessToken } = usePrivy();
  
  const [tax, setTax] = useState(taxCurrent);
  const [liquidity, setLiquidity] = useState(liquidityCurrent);
  const [yield_, setYield] = useState(yieldCurrent);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setMessage(null);
    setIsSubmitting(true);
    
    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch('/api/allocations/manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          allocatedTax: tax,
          allocatedLiquidity: liquidity,
          allocatedYield: yield_
        })
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to prepare allocation transactions');
      }

      // --- TODO: Safe SDK Integration ---
      // Here, we receive the prepared transactions from the API (result.transactions)
      // We need to use the Safe{Wallet} SDK (@safe-global/protocol-kit, @safe-global/api-kit)
      // to propose these transactions to the user's primary Safe for signing and execution.
      // Example steps (requires Safe SDK setup):
      // 1. Get Safe instance for the user's primary safe.
      // 2. Create a Safe transaction batch from result.transactions.
      // 3. Propose the transaction batch using the Safe SDK.
      // 4. Monitor transaction status.
      // 5. Show appropriate success/error messages based on tx execution.
      console.log('TODO: Propose these transactions via Safe SDK:', result.transactions);
      setMessage(`Transactions prepared. Please confirm in your Safe app. (${result.message || ''})`); 
      // setSuccess(true); // Success is now when the user signs, not just API call success
      // onSuccess(); // Callback should likely be triggered after successful tx execution
      
      // Reset message after a delay (optional)
      // setTimeout(() => {
      //   setMessage(null);
      // }, 5000);
      
    } catch (err) {
      console.error('Error preparing allocation transactions:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred while preparing transactions');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const checkForDeposits = async () => {
    setError(null);
    setSuccess(false);
    setMessage('Checking for USDC deposits...');
    setIsChecking(true);
    
    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch('/api/allocations/manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          checkDeposits: true
        })
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to check for deposits');
      }
      
      // If successful, update the form values with the latest data if available
      if (result.data) {
        setTax(result.data.allocatedTax || tax);
        setLiquidity(result.data.allocatedLiquidity || liquidity);
        setYield(result.data.allocatedYield || yield_);
      }
      
      setMessage(result.message || 'Deposit check complete');
      
      // Call parent callback to refresh data
      onSuccess();
      
    } catch (err) {
      console.error('Error checking deposits:', err);
      setError(err instanceof Error ? err.message : 'Failed to check deposits');
      setMessage(null);
    } finally {
      setIsChecking(false);
    }
  };
  
  const validateNumber = (value: string): boolean => {
    return !isNaN(Number(value)) && Number(value) >= 0;
  };
  
  const isFormValid = validateNumber(tax) && validateNumber(liquidity) && validateNumber(yield_);
  
  return (
    <Card className="w-full bg-white border-blue-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium text-blue-800">Manual Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">Allocations updated successfully</AlertDescription>
          </Alert>
        )}
        
        {message && !error && !success && (
          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <AlertDescription className="text-blue-700 text-sm">{message}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="tax" className="text-sm text-gray-600">Tax Safe (USDC)</Label>
              <Input
                id="tax"
                value={tax}
                onChange={(e) => setTax(e.target.value)}
                placeholder="Enter amount"
                className={!validateNumber(tax) ? "border-red-300" : ""}
              />
            </div>
            <div>
              <Label htmlFor="liquidity" className="text-sm text-gray-600">Liquidity Safe (USDC)</Label>
              <Input
                id="liquidity"
                value={liquidity}
                onChange={(e) => setLiquidity(e.target.value)}
                placeholder="Enter amount"
                className={!validateNumber(liquidity) ? "border-red-300" : ""}
              />
            </div>
            <div>
              <Label htmlFor="yield" className="text-sm text-gray-600">Yield Safe (USDC)</Label>
              <Input
                id="yield"
                value={yield_}
                onChange={(e) => setYield(e.target.value)}
                placeholder="Enter amount"
                className={!validateNumber(yield_) ? "border-red-300" : ""}
              />
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button 
              type="submit" 
              className="flex-1"
              disabled={isSubmitting || isChecking || !isFormValid}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Preparing...
                </>
              ) : (
                'Allocate Funds'
              )}
            </Button>
            
            <Button 
              type="button"
              variant="outline"
              onClick={checkForDeposits}
              disabled={isSubmitting || isChecking}
              className="whitespace-nowrap"
            >
              {isChecking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Check Deposits
                </>
              )}
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 text-center">
            Enter the desired amounts (in wei) to allocate. Clicking 'Allocate Funds' will prepare the necessary transfers from your primary safe for you to approve and execute.
          </p>
        </form>
      </CardContent>
    </Card>
  );
} 