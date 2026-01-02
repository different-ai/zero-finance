'use client';

import React from 'react';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function CareersPage() {
  const { authenticated, login } = usePrivy();
  const router = useRouter();

  return (
    <section className="bg-white text-gray-900 min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <nav className="border-b border-gray-200 py-4 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              zero finance
            </Link>
          </div>
          <div>
            {!authenticated ? (
              <Button
                onClick={login}
                className="bg-black text-white rounded-md hover:bg-gray-800"
              >
                Get started
              </Button>
            ) : (
              <Button
                onClick={() => router.push('/dashboard')}
                className="bg-black text-white rounded-md hover:bg-gray-800"
              >
                Go to Dashboard
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-20 flex-grow">
        <div className="relative z-10">
          <div className="flex flex-col items-center mb-20 text-center bg-gradient-to-br from-slate-50 to-sky-100 border border-blue-200/60 rounded-2xl p-8 transition-all duration-300 hover:translate-y-[-2px]">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-gray-900">
              Join Our Team
            </h1>
            <p className="text-gray-600 text-lg mb-10 max-w-3xl text-center">
              We&apos;re looking for passionate individuals to help us build the future of finance.
            </p>
          </div>

          {/* Job Listings */}
          <div className="mb-28 pt-10" id="careers">
            <h2 className="text-4xl font-bold mb-12 text-center">
              Open Positions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/40 border border-blue-200/60 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Chief Agent Officer
                </h3>
                <p className="text-gray-700 mb-4">
                  If you&apos;re hungry, gritty, and up to do anything from coding to solving customer issues, this is the role for you. Your goal is to make sure that whatever task you touch ends up 99% automated and move to the next task.
                </p>
                <Button
                  onClick={() => router.push('mailto:ben@0.finance?subject=Application%20for%20Chief%20Agent%20Officer')}
                  className="bg-black text-white rounded-md hover:bg-gray-800 mt-4"
                >
                  Apply Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="bios-footer text-center py-5 mt-auto"
        style={{
          backgroundColor: '#0000aa',
          color: 'white',
          textAlign: 'center',
          padding: '8px',
          fontSize: '14px',
          fontFamily: 'monospace',
        }}
      >
        <div className="copyright">
          © 2026 HYPERSTABLE • OPEN SOURCE • CRYPTO BANKING •{' '}
          <Link href="/(public)/careers" className="hover:underline">
            Careers
          </Link>
        </div>
      </div>
    </section>
  );
} 