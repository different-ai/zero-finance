'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { 
  LayoutDashboard, 
  CreditCard, 
  PiggyBank, 
  ArrowRightLeft, 
  LineChart, 
  Settings, 
  LogOut,
  FileText,
  Users,
  BarChart4,
  DollarSign,
  Zap
} from "lucide-react";

import { cn } from "@/lib/utils";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Allocation",
    href: "/allocations",
    icon: BarChart4,
  },
  // {
  //   name: "Accounts",
  //   href: "/accounts",
  //   icon: CreditCard,
  // },
  // {
  //   name: "Transactions",
  //   href: "/transactions",
  //   icon: ArrowRightLeft,
  // },
  // {
  //   name: "Invoices",
  //   href: "/invoices",
  //   icon: FileText,
  // },
  // {
  //   name: "Settings",
  //   href: "/settings",
  //   icon: Settings,
  // },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full border-r bg-background">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div>
            <Image
              src="/hsql.png"
              alt="HyprSQRL Logo"
              width={30}
              height={30}
              className="blue-overlay"
            />
          </div>
          <span className="logo-text font-medium text-xl tracking-tight">hyprsqrl</span>
        </Link>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-4 py-3 text-sm font-medium rounded-md",
                isActive
                  ? "bg-[#2038E5] text-white"
                  : "text-[#2038E5]/60 hover:text-[#2038E5] hover:bg-[#2038E5]/10"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5",
                  isActive ? "text-white" : "text-[#2038E5]/60 group-hover:text-[#2038E5]"
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t">
        <button className="flex items-center px-4 py-2 w-full text-sm font-medium text-[#2038E5]/60 hover:text-[#2038E5] rounded-md hover:bg-[#2038E5]/10">
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}