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
    <div className="max-w-prose mx-auto py-16 px-4 text-center text-gray-700">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        We're building a bank connected to AI agents, but it's going to take a
        bit longer.
      </h1>

      <p className="mb-4">
        Our goal is to automate the entire financial stack from creating
        invoices to allocating funds, all while staying compliant.
      </p>

      <p className="mb-8">
        We're built on crypto rails, and if you're a crypto freelancer, you'll
        be one of the first to benefit from it.
      </p>

      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        In the meantime, we published a couple of prototypes that will
        eventually be integrated into the bank:
      </h2>

      <ul className="list-none space-y-3 text-left inline-block mx-auto">
        <li>
          <span className="font-medium">AI chat to find yield opportunities:</span>{' '}
          <Link href={yieldAppLink} className="text-blue-600 hover:underline">
            Yield App (launched Apr 3rd)
          </Link>
        </li>
        <li>
          <span className="font-medium">Invoicing app:</span>{' '}
          <Link href={invoiceAppLink} className="text-blue-600 hover:underline">
            Invoice App (launched Mar 15th)
          </Link>
        </li>
        <li>
          <span className="font-medium">
            <s>
              An electron app that watches your screen and creates invoices.
            </s>
          </span>{' '}
          <span className="text-sm text-gray-500">(now defunct)</span>
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
