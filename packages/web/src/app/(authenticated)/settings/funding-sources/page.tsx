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
        <h1 className="text-2xl font-semibold text-gray-800">Funding Sources</h1>
        <p className="text-gray-500 text-sm mt-1.5">
          Manage your payment methods and bank connections
        </p>
      </div>

      <div className="grid gap-6 mt-8 md:grid-cols-2">
        {/* Virtual Bank Account Card */}
        <Card className="bg-white border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <BanknoteIcon className="h-5 w-5 text-primary" />
              <span>Virtual Bank Account</span>
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Receive fiat payments via bank transfer, automatically convert to crypto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Set up a virtual bank account through Align to receive USD or EUR payments and automatically convert them to USDC or USDT.
            </p>
            <ul className="text-sm space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-gray-400 mr-2 text-xs leading-5">•</span>
                Get your own IBAN or ACH account details
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-2 text-xs leading-5">•</span>
                Share with clients for easy bank transfers
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-2 text-xs leading-5">•</span>
                Automatic conversion to stablecoin
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-2 text-xs leading-5">•</span>
                Funds delivered to your wallet or safe
              </li>
            </ul>
          </CardContent>
          <CardFooter className="pt-2 border-t border-gray-100 mt-4">
            <Button asChild className="w-full bg-primary text-white hover:bg-primary/90">
              <Link href="/settings/funding-sources/align" className="flex items-center justify-center">
                Set Up Virtual Bank Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Manual Bank Details Card */}
        <Card className="bg-white border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <Building2 className="h-5 w-5 text-gray-600" />
              <span>Manual Bank Details</span>
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Add your traditional bank account details for invoices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Add your existing bank account details to be included on invoices. These will be stored securely and only shown on invoices you create.
            </p>
            <ul className="text-sm space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-gray-400 mr-2 text-xs leading-5">•</span>
                Add multiple bank accounts
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-2 text-xs leading-5">•</span>
                Support for IBAN, SWIFT/BIC, and Routing/Account numbers
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-2 text-xs leading-5">•</span>
                Choose which account to use per invoice
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-2 text-xs leading-5">•</span>
                No automatic conversion to crypto
              </li>
            </ul>
          </CardContent>
          <CardFooter className="pt-2 border-t border-gray-100 mt-4">
            <Button variant="outline" className="w-full text-gray-700 border-gray-200 hover:bg-gray-50">
              Add Bank Details
            </Button>
          </CardFooter>
        </Card>

        {/* Crypto Wallet Card */}
        <Card className="bg-white border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <CreditCard className="h-5 w-5 text-gray-600" />
              <span>Crypto Wallets</span>
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Manage your connected crypto wallets and addresses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Add and manage wallet addresses for receiving crypto payments directly through invoices or other channels.
            </p>
          </CardContent>
          <CardFooter className="pt-2 border-t border-gray-100 mt-4">
            <Button variant="outline" className="w-full text-gray-700 border-gray-200 hover:bg-gray-50">
              Manage Wallets
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 