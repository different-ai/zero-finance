'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle } from 'lucide-react';
import { ManualAllocationForm } from './manual-allocation-form';
import { usePrivy } from '@privy-io/react-auth';

/**
 * Component for managing manual allocation without depending on automatic detection.
 * Simpler replacement for the AllocationDisplay component.
 */
export function AllocationManagement() {
  const { getAccessToken, authenticated } = usePrivy();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [allocations, setAllocations] = useState<{
    allocatedTax: string;
    allocatedLiquidity: string;
    allocatedYield: string;
  }>({
    allocatedTax: '0',
    allocatedLiquidity: '0',
    allocatedYield: '0',
  });

  // Fetch allocation data on mount and when authenticated changes
  useEffect(() => {
    if (authenticated) {
      fetchAllocations();
    }
  }, [authenticated]);

  const fetchAllocations = async () => {
    if (!authenticated) return;
    
    setLoading(true);
    setError(null);

    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/allocations/manual', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error fetching allocations: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to load allocation data');
      }

      // Update state with fetched data
      setAllocations({
        allocatedTax: result.data.allocatedTax || '0',
        allocatedLiquidity: result.data.allocatedLiquidity || '0',
        allocatedYield: result.data.allocatedYield || '0',
      });
    } catch (err) {
      console.error('Error loading allocations:', err);
      setError(err instanceof Error ? err.message : 'Failed to load allocations');
    } finally {
      setLoading(false);
    }
  };

  // Error state
  if (error) {
    return (
      <div className="w-full space-y-4 mt-6">
        <Alert variant="destructive">
           <AlertTitle>Error</AlertTitle>
           <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={fetchAllocations} variant="outline" size="sm">Try Again</Button>
      </div>
    );
  }
  
  // Main content
  return (
    <div className="w-full space-y-4 mt-6">
      <Card className="w-full bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="flex justify-between items-center">
            <span className="text-base font-medium">Allocation Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-4">
                Loading allocation data...
            </div>
          ) : (
            <ManualAllocationForm
              taxCurrent={allocations.allocatedTax}
              liquidityCurrent={allocations.allocatedLiquidity}
              yieldCurrent={allocations.allocatedYield}
              onSuccess={fetchAllocations}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
} 