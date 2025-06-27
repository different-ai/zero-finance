"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Mail, Shield, ArrowRight, Zap, Link2, Wallet, Key, Settings2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function SettingsClientContent() {
  const router = useRouter();

  const settingsOptions = [
    {
      id: 'integrations',
      title: 'Integrations',
      description: 'Connect external services like Gmail, Slack, and accounting software',
      icon: Link2,
      color: 'from-blue-500 to-cyan-500',
      bgPattern: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20',
      features: [
        { icon: Mail, text: 'Email sync' },
        { icon: Zap, text: 'Automation' },
      ],
      path: '/dashboard/settings/integrations',
    },
    {
      id: 'advanced-wallet',
      title: 'Advanced Wallet Settings',
      description: 'Manage wallet addresses, recovery options, and security settings',
      icon: Shield,
      color: 'from-purple-500 to-pink-500',
      bgPattern: 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20',
      features: [
        { icon: Wallet, text: 'Wallet management' },
        { icon: Key, text: 'Recovery options' },
      ],
      path: '/dashboard/settings/advanced-wallet',
    },
  ];

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-lg text-muted-foreground">
          Configure your account, integrations, and security preferences
        </p>
      </div>

      {/* Settings Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {settingsOptions.map((option, index) => {
          const Icon = option.icon;
          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="group relative overflow-hidden border-neutral-200 dark:border-neutral-800 hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => router.push(option.path)}
              >
                {/* Background Pattern */}
                <div className={`absolute inset-0 ${option.bgPattern} opacity-50 group-hover:opacity-70 transition-opacity`} />
                
                {/* Gradient Accent */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${option.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />
                
                <CardHeader className="relative">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${option.color} shadow-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold">{option.title}</CardTitle>
                        <CardDescription className="mt-2 text-base">
                          {option.description}
                        </CardDescription>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardHeader>
                
                <CardContent className="relative">
                  <div className="flex flex-wrap gap-3">
                    {option.features.map((feature, featureIndex) => {
                      const FeatureIcon = feature.icon;
                      return (
                        <div
                          key={featureIndex}
                          className="flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-full border border-neutral-200 dark:border-neutral-700"
                        >
                          <FeatureIcon className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm font-medium">{feature.text}</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-6">
                    <Button 
                      variant="ghost" 
                      className="group-hover:bg-white/80 dark:group-hover:bg-neutral-800/80 transition-colors"
                    >
                      <span className="mr-2">Configure</span>
                      <Settings2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-12 p-6 bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
        <h3 className="text-lg font-semibold mb-2">Need help?</h3>
        <p className="text-muted-foreground mb-4">
          Check out our documentation or contact support for assistance with your settings.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            View Documentation
          </Button>
          <Button variant="outline" size="sm">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}  