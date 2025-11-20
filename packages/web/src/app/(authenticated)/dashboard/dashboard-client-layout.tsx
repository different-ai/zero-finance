'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { usePathname } from 'next/navigation';
import {
  Breadcrumbs,
  type BreadcrumbItem,
} from '@/components/layout/breadcrumbs';
import { usePhoneCollection } from '@/hooks/use-phone-collection';
import { PostAuthRedirect } from '@/components/auth/post-auth-redirect';
import { EnsureEmbeddedWallet } from '@/components/auth/ensure-embedded-wallet';
import { BimodalProvider } from '@/components/ui/bimodal';

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Dashboard', href: '/dashboard' },
  ];

  let currentPath = '/dashboard';

  let startIndex = pathSegments[0]?.toLowerCase() === 'dashboard' ? 1 : 0;

  for (let i = startIndex; i < pathSegments.length; i++) {
    const segment = pathSegments[i];
    currentPath += `/${segment}`;

    const label = capitalize(segment.replace(/-/g, ' '));

    if (i === pathSegments.length - 1) {
      breadcrumbItems.push({ label });
    } else {
      const isLikelyId =
        /^[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}$/.test(segment) ||
        /^[0-9]{5,}$/.test(segment);
      if (isLikelyId) {
        breadcrumbItems.push({ label });
      } else {
        breadcrumbItems.push({ label, href: currentPath });
      }
    }
  }

  const uniqueLabels = new Map<string, BreadcrumbItem>();
  breadcrumbItems.forEach((item) => uniqueLabels.set(item.label, item));

  return Array.from(uniqueLabels.values());
}

export default function DashboardClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle phone collection after auth
  usePhoneCollection();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <BimodalProvider>
      <PostAuthRedirect />
      <EnsureEmbeddedWallet />
      <div className="flex h-screen bg-[#F7F7F2]">
        {/* Mobile sidebar - shown only when mobileMenuOpen is true */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-[#101010]/50"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 flex flex-col z-40 w-64 bg-white border-r border-[#101010]/10">
              <Sidebar />
            </div>
          </div>
        )}

        {/* Desktop sidebar - always visible on md screens and up */}
        <aside className="hidden md:block md:w-64 bg-white border-r border-[#101010]/10 flex-shrink-0 h-full overflow-y-auto">
          <Sidebar />
        </aside>

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={toggleMobileMenu} />

          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            <Breadcrumbs
              items={generateBreadcrumbs(usePathname())}
              className="px-4 sm:px-6 lg:px-8 py-3 bg-white border-b border-[#101010]/10 z-10"
            />
            <div className="flex-1">{children}</div>
          </main>
        </div>
      </div>
    </BimodalProvider>
  );
}
