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
    <aside className="bg-gray-50 flex flex-col h-full relative border-r border-gray-200">
      {/* Logo section */}
      <Link href="/dashboard" className="block px-6 py-7 group">
        <div className="flex items-center gap-3 ml-[-10px] justify-center scale-110">
          {/* add a sort glow from below adds a bit of contrast slightly animated */}
          <div className="absolute inset-0 bg-[#0040FF]/10 backdrop-blur-sm rounded-md ml-2" />
          <div className="relative">
            <div className="flex items-center justify-center  transition-all duration-300 rounded-md p-2">
              <div className="absolute -inset-1 bg-gradient-to-r  opacity-25 group-hover:opacity-40 transition duration-300 flex items-center justify-center" />
              <Image
                src="/new-logo-bluer.png"
                alt="Zero Finance"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="text-xl text-[#0040FF]">finance</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="px-3 pb-3">
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
                  className="flex items-center gap-3 px-4 py-3 text-gray-400 cursor-not-allowed opacity-50"
                >
                  {React.createElement(item.icon, {
                    className: 'h-[18px] w-[18px]',
                  })}
                  <span className="text-[15px] font-medium">{item.name}</span>
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group relative flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-[#DDE0F2]/40 to-[#DDE0F2]/10 '
                    : 'hover:bg-white ',
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {React.createElement(item.icon, {
                  className: cn(
                    'h-[18px] w-[18px] transition-all duration-200',
                    isActive
                      ? 'text-[#0040FF]'
                      : 'text-gray-500 group-hover:text-gray-700',
                  ),
                })}
                <span
                  className={cn(
                    'text-[15px] font-medium transition-all duration-200',
                    isActive
                      ? 'text-gray-900'
                      : 'text-gray-600 group-hover:text-gray-900',
                  )}
                >
                  {item.name}
                </span>

                {/* Premium hover effect */}
                {!isActive && (
                  <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="h-1.5 w-1.5 bg-gradient-to-r from-[#0040FF] to-[#0040FF]/50 rounded-full" />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Promotional CTA Section */}
      {showPromo && (
        <div className="mx-3 mb-4 p-4 bg-gradient-to-br from-[#0040FF]/10 to-[#0040FF]/5 rounded-xl border border-[#0040FF]/20 relative overflow-hidden mt-auto">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#0040FF]/30 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#0040FF]/30 rounded-full blur-xl" />

          {/* Close button */}
          <button
            onClick={handleDismissPromo}
            className="absolute top-2 right-2 p-1 hover:bg-gray-200/50 rounded-md transition-colors"
            aria-label="Dismiss promotion"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>

          {/* Content */}
          <div className="relative z-10">
            <h3 className="text-base font-semibold mb-2 flex items-center gap-2 text-gray-900 whitespace-nowrap">
              Get 0 Finance AI
              <Sparkles className="h-4 w-4 text-[#0040FF] flex-shrink-0" />
            </h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Your own AI CFO. Unlimited categorizations, auto-labeling, and
              more.
            </p>
            <a
              href="https://buy.polar.sh/polar_cl_FJM7jQ61Kj8vMDH4H1KrcsGdstxyeozSXdgvc2FL0yb"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2.5 px-4 bg-[#0040FF] hover:bg-[#0040FF]/80 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#0040FF]/25 text-center"
            >
              Purchase now
            </a>
          </div>
        </div>
      )}

      {/* Spacer to push bottom content down */}
      <div className="flex-1" />

      {/* Bottom utility navigation */}
      <div className="px-3 pb-3 space-y-1">
        <button
          onClick={() => window.open('/support', '_blank')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-md hover:bg-white transition-colors group"
        >
          <Phone className="h-[18px] w-[18px] text-gray-500 group-hover:text-gray-700 transition-colors" />
          <span className="text-[15px] font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
            Support
          </span>
        </button>

        <button
          onClick={() => router.push('/dashboard/feedback')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-md hover:bg-white transition-colors group"
        >
          <MessageSquare className="h-[18px] w-[18px] text-gray-500 group-hover:text-gray-700 transition-colors" />
          <span className="text-[15px] font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
            Feedback
          </span>
        </button>

        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-white transition-colors group"
        >
          <Settings className="h-[18px] w-[18px] text-gray-500 group-hover:text-gray-700 transition-colors" />
          <span className="text-[15px] font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
            Settings
          </span>
        </Link>
      </div>

      {/* User section */}
      <div className="border-t border-gray-200 bg-white">
        {authenticated && user && (
          <div className="p-4">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="relative">
                  <div className="h-10 w-10 rounded-sm bg-gradient-to-br from-[#0040FF]/10 to-[#0040FF]/20 flex items-center justify-center text-white font-medium text-sm ">
                    {user?.email?.address?.[0]?.toUpperCase() || (
                      <User className="h-5 w-5" />
                    )}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.email?.address?.split('@')[0] || 'User'}
                  </p>
                </div>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 text-gray-400 transition-transform duration-200',
                    dropdownOpen && 'rotate-180',
                  )}
                />
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <LayoutDashboard className="h-4 w-4 text-gray-400" />
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Settings className="h-4 w-4 text-gray-400" />
                    Settings
                  </Link>
                  <div className="border-t border-gray-100 my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                  >
                    <LogOut className="h-4 w-4 text-gray-400" />
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
