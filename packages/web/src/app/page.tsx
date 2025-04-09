'use client';

import React from 'react'
import Link from 'next/link'
// import Image from 'next/image' // Removed unused import
import { usePrivy } from '@privy-io/react-auth'
// Import Button component if available, otherwise use standard buttons
// Assuming Button component exists in '@hypr/shared' or similar
// import { Button } from '@/components/ui/button'; // Example import

export default function Home() {
  const { authenticated, login } = usePrivy();
  return (
    // Reduced top/bottom margin slightly, kept max-width and centering
    <section className="text-center my-16 md:my-24 relative max-w-5xl mx-auto px-4"> 
      <div className="flex flex-col items-center mb-12"> {/* Increased bottom margin */}
        <h1 className="text-4xl md:text-6xl font-bold mb-6" data-text="Get Paid in Crypto, Simply."> {/* Adjusted margin */}
          Get Paid in Crypto, Simply.
        </h1>
        {/* Use text-muted-foreground or similar for less emphasis */}
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"> {/* Adjusted size, color, margin, width */}
          The easiest way to create, manage, and pay invoices using cryptocurrency
        </p>
      </div>
      
      {/* Replaced nostalgic container with a simpler card style */}
      <div className="bg-card border rounded-lg shadow-sm p-8 mb-16 max-w-xl mx-auto"> {/* Centered and sized card */}
        {/* Removed absolute positioned div */}
        <div className="flex flex-col items-center">

          {/* Adjusted heading style */}
          <h2 className="text-2xl font-semibold text-card-foreground mb-8">Create crypto invoices in seconds</h2>
          
          <div className="flex flex-col sm:flex-row gap-4"> {/* Adjusted gap */}
            {authenticated ? (
              <>
                {/* Using standard Link with button styling (replace with actual Button if exists) */}
                <Link 
                  href="/dashboard/invoices" 
                  // Example using primary button style - replace with actual component/classes
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2" 
                >
                  Dashboard
                </Link>
                <Link 
                  href="/create-invoice" 
                  // Example using secondary/outline button style - replace with actual component/classes
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                >
                  Create Invoice
                </Link>
              </>
            ) : (
              <>
                {/* Using standard button styling (replace with actual Button if exists) */}
                <button 
                  onClick={() => login()}
                   // Example using primary button style - replace with actual component/classes
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => login()}
                   // Example using secondary/outline button style - replace with actual component/classes
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Replaced framed-content/nostalgic-container with standard border/padding */}
      <div className="border rounded-lg p-6 mt-16 max-w-2xl mx-auto text-left bg-card"> {/* Increased width, added background */}
        <h3 className="font-semibold text-xl mb-4 text-card-foreground">Key Features</h3> {/* Adjusted margin/color */}
        <ul className="space-y-3">
          {/* Simplified list items, removed custom checkmark background */}
          <li className="flex items-start gap-3"> {/* Increased gap */}
            <span className="text-primary text-lg mt-0.5">✓</span> {/* Standard checkmark */}
            <span className="text-muted-foreground">Generate professional crypto invoices in seconds</span> {/* Muted color */}
          </li>
          <li className="flex items-start gap-3"> {/* Increased gap */}
           <span className="text-primary text-lg mt-0.5">✓</span> {/* Standard checkmark */}
            <span className="text-muted-foreground">Secure, decentralized payment processing</span> {/* Muted color */}
          </li>
          <li className="flex items-start gap-3"> {/* Increased gap */}
            <span className="text-primary text-lg mt-0.5">✓</span> {/* Standard checkmark */}
            <span className="text-muted-foreground">AI-assisted invoice creation and management</span> {/* Muted color */}
          </li>
        </ul>
      </div>
      
      {/* Removed section divider */}
      {/* <div className="section-divider my-10"></div> */}
      
      {/* Added margin top */}
      <p className="text-sm text-muted-foreground mt-12"> {/* Adjusted margin/color */}
        Powered by Request Network • All transactions secured on-chain
      </p>
    </section>
  )
}
