'use client'; // Ensure this is at the top

import { Bell, Search, User, Menu, LogOut, Mail, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Helper function to get initials
const getInitials = (name?: string | null): string => {
  if (!name) return "?";
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');
};

export function Header() {
  const { ready, authenticated, user, logout } = usePrivy();

  // Determine user identifier and type
  let userIdentifier: string | null = null;
  let identifierType: 'email' | 'wallet' | 'other' | null = null;
  if (ready && authenticated && user) {
    if (user.email?.address) {
      userIdentifier = user.email.address;
      identifierType = 'email';
    } else if (user.wallet?.address) {
      userIdentifier = user.wallet.address;
      identifierType = 'wallet';
    } else {
      // Add fallbacks if needed, e.g., phone, social usernames
      userIdentifier = user.id; // Fallback to Privy user ID
      identifierType = 'other';
    }
  }
  
  // Get initials for Avatar fallback
  // Attempt to use email/name parts if available, otherwise fallback
  const userNameForInitials = user?.email?.address?.split('@')[0] || user?.wallet?.address;
  const initials = getInitials(userNameForInitials);
  
  const disableLogout = !ready || !authenticated;

  return (
    <header className="border-b bg-background z-10 sticky top-0">
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
        <div className="ml-auto flex items-center space-x-2 md:space-x-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search..."
              className="rounded-md border border-input bg-background px-3 py-2 pl-8 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:w-[200px] lg:w-[300px]"
            />
          </div>
       
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full"
                disabled={!ready}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className={cn(!authenticated && "bg-muted")}>
                    {ready && authenticated ? initials : <User className="h-4 w-4"/>}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              {authenticated && userIdentifier ? (
                <>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">My Account</p>
                      <div className="flex items-center text-xs text-muted-foreground pt-1">
                        {identifierType === 'email' && <Mail className="mr-2 h-3 w-3"/>}
                        {identifierType === 'wallet' && <Wallet className="mr-2 h-3 w-3"/>}
                        <span className="truncate">{userIdentifier}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={logout} 
                    disabled={disableLogout}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuLabel>Not Signed In</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}