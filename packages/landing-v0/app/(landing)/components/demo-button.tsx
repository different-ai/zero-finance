'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import posthog from 'posthog-js';

export function DemoButton() {
  const handleClick = () => {
    posthog.capture('demo_button_click', {
      location: 'hero_section',
      source: 'landing_page'
    });
  };

  return (
    <Link
      href="https://cal.com/team/different-ai/discovery-call"
      className="inline-block"
      onClick={handleClick}
    >
      <Button size="lg" className="bg-[#6E45FE] hover:bg-[#5835DB]">
        Schedule a Demo
      </Button>
    </Link>
  );
} 