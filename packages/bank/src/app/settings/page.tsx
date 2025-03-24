import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

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