import React from 'react'
import { InvoiceCreationContainer } from '@/components/invoice/invoice-creation-container'

export const metadata = {
  title: 'Create Invoice',
  description: 'Create an invoice using Request Network',
}

export default function CreateInvoicePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Create New Invoice</h1>
      <InvoiceCreationContainer />
    </main>
  )
}