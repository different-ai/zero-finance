import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { Demo as DynamicDemo } from './demo/demo';


export const metadata: Metadata = {
  title: 'hyprsqrl - AI Banking',
  description:
    'Building an AI-connected bank to automate the financial stack for crypto freelancers.',
  openGraph: {
    title: 'hyprsqrl - AI Banking',
    description:
      'Building an AI-connected bank to automate the financial stack for crypto freelancers.',
  },
};

function MainContent() {
  const yieldAppLink =
    process.env.NODE_ENV === 'production'
      ? 'https://y.hyprsqrl.com'
      : 'http://localhost:3060';
  const invoiceAppLink =
    process.env.NODE_ENV === 'production'
      ? 'https://i.hyprsqrl.com'
      : 'http://localhost:3050';

  return (
    <div className="bios-container">
      <div className="bios-header">HYPRSQRL AI BANKING SETUP</div>
      
      <div className="bios-nav">
        <div className="bios-nav-item active">Main</div>
        <div className="bios-nav-item">Advanced</div>
        <div className="bios-nav-item">Modules</div>
        <div className="bios-nav-item">Security</div>
        <div className="bios-nav-item">Exit</div>
      </div>
      
      <div className="bios-content">
        <div className="bios-box">
          <h1>AI Banking Configuration</h1>
          
          <p>
            We're building a bank connected to AI agents, but it's going to take a
            bit longer.
          </p>
          
          <p>
            Our goal is to automate the entire financial stack from creating
            invoices to allocating funds, all while staying compliant.
          </p>
          
          <p>
            We're built on crypto rails, and if you're a crypto freelancer, you'll
            be one of the first to benefit from it.
          </p>
        </div>

        {/* Demo Component Section */}
        <div className="bios-box">
          <h2>Final Product Preview:</h2>
          <div className="demo-preview">
            <p>Dashboard visualization (work in progress):</p>
            <div className="demo-screenshot">
              <div className="demo-wrapper">
                <div className="original-styling-context">
                  <DynamicDemo />
                </div>
              </div>
            </div>
            <p className="demo-note">
              Note: This dashboard will be part of the final product. 
              Currently available as separate modules below.
            </p>
          </div>
        </div>
        
        <h2>Available Modules:</h2>
        
        <ul>
          <li>
            AI chat to find yield opportunities:{' '}
            <Link href={yieldAppLink}>
              Yield App (launched Apr 3rd)
            </Link>
          </li>
          <li>
            Invoicing app:{' '}
            <Link href={invoiceAppLink}>
              Invoice App (launched Mar 15th)
            </Link>
          </li>
          <li>
            <s>
              An electron app that watches your screen and creates invoices.
            </s>{' '}
            (now defunct)
          </li>
        </ul>
      </div>
      
      <div className="bios-footer">
        <div className="bios-footer-item">
          <span className="bios-key">↵</span> Select Module
        </div>
        <div className="bios-footer-item">
          <span className="bios-key">ESC</span> Exit
        </div>
      </div>
    </div>
  );
}

export default function RootPage() {
  return (
    <Suspense>
      <MainContent />
    </Suspense>
  );
}
