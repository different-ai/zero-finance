'use client';

import React from 'react';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { ArrowUpRight } from 'lucide-react';
import { BiosContainer } from '@/components/bios-container';
import { WaitlistForm } from '@/components/landing/waitlist-form';
import { Button } from '@/components/ui/button';
import { BrowserWindow } from '@/components/ui/browser-window';
import { useRouter } from 'next/navigation';
import FeatureHero from '@/components/landing/feature-hero';
import { InboxContent } from '@/components/inbox-content';

export default function Home() {
  const { authenticated, login } = usePrivy();
  const router = useRouter();

  const scrollToWaitlist = () => {
    const waitlistElement = document.getElementById('waitlist-section');
    if (waitlistElement) {
      waitlistElement.scrollIntoView({ behavior: 'smooth' });
      // Add a subtle highlight effect
      waitlistElement.classList.add('highlight-waitlist');
      setTimeout(() => {
        waitlistElement.classList.remove('highlight-waitlist');
      }, 2000);
    }
  };

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
              {!authenticated ? (
                <Button
                  onClick={scrollToWaitlist}
                  size="lg"
                  className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 text-white rounded-lg hover:from-neutral-800 hover:via-neutral-700 hover:to-neutral-600 focus:ring-2 focus:ring-neutral-600 focus:outline-none transition-all px-8 py-3 font-medium text-base shadow-lg border border-neutral-800/20 hover:shadow-xl hover:scale-105 duration-200"
                  style={{ minWidth: 160 }}
                >
                  join waitlist
                </Button>
              ) : (
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 text-white rounded-lg hover:from-neutral-800 hover:via-neutral-700 hover:to-neutral-600 focus:ring-2 focus:ring-neutral-600 focus:outline-none transition-all px-8 font-medium text-base shadow-lg border border-neutral-800/20 hover:shadow-xl hover:scale-105 duration-200"
                  style={{ minWidth: 160 }}
                >
                  go to dashboard
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
                  the ai bank account
                </span>
              </h1>
              <p className="text-lg md:text-xl text-neutral-600 mb-4 max-w-2xl font-sans text-center leading-relaxed">
                we&apos;re building a bank account for the ai world. the goal:
                get to 0 finance tasks. 
                
                today: access to an iban or ach account,
                easy interfaces to manage your money, and 5-10% savings accounts
                on idle balance.
              </p>
              <p className="text-base text-neutral-500 mb-8 max-w-lg font-sans text-center">
                join hundreds of users getting onboarded into the future of
                banking
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <Button
                  onClick={scrollToWaitlist}
                  className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 text-white font-bold rounded-lg px-8 py-3 text-base shadow-lg border border-neutral-800/20 hover:from-neutral-800 hover:via-neutral-700 hover:to-neutral-600 focus:ring-2 focus:ring-neutral-600 focus:outline-none transition-all transform hover:scale-105 hover:shadow-xl duration-200"
                  style={{ minWidth: 180 }}
                >
                  join waitlist
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
              </div>
            </div>
          </div>

          {/* Browser Demo Section with Enhanced Styling */}
          <div className="w-full max-w-6xl mx-auto relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-green-500/5 rounded-3xl blur-xl"></div>
            <div className="relative p-8 ">
              <BrowserWindow
                url="0.finance/dashboard"
                title="Zero Finance - Smart Inbox Demo"
              >
                <InboxContent />
              </BrowserWindow>
            </div>
          </div>

          <div id="features" className="w-full">
            <FeatureHero />
          </div>

          {/* Pricing Section with Gradient Enhancement */}
          <div id="pricing-section" className="w-full max-w-4xl relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-green-500/10 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm border border-white/40 rounded-3xl p-8 sm:p-12 text-center shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105">
              <h2 className="text-4xl font-bold mb-6 tracking-tight">
                <span className="bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-600 bg-clip-text text-transparent">
                  Expedited onboarding
                </span>
              </h2>
              <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-10 mb-8">
                <div className="bg-gradient-to-br from-neutral-50 to-neutral-100/50 backdrop-blur-sm rounded-xl p-6 border border-neutral-200/40 shadow-lg">
                  <p className="text-3xl font-bold bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 bg-clip-text text-transparent mb-2">
                    $50
                  </p>
                  <p className="text-neutral-600">One-time fee</p>
                </div>
                <div className="max-w-lg">
                  <ul className="space-y-3 text-left">
                    {[
                      'Personalized setup assistance to get your account running',
                      'Advice to help you pay the lowest transfer fees',
                      'Strategies to maximize your yield and optimize returns',
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="rounded-full bg-gradient-to-br from-neutral-200 via-neutral-300 to-neutral-200 w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 border border-neutral-300/40">
                          <div className="w-2 h-2 bg-gradient-to-br from-neutral-700 via-neutral-800 to-neutral-700 rounded-full"></div>
                        </div>
                        <p className="text-neutral-700">{item}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <Button
                onClick={() =>
                  window.open(
                    'https://cal.com/potato/onboarding',
                    '_blank',
                  )
                }
                size="lg"
                className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 hover:from-neutral-800 hover:via-neutral-700 hover:to-neutral-600 text-white rounded-lg px-8 py-3 shadow-lg transform hover:scale-105 transition-all border border-neutral-800/20 hover:shadow-xl duration-200"
              >
                Book Your Session
              </Button>
            </div>
          </div>

          {/* Savings Section with Enhanced Gradient */}
          <div id="savings" className="w-full max-w-3xl relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 via-blue-400/20 to-purple-400/20 rounded-3xl blur-2xl"></div>
            <div className="relative mx-auto rounded-3xl bg-white/80 backdrop-blur-sm border border-white/40 px-8 py-12 flex flex-col items-center text-center transition-all duration-500 hover:shadow-3xl hover:scale-105 shadow-2xl">
              <div className="flex items-center mb-2">
                <ArrowUpRight className="w-8 h-8 text-green-600 mr-2" />
                <span className="text-4xl font-extrabold tracking-tight text-black text-transparent">
                  8%
                </span>
                <span className="text-3xl font-semibold text-neutral-700 ml-2">
                  APY on idle assets
                </span>
              </div>
              <div className="mt-2 text-lg text-neutral-600">
                Our high-yield vault is currently in
                <span className="inline-block bg-gradient-to-r from-neutral-100 to-neutral-200 text-neutral-700 rounded-full px-3 py-1 text-xs font-semibold ml-2 align-middle border border-neutral-200/40 backdrop-blur-sm">
                  early access
                </span>
              </div>
            </div>
          </div>

          <div id="waitlist-section" className="w-full max-w-md">
            <div className="mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center text-neutral-800">
                Not ready to fully commit, but want to stay in the loop?
              </h2>
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
