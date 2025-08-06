import React from 'react'
import { InvoicesClientPage } from './invoices-client-page'

export const metadata = {
  title: 'Your Invoices | zero finance',
  description: 'View all your created invoices',
}

export default function InvoicesPage() {
  return <InvoicesClientPage />
}