'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  BarChart4,
  Wallet,
  Clock,
  Upload,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePrivy } from '@privy-io/react-auth';
import { Badge } from '@/components/ui/badge';

const navigationItems = [
  {
    name: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Invoices',
    href: '/dashboard/invoices',
    icon: FileText,
  },
  {
    name: 'Allocation',
    href: '/dashboard/allocations',
    icon: BarChart4,
  },
  {
    name: 'Transfer',
    href: '/dashboard/transfers/off-ramp',
    icon: Upload,
    disabled: true,
    tag: 'Soon'
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout, authenticated } = usePrivy();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div>
            <Image
              src="/hypr-squre.png"
              alt="HyprSQRL Logo"
              width={48}
              height={48}
            />
          </div>
        </Link>
      </div>
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navigationItems.map((item) => {
          const isActive = !item.disabled && (
            item.href === '/dashboard'
              ? pathname === item.href
              : pathname === item.href || pathname?.startsWith(`${item.href}/`)
          );
          
          if (item.disabled) {
            return (
              <div
                key={item.name}
                className={cn(
                  'group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg',
                  'text-gray-400 cursor-not-allowed'
                )}
              >
                <div className="flex items-center">
                  <item.icon className={cn('mr-3 h-5 w-5', 'text-gray-300')} />
                  {item.name}
                </div>
                {item.tag && (
                  <Badge variant="outline" className="text-xs font-normal text-gray-400 border-gray-300">
                    {item.tag}
                  </Badge>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5',
                  isActive
                    ? 'text-white'
                    : 'text-gray-400 group-hover:text-gray-500',
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      {authenticated && (
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center px-3 py-2.5 w-full text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 text-gray-400" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
