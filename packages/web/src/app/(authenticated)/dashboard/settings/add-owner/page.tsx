'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import {
  isAddress,
  createPublicClient,
  http,
  type Address,
  createWalletClient,
  custom,
  parseEther, // For potential gas estimation or display if needed
} from 'viem';
import { base } from 'viem/chains';
import Safe, { Eip1193Provider } from '@safe-global/protocol-kit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, ArrowRight, Info } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/trpc/react';

// Simple viem public client for reading chain data
const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL),
});

export default function AddOwnerPage() {
  const router = useRouter();
  const { user } = usePrivy();
  const { wallets } = useWallets();
  const embeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === 'privy',
  );
  // Find the smart wallet address for display purposes
  const smartWalletAccount = user?.linkedAccounts?.find(
    (account) => account.type === 'smart_wallet',
  );

  const [newOwnerAddress, setNewOwnerAddress] = useState<string>('');
  const [newThreshold, setNewThreshold] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [step, setStep] = useState<string>('');

  const [currentOwners, setCurrentOwners] = useState<Address[]>([]);
  const [currentThreshold, setCurrentThreshold] = useState<number | null>(null);
  const [safeDetailsLoading, setSafeDetailsLoading] = useState<boolean>(true);
  const [safeDetailsError, setSafeDetailsError] = useState<string | null>(
    null,
  );

  // Get the primary Safe address
  const { data: safesList } = api.settings.userSafes.list.useQuery();
  const primarySafe = safesList?.find((safe) => safe.safeType === 'primary');

  // Fetch current Safe owners and threshold
  const fetchSafeDetails = useCallback(async () => {
    if (!primarySafe?.safeAddress || !isAddress(primarySafe.safeAddress)) {
      setSafeDetailsLoading(false);
      setSafeDetailsError('Primary Safe address not found or invalid.');
      return;
    }

    setSafeDetailsLoading(true);
    setSafeDetailsError(null);
    setCurrentOwners([]);
    setCurrentThreshold(null);

    try {
      // Use public RPC for read-only operations
      const safeSdk = await Safe.init({
        provider: process.env.NEXT_PUBLIC_BASE_RPC_URL!,
        safeAddress: primarySafe.safeAddress,
      });
      const owners = await safeSdk.getOwners();
      const threshold = await safeSdk.getThreshold();
      setCurrentOwners(owners);
      setCurrentThreshold(threshold);
    } catch (err: any) {
      console.error('Failed to fetch Safe details:', err);
      setSafeDetailsError(
        `Could not fetch Safe details: ${err.message || 'Unknown error'}`,
      );
    } finally {
      setSafeDetailsLoading(false);
    }
  }, [primarySafe?.safeAddress]);

  useEffect(() => {
    fetchSafeDetails();
  }, [fetchSafeDetails]);

  const handleAddOwner = useCallback(async () => {
    setError(null);
    setTxHash(null);
    setIsLoading(true);
    setStep('Initializing');

    if (!embeddedWallet) {
      setError(
        'Embedded wallet not available. Please ensure you are logged in.',
      );
      setIsLoading(false);
      return;
    }

    if (!primarySafe?.safeAddress) {
      setError('Primary Safe address not found.');
      setIsLoading(false);
      return;
    }

    if (!isAddress(newOwnerAddress)) {
      setError('Invalid new owner address.');
      setIsLoading(false);
      return;
    }

    const newOwnerLower = newOwnerAddress.toLowerCase() as Address;
    if (currentOwners.map((o) => o.toLowerCase()).includes(newOwnerLower)) {
      setError('This address is already an owner.');
      setIsLoading(false);
      return;
    }

    let thresholdValue: number | undefined = undefined;
    const potentialNewOwnerCount = currentOwners.length + 1;
    if (newThreshold !== '') {
      try {
        thresholdValue = parseInt(newThreshold, 10);
        if (isNaN(thresholdValue) || thresholdValue <= 0) {
          setError('Invalid threshold value. Must be a positive number.');
          setIsLoading(false);
          return;
        }
        if (thresholdValue > potentialNewOwnerCount) {
          setError(
            `Threshold (${thresholdValue}) cannot be greater than the new number of owners (${potentialNewOwnerCount}).`,
          );
          setIsLoading(false);
          return;
        }
      } catch (e) {
        setError('Invalid threshold format.');
        setIsLoading(false);
        return;
      }
    }

    try {
      // Step 1: Connect to the embedded wallet via viem
      setStep('Connecting to wallet');
      await embeddedWallet.switchChain(base.id); // Ensure correct chain
      const provider =
        (await embeddedWallet.getEthereumProvider()) as Eip1193Provider;
      const walletClient = createWalletClient({
        account: embeddedWallet.address as Address,
        chain: base,
        transport: custom(provider),
      });

      // Step 2: Initialize Safe SDK with the embedded wallet as signer
      setStep('Initializing Safe SDK');
      const safeSdk = await Safe.init({
        provider: provider, // Use the Eip1193Provider directly
        signer: embeddedWallet.address, // This might not be strictly needed if provider is set correctly
        safeAddress: primarySafe.safeAddress,
        // Use the connected walletClient for signing internally
        // safeSdk will detect the signer from the provider/walletClient
      });

      // Step 3: Create the "add owner" transaction
      setStep('Creating transaction');
      toast.info('Preparing add owner transaction...');
      const addOwnerTx = await safeSdk.createAddOwnerTx({
        ownerAddress: newOwnerAddress as Address,
        threshold: thresholdValue, // Pass validated number or undefined
      });

      // Step 4: Sign and execute the transaction using the embedded wallet
      setStep('Executing transaction');
      toast.loading('Please confirm the transaction in your wallet...');
      const safeTxResponse = await safeSdk.executeTransaction(addOwnerTx);
      setTxHash(safeTxResponse.hash);
      setStep('Waiting for confirmation');
      toast.loading('Waiting for transaction confirmation...', {
        id: 'add-owner-toast',
      });
      await safeTxResponse.transactionResponse?.wait(); // Wait for mining

      toast.success('Owner added successfully!', { id: 'add-owner-toast' });
      setStep('Completed');

      // Reset form and refresh details
      setNewOwnerAddress('');
      setNewThreshold('');
      fetchSafeDetails(); // Re-fetch owners and threshold
    } catch (err: any) {
      console.error('Failed to add owner:', err);
      let errorMessage = 'Could not add owner.';
      if (err.message?.includes('rejected')) {
        errorMessage = 'Transaction rejected by user.';
      } else if (err.shortMessage) {
        errorMessage = err.shortMessage;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(`Transaction failed: ${errorMessage}`);
      toast.error('Transaction Failed', {
        description: errorMessage,
        id: 'add-owner-toast',
      });
      setStep('Error');
    } finally {
      setIsLoading(false);
    }
  }, [
    embeddedWallet,
    primarySafe?.safeAddress,
    newOwnerAddress,
    newThreshold,
    currentOwners,
    fetchSafeDetails,
  ]);

  const canSubmit =
    !isLoading &&
    embeddedWallet &&
    primarySafe?.safeAddress &&
    newOwnerAddress &&
    !safeDetailsLoading;

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Add Owner to Primary Safe</CardTitle>
          <CardDescription>
            Add a new owner address to your primary Safe wallet on Base. This
            action requires signing a transaction with your embedded wallet.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Wallet Info */}
          <Card className="bg-muted/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Wallet Information</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>
                <strong>Primary Safe:</strong>{' '}
                <code className="text-xs break-all">
                  {primarySafe?.safeAddress || 'Loading...'}
                </code>
              </p>
              <p>
                <strong>Signing Wallet (Embedded):</strong>{' '}
                <code className="text-xs break-all">
                  {embeddedWallet?.address || 'Not connected'}
                </code>
              </p>
              <p>
                <strong>Smart Wallet (Relayer):</strong>{' '}
                <code className="text-xs break-all">
                  {smartWalletAccount?.address || 'N/A'}
                </code>
              </p>
            </CardContent>
          </Card>

          {/* Current Safe Config */}
          <Card className="bg-muted/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Current Safe Configuration</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              {safeDetailsLoading ? (
                <p className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading Safe details...
                </p>
              ) : safeDetailsError ? (
                  <Alert variant="destructive" className="py-2 px-3 text-xs">
                    <XCircle className="h-3 w-3" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{safeDetailsError}</AlertDescription>
                  </Alert>
              ) : (
                <>
                  <p>
                    <strong>Current Threshold:</strong>{' '}
                    {currentThreshold !== null ? currentThreshold : 'N/A'}
                  </p>
                  <div>
                    <strong>Current Owners ({currentOwners.length}):</strong>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      {currentOwners.map((owner) => (
                        <li key={owner}>
                          <code className="text-xs break-all">{owner}</code>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Form Inputs */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newOwnerAddress">New Owner Address</Label>
              <Input
                id="newOwnerAddress"
                type="text"
                placeholder="0x..."
                value={newOwnerAddress}
                onChange={(e) => setNewOwnerAddress(e.target.value)}
                disabled={isLoading || safeDetailsLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newThreshold">New Threshold (Optional)</Label>
              <Input
                id="newThreshold"
                type="number"
                min="1"
                step="1"
                placeholder={`Current: ${currentThreshold ?? 'N/A'}. Max: ${currentOwners.length + 1}`}
                value={newThreshold}
                onChange={(e) => setNewThreshold(e.target.value)}
                disabled={isLoading || safeDetailsLoading}
              />
              <p className="text-xs text-muted-foreground">
                Leave blank to keep the current threshold (
                {currentThreshold ?? 'N/A'}). The threshold cannot be higher
                than the total number of owners after adding the new one (
                {currentOwners.length + 1}).
              </p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {txHash && (
            <Alert className="border-green-500/50 bg-green-50 text-green-800">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-900">
                Transaction Submitted
              </AlertTitle>
              <AlertDescription>
                Transaction Hash:{' '}
                <code className="text-xs break-all">{txHash}</code>
                <br />
                <span className="text-xs text-green-700">
                  The transaction has been sent. Monitor your wallet or BaseScan
                  for confirmation.
                </span>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-4">
          <Alert variant="default" className="border-blue-200 bg-blue-50">
             <Info className="h-4 w-4 text-blue-600" />
             <AlertTitle className="text-blue-800">Important</AlertTitle>
             <AlertDescription className="text-blue-700 text-xs">
                This operation modifies the ownership structure of your Safe and requires gas fees on the Base network, paid by your <strong>embedded wallet</strong> ({embeddedWallet?.address ? `${embeddedWallet.address.slice(0,6)}...` : 'N/A'}). Ensure you have enough ETH in that wallet.
            </AlertDescription>
          </Alert>
          <Button
            onClick={handleAddOwner}
            disabled={!canSubmit}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {step || 'Processing...'}
              </>
            ) : (
              <>
                <ArrowRight className="mr-2 h-4 w-4" />
                Add Owner to Safe
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 