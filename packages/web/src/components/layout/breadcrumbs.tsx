import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className={cn('text-sm text-muted-foreground', className)}>
      <ol className="flex items-center space-x-1.5">
        {items.map((item, index) => (
          <li key={item.label + index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 flex-shrink-0 mx-1.5" />
            )}
            {item.href && index < items.length - 1 ? (
              <Link
                href={item.href}
                className="hover:text-foreground hover:underline underline-offset-2 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className={cn(index === items.length - 1 ? 'font-medium text-foreground' : '')}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Example Usage (in another component):
// const breadcrumbItems: BreadcrumbItem[] = [
//   { label: 'Dashboard', href: '/dashboard' },
//   { label: 'Settings', href: '/dashboard/settings' },
//   { label: 'Allocations' }, // Last item doesn't usually have href
// ];
// return <Breadcrumbs items={breadcrumbItems} />; 