import React from 'react';
import { InvoiceCreationContainer } from '@/components/invoice/invoice-creation-container';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Create Invoice',
  description: 'Create an invoice using Request Network',
};

export default async function CreateInvoicePage() {
  const { userId } = await auth();
  
  // If the user is not authenticated, redirect to the homepage
  if (!userId) {
    redirect("/");
  }
  
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Create New Invoice</h1>
      <InvoiceCreationContainer />
    </main>
  );
}