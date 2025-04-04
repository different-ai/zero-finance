import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { Demo } from '../(landing)/demo/demo';

export const metadata: Metadata = {
  title: 'hyprsqrl - Dashboard Demo',
  description: 'Full-screen demo of the AI Banking dashboard.',
};

function DemoViewContent() {
  return (
    <div className="fullscreen-demo-container">
      <div className="fullscreen-header">
        <h1>HYPRSQRL DASHBOARD DEMO</h1>
        <Link href="/" className="back-button">← Return to Main</Link>
      </div>
      
      <div className="fullscreen-demo-wrapper">
        <div className="original-styling-context">
          <Demo />
        </div>
      </div>
      
      <div className="fullscreen-footer">
        <p>This is a preview of the Hyprsqrl AI Banking dashboard that will be available in the full product.</p>
        <p>The UI shows how your crypto assets will be managed, optimized for yield, and used for business operations automatically.</p>
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