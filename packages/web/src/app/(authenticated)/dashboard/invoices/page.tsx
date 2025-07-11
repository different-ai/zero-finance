import React from 'react'
import { InvoiceListContainer } from '@/components/invoice/invoice-list-container'

export const metadata = {
  title: 'Your Invoices | zero finance',
  description: 'View all your created invoices',
}

export default function InvoicesPage() {
  return (
    <div className="w-full px-6">
      <div className="mb-4 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Your Invoices</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2">Manage and track all your crypto invoices in one place</p>
      </div>
      <div className="overflow-x-auto">
        <InvoiceListContainer />
      </div>
    </div>
  )
}