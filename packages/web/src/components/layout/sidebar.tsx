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
    <aside className="w-72 bg-white flex flex-col h-full relative overflow-hidden border-r border-gray-100">
      {/* Premium accent bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8FD7FF] via-blue-400 to-[#8FD7FF]" />
      
      {/* Logo section */}
      <Link href="/dashboard" className="block px-6 py-6 group">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-[#8FD7FF] blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
            <div className="relative bg-[#8FD7FF] p-3 rounded-2xl">
              <Image
                src="/logo-blue.png"
                alt="Zero Finance"
                width={32}
                height={32}
                className="h-8 w-8"
              />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Zero</h1>
            <p className="text-xs text-gray-500 font-medium">Finance Platform</p>
          </div>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-3 pb-6">
        <div className="space-y-1">
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
                  className="flex items-center gap-3 px-4 py-3 text-gray-400 cursor-not-allowed opacity-50"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                  isActive
                    ? 'bg-[#8FD7FF] text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Active indicator */}
                {isActive && (
                  <>
                    <div className="absolute inset-0 bg-[#8FD7FF] rounded-xl opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent rounded-xl" />
                  </>
                )}
                
                <div className="relative flex items-center gap-3 w-full">
                  <div className={cn(
                    "p-2 rounded-lg transition-all duration-200",
                    isActive 
                      ? "bg-white/20" 
                      : "group-hover:bg-[#8FD7FF]/10"
                  )}>
                    <item.icon
                      className={cn(
                        'h-5 w-5 transition-all duration-200',
                        isActive 
                          ? 'text-white' 
                          : 'text-gray-500 group-hover:text-[#0483F7]'
                      )}
                    />
                  </div>
                  <span className={cn(
                    'text-sm font-medium transition-all duration-200',
                    isActive ? 'text-white' : 'text-gray-700 group-hover:text-gray-900'
                  )}>
                    {item.name}
                  </span>
                  
                  {/* Hover accent */}
                  {!isActive && (
                    <div className="absolute right-4 w-1.5 h-1.5 bg-[#8FD7FF] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110" />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-gray-100">
        {/* User section */}
        <div className="p-4">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#8FD7FF] to-blue-400 flex items-center justify-center text-white font-semibold shadow-sm">
              T
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">test-0189</p>
              <p className="text-xs text-gray-500">Personal Account</p>
            </div>
          </div>
        </div>

        {/* Sign out */}
        {authenticated && (
          <div className="p-4 pt-0">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 group"
            >
              <LogOut className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
