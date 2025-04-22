'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, Loader2 } from 'lucide-react';
import { RequestNetwork, Types } from '@requestnetwork/request-client.js';
import {
  payRequest,
  hasSufficientFunds,
  hasErc20Approval,
  approveErc20,
} from '@requestnetwork/payment-processor';
import { RequestLogicTypes } from '@requestnetwork/types';
import { useAccount, useSwitchChain } from 'wagmi';
import {
  useEthersProvider,
  useEthersSigner,
} from '@/hooks/use-ethers-adapters'; // Assuming we create/use this hook
import { createPublicClient, http, formatUnits } from 'viem'; // Added formatUnits
import { base } from 'viem/chains';
import { toast } from 'sonner';
import { requestClient } from '@/lib/request-network';
import Image from 'next/image';
import { usePrivy } from '@privy-io/react-auth'; // Import Privy for identity
import { getCurrencyConfig } from '@/lib/currencies'; // Import our currency config helper

// Helper to get network name from currencyInfo
const getRequiredChain = (
  currencyInfo: RequestLogicTypes.ICurrency | undefined | null,
) => {
  if (!currencyInfo?.network) return base; // Default to Base
  switch (currencyInfo.network.toLowerCase()) {
    case 'base':
      return base;
    // case 'mainnet': return mainnet;
    // case 'xdai': return gnosis;
    default:
      return base;
  }
};

interface RequestNetworkPayButtonProps {
  requestNetworkId: string;
}

export const RequestNetworkPayButton: React.FC<
  RequestNetworkPayButtonProps
