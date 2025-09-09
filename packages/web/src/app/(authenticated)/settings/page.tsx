import { Metadata } from 'next';
import Link from 'next/link';
import { CreditCard, Shield, BellRing, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Settings - Hypr',
  description: 'Manage your settings and preferences',
};

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F2]">
      {/* Hero Section */}
      <section className="bg-[#F6F5EF] border-b border-[#101010]/10 py-16">
        <div className="max-w-[1200px] mx-auto px-4">
          <p className="uppercase tracking-[0.18em] text-[12px] text-[#101010]/70">
            Account Management
          </p>
          <h1 className="mt-3 font-serif text-[48px] sm:text-[56px] leading-[0.96] tracking-[-0.01em] text-[#101010]">
            Settings
          </h1>
          <p className="mt-4 text-[16px] leading-[1.5] text-[#101010]/80 max-w-[65ch]">
            Manage your accounts, profiles, and preferences
          </p>
        </div>
      </section>

      {/* Settings Grid */}
      <section className="bg-white py-12 sm:py-16">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid gap-px bg-[#101010]/10 md:grid-cols-2 lg:grid-cols-3">
            {/* Funding Sources Card */}
            <div className="bg-white p-8">
              <div className="flex items-start gap-4">
                <CreditCard className="h-5 w-5 text-[#1B29FF] mt-1" />
                <div className="flex-1">
                  <h2 className="font-serif text-[24px] leading-[1.1] text-[#101010]">
                    Funding Sources
                  </h2>
                  <p className="mt-2 text-[14px] leading-[1.5] text-[#101010]/70">
                    Manage your payment methods and bank connections
                  </p>
                  <p className="mt-4 text-[13px] text-[#101010]/60">
                    Virtual bank account setup is available in your dashboard
                    onboarding flow.
                  </p>
                  <Link
                    href="/settings/funding-sources"
                    className="inline-flex items-center mt-6 text-[15px] text-[#101010] hover:text-[#1B29FF] underline decoration-[#101010]/30 underline-offset-[4px] hover:decoration-[#1B29FF] transition-colors"
                  >
                    Manage All Funding Sources
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Security Card */}
            <div className="bg-white p-8">
              <div className="flex items-start gap-4">
                <Shield className="h-5 w-5 text-[#1B29FF] mt-1" />
                <div className="flex-1">
                  <h2 className="font-serif text-[24px] leading-[1.1] text-[#101010]">
                    Security
                  </h2>
                  <p className="mt-2 text-[14px] leading-[1.5] text-[#101010]/70">
                    Manage your account security and access
                  </p>
                  <p className="mt-4 text-[13px] text-[#101010]/60">
                    Update your wallet connections, recovery options, and access
                    controls.
                  </p>
                  <Link
                    href="/settings/security"
                    className="inline-flex items-center mt-6 text-[15px] text-[#101010] hover:text-[#1B29FF] underline decoration-[#101010]/30 underline-offset-[4px] hover:decoration-[#1B29FF] transition-colors"
                  >
                    Security Settings
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Notifications Card */}
            <div className="bg-white p-8">
              <div className="flex items-start gap-4">
                <BellRing className="h-5 w-5 text-[#1B29FF] mt-1" />
                <div className="flex-1">
                  <h2 className="font-serif text-[24px] leading-[1.1] text-[#101010]">
                    Notifications
                  </h2>
                  <p className="mt-2 text-[14px] leading-[1.5] text-[#101010]/70">
                    Manage your notification preferences
                  </p>
                  <p className="mt-4 text-[13px] text-[#101010]/60">
                    Control how you receive notifications about invoices,
                    payments, and other events.
                  </p>
                  <Link
                    href="/settings/notifications"
                    className="inline-flex items-center mt-6 text-[15px] text-[#101010] hover:text-[#1B29FF] underline decoration-[#101010]/30 underline-offset-[4px] hover:decoration-[#1B29FF] transition-colors"
                  >
                    Notification Preferences
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
