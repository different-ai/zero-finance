import React from 'react'
import { PaymentConfigContainer } from '@/components/payment/payment-config-container'

export const metadata = {
  title: 'Payment Settings',
  description: 'Configure your payment and wallet settings',
}

export default function SettingsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Payment Settings</h1>
      <PaymentConfigContainer />
    </main>
  )
}