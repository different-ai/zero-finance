'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePrivy } from '@privy-io/react-auth';
import { UserCircle, LayoutDashboard, FileText, Landmark, Settings, Upload } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const links = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/invoices', label: 'Invoices', icon: FileText },
  { href: '/dashboard/bank', label: 'Banking', icon: Landmark },
  { href: '/dashboard/transfers/off-ramp', label: 'Withdraw', icon: Upload },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function DashboardNav() {
  const { authenticated, user, logout } = usePrivy();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="flex flex-col gap-4 py-4 w-full h-full border-r bg-muted/40">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Image
            src="/hypr-logo-icon.svg"
            alt="Hyprsqrl Logo"
            width={24}
            height={24}
            priority
          />
          <span className="">Hyprsqrl</span>
        </Link>
      </div>
      
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  isActive && "bg-muted text-primary"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
} 