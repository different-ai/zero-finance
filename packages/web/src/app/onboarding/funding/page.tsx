'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFundWallet, useWallets } from '@privy-io/react-auth';
import { CreditCard, ArrowRight, Wallet, Coins, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function FundingPage() {
  const router = useRouter();
  const { fundWallet } = useFundWallet();
  const { wallets } = useWallets();
  const [loading, setLoading] = useState(false);

  // Get the first embedded wallet or safe wallet address
  const walletAddress = wallets?.find(w => 
    w.walletClientType === 'privy' || w.walletClientType === 'safe'
  )?.address;

  const handleFundWallet = async () => {
    if (!walletAddress) {
      console.error('No wallet address found');
      return;
    }

    setLoading(true);
    try {
      await fundWallet(walletAddress);
      // Note: We don't automatically navigate away as the user may cancel the funding flow
    } catch (error) {
      console.error('Error funding wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    router.push('/onboarding/complete');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Fund Your Wallet</h1>
        <p className="mt-2 text-gray-600">
          Start using your digital wallet with as little as a few cents. Fund your wallet now or come back to this later.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-green-100 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">Add Funds</CardTitle>
              <CreditCard className="h-5 w-5 text-green-500" />
            </div>
            <CardDescription>
              Fund your wallet directly through our partners
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start space-x-2">
                <Coins className="h-4 w-4 text-green-500 mt-0.5" />
                <span>Start with as little as $0.50 to try the platform</span>
              </li>
              <li className="flex items-start space-x-2">
                <DollarSign className="h-4 w-4 text-green-500 mt-0.5" />
                <span>Pay with credit card, debit card, or bank transfer</span>
              </li>
              <li className="flex items-start space-x-2">
                <Wallet className="h-4 w-4 text-green-500 mt-0.5" />
                <span>Your funds are securely stored in your wallet</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white" 
              onClick={handleFundWallet}
              disabled={loading || !walletAddress}
            >
              {loading ? 'Loading...' : 'Fund My Wallet'}
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-gray-100 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">Why Fund Now?</CardTitle>
              <Wallet className="h-5 w-5 text-gray-500" />
            </div>
            <CardDescription>
              Benefits of adding funds to your wallet
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start space-x-2">
                <div className="bg-gray-100 rounded-full h-5 w-5 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-medium">1</span>
                </div>
                <span>Pay for transactions on the blockchain</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="bg-gray-100 rounded-full h-5 w-5 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-medium">2</span>
                </div>
                <span>Receive and send payments instantly</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="bg-gray-100 rounded-full h-5 w-5 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-medium">3</span>
                </div>
                <span>Get started with the full platform experience</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
        <Button
          variant="outline"
          onClick={() => router.push('/onboarding/info')}
        >
          Back
        </Button>
        <Button
          onClick={handleContinue}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <p className="text-sm text-gray-500 text-center mt-4">
        You can always fund your wallet later from your dashboard.
      </p>
    </div>
  );
} 