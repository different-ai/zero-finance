import { Bell, Search, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";

export function Header() {
  return (
    <header className="border-b bg-background z-10">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="md:hidden flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Menu">
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div>
              <Image
                src="/hsql.png"
                alt="HyprSQRL Logo"
                width={24}
                height={24}
                className="blue-overlay"
              />
            </div>
            <span className="logo-text font-medium text-md tracking-tight">hyprsqrl</span>
          </Link>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search..."
              className="rounded-md border border-input bg-background px-3 py-2 pl-8 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:w-[200px] lg:w-[300px]"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 rounded-full"
            aria-label="Profile"
          >
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}