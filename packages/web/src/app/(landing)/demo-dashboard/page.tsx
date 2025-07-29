"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import Image from "next/image"
import { FundsDisplay } from './components/dashboard/funds-display'
import { TransactionTabs } from './components/dashboard/transaction-tabs'
import { OnboardingTasksCard } from './components/dashboard/onboarding-tasks-card'
import { QuickActions } from './components/dashboard/quick-actions'
import { FXOpportunities } from './components/dashboard/fx-opportunities'


export default function DemoDashboard() {
  const [notificationCount, setNotificationCount] = useState(2)
  const [totalBalance, setTotalBalance] = useState(264267.57)
  const [showActionModal, setShowActionModal] = useState<string | null>(null)
  
  const handleActionClick = (action: string) => {
    setShowActionModal(action)
    // In a real app, this would open the appropriate modal/flow
    console.log('Action clicked:', action)
  }
  
  const handleSendPayment = () => {
    // In demo, just show a notification
    setNotificationCount(prev => prev + 1)
    setTotalBalance(prev => prev - 50000)
  }
  
  const handleConvert = () => {
    // In demo, just show a notification
    setNotificationCount(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Image
                src="/new-logo-bluer.png"
                alt="0.finance"
                width={40}
                height={40}
                className="mr-3"
              />
              <span className="text-xl font-semibold text-gray-900">0.finance Demo</span>
              <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">Sandbox Mode</span>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button 
                className="relative p-2 text-gray-600 hover:text-gray-900"
                onClick={() => setNotificationCount(0)}
              >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>
              
              {/* User Menu */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  S
                </div>
                <span className="text-sm font-medium text-gray-700">Sarah Chen</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Funds Display */}
        <FundsDisplay 
          totalBalance={totalBalance}
          walletAddress="0x7f3e8b92c4d6e1a5f9b3c8d2e4a6b8c1d3e5f7a9"
          onSendPayment={handleSendPayment}
          onConvert={handleConvert}
        />
        
        {/* Onboarding Tasks */}
        <OnboardingTasksCard />
        
        {/* Quick Actions & FX Rates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <QuickActions onActionClick={handleActionClick} />
          </div>
          <div>
            <FXOpportunities onConvert={(from, to) => {
              handleActionClick('convert');
              console.log(`Convert ${from} to ${to}`);
            }} />
          </div>
        </div>
        
        {/* Transaction Tabs */}
        <TransactionTabs />
      </main>
    </div>
  )
}