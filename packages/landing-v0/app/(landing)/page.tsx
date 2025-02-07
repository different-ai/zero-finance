import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Demo } from './demo/demo';
import { IntegrationsGrid } from './components/integrations-grid';
import { enterpriseIntegrations } from './data/integrations'; // rename or remove if not needed
import { WaitlistForm } from './components/waitlist-form';
import { DemoButton } from './components/demo-button';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'hyprsqrl - the ai agent for your finances',
  description:
    'the ai agent that manages your finances so you stay compliant and get paid on time. perfect for freelancers and small businesses.',
  openGraph: {
    title: 'hyprsqrl - the ai agent for your finances',
    description:
      'the ai agent that manages your finances so you stay compliant, pay & get paid on time. perfect for freelancers and small businesses.',
  },
};

// separate any components that use useSearchParams
function MainContent() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* hero section */}
      <section className="text-center mb-24">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent text-white">
          the ai agent for your finances
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
          hyprsqrl is your personal ai agent that automates every step of your
          financial workflow. from invoice creation to compliance and budgeting,
          we give you peace of mind so you stay on track and always pay & get paid on
          time.
        </p>
        <div className="flex flex-col items-center gap-6">
          <WaitlistForm />
          or
          <DemoButton />
        </div>
      </section>

      <Demo />

      {/* the hyprsqrl advantage section */}
      <section className="mb-24">
        <h2 className="text-3xl font-bold text-center mb-12 mt-12">
          financial automation without constraints
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'smart invoice creation',
              description:
                'auto-detect mentions of needing payment, then generate an invoice. supports multiple currencies and tax rules.',
            },
            {
              title: 'automated payment processing',
              description:
                'trigger payments from meetings, chats, or milestones. manage recurring bills automatically so nothing falls behind.',
            },
            {
              title: 'budgeting & optimization',
              description:
                'monitor your accounts in one place. quickly spot better rates, identify spending patterns, and automate savings allocations.',
            },
          ].map((feature, i) => (
            <div key={i} className="p-6 rounded-xl border bg-card">
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* integrations section */}
      <IntegrationsGrid
        title="works with your finance tools"
        subtitle="seamlessly integrates with your existing financial software"
        integrations={enterpriseIntegrations} // remove or adjust if not needed
      />

      {/* real-world examples section */}
      <section className="mb-24 bg-gradient-to-b from-[#1C1D21] to-background rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-12">real-world examples</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              title: 'freelancers',
              items: [
                'create invoices from chat messages',
                'auto-schedule payments when milestones hit',
                'track all income in one dashboard',
              ],
            },
            {
              title: 'small teams',
              items: [
                'instantly catch incoming bills',
                'auto-pay recurring expenses',
                'optimize cash flow in a single view',
              ],
            },
            {
              title: 'budget management',
              items: [
                'monitor balances across multiple accounts',
                'get alerts for better interest opportunities',
                'automate monthly allocations',
              ],
            },
            {
              title: 'compliance & reporting',
              items: [
                'log every transaction automatically',
                'generate auditable records on demand',
                'export data for easy accounting',
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

      {/* enterprise section */}
      <section className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">enterprise solutions</h2>
          <p className="text-xl text-gray-400">
            customized for your organization's financial operations
          </p>
        </div>
        <div className="max-w-3xl mx-auto p-8 rounded-xl border bg-card">
          <h3 className="text-2xl font-bold mb-4">enterprise plan</h3>
          <p className="text-xl mb-6">
            starting from $500/month (billed annually)
          </p>
          <ul className="space-y-4">
            {[
              'ai-powered finance task detection from screen activity',
              'automated payment processing and follow-ups',
              'budgeting and cash flow optimization',
              'custom finance automation workflows',
              'enterprise-grade security and compliance',
              'dedicated support team and implementation assistance',
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
                schedule a demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* final cta section */}
      <section className="text-center mb-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            ready to automate your finances?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            join the waitlist to be among the first to simplify your financial
            operations with ai-powered automation.
          </p>
          <Link
            href="https://cal.com/team/different-ai/discovery-call"
            className="inline-block"
          >
            <Button size="lg" className="bg-[#6E45FE] hover:bg-[#5835DB]">
              schedule a demo
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