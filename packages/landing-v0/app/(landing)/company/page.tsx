import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Demo } from '../demo/demo';

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
          Turn Every Manual Export Into an Opportunity for Automation
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
          We build on-demand AI agents that automate the most repetitive steps
          in your workflows, regardless of whether there is an API or not
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
              title: 'Watch and Act on Your Screen',
              description:
                "HyprSqrl's custom AI agents observe your tools visually. They don't need official integrations or APIs. If your team can see it, HyprSqrl can automate it.",
            },
            {
              title: 'No More Export-Import Loops',
              description:
                'Why export data just to reformat or rekey it into another system? With HyprSqrl, those tasks become one-click automations. Reports get generated, formatted, and analyzed instantly.',
            },
            {
              title: 'Seamless Intelligence Everywhere',
              description:
                'Turn your CSV downloads and manual reconciliations into automated workflows. Our AI handles routine analysis, surfaces patterns humans might miss, and suggests next actions.',
            },
          ].map((feature, i) => (
            <div key={i} className="p-6 rounded-xl border bg-card">
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

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
                'Take QuickBooks exports and produce comprehensive snapshots',
                'Reconcile Stripe payments and update billing automatically',
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
              'Custom-built AI agents for your exact workflows',
              'Privacy-first workflows deployment options',
              'Custom LLM model integration',
              'Dedicated support team and onboarding',
              'Priority feature development',
              'Custom integration development',
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