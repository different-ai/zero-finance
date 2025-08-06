'use client'

import React from 'react'
import { InvoiceListContainer } from '@/components/invoice/invoice-list-container'

export function InvoicesClientPage() {
  return (
    <div className="w-full px-6">
      <div className="mb-4 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Invoices</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2">Manage all your invoices</p>
      </div>
      
      <div className="overflow-x-auto">
        <InvoiceListContainer />
      </div>
    </div>
  )
}