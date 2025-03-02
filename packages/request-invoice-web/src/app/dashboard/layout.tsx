import React from 'react'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              InvoiceApp
            </Link>
            <nav className="hidden md:flex space-x-4">
              <Link
                href="/dashboard/invoices"
                className="px-3 py-2 text-gray-700 hover:text-gray-900"
              >
                Invoices
              </Link>
              <Link
                href="/dashboard/settings"
                className="px-3 py-2 text-gray-700 hover:text-gray-900"
              >
                Settings
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/create-invoice"
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Create Invoice
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
    </div>
  )
}