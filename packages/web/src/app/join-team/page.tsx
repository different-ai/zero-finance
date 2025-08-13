'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, Users, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/trpc/react';

function JoinTeamContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { ready, authenticated, login } = usePrivy();
  const [status, setStatus] = useState<
    'checking' | 'valid' | 'invalid' | 'accepting' | 'success' | 'error'
  >('checking');
  const [inviteDetails, setInviteDetails] = useState<any>(null);

  const acceptInviteMutation = api.workspace.acceptTeamInvite.useMutation({
    onSuccess: () => {
      setStatus('success');
      toast.success('Successfully joined the team!');
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    },
    onError: (error) => {
      setStatus('error');
      toast.error(error.message || 'Failed to accept invite');
    },
  });

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      return;
    }

    // For now, we'll just show the invite is valid
    // In production, you'd want to validate the token first
    setStatus('valid');
    setInviteDetails({
      token,
      workspaceName: 'Team Workspace',
      role: 'member',
    });
  }, [token]);

  const handleAcceptInvite = async () => {
    if (!authenticated) {
      // Store the token and redirect after login
      sessionStorage.setItem('pendingInviteToken', token || '');
      login();
      return;
    }

    if (!token) {
      toast.error('Invalid invite link');
      return;
    }

    setStatus('accepting');
    acceptInviteMutation.mutate({ token });
  };

  // Check for pending invite after login
  useEffect(() => {
    if (authenticated && ready) {
      const pendingToken = sessionStorage.getItem('pendingInviteToken');
      if (pendingToken) {
        sessionStorage.removeItem('pendingInviteToken');
        setStatus('accepting');
        acceptInviteMutation.mutate({ token: pendingToken });
      }
    }
  }, [authenticated, ready, acceptInviteMutation]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Users className="h-12 w-12 text-primary" />
          </div>
          <CardTitle>Team Invitation</CardTitle>
          <CardDescription>
            You&apos;ve been invited to join a team workspace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {status === 'checking' && (
            <div className="flex flex-col items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mb-4" />
              <p className="text-sm text-muted-foreground">
                Validating invite...
              </p>
            </div>
          )}

          {status === 'invalid' && (
            <div className="flex flex-col items-center py-8">
              <XCircle className="h-12 w-12 text-destructive mb-4" />
              <p className="text-center mb-4">
                This invite link is invalid or has expired.
              </p>
              <Button onClick={() => router.push('/')} variant="outline">
                Go to Home
              </Button>
            </div>
          )}

          {status === 'valid' && inviteDetails && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Workspace:
                  </span>
                  <span className="text-sm font-medium">
                    {inviteDetails.workspaceName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Role:</span>
                  <span className="text-sm font-medium capitalize">
                    {inviteDetails.role}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {!authenticated ? (
                  <>
                    <p className="text-sm text-center text-muted-foreground">
                      Sign in to accept this invitation
                    </p>
                    <Button onClick={handleAcceptInvite} className="w-full">
                      Sign In & Accept Invite
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleAcceptInvite} className="w-full">
                    Accept Invitation
                  </Button>
                )}
                <Button
                  onClick={() => router.push('/')}
                  variant="outline"
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {status === 'accepting' && (
            <div className="flex flex-col items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mb-4" />
              <p className="text-sm text-muted-foreground">Joining team...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <p className="text-center mb-2 font-medium">
                Successfully joined the team!
              </p>
              <p className="text-sm text-muted-foreground">
                Redirecting to dashboard...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center py-8">
              <XCircle className="h-12 w-12 text-destructive mb-4" />
              <p className="text-center mb-4">
                Failed to join the team. The invite may have expired or already
                been used.
              </p>
              <div className="space-y-2 w-full">
                <Button
                  onClick={() => router.push('/dashboard')}
                  variant="outline"
                  className="w-full"
                >
                  Go to Dashboard
                </Button>
                <Button
                  onClick={() => router.push('/')}
                  variant="outline"
                  className="w-full"
                >
                  Go to Home
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function JoinTeamPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <JoinTeamContent />
    </Suspense>
  );
}
