'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import Link from 'next/link';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-4xl py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">get support</h1>
          <p className="text-xl text-muted-foreground">
            we&apos;re here to help you succeed with 0 finance
          </p>
        </div>

        <div className="max-w-md mx-auto mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                email support
              </CardTitle>
              <CardDescription>
                send us an email and we&apos;ll respond within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                ben@0.finance
              </p>
              <Button className="w-full" variant="outline" asChild>
                <a href="mailto:ben@0.finance">
                  send email
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>frequently asked questions</CardTitle>
            <CardDescription>
              find quick answers to common questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-1">can i connect my email inbox?</h4>
              <p className="text-sm text-muted-foreground">
                direct email connectors are currently disabled while we focus on shared workspace automations. upload PDFs or sync bank activity instead, and we&apos;ll extract the details automatically.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-1">how does invoice processing work?</h4>
              <p className="text-sm text-muted-foreground">
                import invoices via secure upload or bank sync. zero will parse the document, fill in payment details, and queue follow-up actions in your workspace.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-1">is my data secure?</h4>
              <p className="text-sm text-muted-foreground">
                yes! we use bank-level encryption and never store your email credentials. all data is encrypted in transit and at rest.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-1">can i export my data?</h4>
              <p className="text-sm text-muted-foreground">
                yes. exports are available from the dashboard and reporting views so you can pull activity into your own models.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            still need help? we&apos;re just a message away.
          </p>
          <Link href="/dashboard">
            <Button variant="outline">
              back to dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 
