import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'hyprsqrl - BIOS Mode',
  description:
    'Building an AI-connected bank to automate the financial stack for crypto freelancers.',
  openGraph: {
    title: 'hyprsqrl - BIOS Mode',
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
      <div className="bios-header">HYPRSQRL SYSTEM CONFIGURATION</div>
      
      <div>
        <h1>SYSTEM STATUS: UNDER DEVELOPMENT</h1>
        
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
      
      <h2>AVAILABLE MODULES:</h2>
      
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
      
      <div className="bios-footer">
        PRESS ANY MODULE LINK TO CONTINUE
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
