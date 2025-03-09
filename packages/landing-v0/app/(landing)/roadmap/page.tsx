import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Clock, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { WaitlistForm } from '../components/waitlist-form';

export const metadata: Metadata = {
  title: 'hyprsqrl Roadmap - Our Vision and Upcoming Features',
  description:
    'See what we\'re building next: from crypto payments to fiat integration, AI-powered analytics and more. Join us on our journey to revolutionize payments for freelancers and businesses.',
  openGraph: {
    title: 'hyprsqrl Roadmap - Our Vision and Upcoming Features',
    description:
      'See what we\'re building next: from crypto payments to fiat integration, AI-powered analytics and more. Join us on our journey to revolutionize payments for freelancers and businesses.',
  },
};

// Define roadmap items with phase and status
const roadmapItems = [
  {
    title: "Crypto Invoicing & Payments",
    description: "Create and send invoices, receive payments in EURe on Gnosis Chain, manage requests in a simple dashboard.",
    phase: "Phase 1",
    status: "active",
    details: [
      "Request Network integration for decentralized invoices",
      "EURe payment support on Gnosis Chain",
      "User dashboard for invoice management",
      "Wallet connectivity and encryption"
    ]
  },
  {
    title: "Fiat Integration & Banking",
    description: "Connect your bank account via IBAN, receive direct deposits, and enable seamless crypto-to-fiat conversions.",
    phase: "Phase 2",
    status: "in-progress",
    details: [
      "Monerium integration for e-money and IBAN connectivity",
      "Direct bank deposits from crypto payments",
      "Automated currency conversion",
      "Payment notifications and confirmations"
    ]
  },
  {
    title: "AI-Powered Business Intelligence",
    description: "ScreenPipe integration for AI-driven insights, chat with your invoices and financial data, automate data extraction.",
    phase: "Phase 2",
    status: "in-progress",
    details: [
      "ScreenPipe integration for AI document analysis",
      "Natural language queries for invoice data",
      "Automated information extraction",
      "Business insights and recommendations"
    ]
  },
  {
    title: "Multi-chain Support",
    description: "Accept payments across multiple blockchains including Ethereum, Polygon, and other EVM-compatible networks.",
    phase: "Phase 3",
    status: "planned",
    details: [
      "Ethereum Mainnet support",
      "Polygon integration",
      "Cross-chain transaction management",
      "Multi-wallet connectivity"
    ]
  },
  {
    title: "Debit Card & Spending",
    description: "Spend your crypto earnings anywhere with a physical and virtual debit card, with zero conversion fees.",
    phase: "Phase 3",
    status: "planned",
    details: [
      "Gnosis Pay integration",
      "Physical and virtual card issuance",
      "Real-time transaction tracking",
      "Expense categorization"
    ]
  },
  {
    title: "Automated Treasury Management",
    description: "AI-optimized yield strategies, automated financial operations, and treasury management tools.",
    phase: "Phase 4",
    status: "planned",
    details: [
      "Automated yield optimization",
      "DeFi protocol integrations",
      "Treasury management dashboard",
      "Risk assessment and management"
    ]
  }
];

