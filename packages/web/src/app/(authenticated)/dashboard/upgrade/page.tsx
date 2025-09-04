'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Check,
  Sparkles,
  Zap,
  Shield,
  MessageSquare,
  Bot,
  FileText,
  TrendingUp,
} from 'lucide-react';

const iconMap = {
  Bot,
  Zap,
  FileText,
  TrendingUp,
  Shield,
} as const;

type IconName = keyof typeof iconMap;
import { cn } from '@/lib/utils';

type Feature = {
  text: string;
  included: boolean;
  icon?: IconName;
};

const plans = [
  {
    name: 'free',
    price: '$0',
    period: 'forever',
    description: 'perfect for getting started',
    features: [
      { text: '5 ai chats per month', included: true },
      { text: 'basic invoice processing', included: true },
      { text: 'manual categorization', included: true },
      { text: 'email sync (up to 100/month)', included: true },
      { text: 'unlimited ai chats', included: false },
      { text: 'auto-labeling & categorization', included: false },
      { text: 'writing assistant', included: false },
      { text: 'priority support', included: false },
    ] as Feature[],
    cta: 'current plan',
    disabled: true,
  },
  {
    name: 'pro',
    price: '$19',
    period: '/month',
    description: 'for power users who want more',
    popular: true,
    features: [
      { text: 'unlimited ai chats', included: true, icon: Bot },
      { text: 'auto-labeling & categorization', included: true, icon: Zap },
      { text: 'writing assistant', included: true, icon: FileText },
      { text: 'advanced invoice processing', included: true },
      { text: 'unlimited email sync', included: true },
      { text: 'expense analytics', included: true, icon: TrendingUp },
      { text: 'priority support', included: true, icon: Shield },
      { text: 'api access', included: true },
    ] as Feature[],
    cta: 'start 7 day free trial',
    highlight: true,
  },
];

export default function UpgradePage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async (planName: string) => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In real implementation, this would:
    // 1. Call Stripe/payment processor
    // 2. Create checkout session
    // 3. Redirect to payment page

    console.log(`upgrading to ${planName} plan`);
    setIsLoading(false);
  };

  return (
    <div className="container max-w-6xl py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">upgrade to zero pro</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          unlock the full power of ai-driven financial management
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              'relative overflow-hidden transition-all duration-200',
              plan.highlight &&
                'border-purple-500 shadow-lg shadow-purple-500/10 scale-105',
            )}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                most popular
              </div>
            )}

            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
            </CardHeader>

            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className={cn(
                      'flex items-start gap-3',
                      !feature.included && 'opacity-50',
                    )}
                  >
                    <div
                      className={cn(
                        'mt-0.5 rounded-full p-1',
                        feature.included
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-400',
                      )}
                    >
                      <Check className="h-3 w-3" />
                    </div>
                    <span className="text-sm flex items-center gap-2">
                      {feature.text}
                      {/* Icon rendering temporarily disabled due to TypeScript issues */}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button
                className={cn(
                  'w-full',
                  plan.highlight && 'bg-purple-600 hover:bg-purple-700',
                )}
                disabled={plan.disabled || isLoading}
                onClick={() => handleUpgrade(plan.name)}
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    processing...
                  </>
                ) : (
                  <>
                    {plan.highlight && <Sparkles className="mr-2 h-4 w-4" />}
                    {plan.cta}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-semibold mb-8">
          frequently asked questions
        </h2>

        <div className="max-w-3xl mx-auto space-y-6 text-left">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                what happens after my free trial?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                your free trial lasts 7 days. after that, you&apos;ll be charged
                $19/month. you can cancel anytime during the trial and
                won&apos;t be charged.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                what does &ldquo;unlimited ai chats&rdquo; mean?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                with pro, you can have unlimited conversations with our ai
                assistant to help with invoice analysis, financial questions,
                and document processing. free users are limited to 5 chats per
                month.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">can i cancel anytime?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                yes! you can cancel your subscription at any time from your
                settings page. you&apos;ll continue to have access until the end
                of your billing period.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
