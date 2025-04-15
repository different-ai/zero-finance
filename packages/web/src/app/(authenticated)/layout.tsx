import React from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header'; // Import Header as well

export default function AuthenticatedLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 border-r border-gray-200 flex-shrink-0 h-full overflow-y-auto">
        <Sidebar />
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header /> 
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 