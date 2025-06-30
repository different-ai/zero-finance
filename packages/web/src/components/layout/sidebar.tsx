'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  Inbox,
  PiggyBank,
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
  const { logout, authenticated } = usePrivy();
  const router = useRouter();

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
    <aside className="w-64 bg-sky-200/90 backdrop-blur-sm shadow-lg flex flex-col justify-between h-full">
      {/* Top section */}
      <div>
        {/* Compact logo */}
        <Link href="/dashboard" className="flex items-center gap-2 h-16 px-6">
          <Image
            src="/logo-blue.png"
            alt="Zero Finance Logo"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="text-xl font-extrabold text-[#0483F7] tracking-tight">
            finance
          </span>
        </Link>

        <nav className="mt-4 space-y-1 px-2">
          {navigationItems.map((item) => {
            const isActive =
              !item.disabled &&
              (item.href === '/dashboard'
                ? pathname === item.href
                : pathname === item.href || pathname?.startsWith(`${item.href}/`));

            if (item.disabled) {
              return (
                <div
                  key={item.name}
                  className="group flex items-center gap-3 px-3 py-2 rounded-md text-gray-500/70 cursor-not-allowed"
                >
                  <item.icon className="h-5 w-5 text-gray-500/50" />
                  <span className="text-sm">{item.name}</span>
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 px-3 py-2 rounded-md relative transition-colors',
                  isActive
                    ? 'text-[#0483F7] bg-[#0483F7]/10'
                    : 'text-gray-700 hover:bg-sky-300/30 hover:text-gray-900'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {isActive && (
                  <span className="absolute inset-y-0 left-0 w-1 bg-[#0483F7] rounded-r" />
                )}
                <item.icon
                  className={cn(
                    'h-5 w-5',
                    isActive ? 'text-[#0483F7]' : 'text-gray-600 group-hover:text-[#0483F7]'
                  )}
                />
                <span className={cn('text-sm', isActive ? 'font-semibold' : 'font-medium')}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sign out section */}
      {authenticated && (
        <div className="px-6 pb-6">
          <div className="border-t border-gray-400/30 pt-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-[#0483F7] transition-colors w-full"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