> = ({ requestNetworkId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestData, setRequestData] = useState<Types.IRequestData | null>(
    null,
  );

  const { address, chain: connectedChain } = useAccount();
  // Use Privy to get user identity for declarative payments
  const { user } = usePrivy();
  // Use ethers v5 adapters
  const ethersProvider = useEthersProvider({ chainId: connectedChain?.id });
  const ethersSigner = useEthersSigner({ chainId: connectedChain?.id });
  const { switchChain } = useSwitchChain();

  const requiredChain = getRequiredChain(requestData?.currencyInfo);

  // Fetch request data on mount
  useEffect(() => {
    const fetchRequestData = async () => {
      console.log('0xHypr RN Fetch: Starting');
      if (!requestNetworkId) {
        console.error('0xHypr RN Fetch: Error - Invalid Request ID provided.');
        setError('Invalid Request ID');
        setIsFetchingData(false);
        return;
      }
      console.log(`0xHypr RN Fetch: Fetching for ID ${requestNetworkId}...`);
      setIsFetchingData(true);
      setError(null);
      try {
        console.log('0xHypr RN Fetch: Calling requestClient.fromRequestId...');
        // Using the shared client which doesn't need decryption for public reads
        const request = await requestClient.fromRequestId(requestNetworkId);
        console.log('0xHypr RN Fetch: Got request object:', !!request);

        if (!request) {
          throw new Error(
            `Request not found on network for ID: ${requestNetworkId}`,
          );
        }

        console.log('0xHypr RN Fetch: Calling request.getData()...');
        const data = request.getData();
        console.log('status', data.state);
        console.log('0xHypr RN Fetch: Got data object:', !!data);
        console.log('0xHypr Fetched RN data:', JSON.stringify(data, null, 2)); // Log full data

        if (!data?.payee) {
          console.error(
            '0xHypr RN Fetch: Error - Fetched data is incomplete or payee is missing.',
          );
          throw new Error('Request data is incomplete or payee is missing.');
        }
        console.log('0xHypr RN Fetch: Data fetch successful, setting state.');
        setRequestData(data);
      } catch (err) {
        console.error('0xHypr RN Fetch: Error caught:', err);
        const message =
          err instanceof Error
            ? err.message
            : 'Failed to load payment details.';
        setError(message);
        toast.error(`Error loading payment details: ${message}`);
      } finally {
        console.log('0xHypr RN Fetch: Setting isFetchingData to false.');
        setIsFetchingData(false);
      }
    };

    fetchRequestData();
  }, [requestNetworkId]);

  const handlePayment = useCallback(async () => {
    if (
      !requestData ||
      !ethersSigner ||
      !ethersProvider ||
      !address ||
      !requiredChain ||
      !user?.wallet?.address
    ) {
      toast.error(
        'Payment details not ready or wallet/user identity not available.',
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    // Construct user identity for declarative actions
    const userIdentity: Types.Identity.IIdentity = {
      type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
      value: user.wallet.address, // Use logged-in user's address
    };

    try {
      // 1. Check Network
      if (connectedChain?.id !== requiredChain.id) {
        toast.info(`Switching network to ${requiredChain.name}...`);
        switchChain({ chainId: requiredChain.id });
        setIsLoading(false);
        return;
      }

      // 3. Check if Declarative (based on currency type for Fiat)
      const isDeclarative =
        requestData.currencyInfo.type === RequestLogicTypes.CURRENCY.ISO4217;

      if (isDeclarative) {
        // Handle Declarative Payment (Declare Sent)
        toast.info('Declaring payment sent...');

        // Fetch the request using the client (potentially with signer)
        const request = await requestClient.fromRequestId(requestNetworkId);
        if (!request)
          throw new Error('Could not refetch request for declaration.');

        // Call declareSentPayment
        await request.declareSentPayment(
          requestData.expectedAmount,
          'Declared sent from web interface', // Optional note
          userIdentity, // The identity of the user declaring
        );

        // Wait for confirmation on the request object itself
        await request.waitForConfirmation();

        toast.success('Payment declared as sent!');
        // TODO: Update UI or refetch invoice status
      } else {
        // Handle On-Chain Payment (Existing Logic)

        // 4. Check Funds (use ethersProvider)
        const hasFunds = await hasSufficientFunds({
          request: requestData,
          address,
          providerOptions: { provider: ethersProvider }, // Use ethers Provider
        });

        if (!hasFunds) {
          throw new Error(`Insufficient balance for payment.`);
        }
        toast.success('Balance sufficient, checking approval...');

        // 5. Check/Request Approval (ERC20 only, use ethersProvider/Signer)
        if (
          requestData.currencyInfo.type === RequestLogicTypes.CURRENCY.ERC20
        ) {
          const hasApproval = await hasErc20Approval(
            requestData,
            address,
            ethersProvider,
          );

          if (!hasApproval) {
            toast.info('Requesting token approval...');
            const approvalTx = await approveErc20(requestData, ethersSigner); // Use ethers Signer
            await ethersSigner.provider?.waitForTransaction(approvalTx.hash); // Use ethers waitForTransaction
            toast.success('Approval granted!');
          } else {
            toast.success('Approval already granted.');
          }
        }

        // 6. Execute Payment (use ethersSigner)
        toast.info('Sending payment transaction...');
        const paymentTx = await payRequest(requestData, ethersSigner); // Use ethers Signer
        await ethersSigner.provider?.waitForTransaction(paymentTx.hash); // Use ethers waitForTransaction

        toast.success('Payment successful!');
        // TODO: Maybe refetch invoice status or trigger callback
      }
    } catch (err) {
      console.error('0xHypr Payment Error:', err);
      const message = err instanceof Error ? err.message : 'Payment failed.';
      setError(message);
      toast.error(`Payment failed: ${message}`);
    } finally {
      setIsLoading(false);
    }
  }, [
    requestData,
    ethersSigner,
    ethersProvider,
    address,
    requiredChain,
    connectedChain?.id,
    switchChain,
    user?.wallet?.address, // Add user address dependency
    requestNetworkId, // Add requestNetworkId dependency for refetching
  ]);

  // UI Logic
  if (isFetchingData) {
    return (
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading Details...
      </Button>
    );
  }

  if (error) {
    return (
      <Button variant="destructive" disabled>
        Error: {error.length > 30 ? error.substring(0, 27) + '...' : error}
      </Button>
    );
  }

  if (
    !requestData ||
    !requestData.expectedAmount ||
    !requestData.currencyInfo
  ) {
    return <Button disabled>Details Unavailable</Button>;
  }

  const currencyInfo = requestData.currencyInfo;
  // Use getCurrencyConfig to get reliable info
  const currencyConfig = currencyInfo
    ? // Pass the currency value (symbol or address) and network
      getCurrencyConfig(currencyInfo.value, currencyInfo.network || 'base')
    : null;

  const decimals = currencyConfig?.decimals || 18; // Default to 18 if config not found
  let displayAmount = '0.00';
  if (requestData.expectedAmount) {
    try {
      displayAmount = formatUnits(
        BigInt(requestData.expectedAmount.toString()),
        decimals,
      );
      // Optionally format for locale or add commas, but keep it simple for now
      // displayAmount = parseFloat(displayAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 });
    } catch (formatError) {
      console.error('Error formatting amount:', formatError);
      setError('Invalid amount data');
      displayAmount = 'Error'; // Indicate error in amount
    }
  } else {
    setError('Missing amount data');
    displayAmount = 'N/A'; // Indicate missing amount
  }

  // Safely access symbol using currencyConfig.symbol
  let displaySymbol = currencyConfig?.symbol || 'Unknown'; // Use config symbol, default

  // Determine button text based on payment type
  const isDeclarativeButton =
    currencyInfo?.type === RequestLogicTypes.CURRENCY.ISO4217;
  const buttonText = isDeclarativeButton
    ? `Declare ${displayAmount} ${displaySymbol} Sent`
    : `Pay ${displayAmount} ${displaySymbol}`;

  return (
    <Button
      onClick={handlePayment}
      // Also disable if user identity not available
      disabled={
        isLoading || !ethersSigner || !address || !user?.wallet?.address
      }
      className="min-h-[40px] bg-black hover:bg-gray-800 text-white" // Add min-height and basic styling
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <div className="mr-2 flex items-center justify-center bg-black p-0.5 rounded-sm h-[16px] w-[16px]">
          <Image
            src="/request-req-logo.png" // Correct logo path
            alt="Request Network Logo"
            width={14} // Slightly smaller to fit padding
            height={14}
            style={{ objectFit: 'contain' }} // Ensure logo scales nicely
          />
        </div>
      )}
      {isLoading ? 'Processing...' : buttonText}
    </Button>
  );
};

RequestNetworkPayButton.displayName = 'RequestNetworkPayButton';
