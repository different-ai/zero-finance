'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Label } from './ui/label';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
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
          tax: parseFloat(tax),
          liquidity: parseFloat(liquidity),
          yield: parseFloat(yield_)
        })
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to update allocations');
      }
      
      setSuccess(true);
      // Call parent callback to refresh data
      onSuccess();
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
      
    } catch (err) {
      console.error('Error updating allocations:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
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
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting || !isFormValid}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Allocations...
              </>
            ) : (
              'Update Allocations'
            )}
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            This will manually set the allocation amounts displayed in the dashboard.
            Note: This does not transfer any tokens between safes.
          </p>
        </form>
      </CardContent>
    </Card>
  );
} 