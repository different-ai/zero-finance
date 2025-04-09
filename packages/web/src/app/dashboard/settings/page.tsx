import React from 'react'
import { PaymentConfigContainer } from '@/components/payment/payment-config-container'
import { CompanyProfileContainer } from '@/components/company/company-profile-container'
import { AddFundingSourceForm } from './components/add-funding-source-form'
import { FundingSourceDisplay } from './components/funding-source-display'

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
      
      {/* Payment Settings Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Payment Settings</h2>
        <div className="digital-card bg-white p-6">
          <PaymentConfigContainer />
        </div>
      </div>
      
      {/* Company Profiles Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Company Profiles</h2>
        <div className="digital-card bg-white p-6">
          <CompanyProfileContainer />
        </div>
      </div>

      {/* Funding Sources Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Funding Sources</h2>
        <div className="space-y-6">
           {/* Display Existing Sources */}
           <FundingSourceDisplay />
           {/* Form to Add New Source */}
           <AddFundingSourceForm />
        </div>
      </div>

    </div>
  )
}
