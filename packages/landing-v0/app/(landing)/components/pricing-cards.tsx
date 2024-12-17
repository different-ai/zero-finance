"use client";

import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function PricingCards() {
  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      <Card className="p-8">
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-2">Individual</h3>
          <div className="text-4xl font-bold mb-2">$50</div>
          <p className="text-gray-400">One-time payment, lifetime access</p>
        </div>
        <ul className="space-y-3 mb-8">
          {[
            'Privacy-first screen monitoring',
            'Calendar integration',
            'Obsidian integration',
            'Basic automation rules',
            'Community support',
          ].map((feature, i) => (
            <li key={i} className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Link href="/sign-up">
          <Button className="w-full bg-[#6E45FE] hover:bg-[#5A37E8] text-white">
            Join Waitlist
          </Button>
        </Link>
      </Card>

      <Card className="p-8 border-[#6E45FE]">
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-2">
            Custom Agents for your team
          </h3>
          <div className="text-4xl font-bold mb-2">From $1,000</div>
          <p className="text-gray-400">per month, billed annually</p>
        </div>
        <ul className="space-y-3 mb-8">
          {[
            'All add-ons from Individual',
            'We build custom agents for your team',
            'Works with proprietary tools',
            'Dedicated support team',
          ].map((feature, i) => (
            <li key={i} className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Link href="https://cal.com/team/different-ai/discovery-call">
          <Button className="w-full bg-[#6E45FE] hover:bg-[#5A37E8] text-white">
            Contact Sales
          </Button>
        </Link>
      </Card>
    </div>
  );
}
