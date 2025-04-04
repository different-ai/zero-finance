import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { Demo } from './demo/demo';

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
  
  // Simple demo view URL (this would be a static page route)
  const demoFullViewUrl = '/demo-view';

  return (
    <div className="bios-container">
      <div className="bios-header">HYPRSQRL AI BANKING</div>
      
      <div className="bios-nav">
        <div className="bios-nav-item active">Main</div>
      </div>
      
      <div className="bios-content">
        <div className="bios-box">
          <h1 className="main-title">We're building a bank connected to AI agents</h1>
          
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
          <div className="demo-title">
            <div className="graduation-cap">🎓</div>
            <h2>AI Banking Dashboard Preview</h2>
          </div>
          <div className="demo-preview">
            <div className="demo-screenshot">
              <a href={demoFullViewUrl} className="demo-link" target="_blank" rel="noopener noreferrer">
                <div className="demo-wrapper full-width">
                  <div className="original-styling-context">
                    <Demo />
                  </div>
                </div>
              </a>
            </div>
            <p className="demo-note">
              This dashboard will be part of the final product. Click to view in full screen.
            </p>
          </div>
        </div>
        
        <div className="bios-box">
          <h2 className="latest-updates-title">Latest Updates - Available Modules:</h2>
          
          <ul className="modules-list">
            <li>
              <div className="module-date">APRIL 3, 2024</div>
              <div className="module-info">
                <span className="module-name">AI Yield Finder:</span>{' '}
                <Link href={yieldAppLink} className="module-link">
                  AI chat to find the best yield opportunities
                </Link>
              </div>
            </li>
            <li>
              <div className="module-date">MARCH 15, 2024</div>
              <div className="module-info">
                <span className="module-name">Crypto Invoicing:</span>{' '}
                <Link href={invoiceAppLink} className="module-link">
                  Send invoices and get paid in crypto
                </Link>
              </div>
            </li>
            <li className="deprecated-module">
              <div className="module-date">ARCHIVED</div>
              <div className="module-info">
                <span className="module-name">
                  <s>Screen Monitoring App:</s>
                </span>{' '}
                <span className="deprecated-note">(Discontinued) Electron app that watched your screen to create invoices</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="bios-footer">
        <div className="copyright">
          © 2025 HYPRSQRL • OPEN SOURCE • CRYPTO BANKING
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
