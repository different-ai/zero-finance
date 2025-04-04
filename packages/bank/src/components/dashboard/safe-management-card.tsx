'use client';

import React, { useMemo, useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useUserSafes } from '@/hooks/use-user-safes'; // Adjust path if needed
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle, Building } from 'lucide-react';
import { toast } from 'sonner';
import { userSafes } from '@/db/schema'; // For the type

type SafeType = typeof userSafes.$inferInsert.safeType;
const SECONDARY_SAFE_TYPES: SafeType[] = ['tax', 'liquidity', 'yield'];

// Define the structure for the mutation request
interface CreateSafePayload {
  safeType: SafeType;
}

// Function to call the backend API to create a safe
const createSafeApi = async (payload: CreateSafePayload): Promise<any> => {
  const response = await fetch('/api/user/safes/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Add authentication headers if/when needed
    },
    body: JSON.stringify(payload),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.error || 'Failed to create safe');
  }

  return responseData; // Contains the newly created safe info
};

export function SafeManagementCard() {
  const queryClient = useQueryClient();
  const { data: safes, isLoading, isError, error } = useUserSafes();
  const [creatingType, setCreatingType] = useState<SafeType | null>(null);

  // Mutation for creating a safe
  const createSafeMutation = useMutation<any, Error, CreateSafePayload>({
    mutationFn: createSafeApi,
    onMutate: (variables) => {
      // Set which type is being created to show loading state on the specific button
      setCreatingType(variables.safeType);
    },
    onSuccess: (data, variables) => {
      toast.success(data.message || `${variables.safeType} safe created successfully!`);
      queryClient.invalidateQueries({ queryKey: ['userSafes'] });
    },
    onError: (error, variables) => {
      toast.error(`Error creating ${variables.safeType} safe: ${error.message}`);
    },
    onSettled: () => {
      // Clear loading state regardless of success or error
      setCreatingType(null);
    },
  });

  // Process the fetched safes
  const { primarySafe, existingSecondarySafes, missingSecondaryTypes } = useMemo(() => {
    if (!safes) {
      return { primarySafe: null, existingSecondarySafes: [], missingSecondaryTypes: [] };
    }
    const primary = safes.find(s => s.safeType === 'primary');
    const existingSecondary = safes.filter(s => SECONDARY_SAFE_TYPES.includes(s.safeType));
    const existingTypes = new Set(existingSecondary.map(s => s.safeType));
    const missing = SECONDARY_SAFE_TYPES.filter(type => !existingTypes.has(type));
    return { primarySafe: primary, existingSecondarySafes: existingSecondary, missingSecondaryTypes: missing };
  }, [safes]);

  const handleCreateClick = (safeType: SafeType) => {
    createSafeMutation.mutate({ safeType });
  };

  // --- Render Logic --- 

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Safe Management</CardTitle>
        </CardHeader>
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
        <CardHeader>
          <CardTitle>Safe Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Safes</AlertTitle>
            <AlertDescription>
              {error?.message || 'Could not fetch your safe details. Please try again later.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // --- Main Content --- 

  return (
    <Card>
      <CardHeader>
        <CardTitle>Safe Management</CardTitle>
        <CardDescription>
          Manage your Gnosis Safes used for allocations. Primary safe needs manual setup.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!primarySafe ? (
          <Alert variant="default" className="border-yellow-500/50 bg-yellow-50 text-yellow-800">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-900">Primary Safe Missing</AlertTitle>
            <AlertDescription className="text-yellow-700">
              You need to manually create a Gnosis Safe and ensure your wallet 
              (associated with Privy) is added as a signer. Once created, 
              it should appear here automatically after the backend registers it.
              {/* TODO: Add link to Gnosis Safe creation guide? */} 
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {/* Display Existing Primary Safe (Optional) */} 
             <div className="flex items-center p-3 border rounded-md bg-green-50 border-green-200">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-sm text-green-800">Primary Safe Connected</p>
                  <p className="text-xs text-gray-600 truncate">{primarySafe.safeAddress}</p>
                </div>
             </div>

            {/* Display Existing Secondary Safes */} 
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
                    disabled={createSafeMutation.isPending} // Disable all buttons during any creation
                    variant="outline"
                    className="w-full justify-start"
                  >
                    {creatingType === type ? (
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

            {missingSecondaryTypes.length === 0 && existingSecondarySafes.length === SECONDARY_SAFE_TYPES.length && (
               <p className="text-sm text-green-600 flex items-center"><CheckCircle className="h-4 w-4 mr-1.5" /> All required secondary safes are connected.</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
} 