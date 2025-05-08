'use client';

import React from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle, Shield, Wallet, Gauge } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function WelcomePage() {
  const router = useRouter();
  const { user } = usePrivy();

  return (
    <div className="">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">Welcome to hyprsqrl!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground text-center">
            Your new checking account for global payments in dollars, euros, and digital currencies. Your <span className="font-medium text-foreground">Primary Account</span> is where you&apos;ll receive invoice payments and manage your funds.
          </p>

          <div className="space-y-4 pt-4 border-t border-border/40">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Global Payments:</span> Accept payments from around the world directly into your account.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0">
                <Shield className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Full Control:</span> You maintain complete access to your funds at all times.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0">
                <Gauge className="h-5 w-5 text-purple-500" />
              </div>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Automate Finances:</span> Set up allocations for tax and savings automatically (coming soon).
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-border/40">
            <Button
              onClick={() => router.push('/onboarding/info')}
              className="w-full"
              size="lg"
            >
              Let&apos;s Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 