import React from 'react'
import { InvoiceListContainer } from '@/components/invoice/invoice-list-container'

export const metadata = {
  title: 'Your Invoices | hyprsqrl',
  description: 'View all your created invoices',
}

export default function InvoicesPage() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Your Invoices</h1>
        <p className="text-gray-500 mt-2">Manage and track all your crypto invoices in one place</p>
      </div>
      <div>
        <InvoiceListContainer />
      </div>
    </div>
  )
}