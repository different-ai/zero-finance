'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plug } from 'lucide-react';

export function IntegrationsClientContent() {
  return (
    <div className="w-full space-y-8 px-6">
      <div>
        <h1 className="text-3xl font-bold">Integrations</h1>
        <p className="mt-2 text-muted-foreground">
          External integrations are currently disabled while we focus on shared workspace automations. Stay tuned for updates.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Plug className="h-6 w-6 text-muted-foreground" />
              <div>
                <CardTitle>Email & Document Sync</CardTitle>
                <CardDescription>
                  Automatic inbox ingestion and Gmail-based processing has been retired from the product.
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary">Unavailable</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your workspace now relies on direct uploads and bank-sync automations. If you need a specific integration, drop us a note and we&apos;ll reach out as new connectors come online.
          </p>
          <Button className="mt-4" disabled>
            Connect Service
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
