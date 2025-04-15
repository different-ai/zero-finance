import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Building2, ArrowRight, BanknoteIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Funding Sources - Hypr',
  description: 'Manage your payment methods and funding sources',
};

export default function FundingSourcesPage() {
  return (
    <div className="container max-w-6xl pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Funding Sources</h1>
        <p className="text-muted-foreground mt-2">
          Manage your payment methods and bank connections
        </p>
      </div>

      <div className="grid gap-6 mt-8 md:grid-cols-2">
        {/* Virtual Bank Account Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BanknoteIcon className="h-5 w-5" />
              <span>Virtual Bank Account</span>
            </CardTitle>
            <CardDescription>
              Receive fiat payments via bank transfer, automatically convert to crypto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Set up a virtual bank account through Align to receive USD or EUR payments and automatically convert them to USDC or USDT.
            </p>
            <ul className="text-sm space-y-2 text-gray-600">
              <li>• Get your own IBAN or ACH account details</li>
              <li>• Share with clients for easy bank transfers</li>
              <li>• Automatic conversion to stablecoin</li>
              <li>• Funds delivered to your wallet or safe</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/settings/funding-sources/align">
                Set Up Virtual Bank Account
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Manual Bank Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              <span>Manual Bank Details</span>
            </CardTitle>
            <CardDescription>
              Add your traditional bank account details for invoices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Add your existing bank account details to be included on invoices. These will be stored securely and only shown on invoices you create.
            </p>
            <ul className="text-sm space-y-2 text-gray-600">
              <li>• Add multiple bank accounts</li>
              <li>• Support for IBAN, SWIFT/BIC, and Routing/Account numbers</li>
              <li>• Choose which account to use per invoice</li>
              <li>• No automatic conversion to crypto</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Add Bank Details
            </Button>
          </CardFooter>
        </Card>

        {/* Crypto Wallet Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              <span>Crypto Wallets</span>
            </CardTitle>
            <CardDescription>
              Manage your connected crypto wallets and addresses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Add and manage wallet addresses for receiving crypto payments directly through invoices or other channels.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Manage Wallets
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 