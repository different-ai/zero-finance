'use client'

import React from 'react';
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#f8faff]">
      <div className="hidden md:block md:w-64">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1">
        {/* <Header /> */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
            <div className="max-w-5xl mx-auto">
              <div className="lg:col-span-2 space-y-6">
                {children}
              </div>
          </div>
        </main>
      </div>
    </div>
  );
}