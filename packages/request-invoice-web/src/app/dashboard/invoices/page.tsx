import React from 'react'
import { InvoiceListContainer } from '@/components/invoice/invoice-list-container'

export const metadata = {
  title: 'Your Invoices | hyprsqrl',
  description: 'View all your created invoices',
}

export default function InvoicesPage() {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold gradient-text" data-text="Your Invoices">Your Invoices</h1>
        <p className="text-secondary mt-2">Manage all your invoices in one place</p>
      </div>
      <div className="digital-card bg-white p-6">
        <InvoiceListContainer />
      </div>
    </div>
  )
}