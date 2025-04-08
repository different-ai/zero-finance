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
  Zap,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrivy } from '@privy-io/react-auth';

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Accounts",
    href: "/dashboard/accounts",
    icon: CreditCard,
  },
  {
    name: "Transactions",
    href: "/dashboard/transactions",
    icon: ArrowRightLeft,
  },
  {
    name: "Invoices",
    href: "/dashboard/invoices",
    icon: FileText,
  },
  {
    name: "Bank",
    href: "/dashboard/bank",
    icon: PiggyBank,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout, authenticated } = usePrivy();

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
        
        {/* Create Invoice Button - Special button with different styling */}
        <Link
          href="/create-invoice"
          className="group flex items-center px-4 py-3 mt-4 text-sm font-medium rounded-md bg-[#2038E5] text-white"
        >
          <Plus className="mr-3 h-5 w-5 text-white" />
          Create Invoice
        </Link>
      </nav>
      {authenticated && (
        <div className="p-4 border-t">
          <button 
            onClick={() => logout()}
            className="flex items-center px-4 py-2 w-full text-sm font-medium text-[#2038E5]/60 hover:text-[#2038E5] rounded-md hover:bg-[#2038E5]/10"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
} 