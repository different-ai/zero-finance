'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, Info, DollarSign, FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function InfoPage() {
  const router = useRouter();

  return (
    <div className="">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">Important Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground text-center">
            Before you start using your <span className="font-medium text-foreground">Primary Account</span>, here are some key things to know.
          </p>

          <div className="grid gap-6 pt-4 border-t border-border/40">
            <div className="flex items-start gap-4">
              <div className="mt-1 flex-shrink-0 bg-green-100 dark:bg-green-900/30 p-2 rounded-full border border-green-200 dark:border-green-800">
                <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Invoice Payments</h3>
                <p className="text-muted-foreground mt-1">
                  When clients pay your invoices, the funds arrive directly in your Primary Account. 
                  Payments are securely tracked and recorded.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full border border-blue-200 dark:border-blue-800">
                <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Transaction Fees</h3>
                <p className="text-muted-foreground mt-1">
                  To move funds <span className="italic">out</span> of your hyprsqrl account (e.g., withdrawing to another wallet or exchange), 
                  small network transaction fees apply. These are similar to wire fees and are required by the underlying payment network.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg border border-border/40 p-4 mt-6">
            <div className="flex gap-2 items-center mb-2">
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-1 rounded-full border border-yellow-200 dark:border-yellow-800">
                <Info className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h4 className="font-medium text-foreground">Important Note on Withdrawals</h4>
            </div>
            <p className="text-muted-foreground text-sm">
              You can withdraw funds to any external wallet or exchange account. 
              Always double-check addresses before sending, as blockchain transactions are irreversible.
            </p>
          </div>

          <div className="flex justify-between pt-6 border-t border-border/40">
            <Button
              onClick={() => router.push('/onboarding/welcome')}
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <Button
              onClick={() => router.push('/onboarding/create-safe')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Next: Activate Account
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
