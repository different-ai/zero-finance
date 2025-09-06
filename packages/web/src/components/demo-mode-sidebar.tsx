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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  PlayCircle,
  PauseCircle,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Copy,
  Check,
  DollarSign,
  Euro,
  Building2,
  Wallet,
  TrendingUp,
  ArrowDownLeft,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  AnimatedYieldCounter,
  AnimatedYieldBadge,
} from '@/components/animated-yield-counter';

const DEMO_STEPS = [
  {
    id: 0,
    name: 'The Problem',
    description: 'Your $2.5M earning 0.1% at Chase',
    highlights: [
      'Losing $197.5k/year vs 8% APY',
      "That's 12 months of runway lost",
      'Mercury: 4.5% | Zero: 8.0%',
    ],
  },
  {
    id: 1,
    name: 'Empty Dashboard',
    description: 'Start earning in 2 minutes',
    highlights: ['No minimum balance', 'No lock-ups', 'Withdraw anytime'],
  },
  {
    id: 2,
    name: 'Fund Your Account',
    description: 'Wire from your existing bank',
    highlights: [
      'Same-day ACH/Wire',
      'We handle crypto conversion',
      'You only see USD',
    ],
  },
  {
    id: 3,
    name: 'Funds Received',
    description: '$2.5M now earning $547/day',
    highlights: [
      'Instant yield activation',
      'No action needed',
      'Adding 12 months runway/year',
    ],
  },
  {
    id: 4,
    name: 'Your Dashboard',
    description: 'Simple, transparent, real-time',
    highlights: [
      '$547 earned today',
      'Compound automatically',
      'Non-custodial (you control it)',
    ],
  },
  {
    id: 5,
    name: 'Maximize Savings',
    description: '$2.5M allocated to 8% APY',
    highlights: [
      'Earning $547.95 daily',
      "That's $200,000/year extra",
      'Auto-navigates to Savings',
    ],
  },
  {
    id: 6,
    name: 'Withdrawals',
    description: 'Get money out in 1-2 days',
    highlights: [
      'ACH to your bank',
      'No penalties or fees',
      'Keep earning until withdrawal',
    ],
  },
  {
    id: 7,
    name: "What's Coming",
    description: 'Building the full stack',
    highlights: [
      '✓ Corporate cards (Q1 2025)',
      '✓ Bill pay from yield account',
      '✓ Automatic tax forms (1099)',
    ],
  },
];

// Demo bank account data
const DEMO_BANK_ACCOUNTS = {
  usd: {
    accountNumber: '8274619503',
    routingNumber: '121000248',
    bankName: 'Wells Fargo Bank',
    accountName: 'Zero Finance Inc.',
    type: 'Checking',
  },
  eur: {
    iban: 'DE89 3704 0044 0532 0130 00',
    bic: 'COBADEFFXXX',
    bankName: 'Commerzbank AG',
    accountName: 'Zero Finance GmbH',
    sepaEnabled: true,
  },
  crypto: {
    address: '0xDemo1234567890abcdef1234567890abcdef1234',
    network: 'Base',
    token: 'USDC',
  },
};

