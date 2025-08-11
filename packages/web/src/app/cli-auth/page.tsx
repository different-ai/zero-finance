'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Check, Terminal, AlertCircle } from 'lucide-react';
import { api } from '@/lib/trpc/client';

export default function CLIAuthPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tokenName, setTokenName] = useState('CLI Token');
  const [generatedToken, setGeneratedToken] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const generateTokenMutation = api.cliAuth.generateToken.useMutation({
    onSuccess: (data) => {
      setGeneratedToken(data.token);
      setError('');
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin?callbackUrl=/cli-auth');
    }
  }, [status, router]);

  const handleGenerateToken = () => {
    generateTokenMutation.mutate({
      name: tokenName,
      expiresInDays: 90,
    });
  };

  const handleCopyToken = async () => {
    if (generatedToken) {
      await navigator.clipboard.writeText(generatedToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container max-w-2xl mx-auto py-10">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Terminal className="h-6 w-6" />
            <CardTitle>CLI Authentication</CardTitle>
          </div>
          <CardDescription>
            Generate a token to authenticate the Zero Finance CLI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!generatedToken ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="token-name">Token Name</Label>
                <Input
                  id="token-name"
                  value={tokenName}
                  onChange={(e) => setTokenName(e.target.value)}
                  placeholder="e.g., My MacBook CLI"
                />
                <p className="text-sm text-muted-foreground">
                  Give your token a name to identify it later
                </p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={handleGenerateToken}
                disabled={generateTokenMutation.isPending || !tokenName}
                className="w-full"
              >
                {generateTokenMutation.isPending ? 'Generating...' : 'Generate Token'}
              </Button>

              <div className="rounded-lg bg-muted p-4 space-y-2">
                <h3 className="font-medium">How to use:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Click "Generate Token" above</li>
                  <li>Copy the generated token</li>
                  <li>Go back to your terminal</li>
                  <li>Paste the token when prompted</li>
                </ol>
              </div>
            </>
          ) : (
            <>
              <Alert className="border-green-200 bg-green-50">
                <Check className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Token generated successfully! Copy it now - you won't be able to see it again.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label>Your CLI Token</Label>
                <div className="flex gap-2">
                  <Input
                    value={generatedToken}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyToken}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="rounded-lg bg-muted p-4 space-y-2">
                <h3 className="font-medium">Next steps:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Copy the token above</li>
                  <li>Go back to your terminal</li>
                  <li>Paste the token when prompted</li>
                  <li>You're authenticated! 🎉</li>
                </ol>
              </div>

              <Button
                variant="outline"
                onClick={() => {
                  setGeneratedToken('');
                  setTokenName('CLI Token');
                }}
                className="w-full"
              >
                Generate Another Token
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
