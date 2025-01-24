import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Demo } from './demo/demo';
import { IntegrationsGrid } from './components/integrations-grid';
import { enterpriseIntegrations } from './data/integrations';
import { WaitlistForm } from './components/waitlist-form';
import { DemoButton } from './components/demo-button';

export const metadata: Metadata = {
  title: 'HyprSqrl - AI-Powered Financial Automation',
  description: 'Custom AI agents that automate your business finances using stablecoins and screen automation.',
  openGraph: {
    title: 'HyprSqrl - AI-Powered Financial Automation',
    description: 'Custom AI agents that automate your business finances using stablecoins and screen automation.',
  },
};

export default function RootPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <section className="text-center mb-24">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent text-white">
          Financial Automation for your Business
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
          Our AI agents watch your screen to handle finances—from treasury management 
          to invoice creation—even without official APIs
        </p>

        <div className="flex flex-col items-center gap-6">
          <WaitlistForm />
          
          or 
          <DemoButton />
        </div>
      </section>

      <Demo />

      {/* The HyprSqrl Difference Section */}
      <section className="mb-24">
        <h2 className="text-3xl font-bold text-center mb-12 mt-12">
          Financial Automation Without Constraints
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Smart Treasury Management',
              description:
                'Our AI monitors your treasury positions across DeFi protocols, automatically identifying yield opportunities and suggesting optimal allocations.',
            },
            {
              title: 'Automated Payment Processing',
              description:
                'Detect payment triggers from meetings, emails, and documents. Automatically process USDC payments and manage recurring transactions.',
            },
            {
              title: 'Intelligent Invoice Handling',
              description:
                'Automatically detect, categorize, and process invoices from any source. Generate payment requests and track payment status effortlessly.',
            },
          ].map((feature, i) => (
            <div key={i} className="p-6 rounded-xl border bg-card">
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Integrations Section */}
      <IntegrationsGrid
        title="Financial Integrations"
        subtitle="Works with your existing financial tools and DeFi protocols"
        integrations={enterpriseIntegrations}
      />

      {/* Real-World Examples Section */}
      <section className="mb-24 bg-gradient-to-b from-[#1C1D21] to-background rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          Real-World Examples
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              title: 'Treasury Management',
              items: [
                'Automatically monitor and optimize DeFi yields',
                'Manage USDC/fiat allocations efficiently',
                'Track and analyze treasury performance',
              ],
            },
            {
              title: 'Payment Processing',
              items: [
                'Detect and process payment agreements from meetings',
                'Automate recurring USDC payments',
                'Handle multi-currency transactions',
              ],
            },
            {
              title: 'Invoice Management',
              items: [
                'Automatically detect and categorize invoices',
                'Generate payment requests in USDC',
                'Track payment status and reconciliation',
              ],
            },
            {
              title: 'Financial Reporting',
              items: [
                'Generate real-time treasury reports',
                'Track DeFi yield performance',
                'Monitor payment flows and reconciliation',
              ],
            },
          ].map((category, i) => (
            <div
              key={i}
              className="p-6 rounded-xl border bg-card/50 backdrop-blur"
            >
              <h3 className="text-xl font-semibold mb-4">{category.title}</h3>
              <ul className="space-y-3">
                {category.items.map((item, j) => (
                  <li key={j} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[#6E45FE] mr-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Enterprise Solutions</h2>
          <p className="text-xl text-gray-400">
            Customized for your organization's financial operations
          </p>
        </div>
        <div className="max-w-3xl mx-auto p-8 rounded-xl border bg-card">
          <h3 className="text-2xl font-bold mb-4">Enterprise Plan</h3>
          <p className="text-xl mb-6">
            Starting from $500/month (billed annually)
          </p>
          <ul className="space-y-4">
            {[
              'AI-powered financial task detection from screen activity',
              'Automated USDC payment processing',
              'Smart treasury management and yield optimization',
              'Custom financial automation workflows',
              'Enterprise-grade security and compliance',
              'Dedicated support team and implementation assistance',
            ].map((feature, i) => (
              <li key={i} className="flex items-center">
                <CheckCircle className="h-5 w-5 text-[#6E45FE] mr-2" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Link
              href="https://cal.com/team/different-ai/discovery-call"
              className="inline-block"
            >
              <Button size="lg" className="bg-[#6E45FE] hover:bg-[#5835DB]">
                Schedule a Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="text-center mb-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Automate Your Financial Operations
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Schedule a demo to see how HyprSqrl can transform your business finances
            with AI-powered automation.
          </p>
          <Link
            href="https://cal.com/team/different-ai/discovery-call"
            className="inline-block"
          >
            <Button size="lg" className="bg-[#6E45FE] hover:bg-[#5835DB]">
              Schedule a Demo
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
