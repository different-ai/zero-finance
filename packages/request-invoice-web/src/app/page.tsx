import React from 'react'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Request Invoice Viewer</h1>
      <p className="text-lg mb-4">
        View and pay invoices using Request Network
      </p>
      <p className="text-sm text-gray-600">
        Add a request ID to the URL to view an invoice: /invoice/[requestId]
      </p>
    </main>
  )
}
