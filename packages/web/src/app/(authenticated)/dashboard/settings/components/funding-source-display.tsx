'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { getUserFundingSources, type UserFundingSourceDisplayData } from '@/actions/get-user-funding-sources';
import { getUnmaskedSourceIdentifier, type UnmaskedSourceIdentifier } from '@/actions/get-unmasked-source-identifier';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Banknote, Link2, ExternalLink, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';

// Define a type for the revealed details state, matching backend
// It's good practice to keep frontend types aligned with backend potentially in a shared types package later
type RevealedSourceDetails = {
  identifier: string;
  routingNumber?: string; 
  type: 'us_ach' | 'iban' | 'uk_details' | 'other';
} | null; // Allow null for cases where fetch might fail or not applicable

export function FundingSourceDisplay() {
  const { ready, authenticated, user } = usePrivy();
  const [fundingSources, setFundingSources] = useState<UserFundingSourceDisplayData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Use the specific type for revealed details state
  const [revealedSourceDetails, setRevealedSourceDetails] = useState<Record<string, RevealedSourceDetails>>({});
  const [revealingSourceId, setRevealingSourceId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSources() {
      if (ready && authenticated && user?.id) {
        setIsLoading(true);
        setError(null);
        try {
          const sources = await getUserFundingSources(user.id);
          setFundingSources(sources);
        } catch (err) {
          console.error("Failed to fetch funding sources:", err);
          setError("Failed to load funding information.");
        } finally {
          setIsLoading(false);
        }
      } else if (ready && !authenticated) {
        // If ready but not authenticated, stop loading
        setIsLoading(false);
        setFundingSources([]); // Clear any stale data
      }
    }

    fetchSources();
  }, [ready, authenticated, user?.id]);

  const handleToggleReveal = useCallback(async (sourceId: string) => {
    if (revealedSourceDetails[sourceId]) {
      setRevealedSourceDetails(prev => {
        const newState = { ...prev };
        delete newState[sourceId];
        return newState;
      });
    } else {
      setRevealingSourceId(sourceId);
      setError(null);
      try {
        // Fetch the full unmasked details object - casting the result to the expected type
        const unmaskedData = await getUnmaskedSourceIdentifier(sourceId) as RevealedSourceDetails;
        if (unmaskedData) {
          setRevealedSourceDetails(prev => ({ ...prev, [sourceId]: unmaskedData }));
        } else {
          setError(`Could not retrieve details for this source. Please try again.`);
          console.error('Failed to get unmasked identifier, action returned null');
        }
      } catch (err) {
        setError("An error occurred while retrieving source details.");
        console.error("Error calling getUnmaskedSourceIdentifier:", err);
      } finally {
        setRevealingSourceId(null);
      }
    }
  }, [revealedSourceDetails]);

  // Display Skeleton while loading
  if (isLoading) {
    return (
      <Card className="w-full bg-gradient-to-br from-slate-50 to-sky-100 border border-blue-200/60 rounded-2xl p-6 shadow-sm">
        <CardHeader className="pb-3">
          <Skeleton className="h-7 w-3/5 mb-2 bg-gray-200" />
          <Skeleton className="h-4 w-4/5 bg-gray-200" />
        </CardHeader>
        <CardContent className="space-y-4 pt-3">
          <Skeleton className="h-12 w-full bg-gray-100 rounded-lg" />
          <Skeleton className="h-12 w-full bg-gray-100 rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  // Display error message if fetch failed
  if (error) {
    return (
      <Card className="w-full bg-gradient-to-br from-red-50 to-red-100/40 border border-red-200/60 rounded-2xl p-6 shadow-sm">
        <CardHeader className="pb-2 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-3 text-red-500" />
          <CardTitle className="text-xl font-bold text-red-700">Error</CardTitle>
          <CardDescription className="text-sm text-red-600">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Do not render if not authenticated and not loading, or if no sources exist
  if ((!authenticated && !isLoading) || fundingSources.length === 0) {
    return null; // Or a more styled "No funding sources" message if preferred, matching AlignAccountDisplay
  }

  return (
    <Card className="w-full bg-gradient-to-br from-slate-50 to-sky-100 border border-blue-200/60 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-gray-900">Accounts</CardTitle>
        <CardDescription className="text-sm text-gray-700">Your accounts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-3">
        {fundingSources.map((source) => {
          const revealedDetails = revealedSourceDetails[source.id];
          const isRevealed = !!revealedDetails;
          const isRevealing = revealingSourceId === source.id;
          const accountType = source.sourceAccountType?.replace('_', ' ').toUpperCase() || 'Crypto';
          const paymentRail = source.sourcePaymentRail?.replace('_', ' ') || source.destinationPaymentRail;

          return (
            <div 
              key={source.id} 
              className="bg-white/60 backdrop-blur-lg rounded-xl p-4 border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-px"
            >
              {/* Header Row: Icon, Name/Masked ID/Address, Reveal Button, Rail */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 flex-grow min-w-0">
                  {/* Icon based on type */}
                  <div className={cn("rounded-full w-9 h-9 flex items-center justify-center shadow-sm flex-shrink-0",
                    source.sourceBankName ? "bg-gradient-to-br from-blue-500 to-blue-600" : "bg-gradient-to-br from-emerald-500 to-emerald-600"
                  )}>
                    {source.sourceBankName ? 
                      <Banknote className="h-5 w-5 text-white" strokeWidth={1.5}/> : 
                      <Link2 className="h-5 w-5 text-white" strokeWidth={1.5}/>
                    }
                  </div>
                  
                  {/* Name / Masked ID / Short Address (Unrevealed) */}
                  {!isRevealed && (
                     <div className="truncate">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                            {source.sourceBankName ? 
                                `${source.sourceBankName} (${source.sourceIdentifier})` : 
                                source.destinationAddress /* shortenAddress(source.destinationAddress || '') */}
                        </p>
                        {source.sourceBankName && <p className="text-xs text-gray-500">{accountType}</p>}
                     </div>
                  )}

                  {/* Bank Name + Type (Revealed) */} 
                  {isRevealed && source.sourceBankName && (
                    <div className="truncate">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                            {source.sourceBankName} 
                        </p>
                        <p className="text-xs text-gray-500">{accountType}</p>
                    </div>
                  )}
                  
                   {/* Crypto Currency (Revealed) */} 
                  {isRevealed && source.destinationAddress && (
                    <div className="truncate">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                            {source.destinationCurrency?.toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-500">Wallet</p>
                    </div>
                  )}

                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                   {/* Reveal Button */} 
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 p-0 text-gray-500 hover:text-primary"
                    onClick={() => handleToggleReveal(source.id)}
                    disabled={isRevealing}
                    aria-label={isRevealed ? "Hide details" : "Show details"}
                  >
                    {isRevealing ? <Loader2 className="h-4 w-4 animate-spin" /> : (isRevealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />)}
                  </Button>
                </div>
              </div>

              {/* Revealed Details Section */} 
              {isRevealed && revealedDetails && (
                <div className="border-t border-gray-200 pt-3 mt-3 space-y-2 text-sm bg-gray-50/50 p-3 rounded-md">
                  {/* Bank Account Details */} 
                  {revealedDetails.type === 'us_ach' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Account Number:</span>
                        <span className="font-mono text-gray-800">{revealedDetails.identifier}</span>
                      </div>
                      {revealedDetails.routingNumber && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Routing Number:</span>
                          <span className="font-mono text-gray-800">{revealedDetails.routingNumber}</span>
                        </div>
                      )}
                    </>                  
                  )}
                  {/* IBAN Details */} 
                  {revealedDetails.type === 'iban' && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">IBAN:</span>
                      <span className="font-mono text-gray-800">{revealedDetails.identifier}</span>
                    </div>
                  )}
                  {/* Crypto Address Details (If type is 'other' or similar and it's a crypto address) */} 
                  { (revealedDetails.type === 'other' || !source.sourceBankName) && source.destinationAddress && (
                     <div className="flex justify-between">
                        <span className="text-gray-600">Address:</span>
                        <span className="font-mono text-gray-800 truncate">{source.destinationAddress}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
} 