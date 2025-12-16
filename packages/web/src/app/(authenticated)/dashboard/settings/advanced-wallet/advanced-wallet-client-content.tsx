'use client';

import { RecoveryWalletManager } from '@/components/settings/recovery-wallet-manager';
import { api as trpc } from '@/trpc/react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Terminal,
  Copy,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  Info,
  ChevronRight,
  BookOpen,
  AlertTriangle,
  Shield,
} from 'lucide-react';
import {
  type Address,
  type Hex,
  createPublicClient,
  encodeFunctionData,
  http,
  isAddress,
  parseAbi,
} from 'viem';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useSmartWallet } from '@/hooks/use-smart-wallet';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import { Button } from '@/components/ui/button';
import { useEffect, useMemo, useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { buildSafeTx, relaySafeTx } from '@/lib/sponsor-tx/core';
import type { MetaTransactionData } from '@safe-global/safe-core-sdk-types';
import { base, arbitrum, gnosis, optimism } from 'viem/chains';
import { SUPPORTED_CHAINS, getChainDisplayName } from '@/lib/constants/chains';
import { Badge } from '@/components/ui/badge';

const SAFE_OWNER_SYNC_ABI = parseAbi([
  'function getOwners() view returns (address[])',
  'function getThreshold() view returns (uint256)',
  'function addOwnerWithThreshold(address owner, uint256 _threshold)',
  'function removeOwner(address prevOwner, address owner, uint256 _threshold)',
  'function changeThreshold(uint256 _threshold)',
]);

const SENTINEL_OWNERS = '0x0000000000000000000000000000000000000001' as Address;

function getRpcUrlForChainId(chainId: number): string {
  switch (chainId) {
    case SUPPORTED_CHAINS.ARBITRUM:
      return (
        process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL ||
        'https://arb1.arbitrum.io/rpc'
      );
    case SUPPORTED_CHAINS.GNOSIS:
      return (
        process.env.NEXT_PUBLIC_GNOSIS_RPC_URL || 'https://rpc.gnosischain.com'
      );
    case SUPPORTED_CHAINS.OPTIMISM:
      return (
        process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL ||
        'https://mainnet.optimism.io'
      );
    case SUPPORTED_CHAINS.BASE:
    default:
      return process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org';
  }
}

function getViemChainForId(chainId: number) {
  switch (chainId) {
    case SUPPORTED_CHAINS.ARBITRUM:
      return arbitrum;
    case SUPPORTED_CHAINS.GNOSIS:
      return gnosis;
    case SUPPORTED_CHAINS.OPTIMISM:
      return optimism;
    case SUPPORTED_CHAINS.BASE:
    default:
      return base;
  }
}

export function AdvancedWalletClientContent() {
  const { user } = usePrivy();
  const { wallets } = useWallets();
  const { smartWalletAddress } = useSmartWallet();
  const [copiedDid, setCopiedDid] = useState(false);
  const [copiedSafe, setCopiedSafe] = useState(false);
  const [copiedSmart, setCopiedSmart] = useState(false);
  const [copiedEmbedded, setCopiedEmbedded] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [showRecoveryInfo, setShowRecoveryInfo] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [showMultiChainSync, setShowMultiChainSync] = useState(false);
  const [isCheckingMultiChainSync, setIsCheckingMultiChainSync] =
    useState(false);
  const [syncingSafeKey, setSyncingSafeKey] = useState<string | null>(null);
  const [canonicalOwnership, setCanonicalOwnership] = useState<{
    owners: Address[];
    threshold: number;
  } | null>(null);
  const [safeOwnershipByKey, setSafeOwnershipByKey] = useState<
    Record<
      string,
      | {
          deployed: true;
          owners: Address[];
          threshold: number;
        }
      | {
          deployed: false;
          error?: string;
        }
    >
  >({});

  const { getClientForChain } = useSmartWallets();

  const {
    data: userSafes,
    isLoading: isLoadingSafes,
    error: errorSafes,
  } = trpc.settings.userSafes.list.useQuery();

  // Get Safe owners for primary Safe
  const primarySafe = userSafes?.find((safe) => safe.safeType === 'primary');
  const primarySafeAddress = primarySafe?.safeAddress as Address | undefined;

  const { data: safeOwners, isLoading: isLoadingSafeOwners } =
    trpc.safe.getSafeOwners.useQuery(
      { safeAddress: primarySafeAddress || '' },
      { enabled: !!primarySafeAddress, retry: false },
    );

  const embeddedWallet = useMemo(
    () => wallets.find((w: any) => w.walletClientType === 'privy'),
    [wallets],
  );

  const canonicalBasePrimarySafe = useMemo(() => {
    if (!userSafes) return undefined;
    return userSafes.find(
      (safe) =>
        safe.safeType === 'primary' &&
        safe.chainId === SUPPORTED_CHAINS.BASE &&
        typeof safe.safeAddress === 'string',
    );
  }, [userSafes]);

  // Get user's Privy addresses to match against Safe owners
  const userAddresses = user?.wallet?.address ? [user.wallet.address] : [];
  if (user?.linkedAccounts) {
    user.linkedAccounts.forEach((account) => {
      if (account.type === 'wallet' && account.address) {
        userAddresses.push(account.address);
      }
    });
  }

  const isCurrentUser = (ownerAddress: string) => {
    return userAddresses.some(
      (userAddr) => userAddr.toLowerCase() === ownerAddress.toLowerCase(),
    );
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const makeSafeKey = (chainId: number, safeAddress: string) =>
    `${chainId}:${safeAddress.toLowerCase()}`;

  const readSafeOwnership = async (params: {
    safeAddress: string;
    chainId: number;
  }): Promise<
    | {
        deployed: true;
        owners: Address[];
        threshold: number;
      }
    | {
        deployed: false;
        error?: string;
      }
  > => {
    if (!isAddress(params.safeAddress)) {
      return { deployed: false, error: 'Invalid address' };
    }

    const safeAddress = params.safeAddress as Address;
    const rpcUrl = getRpcUrlForChainId(params.chainId);
    const chain = getViemChainForId(params.chainId);

    const publicClient = createPublicClient({
      chain,
      transport: http(rpcUrl),
    });

    const bytecode = await publicClient.getBytecode({ address: safeAddress });
    if (!bytecode || bytecode === '0x') {
      return { deployed: false, error: 'Not deployed on-chain' };
    }

    const [owners, threshold] = await Promise.all([
      publicClient.readContract({
        address: safeAddress,
        abi: SAFE_OWNER_SYNC_ABI,
        functionName: 'getOwners',
      }) as Promise<Address[]>,
      publicClient.readContract({
        address: safeAddress,
        abi: SAFE_OWNER_SYNC_ABI,
        functionName: 'getThreshold',
      }) as Promise<bigint>,
    ]);

    return {
      deployed: true,
      owners,
      threshold: Number(threshold),
    };
  };

  const checkMultiChainSync = async () => {
    if (!canonicalBasePrimarySafe?.safeAddress) {
      toast({
        title: 'No canonical Base Safe found',
        description: 'Create a Base primary Safe first.',
        variant: 'destructive',
      });
      return;
    }

    if (!userSafes || userSafes.length === 0) {
      toast({
        title: 'No Safes found',
        description: 'This workspace has no Safes to check.',
        variant: 'destructive',
      });
      return;
    }

    setIsCheckingMultiChainSync(true);

    try {
      const canonical = await readSafeOwnership({
        safeAddress: canonicalBasePrimarySafe.safeAddress,
        chainId: SUPPORTED_CHAINS.BASE,
      });

      if (!canonical.deployed) {
        throw new Error(
          canonical.error || 'Canonical Base Safe is not deployed on-chain',
        );
      }

      setCanonicalOwnership({
        owners: canonical.owners,
        threshold: canonical.threshold,
      });

      const entries = await Promise.all(
        userSafes.map(async (safe) => {
          const chainId = Number(safe.chainId);
          const address = String(safe.safeAddress);
          const key = makeSafeKey(chainId, address);

          try {
            const info = await readSafeOwnership({
              safeAddress: address,
              chainId,
            });
            return [key, info] as const;
          } catch (err) {
            return [
              key,
              {
                deployed: false,
                error: err instanceof Error ? err.message : 'Failed to read',
              },
            ] as const;
          }
        }),
      );

      setSafeOwnershipByKey(Object.fromEntries(entries));
    } catch (err) {
      toast({
        title: 'Failed to check Safe ownership',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsCheckingMultiChainSync(false);
    }
  };

  useEffect(() => {
    if (!showMultiChainSync) return;
    if (Object.keys(safeOwnershipByKey).length > 0) return;
    void checkMultiChainSync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMultiChainSync]);

  const buildSyncTransactions = (params: {
    safeAddress: Address;
    currentOwners: Address[];
    currentThreshold: number;
    canonicalOwners: Address[];
    canonicalThreshold: number;
  }): MetaTransactionData[] => {
    const normalize = (a: Address) => a.toLowerCase();
    const canonicalSet = new Set(params.canonicalOwners.map(normalize));
    const currentSet = new Set(params.currentOwners.map(normalize));

    const ownersToAdd = params.canonicalOwners.filter(
      (owner) => !currentSet.has(normalize(owner)),
    );
    const ownersToRemove = params.currentOwners.filter(
      (owner) => !canonicalSet.has(normalize(owner)),
    );

    let workingOwners = [...params.currentOwners];
    let workingThreshold = params.currentThreshold;

    const txs: MetaTransactionData[] = [];

    // Add missing owners first (keep threshold stable)
    for (const owner of ownersToAdd) {
      const data = encodeFunctionData({
        abi: SAFE_OWNER_SYNC_ABI,
        functionName: 'addOwnerWithThreshold',
        args: [owner, BigInt(workingThreshold)],
      });

      txs.push({
        to: params.safeAddress,
        value: '0',
        data: data as Hex,
        operation: 0,
      });

      workingOwners = [...workingOwners, owner];
    }

    // Remove extra owners next (adjust threshold downward if needed)
    for (const ownerToRemove of ownersToRemove) {
      const idx = workingOwners.findIndex(
        (owner) => normalize(owner) === normalize(ownerToRemove),
      );
      if (idx === -1) continue;

      const prevOwner = idx === 0 ? SENTINEL_OWNERS : workingOwners[idx - 1];
      const ownersAfterRemoval = workingOwners.length - 1;
      const nextThreshold = Math.min(workingThreshold, ownersAfterRemoval);

      const data = encodeFunctionData({
        abi: SAFE_OWNER_SYNC_ABI,
        functionName: 'removeOwner',
        args: [prevOwner, workingOwners[idx], BigInt(nextThreshold)],
      });

      txs.push({
        to: params.safeAddress,
        value: '0',
        data: data as Hex,
        operation: 0,
      });

      workingOwners = workingOwners.filter((_, i) => i !== idx);
      workingThreshold = nextThreshold;
    }

    // Apply canonical threshold last
    if (workingThreshold !== params.canonicalThreshold) {
      if (
        params.canonicalThreshold < 1 ||
        params.canonicalThreshold > workingOwners.length
      ) {
        throw new Error(
          `Invalid canonical threshold ${params.canonicalThreshold} for ${workingOwners.length} owners`,
        );
      }

      const data = encodeFunctionData({
        abi: SAFE_OWNER_SYNC_ABI,
        functionName: 'changeThreshold',
        args: [BigInt(params.canonicalThreshold)],
      });

      txs.push({
        to: params.safeAddress,
        value: '0',
        data: data as Hex,
        operation: 0,
      });
    }

    return txs;
  };

  const syncSafeToBase = async (params: {
    chainId: number;
    safeAddress: string;
  }) => {
    if (!canonicalOwnership) {
      toast({
        title: 'No canonical ownership loaded',
        description: 'Click "Check sync" first.',
        variant: 'destructive',
      });
      return;
    }

    const key = makeSafeKey(params.chainId, params.safeAddress);
    const safeInfo = safeOwnershipByKey[key];

    if (!safeInfo) {
      toast({
        title: 'Missing Safe ownership data',
        description: 'Click "Check sync" first.',
        variant: 'destructive',
      });
      return;
    }

    if (!safeInfo.deployed) {
      toast({
        title: 'Safe not deployed',
        description: safeInfo.error || 'Cannot sync an undeployed Safe.',
        variant: 'destructive',
      });
      return;
    }

    if (!isAddress(params.safeAddress)) {
      toast({
        title: 'Invalid Safe address',
        description: 'Cannot sync this Safe.',
        variant: 'destructive',
      });
      return;
    }

    const safeAddress = params.safeAddress as Address;

    const normalize = (a: Address) => a.toLowerCase();
    const canonicalSet = new Set(canonicalOwnership.owners.map(normalize));
    const currentSet = new Set(safeInfo.owners.map(normalize));

    const ownersToAdd = canonicalOwnership.owners.filter(
      (owner) => !currentSet.has(normalize(owner)),
    );
    const ownersToRemove = safeInfo.owners.filter(
      (owner) => !canonicalSet.has(normalize(owner)),
    );
    const thresholdMismatch =
      safeInfo.threshold !== canonicalOwnership.threshold;

    if (
      ownersToAdd.length === 0 &&
      ownersToRemove.length === 0 &&
      !thresholdMismatch
    ) {
      toast({
        title: 'Already in sync',
        description: 'This Safe already matches Base.',
      });
      return;
    }

    const ok = window.confirm(
      `Sync this Safe to Base?\n\nAdd: ${ownersToAdd.length}\nRemove: ${ownersToRemove.length}\nThreshold: ${safeInfo.threshold} → ${canonicalOwnership.threshold}`,
    );
    if (!ok) return;

    setSyncingSafeKey(key);

    try {
      const txs = buildSyncTransactions({
        safeAddress,
        currentOwners: safeInfo.owners,
        currentThreshold: safeInfo.threshold,
        canonicalOwners: canonicalOwnership.owners,
        canonicalThreshold: canonicalOwnership.threshold,
      });

      const smartClient = await getClientForChain({ id: params.chainId });
      const signerAddress = smartClient?.account?.address as
        | Address
        | undefined;

      if (!smartClient || !signerAddress) {
        throw new Error('No smart wallet available for this chain');
      }

      const safeTx = await buildSafeTx(txs, {
        safeAddress,
        chainId: params.chainId,
        gas: 600_000n,
      });

      const txHash = await relaySafeTx(
        safeTx,
        signerAddress,
        smartClient,
        safeAddress,
        getViemChainForId(params.chainId),
      );

      toast({
        title: 'Sync transaction sent',
        description: `UserOperation/tx hash: ${txHash}`,
      });

      const refreshed = await readSafeOwnership({
        safeAddress: params.safeAddress,
        chainId: params.chainId,
      });

      setSafeOwnershipByKey((prev) => ({
        ...prev,
        [key]: refreshed,
      }));
    } catch (err) {
      toast({
        title: 'Failed to sync Safe',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setSyncingSafeKey(null);
    }
  };

  const copyToClipboard = async (
    text: string,
    type: 'did' | 'safe' | 'smart' | 'embedded' | 'owner',
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'did') {
        setCopiedDid(true);
        setTimeout(() => setCopiedDid(false), 2000);
      } else if (type === 'safe') {
        setCopiedSafe(true);
        setTimeout(() => setCopiedSafe(false), 2000);
      } else if (type === 'smart') {
        setCopiedSmart(true);
        setTimeout(() => setCopiedSmart(false), 2000);
      } else if (type === 'owner') {
        setCopiedAddress(text);
        setTimeout(() => setCopiedAddress(null), 2000);
      } else {
        setCopiedEmbedded(true);
        setTimeout(() => setCopiedEmbedded(false), 2000);
      }
      const label = {
        did: 'User DID',
        safe: 'Safe address',
        smart: 'Smart wallet address',
        embedded: 'Embedded wallet address',
        owner: 'Owner address',
      }[type];
      toast({
        title: 'Copied',
        description: `${label} copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: 'Failed to copy',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header - Technical Mode */}
      <header className="sticky top-0 z-40 bg-[#F8F9FA] border-b border-[#1B29FF]/20">
        <div className="h-[60px] flex items-center px-4 sm:px-6 max-w-[1400px] mx-auto">
          <p className="uppercase tracking-[0.14em] text-[11px] text-[#1B29FF] font-mono mr-3">
            CONFIG::WALLET
          </p>
          <h1 className="font-mono text-[22px] sm:text-[26px] leading-[1] text-[#101010]">
            Advanced Wallet
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 py-6 sm:py-8 max-w-[1400px] mx-auto space-y-6">
        <div>
          <p className="text-[14px] text-[#101010]/60 font-mono">
            Manage Safe owners, recovery wallets, and view technical details
          </p>
        </div>

        {isLoadingSafes && <Skeleton className="h-64 w-full" />}

        {errorSafes && (
          <Alert variant="destructive" className="border-red-500/20">
            <Terminal className="h-4 w-4" />
            <AlertTitle className="font-mono">ERROR::LOAD_WALLETS</AlertTitle>
            <AlertDescription className="font-mono">
              Could not load your wallet details. Please try again later.
            </AlertDescription>
          </Alert>
        )}

        {/* Safe Owners Section */}
        {primarySafeAddress && (
          <div className="bg-white border border-[#1B29FF]/20 shadow-sm">
            <div className="border-b border-[#1B29FF]/20 px-5 sm:px-6 py-4">
              <h2 className="flex items-center gap-2 font-mono text-[16px] text-[#101010]">
                <Shield className="h-5 w-5 text-[#1B29FF]" />
                SAFE::OWNERS
                {safeOwners && (
                  <Badge variant="secondary" className="font-mono ml-2">
                    {safeOwners.owners.length}
                  </Badge>
                )}
              </h2>
              <p className="text-[13px] text-[#101010]/50 font-mono mt-1">
                Addresses authorized for transaction signing (threshold:{' '}
                {safeOwners?.threshold || 1}/{safeOwners?.owners.length || 1})
              </p>
            </div>
            <div className="p-5 sm:p-6">
              {isLoadingSafeOwners ? (
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : safeOwners && safeOwners.owners.length > 0 ? (
                <div className="space-y-2">
                  {safeOwners.owners.map((ownerAddress: string) => (
                    <div
                      key={ownerAddress}
                      className="flex items-center justify-between p-3 border border-[#1B29FF]/20 bg-[#1B29FF]/5"
                    >
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono text-[#1B29FF]">
                          {formatAddress(ownerAddress)}
                        </code>
                        {isCurrentUser(ownerAddress) && (
                          <Badge variant="default" className="font-mono">
                            YOU
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(ownerAddress, 'owner')}
                        className="text-[#1B29FF]/60 hover:text-[#1B29FF] hover:bg-[#1B29FF]/10"
                      >
                        {copiedAddress === ownerAddress ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-[#101010]/50 font-mono py-4">
                  No Safe owners found.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Recovery Wallet Manager - Now directly under Safe Owners */}
        {!isLoadingSafes && !errorSafes && (
          <RecoveryWalletManager primarySafeAddress={primarySafeAddress} />
        )}

        {/* About Recovery Wallets */}
        <div className="bg-white border border-[#1B29FF]/20 p-6">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 bg-[#1B29FF]/10 flex items-center justify-center flex-shrink-0">
              <Info className="h-5 w-5 text-[#1B29FF]" />
            </div>
            <div className="flex-1">
              <h2 className="text-[16px] font-mono text-[#101010] mb-2">
                RECOVERY::INFO
              </h2>
              <p className="text-[14px] leading-[1.5] text-[#101010]/70 font-mono mb-4">
                Recovery wallets provide an additional layer of security for
                your account. They can be used to recover access if your primary
                authentication method is unavailable.
              </p>

              <button
                onClick={() => setShowRecoveryInfo(!showRecoveryInfo)}
                className="text-[13px] text-[#1B29FF] hover:text-[#1420CC] transition-colors flex items-center gap-1 font-mono"
              >
                <ChevronRight
                  className={cn(
                    'h-4 w-4 transition-transform',
                    showRecoveryInfo && 'rotate-90',
                  )}
                />
                {showRecoveryInfo ? 'Hide details' : 'Learn more'}
              </button>

              {showRecoveryInfo && (
                <div className="mt-6 space-y-6">
                  <div className="p-5 bg-[#1B29FF]/5 border border-[#1B29FF]/20">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-7 w-7 bg-[#1B29FF]/10 flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-[#1B29FF]" />
                      </div>
                      <h3 className="text-[15px] font-mono text-[#101010]">
                        RECOVERY::GUIDE
                      </h3>
                    </div>
                    <ol className="space-y-3 text-[13px] text-[#101010]/70 leading-[1.5] pl-1 font-mono">
                      <li className="flex items-start gap-3">
                        <span className="font-medium text-[#1B29FF] flex-shrink-0">
                          1.
                        </span>
                        <span>
                          Use an external wallet on the Base network (MetaMask,
                          Coinbase Wallet, or Rainbow) for recovery
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="font-medium text-[#1B29FF] flex-shrink-0">
                          2.
                        </span>
                        <span>
                          Add the wallet address as a recovery wallet above
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="font-medium text-[#1B29FF] flex-shrink-0">
                          3.
                        </span>
                        <span>
                          If you lose access to your account, contact support
                          with your recovery wallet address
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="font-medium text-[#1B29FF] flex-shrink-0">
                          4.
                        </span>
                        <span>
                          Sign a verification message with your recovery wallet
                          to prove ownership
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="font-medium text-[#1B29FF] flex-shrink-0">
                          5.
                        </span>
                        <span>
                          Support will help restore access to your account
                        </span>
                      </li>
                    </ol>
                  </div>

                  <div className="p-4 bg-[#f59e0b]/10 border border-[#f59e0b]/30">
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 bg-[#f59e0b]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-[#f59e0b]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[14px] font-mono text-[#101010] mb-1">
                          WARNING::BASE_NETWORK_REQUIRED
                        </h4>
                        <p className="text-[13px] text-[#101010]/70 leading-[1.5] font-mono">
                          Your recovery wallet must support the Base network.
                          Ensure you have secure access to your recovery wallet
                          before adding it.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 bg-[#10b981]/5 border border-[#10b981]/20">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-7 w-7 bg-[#10b981]/10 flex items-center justify-center">
                          <ShieldCheck className="h-4 w-4 text-[#10b981]" />
                        </div>
                        <h3 className="text-[15px] font-mono text-[#101010]">
                          BENEFITS
                        </h3>
                      </div>
                      <ul className="space-y-3">
                        {[
                          'Enhanced account security',
                          'Account recovery capability',
                          'Protection against authentication loss',
                          'Peace of mind for valuable accounts',
                        ].map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="h-4 w-4 bg-[#10b981]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="h-1.5 w-1.5 bg-[#10b981]" />
                            </div>
                            <span className="text-[13px] text-[#101010]/70 leading-[1.5] font-mono">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-5 bg-[#ef4444]/5 border border-[#ef4444]/20">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-7 w-7 bg-[#ef4444]/10 flex items-center justify-center">
                          <ShieldAlert className="h-4 w-4 text-[#ef4444]" />
                        </div>
                        <h3 className="text-[15px] font-mono text-[#101010]">
                          CONSIDERATIONS
                        </h3>
                      </div>
                      <ul className="space-y-3">
                        {[
                          'Additional entry point to secure',
                          'Increased setup complexity',
                          'Must support Base network',
                          'Requires secure wallet storage',
                        ].map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="h-4 w-4 bg-[#ef4444]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="h-1.5 w-1.5 bg-[#ef4444]" />
                            </div>
                            <span className="text-[13px] text-[#101010]/70 leading-[1.5] font-mono">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Multi-chain Safe Owner Sync */}
        <div className="bg-white border border-dashed border-[#1B29FF]/30">
          <div className="border-b border-[#1B29FF]/20 px-5 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#1B29FF]" />
                <h3 className="text-[15px] font-mono text-[#101010]">
                  MULTICHAIN::SYNC
                </h3>
              </div>
              <button
                onClick={() => setShowMultiChainSync(!showMultiChainSync)}
                className="text-[13px] text-[#1B29FF] hover:text-[#1420CC] transition-colors flex items-center gap-1 font-mono"
              >
                <ChevronRight
                  className={cn(
                    'h-4 w-4 transition-transform',
                    showMultiChainSync && 'rotate-90',
                  )}
                />
                {showMultiChainSync ? 'Hide' : 'Show'}
              </button>
            </div>
            <p className="text-[13px] text-[#101010]/50 font-mono mt-1">
              Compare every workspace Safe to the canonical Base
              owners/threshold
            </p>
          </div>

          {showMultiChainSync && (
            <div className="p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => void checkMultiChainSync()}
                  disabled={isCheckingMultiChainSync || isLoadingSafes}
                  className="border-[#1B29FF]/30 text-[#1B29FF] hover:bg-[#1B29FF]/5 font-mono"
                >
                  {isCheckingMultiChainSync ? 'Checking…' : 'Check sync'}
                </Button>

                {canonicalBasePrimarySafe?.safeAddress && (
                  <p className="text-[12px] text-[#101010]/60 font-mono">
                    Canonical: {getChainDisplayName(SUPPORTED_CHAINS.BASE)}{' '}
                    primary ({canonicalBasePrimarySafe.safeAddress.slice(0, 6)}…
                    {canonicalBasePrimarySafe.safeAddress.slice(-4)})
                  </p>
                )}
              </div>

              {canonicalOwnership && (
                <div className="border border-[#1B29FF]/20 bg-[#1B29FF]/5 p-3">
                  <p className="text-[12px] text-[#101010]/70 font-mono">
                    Base owners: {canonicalOwnership.owners.length} · threshold:{' '}
                    {canonicalOwnership.threshold}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                {(userSafes || []).map((safe) => {
                  const chainId = Number(safe.chainId);
                  const safeAddress = String(safe.safeAddress);
                  const key = makeSafeKey(chainId, safeAddress);
                  const ownership = safeOwnershipByKey[key];

                  const isCanonical =
                    chainId === SUPPORTED_CHAINS.BASE &&
                    safe.safeType === 'primary' &&
                    canonicalBasePrimarySafe?.safeAddress?.toLowerCase() ===
                      safeAddress.toLowerCase();

                  const normalize = (a: string) => a.toLowerCase();
                  const canonicalOwners = canonicalOwnership?.owners ?? [];
                  const canonicalSet = new Set(
                    canonicalOwners.map((o) => normalize(o)),
                  );

                  const currentOwners =
                    ownership && ownership.deployed ? ownership.owners : [];
                  const currentSet = new Set(
                    currentOwners.map((o) => normalize(o)),
                  );

                  const ownersToAdd = canonicalOwners.filter(
                    (o) => !currentSet.has(normalize(o)),
                  );
                  const ownersToRemove = currentOwners.filter(
                    (o) => !canonicalSet.has(normalize(o)),
                  );
                  const thresholdMismatch =
                    canonicalOwnership &&
                    ownership &&
                    ownership.deployed &&
                    ownership.threshold !== canonicalOwnership.threshold;

                  const isInSync =
                    !!canonicalOwnership &&
                    !!ownership &&
                    ownership.deployed &&
                    ownersToAdd.length === 0 &&
                    ownersToRemove.length === 0 &&
                    !thresholdMismatch;

                  return (
                    <div
                      key={key}
                      className="flex flex-col gap-2 border border-[#1B29FF]/20 bg-white p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-mono text-[#101010]">
                            {getChainDisplayName(chainId as any)} ·{' '}
                            {safe.safeType}
                          </p>
                          <p className="text-[12px] text-[#1B29FF]/70 font-mono break-all">
                            {safeAddress}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {isCanonical ? (
                            <span className="text-[11px] px-2 py-1 bg-[#1B29FF]/10 text-[#1B29FF] font-mono">
                              CANONICAL
                            </span>
                          ) : isInSync ? (
                            <span className="text-[11px] px-2 py-1 bg-[#10b981]/10 text-[#10b981] font-mono">
                              IN_SYNC
                            </span>
                          ) : (
                            <span className="text-[11px] px-2 py-1 bg-[#f59e0b]/10 text-[#f59e0b] font-mono">
                              DRIFT
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-[12px] text-[#101010]/70 font-mono">
                          {ownership ? (
                            ownership.deployed ? (
                              <>
                                Owners: {ownership.owners.length} · Threshold:{' '}
                                {ownership.threshold}
                              </>
                            ) : (
                              <>NOT_DEPLOYED</>
                            )
                          ) : (
                            <>NOT_CHECKED</>
                          )}
                        </p>

                        <div className="flex items-center gap-2">
                          {!isCanonical && (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={
                                !canonicalOwnership ||
                                !ownership ||
                                !ownership.deployed ||
                                isInSync ||
                                syncingSafeKey === key
                              }
                              onClick={() =>
                                void syncSafeToBase({
                                  chainId,
                                  safeAddress,
                                })
                              }
                              className="border-[#1B29FF]/30 text-[#1B29FF] hover:bg-[#1B29FF]/5 font-mono"
                            >
                              {syncingSafeKey === key
                                ? 'Syncing…'
                                : 'Sync to Base'}
                            </Button>
                          )}
                        </div>
                      </div>

                      {ownership &&
                        ownership.deployed &&
                        !isCanonical &&
                        !isInSync && (
                          <p className="text-[12px] text-[#101010]/60 font-mono">
                            +{ownersToAdd.length} · -{ownersToRemove.length}
                            {thresholdMismatch ? ' · threshold_mismatch' : ''}
                          </p>
                        )}

                      {ownership && !ownership.deployed && ownership.error && (
                        <p className="text-[12px] text-[#ef4444] font-mono">
                          ERROR: {ownership.error}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Technical Details - Progressive Disclosure */}
        <div className="bg-white border border-dashed border-[#1B29FF]/30">
          <div className="border-b border-[#1B29FF]/20 px-5 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-[#1B29FF]" />
                <h3 className="text-[15px] font-mono text-[#101010]">
                  DEBUG::TECHNICAL
                </h3>
              </div>
              <button
                onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                className="text-[13px] text-[#1B29FF] hover:text-[#1420CC] transition-colors flex items-center gap-1 font-mono"
              >
                <ChevronRight
                  className={cn(
                    'h-4 w-4 transition-transform',
                    showTechnicalDetails && 'rotate-90',
                  )}
                />
                {showTechnicalDetails ? 'Hide' : 'Show'} details
              </button>
            </div>
            <p className="text-[13px] text-[#101010]/50 font-mono mt-1">
              Developer wallet addresses and identifiers for advanced users
            </p>
          </div>

          {showTechnicalDetails && (
            <div className="p-5 sm:p-6 space-y-5">
              {/* Warning */}
              <Alert className="border-[#ef4444]/20 bg-[#ef4444]/5">
                <AlertTriangle className="h-4 w-4 text-[#ef4444]" />
                <AlertTitle className="text-[14px] font-mono text-[#101010]">
                  WARNING::DO_NOT_SEND_FUNDS
                </AlertTitle>
                <AlertDescription className="text-[13px] text-[#101010]/70 font-mono">
                  The Privy wallet addresses below are internal. Sending funds
                  directly may result in permanent loss. Use your primary Safe
                  address for receiving payments.
                </AlertDescription>
              </Alert>

              {/* Primary Safe Address */}
              <div className="space-y-2">
                <label className="text-[12px] font-mono text-[#1B29FF] uppercase tracking-[0.14em]">
                  safe.primary.address
                </label>
                <p className="text-[12px] text-[#101010]/60 font-mono mb-2">
                  Your main account address for receiving and managing funds
                </p>
                <div className="flex items-center gap-2">
                  {isLoadingSafes ? (
                    <Skeleton className="h-10 flex-1" />
                  ) : (
                    <>
                      <code className="flex-1 px-3 py-2 bg-[#1B29FF]/5 border border-[#1B29FF]/20 text-[12px] font-mono break-all text-[#1B29FF]">
                        {primarySafeAddress || 'null'}
                      </code>
                      {primarySafeAddress && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            copyToClipboard(primarySafeAddress, 'safe')
                          }
                          className="shrink-0 h-9 border-[#1B29FF]/30 text-[#1B29FF] hover:bg-[#1B29FF]/5"
                        >
                          {copiedSafe ? (
                            <CheckCircle2 className="h-4 w-4 text-[#10b981]" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Privy Smart Wallet */}
              <div className="space-y-2">
                <label className="text-[12px] font-mono text-[#1B29FF] uppercase tracking-[0.14em]">
                  privy.smart_wallet.address
                </label>
                <p className="text-[12px] text-[#101010]/60 font-mono mb-2">
                  Internal smart wallet managed by Privy
                </p>
                <div className="flex items-center gap-2">
                  {smartWalletAddress ? (
                    <>
                      <code className="flex-1 px-3 py-2 bg-[#1B29FF]/5 border border-[#1B29FF]/20 text-[12px] font-mono break-all text-[#1B29FF]/70">
                        {smartWalletAddress}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          copyToClipboard(smartWalletAddress, 'smart')
                        }
                        className="shrink-0 h-9 border-[#1B29FF]/30 text-[#1B29FF] hover:bg-[#1B29FF]/5"
                      >
                        {copiedSmart ? (
                          <CheckCircle2 className="h-4 w-4 text-[#10b981]" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </>
                  ) : (
                    <code className="flex-1 px-3 py-2 bg-[#1B29FF]/5 border border-[#1B29FF]/20 text-[12px] font-mono text-[#101010]/60">
                      null
                    </code>
                  )}
                </div>
              </div>

              {/* Privy Embedded Wallet */}
              <div className="space-y-2">
                <label className="text-[12px] font-mono text-[#1B29FF] uppercase tracking-[0.14em]">
                  privy.embedded_wallet.address
                </label>
                <p className="text-[12px] text-[#101010]/60 font-mono mb-2">
                  Internal embedded wallet managed by Privy
                </p>
                <div className="flex items-center gap-2">
                  {embeddedWallet?.address ? (
                    <>
                      <code className="flex-1 px-3 py-2 bg-[#1B29FF]/5 border border-[#1B29FF]/20 text-[12px] font-mono break-all text-[#1B29FF]/70">
                        {embeddedWallet.address}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          copyToClipboard(embeddedWallet.address, 'embedded')
                        }
                        className="shrink-0 h-9 border-[#1B29FF]/30 text-[#1B29FF] hover:bg-[#1B29FF]/5"
                      >
                        {copiedEmbedded ? (
                          <CheckCircle2 className="h-4 w-4 text-[#10b981]" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </>
                  ) : (
                    <code className="flex-1 px-3 py-2 bg-[#1B29FF]/5 border border-[#1B29FF]/20 text-[12px] font-mono text-[#101010]/60">
                      loading...
                    </code>
                  )}
                </div>
              </div>

              {/* Privy User ID */}
              <div className="space-y-2">
                <label className="text-[12px] font-mono text-[#1B29FF] uppercase tracking-[0.14em]">
                  privy.user.did
                </label>
                <p className="text-[12px] text-[#101010]/60 font-mono mb-2">
                  For debugging and developer support
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-[#1B29FF]/5 border border-[#1B29FF]/20 text-[12px] font-mono break-all text-[#1B29FF]/70">
                    {user?.id || 'NOT_AUTHENTICATED'}
                  </code>
                  {user?.id && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(user.id, 'did')}
                      className="shrink-0 h-9 border-[#1B29FF]/30 text-[#1B29FF] hover:bg-[#1B29FF]/5"
                    >
                      {copiedDid ? (
                        <CheckCircle2 className="h-4 w-4 text-[#10b981]" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
