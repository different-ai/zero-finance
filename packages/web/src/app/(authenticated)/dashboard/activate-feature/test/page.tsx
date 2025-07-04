'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle, 
  Loader2, 
  AlertCircle, 
  Settings,
  User,
  ArrowRight
} from 'lucide-react';
import { trpc } from '@/utils/trpc';

export default function TestActivateFeaturePage() {
  const router = useRouter();
  const { user } = usePrivy();
  const [selectedFeature, setSelectedFeature] = useState<string>('inbox');
  const [purchaseSource, setPurchaseSource] = useState<string>('manual');
  const [purchaseReference, setPurchaseReference] = useState<string>('');
  const [activationStatus, setActivationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [adminToken, setAdminToken] = useState<string>('');

  const { data: userFeatures, refetch: refetchFeatures } = trpc.userFeatures.getUserFeatures.useQuery();
  const { data: inboxAccess, refetch: refetchAccess } = trpc.userFeatures.hasFeatureAccess.useQuery({
    featureName: 'inbox',
  });

  const grantFeatureMutation = trpc.admin.grantFeature.useMutation({
    onMutate: () => {
      setActivationStatus('loading');
    },
    onSuccess: () => {
      setActivationStatus('success');
      refetchFeatures();
      refetchAccess();
    },
    onError: (error) => {
      setActivationStatus('error');
      setErrorMessage(error.message || 'Failed to activate feature');
    },
  });

  const revokeFeatureMutation = trpc.userFeatures.revokeFeature.useMutation({
    onSuccess: () => {
      refetchFeatures();
      refetchAccess();
    },
  });

  const handleGrantFeature = () => {
    if (user?.id && adminToken.trim()) {
      grantFeatureMutation.mutate({
        adminToken: adminToken.trim(),
        userPrivyDid: user.id,
        featureName: selectedFeature as any,
        purchaseSource: purchaseSource as any,
        purchaseReference: purchaseReference || undefined,
      });
    }
  };

  const handleRevokeFeature = () => {
    revokeFeatureMutation.mutate({
      featureName: selectedFeature as any,
    });
  };

  const handleGoToInbox = () => {
    router.push('/dashboard/inbox');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Feature Activation Test</h1>
        <p className="text-muted-foreground">
          Test page for manually activating user features. For development and testing purposes only.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Current Status
            </CardTitle>
            <CardDescription>
              Your current feature access status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">User ID</Label>
              <p className="text-sm text-muted-foreground font-mono">
                {user?.id || 'Not available'}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Inbox Access</Label>
              <div className="flex items-center gap-2">
                {inboxAccess?.hasAccess ? (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Not Active
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">All Features</Label>
              <div className="space-y-1">
                {userFeatures && userFeatures.length > 0 ? (
                  userFeatures.map((feature) => (
                    <div key={feature.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{feature.featureName}</span>
                      <Badge variant={feature.isActive ? "default" : "secondary"}>
                        {feature.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No features activated</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Feature Management
            </CardTitle>
            <CardDescription>
              Manually activate or deactivate features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="feature-select">Feature</Label>
              <Select value={selectedFeature} onValueChange={setSelectedFeature}>
                <SelectTrigger id="feature-select">
                  <SelectValue placeholder="Select a feature" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inbox">Inbox</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                  <SelectItem value="advanced_analytics">Advanced Analytics</SelectItem>
                  <SelectItem value="auto_categorization">Auto Categorization</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="source-select">Purchase Source</Label>
              <Select value={purchaseSource} onValueChange={setPurchaseSource}>
                <SelectTrigger id="source-select">
                  <SelectValue placeholder="Select purchase source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="polar">Polar</SelectItem>
                  <SelectItem value="promo">Promo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference-input">Purchase Reference (Optional)</Label>
              <Input
                id="reference-input"
                placeholder="e.g., order_123456"
                value={purchaseReference}
                onChange={(e) => setPurchaseReference(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-token">Admin Token (Required)</Label>
              <Input
                id="admin-token"
                type="password"
                placeholder="Enter admin token"
                value={adminToken}
                onChange={(e) => setAdminToken(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Button
                onClick={handleGrantFeature}
                disabled={!user?.id || !adminToken.trim() || activationStatus === 'loading'}
                className="w-full"
              >
                {activationStatus === 'loading' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Activating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Activate Feature
                  </>
                )}
              </Button>

              <Button
                onClick={handleRevokeFeature}
                variant="outline"
                disabled={!user?.id || revokeFeatureMutation.isPending}
                className="w-full"
              >
                {revokeFeatureMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Revoking...
                  </>
                ) : (
                  <>
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Revoke Feature
                  </>
                )}
              </Button>
            </div>

            {activationStatus === 'success' && (
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Feature activated successfully!
                  </span>
                </div>
                <Button
                  onClick={handleGoToInbox}
                  size="sm"
                  variant="outline"
                  className="bg-white"
                >
                  Go to Inbox
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {activationStatus === 'error' && (
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-800">
                    {errorMessage}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> This is a test page for development purposes only. 
          In production, features should be activated through the proper purchase flow.
        </p>
      </div>
    </div>
  );
} 