'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { getUserFundingSources, type UserFundingSourceDisplayData } from '@/actions/get-user-funding-sources';
import { getUnmaskedSourceIdentifier, type UnmaskedSourceIdentifier } from '@/actions/get-unmasked-source-identifier';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Banknote, Link2, ExternalLink, Eye, EyeOff, Loader2 } from 'lucide-react';
import { shortenAddress } from '@/lib/utils'; // Assuming shortenAddress utility exists
import { Button } from "@/components/ui/button";
import { AddFundingSourceForm } from './add-funding-source-form'; // Import the new form

export function FundingSourceDisplay() {
  const { ready, authenticated, user } = usePrivy();
  const [fundingSources, setFundingSources] = useState<UserFundingSourceDisplayData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revealedIdentifiers, setRevealedIdentifiers] = useState<Record<string, string>>({});
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
    if (revealedIdentifiers[sourceId]) {
      setRevealedIdentifiers(prev => {
        const newState = { ...prev };
        delete newState[sourceId];
        return newState;
      });
    } else {
      setRevealingSourceId(sourceId); 
      setError(null);
      try {
        const unmaskedData: UnmaskedSourceIdentifier = await getUnmaskedSourceIdentifier(sourceId);
        if (unmaskedData) {
          setRevealedIdentifiers(prev => ({ ...prev, [sourceId]: unmaskedData.identifier }));
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
  }, [revealedIdentifiers]);

  // Display Skeleton while loading
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Display error message if fetch failed
  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // If authenticated and no sources loaded, show the Add form
  if (!isLoading && fundingSources.length === 0 && authenticated) {
    return <AddFundingSourceForm />;
  }
  
  // Do not render if not authenticated and not loading
  if (!authenticated && !isLoading) {
    return null;
  }

  // Display the funding sources
  return (
    <Card>
      <CardHeader>
        <CardTitle>Linked Accounts</CardTitle>
        <CardDescription>Manage your connected bank accounts and crypto addresses.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {fundingSources.map((source) => {
          const isRevealed = !!revealedIdentifiers[source.id];
          const isRevealing = revealingSourceId === source.id;
          // Display revealed identifier if available, otherwise the initially fetched masked one
          const identifierDisplay = isRevealed ? revealedIdentifiers[source.id] : source.sourceIdentifier;

          return (
            <div key={source.id} className="border p-4 rounded-md space-y-2 bg-muted/20">
              {source.sourceBankName && source.sourceIdentifier && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Banknote className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm font-medium mr-2">
                      {source.sourceBankName} {identifierDisplay} 
                      <span className="text-xs text-muted-foreground ml-1">({source.sourceAccountType.replace('_', ' ').toUpperCase()})</span>
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5 p-0"
                      onClick={() => handleToggleReveal(source.id)}
                      disabled={isRevealing} 
                      aria-label={isRevealed ? "Hide details" : "Show details"}
                    >
                      {isRevealing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : isRevealed ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <span className="text-xs text-muted-foreground capitalize">
                    {source.sourcePaymentRail?.replace('_', ' ')}
                  </span>
                </div>
              )}
              {source.destinationAddress && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Link2 className="h-4 w-4 mr-2 text-primary" />
                    <a 
                      href={`https://basescan.org/address/${source.destinationAddress}`} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium hover:underline flex items-center"
                    >
                      {shortenAddress(source.destinationAddress)}
                      <ExternalLink className="h-3 w-3 ml-1"/>
                    </a>
                  </div>
                  <span className="text-xs text-muted-foreground capitalize">{source.destinationCurrency?.toUpperCase()} ({source.destinationPaymentRail})</span>
                </div>
              )}
            </div>
          );
        })}
        {/* TODO: Add button/link to add MORE funding sources */}
        {/* Maybe add a small "Add another account" button here? */}
      </CardContent>
    </Card>
  );
} 