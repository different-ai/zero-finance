'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function NoAccountSetupCard() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Bank Account Setup Required</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-10">
        <p className="text-gray-600 mb-4">
          You need to set up a bank account before proceeding.
        </p>
        <Link href='/dashboard'>Go to dashboard</Link>
      </CardContent>
    </Card>
  );
} 