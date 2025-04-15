'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, BanknoteIcon, ExternalLink, ArrowRight } from 'lucide-react';
import { api } from '@/trpc/react';

export function VirtualBankAccountAlert() {
  const { data: fundingSources, isLoading, error } = api.align.getVirtualAccountDetails.useQuery();
  const [dismissed, setDismissed] = useState(false);

  // If user dismissed the alert, don't show it again for this session
  if (dismissed) {
    return null;
  }

  // If loading, show a minimal loading state
  if (isLoading) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-center justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" /> 
          <span>Checking funding sources...</span>
        </CardContent>
      </Card>
    );
  }

  // If there's an error, don't show anything rather than confusing the user
  if (error) {
    return null;
  }

  // If user already has at least one Align virtual account, don't show the alert
  if (fundingSources && fundingSources.length > 0) {
    return null;
  }

  // Main alert content for users without a virtual bank account
  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-blue-800">
          <BanknoteIcon className="h-5 w-5 mr-2 text-blue-600" /> 
          Receive Payments via Bank Transfer
        </CardTitle>
        <CardDescription className="text-blue-700">
          Set up a virtual bank account to receive fiat payments that automatically convert to crypto
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="bg-white border-blue-100">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">No Virtual Bank Account</AlertTitle>
          <AlertDescription className="text-blue-700">
            Create a virtual bank account to receive traditional bank payments (USD/EUR) that automatically convert to USDC on your preferred blockchain.
          </AlertDescription>
        </Alert>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-2">
            <h4 className="text-sm font-medium text-blue-800">For International Payments</h4>
            <ul className="text-sm space-y-1 text-blue-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Get your own IBAN account details
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Receive EUR payments from clients worldwide
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col space-y-2">
            <h4 className="text-sm font-medium text-blue-800">For US Payments</h4>
            <ul className="text-sm space-y-1 text-blue-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Get ACH routing & account numbers
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Receive USD payments from US clients
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="ghost" size="sm" onClick={() => setDismissed(true)}>
          Dismiss
        </Button>
        <Button asChild>
          <Link href="/settings/funding-sources/align" className="flex items-center">
            Set Up Virtual Bank Account
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
} 