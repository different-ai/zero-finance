import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function ActivatePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 px-4 py-12">
      <Card className="w-full max-w-md shadow-lg border-gray-200 dark:border-gray-800">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold lowercase tracking-tight text-gray-900 dark:text-gray-50">
            activate hyperstable
          </CardTitle>
          <CardDescription className="text-muted-foreground pt-2 lowercase">
            claim your invite. unlock your self-custodial business account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside lowercase">
            <li>self-custodial account in 90 s</li>
            <li>usd / eur rails, no hidden fees</li>
            <li>invoices payable in fiat or crypto</li>
            <li>allocations v0: auto-stash tax, savings, etc.</li>
            <li>coming soon: yield (~8%), debit card, ai agents</li>
          </ul>

          <Link href="/signin" className="block w-full" prefetch={false}>
            <Button className="w-full lowercase text-lg py-3" size="lg">
              activate your account
            </Button>
          </Link>
          <p className="text-xs text-center text-muted-foreground lowercase">
            first 200 activations get three months free.
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 