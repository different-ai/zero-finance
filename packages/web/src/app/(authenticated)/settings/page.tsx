import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { CreditCard, Bank, ArrowRight, Building, Shield, BellRing } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Settings - Hypr',
  description: 'Manage your settings and preferences',
};

export default function SettingsPage() {
  return (
    <div className="container max-w-6xl pb-12">
      <PageHeader
        title="Settings"
        description="Manage your accounts, profiles, and preferences"
      />

      <div className="grid gap-6 mt-8 md:grid-cols-2">
        {/* Payment Methods Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              <span>Funding Sources</span>
            </CardTitle>
            <CardDescription>
              Manage your payment methods and bank connections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/settings/funding-sources/align" 
                  className="flex items-center justify-between p-3 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Bank className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Virtual Bank Account</p>
                      <p className="text-sm text-gray-500">Receive fiat payments via bank transfer</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </li>
              {/* Add more payment method options here */}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/settings/funding-sources">
                Manage All Funding Sources
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Company Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              <span>Company Profiles</span>
            </CardTitle>
            <CardDescription>
              Manage your company information and branding
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Set up your company profiles to be used on invoices and other documents.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Manage Company Profiles
            </Button>
          </CardFooter>
        </Card>

        {/* Security Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span>Security</span>
            </CardTitle>
            <CardDescription>
              Manage your account security and access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Update your wallet connections, recovery options, and access controls.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Security Settings
            </Button>
          </CardFooter>
        </Card>

        {/* Notifications Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellRing className="h-5 w-5" />
              <span>Notifications</span>
            </CardTitle>
            <CardDescription>
              Manage your notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Control how you receive notifications about invoices, payments, and other events.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Notification Preferences
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 