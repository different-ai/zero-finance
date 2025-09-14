import DemoPageWrapper from './demo-page-wrapper';

// Force dynamic rendering to avoid pre-rendering issues with useSearchParams
export const dynamic = 'force-dynamic';

export default function DashboardDemoPage() {
  return <DemoPageWrapper />;
}
