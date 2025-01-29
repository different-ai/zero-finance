import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Demo } from './demo/demo';
import { IntegrationsGrid } from './components/integrations-grid';
import { enterpriseIntegrations } from './data/integrations';
import { WaitlistForm } from './components/waitlist-form';
import { DemoButton } from './components/demo-button';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'HyprSqrl - AI-Powered Crypto Finance Automation',
  description:
    'Custom AI agents that automate your crypto finances using screen automation. Perfect for freelancers and small businesses.',
  openGraph: {
    title: 'HyprSqrl - AI-Powered Crypto Finance Automation',
    description:
      'Custom AI agents that automate your crypto finances using screen automation. Perfect for freelancers and small businesses.',
  },
};

// Separate any components that use useSearchParams
function MainContent() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <section className="text-center mb-24">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent text-white">
          Inbox Zero for your crypto finances - Stay compliant and get paid on
          time.
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
          hyprsqrl provides you with a dashboard that hooks into your financial
          tools and manages them for you. Anything from creating invoices,
          getting paid, and managing your crypto finances.
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
          Financial Automation—No Constraints
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Smart Invoice Creation',
              description:
                'Auto-detect any mention of needing payment → generate a Request Network invoice. Supports EURe, USDC, and more stablecoins.',
            },
            {
              title: 'Automated Payment Processing',
              description:
                'Detect payment triggers from meetings and chats. Automatically process stablecoin payments and manage recurring transactions.',
            },
            {
              title: 'Treasury Management',
              description:
                'Monitor your on-chain funds across DeFi protocols. Identify yield opportunities and optimize allocations automatically.',
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
        title="Works With Your Crypto Tools"
        subtitle="Seamlessly integrates with your existing DeFi and crypto infrastructure"
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
              title: 'Freelancers',
              items: [
                'Create ETH/USDC invoices from chat messages',
                'Auto-schedule payments when milestones hit',
                'Track all income in one dashboard',
              ],
            },
            {
              title: 'Small Crypto Teams',
              items: [
                'Instantly catch incoming contractor bills',
                'Auto-pay in stablecoins from treasury',
                'Optimize idle funds with DeFi yields',
              ],
            },
            {
              title: 'Treasury Management',
              items: [
                'Monitor DeFi positions across protocols',
                'Get alerts for better yield opportunities',
                'Automate stablecoin allocations',
              ],
            },
            {
              title: 'Compliance & Reporting',
              items: [
                'Log every transaction on-chain',
                'Generate auditable payment records',
                'Export data for accounting',
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
            Customized for your organization's crypto operations
          </p>
        </div>
        <div className="max-w-3xl mx-auto p-8 rounded-xl border bg-card">
          <h3 className="text-2xl font-bold mb-4">Enterprise Plan</h3>
          <p className="text-xl mb-6">
            Starting from $500/month (billed annually)
          </p>
          <ul className="space-y-4">
            {[
              'AI-powered crypto task detection from screen activity',
              'Automated stablecoin payment processing',
              'Smart treasury management and DeFi yield optimization',
              'Custom crypto automation workflows',
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
            Ready to Automate Your Crypto Finances?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join the waitlist to be among the first to streamline your crypto
            operations with AI-powered automation.
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

export default function RootPage() {
  return (
    <Suspense>
      <MainContent />
    </Suspense>
  );
}
