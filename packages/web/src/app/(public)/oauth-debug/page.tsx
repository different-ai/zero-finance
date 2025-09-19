'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { CheckCircle, ArrowRight, Code, RefreshCw, Home, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

function OauthDebugContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [params, setParams] = useState<Record<string, string>>({});
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const paramsObj: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      paramsObj[key] = value;
    });
    setParams(paramsObj);
  }, [searchParams]);

  const handleRedirect = () => {
    setIsRedirecting(true);
    router.push('/dashboard');
  };

  const paramEntries = Object.entries(params);
  const hasParams = paramEntries.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Success Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Integration Complete</h1>
          <p className="text-slate-600 text-lg">
            Your integration has been successfully connected and configured.
          </p>
        </div>

        {/* Primary Action Card */}
        <Card className="border-blue-200 bg-blue-50/50 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-blue-100 p-2 flex-shrink-0">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-1">Ready to get started?</h3>
                <p className="text-blue-700 text-sm mb-3">
                  Your integration is now active. Head back to the dashboard to manage connected services.
                </p>
                <Button 
                  onClick={handleRedirect}
                  disabled={isRedirecting}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  {isRedirecting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Redirecting...
                    </>
                  ) : (
                    <>
                      Go to Dashboard
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connection Details - Collapsible */}
        <Card className="shadow-sm border bg-white/80 backdrop-blur-sm">
          <Accordion type="single" collapsible>
            <AccordionItem value="connection-details" className="border-none">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-2 text-left">
                  <Code className="h-4 w-4 text-slate-500" />
                  <div>
                    <div className="font-medium text-slate-900">Connection Details</div>
                    <div className="text-sm text-slate-500">
                      {hasParams ? `${paramEntries.length} parameter${paramEntries.length !== 1 ? 's' : ''} received` : 'Loading parameters...'}
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="space-y-3">
                  <p className="text-sm text-slate-600">
                    Technical details from the OAuth callback process:
                  </p>
                  {hasParams ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {paramEntries.length} parameter{paramEntries.length !== 1 ? 's' : ''} received
                        </Badge>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4 border">
                        <div className="space-y-2">
                          {paramEntries.map(([key, value]) => (
                            <div key={key} className="flex items-start gap-3">
                              <code className="text-xs font-mono bg-slate-200 px-2 py-1 rounded min-w-0 flex-shrink-0">
                                {key}
                              </code>
                              <code className="text-xs font-mono text-slate-700 break-all">
                                {value}
                              </code>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 rounded-lg p-6 text-center border">
                      <RefreshCw className="h-6 w-6 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-500 text-sm">Loading connection parameters...</p>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        <Separator />

        {/* Alternative Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            onClick={() => router.push('/dashboard/settings/integrations')}
            className="flex-1"
          >
            <Code className="h-4 w-4" />
            Manage Integrations
          </Button>
          <Button 
            variant="outline" 
            onClick={() => router.push('/')}
            className="flex-1"
          >
            <Home className="h-4 w-4" />
            Go to Homepage
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500">
          <p>If you continue to see this page, you can safely navigate away or close this tab.</p>
        </div>
      </div>
    </div>
  );
}

export default function OauthDebugPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <RefreshCw className="h-8 w-8 text-slate-400 mx-auto animate-spin" />
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Processing OAuth Callback</h2>
                <p className="text-slate-600">Please wait while we complete your connection...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <OauthDebugContent />
    </Suspense>
  );
} 
