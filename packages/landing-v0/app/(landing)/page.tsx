import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Demo } from './demo/demo';
import { IntegrationsGrid } from './components/integrations-grid';
import { enterpriseIntegrations } from './data/integrations'; // Rename or remove if not needed
import { WaitlistForm } from './components/waitlist-form';
import { DemoButton } from './components/demo-button';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'hyprsqrl - Automate Your Financial Tasks',
  description:
    'The AI agent that automates your financial tasks, from invoicing to payment reconciliation. Ideal for businesses with high transaction volumes, such as freelancers, small businesses, and e-commerce platforms.',
  openGraph: {
    title: 'hyprsqrl - Automate Your Financial Tasks',
    description:
      'The AI agent that automates your financial tasks, ensuring you stay compliant, manage payments, and reconcile transactions effortlessly. Perfect for businesses with multiple daily payments.',
  },
};

// Separate any components that use useSearchParams
function MainContent() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <section className="text-center mb-24">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent text-white">
          Automate your finances
          <br />
          with AI-powered precision
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
          hyprsqrl automates your invoicing, payment collection, and reconciliation—saving you hours of manual work every week.
        </p>
        <div className="flex flex-col items-center gap-6">
          <WaitlistForm />
          or
          <DemoButton />
        </div>
      </section>

      <Demo />

      {/* The hyprsqrl Advantage Section */}
      <section className="mb-24">
        <h2 className="text-3xl font-bold text-center mb-12 mt-12">
          Financial automation for high-volume businesses
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Smart invoice creation',
              description:
                'Auto-detect payment needs from chats or emails and generate invoices instantly. Supports multiple currencies and tax rules.',
            },
            {
              title: 'Automated payment processing',
              description:
                'Trigger payments based on milestones, chats, or recurring schedules. Never miss a bill or payment again.',
            },
            {
              title: 'Effortless reconciliation',
              description:
                'Automatically match incoming payments to invoices, track outstanding balances, and get alerts for discrepancies.',
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
        title="Works with your finance tools"
        subtitle="Seamlessly integrates with your existing financial software"
        integrations={enterpriseIntegrations} // Remove or adjust if not needed
      />

      {/* Real-World Examples Section */}
      <section className="mb-24 bg-gradient-to-b from-[#1C1D21] to-background rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          Real-world examples
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              title: 'Freelancers',
              items: [
                'Create invoices from chat messages',
                'Auto-trigger payments when milestones are met',
                'Reconcile payments across multiple clients',
              ],
            },
            {
              title: 'Small teams',
              items: [
                'Instantly capture incoming bills',
                'Auto-pay recurring expenses',
                'Reconcile high volumes of daily transactions',
              ],
            },
            {
              title: 'E-commerce & subscription businesses',
              items: [
                'Automatically match payments to orders or subscriptions',
                'Track outstanding balances in real-time',
                'Get alerts for unmatched or delayed payments',
              ],
            },
            {
              title: 'Budget management',
              items: [
                'Monitor balances across multiple accounts',
                'Spot better rates and optimize cash flow',
                'Automate savings and budget allocations',
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
          <h2 className="text-3xl font-bold mb-4">Enterprise solutions</h2>
          <p className="text-xl text-gray-400">
            Tailored for organizations with complex financial operations
          </p>
        </div>
        <div className="max-w-3xl mx-auto p-8 rounded-xl border bg-card">
          <h3 className="text-2xl font-bold mb-4">Enterprise plan</h3>
          <p className="text-xl mb-6">
            Starting from $500/month (billed annually)
          </p>
          <ul className="space-y-4">
            {[
              'AI-powered task detection for financial workflows',
              'Automated payment processing and reconciliation',
              'Custom automation for high-volume transactions',
              'Enterprise-grade security and compliance',
              'Dedicated support and implementation assistance',
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
                Schedule a demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="text-center mb-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Ready to streamline your payment reconciliation?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join the waitlist to automate your financial tasks and save hours on manual reconciliation.
          </p>
          <WaitlistForm />
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