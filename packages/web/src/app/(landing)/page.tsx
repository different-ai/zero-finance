'use client';

import React from 'react';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { ArrowUpRight, Shield, Zap, Plug } from 'lucide-react';
import { BiosContainer } from '@/components/bios-container';
import { WaitlistForm } from '@/components/landing/waitlist-form';
import { Button } from '@/components/ui/button';
import { BrowserWindow } from '@/components/ui/browser-window';
import { useRouter } from 'next/navigation';
import { InboxContent } from '@/components/inbox-content';

export default function Home() {
  const { authenticated, login, ready } = usePrivy();
  const router = useRouter();

  return (
    <>
      <div className="min-h-screen w-full flex flex-col text-neutral-800 relative overflow-hidden">
        {/* Gradient Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-blue-400/20 to-green-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-green-300/10 via-blue-300/10 to-purple-300/10 rounded-full blur-3xl"></div>
        </div>

        <nav className="border-b border-neutral-200/80 py-6 sticky top-0z-50 ">
          <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
            <div className="flex items-center ">
              <Link
                href="/"
                className="flex items-center text-lg tracking-tight text-neutral-900 hover:text-[#2663FF] focus:text-[#2663FF] transition-all"
              >
                <div className="h-8 px-2 rounded-md bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 flex items-center justify-center text-white font-bold shadow-lg border border-neutral-800/20">
                  zero
                </div>
                <span className="ml-1 font-semibold bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-700 bg-clip-text text-transparent">
                  finance
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-6 ">
              <div className="hidden md:flex items-center space-x-6 mr-4">
                <Link
                  href="/careers"
                  className="text-sm font-medium text-neutral-700 hover:text-[#2663FF] focus:text-[#2663FF] transition-all"
                >
                  careers
                </Link>
                <Link
                  href="https://github.com/different-ai/zero-finance"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-neutral-700 hover:text-[#2663FF] focus:text-[#2663FF] transition-all"
                >
                  open source
                </Link>
              </div>
              {/* Show button only when auth state is ready */}
              {ready ? (
                !authenticated ? (
                  <Button
                    onClick={() => router.push('/demo')}
                    size="lg"
                    className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 text-white rounded-lg hover:from-neutral-800 hover:via-neutral-700 hover:to-neutral-600 focus:ring-2 focus:ring-neutral-600 focus:outline-none transition-all px-8 py-3 font-medium text-base shadow-lg border border-neutral-800/20 hover:shadow-xl hover:scale-105 duration-200"
                    style={{ minWidth: 160 }}
                  >
                    Sign Up
                  </Button>
                ) : (
                  <Button
                    onClick={() => router.push('/dashboard')}
                    className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 text-white rounded-lg hover:from-neutral-800 hover:via-neutral-700 hover:to-neutral-600 focus:ring-2 focus:ring-neutral-600 focus:outline-none transition-all px-8 font-medium text-base shadow-lg border border-neutral-800/20 hover:shadow-xl hover:scale-105 duration-200"
                    style={{ minWidth: 160 }}
                  >
                    go to dashboard
                  </Button>
                )
              ) : (
                // Show a loading state button while auth is not ready
                <Button
                  disabled
                  className="bg-neutral-200 text-neutral-400 rounded-lg px-8 py-3 font-medium text-base shadow-lg border border-neutral-200/20 cursor-not-allowed"
                  style={{ minWidth: 160 }}
                >
                  loading...
                </Button>
              )}
            </div>
          </div>
        </nav>

        <div className="flex flex-col items-center justify-center w-full px-2 md:px-0 mt-16 mb-16 gap-16 max-w-7xl mx-auto relative z-10">
          {/* Hero Section with Enhanced Gradient */}
          <div className="mx-auto relative">
            <div className="w-full max-w-6xl px-8 md:px-12 py-12 flex flex-col items-center text-center relative">
              {/* Floating gradient orbs */}
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-2xl animate-float"></div>
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-r from-blue-400/30 to-green-400/30 rounded-full blur-2xl animate-float-delayed"></div>

              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight font-sans leading-tight">
                <span className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 bg-clip-text text-transparent">
                  plug in your data. we file the taxes.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-neutral-600 mb-4 max-w-3xl font-sans text-center leading-relaxed">
                your slack, email, and bank feeds merge into one self-custodied ledger. our llm agent reconciles every transaction, sets aside the exact tax reserve, and wires the payment on deadline – no spreadsheets, no surprises.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                {ready ? (
                  !authenticated ? (
                    <>
                      <Button
                        onClick={() => {
                          const el = document.getElementById('waitlist-section');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 text-white font-bold rounded-lg px-8 py-3 text-base shadow-lg border border-neutral-800/20 hover:from-neutral-800 hover:via-neutral-700 hover:to-neutral-600 focus:ring-2 focus:ring-neutral-600 focus:outline-none transition-all transform hover:scale-105 hover:shadow-xl duration-200"
                        style={{ minWidth: 180 }}
                      >
                        get early access
                      </Button>
                      <Button
                        variant="outline"
                        className="text-neutral-700 font-medium border-2 border-neutral-300/60 bg-white/80 backdrop-blur-sm rounded-lg px-8 py-3 text-base hover:bg-gradient-to-br hover:from-neutral-100 hover:via-neutral-200 hover:to-neutral-100 hover:border-neutral-500/80 hover:text-neutral-800 transition-all outline-none transform hover:scale-105 shadow-sm hover:shadow-lg duration-200"
                        style={{ minWidth: 180 }}
                        onClick={() => {
                          window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
                        }}
                      >
                        watch a 60-second demo →
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => router.push('/dashboard')}
                        className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 text-white font-bold rounded-lg px-8 py-3 text-base shadow-lg border border-neutral-800/20 hover:from-neutral-800 hover:via-neutral-700 hover:to-neutral-600 focus:ring-2 focus:ring-neutral-600 focus:outline-none transition-all transform hover:scale-105 hover:shadow-xl duration-200"
                        style={{ minWidth: 180 }}
                      >
                        go to dashboard
                      </Button>
                      <Button
                        variant="outline"
                        className="text-neutral-700 font-medium border-2 border-neutral-300/60 bg-white/80 backdrop-blur-sm rounded-lg px-8 py-3 text-base hover:bg-gradient-to-br hover:from-neutral-100 hover:via-neutral-200 hover:to-neutral-100 hover:border-neutral-500/80 hover:text-neutral-800 transition-all outline-none transform hover:scale-105 shadow-sm hover:shadow-lg duration-200"
                        style={{ minWidth: 180 }}
                        onClick={() => {
                          const el = document.getElementById('features');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        see it in action
                      </Button>
                    </>
                  )
                ) : (
                  // Show loading state buttons
                  <>
                    <Button
                      disabled
                      className="bg-neutral-200 text-neutral-400 rounded-lg px-8 py-3 text-base shadow-lg border border-neutral-200/20 cursor-not-allowed"
                      style={{ minWidth: 180 }}
                    >
                      loading...
                    </Button>
                    <Button
                      disabled
                      variant="outline"
                      className="text-neutral-400 font-medium border-2 border-neutral-200/60 bg-white/80 backdrop-blur-sm rounded-lg px-8 py-3 text-base shadow-sm cursor-not-allowed"
                      style={{ minWidth: 180 }}
                    >
                      loading...
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Why This Matters Section */}
          <div className="w-full max-w-6xl mx-auto relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-green-500/5 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm border border-white/40 rounded-3xl p-8 sm:p-12 shadow-2xl">
              <h2 className="text-4xl font-bold mb-8 text-center tracking-tight">
                <span className="bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-600 bg-clip-text text-transparent">
                  why this matters
                </span>
              </h2>
              <div className="mb-8 text-lg text-neutral-700 leading-relaxed">
                <p className="mb-4">
                  freelancers lose 10–15 h each month chasing receipts across slack threads, gmail searches, and random csv exports. meanwhile, tax rules shift quietly – by the time you notice, penalties stack.
                </p>
                <p>
                  llms changed the game: today&apos;s models read unstructured chatter as fluently as humans and write to ledgers with zero drift. the missing layer is custody &amp; rails – that&apos;s what zero finance ships.
                </p>
              </div>
              
              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                  <thead>
                    <tr className="bg-neutral-50">
                      <th className="border border-neutral-200 px-4 py-3 text-left font-semibold text-neutral-800">pain</th>
                      <th className="border border-neutral-200 px-4 py-3 text-left font-semibold text-neutral-800">old way</th>
                      <th className="border border-neutral-200 px-4 py-3 text-left font-semibold text-neutral-800">zero finance</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-neutral-200 px-4 py-3 text-neutral-700 font-medium">finding every invoice</td>
                      <td className="border border-neutral-200 px-4 py-3 text-neutral-600">manual gmail + slack search</td>
                      <td className="border border-neutral-200 px-4 py-3 text-neutral-600">llm auto-labels invoices the moment they hit any inbox</td>
                    </tr>
                    <tr className="bg-neutral-25">
                      <td className="border border-neutral-200 px-4 py-3 text-neutral-700 font-medium">categorising spend</td>
                      <td className="border border-neutral-200 px-4 py-3 text-neutral-600">bookkeeping sessions at 11 pm</td>
                      <td className="border border-neutral-200 px-4 py-3 text-neutral-600">agent posts &amp; tags transactions in your gnosis safe</td>
                    </tr>
                    <tr>
                      <td className="border border-neutral-200 px-4 py-3 text-neutral-700 font-medium">estimating taxes</td>
                      <td className="border border-neutral-200 px-4 py-3 text-neutral-600">thumb-rule 30% stash</td>
                      <td className="border border-neutral-200 px-4 py-3 text-neutral-600">dynamic reserve tied to real-time income + latest code</td>
                    </tr>
                    <tr className="bg-neutral-25">
                      <td className="border border-neutral-200 px-4 py-3 text-neutral-700 font-medium">filing & paying</td>
                      <td className="border border-neutral-200 px-4 py-3 text-neutral-600">copy-paste into government portals</td>
                      <td className="border border-neutral-200 px-4 py-3 text-neutral-600">one-click review → agent wires via ach/sepa</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Product Snapshot Section */}
          <div id="features" className="w-full max-w-4xl mx-auto relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm border border-white/40 rounded-3xl p-8 sm:p-12 shadow-2xl">
              <h2 className="text-4xl font-bold mb-8 text-center tracking-tight">
                <span className="bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-600 bg-clip-text text-transparent">
                  product snapshot
                </span>
              </h2>
              <p className="text-lg text-neutral-600 mb-8 text-center">what works today</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-center justify-center p-6 bg-gradient-to-br from-neutral-50 to-neutral-100/50 rounded-xl border border-neutral-200/40">
                  <Plug className="w-8 h-8 text-neutral-700 mr-3" />
                  <span className="text-neutral-800 font-medium">plug</span>
                </div>
                <div className="flex items-center justify-center p-6 bg-gradient-to-br from-neutral-50 to-neutral-100/50 rounded-xl border border-neutral-200/40">
                  <Shield className="w-8 h-8 text-neutral-700 mr-3" />
                  <span className="text-neutral-800 font-medium">shield</span>
                </div>
                <div className="flex items-center justify-center p-6 bg-gradient-to-br from-neutral-50 to-neutral-100/50 rounded-xl border border-neutral-200/40">
                  <Zap className="w-8 h-8 text-neutral-700 mr-3" />
                  <span className="text-neutral-800 font-medium">rocket</span>
                </div>
              </div>
              
              <ul className="space-y-4 max-w-2xl mx-auto">
                {[
                  'receive & send ach / sepa – fully live',
                  'self-custody gnosis safe – you hold the keys',
                  'slack + gmail connectors – invoices and receipts ingested in seconds',
                  'fixed 22% tax reserve – configurable per jurisdiction',
                  'csv export & accountant-share link'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="rounded-full bg-gradient-to-br from-neutral-200 via-neutral-300 to-neutral-200 w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 border border-neutral-300/40">
                      <div className="w-2 h-2 bg-gradient-to-br from-neutral-700 via-neutral-800 to-neutral-700 rounded-full"></div>
                    </div>
                    <p className="text-neutral-700 text-lg">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 90-Day Roadmap Section */}
          <div id="roadmap-section" className="w-full max-w-5xl relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-green-500/10 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm border border-white/40 rounded-3xl p-8 sm:p-12 shadow-2xl">
              <h2 className="text-4xl font-bold mb-6 text-center tracking-tight">
                <span className="bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-600 bg-clip-text text-transparent">
                  90-day roadmap
                </span>
              </h2>
              <p className="text-lg text-neutral-600 mb-8 text-center">why you care now</p>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                  <thead>
                    <tr className="bg-neutral-50">
                      <th className="border border-neutral-200 px-4 py-3 text-left font-semibold text-neutral-800">timeline</th>
                      <th className="border border-neutral-200 px-4 py-3 text-left font-semibold text-neutral-800">milestone</th>
                      <th className="border border-neutral-200 px-4 py-3 text-left font-semibold text-neutral-800">unlocked super-power</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-neutral-200 px-4 py-3 text-neutral-700 font-medium">week 4</td>
                      <td className="border border-neutral-200 px-4 py-3 text-neutral-600">multi-source context graph (news api, notion, drive)</td>
                      <td className="border border-neutral-200 px-4 py-3 text-neutral-600">transactions auto-tagged with project &amp; client identifiers; P&amp;L by channel</td>
                    </tr>
                    <tr className="bg-neutral-25">
                      <td className="border border-neutral-200 px-4 py-3 text-neutral-700 font-medium">week 6</td>
                      <td className="border border-neutral-200 px-4 py-3 text-neutral-600">adaptive tax model fed by live legislative feeds</td>
                      <td className="border border-neutral-200 px-4 py-3 text-neutral-600">reserve updates the day a rule changes; push notification if buffer shifts</td>
                    </tr>
                    <tr>
                      <td className="border border-neutral-200 px-4 py-3 text-neutral-700 font-medium">week 8</td>
                      <td className="border border-neutral-200 px-4 py-3 text-neutral-600">hands-free filing (usa + de + fr beta)</td>
                      <td className="border border-neutral-200 px-4 py-3 text-neutral-600">agent pre-fills forms, signs with your key, wires payment, stores receipt on-chain</td>
                    </tr>
                    <tr className="bg-neutral-25">
                      <td className="border border-neutral-200 px-4 py-3 text-neutral-700 font-medium">week 10</td>
                      <td className="border border-neutral-200 px-4 py-3 text-neutral-600">yield vaults</td>
                      <td className="border border-neutral-200 px-4 py-3 text-neutral-600">idle operating cash sweeps into 4-week t-bill vault, auto-rolls until needed</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-lg text-neutral-700 font-medium">
                  the rails exist – llms just needed permission to write. zero finance is that permission.
                </p>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div id="how-it-works" className="w-full max-w-4xl relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 via-blue-400/20 to-purple-400/20 rounded-3xl blur-2xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm border border-white/40 rounded-3xl p-8 sm:p-12 shadow-2xl">
              <h2 className="text-4xl font-bold mb-8 text-center tracking-tight">
                <span className="bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-600 bg-clip-text text-transparent">
                  how it works
                </span>
              </h2>
              <p className="text-lg text-neutral-600 mb-8 text-center">three frames</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-800 mb-3">connect</h3>
                  <p className="text-neutral-600">oauth slack / gmail / bank; paste gnosis safe address.</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-800 mb-3">confirm</h3>
                  <p className="text-neutral-600">agent shows the first ten matches it found; you approve or fix.</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-800 mb-3">coast</h3>
                  <p className="text-neutral-600">every new invoice hits the ledger, tax reserve updates, surplus earns yield, filings autopay. cancel anytime; keys never leave your wallet.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust & Compliance Section */}
          <div id="trust-compliance" className="w-full max-w-4xl relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-green-500/10 to-purple-500/10 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm border border-white/40 rounded-3xl p-8 sm:p-12 shadow-2xl">
              <h2 className="text-4xl font-bold mb-8 text-center tracking-tight">
                <span className="bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-600 bg-clip-text text-transparent">
                  trust & compliance
                </span>
              </h2>
              
              <ul className="space-y-4 max-w-3xl mx-auto">
                {[
                  'sponsor bank handles kyc / aml',
                  'audited smart-contract libraries (open-source at github.com/different-ai/zero-finance)',
                  'end-to-end encryption – we see hashed docs, not raw files',
                  'instant on-chain receipts for every outbound wire'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <Shield className="w-6 h-6 text-neutral-600 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-neutral-700 text-lg">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social Proof Section */}
          <div id="social-proof" className="w-full max-w-4xl relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm border border-white/40 rounded-3xl p-8 sm:p-12 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-neutral-50 to-neutral-100/50 rounded-xl p-6 border border-neutral-200/40">
                  <p className="text-neutral-700 text-lg mb-4 italic">
                    &quot;zero finance killed my sunday bookkeeping ritual. three clicks, done.&quot;
                  </p>
                  <p className="text-neutral-600 font-medium">– maya k., indie ios dev</p>
                </div>
                
                <div className="bg-gradient-to-br from-neutral-50 to-neutral-100/50 rounded-xl p-6 border border-neutral-200/40">
                  <p className="text-neutral-700 text-lg mb-4 italic">
                    &quot;i stopped guessing my quarterly taxes – it literally shows the exact dollar.&quot;
                  </p>
                  <p className="text-neutral-600 font-medium">– lucas r., freelance designer</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Strip Section */}
          <div id="waitlist-section" className="w-full max-w-4xl relative">
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/10 via-neutral-800/10 to-neutral-700/10 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm border border-white/40 rounded-3xl p-8 sm:p-12 shadow-2xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-bold mb-4 text-neutral-800">
                    ready to fire your spreadsheet?
                  </h2>
                  <p className="text-lg text-neutral-600">
                    join the next 100-user cohort (opens july 15).
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Button
                    onClick={() => {
                      const el = document.getElementById('waitlist-form');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    size="lg"
                    className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 hover:from-neutral-800 hover:via-neutral-700 hover:to-neutral-600 text-white rounded-lg px-8 py-4 text-lg shadow-lg transform hover:scale-105 transition-all border border-neutral-800/20 hover:shadow-xl duration-200"
                  >
                    reserve my spot
                  </Button>
                </div>
              </div>
              <div className="mt-6 text-center text-sm text-neutral-500">
                no credit card • self-custody by default • exit anytime
              </div>
            </div>
          </div>

          {/* Waitlist Form */}
          <div id="waitlist-form" className="w-full max-w-md">
            <div className="mx-auto">
              <WaitlistForm />
            </div>
          </div>

          <div className="w-full">
            <BiosContainer />
          </div>

          <footer className="w-full text-center py-8 mt-auto border-t border-neutral-200/40 bg-white/60 backdrop-blur-sm text-neutral-500 text-xs font-sans rounded-t-3xl">
            <div className="max-w-6xl mx-auto px-6">
              <div className="mb-2">
                <Link
                  href="/"
                  className="text-neutral-600 hover:text-[#2663FF] mx-2"
                >
                  Product
                </Link>
                <Link
                  href="/careers"
                  className="text-neutral-600 hover:text-[#2663FF] mx-2"
                >
                  Company
                </Link>
              </div>
              <div className="copyright">
                © {new Date().getFullYear()} zero finance •{' '}
                <Link
                  href="https://github.com/different-ai/zero-finance"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-600 hover:text-[#2663FF]"
                >
                  open source
                </Link>{' '}
                • crypto banking •{' '}
                <Link
                  href="/careers"
                  className="text-neutral-600 hover:text-[#2663FF]"
                >
                  careers
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(-10deg);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite 1s;
        }
        .highlight-waitlist {
          animation: highlight 2s ease-in-out;
        }
        @keyframes highlight {
          0% { transform: scale(1); }
          10% { transform: scale(1.02); }
          20% { transform: scale(1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </>
  );
}
