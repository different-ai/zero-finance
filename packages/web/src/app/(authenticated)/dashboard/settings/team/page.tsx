'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBimodal } from '@/components/ui/bimodal';
import { TeamTab } from '../company/team-tab';

export default function TeamSettingsPage() {
  const router = useRouter();
  const { isTechnical } = useBimodal();

  return (
    <div
      className={cn(
        'min-h-screen',
        isTechnical ? 'bg-[#F8F9FA]' : 'bg-[#F7F7F2]',
      )}
    >
      {/* Header */}
      <header
        className={cn(
          'sticky top-0 z-40 border-b',
          isTechnical
            ? 'bg-[#F8F9FA] border-[#1B29FF]/20'
            : 'bg-[#F7F7F2] border-[#101010]/10',
        )}
      >
        <div className="h-[60px] flex items-center px-4 sm:px-6 max-w-[1400px] mx-auto mt-1">
          <button
            onClick={() => router.push('/dashboard/settings')}
            className={cn(
              'mr-4 p-2 -ml-2 rounded-lg transition-colors',
              isTechnical
                ? 'hover:bg-[#1B29FF]/10 text-[#1B29FF]'
                : 'hover:bg-[#101010]/5 text-[#101010]/60',
            )}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <Users
              className={cn(
                'h-5 w-5',
                isTechnical ? 'text-[#1B29FF]' : 'text-[#0050ff]',
              )}
            />
            <div>
              <p
                className={cn(
                  'uppercase tracking-[0.14em] text-[11px]',
                  isTechnical
                    ? 'text-[#1B29FF] font-mono'
                    : 'text-[#101010]/60',
                )}
              >
                {isTechnical ? 'CONFIG::TEAM' : 'Settings'}
              </p>
              <h1
                className={cn(
                  'leading-[1] text-[#101010] tracking-[-0.02em]',
                  isTechnical
                    ? 'font-mono text-[20px] sm:text-[24px]'
                    : 'font-serif text-[22px] sm:text-[26px]',
                )}
              >
                {isTechnical ? 'Team Members' : 'Team'}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 py-6 sm:py-8 max-w-[1400px] mx-auto">
        <TeamTab />
      </main>
    </div>
  );
}
