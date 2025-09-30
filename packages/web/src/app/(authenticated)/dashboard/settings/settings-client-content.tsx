'use client';

import { useRouter } from 'next/navigation';
import {
  Mail,
  Shield,
  ArrowRight,
  Zap,
  Link2,
  Wallet,
  Key,
  Coins,
  Building2,
  Users,
} from 'lucide-react';
import Link from 'next/link';

export function SettingsClientContent() {
  const router = useRouter();

  const settingsOptions = [
    {
      id: 'advanced-wallet',
      title: 'Advanced Wallet Settings',
      description:
        'Manage wallet addresses, recovery options, and security settings',
      icon: Shield,
      features: ['Wallet management', 'Recovery options'],
      path: '/dashboard/settings/advanced-wallet',
    },
    {
      id: 'payment-accounts',
      title: 'Payment & Virtual Accounts',
      description:
        'Manage virtual bank accounts and transfer funds between fiat and crypto',
      icon: Building2,
      features: ['Virtual accounts', 'Fiat transfers', 'Auto-conversion'],
      path: '/dashboard/settings/payment-accounts',
    },
    {
      id: 'company',
      title: 'Workspace & Company',
      description:
        'Manage your workspace settings, team members, and company profile for invoicing',
      icon: Users,
      features: [
        'Workspace name',
        'Team members',
        'Company profile',
        'Contractors',
      ],
      path: '/dashboard/settings/company',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F2]">
      {/* Dashboard Header - Following Design Language */}
      <header className="sticky top-0 z-40 bg-[#F7F7F2] border-b border-[#101010]/10">
        <div className="h-[60px] flex items-center px-4 sm:px-6 max-w-[1400px] mx-auto">
          <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mr-3">
            Account
          </p>
          <h1 className="font-serif text-[24px] sm:text-[28px] leading-[1] text-[#101010]">
            Settings
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 py-6 sm:py-8 max-w-[1400px] mx-auto">
        {/* Settings Cards Grid */}
        <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {settingsOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div
                key={option.id}
                className="bg-white border border-[#101010]/10 rounded-lg p-5 sm:p-6 hover:shadow-sm transition-shadow cursor-pointer"
                onClick={() => router.push(option.path)}
              >
                <div className="flex items-start gap-3">
                  <Icon className="h-5 w-5 text-[#0050ff] mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h2 className="text-[15px] sm:text-[16px] font-medium text-[#101010]">
                      {option.title}
                    </h2>
                    <p className="mt-2 text-[13px] sm:text-[14px] text-[#101010]/70 leading-[1.5]">
                      {option.description}
                    </p>

                    {/* Features */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {option.features.map((feature, index) => (
                        <span
                          key={index}
                          className="inline-flex px-2.5 py-1 bg-[#F7F7F2] text-[11px] text-[#101010]/60 rounded-md"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    <button className="inline-flex items-center mt-4 text-[13px] text-[#0050ff] hover:text-[#0040dd] transition-colors">
                      Configure
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-white border border-[#101010]/10 rounded-lg p-5 sm:p-6">
          <h3 className="text-[15px] font-medium text-[#101010] mb-2">
            Need help?
          </h3>
          <p className="text-[13px] text-[#101010]/60 mb-4">
            Check out our documentation or contact support for assistance with
            your settings.
          </p>
          <div className="flex gap-3">
            <Link href="/support">
              <button className="px-4 py-2 text-[13px] font-medium text-[#101010] bg-white border border-[#101010]/20 rounded-md hover:bg-[#F7F7F2] transition-colors">
                View Documentation
              </button>
            </Link>
            <Link href="/support">
              <button className="px-4 py-2 text-[13px] font-medium text-[#101010] bg-white border border-[#101010]/20 rounded-md hover:bg-[#F7F7F2] transition-colors">
                Contact Support
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
