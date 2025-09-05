'use client';

import React, { useEffect } from 'react';
import {
  DemoStartupProvider,
  useDemoStartup,
} from '@/context/demo-startup-context';
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
  TrendingUp,
  Shield,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Sparkles,
  Building,
  ChevronRight,
  Play,
  Calculator,
  PieChart,
  Wallet,
  CreditCard,
  LineChart,
  Target,
  Users,
  FileText,
  Lock,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

function DemoContent() {
  const {
    currentStep,
    nextStep,
    previousStep,
    startupData,
    yieldOpportunities,
    selectedYield,
    setSelectedYield,
    transactions,
    runwayWithYield,
    projectedSavings,
  } = useDemoStartup();

  const painPoints = [
    {
      title: 'Limited Options',
      description: 'Traditional banks offer <2% APY while you burn $140k/month',
      icon: XCircle,
      color: 'text-red-500',
    },
    {
      title: 'DeFi Complexity',
      description:
        'Want to use DeFi but it feels like a casino, not a treasury',
      icon: AlertTriangle,
      color: 'text-orange-500',
    },
    {
      title: 'Investor Trust',
      description: "Can't risk investor money on complex protocols",
      icon: Shield,
      color: 'text-blue-500',
    },
    {
      title: 'Runway Pressure',
      description: 'Need to extend runway but options are limited',
      icon: Clock,
      color: 'text-purple-500',
    },
  ];

  const solutions = [
    {
      title: 'Bank-Like Simplicity',
      description:
        'DeFi that looks and feels like your business checking account',
      icon: Building,
    },
    {
      title: 'Institutional Grade',
      description: 'Vetted protocols with insurance and compliance',
      icon: Shield,
    },
    {
      title: 'Real Yield',
      description: '8-12% APY on stablecoins, extending runway by months',
      icon: TrendingUp,
    },
    {
      title: 'Full Control',
      description: 'Your money stays liquid and spendable',
      icon: Wallet,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/20">
      <AnimatePresence mode="wait">
        {/* Welcome Screen */}
        {currentStep === 'welcome' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="container max-w-4xl mx-auto px-4 py-20"
          >
            <div className="text-center space-y-6">
              <Badge className="mb-4" variant="outline">
                <Sparkles className="h-3 w-3 mr-1" />
                Interactive Demo
              </Badge>

              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-purple-600 bg-clip-text text-transparent">
                Make Your Startup's Money Work
              </h1>

              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                See how leading startups are extending their runway by 3-6
                months using institutional-grade DeFi that feels like a checking
                account.
              </p>

              <div className="flex items-center justify-center gap-4 text-sm text-gray-500 my-8">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span>Series A Startup</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>$2.5M Treasury</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>18 Month Runway</span>
                </div>
              </div>

              <Button
                size="lg"
                onClick={nextStep}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Demo Journey
              </Button>
            </div>
          </motion.div>
        )}

        {/* Pain Points */}
        {currentStep === 'pain-points' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="container max-w-5xl mx-auto px-4 py-12"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                The Startup Treasury Problem
              </h2>
              <p className="text-gray-600">
                You raised capital to build, not to watch it sit idle
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {painPoints.map((point, i) => (
                <Card
                  key={i}
                  className="border-2 hover:shadow-lg transition-all"
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div
                        className={cn('p-2 rounded-lg bg-gray-50', point.color)}
                      >
                        <point.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{point.title}</CardTitle>
                        <CardDescription className="mt-2">
                          {point.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <div className="flex items-center gap-4">
                <AlertTriangle className="h-8 w-8 text-red-500 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-900">
                    Current Reality
                  </h3>
                  <p className="text-red-700 mt-1">
                    Your $2.5M is earning 1.5% APY ($37,500/year) while you burn
                    $1.67M/year. That's only 8 days of extra runway.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={previousStep}>
                Back
              </Button>
              <Button
                onClick={nextStep}
                className="bg-purple-600 hover:bg-purple-700"
              >
                See the Solution
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Solution Introduction */}
        {currentStep === 'solution-intro' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="container max-w-5xl mx-auto px-4 py-12"
          >
            <div className="text-center mb-12">
              <Badge className="mb-4" variant="default">
                The Zero Approach
              </Badge>
              <h2 className="text-3xl font-bold mb-4">
                DeFi That Feels Like Banking
              </h2>
              <p className="text-gray-600">
                The best DeFi doesn't feel like DeFi at all
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {solutions.map((solution, i) => (
                <Card
                  key={i}
                  className="border-2 border-purple-200 hover:shadow-lg transition-all"
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                        <solution.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {solution.title}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {solution.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <div className="flex items-center gap-4">
                <CheckCircle className="h-8 w-8 text-green-500 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-900">With Zero</h3>
                  <p className="text-green-700 mt-1">
                    Your $2.5M earns 8% APY ($200,000/year). That's 43 extra
                    days of runway - almost 1.5 months!
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={previousStep}>
                Back
              </Button>
              <Button
                onClick={nextStep}
                className="bg-purple-600 hover:bg-purple-700"
              >
                See How It Works
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Dashboard Overview */}
        {currentStep === 'dashboard-overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container max-w-7xl mx-auto px-4 py-8"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">
                Welcome back, {startupData.name}
              </h2>
              <p className="text-gray-600">Your treasury dashboard</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    ${startupData.bankBalance.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm">+8.0% APY</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Monthly Burn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    ${startupData.monthlyBurn.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    Payroll, AWS, SaaS
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Current Runway
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {startupData.runway} months
                  </div>
                  <div className="text-sm text-purple-600 mt-2">
                    +1.4 months with yield
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your money working like a checking account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.slice(0, 4).map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'p-2 rounded-full',
                            tx.type === 'payment'
                              ? 'bg-red-50 text-red-600'
                              : tx.type === 'yield'
                                ? 'bg-green-50 text-green-600'
                                : 'bg-blue-50 text-blue-600',
                          )}
                        >
                          {tx.type === 'payment' ? (
                            <CreditCard className="h-4 w-4" />
                          ) : tx.type === 'yield' ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <DollarSign className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {tx.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            {tx.date.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div
                        className={cn(
                          'font-semibold',
                          tx.amount > 0 ? 'text-green-600' : 'text-gray-900',
                        )}
                      >
                        {tx.amount > 0 ? '+' : ''}$
                        {Math.abs(tx.amount).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={previousStep}>
                Back
              </Button>
              <Button
                onClick={nextStep}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Explore Yield Options
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Yield Opportunities */}
        {currentStep === 'yield-opportunities' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container max-w-6xl mx-auto px-4 py-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">
                Choose Your Yield Strategy
              </h2>
              <p className="text-gray-600">
                Institutional-grade opportunities, vetted and insured
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              {yieldOpportunities.map((opp, i) => (
                <Card
                  key={i}
                  className={cn(
                    'cursor-pointer transition-all',
                    selectedYield?.protocol === opp.protocol
                      ? 'ring-2 ring-purple-500 shadow-lg'
                      : 'hover:shadow-lg',
                  )}
                  onClick={() => setSelectedYield(opp)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{opp.protocol}</CardTitle>
                      <Badge
                        variant={
                          opp.risk === 'low'
                            ? 'default'
                            : opp.risk === 'medium'
                              ? 'secondary'
                              : 'destructive'
                        }
                      >
                        {opp.risk} risk
                      </Badge>
                    </div>
                    <CardDescription>{opp.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">APY</span>
                          <span className="text-2xl font-bold text-purple-600">
                            {opp.apy}%
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600">Yearly Return</span>
                          <span className="font-semibold">
                            ${opp.projectedYearlyReturn.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            Runway Extension
                          </span>
                          <span className="font-semibold text-green-600">
                            +{opp.runwayExtension} days
                          </span>
                        </div>
                      </div>

                      {selectedYield?.protocol === opp.protocol && (
                        <div className="pt-4 border-t">
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              Selected Strategy
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedYield && (
              <Card className="bg-purple-50 border-purple-200 mb-8">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 font-medium">
                        With {selectedYield.protocol}
                      </p>
                      <p className="text-2xl font-bold text-purple-900 mt-1">
                        Your runway extends to {runwayWithYield.toFixed(1)}{' '}
                        months
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Extra runway</p>
                      <p className="text-3xl font-bold text-green-600">
                        +{(runwayWithYield - startupData.runway).toFixed(1)} mo
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={previousStep}>
                Back
              </Button>
              <Button
                onClick={nextStep}
                className="bg-purple-600 hover:bg-purple-700"
                disabled={!selectedYield}
              >
                Continue with {selectedYield?.protocol || 'Selected Strategy'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Runway Extension Calculator */}
        {currentStep === 'runway-extension' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container max-w-4xl mx-auto px-4 py-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Your Runway Extension</h2>
              <p className="text-gray-600">
                See the real impact on your startup
              </p>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Runway Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Traditional Banking */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        Traditional Bank (1.5% APY)
                      </span>
                      <span className="text-sm text-gray-600">18.2 months</span>
                    </div>
                    <Progress value={75} className="h-3" />
                    <p className="text-xs text-gray-500 mt-1">+8 days</p>
                  </div>

                  {/* With Zero */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        With Zero ({selectedYield?.apy || 8}% APY)
                      </span>
                      <span className="text-sm text-purple-600 font-semibold">
                        {runwayWithYield.toFixed(1)} months
                      </span>
                    </div>
                    <Progress value={85} className="h-3 bg-purple-100" />
                    <p className="text-xs text-green-600 font-medium mt-1">
                      +
                      {((runwayWithYield - startupData.runway) * 30).toFixed(0)}{' '}
                      days
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What This Means</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="text-sm">
                        {((runwayWithYield - startupData.runway) * 30).toFixed(
                          0,
                        )}{' '}
                        more days to reach profitability
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="text-sm">
                        ${projectedSavings.toLocaleString()} in annual yield
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="text-sm">
                        Delay next funding round by{' '}
                        {(runwayWithYield - startupData.runway).toFixed(1)}{' '}
                        months
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="text-sm">
                        Stay liquid - withdraw anytime for operations
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Risk Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
                      <span className="text-sm">
                        Insurance coverage up to $10M
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
                      <span className="text-sm">
                        Non-custodial - you control the keys
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
                      <span className="text-sm">
                        Audited smart contracts only
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
                      <span className="text-sm">
                        24/7 monitoring and alerts
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={previousStep}>
                Back
              </Button>
              <Button
                onClick={nextStep}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Complete Demo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Success */}
        {currentStep === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="container max-w-2xl mx-auto px-4 py-20"
          >
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>

              <h2 className="text-4xl font-bold">
                Welcome to the Future of Startup Treasury
              </h2>

              <p className="text-xl text-gray-600">
                Join 100+ startups already extending their runway with Zero
              </p>

              <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Your Demo Summary</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Treasury Size</p>
                        <p className="font-bold">
                          ${startupData.bankBalance.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Selected Yield</p>
                        <p className="font-bold">{selectedYield?.apy}% APY</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Annual Return</p>
                        <p className="font-bold text-green-600">
                          +${projectedSavings.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Runway Extension</p>
                        <p className="font-bold text-purple-600">
                          +
                          {(
                            (runwayWithYield - startupData.runway) *
                            30
                          ).toFixed(0)}{' '}
                          days
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  Get Started with Zero
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => (window.location.href = '/demo')}
                >
                  Restart Demo
                </Button>
              </div>

              <div className="pt-8 border-t">
                <p className="text-sm text-gray-500">
                  Questions? Book a call with our team for a personalized
                  walkthrough
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Indicator */}
      {currentStep !== 'welcome' && currentStep !== 'success' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3">
          <div className="container max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Step</span>
                <span className="text-sm font-medium">
                  {[
                    'pain-points',
                    'solution-intro',
                    'dashboard-overview',
                    'yield-opportunities',
                    'runway-extension',
                  ].indexOf(currentStep) + 1}{' '}
                  of 5
                </span>
              </div>
              <div className="flex-1 max-w-xs mx-4">
                <Progress
                  value={
                    ([
                      'pain-points',
                      'solution-intro',
                      'dashboard-overview',
                      'yield-opportunities',
                      'runway-extension',
                    ].indexOf(currentStep) +
                      1) *
                    20
                  }
                  className="h-2"
                />
              </div>
              <Badge variant="outline">
                <Sparkles className="h-3 w-3 mr-1" />
                Demo Mode
              </Badge>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DemoPage() {
  return (
    <DemoStartupProvider>
      <DemoContent />
    </DemoStartupProvider>
  );
}
