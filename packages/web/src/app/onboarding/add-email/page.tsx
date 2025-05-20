'use client';

import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/trpc/react';
import { steps } from '../layout';
import { ArrowRight, Loader2 } from 'lucide-react';

export default function AddEmailPage() {
  const { user } = usePrivy();
  const router = useRouter();
  const [email, setEmail] = useState(user?.email?.address || '');

  const utils = api.useUtils();
  const updateEmail = api.user.updateEmail.useMutation({
    onSuccess: () => {
      // Invalidate cached profile so other components get fresh data
      utils.user.getProfile.invalidate();
    },
  });

  // Determine next step
  const currentPath = '/onboarding/add-email';
  const currentIndex = steps.findIndex((step) => step.path === currentPath);
  const nextStep =
    currentIndex !== -1 && currentIndex < steps.length - 1
      ? steps[currentIndex + 1]
      : null;



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await updateEmail.mutateAsync({ email });
      if (nextStep) router.push(nextStep.path);
    } catch (err) {
      console.error('Error updating email', err);
    }
  };

  return (
    <div className="">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            Add your email
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-11 border-gray-200"
            />
            <Button
              type="submit"
              className="w-full"
              disabled={updateEmail.isPending}
            >
              {updateEmail.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="mr-2 h-4 w-4" />
              )}
              {updateEmail.isPending
                ? 'Saving...'
                : nextStep
                ? `Continue to ${nextStep.name}`
                : 'Continue'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 