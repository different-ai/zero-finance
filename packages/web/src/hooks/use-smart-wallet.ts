import { useState, useEffect } from 'react';
import { usePrivy, useUser } from '@privy-io/react-auth';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import { type Address } from 'viem';
import { base } from 'viem/chains';

export interface UseSmartWalletReturn {
  // State
  hasSmartWallet: boolean | null;
  smartWalletAddress: Address | null;
  isCreatingSmartWallet: boolean;
  smartWalletError: string;
  deploymentStep: string;
  
  // Actions
  createSmartWallet: () => Promise<void>;
  resetError: () => void;
}

export function useSmartWallet(): UseSmartWalletReturn {
  const { user, ready } = usePrivy();
  const { refreshUser } = useUser();
  const { getClientForChain } = useSmartWallets();
  
  const [hasSmartWallet, setHasSmartWallet] = useState<boolean | null>(null);
  const [smartWalletAddress, setSmartWalletAddress] = useState<Address | null>(null);
  const [isCreatingSmartWallet, setIsCreatingSmartWallet] = useState(false);
  const [smartWalletError, setSmartWalletError] = useState('');
  const [deploymentStep, setDeploymentStep] = useState('');

  // Effect to check for existing Privy smart wallet
  useEffect(() => {
    if (ready && user) {
      const existingSmartWalletAccount = user.linkedAccounts?.find(
        (account) => account.type === 'smart_wallet',
      );
      if (existingSmartWalletAccount && typeof (existingSmartWalletAccount as any).address === 'string') {
        const addr = (existingSmartWalletAccount as any).address as Address;
        console.log(`0xHypr - Found existing Privy smart wallet: ${addr}`);
        setHasSmartWallet(true);
        setSmartWalletAddress(addr);
      } else {
        console.log('0xHypr - No Privy smart wallet found for this user.');
        setHasSmartWallet(false);
        setSmartWalletAddress(null);
      }
    }
  }, [ready, user]);

  const createSmartWallet = async () => {
    if (!user) {
      setSmartWalletError('User not available. Please try again.');
      return;
    }

    setIsCreatingSmartWallet(true);
    setSmartWalletError('');
    setDeploymentStep('Preparing your smart wallet...');
    console.log('0xHypr - Starting smart wallet creation');

    try {
      const baseClient = await getClientForChain({ id: base.id });
      if (!baseClient) {
        throw new Error('Failed to get Base chain client for smart wallet creation');
      }

      let smartWalletAccount = user.linkedAccounts?.find(
        (account) => account.type === 'smart_wallet',
      );
      let currentSmartWalletAddress = 
        smartWalletAccount && typeof (smartWalletAccount as any).address === 'string'
        ? (smartWalletAccount as any).address as Address
        : null;

      if (!currentSmartWalletAddress) {
        console.log('0xHypr - Privy Smart wallet not found, proceeding to deploy.');
        setDeploymentStep('Deploying your smart wallet (this may take a moment)...');
        await baseClient.sendTransaction(
          {
            to: '0x0000000000000000000000000000000000000000',
            value: 0n,
            data: '0x',
          },
          {
            uiOptions: { showWalletUIs: false },
          },
        );

        let retries = 15;
        setDeploymentStep('Verifying smart wallet creation...');
        while (retries-- > 0) {
          await new Promise((r) => setTimeout(r, 2500));
          // Proactively refresh the Privy user object to fetch latest linked accounts
          try {
            await refreshUser();
          } catch (e) {
            console.warn('0xHypr - Failed to refresh Privy user during smart wallet polling', e);
          }
          smartWalletAccount = user.linkedAccounts?.find(
            (account) => account.type === 'smart_wallet',
          );
          currentSmartWalletAddress = 
            smartWalletAccount && typeof (smartWalletAccount as any).address === 'string'
            ? (smartWalletAccount as any).address as Address
            : null;

          if (currentSmartWalletAddress) {
            console.log(
              `0xHypr - Privy Smart wallet detected after polling: ${currentSmartWalletAddress}`,
            );
            break;
          }
          console.log(`0xHypr - Polling for smart wallet, retries left: ${retries}`);
        }
      }

      if (!currentSmartWalletAddress) {
        throw new Error(
          'Smart wallet deployment failed or was not detected in time.',
        );
      }

      console.log(
        `0xHypr - Smart wallet successfully ensured/found: ${currentSmartWalletAddress}`,
      );
      setSmartWalletAddress(currentSmartWalletAddress);
      setHasSmartWallet(true);
      setDeploymentStep('Smart wallet ready!');
      setSmartWalletError(''); 

    } catch (error: any) {
      console.error('0xHypr - Error creating smart wallet:', error);
      let errMsg = 'Failed to create smart wallet.';
      if (error.message?.includes('User rejected the request')) {
        errMsg = 'Smart wallet creation rejected in wallet.';
      } else if (error.shortMessage) {
        errMsg = error.shortMessage;
      } else if (error.message) {
        errMsg = error.message;
      }
      setSmartWalletError(errMsg);
      setHasSmartWallet(false);
      setDeploymentStep('');
    } finally {
      setIsCreatingSmartWallet(false);
    }
  };

  const resetError = () => {
    setSmartWalletError('');
  };

  return {
    hasSmartWallet,
    smartWalletAddress,
    isCreatingSmartWallet,
    smartWalletError,
    deploymentStep,
    createSmartWallet,
    resetError,
  };
} 