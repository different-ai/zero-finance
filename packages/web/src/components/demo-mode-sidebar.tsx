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
  Rocket,
  Calculator,
  Shield,
  CreditCard,
  FileText,
  X,
  Menu,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  AnimatedYieldCounter,
  AnimatedYieldBadge,
} from '@/components/animated-yield-counter';

// Define demo states instead of steps
const DEMO_STATES = {
  roadmap: {
    id: 'roadmap',
    icon: Rocket,
    name: "What's Coming",
    description: 'Product roadmap and future features',
  },
  problem: {
    id: 'problem',
    icon: Calculator,
    name: 'The Problem',
    description: 'Why startups need better treasury management',
  },
  features: {
    id: 'features',
    icon: TrendingUp,
    name: 'Key Features',
    description: 'What Zero Finance offers today',
  },
  security: {
    id: 'security',
    icon: Shield,
    name: 'Security',
    description: 'How your funds are protected',
  },
  getStarted: {
    id: 'getStarted',
    icon: PlayCircle,
    name: 'Get Started',
    description: 'How to open your account',
  },
};

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
  const [isOpen, setIsOpen] = useState(false); // Start minimized
  const [currentState, setCurrentState] =
    useState<keyof typeof DEMO_STATES>('roadmap'); // Default to roadmap
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [opportunityCost, setOpportunityCost] = useState(0);
  const [burnRate, setBurnRate] = useState(200000); // Default $200k/month

  // Calculate opportunity cost counter (updates every second)
  useEffect(() => {
    const timer = setInterval(() => {
      // $197.5k per year / 365 days / 24 hours / 60 minutes / 60 seconds
      const costPerSecond = 197500 / (365 * 24 * 60 * 60);
      setOpportunityCost((prev) => prev + costPerSecond);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Set demo balances
  useEffect(() => {
    if (!isDemoMode) return;
    // Show $2.5M in each account for demo
    setDemoSavingsBalance(2500000);
    setDemoBalance(2500000);
  }, [isDemoMode, setDemoBalance, setDemoSavingsBalance]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
    toast.success('Copied to clipboard');
  };

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

          {/* State Navigation Tabs */}
          <div className="flex gap-1 mt-4">
            {Object.entries(DEMO_STATES).map(([key, state]) => {
              const Icon = state.icon;
              return (
                <Button
                  key={key}
                  onClick={() =>
                    setCurrentState(key as keyof typeof DEMO_STATES)
                  }
                  variant={currentState === key ? 'default' : 'ghost'}
                  size="sm"
                  className={cn(
                    'flex-1 flex flex-col gap-1 h-auto py-2',
                    currentState === key &&
                      'bg-[#1B29FF] hover:bg-[#1B29FF]/90',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-[10px]">{state.name}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Current State Content */}
        <div className="p-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold flex items-center gap-2">
                {React.createElement(DEMO_STATES[currentState].icon, {
                  className: 'h-4 w-4',
                })}
                {DEMO_STATES[currentState].name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {DEMO_STATES[currentState].description}
              </p>
            </div>

            {/* State-specific content */}
            {currentState === 'roadmap' && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-semibold mb-3 text-[#1B29FF]">
                      Launching Q1 2025
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                        <CreditCard className="h-5 w-5 text-[#1B29FF] mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Corporate Cards</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Visa cards linked to your yield-earning account.
                            Spend directly from your 8% APY balance.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                        <FileText className="h-5 w-5 text-[#1B29FF] mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Bill Pay</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Pay vendors and contractors directly. No need to
                            move money to checking first.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                        <Building2 className="h-5 w-5 text-[#1B29FF] mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Tax Forms</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Automatic 1099-INT generation for your yield
                            earnings.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <h4 className="text-xs font-semibold mb-3 text-muted-foreground">
                      Future Vision
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 mt-1.5 flex-shrink-0" />
                        <span className="text-xs text-muted-foreground">
                          Multi-currency accounts (EUR, GBP)
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 mt-1.5 flex-shrink-0" />
                        <span className="text-xs text-muted-foreground">
                          Team spending controls
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 mt-1.5 flex-shrink-0" />
                        <span className="text-xs text-muted-foreground">
                          QuickBooks integration
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 mt-1.5 flex-shrink-0" />
                        <span className="text-xs text-muted-foreground">
                          Advanced treasury analytics
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentState === 'problem' && (
              <div className="space-y-4">
                <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-4">
                  <h4 className="text-sm font-semibold mb-2">
                    The $197.5k Problem
                  </h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    Your startup has $2.5M in the bank earning 0.1% APY at
                    Chase. That's costing you $197,500 per year vs 8% APY.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        Chase (0.1% APY)
                      </span>
                      <span className="text-red-600 font-medium">
                        $2,500/year
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        Mercury (4.5% APY)
                      </span>
                      <span className="text-yellow-600 font-medium">
                        $112,500/year
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        Zero (8.0% APY)
                      </span>
                      <span className="text-green-600 font-medium">
                        $200,000/year
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <h4 className="text-sm font-semibold mb-2">Runway Impact</h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    With a $200k/month burn rate:
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Extra runway from 8% APY</span>
                      <span className="text-sm font-bold text-green-600">
                        +12 months
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs">That's worth</span>
                      <span className="text-sm font-bold">
                        $2.4M in dilution saved
                      </span>
                    </div>
                  </div>
                </div>

                {/* Live opportunity cost counter */}
                <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">
                      Lost While Reading This
                    </span>
                    <span className="text-xs text-muted-foreground">
                      vs 8% APY
                    </span>
                  </div>
                  <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
                    -${opportunityCost.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    That's real money you're losing right now
                  </div>
                </div>
              </div>
            )}

            {currentState === 'features' && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">8% APY Savings</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Highest yield in startup banking. No minimums, no
                          lock-ups.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Non-Custodial</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          You control your funds. Not us, not a bank. Smart
                          contract secured.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-start gap-3">
                      <DollarSign className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">USD Simplicity</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Wire in USD, see USD, withdraw USD. We handle the
                          complexity.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-start gap-3">
                      <Building2 className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">ACH/Wire Support</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Connect to any US bank. Same-day transfers available.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live yield demonstration */}
                <AnimatedYieldCounter
                  principal={2500000}
                  apy={8}
                  showDaily={true}
                  showMonthly={true}
                  showYearly={true}
                  className="mt-4"
                />
              </div>
            )}

            {currentState === 'security' && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Smart Contract Security
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Check className="h-3 w-3 text-green-600 mt-0.5" />
                        <span className="text-xs">
                          Audited by Ackee Blockchain
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-3 w-3 text-green-600 mt-0.5" />
                        <span className="text-xs">
                          Non-custodial architecture
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-3 w-3 text-green-600 mt-0.5" />
                        <span className="text-xs">
                          You can withdraw anytime
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-3 w-3 text-green-600 mt-0.5" />
                        <span className="text-xs">
                          No admin keys or backdoors
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <h4 className="text-sm font-semibold mb-2">
                      Built on Base
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      Coinbase's Layer 2 blockchain provides:
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-1.5" />
                        <span className="text-xs">99.9% uptime guarantee</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-1.5" />
                        <span className="text-xs">$2B+ total value locked</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-1.5" />
                        <span className="text-xs">Ethereum security model</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                    <h4 className="text-sm font-semibold mb-2">
                      Risk Disclosure
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Info className="h-3 w-3 text-orange-600 mt-0.5" />
                        <span className="text-xs">Not FDIC insured</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Info className="h-3 w-3 text-orange-600 mt-0.5" />
                        <span className="text-xs">
                          Smart contract risk exists
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Info className="h-3 w-3 text-orange-600 mt-0.5" />
                        <span className="text-xs">
                          USDC stablecoin exposure
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentState === 'getStarted' && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-[#1B29FF] text-white flex items-center justify-center text-xs font-bold">
                        1
                      </div>
                      <p className="text-sm font-medium">
                        Sign Up (30 seconds)
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground ml-8">
                      Email verification only. No lengthy forms.
                    </p>
                  </div>

                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-[#1B29FF] text-white flex items-center justify-center text-xs font-bold">
                        2
                      </div>
                      <p className="text-sm font-medium">
                        KYC Verification (90 seconds)
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground ml-8">
                      Quick identity check. Instant approval for most.
                    </p>
                  </div>

                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-[#1B29FF] text-white flex items-center justify-center text-xs font-bold">
                        3
                      </div>
                      <p className="text-sm font-medium">Fund Account</p>
                    </div>
                    <p className="text-xs text-muted-foreground ml-8">
                      Wire from your bank. Same-day processing.
                    </p>
                  </div>

                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Check className="h-5 w-5 text-green-600" />
                      <p className="text-sm font-medium">
                        Start Earning 8% APY
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground ml-7">
                      Your money starts working immediately. No waiting period.
                    </p>
                  </div>
                </div>

                <div className="bg-[#1B29FF] text-white rounded-lg p-4">
                  <h4 className="text-sm font-semibold mb-2">
                    Ready to Start?
                  </h4>
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
                    Open Your Account
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Footer */}
        <div className="p-4 border-t bg-muted/50">
          <div className="flex items-start gap-2">
            <Info className="h-3 w-3 text-muted-foreground mt-0.5" />
            <p className="text-xs text-muted-foreground">
              This is a demo. Your data shows $2.5M earning 8% APY ($547/day).
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
