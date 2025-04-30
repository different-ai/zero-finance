'use client';

import { useState } from 'react';
import { Menu, Bell, ChevronDown, Search, User, LogIn, LogOut, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onMenuClick?: () => void;
  ready: boolean;
  authenticated: boolean;
  login: () => void;
  logout: () => Promise<void>;
}

export function Header({ onMenuClick, ready, authenticated, login, logout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (onMenuClick) {
      onMenuClick();
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const displayName = 'User';
  const shortDisplayName = 'User';
  const shortWalletAddress = '...';

  return (
    <header className="border-b border-gray-100 bg-white py-4">
      <div className="flex items-center justify-between px-6">
        {/* Mobile menu button */}
        <div className="flex items-center md:hidden">
          <button 
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Toggle mobile menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
        
        {/* Search bar */}
        <div className="hidden md:block flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search..."
              className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2 pl-10 pr-4 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-gray-300"
            />
          </div>
        </div>
        
        {/* Right side navigation */}
        <div className="flex items-center gap-4">
         
          {/* Login/Logout Button */}
          {!ready ? (
            <Button variant="outline" size="sm" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </Button>
          ) : authenticated ? (
            <div className="relative group">
              <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-700 truncate max-w-[120px]">
                    {shortDisplayName}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-[120px]">
                    {shortWalletAddress}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400 hidden md:block" />
              </button>
              <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-100 rounded-lg shadow-md py-1 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-150 z-10">
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Dashboard
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={login}>
              <LogIn className="mr-2 h-4 w-4" /> Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
} 