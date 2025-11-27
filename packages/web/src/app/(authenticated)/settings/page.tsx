import { Metadata } from 'next';
import Link from 'next/link';
import { CreditCard, Shield, BellRing, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Settings - Zero Finance',
  description: 'Manage your settings and preferences',
};

export default function SettingsPage() {
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
        <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Funding Sources Card */}
          <div className="bg-white border border-[#101010]/10 rounded-lg p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <CreditCard className="h-5 w-5 text-[#0050ff] mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h2 className="text-[15px] sm:text-[16px] font-medium text-[#101010]">
                  Funding Sources
                </h2>
                <p className="mt-2 text-[13px] sm:text-[14px] text-[#101010]/70 leading-[1.5]">
                  Manage your payment methods and bank connections
                </p>
                <p className="mt-3 text-[12px] text-[#101010]/50">
                  Virtual bank account setup is available in your dashboard
                  onboarding flow.
                </p>
                <Link
                  href="/settings/funding-sources"
                  className="inline-flex items-center mt-4 text-[13px] text-[#0050ff] hover:text-[#0040dd] transition-colors"
                >
                  Manage funding sources
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Security Card */}
          <div className="bg-white border border-[#101010]/10 rounded-lg p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-[#0050ff] mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h2 className="text-[15px] sm:text-[16px] font-medium text-[#101010]">
                  Security
                </h2>
                <p className="mt-2 text-[13px] sm:text-[14px] text-[#101010]/70 leading-[1.5]">
                  Manage your account security and access
                </p>
                <p className="mt-3 text-[12px] text-[#101010]/50">
                  Update your recovery options, security settings, and access
                  controls.
                </p>
                <Link
                  href="/settings/security"
                  className="inline-flex items-center mt-4 text-[13px] text-[#0050ff] hover:text-[#0040dd] transition-colors"
                >
                  Security settings
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Notifications Card */}
          <div className="bg-white border border-[#101010]/10 rounded-lg p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <BellRing className="h-5 w-5 text-[#0050ff] mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h2 className="text-[15px] sm:text-[16px] font-medium text-[#101010]">
                  Notifications
                </h2>
                <p className="mt-2 text-[13px] sm:text-[14px] text-[#101010]/70 leading-[1.5]">
                  Manage your notification preferences
                </p>
                <p className="mt-3 text-[12px] text-[#101010]/50">
                  Control how you receive notifications about invoices,
                  payments, and other events.
                </p>
                <Link
                  href="/settings/notifications"
                  className="inline-flex items-center mt-4 text-[13px] text-[#0050ff] hover:text-[#0040dd] transition-colors"
                >
                  Notification preferences
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
