import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { auth } from '@clerk/nextjs/server'

export default async function Home() {
  const { userId } = await auth();
  return (
    <section className="text-center my-12 md:my-20 relative max-w-5xl mx-auto">
      <div className="flex flex-col items-center mb-10">
        <h1 className="text-4xl md:text-6xl font-bold  mb-8" data-text="Get Paid in Crypto, Simply.">
          Get Paid in Crypto, Simply.
        </h1>
        <p className="text-xl md:text-2xl text-secondary mb-12 max-w-3xl mx-auto">
          The easiest way to create, manage, and pay invoices using cryptocurrency
        </p>
      </div>
      
      <div className="overflow-hidden relative z-10 bg-white shadow-xl p-8 mb-16">
        <div className="absolute inset-0 pointer-events-none z-20 digital-effect hidden md:block"></div>
        <div className="flex flex-col items-center">

          <h2 className="text-2xl font-bold text-primary mb-8">Create crypto invoices in seconds</h2>
          
          <div className="flex flex-col sm:flex-row gap-6">
            {userId ? (
              <>
                <Link 
                  href="/dashboard/invoices" 
                  className="nostalgic-button px-8 py-3 text-white font-medium text-lg"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/create-invoice" 
                  className="nostalgic-button-secondary px-8 py-3 font-medium text-lg"
                >
                  Create Invoice
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href={process.env.NODE_ENV === 'production' ? 'https://invoices.hyprsqrl.com' : 'http://localhost:3050'}
                  className="nostalgic-button px-8 py-3 text-white font-medium text-lg"
                >
                  Go to App
                </Link>
                <Link 
                  href="/sign-up" 
                  className="nostalgic-button-secondary px-8 py-3 font-medium text-lg"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="framed-content p-6 nostalgic-container mt-12 max-w-lg mx-auto text-left">
        <h3 className="font-semibold text-xl mb-3 text-primary">Key Features</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <div className="w-6 h-6 bg-primary/10 flex-shrink-0 flex items-center justify-center mt-0.5 rounded-full">
              <span className="text-primary text-lg">✓</span>
            </div>
            <span className="text-secondary">Generate professional crypto invoices in seconds</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-6 h-6 bg-primary/10 flex-shrink-0 flex items-center justify-center mt-0.5 rounded-full">
              <span className="text-primary text-lg">✓</span>
            </div>
            <span className="text-secondary">Secure, decentralized payment processing</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-6 h-6 bg-primary/10 flex-shrink-0 flex items-center justify-center mt-0.5 rounded-full">
              <span className="text-primary text-lg">✓</span>
            </div>
            <span className="text-secondary">AI-assisted invoice creation and management</span>
          </li>
        </ul>
      </div>
      
      <div className="section-divider my-10"></div>
      
      <p className="text-sm text-secondary">
        Powered by Request Network • All transactions secured on-chain
      </p>
    </section>
  )
}