export default function RoadmapPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <section className="text-center my-10 md:my-16 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
          <div className="flex flex-col items-center mb-10">
            <h1 className="text-3xl md:text-5xl font-bold  mb-8" data-text="Building the Future of Finance">
              Building the Future of Finance
            </h1>
            <p className="text-lg md:text-xl text-secondary mb-8 max-w-3xl mx-auto">
              Our roadmap outlines our journey from crypto payments to a comprehensive financial platform for businesses and freelancers.
            </p>
          </div>
        </div>
        <div className="dotted-divider mt-10"></div>
      </section>

      {/* Current Status Banner */}
      <section className="mb-16">
        <div className="max-w-4xl mx-auto framed-content p-6 border border-primary/20 bg-primary/5 rounded-lg">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-primary">Current Platform Status</h2>
          <p className="text-secondary mb-6">
            <strong>hyprsqrl is currently in early access</strong>. At the moment, users can:
          </p>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-secondary">Create and send invoices for crypto payments</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-secondary">Receive payments in EURe on Gnosis Chain</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-secondary">Manage invoice requests through a simple dashboard</span>
            </li>
          </ul>
          <div className="pt-4 border-t border-primary/10">
            <p className="text-secondary mb-4">
              <strong>Coming soon:</strong> We're actively developing fiat payment integration with Monerium for direct bank deposits via IBAN, and ScreenPipe integration for AI-powered document analysis.
            </p>
            <p className="text-secondary">
              Have a feature request or feedback? <a href="https://github.com/hyprsqrl/feedback/issues" className="text-primary hover:underline inline-flex items-center">Submit an issue on GitHub <ExternalLink className="h-3 w-3 ml-1" /></a>
            </p>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="mb-24 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 " data-text="Product Roadmap">
            Product Roadmap
          </h2>
          <p className="text-secondary max-w-3xl mx-auto">
            Our development journey from crypto payments to a comprehensive financial system
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-[28px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary/80 via-primary/40 to-primary/10 hidden md:block"></div>
            
            <div className="space-y-12">
              {roadmapItems.map((item, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-6 md:gap-10 relative">
                  {/* Timeline dot */}
                  <div className="hidden md:flex absolute left-[22px] items-center justify-center">
                    <div className={`w-[14px] h-[14px] rounded-full ${
                      item.status === 'active' ? 'bg-green-500' :
                      item.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-400'
                    } z-10`}></div>
                  </div>

                  {/* Phase label */}
                  <div className="md:w-[140px] flex-shrink-0">
                    <div className="flex items-center gap-2 md:block">
                      <span className="text-sm font-medium text-primary/70">{item.phase}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.status === 'active' ? 'bg-green-100 text-green-800' :
                        item.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      } md:mt-1`}>
                        {item.status === 'active' ? 'Live Now' :
                         item.status === 'in-progress' ? 'In Progress' : 'Planned'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 framed-content p-6 border border-primary/20 bg-white/70 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2 text-primary">{item.title}</h3>
                    <p className="text-secondary mb-4">{item.description}</p>
                    <ul className="space-y-2">
                      {item.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-secondary">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center mt-0.5">
                            <CheckCircle className="h-3 w-3 text-primary" />
                          </div>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="section-divider mt-16"></div>
      </section>

      {/* Current Limitations Section */}
      <section className="mb-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-primary">
              Current Limitations
            </h2>
            <p className="text-secondary max-w-3xl mx-auto">
              We're building quickly, but there are some temporary limitations in our early access version
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="framed-content p-6 border border-primary/20 bg-white/70 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-primary">Crypto Only Payments</h3>
              <p className="text-secondary mb-4">
                Currently, hyprsqrl only supports payments in EURe on Gnosis Chain. Direct fiat payments and multi-chain support are in development.
              </p>
              <p className="text-sm text-primary/80">
                <Clock className="h-4 w-4 inline mr-1" /> 
                Fiat payments via Monerium integration coming in Phase 2
              </p>
            </div>

            <div className="framed-content p-6 border border-primary/20 bg-white/70 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-primary">Limited AI Features</h3>
              <p className="text-secondary mb-4">
                Our ScreenPipe integration is in progress. Currently, you can chat with AI about invoices, but advanced document analysis is limited.
              </p>
              <p className="text-sm text-primary/80">
                <Clock className="h-4 w-4 inline mr-1" /> 
                Full AI capabilities coming in Phase 2
              </p>
            </div>

            <div className="framed-content p-6 border border-primary/20 bg-white/70 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-primary">No Debit Card Yet</h3>
              <p className="text-secondary mb-4">
                The debit card feature for spending crypto anywhere is planned for Phase 3 and is not available in the current version.
              </p>
              <p className="text-sm text-primary/80">
                <Clock className="h-4 w-4 inline mr-1" /> 
                Debit card functionality planned for Phase 3
              </p>
            </div>

            <div className="framed-content p-6 border border-primary/20 bg-white/70 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-primary">Limited Financial Tools</h3>
              <p className="text-secondary mb-4">
                Advanced treasury management, yield optimization, and financial reporting tools are still in development.
              </p>
              <p className="text-sm text-primary/80">
                <Clock className="h-4 w-4 inline mr-1" /> 
                Comprehensive financial suite coming in Phase 4
              </p>
            </div>
          </div>
        </div>
        <div className="section-divider mt-16"></div>
      </section>

      {/* Vision Section */}
      <section className="mb-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 " data-text="Our Vision">
              Our Vision
            </h2>
            <p className="text-xl text-secondary max-w-3xl mx-auto">
              We're building a complete financial system for the crypto economy
            </p>
          </div>

          <div className="framed-content p-8 border border-primary/20 bg-white/70 rounded-lg">
            <p className="text-lg text-secondary mb-6">
              At hyprsqrl, we're creating a financial ecosystem that bridges the gap between crypto and traditional finance, enabling freelancers and businesses to:
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center mt-1">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <p className="text-secondary"><strong>Earn in crypto</strong> with streamlined invoicing and payment processing across multiple chains</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center mt-1">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <p className="text-secondary"><strong>Spend like fiat</strong> with seamless conversion and a debit card that works everywhere</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center mt-1">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <p className="text-secondary"><strong>Optimize finances</strong> with AI-powered tools that maximize yield and minimize admin work</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center mt-1">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <p className="text-secondary"><strong>Streamline operations</strong> with automated accounting, tax preparation, and financial reporting</p>
              </div>
            </div>

            <p className="text-secondary">
              We're building step by step, starting with robust crypto payment infrastructure and gradually expanding into a comprehensive financial platform that makes managing crypto as easy as traditional banking—but with all the advantages of blockchain technology.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="text-center py-16 relative">
        <div className="framed-content max-w-4xl mx-auto p-12 pb-16 blue-filter border border-primary/20">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 " data-text="Join Us on This Journey">
            Join Us on This Journey
          </h2>
          <p className="text-xl text-secondary mb-8 max-w-2xl mx-auto">
            Be among the first to experience hyprsqrl as we build the future of finance.
          </p>
          <div className="w-full max-w-2xl mx-auto mb-8">
            <WaitlistForm />
          </div>
          <p className="text-secondary">
            Have feedback or feature requests? <a href="https://github.com/hyprsqrl/feedback/issues" className="text-primary hover:underline inline-flex items-center">Let us know <ExternalLink className="h-3 w-3 ml-1" /></a>
          </p>
        </div>
      </section>
    </div>
  );
}