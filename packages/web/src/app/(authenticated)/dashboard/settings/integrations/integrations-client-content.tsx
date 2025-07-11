'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { api } from '@/trpc/react';
import { Mail, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { GmailProcessingToggle } from '@/components/settings/gmail-processing-toggle';

export function IntegrationsClientContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Check Gmail connection status
  const { data: gmailConnection, isLoading: isCheckingConnection, refetch: refetchConnection } = api.inbox.checkGmailConnection.useQuery();
  
  const disconnectGmailMutation = api.inbox.disconnectGmail.useMutation({
    onSuccess: () => {
      refetchConnection();
      setStatusMessage({
        type: 'success',
        message: 'Gmail has been disconnected successfully.'
      });
    },
    onError: () => {
      setStatusMessage({
        type: 'error',
        message: 'Failed to disconnect Gmail. Please try again.'
      });
    }
  });

  // Handle OAuth status from URL parameters
  useEffect(() => {
    const gmailStatus = searchParams.get('gmail_status');
    if (gmailStatus) {
      switch (gmailStatus) {
        case 'success':
          setStatusMessage({
            type: 'success',
            message: 'Gmail has been connected successfully! You can now sync your emails.'
          });
          refetchConnection();
          break;
        case 'error_config':
          setStatusMessage({
            type: 'error',
            message: 'Gmail configuration error. Please contact support.'
          });
          break;
        case 'error_code':
          setStatusMessage({
            type: 'error',
            message: 'OAuth authorization failed. Please try connecting again.'
          });
          break;
        case 'error_auth':
          setStatusMessage({
            type: 'error',
            message: 'Authentication failed. Please make sure you are logged in and try again.'
          });
          break;
        case 'error_token':
          setStatusMessage({
            type: 'error',
            message: 'Failed to exchange authorization code. Please try connecting again.'
          });
          break;
        default:
          setStatusMessage({
            type: 'error',
            message: 'An unknown error occurred during Gmail connection.'
          });
      }
      
      // Clean up URL parameters after showing message
      const newUrl = window.location.pathname;
      router.replace(newUrl);
    }
  }, [searchParams, refetchConnection, router]);

  return (  
    <div className="w-full space-y-8 px-6">
      <div>
        <h1 className="text-3xl font-bold">Integrations</h1>
        <p className="text-muted-foreground mt-2">
          Connect external services to enhance your workflow
        </p>
      </div>

      {/* Status Message */}
      {statusMessage && (
        <Alert variant={statusMessage.type === 'error' ? 'destructive' : 'default'}>
          {statusMessage.type === 'success' && <CheckCircle className="h-4 w-4" />}
          {statusMessage.type === 'error' && <XCircle className="h-4 w-4" />}
          {statusMessage.type === 'info' && <AlertCircle className="h-4 w-4" />}
          <AlertDescription>{statusMessage.message}</AlertDescription>
        </Alert>
      )}

      {/* Email Integrations Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Email Integrations</h2>
        
        {/* Gmail Integration Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="h-6 w-6" />
                <div>
                  <CardTitle>Gmail</CardTitle>
                  <CardDescription>
                    Connect your Gmail account to automatically process invoices and receipts
                  </CardDescription>
                </div>
              </div>
              {isCheckingConnection ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Badge variant={gmailConnection?.isConnected ? 'default' : 'secondary'}>
                  {gmailConnection?.isConnected ? 'Connected' : 'Not Connected'}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                {gmailConnection?.isConnected ? (
                  <>
                    Gmail is connected and ready to sync emails. You can now process invoices 
                    and receipts automatically from your inbox.
                  </>
                ) : (
                  <>
                                         Connect your Gmail account to enable automatic email processing. We&apos;ll scan 
                     for invoices, receipts, and other financial documents.
                  </>
                )}
              </div>
              
              <div className="flex space-x-2">
                {gmailConnection?.isConnected ? (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => router.push('/dashboard/inbox')}
                    >
                      Go to Inbox
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={() => disconnectGmailMutation.mutate()}
                      disabled={disconnectGmailMutation.isPending}
                    >
                      {disconnectGmailMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Disconnecting...
                        </>
                      ) : (
                        'Disconnect Gmail'
                      )}
                    </Button>
                  </>
                ) : (
                  <Button asChild>
                    <a href="/api/auth/gmail/connect">
                      <Mail className="mr-2 h-4 w-4" />
                      Connect Gmail
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gmail Processing Toggle */}
        {gmailConnection?.isConnected && (
          <div className="mt-4">
            <GmailProcessingToggle />
          </div>
        )}
      </div>

      {/* Future Integrations Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Other Integrations</h2>
        <Card className="opacity-50">
          <CardHeader>
            <CardTitle className="text-muted-foreground">Coming Soon</CardTitle>
            <CardDescription>
              More integrations will be available in future updates, including Slack, 
              Microsoft Outlook, and accounting software.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
} 