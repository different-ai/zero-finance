'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '../header';
import { GradientBackground } from '../gradient-background';
import { BrowserFrame } from '@/components/BrowserFrame';
import { OrangeDAOLogo } from '@/components/orange-dao-logo';
import { CurrentYieldBadge } from '../current-yield-badge';
import {
  Mail,
  FileText,
  Zap,
  Bot,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Clock,
  Shield,
} from 'lucide-react';

export default function AILandingPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F2]">
      <Header />

      {/* Hero Section */}
      <section className="relative border-b border-[#101010]/10 bg-white/90 overflow-hidden">
        <GradientBackground variant="demo" className="z-0 bg-[#F6F5EF]" />

        <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-32 w-full">
          <p className="uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[11px] sm:text-[12px] lg:text-[13px] font-medium text-[#1B29FF]">
            AI-Powered Finance
          </p>
          <h1 className="mt-3 font-serif text-[36px] sm:text-[52px] md:text-[72px] lg:text-[88px] leading-[0.96] tracking-[-0.015em] text-[#101010]">
            Your finances,{' '}
            <span className="text-[#1B29FF] text-[44px] sm:text-[64px] md:text-[88px] lg:text-[108px] leading-[0.9]">
              on autopilot.
            </span>
          </h1>
          <p className="mt-4 sm:mt-6 max-w-[62ch] text-[15px] sm:text-[16px] lg:text-[18px] leading-[1.5] text-[#222]">
            Stop wasting hours on invoices, expense tracking, and bank
            transfers. Our AI handles the busywork so you can focus on building
            your business.
          </p>
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 text-[13px] text-[#101010]/60">
              <CheckCircle2 className="w-4 h-4 text-[#1B29FF]" />
              <span>
                Email invoices and receipts — AI matches them automatically
              </span>
            </div>
            <div className="flex items-center gap-2 text-[13px] text-[#101010]/60">
              <CheckCircle2 className="w-4 h-4 text-[#1B29FF]" />
              <span>
                Natural language commands — "Pay Acme $5,000 for hosting"
              </span>
            </div>
            <div className="flex items-center gap-2 text-[13px] text-[#101010]/60">
              <CheckCircle2 className="w-4 h-4 text-[#1B29FF]" />
              <span>
                Idle cash earns yield automatically — no manual allocation
              </span>
            </div>
          </div>

          {/* Live yield badge + Backed by */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <CurrentYieldBadge />
            <div className="flex items-center gap-2 text-[13px] text-[#101010]/60">
              <span>Backed by</span>
              <OrangeDAOLogo className="h-4 w-auto opacity-70" />
            </div>
          </div>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <Link
              className="inline-flex items-center px-6 py-3 text-[15px] sm:text-[16px] font-medium text-white bg-[#1B29FF] hover:bg-[#1420CC] rounded-md transition-colors"
              href="/signin?source=ai"
            >
              Start automating
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              className="inline-flex items-center text-[14px] sm:text-[15px] lg:text-[16px] text-[#101010] hover:text-[#1B29FF] underline decoration-[#101010]/30 underline-offset-[4px] hover:decoration-[#1B29FF] transition-colors"
              href="https://cal.com/team/0finance/30"
            >
              See a demo
            </Link>
          </div>

          <div className="mt-6 sm:mt-8 max-w-[560px]">
            <p className="uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[11px] sm:text-[12px] text-[#101010]/60">
              Quick start
            </p>
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-[#101010]/10 bg-white/90 px-4 py-3 font-mono text-[12px] sm:text-[13px]">
              <span className="text-[#101010]/40">$</span>
              <span>curl -fsSL https://zerofinance.ai/install | bash</span>
            </div>
            <p className="mt-2 text-[12px] text-[#101010]/60">
              Installs <span className="font-mono">agent-bank</span> and sets up
              the <span className="font-mono">finance</span> CLI.
            </p>
          </div>
        </div>

        {/* Demo Panel - AI Email Interface */}
        <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <BrowserFrame url="mail.google.com" className="shadow-lg">
            <div className="p-4 sm:p-6 bg-white min-h-[300px]">
              {/* Email thread simulation */}
              <div className="space-y-4">
                {/* User email */}
                <div className="border-b border-[#101010]/10 pb-4">
                  <div className="flex items-center gap-2 text-[13px]">
                    <div className="w-8 h-8 rounded-full bg-[#1B29FF]/10 flex items-center justify-center">
                      <span className="text-[#1B29FF] font-medium">Y</span>
                    </div>
                    <div>
                      <span className="font-medium">You</span>
                      <span className="text-[#101010]/50 ml-2">
                        to 0 Finance AI
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 ml-10">
                    <p className="text-[14px] text-[#101010]">
                      Please attach this invoice to the correct transaction
                    </p>
                    <div className="mt-2 inline-flex items-center gap-2 px-3 py-2 bg-[#F7F7F2] rounded text-[13px]">
                      <FileText className="w-4 h-4 text-[#1B29FF]" />
                      <span>Invoice-0042.pdf</span>
                      <span className="text-[#101010]/50">24 KB</span>
                    </div>
                  </div>
                </div>

                {/* AI response */}
                <div className="pb-4">
                  <div className="flex items-center gap-2 text-[13px]">
                    <div className="w-8 h-8 rounded-full bg-[#1B29FF] flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <span className="font-medium">0 Finance AI</span>
                      <span className="text-[#101010]/50 ml-2">to You</span>
                    </div>
                  </div>
                  <div className="mt-3 ml-10 space-y-3">
                    <p className="text-[14px] text-[#101010]">
                      I matched your invoice to this transaction:
                    </p>
                    <div className="p-3 border border-[#1B29FF]/20 rounded bg-[#1B29FF]/5">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-[14px]">
                            AWS Services
                          </p>
                          <p className="text-[13px] text-[#101010]/60">
                            Dec 15, 2024
                          </p>
                        </div>
                        <p className="text-[18px] font-semibold tabular-nums">
                          $2,847.00
                        </p>
                      </div>
                    </div>
                    <p className="text-[14px] text-[#101010]">
                      Reply <span className="font-medium">YES</span> to attach,
                      or tell me which transaction to use instead.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </BrowserFrame>
        </div>
      </section>

      {/* How AI Automation Works */}
      <section className="relative bg-[#F7F7F2] border-t border-[#101010]/10 py-8 sm:py-12 lg:py-16 overflow-hidden">
        <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <p className="uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[11px] sm:text-[12px] text-[#101010]/60">
            How it works
          </p>
          <h2 className="mt-2 font-serif text-[24px] sm:text-[30px] lg:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
            Email → AI → Done
          </h2>
          <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#101010]/10 border border-[#101010]/10 bg-white/95 backdrop-blur-sm shadow-[0_2px_8px_rgba(16,16,16,0.04)]">
            <div className="p-4 sm:p-6">
              <div className="w-10 h-10 rounded-full bg-[#1B29FF]/10 flex items-center justify-center mb-4">
                <Mail className="w-5 h-5 text-[#1B29FF]" />
              </div>
              <h3 className="text-[15px] sm:text-[16px] font-medium text-[#101010]">
                Forward your emails
              </h3>
              <p className="mt-2 text-[13px] sm:text-[14px] text-[#101010]/70">
                Send invoices, receipts, or payment requests to your AI inbox.
                Just forward and forget.
              </p>
            </div>
            <div className="p-4 sm:p-6">
              <div className="w-10 h-10 rounded-full bg-[#1B29FF]/10 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5 text-[#1B29FF]" />
              </div>
              <h3 className="text-[15px] sm:text-[16px] font-medium text-[#101010]">
                AI processes everything
              </h3>
              <p className="mt-2 text-[13px] sm:text-[14px] text-[#101010]/70">
                Our AI reads documents, matches transactions, and prepares
                actions. It asks for confirmation before executing.
              </p>
            </div>
            <div className="p-4 sm:p-6">
              <div className="w-10 h-10 rounded-full bg-[#1B29FF]/10 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5 text-[#1B29FF]" />
              </div>
              <h3 className="text-[15px] sm:text-[16px] font-medium text-[#101010]">
                Reply to confirm
              </h3>
              <p className="mt-2 text-[13px] sm:text-[14px] text-[#101010]/70">
                Just reply "YES" to approve. The AI handles the rest —
                attachments, categorization, payments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative bg-[#F7F7F2] border-t border-[#101010]/10 py-8 sm:py-12 lg:py-16 overflow-hidden">
        <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <p className="uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[11px] sm:text-[12px] text-[#101010]/60">
            Automation Features
          </p>
          <h2 className="mt-2 font-serif text-[24px] sm:text-[30px] lg:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
            Let AI handle the busywork
          </h2>

          <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#101010]/10">
            <div className="bg-white p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="w-5 h-5 text-[#1B29FF]" />
                <h3 className="uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[12px] sm:text-[13px] text-[#101010]/70">
                  Smart Document Matching
                </h3>
              </div>
              <p className="text-[13px] sm:text-[14px] leading-[1.5] text-[#101010]/80">
                Forward invoices and receipts via email. AI reads the document,
                extracts vendor, amount, and date, then matches it to the
                correct transaction in your history.
              </p>
            </div>

            <div className="bg-white p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-3">
                <Bot className="w-5 h-5 text-[#1B29FF]" />
                <h3 className="uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[12px] sm:text-[13px] text-[#101010]/70">
                  Natural Language Commands
                </h3>
              </div>
              <p className="text-[13px] sm:text-[14px] leading-[1.5] text-[#101010]/80">
                Email commands like "Pay Acme Corp $5,000 for December hosting"
                or "Create an invoice for $2,500 consulting work". AI
                understands context and executes.
              </p>
            </div>

            <div className="bg-white p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-5 h-5 text-[#1B29FF]" />
                <h3 className="uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[12px] sm:text-[13px] text-[#101010]/70">
                  Auto Yield Optimization
                </h3>
              </div>
              <p className="text-[13px] sm:text-[14px] leading-[1.5] text-[#101010]/80">
                Idle cash automatically earns competitive yield. No manual
                allocation needed. Funds stay liquid for instant withdrawals
                whenever you need them.
              </p>
            </div>

            <div className="bg-white p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-5 h-5 text-[#1B29FF]" />
                <h3 className="uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[12px] sm:text-[13px] text-[#101010]/70">
                  Human-in-the-Loop Safety
                </h3>
              </div>
              <p className="text-[13px] sm:text-[14px] leading-[1.5] text-[#101010]/80">
                AI never executes payments without your explicit approval.
                Review proposed actions and confirm with a simple reply. Full
                audit trail of every decision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* API Waitlist Section */}
      <section className="relative bg-white border-t border-[#101010]/10 py-8 sm:py-12 lg:py-16 overflow-hidden">
        <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-[600px]">
            <p className="uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[11px] sm:text-[12px] text-[#1B29FF]">
              CLI + MCP
            </p>
            <h2 className="mt-2 font-serif text-[24px] sm:text-[30px] lg:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
              Agent banking, programmable
            </h2>
            <p className="mt-4 text-[14px] sm:text-[15px] text-[#101010]/70">
              Install the agent-bank CLI, then connect MCP to let AI assistants
              manage invoices, balances, and approvals with human control.
            </p>
            <div className="mt-6 p-4 bg-[#F7F7F2] border border-[#101010]/10 rounded font-mono text-[13px]">
              <span className="text-[#101010]/50">$</span>{' '}
              <span className="text-[#1B29FF]">curl</span> -fsSL
              https://zerofinance.ai/install | bash
            </div>
            <Link
              href="https://docs.0.finance"
              className="mt-6 inline-flex items-center px-5 py-2.5 text-[14px] font-medium text-[#1B29FF] border border-[#1B29FF] hover:bg-[#1B29FF]/5 rounded transition-colors"
            >
              Read the docs
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-[#101010]/10 bg-[#F7F7F2] py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-[800px]">
            <h2 className="font-serif text-[28px] sm:text-[36px] lg:text-[48px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
              Stop doing{' '}
              <span className="text-[#1B29FF]">finance manually</span>
            </h2>
            <p className="mt-3 sm:mt-4 text-[15px] sm:text-[16px] lg:text-[18px] text-[#101010]/70">
              Join founders who save 5+ hours per week on financial busywork.
              AI-powered invoicing, automatic document matching, and yield
              optimization — all from your inbox.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <Link
                href="/signin?source=ai"
                className="inline-flex items-center px-6 py-3 text-[15px] sm:text-[16px] font-medium text-white bg-[#1B29FF] hover:bg-[#1420CC] rounded-md transition-colors"
              >
                Start automating
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link
                href="https://cal.com/team/0finance/30"
                className="inline-flex items-center text-[14px] sm:text-[15px] lg:text-[16px] text-[#101010] hover:text-[#1B29FF] underline decoration-[#101010]/30 underline-offset-[4px] hover:decoration-[#1B29FF] transition-colors"
              >
                Schedule demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#101010]/10 bg-white">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <span className="text-[12px] text-[#101010]/60">
                © 2025 0 Finance
              </span>
              <Link
                href="/legal"
                className="text-[12px] text-[#101010]/60 hover:text-[#1B29FF]"
              >
                Legal
              </Link>
              <Link
                href="/privacy"
                className="text-[12px] text-[#101010]/60 hover:text-[#1B29FF]"
              >
                Privacy
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/40">
                Backed by
              </span>
              <OrangeDAOLogo className="h-4 sm:h-5 w-auto opacity-50 grayscale" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
