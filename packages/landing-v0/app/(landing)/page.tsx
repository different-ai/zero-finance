import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { Demo } from './demo/demo';
import { BiosContainer } from './components/bios-container';

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
    <>
      <BiosContainer />

      {/* Gradient transition */}
      <div
        style={{
          height: '80px',
          background: 'linear-gradient(to bottom, #aaaaaa, #ffffff)',
          width: '100%',
        }}
      ></div>

      {/* Demo Component Section - Modern Sleek Design */}
      <div
        className="full-width-demo"
        style={{
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '40px 20px',
          backgroundColor: '#fff',
          boxShadow: '0 0 30px rgba(0, 0, 0, 0.05)',
        }}
      >
        <h2
          style={{
            fontSize: '36px',
            color: '#333',
            textAlign: 'center',
            marginBottom: '40px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            position: 'relative',
            padding: '0 0 15px',
          }}
        >
          <span
            style={{
              color: '#0000AA',
              position: 'relative',
            }}
          >
            AI Banking Dashboard
            <div
              style={{
                position: 'absolute',
                height: '3px',
                width: '60%',
                background: 'linear-gradient(to right, #0000AA, transparent)',
                bottom: '-10px',
                left: '20%',
              }}
            ></div>
          </span>
        </h2>

        <div
          style={{
            width: '100%',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
          }}
        >
          <a
            href={demoFullViewUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'block', width: '100%' }}
          >
            <div style={{ width: '100%' }}>
              <Demo />
            </div>
          </a>
        </div>

        <p
          style={{
            textAlign: 'center',
            margin: '20px 0 0',
            color: '#666',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
          }}
        >
          Automated treasury management, crypto wallets, and AI agents - all in one dashboard
        </p>
      </div>
    </>
  );
}

export default function RootPage() {
  return (
    <Suspense>
      <MainContent />
      <div className="bios-footer" style={{ 
        backgroundColor: '#0000aa',
        color: 'white',
        textAlign: 'center',
        padding: '8px',
        fontSize: '14px',
        fontFamily: 'monospace',
      }}>
        <div className="copyright">
          © 2025 HYPRSQRL • OPEN SOURCE • CRYPTO BANKING
        </div>
      </div>
    </Suspense>
  );
}