export function DemoModeSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    isDemoMode,
    setDemoMode,
    demoStep,
    setDemoStep,
    setDemoBalance,
    setDemoSavingsBalance,
  } = useDemoMode();
  const [isOpen, setIsOpen] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [opportunityCost, setOpportunityCost] = useState(0);
  const [burnRate, setBurnRate] = useState(200000); // Default $200k/month

  const currentStep = DEMO_STEPS[demoStep] || DEMO_STEPS[0];

  // Calculate opportunity cost counter (updates every second)
  useEffect(() => {
    const timer = setInterval(() => {
      // $197.5k per year / 365 days / 24 hours / 60 minutes / 60 seconds
      const costPerSecond = 197500 / (365 * 24 * 60 * 60);
      setOpportunityCost((prev) => prev + costPerSecond);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-play functionality with custom timing for each step
  useEffect(() => {
    if (isAutoPlaying && demoStep < DEMO_STEPS.length - 1) {
      // Custom timing for each step to match Ben's script
      const stepTimings = [
        10000, // Step 0 (The Problem): 10 seconds
        15000, // Step 1 (Empty Dashboard): 15 seconds
        20000, // Step 2 (Fund Your Account): 20 seconds
        15000, // Step 3 (Funds Received): 15 seconds
        5000, // Step 4 (Your Dashboard): 5 seconds (quick transition to savings)
        30000, // Step 5 (Maximize Savings): 30 seconds
        20000, // Step 6 (Withdrawals): 20 seconds (or skip)
        20000, // Step 7 (What's Coming): 20 seconds
      ];

      const timer = setTimeout(() => {
        handleNext();
      }, stepTimings[demoStep] || 4000);
      return () => clearTimeout(timer);
    } else if (isAutoPlaying && demoStep === DEMO_STEPS.length - 1) {
      setIsAutoPlaying(false);
    }
  }, [isAutoPlaying, demoStep]);

  // Update balances based on step and handle navigation
  useEffect(() => {
    if (!isDemoMode) return;

    // Set balances based on demo step
    if (demoStep === 0 || demoStep === 1 || demoStep === 2) {
      setDemoBalance(0);
      setDemoSavingsBalance(0);
    } else if (demoStep === 3 || demoStep === 4) {
      setDemoBalance(2500000);
      setDemoSavingsBalance(0);
    } else if (demoStep >= 5) {
      setDemoSavingsBalance(2500000);
      setDemoBalance(0);
    }

    // Handle navigation with delay
    if (demoStep === 5) {
      // Automatically navigate to savings page after a short delay
      if (pathname !== '/dashboard/savings') {
        const timer = setTimeout(() => {
          router.push('/dashboard/savings');
          toast.info('Navigating to Savings page...');
        }, 1500); // 1.5 second delay
        return () => clearTimeout(timer);
      }
    } else if (
      demoStep === 1 ||
      demoStep === 2 ||
      demoStep === 3 ||
      demoStep === 4
    ) {
      // Navigate back to dashboard for earlier steps
      if (pathname !== '/dashboard') {
        router.push('/dashboard');
      }
    }
  }, [
    demoStep,
    isDemoMode,
    setDemoBalance,
    setDemoSavingsBalance,
    pathname,
    router,
  ]);

  const handleNext = () => {
    if (demoStep < DEMO_STEPS.length - 1) {
      setDemoStep(demoStep + 1);
    }
  };

  const handlePrevious = () => {
    if (demoStep > 0) {
      setDemoStep(demoStep - 1);
    }
  };

  const handleReset = () => {
    setDemoStep(0);
    setDemoBalance(0);
    setDemoSavingsBalance(0);
    setIsAutoPlaying(false);
    toast.info('Demo reset to beginning');
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
    toast.success('Copied to clipboard');
  };

  if (!isDemoMode) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          onClick={() => {
            setDemoMode(true);
            toast.success('Demo mode activated');
          }}
          size="sm"
          className="shadow-lg"
        >
          <PlayCircle className="h-4 w-4 mr-2" />
          Start Demo
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        variant="outline"
        className={cn(
          'fixed top-20 z-50 transition-all duration-300 shadow-lg',
          isOpen ? 'left-[376px]' : 'left-4',
        )}
      >
        {isOpen ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
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
                Interactive Product Demo
              </p>
            </div>
            <Button
              onClick={() => {
                setDemoMode(false);
                toast.info('Demo mode deactivated');
              }}
              variant="ghost"
              size="sm"
            >
              Exit Demo
            </Button>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>
                Step {demoStep + 1} of {DEMO_STEPS.length}
              </span>
              <span>
                {Math.round(((demoStep + 1) / DEMO_STEPS.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${((demoStep + 1) / DEMO_STEPS.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Current Step */}
        <div className="p-4 border-b">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold">{currentStep.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {currentStep.description}
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                {demoStep + 1}/{DEMO_STEPS.length}
              </Badge>
            </div>
            <div className="space-y-2 mt-3">
              {currentStep.highlights.map((highlight, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                  <span className="text-xs text-muted-foreground">
                    {highlight}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Startup Impact Metrics */}
          {demoStep > 0 && demoStep < 7 && (
            <div className="mt-3 space-y-3">
              {/* Opportunity Cost Counter */}
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">Opportunity Cost</span>
                  <span className="text-xs text-muted-foreground">
                    vs 0.1% APY
                  </span>
                </div>
                <div className="text-xl font-bold text-red-600 dark:text-red-400">
                  -${opportunityCost.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Lost during this demo
                </div>
              </div>

              {/* Runway Extension */}
              {demoStep >= 3 && (
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">Extra Runway</span>
                    <span className="text-xs text-muted-foreground">
                      $200k/mo burn
                    </span>
                  </div>
                  <div className="text-xl font-bold text-green-600 dark:text-green-400">
                    +{((2500000 * 0.08) / burnRate).toFixed(1)} months
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    From 8% APY on $2.5M
                  </div>
                </div>
              )}

              {/* Live Yield Counter */}
              {demoStep >= 3 && (
                <AnimatedYieldCounter
                  principal={2500000}
                  apy={8}
                  showDaily={true}
                  showMonthly={true}
                  showYearly={false}
                  isPaused={!isAutoPlaying && demoStep < 3}
                  className="mt-3"
                />
              )}
            </div>
          )}
        </div>

        {/* Demo Bank Accounts - Show on deposit step */}
        {(demoStep === 2 || showDetails) && (
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">
                Demo Deposit Instructions
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? 'Hide' : 'Show'} Always
              </Button>
            </div>

            <Tabs defaultValue="usd" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="usd">USD</TabsTrigger>
                <TabsTrigger value="eur">EUR</TabsTrigger>
                <TabsTrigger value="crypto">Crypto</TabsTrigger>
              </TabsList>

              <TabsContent value="usd" className="mt-3 space-y-3">
                <div className="bg-muted rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <DollarSign className="h-3 w-3" />
                    USD Bank Transfer (ACH/Wire)
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        Account
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-mono">
                          {DEMO_BANK_ACCOUNTS.usd.accountNumber}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4"
                          onClick={() =>
                            copyToClipboard(
                              DEMO_BANK_ACCOUNTS.usd.accountNumber,
                              'usd-account',
                            )
                          }
                        >
                          {copiedField === 'usd-account' ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        Routing
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-mono">
                          {DEMO_BANK_ACCOUNTS.usd.routingNumber}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4"
                          onClick={() =>
                            copyToClipboard(
                              DEMO_BANK_ACCOUNTS.usd.routingNumber,
                              'usd-routing',
                            )
                          }
                        >
                          {copiedField === 'usd-routing' ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        Bank
                      </span>
                      <span className="text-xs">
                        {DEMO_BANK_ACCOUNTS.usd.bankName}
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="eur" className="mt-3 space-y-3">
                <div className="bg-muted rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <Euro className="h-3 w-3" />
                    EUR Bank Transfer (SEPA)
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        IBAN
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-mono">
                          {DEMO_BANK_ACCOUNTS.eur.iban.slice(0, 12)}...
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4"
                          onClick={() =>
                            copyToClipboard(
                              DEMO_BANK_ACCOUNTS.eur.iban,
                              'eur-iban',
                            )
                          }
                        >
                          {copiedField === 'eur-iban' ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">BIC</span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-mono">
                          {DEMO_BANK_ACCOUNTS.eur.bic}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4"
                          onClick={() =>
                            copyToClipboard(
                              DEMO_BANK_ACCOUNTS.eur.bic,
                              'eur-bic',
                            )
                          }
                        >
                          {copiedField === 'eur-bic' ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        Bank
                      </span>
                      <span className="text-xs">
                        {DEMO_BANK_ACCOUNTS.eur.bankName}
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="crypto" className="mt-3 space-y-3">
                <div className="bg-muted rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <Wallet className="h-3 w-3" />
                    USDC on Base
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        Address
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4"
                        onClick={() =>
                          copyToClipboard(
                            DEMO_BANK_ACCOUNTS.crypto.address,
                            'crypto-address',
                          )
                        }
                      >
                        {copiedField === 'crypto-address' ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                    <div className="bg-background p-2 rounded border">
                      <span className="text-xs font-mono break-all">
                        {DEMO_BANK_ACCOUNTS.crypto.address}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        Network
                      </span>
                      <span className="text-xs">
                        {DEMO_BANK_ACCOUNTS.crypto.network}
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* What's Coming - Cleaner display for final step */}
        {demoStep === 7 && (
          <div className="p-4 space-y-4">
            {/* What This Is */}
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold mb-2">
                  What Zero Is Today
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      8% APY on your idle cash
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      ACH transfers in/out
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      Non-custodial (you control funds)
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      Start earning in 2 minutes
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t">
                <h3 className="text-sm font-semibold mb-2">Coming Soon</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="h-4 w-4 rounded-full bg-blue-100 dark:bg-blue-950 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="text-sm text-muted-foreground">
                        Corporate cards (Q1 2025)
                      </span>
                      <div className="mt-1">
                        <img
                          src="/Visa_Brandmark_Blue_RGB_2021.svgz"
                          alt="Visa"
                          className="h-4 w-auto"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-4 w-4 rounded-full bg-blue-100 dark:bg-blue-950 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      Bill pay integration
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-4 w-4 rounded-full bg-blue-100 dark:bg-blue-950 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      Automatic 1099 tax forms
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Key Metrics */}
        {demoStep >= 3 && demoStep < 7 && (
          <div className="p-4 border-b">
            <h3 className="text-sm font-semibold mb-3">Key Metrics</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Balance</p>
                <p className="text-lg font-bold">
                  ${demoStep >= 3 ? (demoStep >= 5 ? '0' : '2,500,000') : '0'}
                </p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">In Savings</p>
                <p className="text-lg font-bold">
                  ${demoStep >= 5 ? '2,500,000' : '0'}
                </p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">APY</p>
                <p className="text-lg font-bold text-green-600">8.0%</p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">
                  Daily Yield
                </p>
                <p className="text-lg font-bold text-green-600">
                  ${demoStep >= 5 ? ((2500000 * 0.08) / 365).toFixed(2) : '0'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="p-4 space-y-3">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={demoStep === 0}
              className="flex-1"
            >
              <ChevronLeft className="h-3 w-3 mr-1" />
              Previous
            </Button>
            <Button
              size="sm"
              onClick={handleNext}
              disabled={demoStep === DEMO_STEPS.length - 1}
              className="flex-1"
            >
              Next
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="flex-1"
            >
              {isAutoPlaying ? (
                <>
                  <PauseCircle className="h-3 w-3 mr-1" />
                  Pause
                </>
              ) : (
                <>
                  <PlayCircle className="h-3 w-3 mr-1" />
                  Auto-play
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="flex-1"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="p-4 border-t">
          <h3 className="text-sm font-semibold mb-3">All Steps</h3>
          <div className="space-y-1">
            {DEMO_STEPS.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setDemoStep(index)}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-lg text-xs transition-colors',
                  index === demoStep
                    ? 'bg-primary text-primary-foreground'
                    : index < demoStep
                      ? 'bg-muted hover:bg-muted/80'
                      : 'hover:bg-muted/50',
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{step.name}</span>
                  {index < demoStep && <Check className="h-3 w-3" />}
                  {index === demoStep && (
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Info Footer */}
        <div className="p-4 border-t bg-muted/50">
          {demoStep === 7 ? (
            <div className="space-y-3">
              <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-3">
                <p className="text-xs font-semibold mb-1">
                  Smart Risk Management
                </p>
                <p className="text-xs text-muted-foreground">
                  Start with 10% of your treasury. Test for 3 months. Scale up
                  when comfortable. Even 10% at 8% APY beats 100% at 0.1%.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Info className="h-3 w-3 text-muted-foreground mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Not FDIC insured. Smart contract based. USDC stablecoin risk.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <Info className="h-3 w-3 text-muted-foreground mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Zero Finance: 8% APY savings for startups. Add{' '}
                {((2500000 * 0.08) / 200000).toFixed(1)} months to your runway.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
