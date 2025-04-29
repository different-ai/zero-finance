
import React from 'react'
import { CompanyProfileContainer } from '@/components/company/company-profile-container'
import { SafeManagementCard } from './components/safe-management-card'
import { FundingSourceDisplay } from './components/funding-source-display'
import { AddressVisibilityToggle } from "@/components/settings/address-visibility-toggle";

export const metadata = {
  title: 'Settings',
  description: 'Configure your payment methods, company profiles, and wallet connections'
}

export default function SettingsPage() {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold" data-text="Settings">Settings</h1>
        <p className="text-secondary mt-2">Configure your payment methods, company profiles, and wallet connections</p>
      </div>
      
      {/* Privacy Settings Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Privacy Settings</h2>
        <AddressVisibilityToggle />
      </div>

      {/* Company Profiles Section */}
      <div className="mb-8">
        <CompanyProfileContainer />
      </div>

      {/* Funding Sources Section */}
      <div className="mb-8">
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
