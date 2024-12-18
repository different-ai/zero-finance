import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import {
  Brain,
  Shield,
  Sparkles,
  CheckCircle,
  Settings,
  Building2,
} from 'lucide-react';
import Link from 'next/link';
import { Demo } from '../demo/demo';
import { PricingCards } from '../components/pricing-cards';
import dynamic from 'next/dynamic';

// Client components

const WaitlistForm = dynamic(() => import('../components/waitlist-form'), {
  ssr: true
});

export const metadata: Metadata = {
  title: 'HyprSqrl - AI Automation for Individuals',
  description: 'Connect your favorite apps and screen with AI agents to automate away mundane tasks.',
  openGraph: {
    title: 'HyprSqrl - AI Automation for Individuals',
    description: 'Connect your favorite apps and screen with AI agents to automate away mundane tasks.',
  },
};

export default function IndividualLanding() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex justify-end mb-8">
        <Link href="/company" className="text-gray-400 hover:text-[#6E45FE]">
          Looking for enterprise? →
        </Link>
      </div>
      
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
          <Link href="#how-it-works" className="inline-block">
            <Button size="lg" variant="outline">
              See How It Works
            </Button>
          </Link>
        </div>
      </section>

      <Demo />

      {/* Features Section */}
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

      {/* Integrations Section */}
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

      {/* CTA Section */}
      <section className="text-center mb-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Take Control?</h2>
          <p className="text-xl text-gray-400 mb-8">
            Join the waitlist to be among the first to experience HyprSqrl
          </p>
          <div className="mb-8">
            <WaitlistForm />
            <p className="text-sm text-gray-400 mt-2">
              Get early access and exclusive updates
            </p>
          </div>
        </div>
      </section>
    </div>
  );
} 