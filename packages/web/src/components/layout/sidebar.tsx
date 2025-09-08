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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePrivy } from '@privy-io/react-auth';

// Navigation items types
type NavigationItem = {
  name: string;
  href: string;
  icon: React.ElementType;
  disabled?: boolean;
};

const navigationItems: NavigationItem[] = [
  {
    name: 'Banking',
    href: '/dashboard',
    icon: Banknote,
  },
  {
    name: 'Invoices',
    href: '/dashboard/invoices',
    icon: FileText,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout, authenticated, user } = usePrivy();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // wait for lowding
  const [showPromo, setShowPromo] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <aside className="bg-white flex flex-col h-full relative border-r border-[#101010]/10">
      {/* Logo section */}
      <Link
        href="/dashboard"
        className="block px-6 py-7 border-b border-[#101010]/10"
      >
        <div className="flex items-center gap-2">
          <Image
            src="/new-logo-bluer.png"
            alt="Zero Finance"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="text-xl font-medium text-[#1B29FF]">finance</span>
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
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Active rail indicator */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[2px] bg-[#1B29FF] rounded-full" />
                )}
                {React.createElement(item.icon, {
                  className: cn(
                    'h-4 w-4 transition-colors duration-150',
                    isActive
                      ? 'text-[#101010]'
                      : 'text-[#101010]/60 group-hover:text-[#101010]',
                  ),
                })}
                <span
                  className={cn(
                    'text-[13px] font-medium transition-colors duration-150',
                    isActive
                      ? 'text-[#101010]'
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

      {/* Promotional CTA Section */}
      {showPromo && (
        <div className="mx-4 mb-4 p-4 bg-[#F7F7F2] border border-[#101010]/10 relative overflow-hidden mt-auto">
          {/* Close button */}
          <button
            onClick={handleDismissPromo}
            className="absolute top-2 right-2 p-1 hover:bg-[#101010]/5 transition-colors"
            aria-label="Dismiss promotion"
          >
            <X className="h-4 w-4 text-[#101010]/40" />
          </button>

          {/* Content */}
          <div className="relative z-10">
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2 text-[#101010]">
              Get 0 Finance AI
              <Sparkles className="h-4 w-4 text-[#1B29FF] flex-shrink-0" />
            </h3>
            <p className="text-xs text-[#101010]/60 mb-4 leading-relaxed">
              Your own AI CFO. Unlimited categorizations, auto-labeling, and
              more.
            </p>
            <a
              href="https://buy.polar.sh/polar_cl_FJM7jQ61Kj8vMDH4H1KrcsGdstxyeozSXdgvc2FL0yb"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2.5 px-4 bg-[#1B29FF] hover:bg-[#1B29FF]/90 text-white text-xs uppercase tracking-wider text-center transition-all duration-200"
            >
              Purchase now
            </a>
          </div>
        </div>
      )}

      {/* Spacer to push bottom content down */}
      <div className="flex-1" />

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
      <div className="border-t-2 border-[#101010]/10 bg-[#F7F7F2]">
        {authenticated && user && (
          <div className="p-4">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full flex items-center gap-3 p-3 hover:bg-white/50 transition-colors"
              >
                <div className="relative">
                  <div className="h-10 w-10 bg-[#1B29FF] flex items-center justify-center text-white font-medium text-sm">
                    {user?.email?.address?.[0]?.toUpperCase() || (
                      <User className="h-5 w-5" />
                    )}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-[#1B29FF] border-2 border-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-[#101010] truncate">
                    {user?.email?.address?.split('@')[0] || 'User'}
                  </p>
                </div>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 text-[#101010]/40 transition-transform duration-200',
                    dropdownOpen && 'rotate-180',
                  )}
                />
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-[#101010]/10 shadow-lg py-2 z-50">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#101010]/70 hover:bg-[#F7F7F2] hover:text-[#101010] transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <LayoutDashboard className="h-4 w-4 text-[#101010]/40" />
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#101010]/70 hover:bg-[#F7F7F2] hover:text-[#101010] transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Settings className="h-4 w-4 text-[#101010]/40" />
                    Settings
                  </Link>
                  <div className="border-t border-[#101010]/10 my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#101010]/70 hover:bg-[#F7F7F2] hover:text-[#101010] transition-colors text-left"
                  >
                    <LogOut className="h-4 w-4 text-[#101010]/40" />
                    Sign Out
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
