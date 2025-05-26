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
  
  // Get email from backend profile
  const { data: profile, isLoading: isProfileLoading } = api.user.getProfile.useQuery();
  
  // Initialize email from either backend profile or Privy user
  const [email, setEmail] = useState('');
  
  // Update email when data is available from either source
  useEffect(() => {
    const backendEmail = profile?.email;
    const privyEmail = user?.email?.address;
    
    // Prefer backend email, fallback to Privy email
    const bestEmail = backendEmail || privyEmail || '';
    
    // Only update if we have a non-empty email or if both sources have been checked
    if (bestEmail || (!isProfileLoading && user)) {
      setEmail(bestEmail);
    }
  }, [profile, user, isProfileLoading]);

  const utils = api.useUtils();
  const updateEmail = api.user.updateEmail.useMutation({
    async onSuccess() {
      // Invalidate cached profile and refetch so state stays fresh
      await utils.user.getProfile.invalidate();
      await utils.user.getProfile.fetch();
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
              disabled={updateEmail.isPending || isProfileLoading}
            >
              {updateEmail.isPending || isProfileLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="mr-2 h-4 w-4" />
              )}
              {updateEmail.isPending || isProfileLoading
                ? 'Saving...'
                : nextStep
                  ? `Continue to ${nextStep.name}`
                  : 'Continue'}
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="text-center mt-4">
        <Button variant="ghost" onClick={() => router.push('/dashboard')}>
          Skip for now
        </Button>
      </div>
    </div>
  );
}
