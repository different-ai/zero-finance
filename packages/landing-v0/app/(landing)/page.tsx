import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

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

// Separate any components that use useSearchParams
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
    <div>
      <h1>
        We're building a bank connected to AI agents, but it's going to take a
        bit longer.
      </h1>

      <p>
        Our goal is to automate the entire financial stack from creating
        invoices to allocating funds, all while staying compliant.
      </p>

      <p>
        We're built on crypto rails, and if you're a crypto freelancer, you'll
        be one of the first to benefit from it.
      </p>

      <h2>
        In the meantime, we published a couple of prototypes that will
        eventually be integrated into the bank:
      </h2>

      <ul>
        <li>
          <span>AI chat to find yield opportunities:</span>{' '}
          <Link href={yieldAppLink}>
            Yield App (launched Apr 3rd)
          </Link>
        </li>
        <li>
          <span>Invoicing app:</span>{' '}
          <Link href={invoiceAppLink}>
            Invoice App (launched Mar 15th)
          </Link>
        </li>
        <li>
          <span>
            <s>
              An electron app that watches your screen and creates invoices.
            </s>
          </span>{' '}
          <span>(now defunct)</span>
        </li>
      </ul>
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
