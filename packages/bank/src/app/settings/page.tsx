'use client';

import { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle } from 'lucide-react';
import { FundingSourceDisplay } from '@/components/dashboard/funding-source-display';
import { AddFundingSourceForm } from '@/components/dashboard/add-funding-source-form';
import { getUserFundingSources, type UserFundingSourceDisplayData } from '@/actions/get-user-funding-sources';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function SettingsPage() {
  const { ready, authenticated, user } = usePrivy();
  
  const [fundingSources, setFundingSources] = useState<UserFundingSourceDisplayData[]>([]);
  const [isLoadingFundingSources, setIsLoadingFundingSources] = useState(true);
  const [fundingSourceError, setFundingSourceError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSources() {
      if (ready && authenticated && user?.id) {
        setIsLoadingFundingSources(true);
        setFundingSourceError(null);
        try {
          const sources = await getUserFundingSources(user.id);
          setFundingSources(sources);
        } catch (err) {
          console.error("Failed to fetch funding sources on settings:", err);
          setFundingSourceError("Failed to load funding information.");
        } finally {
          setIsLoadingFundingSources(false);
        }
      } else if (ready && !authenticated) {
        setIsLoadingFundingSources(false);
        setFundingSources([]);
      }
    }
    fetchSources();
  }, [ready, authenticated, user?.id]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Funding Sources</CardTitle>
          <CardDescription>
            Manage your linked bank accounts or crypto addresses. Add a new source below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoadingFundingSources ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" /> Loading Funding Sources...
            </div>
          ) : fundingSourceError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Loading Sources</AlertTitle>
              <AlertDescription>{fundingSourceError}</AlertDescription>
            </Alert>
          ) : (
            <FundingSourceDisplay />
          )}
          
          {ready && authenticated && (
            <div className="mt-6 border-t pt-6">
                <AddFundingSourceForm />
            </div>
          )}
           {!authenticated && ready && (
              <p className="text-center text-muted-foreground mt-4">Please log in to manage funding sources.</p>
           )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Manage your personal information and contact details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              <div className="grid grid-cols-2">
                <dt className="text-sm font-medium">Full Name</dt>
                <dd className="text-sm">John Doe</dd>
              </div>
              <div className="grid grid-cols-2">
                <dt className="text-sm font-medium">Email Address</dt>
                <dd className="text-sm">john.doe@example.com</dd>
              </div>
              <div className="grid grid-cols-2">
                <dt className="text-sm font-medium">Phone Number</dt>
                <dd className="text-sm">+1 (555) 123-4567</dd>
              </div>
              <div className="grid grid-cols-2">
                <dt className="text-sm font-medium">Date of Birth</dt>
                <dd className="text-sm">January 1, 1990</dd>
              </div>
              <div className="grid grid-cols-2">
                <dt className="text-sm font-medium">Address</dt>
                <dd className="text-sm">123 Main St, Anytown, CA 12345</dd>
              </div>
            </dl>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Edit Personal Information
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>
              Manage your password and account security
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              <div className="grid grid-cols-2">
                <dt className="text-sm font-medium">Password</dt>
                <dd className="text-sm">••••••••••••</dd>
              </div>
              <div className="grid grid-cols-2">
                <dt className="text-sm font-medium">Two-Factor Authentication</dt>
                <dd className="text-sm">Enabled</dd>
              </div>
              <div className="grid grid-cols-2">
                <dt className="text-sm font-medium">Login Notifications</dt>
                <dd className="text-sm">Enabled</dd>
              </div>
              <div className="grid grid-cols-2">
                <dt className="text-sm font-medium">Last Login</dt>
                <dd className="text-sm">Today, 10:30 AM</dd>
              </div>
            </dl>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Manage Security Settings
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Manage how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              <div className="grid grid-cols-2">
                <dt className="text-sm font-medium">Email Notifications</dt>
                <dd className="text-sm">Enabled</dd>
              </div>
              <div className="grid grid-cols-2">
                <dt className="text-sm font-medium">Push Notifications</dt>
                <dd className="text-sm">Enabled</dd>
              </div>
              <div className="grid grid-cols-2">
                <dt className="text-sm font-medium">SMS Notifications</dt>
                <dd className="text-sm">Disabled</dd>
              </div>
              <div className="grid grid-cols-2">
                <dt className="text-sm font-medium">Transaction Alerts</dt>
                <dd className="text-sm">For amounts over $500</dd>
              </div>
            </dl>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Edit Notification Settings
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Preferences</CardTitle>
            <CardDescription>
              Manage your account display and behavior
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              <div className="grid grid-cols-2">
                <dt className="text-sm font-medium">Default Currency</dt>
                <dd className="text-sm">USD ($)</dd>
              </div>
              <div className="grid grid-cols-2">
                <dt className="text-sm font-medium">Language</dt>
                <dd className="text-sm">English</dd>
              </div>
              <div className="grid grid-cols-2">
                <dt className="text-sm font-medium">Time Zone</dt>
                <dd className="text-sm">Pacific Time (UTC-8)</dd>
              </div>
              <div className="grid grid-cols-2">
                <dt className="text-sm font-medium">Theme</dt>
                <dd className="text-sm">System Default</dd>
              </div>
            </dl>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Edit Preferences
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="border-t pt-6">
        <Button variant="destructive">Delete Account</Button>
      </div>
    </div>
  );
}