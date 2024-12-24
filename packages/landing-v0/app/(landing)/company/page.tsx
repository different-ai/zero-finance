import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Demo } from '../demo/demo';
import { IntegrationsGrid } from '../components/integrations-grid';
import { enterpriseIntegrations } from '../data/integrations';

export const metadata: Metadata = {
  title: 'HyprSqrl - Enterprise AI Automation',
  description: 'Custom AI agents that automate repetitive steps in your workflows, with or without APIs.',
  openGraph: {
    title: 'HyprSqrl - Enterprise AI Automation',
    description: 'Custom AI agents that automate repetitive steps in your workflows, with or without APIs.',
  },
};

export default function CompanyLanding() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex justify-end mb-8">
        <Link href="/individual" className="text-gray-400 hover:text-[#6E45FE]">
          Looking for personal use? →
        </Link>
      </div>

      {/* Hero Section */}
      <section className="text-center mb-24">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent text-white">
          Automate Your Business Finances, Seamlessly
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
          Our AI agents watch your screen to handle finances—from treasury management 
          to invoice creation—using stablecoins (USDC) for programmatic operations, 
          even without official APIs
        </p>

        <Link
          href="https://cal.com/team/different-ai/discovery-call"
          className="inline-block"
        >
          <Button size="lg" className="bg-[#6E45FE] hover:bg-[#5835DB]">
            Schedule a Demo
          </Button>
        </Link>
      </section>

      <Demo />

      {/* The HyprSqrl Difference Section */}
      <section className="mb-24">
        <h2 className="text-3xl font-bold text-center mb-12 mt-12">
          Automation Without Constraints
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'AI-Powered Financial Operations',
              description:
                "HyprSqrl's AI agents watch your screen to automate financial workflows. From treasury management to bank transfers, if your team can see it, we can automate it.",
            },
            {
              title: 'Automated Invoice Generation',
              description:
                'Generate and process invoices automatically from your communications and screen activity. No more manual data entry or reformatting—our AI handles it all instantly.',
            },
            {
              title: 'Smart Treasury Management',
              description:
                'Automate USDC/fiat allocation and financial operations. Our AI handles routine transactions, monitors treasury positions, and suggests optimal actions for your business.',
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
        title="Enterprise-Ready Integrations"
        subtitle="Works with your existing enterprise tools and workflows"
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
              title: 'Sales & CRM',
              items: [
                'Instantly format Salesforce deal exports into pipeline insights',
                'Automate repetitive win/loss analysis reports',
              ],
            },
            {
              title: 'Finance & Accounting',
              items: [
                'Automatically allocate USDC/fiat with our Treasury Agent',
                'Generate invoices instantly from screen activity',
                'Process bank transfers seamlessly within workflows',
              ],
            },
            {
              title: 'Operations & HR',
              items: [
                'Generate weekly performance reviews from multiple sources',
                'Draft policy documents from messy notes instantly',
              ],
            },
            {
              title: 'IT & DevOps',
              items: [
                'Synchronize Jira or GitHub issues across tools',
                'Create self-updating status dashboards',
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
            Customized for your organization's needs
          </p>
        </div>
        <div className="max-w-3xl mx-auto p-8 rounded-xl border bg-card">
          <h3 className="text-2xl font-bold mb-4">Enterprise Plan</h3>
          <p className="text-xl mb-6">
            Starting from $1,000/month (billed annually)
          </p>
          <ul className="space-y-4">
            {[
              'Live now: AI-powered invoice generation from screen activity',
              'Coming soon: Treasury Agent for USDC/fiat allocation',
              'Coming soon: Seamless bank transfer integration',
              'Custom-built AI agents for your exact workflows',
              'Privacy-first workflows deployment options',
              'Dedicated support team and enterprise onboarding',
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
            Automate Your Team's Manual Processes
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Schedule a demo to see how HyprSqrl can automate your team's manual
            processes.
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