"use client";

import React, { type FC, type PropsWithChildren, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, RefreshCw, Plus, Menu, Home, Wallet, Settings, Bell } from "lucide-react";

interface BrowserWindowProps extends PropsWithChildren {
  // Add any additional props here
}

export const BrowserWindow: FC<BrowserWindowProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  if (isMobile) {
    // Mobile App UI
    return (
      <div className="rounded-lg overflow-hidden bg-white w-full max-w-[95%] mx-auto mobile-app-container">
        {/* Mobile status bar */}
        <div className="p-1 bg-[#f5f5f7] border-b border-gray-200 flex justify-between items-center px-4 rounded-t-lg">
          <div className="text-xs font-medium text-gray-700">9:41</div>
          <div className="flex items-center space-x-1">
            <div className="h-2.5 w-2.5">
              <svg viewBox="0 0 100 100" className="text-gray-700">
                <path fill="currentColor" d="M20,80 L80,80 C90,80 100,70 100,60 L100,40 C100,30 90,20 80,20 L20,20 C10,20 0,30 0,40 L0,60 C0,70 10,80 20,80 Z" fillOpacity="0.3"/>
                <path fill="currentColor" d="M20,80 L80,80 C90,80 100,70 100,60 L100,40 C100,30 90,20 80,20 L20,20 C10,20 0,30 0,40 L0,60 C0,70 10,80 20,80 Z" clipPath="url(#battery-level)" fillOpacity="0.9"/>
                <clipPath id="battery-level">
                  <rect x="0" y="20" width="60" height="60"/>
                </clipPath>
              </svg>
            </div>
            <div className="h-2.5 w-2.5">
              <svg viewBox="0 0 24 24" className="text-gray-700">
                <path fill="currentColor" d="M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21" opacity="0.8" />
                <path fill="currentColor" d="M12,9C10.35,9 9,10.35 9,12C9,13.65 10.35,15 12,15C13.65,15 15,13.65 15,12C15,10.35 13.65,9 12,9Z" opacity="0.8" />
                <path fill="currentColor" d="M21,9L18.5,10.5C17.8,8.7 16.35,7.25 14.55,6.55L16.05,4.05C18.25,5 20,6.75 21,9M16.7,18.8L14,17.3C15.05,16.25 15.8,14.9 16.1,13.4L18.6,14.9C18.1,16.4 17.5,17.7 16.7,18.8M4.75,3.05L6.25,5.55C4.45,6.25 3,7.7 2.3,9.5L0,8C1,5.65 2.7,4 4.75,3.05M2.4,15L4.95,13.5C5.2,14.95 5.95,16.3 7.05,17.35L5.55,19.85C4.3,18.65 3.3,17 2.4,15Z" opacity="0.6" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* App header */}
        <div className="p-3 flex justify-between items-center bg-white border-b border-gray-100">
          <div className="flex items-center">
            <img src="/hsql.png" alt="hyprsqrl" className="h-6 w-6 mr-2" />
            <span className="font-medium text-gray-900">hyprsqrl</span>
          </div>
          <Button variant="ghost" size="icon" className="text-gray-600">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Main content */}
        <div className="overflow-y-auto overflow-x-hidden max-h-[70vh]">
          {children}
        </div>
        
        {/* Bottom tab bar */}
        <div className="flex items-center justify-around p-3 bg-white border-t border-gray-200 rounded-b-lg">
          <Button variant="ghost" size="icon" className="text-primary">
            <Home className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500">
            <Wallet className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500">
            <Settings className="h-6 w-6" />
          </Button>
        </div>
      </div>
    );
  }

  // Desktop Browser UI
  return (
    <div className="rounded-lg overflow-hidden shadow-xl border border-primary/30 bg-white max-w-[95%] mx-auto">
      <div className="p-2 flex items-center bg-[#f5f5f7] border-b border-gray-200">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-grow flex items-center space-x-2 px-2">
          <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-800">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-800">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-800">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <div className="flex-1 mx-2">
            <div className="bg-white text-gray-700 text-xs py-1.5 px-3 rounded-md text-center border border-gray-200">
              app.hyprsqrl.com
            </div>
          </div>
        </div>
      </div>
      <div className="flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-16 flex flex-col items-center py-4 space-y-4 bg-[#f5f5f7] border-r border-gray-200">
          <Button variant="ghost" size="icon" className="rounded-full text-gray-600 hover:text-gray-800">
            <Menu className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-primary/20 text-primary"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
        {/* Main content */}
        <div className="flex-1 text-gray-800 overflow-y-auto overflow-x-hidden max-h-[70vh]">{children}</div>
      </div>
    </div>
  );
};
