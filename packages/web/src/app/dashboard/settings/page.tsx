import React from 'react'
import { PaymentConfigContainer } from '@/components/payment/payment-config-container'

export const metadata = {
  title: 'Payment Settings | hyprsqrl',
  description: 'Configure your payment and wallet settings',
}

export default function SettingsPage() {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold " data-text="Payment Settings">Payment Settings</h1>
        <p className="text-secondary mt-2">Configure your payment methods and wallet connections</p>
      </div>
      <div className="digital-card bg-white p-6">
        <PaymentConfigContainer />
      </div>
    </div>
  )
}