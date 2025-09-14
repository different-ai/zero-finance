'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDemoMode } from '@/context/demo-mode-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  X,
  Menu,
  Info,
  DollarSign,
  TrendingUp,
  Calculator,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  AnimatedYieldCounter,
  AnimatedYieldBadge,
} from '@/components/animated-yield-counter';

export function DemoModeSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isDemoMode, setDemoMode, setDemoBalance, setDemoSavingsBalance } =
    useDemoMode();
  const [isOpen, setIsOpen] = useState(false); // Start minimized
  const [opportunityCost, setOpportunityCost] = useState(0);

  // Calculate opportunity cost counter (updates every second)
  useEffect(() => {
    const timer = setInterval(() => {
      // $197.5k per year / 365 days / 24 hours / 60 minutes / 60 seconds
      const costPerSecond = 197500 / (365 * 24 * 60 * 60);
      setOpportunityCost((prev) => prev + costPerSecond);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Set demo balances on mount
  useEffect(() => {
    if (!isDemoMode) return;
    // Always show $2.5M in each account for demo
    setDemoSavingsBalance(2500000);
    setDemoBalance(2500000);
  }, [isDemoMode, setDemoBalance, setDemoSavingsBalance]);

  if (!isDemoMode) {
    return null;
  }

  return (
    <>
      {/* Toggle Button - More prominent when closed */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant={isOpen ? 'outline' : 'default'}
        className={cn(
          'fixed top-20 z-50 transition-all duration-300 shadow-lg',
          isOpen ? 'left-[376px]' : 'left-4',
          !isOpen && 'bg-[#1B29FF] hover:bg-[#1B29FF]/90',
        )}
      >
        {isOpen ? (
          <X className="h-4 w-4" />
        ) : (
          <>
            <Menu className="h-4 w-4 mr-2" />
            <span>Demo Info</span>
          </>
        )}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 h-full bg-background border-r shadow-xl transition-transform duration-300 z-40 overflow-y-auto',
          isOpen ? 'translate-x-0 w-96' : '-translate-x-full',
        )}
      >
        {/* Header */}
        <div className="sticky top-0 bg-background border-b p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold">Demo Mode</h2>
              <p className="text-xs text-muted-foreground">
                Explore Zero Finance
              </p>
            </div>
            <Button
              onClick={() => {
                setDemoMode(false);
                router.push('/');
                toast.info('Exiting demo mode');
              }}
              variant="ghost"
              size="sm"
            >
              Exit Demo
            </Button>
          </div>
        </div>

        {/* Demo Content */}
        <div className="p-4 space-y-6">
          {/* Account Balances */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Demo Portfolio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Checking Account
                </span>
                <span className="text-sm font-medium">$2,500,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Savings Account
                </span>
                <span className="text-sm font-medium">$2,500,000</span>
              </div>
              <div className="pt-3 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Portfolio</span>
                  <span className="text-sm font-bold">$5,000,000</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Yield Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                8% APY Earnings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-xs text-muted-foreground mb-2">
                Your demo savings are earning:
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs">Daily</span>
                  <span className="text-sm font-medium text-green-600">
                    +$547.95
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs">Monthly</span>
                  <span className="text-sm font-medium text-green-600">
                    +$16,666.67
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs">Yearly</span>
                  <span className="text-sm font-medium text-green-600">
                    +$200,000.00
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Opportunity Cost Calculator */}
          <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calculator className="h-4 w-4 text-orange-600" />
                Lost While Browsing
              </CardTitle>
              <CardDescription className="text-xs">
                vs earning 8% APY on $2.5M
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                -${opportunityCost.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                That's real money your startup could be earning
              </div>
            </CardContent>
          </Card>

          {/* Live Yield Counter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Live Demo Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatedYieldCounter
                principal={2500000}
                apy={8}
                showDaily={false}
                showMonthly={false}
                showYearly={false}
                className="text-sm"
              />
            </CardContent>
          </Card>

          {/* Get Started CTA */}
          <Card className="bg-[#1B29FF] text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white">
                Ready to Start Earning?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs mb-3 opacity-90">
                Join 50+ startups already earning 8% APY
              </p>
              <Button
                size="sm"
                variant="secondary"
                className="w-full"
                onClick={() => {
                  setDemoMode(false);
                  router.push('/signup');
                }}
              >
                Open Your Real Account
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Info Footer */}
        <div className="p-4 border-t bg-muted/50">
          <div className="flex items-start gap-2">
            <Info className="h-3 w-3 text-muted-foreground mt-0.5" />
            <p className="text-xs text-muted-foreground">
              This is a demo showing $2.5M in each account earning 8% APY.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
