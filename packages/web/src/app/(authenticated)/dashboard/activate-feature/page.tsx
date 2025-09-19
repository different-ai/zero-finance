'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle, 
  Loader2, 
  AlertCircle, 
  Sparkles, 
  Mail,
  ArrowRight,
  Shield,
  Key
} from 'lucide-react';
import { trpc } from '@/utils/trpc';

export default function ActivateFeaturePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = usePrivy();
  const [activationStatus, setActivationStatus] = useState<'auth_required' | 'loading' | 'success' | 'error'>('auth_required');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [adminToken, setAdminToken] = useState<string>('');

  // Get parameters from URL
  const feature = searchParams.get('feature') || 'workspace_automation';
  const source = searchParams.get('source') || 'polar';
  const reference = searchParams.get('reference');

  const grantFeatureMutation = trpc.admin.grantFeature.useMutation({
    onSuccess: () => {
      setActivationStatus('success');
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    },
    onError: (error: any) => {
      setActivationStatus('error');
      setErrorMessage(error.message || 'Failed to activate feature');
    },
  });

  const handleActivateFeature = () => {
    if (!user?.id || !adminToken.trim()) {
      setErrorMessage('Admin token is required');
      return;
    }

    setActivationStatus('loading');
    setErrorMessage('');

    grantFeatureMutation.mutate({
      adminToken: adminToken.trim(),
      userPrivyDid: user.id,
      featureName: feature as any,
      purchaseSource: source as any,
      purchaseReference: reference || undefined,
    });
  };

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-green-100/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-100/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-md mx-auto w-full">
        <Card className="shadow-2xl border-0 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              {activationStatus === 'auth_required' && (
                <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <Shield className="h-10 w-10 text-blue-600" />
                </div>
              )}
              {activationStatus === 'loading' && (
                <div className="relative">
                  <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Mail className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              )}
              {activationStatus === 'success' && (
                <div className="relative">
                  <div className="h-16 w-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <div className="absolute -top-1 -right-1">
                    <Sparkles className="h-6 w-6 text-green-500 animate-pulse" />
                  </div>
                </div>
              )}
              {activationStatus === 'error' && (
                <div className="h-16 w-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-10 w-10 text-red-600" />
                </div>
              )}
            </div>

            <CardTitle className="text-2xl font-bold mb-2">
              {activationStatus === 'auth_required' && 'Admin Authentication Required'}
              {activationStatus === 'loading' && 'Activating Feature...'}
              {activationStatus === 'success' && 'Feature Activated!'}
              {activationStatus === 'error' && 'Activation Failed'}
            </CardTitle>

            <CardDescription>
              {activationStatus === 'auth_required' && 'Please enter your admin token to activate this feature.'}
              {activationStatus === 'loading' && 'Please wait while we set up your new feature access.'}
              {activationStatus === 'success' && 'Workspace automations are now active for your account.'}
              {activationStatus === 'error' && 'There was an issue activating your feature. Please try again or contact support.'}
            </CardDescription>
          </CardHeader>

          <CardContent className="text-center">
            {activationStatus === 'auth_required' && (
              <div className="space-y-6">
                <div className="space-y-4 text-left">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Key className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Admin Access Required</span>
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Feature activation requires admin privileges. Please enter your admin token to continue.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="adminToken">Admin Token</Label>
                    <Input
                      id="adminToken"
                      type="password"
                      placeholder="Enter admin token"
                      value={adminToken}
                      onChange={(e) => setAdminToken(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  {errorMessage && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <p className="text-sm text-red-800 dark:text-red-300">
                        {errorMessage}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleActivateFeature}
                    size="lg"
                    className="w-full bg-black hover:bg-gray-900 text-white"
                    disabled={!adminToken.trim()}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Activate Feature
                  </Button>

                  <Button
                    onClick={handleGoToDashboard}
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {activationStatus === 'loading' && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Processing...
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  This should only take a few seconds
                </p>
              </div>
            )}

            {activationStatus === 'success' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {feature.charAt(0).toUpperCase() + feature.slice(1)} Activated
                  </Badge>
                  
                  {source === 'polar' && (
                    <p className="text-sm text-muted-foreground">
                      Thank you for subscribing! Your feature access is now active.
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleGoToDashboard}
                    size="lg"
                    className="w-full bg-black hover:bg-gray-900 text-white"
                  >
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Open Dashboard
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground">
                  Redirecting to dashboard in 3 seconds...
                </div>
              </div>
            )}

            {activationStatus === 'error' && (
              <div className="space-y-4">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-sm text-red-800 dark:text-red-300">
                    {errorMessage}
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => window.location.reload()}
                    size="lg"
                    className="w-full"
                  >
                    Try Again
                  </Button>

                  <Button
                    onClick={handleGoToDashboard}
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    Back to Dashboard
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground">
                  If the problem persists, please contact our support team.
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
