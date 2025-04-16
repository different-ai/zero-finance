'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, BanknoteIcon, ArrowRight } from 'lucide-react';
import { api } from '@/trpc/react';
import { cn } from '@/lib/utils';

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
      <Card className="bg-gray-50 border border-gray-100">
        <CardContent className="flex items-center justify-center py-4">
          <Loader2 className="h-4 w-4 animate-spin text-primary mr-2" /> 
          <span className="text-sm text-gray-600">Checking funding sources...</span>
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
    <Card className="border border-gray-200 bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-gray-800 text-lg font-semibold">
          <BanknoteIcon className="h-5 w-5 mr-2 text-primary" /> 
          Receive Payments via Bank Transfer
        </CardTitle>
        <CardDescription className="text-gray-500 text-sm">
          Set up a virtual bank account to receive fiat payments that automatically convert to crypto
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="bg-gray-50 border border-gray-100">
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertTitle className="text-gray-800 font-medium">No Virtual Bank Account</AlertTitle>
          <AlertDescription className="text-gray-600 text-sm">
            Create a virtual bank account to receive traditional bank payments (USD/EUR) that automatically convert to USDC on your preferred blockchain.
          </AlertDescription>
        </Alert>
        
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <h4 className="text-sm font-medium text-gray-700">For International Payments</h4>
            <ul className="text-sm space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-gray-400 mr-2 text-xs leading-5">•</span>
                Get your own IBAN account details
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-2 text-xs leading-5">•</span>
                Receive EUR payments from clients worldwide
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col space-y-2">
            <h4 className="text-sm font-medium text-gray-700">For US Payments</h4>
            <ul className="text-sm space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-gray-400 mr-2 text-xs leading-5">•</span>
                Get ACH routing & account numbers
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-2 text-xs leading-5">•</span>
                Receive USD payments from US clients
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-3 border-t border-gray-100 mt-4">
        <Button variant="ghost" size="sm" onClick={() => setDismissed(true)}
          className="text-gray-500 hover:text-gray-700 hover:bg-gray-50">
          Dismiss
        </Button>
        <Button asChild variant="default" className="bg-primary text-white hover:bg-primary/90">
          <Link href="/settings/funding-sources/align" className="flex items-center">
            Set Up Virtual Bank Account
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
} 