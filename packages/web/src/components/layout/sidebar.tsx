'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  Inbox,
  PiggyBank,
  ChevronDown,
  User,
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
    name: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Inbox',
    href: '/dashboard/ai-inbox',
    icon: Inbox,
  },
  {
    name: 'Invoices',
    href: '/dashboard/invoices',
    icon: FileText,
  },
  // add one for savings
  {
    name: 'Savings',
    href: '/dashboard/savings',
    icon: PiggyBank,
  },

  {
    name: 'Advanced',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout, authenticated, user } = usePrivy();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
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

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/';
    }
  };

  return (
    <aside className="w-[280px] bg-gray-50 flex flex-col h-full relative border-r border-gray-200">
      {/* Logo section */}
      <Link href="/dashboard" className="block px-6 py-7 group">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex items-center justify-center bg-[#8FD7FF] rounded-md p-4">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#8FD7FF] to-blue-400 rounded-md blur opacity-25 group-hover:opacity-40 transition duration-300 bg-[#8FD7FF] flex items-center justify-center" />
              <Image
                src="/logo-blue.png"
                alt="Zero Finance"
                width={28}
                height={28}
                className="h-7 w-7"
              />
              <span className="text-xl font-light text-[#0483F7]">finance</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-3 pb-3">
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
                  <item.icon className="h-[18px] w-[18px]" />
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
                    ? 'bg-gradient-to-r from-[#8FD7FF]/20 to-blue-400/20 shadow-sm'
                    : 'hover:bg-white ',
                )}
                aria-current={isActive ? 'page' : undefined}
              >
          

                <item.icon
                  className={cn(
                    'h-[18px] w-[18px] transition-all duration-200',
                    isActive
                      ? 'text-blue-600'
                      : 'text-gray-500 group-hover:text-gray-700',
                  )}
                />
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
                    <div className="h-1.5 w-1.5 bg-gradient-to-r from-[#8FD7FF] to-blue-400 rounded-full" />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-gray-200 bg-white">
        {/* User section with dropdown */}
        {authenticated && user && (
          <div className="p-4">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="relative">
                  <div className="h-10 w-10 rounded-sm bg-gradient-to-br from-[#8FD7FF] to-blue-400 flex items-center justify-center text-white font-medium text-sm shadow-sm">
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
                  <p className="text-xs text-gray-500 truncate">
                    {user?.wallet?.address
                      ? `${user.wallet.address.substring(0, 6)}...${user.wallet.address.substring(user.wallet.address.length - 4)}`
                      : 'Connected'}
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
