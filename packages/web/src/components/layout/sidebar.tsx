'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  User,
  Phone,
  MessageSquare,
  X,
  Sparkles,
  Banknote,
  Users,
  Building,
  Activity,
  Cpu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePrivy } from '@privy-io/react-auth';
import { featureConfigClient } from '@/lib/feature-config-client';
import { api } from '@/trpc/react';
import { useBimodal, BimodalToggle } from '@/components/ui/bimodal';

// Navigation items types
type NavigationItem = {
  name: string;
  href: string;
  icon: React.ElementType;
  disabled?: boolean;
};

export function Sidebar() {
  const pathname = usePathname();
  const { logout, authenticated, user } = usePrivy();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showPromo, setShowPromo] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isTechnical, toggle, mode } = useBimodal();

  // Fetch workspace data
  const { data: workspaceData } = api.workspace.getOrCreateWorkspace.useQuery();

  // For now, check if URL has contractor parameter (we'll implement proper role checking later)
  const isContractor =
    typeof window !== 'undefined' &&
    window.location.search.includes('contractor=true');

  // Determine navigation items based on user type and feature availability
  const navigationItems: NavigationItem[] = isContractor
    ? [
        {
          name: 'Invoices',
          href: '/dashboard/invoices',
          icon: FileText,
        },
      ]
    : [
        // Show Dashboard instead of Banking in Lite mode
        {
          name: featureConfigClient.banking.enabled
            ? isTechnical
              ? 'Treasury'
              : 'Account'
            : 'Dashboard',
          href: '/dashboard',
          icon: Banknote,
        },
        {
          name: isTechnical ? 'Payroll' : 'Contractors',
          href: '/dashboard/contractors',
          icon: Users,
        },
        {
          name: 'Invoices',
          href: '/dashboard/invoices',
          icon: FileText,
        },
      ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Check if user has dismissed promo before
  useEffect(() => {
    // wait a second
    setTimeout(() => {
      const promoDismissed = localStorage.getItem('zero-pro-promo-dismissed');
      if (!promoDismissed) {
        setShowPromo(true);
      }
    }, 1000);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/';
    }
  };

  const handleDismissPromo = () => {
    setShowPromo(false);
    localStorage.setItem('zero-pro-promo-dismissed', 'true');
  };

  return (
    <aside
      className={cn(
        'flex flex-col h-full relative transition-colors duration-200',
        isTechnical
          ? 'bg-[#F8F9FA] border-r border-[#1B29FF]/20'
          : 'bg-white border-r border-[#101010]/10',
      )}
    >
      {/* Logo section */}
      <Link
        href="/dashboard"
        className={cn(
          'block px-6 py-7 border-b transition-colors duration-200',
          isTechnical ? 'border-[#1B29FF]/20' : 'border-[#101010]/10',
        )}
      >
        <div>
          <div className="flex items-center gap-2">
            <Image
              src="/new-logo-bluer.png"
              alt="Zero Finance"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span
              className={cn(
                'text-xl font-medium',
                isTechnical ? 'text-[#1B29FF] font-mono' : 'text-[#0050ff]',
              )}
            >
              {isTechnical ? 'ZERO::FINANCE' : 'finance'}
            </span>
          </div>
          {workspaceData?.workspace?.name && (
            <div className="mt-2 flex items-center gap-1.5">
              <Building className="h-3.5 w-3.5 text-[#101010]/40" />
              <span
                className={cn(
                  'text-[12px]',
                  isTechnical
                    ? 'text-[#1B29FF]/70 font-mono'
                    : 'text-[#101010]/60',
                )}
              >
                {workspaceData.workspace.name}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Navigation */}
      <nav className="px-4 py-4">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const isActive =
              !item.disabled &&
              (item.href === '/dashboard'
                ? pathname === item.href
                : pathname === item.href ||
                  pathname?.startsWith(`${item.href}/`));

            if (item.disabled) {
              return (
                <div
                  key={item.name}
                  className="flex items-center gap-3 px-3 py-2.5 text-[#101010]/40 cursor-not-allowed"
                >
                  {React.createElement(item.icon, {
                    className: 'h-[18px] w-[18px]',
                  })}
                  <span className="text-sm uppercase tracking-wider">
                    {item.name}
                  </span>
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group relative flex items-center gap-2 px-3 py-2 transition-colors duration-150',
                  isActive
                    ? 'text-[#101010]'
                    : 'hover:bg-[#F7F7F2] text-[#101010]/70 hover:text-[#101010]',
                  isTechnical && isActive && 'bg-[#1B29FF]/5 text-[#1B29FF]',
                  isTechnical &&
                    !isActive &&
                    'hover:bg-[#1B29FF]/5 hover:text-[#1B29FF]',
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Active rail indicator */}
                {isActive && (
                  <span
                    className={cn(
                      'absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[2px] rounded-full transition-colors duration-200',
                      isTechnical ? 'bg-[#1B29FF]' : 'bg-[#0050ff]',
                    )}
                  />
                )}
                {React.createElement(item.icon, {
                  className: cn(
                    'h-4 w-4 transition-colors duration-150',
                    isActive
                      ? isTechnical
                        ? 'text-[#1B29FF]'
                        : 'text-[#101010]'
                      : isTechnical
                        ? 'text-[#101010]/60 group-hover:text-[#1B29FF]'
                        : 'text-[#101010]/60 group-hover:text-[#101010]',
                  ),
                })}
                <span
                  className={cn(
                    'text-[13px] font-medium transition-colors duration-150',
                    isActive
                      ? isTechnical
                        ? 'text-[#1B29FF] font-mono'
                        : 'text-[#101010]'
                      : isTechnical
                        ? 'text-[#101010]/70 group-hover:text-[#1B29FF] font-mono'
                        : 'text-[#101010]/70 group-hover:text-[#101010]',
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer to push bottom content down */}
      <div className="flex-1" />

      {/* Bimodal Toggle */}
      <div className="px-4 pb-3 border-b border-[#101010]/10">
        <div
          className={cn(
            'p-3 rounded-lg transition-colors duration-200',
            isTechnical
              ? 'bg-[#1B29FF]/5 border border-[#1B29FF]/10'
              : 'bg-[#F7F7F2]',
          )}
        >
          <p
            className={cn(
              'text-[10px] uppercase tracking-wider mb-2',
              isTechnical ? 'text-[#1B29FF]/70 font-mono' : 'text-[#101010]/50',
            )}
          >
            {isTechnical ? 'MODE::SELECT' : 'View Mode'}
          </p>
          <BimodalToggle
            isTechnical={isTechnical}
            onToggle={toggle}
            showLabels={true}
          />
          <p
            className={cn(
              'text-[10px] mt-2 leading-relaxed',
              isTechnical ? 'text-[#1B29FF]/60 font-mono' : 'text-[#101010]/50',
            )}
          >
            {isTechnical
              ? 'I bank in crypto (On-chain view)'
              : 'I bank in dollars (Fiat view)'}
          </p>
        </div>
      </div>

      {/* Bottom utility navigation */}
      <div className="px-4 pb-3 space-y-1">
        <button
          onClick={() => window.open('/support', '_blank')}
          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#F7F7F2] transition-colors duration-150 group"
        >
          <Phone className="h-4 w-4 text-[#101010]/60 group-hover:text-[#101010] transition-colors duration-150" />
          <span className="text-[13px] font-medium text-[#101010]/70 group-hover:text-[#101010] transition-colors duration-150">
            Support
          </span>
        </button>

        <button
          onClick={() => router.push('/dashboard/feedback')}
          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#F7F7F2] transition-colors duration-150 group"
        >
          <MessageSquare className="h-4 w-4 text-[#101010]/60 group-hover:text-[#101010] transition-colors duration-150" />
          <span className="text-[13px] font-medium text-[#101010]/70 group-hover:text-[#101010] transition-colors duration-150">
            Feedback
          </span>
        </button>

        <Link
          href="/dashboard/settings"
          className="flex items-center gap-2 px-3 py-2 hover:bg-[#F7F7F2] transition-colors duration-150 group"
        >
          <Settings className="h-4 w-4 text-[#101010]/60 group-hover:text-[#101010] transition-colors duration-150" />
          <span className="text-[13px] font-medium text-[#101010]/70 group-hover:text-[#101010] transition-colors duration-150">
            Settings
          </span>
        </Link>
      </div>

      {/* User section */}
      <div
        className={cn(
          'border-t-2 transition-colors duration-200',
          isTechnical
            ? 'border-[#1B29FF]/20 bg-[#1B29FF]/5'
            : 'border-[#101010]/10 bg-[#F7F7F2]',
        )}
      >
        {authenticated && user && (
          <div className="p-4">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={cn(
                  'w-full flex items-center gap-3 p-3 transition-colors',
                  isTechnical ? 'hover:bg-[#1B29FF]/10' : 'hover:bg-white/50',
                )}
              >
                <div className="relative">
                  <div
                    className={cn(
                      'h-10 w-10 flex items-center justify-center text-white font-medium text-sm',
                      isTechnical ? 'bg-[#1B29FF]' : 'bg-[#0050ff]',
                    )}
                  >
                    {user?.email?.address?.[0]?.toUpperCase() || (
                      <User className="h-5 w-5" />
                    )}
                  </div>
                  <div
                    className={cn(
                      'absolute -bottom-0.5 -right-0.5 h-3 w-3 border-2 border-white',
                      isTechnical ? 'bg-[#1B29FF]' : 'bg-[#0050ff]',
                    )}
                  />
                </div>
                <div className="flex-1 text-left">
                  <p
                    className={cn(
                      'text-sm font-medium text-[#101010] truncate',
                      isTechnical && 'font-mono',
                    )}
                  >
                    {user?.email?.address?.split('@')[0] || 'User'}
                  </p>
                  {workspaceData?.workspace?.name && (
                    <p
                      className={cn(
                        'text-xs truncate',
                        isTechnical
                          ? 'text-[#1B29FF]/60 font-mono'
                          : 'text-[#101010]/50',
                      )}
                    >
                      {workspaceData.workspace.name}
                    </p>
                  )}
                </div>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 transition-transform duration-200',
                    isTechnical ? 'text-[#1B29FF]/60' : 'text-[#101010]/40',
                    dropdownOpen && 'rotate-180',
                  )}
                />
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div
                  className={cn(
                    'absolute bottom-full left-0 right-0 mb-2 bg-white shadow-lg py-2 z-50',
                    isTechnical
                      ? 'border border-[#1B29FF]/20'
                      : 'border border-[#101010]/10',
                  )}
                >
                  <Link
                    href="/dashboard"
                    className={cn(
                      'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                      isTechnical
                        ? 'text-[#101010]/70 hover:bg-[#1B29FF]/5 hover:text-[#1B29FF] font-mono'
                        : 'text-[#101010]/70 hover:bg-[#F7F7F2] hover:text-[#101010]',
                    )}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <LayoutDashboard
                      className={cn(
                        'h-4 w-4',
                        isTechnical ? 'text-[#1B29FF]/60' : 'text-[#101010]/40',
                      )}
                    />
                    {isTechnical ? 'DASHBOARD' : 'Dashboard'}
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className={cn(
                      'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                      isTechnical
                        ? 'text-[#101010]/70 hover:bg-[#1B29FF]/5 hover:text-[#1B29FF] font-mono'
                        : 'text-[#101010]/70 hover:bg-[#F7F7F2] hover:text-[#101010]',
                    )}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Settings
                      className={cn(
                        'h-4 w-4',
                        isTechnical ? 'text-[#1B29FF]/60' : 'text-[#101010]/40',
                      )}
                    />
                    {isTechnical ? 'SETTINGS' : 'Settings'}
                  </Link>
                  <div
                    className={cn(
                      'border-t my-2',
                      isTechnical
                        ? 'border-[#1B29FF]/20'
                        : 'border-[#101010]/10',
                    )}
                  ></div>
                  <button
                    onClick={handleLogout}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left',
                      isTechnical
                        ? 'text-[#101010]/70 hover:bg-[#1B29FF]/5 hover:text-[#1B29FF] font-mono'
                        : 'text-[#101010]/70 hover:bg-[#F7F7F2] hover:text-[#101010]',
                    )}
                  >
                    <LogOut
                      className={cn(
                        'h-4 w-4',
                        isTechnical ? 'text-[#1B29FF]/60' : 'text-[#101010]/40',
                      )}
                    />
                    {isTechnical ? 'DISCONNECT' : 'Sign Out'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
