'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, MessageSquare, Clock } from 'lucide-react';
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

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                live chat
              </CardTitle>
              <CardDescription>
                chat with our support team in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                available monday-friday, 9am-6pm est
              </p>
              <Button className="w-full" onClick={() => {
                // This would open your chat widget
                console.log('opening chat widget');
              }}>
                start chat
              </Button>
            </CardContent>
          </Card>

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
                support@0.finance
              </p>
              <Button className="w-full" variant="outline" asChild>
                <a href="mailto:support@0.finance">
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
              <h4 className="font-medium mb-1">how do i connect my email?</h4>
              <p className="text-sm text-muted-foreground">
                go to settings → integrations and click &ldquo;connect gmail&rdquo;. you&apos;ll be redirected to google to authorize access.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-1">how does invoice processing work?</h4>
              <p className="text-sm text-muted-foreground">
                our ai automatically scans your emails for invoices and receipts, extracts key information, and creates organized cards in your inbox.
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
                yes, you can export all your invoices and receipts as csv files from the inbox page using the export button.
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