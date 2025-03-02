import React from 'react'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Request Invoice App</h1>
      <p className="text-lg mb-8">
        Create, manage, and pay invoices using Request Network
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/dashboard/invoices" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg"
        >
          View Your Invoices
        </Link>
        <Link 
          href="/create-invoice" 
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg"
        >
          Create New Invoice
        </Link>
      </div>
      
      <p className="text-sm text-gray-600 mt-12">
        To view a specific invoice, go to: /invoice/[requestId]?token=[token]
      </p>
    </main>
  )
}
