'use client';

import { useEffect, useState } from 'react';
import { useDemoMode } from '@/context/demo-mode-context';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Check,
  Copy,
  DollarSign,
  TrendingUp,
  Shield,
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const DEMO_STEPS = [
  {
    id: 0,
    title: 'Welcome to Zero Finance',
    description: "Get 8% APY on your startup's treasury",
    content:
      'Zero Finance gives you an 8% savings account that provides crypto yield with the safety of TradFi. Perfect for startups looking to extend their runway.',
    action: 'Start Demo',
    route: null,
  },
  {
    id: 1,
    title: 'Quick Signup',
    description: 'Sign up in 60 seconds',
    content:
      "After a quick signup with your email, you'll get access to your dashboard. No complex KYC, no waiting days for approval.",
    action: 'View Dashboard',
    route: '/dashboard',
  },
  {
    id: 2,
    title: 'Your Empty Dashboard',
    description: 'Starting fresh with $0 balance',
    content:
      'This is your dashboard before adding funds. You can see your balance, recent transactions, and have full banking functionality.',
    action: 'Add Funds',
    route: '/dashboard',
  },
  {
    id: 3,
    title: 'Simple Deposit',
    description: 'Deposit USDC to this address',
    content:
      'Simply send USDC on Base to your wallet address. Funds will appear instantly and start earning yield immediately.',
    showAddress: true,
    address: '0xDemo1234567890abcdef1234567890abcdef1234',
    action: 'Simulate Deposit',
    route: '/dashboard',
  },
  {
    id: 4,
    title: 'Funds Received!',
    description: '$2.5M treasury now in your account',
    content:
      'Your funds have arrived! You now have $2,500,000 in your account. This works just like a checking account - you can spend, transfer, and save.',
    action: 'View Savings Options',
    route: '/dashboard',
  },
  {
    id: 5,
    title: 'Activate Savings',
    description: 'Enable auto-save at 10%',
    content:
      'Set up auto-savings to automatically save 10% of incoming deposits. Your money goes into the Seamless vault earning 8% APY.',
    action: 'Activate Savings',
    route: '/dashboard/savings',
  },
  {
    id: 6,
    title: 'Earning Yield',
    description: 'Your money is working 24/7',
    content:
      "$200,000 is now earning 8% APY. That's $43.84 per day, extending your runway by 2.4 months. The yield compounds automatically.",
    showYield: true,
    action: 'See Withdrawals',
    route: '/dashboard/savings',
  },
  {
    id: 7,
    title: 'Easy Withdrawals',
    description: 'ACH transfer back to your bank',
    content:
      "When you need to access funds, simply initiate an ACH transfer. Money arrives in 1-2 business days. In the future, we'll support instant card spending.",
    action: 'Complete Demo',
    route: '/dashboard',
  },
];

export default function DemoFlowPage() {
  const router = useRouter();
  const {
    isDemoMode,
    setDemoMode,
    demoStep,
    setDemoStep,
    setDemoBalance,
    setDemoSavingsBalance,
  } = useDemoMode();
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [yieldAmount, setYieldAmount] = useState(0);

  const currentStep = DEMO_STEPS[demoStep] || DEMO_STEPS[0];
  const progress = ((demoStep + 1) / DEMO_STEPS.length) * 100;

  useEffect(() => {
    // Enable demo mode when entering this page
    if (!isDemoMode) {
      setDemoMode(true);
      toast.success('Demo mode activated');
    }
  }, [isDemoMode, setDemoMode]);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && demoStep < DEMO_STEPS.length - 1) {
      const timer = setTimeout(() => {
        handleNext();
      }, 5000); // 5 seconds per step
      return () => clearTimeout(timer);
    } else if (isAutoPlaying && demoStep === DEMO_STEPS.length - 1) {
      setIsAutoPlaying(false);
    }
  }, [isAutoPlaying, demoStep]);

  // Yield counter for step 6
  useEffect(() => {
    if (demoStep === 6) {
      const interval = setInterval(() => {
        setYieldAmount((prev) => prev + 0.0005); // ~$43.84 per day
      }, 100);
      return () => clearInterval(interval);
    }
  }, [demoStep]);

  const handleNext = () => {
    if (demoStep < DEMO_STEPS.length - 1) {
      const nextStep = demoStep + 1;
      setDemoStep(nextStep);

      // Update balances based on step
      if (nextStep === 3) {
        setTimeout(() => {
          setDemoBalance(2500000);
          toast.success('$2.5M deposited!');
        }, 1500);
      } else if (nextStep === 5) {
        setDemoSavingsBalance(200000);
        setDemoBalance(2300000);
        toast.success('Auto-save activated!');
      }

      // Navigate to appropriate route
      if (currentStep.route) {
        router.push(currentStep.route);
      }
    }
  };

  const handleReset = () => {
    setDemoStep(0);
    setDemoBalance(0);
    setDemoSavingsBalance(0);
    setYieldAmount(0);
    setIsAutoPlaying(false);
    toast.info('Demo reset');
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(currentStep.address!);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Address copied!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <Badge className="mb-4" variant="outline">
            DEMO MODE
          </Badge>
          <h1 className="text-4xl font-bold mb-2">Zero Finance Demo</h1>
          <p className="text-lg text-muted-foreground">
            Experience the complete user journey
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Step {demoStep + 1} of {DEMO_STEPS.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Main Content */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{currentStep.title}</CardTitle>
                <CardDescription className="text-lg mt-1">
                  {currentStep.description}
                </CardDescription>
              </div>
              {demoStep === 4 && (
                <DollarSign className="h-8 w-8 text-green-500" />
              )}
              {demoStep === 5 && (
                <TrendingUp className="h-8 w-8 text-blue-500" />
              )}
              {demoStep === 6 && <Shield className="h-8 w-8 text-purple-500" />}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-base leading-relaxed">{currentStep.content}</p>

            {/* Address display for deposit step */}
            {currentStep.showAddress && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Deposit Address (Base Network)
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-white p-2 rounded border text-xs break-all">
                    {currentStep.address}
                  </code>
                  <Button variant="outline" size="icon" onClick={copyAddress}>
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Yield counter for earning step */}
            {currentStep.showYield && (
              <div className="bg-green-50 rounded-lg p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Daily Yield (8% APY on $200k)
                </p>
                <p className="text-3xl font-bold text-green-600">
                  ${(43.84 + yieldAmount).toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Extending runway by 2.4 months
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleNext}
                disabled={demoStep >= DEMO_STEPS.length - 1}
                className="flex-1"
              >
                {currentStep.action}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            >
              {isAutoPlaying ? (
                <>
                  <Pause className="h-3 w-3 mr-1" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 mr-1" />
                  Auto-play
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          </div>

          <div className="flex gap-1">
            {DEMO_STEPS.map((_, index) => (
              <button
                key={index}
                onClick={() => setDemoStep(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === demoStep
                    ? 'bg-primary w-8'
                    : index < demoStep
                      ? 'bg-primary/50'
                      : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Info footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            This demo shows how Zero Finance provides an 8% savings account
            <br />
            that gives you crypto yield but with the safety of TradFi.
          </p>
        </div>
      </div>
    </div>
  );
}
