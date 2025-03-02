import React from 'react'
import { InvoiceListContainer } from '@/components/invoice/invoice-list-container'

export const metadata = {
  title: 'Your Invoices',
  description: 'View all your created invoices',
}

export default function InvoicesPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Invoices</h1>
      <InvoiceListContainer />
    </main>
  )
}