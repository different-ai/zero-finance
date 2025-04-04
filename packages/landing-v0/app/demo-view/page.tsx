import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { Demo } from '../(landing)/demo/demo';

export const metadata: Metadata = {
  title: 'hyprsqrl - AI Banking Dashboard',
  description: 'Full-screen preview of the AI Banking dashboard for crypto freelancers.',
};

function DemoViewContent() {
  return (
    <div className="fullscreen-demo-container">
      <div className="fullscreen-header">
        <div className="header-left">
          <span className="graduation-cap">🎓</span>
          <h1>HYPRSQRL AI BANKING DASHBOARD</h1>
        </div>
        <Link href="/" className="back-button">← Return to Main</Link>
      </div>
      
      <div className="fullscreen-demo-wrapper">
        <div className="original-styling-context">
          <Demo />
        </div>
      </div>
      
      <div className="fullscreen-footer">
        <div className="footer-text">
          <p>This interactive preview shows how the hyprsqrl platform will manage your crypto assets across multiple functions:</p>
          <ul className="feature-list">
            <li><strong>Asset Tracking:</strong> View all your crypto in one place with real-time valuations</li>
            <li><strong>Yield Optimization:</strong> AI automatically finds the best yields for your idle crypto</li>
            <li><strong>Business Operations:</strong> Invoicing, payment processing, and expense management</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function DemoViewPage() {
  return (
    <Suspense>
      <DemoViewContent />
    </Suspense>
  );
} 