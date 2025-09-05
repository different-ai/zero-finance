'use client';

import React, { useEffect, useState } from 'react';
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

const DEMO_STEPS = [
  {
    id: 0,
    name: 'Welcome',
    description: '8% APY Savings Account',
    highlights: ['Zero Finance Demo', 'Crypto yield with TradFi safety'],
  },
  {
    id: 1,
    name: 'Empty Dashboard',
    description: 'Starting fresh',
    highlights: ['$0 balance', 'Ready to receive funds'],
  },
  {
    id: 2,
    name: 'Deposit Options',
    description: 'Multiple funding methods',
    highlights: ['USD Bank Transfer', 'EUR SEPA Transfer', 'USDC on Base'],
  },
  {
    id: 3,
    name: 'Funds Received',
    description: '$2.5M treasury deposited',
    highlights: ['Instant settlement', 'Ready to earn'],
  },
  {
    id: 4,
    name: 'Dashboard Active',
    description: 'Full banking features',
    highlights: ['Transaction history', 'Real-time balance'],
  },
  {
    id: 5,
    name: 'Savings Enabled',
    description: '10% auto-save active',
    highlights: ['$200k in savings', '8% APY earning'],
  },
  {
    id: 6,
    name: 'Earning Yield',
    description: '$43.84 daily yield',
    highlights: ['Compounds automatically', '2.4 month runway extension'],
  },
  {
    id: 7,
    name: 'Withdrawals',
    description: 'Easy access to funds',
    highlights: ['ACH transfers', 'Wire transfers', 'Future: Card spending'],
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

  const currentStep = DEMO_STEPS[demoStep] || DEMO_STEPS[0];

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && demoStep < DEMO_STEPS.length - 1) {
      const timer = setTimeout(() => {
        handleNext();
      }, 4000);
      return () => clearTimeout(timer);
    } else if (isAutoPlaying && demoStep === DEMO_STEPS.length - 1) {
      setIsAutoPlaying(false);
    }
  }, [isAutoPlaying, demoStep]);

  // Update balances based on step
  useEffect(() => {
    if (!isDemoMode) return;

    if (demoStep === 3) {
      setDemoBalance(2500000);
    } else if (demoStep === 5) {
      setDemoSavingsBalance(200000);
      setDemoBalance(2300000);
    }
  }, [demoStep, isDemoMode, setDemoBalance, setDemoSavingsBalance]);

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
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">
                    {currentStep.name}
                  </CardTitle>
                  <CardDescription className="text-sm mt-1">
                    {currentStep.description}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs">
                  {demoStep + 1}/{DEMO_STEPS.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentStep.highlights.map((highlight, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <Check className="h-3 w-3 text-green-500" />
                  <span>{highlight}</span>
                </div>
              ))}
            </CardContent>
          </Card>
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

        {/* Key Metrics */}
        {demoStep >= 3 && (
          <div className="p-4 border-b">
            <h3 className="text-sm font-semibold mb-3">Key Metrics</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Balance</p>
                <p className="text-lg font-bold">
                  ${demoStep >= 3 ? '2,500,000' : '0'}
                </p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">In Savings</p>
                <p className="text-lg font-bold">
                  ${demoStep >= 5 ? '200,000' : '0'}
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
                  ${demoStep >= 6 ? '43.84' : '0'}
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
          <div className="flex items-start gap-2">
            <Info className="h-3 w-3 text-muted-foreground mt-0.5" />
            <p className="text-xs text-muted-foreground">
              This demo shows Zero Finance&apos;s 8% savings account that
              provides crypto yield with TradFi safety. Perfect for startups
              looking to extend their runway.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
