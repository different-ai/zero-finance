'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { DemoModeSidebar } from './demo-mode-sidebar';
import { useDemoMode } from '@/context/demo-mode-context';

const DEMO_MODE_KEY = 'zero-finance-demo-mode';
const DEMO_STEP_KEY = 'zero-finance-demo-step';

export function DemoModeWrapper() {
  const searchParams = useSearchParams();
  const { isDemoMode, setDemoMode } = useDemoMode();

  useEffect(() => {
    // Check URL parameters
    const demoParam = searchParams.get('demo');

    if (demoParam === 'true') {
      // Enable demo mode
      setDemoMode(true);
    } else if (demoParam === 'false') {
      // Explicitly disable demo mode and clear localStorage
      setDemoMode(false);
      localStorage.removeItem(DEMO_MODE_KEY);
      localStorage.removeItem(DEMO_STEP_KEY);
    }
    // If no URL parameter, rely on context's localStorage check
  }, [searchParams, setDemoMode]);

  // Only render the demo sidebar if demo mode is enabled
  if (!isDemoMode) {
    return null;
  }

  return <DemoModeSidebar />;
}
