'use client';

import posthog from 'posthog-js';
import { PostHogProvider as Provider } from 'posthog-js/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

if (typeof window !== 'undefined') {
  posthog.init('phc_HxAOuIz9mTAqksVrWCEH5eJmRCZf4Ehd4TINbivkvoI', {
    api_host: 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: false, // We'll handle this manually
  });
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname;
      if (searchParams?.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      // Capture pageview
      posthog.capture('$pageview', {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return <Provider client={posthog}>{children}</Provider>;
} 