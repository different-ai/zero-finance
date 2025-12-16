'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, Building2, Users, Settings2, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useBimodal } from '@/components/ui/bimodal';
import { cn } from '@/lib/utils';

export function SettingsClientContent() {
  const router = useRouter();
  const { isTechnical } = useBimodal();

  const settingsOptions = [
    {
      id: 'preferences',
      title: isTechnical ? 'PREFERENCES' : 'Preferences',
      description: isTechnical
        ? 'Configure interface mode, display settings, and system preferences'
        : 'Customize your account view and interface settings',
      icon: Settings2,
      features: isTechnical
        ? ['Interface mode', 'Display config']
        : ['View mode', 'Display options'],
      path: '/dashboard/settings/preferences',
      technicalOnly: false,
    },
    {
      id: 'advanced-wallet',
      title: isTechnical ? 'WALLET::ADVANCED' : 'Advanced Wallet Settings',
      description: isTechnical
        ? 'Manage Safe addresses, multi-sig configuration, and recovery options'
        : 'Manage wallet addresses, recovery options, and security settings',
      icon: Wallet,
      features: isTechnical
        ? ['Safe management', 'Multi-sig', 'Recovery']
        : ['Wallet management', 'Recovery options'],
      path: '/dashboard/settings/advanced-wallet',
      technicalOnly: true,
    },
    {
      id: 'payment-accounts',
      title: isTechnical ? 'ACCOUNTS::VIRTUAL' : 'Payment & Virtual Accounts',
      description: isTechnical
        ? 'Configure virtual IBANs, fiat on/off ramps, and auto-conversion rules'
        : 'Manage virtual bank accounts and transfer funds between fiat and crypto',
      icon: Building2,
      features: isTechnical
        ? ['Virtual IBANs', 'On/Off ramp', 'Auto-convert']
        : ['Virtual accounts', 'Fiat transfers', 'Auto-conversion'],
      path: '/dashboard/settings/payment-accounts',
      technicalOnly: true,
    },
    {
      id: 'company',
      title: isTechnical ? 'WORKSPACE::CONFIG' : 'Workspace & Company',
      description: isTechnical
        ? 'Configure workspace parameters, team permissions, and company entity settings'
        : 'Manage your workspace settings, team members, and company profile for invoicing',
      icon: Users,
      features: isTechnical
        ? ['Workspace params', 'Permissions', 'Entity config']
        : ['Workspace name', 'Team members', 'Company profile', 'Contractors'],
      path: '/dashboard/settings/company',
      technicalOnly: false,
    },
  ];

  // Filter options based on mode
  const visibleOptions = settingsOptions.filter(
    (option) => !option.technicalOnly || isTechnical,
  );

  return (
    <div
      className={cn(
        'min-h-screen',
        isTechnical ? 'bg-[#F8F9FA]' : 'bg-[#F7F7F2]',
      )}
    >
      {/* Dashboard Header - Following Design Language */}
      <header
        className={cn(
          'sticky top-0 z-40 border-b',
          isTechnical
            ? 'bg-[#F8F9FA] border-[#1B29FF]/20'
            : 'bg-[#F7F7F2] border-[#101010]/10',
        )}
      >
        <div className="h-[60px] flex items-center px-4 sm:px-6 max-w-[1400px] mx-auto">
          <p
            className={cn(
              'uppercase tracking-[0.14em] text-[11px] mr-3',
              isTechnical ? 'text-[#1B29FF] font-mono' : 'text-[#101010]/60',
            )}
          >
            {isTechnical ? 'SYSTEM::CONFIG' : 'Account'}
          </p>
          <h1
            className={cn(
              'leading-[1] text-[#101010]',
              isTechnical
                ? 'font-mono text-[22px] sm:text-[26px]'
                : 'font-serif text-[24px] sm:text-[28px]',
            )}
          >
            {isTechnical ? 'Settings' : 'Settings'}
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 py-6 sm:py-8 max-w-[1400px] mx-auto">
        {/* Settings Cards Grid */}
        <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div
                key={option.id}
                className={cn(
                  'p-5 sm:p-6 cursor-pointer transition-all',
                  isTechnical
                    ? 'bg-white border border-[#1B29FF]/20 hover:border-[#1B29FF]/40 hover:shadow-[0_0_12px_rgba(27,41,255,0.1)]'
                    : 'bg-white border border-[#101010]/10 rounded-lg hover:shadow-sm',
                )}
                onClick={() => router.push(option.path)}
              >
                <div className="flex items-start gap-3">
                  <Icon
                    className={cn(
                      'h-5 w-5 mt-1 flex-shrink-0',
                      isTechnical ? 'text-[#1B29FF]' : 'text-[#0050ff]',
                    )}
                  />
                  <div className="flex-1">
                    <h2
                      className={cn(
                        'text-[15px] sm:text-[16px] font-medium text-[#101010]',
                        isTechnical && 'font-mono',
                      )}
                    >
                      {option.title}
                    </h2>
                    <p
                      className={cn(
                        'mt-2 text-[13px] sm:text-[14px] leading-[1.5]',
                        isTechnical
                          ? 'text-[#101010]/60 font-mono'
                          : 'text-[#101010]/70',
                      )}
                    >
                      {option.description}
                    </p>

                    {/* Features */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {option.features.map((feature, index) => (
                        <span
                          key={index}
                          className={cn(
                            'inline-flex px-2.5 py-1 text-[11px] rounded-md',
                            isTechnical
                              ? 'bg-[#1B29FF]/5 text-[#1B29FF]/70 font-mono border border-[#1B29FF]/10'
                              : 'bg-[#F7F7F2] text-[#101010]/60',
                          )}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    <button
                      className={cn(
                        'inline-flex items-center mt-4 text-[13px] transition-colors',
                        isTechnical
                          ? 'text-[#1B29FF] hover:text-[#1420CC] font-mono'
                          : 'text-[#0050ff] hover:text-[#0040dd]',
                      )}
                    >
                      {isTechnical ? 'Configure →' : 'Configure'}
                      {!isTechnical && <ArrowRight className="ml-1 h-3 w-3" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Help Section */}
        <div
          className={cn(
            'mt-8 p-5 sm:p-6',
            isTechnical
              ? 'bg-white border border-[#1B29FF]/20'
              : 'bg-white border border-[#101010]/10 rounded-lg',
          )}
        >
          <h3
            className={cn(
              'text-[15px] font-medium text-[#101010] mb-2',
              isTechnical && 'font-mono',
            )}
          >
            {isTechnical ? 'SUPPORT::RESOURCES' : 'Need help?'}
          </h3>
          <p
            className={cn(
              'text-[13px] mb-4',
              isTechnical ? 'text-[#101010]/60 font-mono' : 'text-[#101010]/60',
            )}
          >
            {isTechnical
              ? 'Access documentation, API references, and technical support channels.'
              : 'Check out our documentation or contact support for assistance with your settings.'}
          </p>
          <div className="flex gap-3">
            <Link href="/support">
              <button
                className={cn(
                  'px-4 py-2 text-[13px] font-medium transition-colors',
                  isTechnical
                    ? 'text-[#1B29FF] bg-white border border-[#1B29FF]/30 hover:bg-[#1B29FF]/5 font-mono'
                    : 'text-[#101010] bg-white border border-[#101010]/20 rounded-md hover:bg-[#F7F7F2]',
                )}
              >
                {isTechnical ? 'Documentation' : 'View Documentation'}
              </button>
            </Link>
            <Link href="/support">
              <button
                className={cn(
                  'px-4 py-2 text-[13px] font-medium transition-colors',
                  isTechnical
                    ? 'text-[#1B29FF] bg-white border border-[#1B29FF]/30 hover:bg-[#1B29FF]/5 font-mono'
                    : 'text-[#101010] bg-white border border-[#101010]/20 rounded-md hover:bg-[#F7F7F2]',
                )}
              >
                {isTechnical ? 'Support' : 'Contact Support'}
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
