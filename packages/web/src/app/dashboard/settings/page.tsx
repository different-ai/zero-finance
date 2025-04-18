import React from 'react'
import { CompanyProfileContainer } from '@/components/company/company-profile-container'
import { SafeManagementCard } from './components/safe-management-card'
import { FundingSourceDisplay } from './components/funding-source-display'
import { AddFundingSourceForm } from '../(bank)/components/add-funding-source-form'

export const metadata = {
  title: 'Settings | hyprsqrl',
  description: 'Configure your payment, company, and wallet settings',
}

export default function SettingsPage() {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold" data-text="Settings">Settings</h1>
        <p className="text-secondary mt-2">Configure your payment methods, company profiles, and wallet connections</p>
      </div>
      

      
      {/* Company Profiles Section */}
      <div className="mb-8">
          <CompanyProfileContainer />
      </div>

      {/* Funding Sources Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Funding Sources</h2>
        <div className="space-y-6">
           {/* Display Existing Sources */}
           <FundingSourceDisplay />
           {/* Form to Add New Source */}
        </div>
      </div>

      <SafeManagementCard />

    </div>
  )
}
