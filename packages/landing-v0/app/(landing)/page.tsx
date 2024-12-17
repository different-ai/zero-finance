'use client';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  Brain,
  Building2,
  Shield,
  Sparkles,
  CheckCircle,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { Demo } from './demo/demo';
import { PricingCards } from './components/pricing-cards';
import { WaitlistForm } from './components/waitlist-form';

type MainLandingProps = {
  children?: ReactNode;
};

type AlternateLandingProps = {
  children?: ReactNode;
};

const MainLanding = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="text-center mb-24">
        <div className="inline-flex items-center bg-muted/50 rounded-full px-3 py-1 mb-8">
          <Sparkles className="h-4 w-4 mr-2 text-[#6E45FE]" />
          <span className="text-sm">Open source</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent text-white">
          Every little task, automated
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
          HyprSqrl connects to your favorite apps and screen, using AI agents to
          automate away mundane tasks.
        </p>

        {/* Waitlist Form */}
        <div className="mb-8">
          <WaitlistForm />
          <p className="text-sm text-gray-400 mt-2">
            Join the waitlist to get early access and updates
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <Link href="#how-it-works" legacyBehavior>
            <Button size="lg" variant="outline">
              See How It Works
            </Button>
          </Link>
        </div>
      </section>
      <Demo />

      {/* Features Section - Updated with Privacy Focus */}
      <section className="mb-24 mt-24">
        <h2 className="text-3xl font-bold text-center mb-12">
          Privacy-First AI Agents
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Brain className="h-6 w-6 text-[#6E45FE]" />,
              title: 'Local LLM Processing',
              description:
                'Run AI models locally on your machine. Your data never leaves your computer, ensuring complete privacy and control.',
            },
            {
              icon: <Shield className="h-6 w-6 text-[#6E45FE]" />,
              title: 'Privacy-First Screen Analysis',
              description:
                'Screenpipe monitors your activity locally, with zero cloud processing. You control what gets analyzed and stored.',
            },
            {
              icon: <Settings className="h-6 w-6 text-[#6E45FE]" />,
              title: 'Custom LLM Integration',
              description:
                'Choose your preferred AI model or host your own. Full flexibility for enterprise-grade privacy requirements.',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-xl border bg-card hover:shadow-lg transition-all"
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Integrations Section - New */}
      <section className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Works With Your Tools</h2>
          <p className="text-xl text-gray-400">
            Seamlessly connects with your existing workflow
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              name: 'Screenpipe',
              status: 'active',
              description: 'Screen activity monitoring',
            },
            {
              name: 'Obsidian',
              status: 'active',
              description: 'Task management',
            },
            {
              name: 'Calendar',
              status: 'active',
              description: 'Event scheduling',
            },
            {
              name: 'Gmail',
              status: 'coming-soon',
              description: 'Coming soon',
            },
            {
              name: 'GitHub',
              status: 'coming-soon',
              description: 'Coming soon',
            },
            {
              name: 'Linear',
              status: 'coming-soon',
              description: 'Coming soon',
            },
            {
              name: 'Telegram',
              status: 'coming-soon',
              description: 'Coming soon',
            },
            {
              name: 'Slack',
              status: 'coming-soon',
              description: 'Coming soon',
            },
          ].map((tool) => (
            <div
              key={tool.name}
              className={`p-4 rounded-xl border ${
                tool.status === 'active'
                  ? 'bg-[#6E45FE]/10 border-[#6E45FE]'
                  : 'bg-card border-border opacity-50'
              } text-center relative group hover:scale-105 transition-all duration-200`}
            >
              <span className="font-medium block mb-1">{tool.name}</span>
              <span className="text-sm text-gray-400">{tool.description}</span>
              {tool.status === 'coming-soon' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium text-white">
                    Coming Soon
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy Section - New */}
      <section className="mb-24 bg-gradient-to-b from-[#1C1D21] to-background rounded-xl p-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Eventually Invisible Software
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            HyprSqrl is built on a simple philosophy: the best productivity app
            is the one you don't need to think about. As our AI agents learn
            your workflow, they'll handle more and more tasks automatically -
            making the software gradually fade into the background of your life.
          </p>
        </div>
      </section>

      {/* Business Section - Updated with Privacy Focus */}
      <section className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Custom Agents for your team
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            We build custom agents for your team, no complex integrations or
            APIs required.
          </p>
        </div>
        <div className="flex gap-8 justify-center">
          <div className="p-8 rounded-xl border bg-card max-w-xl">
            <Building2 className="h-8 w-8 text-[#6E45FE] mb-4" />
            <h3 className="text-2xl font-semibold mb-4">
              Replace repetitive work with AI agents
            </h3>
            <p className="text-gray-400 mb-6">
              Our AI agents silently watch your screen, automating away the
              tedious tasks that eat up your team's productive hours—no APIs, no
              integrations, just instant automation.
            </p>
            <ul className="space-y-3">
              {[
                'Auto-file expenses when receipt images appear',
                'Create JIRA tickets from Slack conversations',
                'Schedule meetings when times are mentioned',
                'Copy data between legacy enterprise apps',
                'Auto-fill forms across any application',
                'Format and clean spreadsheet data',
                'Extract action items from meeting screenshots',
                'Update status reports across tools',
              ].map((item, i) => (
                <li key={i} className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-gray-400 italic">
              "We reduced our operations team from 5 people to 2 + gh AI agents"
              - John
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-400">
            Choose the plan that works best for you
          </p>
        </div>
        <PricingCards />
      </section>

      {/* CTA Section - Updated */}
      <section className="text-center mb-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Take Control?</h2>
          <p className="text-xl text-gray-400 mb-8">
            Join the waitlist to be among the first to experience HyprSqrl
          </p>
          {/* Waitlist Form */}
          <div className="mb-8">
            <WaitlistForm />
            <p className="text-sm text-gray-400 mt-2">
              Get early access and exclusive updates
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

const AlternateLanding = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="text-center mb-24">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent text-white">
          Turn Every Manual Export Into an Opportunity for Automation
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
          We build on-demand AI agents that automate the most repetitive steps
          in your workflows, regardless of whether there is an API or not
        </p>

        {/* Replace WaitlistForm with Cal Link */}
        <Link
          href="https://cal.com/team/different-ai/discovery-call"
          legacyBehavior
        >
          <Button size="lg" className="bg-[#6E45FE] hover:bg-[#5835DB]">
            Schedule a Demo
          </Button>
        </Link>
      </section>

      {/* Add Demo Section */}
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

      {/* Privacy and Security Section */}
      <section className="mb-24">
        <h2 className="text-3xl font-bold text-center mb-12">
          Privacy and Security at the Core
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'On-Premise or Self-Hosted',
              description:
                'Deploy HyprSqrl where you need it. Keep data in-house for compliance and peace of mind.',
            },
            {
              title: 'Custom LLM Integration',
              description:
                "Use your own Large Language Models or our pre-vetted solutions. You control your data's destiny.",
            },
            {
              title: 'Enterprise-Grade Security',
              items: [
                'Data residency options',
                'End-to-end encryption',
                'Regular security audits',
              ],
            },
          ].map((feature, i) => (
            <div key={i} className="p-6 rounded-xl border bg-card">
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              {feature.description ? (
                <p className="text-gray-400">{feature.description}</p>
              ) : (
                <ul className="space-y-3">
                  {feature.items?.map((item, j) => (
                    <li key={j} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[#6E45FE] mr-2" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Enterprise Section - Without Individual Pricing */}
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
            <Link href="https://cal.com/your-calendar" legacyBehavior>
              <Button size="lg" className="bg-[#6E45FE] hover:bg-[#5835DB]">
                Contact Sales
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
          <Link href="https://cal.com/team/different-ai/discovery-call" legacyBehavior>
            <Button size="lg" className="bg-[#6E45FE] hover:bg-[#5835DB]">
              Schedule a Demo
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default function Component() {
  const [showCompany, setShowCompany] = useState(false);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex items-center gap-4 mb-12 text-lg">
        <span
          className={`font-medium ${!showCompany ? 'text-[#6E45FE]' : 'text-gray-400'}`}
        >
          Individual
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={showCompany}
          onClick={() => setShowCompany(!showCompany)}
          className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${
            showCompany ? 'bg-[#6E45FE]' : 'bg-input'
          }`}
        >
          <span className="sr-only">Toggle company view</span>
          <span
            className={`pointer-events-none block h-6 w-6 rounded-full bg-background shadow-lg ring-0 transition-transform ${
              showCompany ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
        <span
          className={`font-medium ${showCompany ? 'text-[#6E45FE]' : 'text-gray-400'}`}
        >
          Company
        </span>
      </div>

      {showCompany ? <AlternateLanding /> : <MainLanding />}
    </div>
  );
}
