'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowRight,
  Check,
  Copy,
  TrendingUp,
  Shield,
  Zap,
  DollarSign,
  Building2,
  Clock,
  ChevronRight,
  AlertCircle,
  Sparkles,
  CreditCard,
  Send,
  RefreshCw,
  Activity,
  PiggyBank,
  Wallet,
  ChartBar,
  Lock,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownLeft,
  Building,
  FileText,
  Users,
  Globe,
  Banknote,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

type DemoStep =
  | 'intro'
  | 'signup'
  | 'dashboard-empty'
  | 'deposit-instructions'
  | 'deposit-pending'
  | 'dashboard-funded'
  | 'savings-selection'
  | 'savings-active'
  | 'withdrawal'
  | 'summary';

const DEMO_WALLET = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb7';

export default function DemoVideoFlow() {
  const [currentStep, setCurrentStep] = useState<DemoStep>('intro');
  const [balance, setBalance] = useState(0);
  const [savingsBalance, setSavingsBalance] = useState(0);
  const [yieldEarned, setYieldEarned] = useState(0);
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [copied, setCopied] = useState(false);
  const [depositAmount] = useState(2500000);
  const [selectedStrategy, setSelectedStrategy] = useState<
    'conservative' | 'balanced' | 'growth'
  >('balanced');
  const [isAutoMode, setIsAutoMode] = useState(false);

  // Auto-advance through demo
  useEffect(() => {
    if (isAutoMode) {
      const timers: { [key in DemoStep]: number } = {
        intro: 5000,
        signup: 4000,
        'dashboard-empty': 3000,
        'deposit-instructions': 6000,
        'deposit-pending': 3000,
        'dashboard-funded': 5000,
        'savings-selection': 5000,
        'savings-active': 6000,
        withdrawal: 4000,
        summary: 8000,
      };

      const timer = setTimeout(() => {
        handleNextStep();
      }, timers[currentStep] || 5000);

      return () => clearTimeout(timer);
    }
  }, [currentStep, isAutoMode]);

  // Simulate yield accumulation
  useEffect(() => {
    if (currentStep === 'savings-active' && savingsBalance > 0) {
      const interval = setInterval(() => {
        const dailyYield = (savingsBalance * 0.08) / 365;
        const secondlyYield = dailyYield / 86400;
        setYieldEarned((prev) => prev + secondlyYield);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [currentStep, savingsBalance]);

  const handleNextStep = () => {
    const steps: DemoStep[] = [
      'intro',
      'signup',
      'dashboard-empty',
      'deposit-instructions',
      'deposit-pending',
      'dashboard-funded',
      'savings-selection',
      'savings-active',
      'withdrawal',
      'summary',
    ];

    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];

      // Handle state changes
      if (nextStep === 'deposit-pending') {
        setTimeout(() => {
          setBalance(depositAmount);
          setCurrentStep('dashboard-funded');
        }, 2000);
        return;
      }

      if (nextStep === 'savings-active') {
        setSavingsBalance(balance * 0.8); // Move 80% to savings
        setBalance(balance * 0.2); // Keep 20% liquid
      }

      setCurrentStep(nextStep);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(DEMO_WALLET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: amount < 100 ? 2 : 0,
    }).format(amount);
  };

  const getAPY = () => {
    switch (selectedStrategy) {
      case 'conservative':
        return 5.2;
      case 'balanced':
        return 8.0;
      case 'growth':
        return 12.5;
      default:
        return 8.0;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold">0°</div>
            <Badge variant="secondary">Demo Mode</Badge>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant={isAutoMode ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsAutoMode(!isAutoMode)}
            >
              {isAutoMode ? 'Auto-Playing' : 'Manual Mode'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentStep('intro')}
            >
              Restart
            </Button>
          </div>
        </div>
        <div
          className="h-1 bg-purple-600 transition-all duration-500"
          style={{
            width: `${((['intro', 'signup', 'dashboard-empty', 'deposit-instructions', 'deposit-pending', 'dashboard-funded', 'savings-selection', 'savings-active', 'withdrawal', 'summary'].indexOf(currentStep) + 1) / 10) * 100}%`,
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Intro */}
        {currentStep === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center p-6 pt-20"
          >
            <div className="max-w-4xl w-full">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-12"
              >
                <Badge className="mb-4" variant="secondary">
                  <Sparkles className="w-3 h-3 mr-1" />
                  For Ambitious Startups
                </Badge>
                <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Get 8% APY on Your Startup's Savings
                </h1>
                <p className="text-2xl text-slate-600 mb-8">
                  Zero Finance: Where DeFi meets Traditional Banking
                </p>
                <div className="flex flex-wrap gap-4 justify-center mb-12">
                  <Badge variant="outline" className="px-4 py-2 text-lg">
                    <Shield className="w-4 h-4 mr-2" />
                    FDIC-Level Security
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2 text-lg">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    8-12% APY
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2 text-lg">
                    <Clock className="w-4 h-4 mr-2" />
                    24/7 Liquidity
                  </Badge>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid md:grid-cols-3 gap-6 mb-12"
              >
                <Card className="border-red-200 bg-red-50">
                  <CardHeader>
                    <CardTitle className="text-red-700">The Problem</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-red-600">
                      Traditional banks offer &lt;2% APY while your burn rate
                      stays the same
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-yellow-200 bg-yellow-50">
                  <CardHeader>
                    <CardTitle className="text-yellow-700">The Fear</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-yellow-600">
                      DeFi feels like a casino, too risky for investor money
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-green-700">
                      The Solution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-600">
                      Bank-grade UX with DeFi yields, fully insured
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center"
              >
                <Button
                  size="lg"
                  onClick={handleNextStep}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-6 text-lg"
                >
                  Let's See How It Works
                  <ArrowRight className="ml-2" />
                </Button>
                <p className="text-sm text-slate-500 mt-4">
                  Watch how a Series A startup extends their runway by 43 days
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Signup */}
        {currentStep === 'signup' && (
          <motion.div
            key="signup"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="min-h-screen flex items-center justify-center p-6 pt-20"
          >
            <Card className="max-w-md w-full">
              <CardHeader>
                <CardTitle>Quick Signup</CardTitle>
                <CardDescription>
                  Get started in under 60 seconds
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Company Email</Label>
                  <Input
                    type="email"
                    placeholder="founder@startup.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Company Name</Label>
                  <Input
                    placeholder="Acme Inc"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900">
                      Enterprise Security
                    </p>
                    <p className="text-blue-700">
                      SOC 2 compliant, $10M insurance coverage
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleNextStep}>
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Empty Dashboard */}
        {currentStep === 'dashboard-empty' && (
          <motion.div
            key="dashboard-empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen p-6 pt-20"
          >
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">
                  Welcome to Your Dashboard
                </h1>
                <p className="text-slate-600">
                  Let's fund your account to start earning
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Balance
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$0.00</div>
                    <p className="text-xs text-muted-foreground">
                      No funds yet
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Current APY
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0%</div>
                    <p className="text-xs text-muted-foreground">
                      Activate savings to earn
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Monthly Yield
                    </CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$0.00</div>
                    <p className="text-xs text-muted-foreground">
                      Potential: $16,667/mo
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-dashed border-2 bg-slate-50">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Wallet className="h-12 w-12 text-slate-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No Funds Detected
                  </h3>
                  <p className="text-slate-600 mb-6 text-center max-w-md">
                    Deposit funds to start earning 8% APY immediately. Your
                    money remains liquid and withdrawable at any time.
                  </p>
                  <Button onClick={handleNextStep}>
                    Make Your First Deposit
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Step 4: Deposit Instructions */}
        {currentStep === 'deposit-instructions' && (
          <motion.div
            key="deposit-instructions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen p-6 pt-20"
          >
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Fund Your Account</CardTitle>
                  <CardDescription>
                    Simply send USDC to your dedicated wallet
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-lg">
                    <Label className="text-sm text-slate-600 mb-2 block">
                      Your Deposit Address
                    </Label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 p-3 bg-white rounded border text-sm font-mono">
                        {DEMO_WALLET}
                      </code>
                      <Button variant="outline" onClick={copyAddress}>
                        {copied ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-sm font-bold text-purple-600">
                          1
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">Send USDC</p>
                        <p className="text-sm text-slate-600">
                          From any wallet or exchange
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-sm font-bold text-purple-600">
                          2
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">Auto-Detection</p>
                        <p className="text-sm text-slate-600">
                          Funds appear instantly
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-sm font-bold text-purple-600">
                          3
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">Start Earning</p>
                        <p className="text-sm text-slate-600">
                          8% APY immediately
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-900">
                          Multi-chain Support
                        </p>
                        <p className="text-sm text-green-700">
                          Accepts USDC from Ethereum, Base, Arbitrum, and more
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleNextStep} className="w-full">
                    Simulate $2.5M Deposit
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Step 5: Deposit Pending */}
        {currentStep === 'deposit-pending' && (
          <motion.div
            key="deposit-pending"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center p-6 pt-20"
          >
            <Card className="max-w-md w-full">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-purple-200 animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <RefreshCw className="h-8 w-8 text-purple-600 animate-spin" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mt-6 mb-2">
                    Detecting Deposit...
                  </h3>
                  <p className="text-slate-600 text-center">
                    $2,500,000 USDC incoming
                  </p>
                  <div className="w-full mt-6">
                    <Progress value={66} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 6: Funded Dashboard */}
        {currentStep === 'dashboard-funded' && (
          <motion.div
            key="dashboard-funded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen p-6 pt-20"
          >
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-8"
              >
                <Badge className="mb-4" variant="default">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Deposit Complete
                </Badge>
                <h1 className="text-3xl font-bold mb-2">
                  Your Funds Are Ready
                </h1>
                <p className="text-slate-600">
                  Now let's activate your savings to start earning
                </p>
              </motion.div>

              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Balance
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(balance)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        <ArrowUpRight className="inline h-3 w-3 text-green-600" />{' '}
                        Just deposited
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">
                        Monthly Burn
                      </CardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$140,000</div>
                      <p className="text-xs text-muted-foreground">
                        Operating expenses
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">
                        Current Runway
                      </CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">17.8 months</div>
                      <p className="text-xs text-muted-foreground">
                        At current burn rate
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="border-purple-200 bg-purple-50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">
                        Potential Yield
                      </CardTitle>
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-600">
                        $16,667/mo
                      </div>
                      <p className="text-xs text-purple-600">At 8% APY</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <ArrowDownLeft className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">Wire Deposit Received</p>
                            <p className="text-sm text-slate-600">
                              From Chase Business Account
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">
                            +$2,500,000
                          </p>
                          <p className="text-xs text-slate-500">Just now</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleNextStep} className="w-full">
                      Activate Savings Account
                      <Sparkles className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Step 7: Savings Selection */}
        {currentStep === 'savings-selection' && (
          <motion.div
            key="savings-selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen p-6 pt-20"
          >
            <div className="max-w-5xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">
                  Choose Your Savings Strategy
                </h1>
                <p className="text-slate-600">
                  All options are fully liquid and withdrawable anytime
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card
                  className={cn(
                    'cursor-pointer transition-all',
                    selectedStrategy === 'conservative' &&
                      'border-purple-500 shadow-lg',
                  )}
                  onClick={() => setSelectedStrategy('conservative')}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Conservative
                      <Shield className="h-5 w-5 text-blue-600" />
                    </CardTitle>
                    <CardDescription>US Treasury Bills</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600 mb-4">
                      5.2% APY
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Government backed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Zero volatility</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>+$10,833/month</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={cn(
                    'cursor-pointer transition-all relative',
                    selectedStrategy === 'balanced' &&
                      'border-purple-500 shadow-lg',
                  )}
                  onClick={() => setSelectedStrategy('balanced')}
                >
                  <Badge className="absolute -top-2 -right-2" variant="default">
                    Recommended
                  </Badge>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Balanced
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                    </CardTitle>
                    <CardDescription>USDC Savings Vault</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600 mb-4">
                      8.0% APY
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>$10M insurance</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Audited protocol</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>+$16,667/month</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={cn(
                    'cursor-pointer transition-all',
                    selectedStrategy === 'growth' &&
                      'border-purple-500 shadow-lg',
                  )}
                  onClick={() => setSelectedStrategy('growth')}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Growth
                      <Zap className="h-5 w-5 text-orange-600" />
                    </CardTitle>
                    <CardDescription>Blue Chip Lending</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-600 mb-4">
                      12.5% APY
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Aave & Compound</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Higher returns</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>+$26,042/month</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Runway Extension Calculator
                      </h3>
                      <p className="text-sm text-slate-600">
                        See how much longer you can operate
                      </p>
                    </div>
                    <Badge variant="secondary">Live Calculation</Badge>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">
                        Traditional Bank (1.5% APY)
                      </p>
                      <p className="text-2xl font-bold">+8 days</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">
                        With Zero ({getAPY()}% APY)
                      </p>
                      <p className="text-2xl font-bold text-purple-600">
                        +
                        {selectedStrategy === 'conservative'
                          ? '23'
                          : selectedStrategy === 'balanced'
                            ? '43'
                            : '64'}{' '}
                        days
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">
                        Additional Runway
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {selectedStrategy === 'conservative'
                          ? '1.3'
                          : selectedStrategy === 'balanced'
                            ? '2.4'
                            : '3.5'}{' '}
                        months
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleNextStep} className="w-full">
                    Activate{' '}
                    {selectedStrategy === 'conservative'
                      ? 'Conservative'
                      : selectedStrategy === 'balanced'
                        ? 'Balanced'
                        : 'Growth'}{' '}
                    Strategy
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Step 8: Active Savings */}
        {currentStep === 'savings-active' && (
          <motion.div
            key="savings-active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen p-6 pt-20"
          >
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-8"
              >
                <Badge className="mb-4" variant="default">
                  <Activity className="w-3 h-3 mr-1 animate-pulse" />
                  Earning Live
                </Badge>
                <h1 className="text-3xl font-bold mb-2">
                  Your Savings Are Active
                </h1>
                <p className="text-slate-600">
                  You're now earning {getAPY()}% APY on your treasury
                </p>
              </motion.div>

              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Liquid Balance
                    </CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(balance)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Available for payments
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 bg-purple-50">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Savings Balance
                    </CardTitle>
                    <PiggyBank className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">
                      {formatCurrency(savingsBalance)}
                    </div>
                    <p className="text-xs text-purple-600">
                      Earning {getAPY()}% APY
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Yield Earned (Live)
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(yieldEarned)}
                    </div>
                    <p className="text-xs text-green-600 animate-pulse">
                      Updating in real-time
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      New Runway
                    </CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {selectedStrategy === 'conservative'
                        ? '19.1'
                        : selectedStrategy === 'balanced'
                          ? '20.2'
                          : '21.3'}{' '}
                      months
                    </div>
                    <p className="text-xs text-green-600">
                      +
                      {selectedStrategy === 'conservative'
                        ? '1.3'
                        : selectedStrategy === 'balanced'
                          ? '2.4'
                          : '3.5'}{' '}
                      months extended
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="activity" className="mb-8">
                <TabsList>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="payments">Payments</TabsTrigger>
                  <TabsTrigger value="yield">Yield History</TabsTrigger>
                </TabsList>

                <TabsContent value="activity">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Transactions</CardTitle>
                      <CardDescription>
                        Your money working like a checking account
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                              <PiggyBank className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium">Moved to Savings</p>
                              <p className="text-sm text-slate-600">
                                {getAPY()}% APY Strategy Activated
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">$2,000,000</p>
                            <p className="text-xs text-slate-500">
                              1 minute ago
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                              <TrendingUp className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">Yield Earned</p>
                              <p className="text-sm text-slate-600">
                                Automatic daily compound
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">
                              +{formatCurrency(yieldEarned)}
                            </p>
                            <p className="text-xs text-slate-500">
                              Accumulating...
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                              <Users className="h-5 w-5 text-slate-600" />
                            </div>
                            <div>
                              <p className="font-medium">Payroll Payment</p>
                              <p className="text-sm text-slate-600">
                                Monthly salaries
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-red-600">-$95,000</p>
                            <p className="text-xs text-slate-500">Scheduled</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                              <Globe className="h-5 w-5 text-slate-600" />
                            </div>
                            <div>
                              <p className="font-medium">AWS Services</p>
                              <p className="text-sm text-slate-600">
                                Cloud infrastructure
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-red-600">-$12,500</p>
                            <p className="text-xs text-slate-500">Scheduled</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="payments">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-8">
                        <CreditCard className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                          Spend Directly from Your Account
                        </h3>
                        <p className="text-slate-600 mb-4">
                          ACH transfers, wire payments, and soon virtual cards
                        </p>
                        <Badge variant="secondary">
                          Card payments coming Q1 2025
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="yield">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">
                            Projected Monthly Yield
                          </span>
                          <span className="font-bold text-green-600">
                            +
                            {formatCurrency(
                              (savingsBalance * getAPY()) / 100 / 12,
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">
                            Projected Annual Yield
                          </span>
                          <span className="font-bold text-green-600">
                            +{formatCurrency((savingsBalance * getAPY()) / 100)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">
                            Total Runway Extension
                          </span>
                          <span className="font-bold text-purple-600">
                            +
                            {selectedStrategy === 'conservative'
                              ? '1.3'
                              : selectedStrategy === 'balanced'
                                ? '2.4'
                                : '3.5'}{' '}
                            months
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="flex gap-4">
                <Button onClick={handleNextStep} className="flex-1">
                  See Withdrawal Process
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 9: Withdrawal */}
        {currentStep === 'withdrawal' && (
          <motion.div
            key="withdrawal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen p-6 pt-20"
          >
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Withdraw Anytime</CardTitle>
                  <CardDescription>
                    Your funds are always liquid and accessible
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="border-purple-200">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Send className="h-5 w-5" />
                          ACH Transfer
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-slate-600 mb-4">
                          Direct to your bank account
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-600" />
                            <span>1-2 business days</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-600" />
                            <span>No fees</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-600" />
                            <span>Up to $10M per day</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-blue-200">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Banknote className="h-5 w-5" />
                          Wire Transfer
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-slate-600 mb-4">
                          For larger or urgent transfers
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-600" />
                            <span>Same day available</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-600" />
                            <span>$25 fee</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-600" />
                            <span>Unlimited amount</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      Coming Soon: Virtual Cards
                    </h3>
                    <p className="text-sm text-blue-700 mb-4">
                      Spend directly from your Zero account with virtual
                      corporate cards
                    </p>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-blue-600" />
                        <span>Instant issuance</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-blue-600" />
                        <span>Spending controls</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-blue-600" />
                        <span>1% cashback</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleNextStep} className="w-full">
                    View Summary
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Step 10: Summary */}
        {currentStep === 'summary' && (
          <motion.div
            key="summary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen p-6 pt-20"
          >
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center mb-12"
              >
                <Badge className="mb-4" variant="default">
                  <Sparkles className="w-3 h-3 mr-1" />
                  That's Zero Finance
                </Badge>
                <h1 className="text-5xl font-bold mb-6">
                  8% Savings Account with Crypto Yield
                </h1>
                <p className="text-2xl text-slate-600">
                  The safety of TradFi, the returns of DeFi
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="grid md:grid-cols-2 gap-6 mb-8"
              >
                <Card className="border-purple-200 bg-purple-50">
                  <CardHeader>
                    <CardTitle>What You Just Saw</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Simple Onboarding</p>
                        <p className="text-sm text-slate-600">
                          60-second signup, no complexity
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Instant Deposits</p>
                        <p className="text-sm text-slate-600">
                          Funds appear and start earning immediately
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Bank-Like Dashboard</p>
                        <p className="text-sm text-slate-600">
                          Familiar interface, no learning curve
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Real Yield</p>
                        <p className="text-sm text-slate-600">
                          8% APY, compounding automatically
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Full Liquidity</p>
                        <p className="text-sm text-slate-600">
                          ACH transfers, wires, cards (soon)
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle>The Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-slate-600 mb-1">
                          Monthly Yield Generated
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency((2000000 * getAPY()) / 100 / 12)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 mb-1">
                          Runway Extended
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          +
                          {selectedStrategy === 'conservative'
                            ? '1.3'
                            : selectedStrategy === 'balanced'
                              ? '2.4'
                              : '3.5'}{' '}
                          months
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 mb-1">
                          Extra Operating Days
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          +
                          {selectedStrategy === 'conservative'
                            ? '39'
                            : selectedStrategy === 'balanced'
                              ? '72'
                              : '105'}{' '}
                          days
                        </p>
                      </div>
                      <div className="pt-4 border-t">
                        <p className="text-sm text-slate-600 mb-1">
                          Annual Value Created
                        </p>
                        <p className="text-3xl font-bold text-green-600">
                          {formatCurrency((2000000 * getAPY()) / 100)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">
                      Why Ambitious Founders Choose Zero
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-6 mb-8">
                      <div className="text-center">
                        <Building2 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <p className="font-medium">Not a Casino</p>
                        <p className="text-xs text-slate-600">
                          Professional treasury management
                        </p>
                      </div>
                      <div className="text-center">
                        <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <p className="font-medium">Investor Safe</p>
                        <p className="text-xs text-slate-600">
                          $10M insurance coverage
                        </p>
                      </div>
                      <div className="text-center">
                        <Wallet className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <p className="font-medium">Real Money</p>
                        <p className="text-xs text-slate-600">
                          Spendable checking account
                        </p>
                      </div>
                      <div className="text-center">
                        <ChartBar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <p className="font-medium">Extend Runway</p>
                        <p className="text-xs text-slate-600">
                          Stay lean, grow longer
                        </p>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-lg mb-6 text-slate-600">
                        "The best DeFi apps just look like bank apps"
                      </p>
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-purple-600 to-blue-600"
                        onClick={() =>
                          window.open('https://zero.finance', '_blank')
                        }
                      >
                        Start Earning 8% APY Today
                        <ArrowRight className="ml-2" />
                      </Button>
                      <p className="text-sm text-slate-500 mt-4">
                        No lockups • No minimums • No complexity
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
