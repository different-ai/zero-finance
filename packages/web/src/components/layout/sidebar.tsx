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
    <aside className="w-72 bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col h-full relative overflow-hidden">
      {/* Premium gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10 pointer-events-none" />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      {/* Top section */}
      <div className="relative z-10">
        {/* Logo section with premium feel */}
        <Link href="/dashboard" className="block px-8 py-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur-xl opacity-50" />
              <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 rounded-2xl shadow-2xl">
                <Image
                  src="/logo-blue.png"
                  alt="Zero Finance"
                  width={28}
                  height={28}
                  className="h-7 w-7 filter brightness-0 invert"
                />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Finance
              </h1>
              <p className="text-xs text-gray-500 font-medium tracking-wider uppercase">Premium</p>
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="px-4 pb-6">
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
                    className="flex items-center gap-3 px-4 py-3 text-gray-600 cursor-not-allowed opacity-50"
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
                    'group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300',
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {/* Active indicator glow */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 blur-md opacity-50" />
                  )}
                  
                  <div className="relative flex items-center gap-3 w-full">
                    <item.icon
                      className={cn(
                        'h-5 w-5 transition-transform duration-300',
                        isActive ? 'text-white' : 'text-gray-400 group-hover:text-white group-hover:scale-110'
                      )}
                    />
                    <span className={cn(
                      'text-sm font-medium transition-all duration-300',
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                    )}>
                      {item.name}
                    </span>
                    
                    {/* Premium hover effect */}
                    {!isActive && (
                      <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="h-1 w-1 bg-blue-400 rounded-full animate-pulse" />
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Bottom section */}
      <div className="relative z-10 mt-auto">
        {/* User section */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 backdrop-blur-sm">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
              T
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">test-0189</p>
              <p className="text-xs text-gray-500">Premium Account</p>
            </div>
          </div>
        </div>

        {/* Sign out */}
        {authenticated && (
          <div className="p-4 pt-0">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 group"
            >
              <LogOut className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>

      {/* Premium edge glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
    </aside>
  );
}
