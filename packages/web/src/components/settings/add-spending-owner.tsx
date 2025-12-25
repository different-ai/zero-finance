'use client';

import { useState, useCallback } from 'react';
import {
  Address,
  isAddress,
  encodeFunctionData,
  createPublicClient,
  http,
} from 'viem';
import { getBaseRpcUrl } from '@/lib/base-rpc-url';
import { base } from 'viem/chains';
import { useSafeRelay } from '@/hooks/use-safe-relay';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { MetaTransactionData } from '@safe-global/safe-core-sdk-types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertCircle,
  Loader2,
  UserPlus,
  Check,
  Wallet,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const safeAbi = [
  {
    constant: true,
    inputs: [],
    name: 'getThreshold',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'owner', type: 'address' },
      { name: '_threshold', type: 'uint256' },
    ],
    name: 'addOwnerWithThreshold',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

const RPC_URL = getBaseRpcUrl();
const publicClient = createPublicClient({
  chain: base,
  transport: http(RPC_URL),
});

interface AddSpendingOwnerProps {
  /** Safe address to add the owner to */
  safeAddress: Address;
  /** Member's smart wallet address (prefilled) */
  memberSmartWalletAddress: Address;
  /** Member's display name */
  memberName: string;
  /** Whether to use technical (bimodal) styling */
  isTechnical?: boolean;
  /** Callback when owner is successfully added */
  onSuccess?: () => void;
}

export function AddSpendingOwner({
  safeAddress,
  memberSmartWalletAddress,
  memberName,
  isTechnical = false,
  onSuccess,
}: AddSpendingOwnerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { ready: isRelayReady, send: sendSponsoredTx } =
    useSafeRelay(safeAddress);

  const handleAddOwner = useCallback(async () => {
    if (!isRelayReady || !safeAddress) {
      toast.error('Safe relay service not ready.');
      return;
    }
    if (!isAddress(memberSmartWalletAddress)) {
      toast.error('Invalid smart wallet address.');
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading('Preparing transaction...');

    try {
      toast.info('Fetching current Safe threshold...', { id: toastId });
      const currentThreshold = await publicClient.readContract({
        address: safeAddress,
        abi: safeAbi,
        functionName: 'getThreshold',
      });

      // Keep the same threshold (1 of N)
      const newThreshold = currentThreshold;
      toast.info(`Adding ${memberName} as spending owner...`, { id: toastId });

      const txData = encodeFunctionData({
        abi: safeAbi,
        functionName: 'addOwnerWithThreshold',
        args: [memberSmartWalletAddress, newThreshold],
      });

      const transactions: MetaTransactionData[] = [
        {
          to: safeAddress,
          value: '0',
          data: txData,
        },
      ];

      toast.loading('Sending transaction...', { id: toastId });
      const txHash = await sendSponsoredTx(transactions);

      toast.success(`${memberName} is now a spending owner!`, {
        id: toastId,
        description: 'Transaction confirmed on-chain.',
        action: {
          label: 'View on Explorer',
          onClick: () =>
            window.open(`https://basescan.org/tx/${txHash}`, '_blank'),
        },
      });

      setIsOpen(false);
      onSuccess?.();
    } catch (error: any) {
      console.error('Error adding spending owner:', error);
      let message = 'An unknown error occurred.';
      if (error?.message) {
        try {
          const parsedError = JSON.parse(
            error.message.substring(error.message.indexOf('{')),
          );
          message =
            parsedError.error?.message || parsedError.message || error.message;
        } catch {
          message = error.shortMessage || error.message;
        }
      }
      toast.error(`Failed to add spending owner: ${message}`, { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  }, [
    safeAddress,
    memberSmartWalletAddress,
    memberName,
    isRelayReady,
    sendSponsoredTx,
    onSuccess,
  ]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={cn(
          'gap-1.5',
          isTechnical
            ? 'border-[#1B29FF]/30 text-[#1B29FF] hover:bg-[#1B29FF]/5 font-mono text-xs'
            : 'border-[#1B29FF]/20 text-[#1B29FF] hover:bg-[#1B29FF]/5',
        )}
      >
        <UserPlus className="h-3.5 w-3.5" />
        {isTechnical ? 'Make Owner' : 'Make Spending Owner'}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className={cn(isTechnical && 'font-mono')}>
          <DialogHeader>
            <DialogTitle className={cn(isTechnical && 'font-mono')}>
              {isTechnical ? 'ADD_SAFE_OWNER' : 'Add Spending Owner'}
            </DialogTitle>
            <DialogDescription className={cn(isTechnical && 'font-mono')}>
              {isTechnical
                ? `Grant ${memberName} transaction signing privileges`
                : `Allow ${memberName} to move funds from this account`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Member Info */}
            <div
              className={cn(
                'p-4 border rounded-lg',
                isTechnical
                  ? 'border-[#1B29FF]/20 bg-[#1B29FF]/5'
                  : 'border-[#101010]/10 bg-[#F7F7F2]',
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    isTechnical ? 'bg-[#1B29FF]/10' : 'bg-[#1B29FF]/10',
                  )}
                >
                  <Wallet className="h-5 w-5 text-[#1B29FF]" />
                </div>
                <div>
                  <p className={cn('font-medium', isTechnical && 'font-mono')}>
                    {memberName}
                  </p>
                  <p
                    className={cn(
                      'text-sm font-mono',
                      isTechnical ? 'text-[#1B29FF]/70' : 'text-[#101010]/50',
                    )}
                  >
                    {formatAddress(memberSmartWalletAddress)}
                  </p>
                </div>
              </div>
            </div>

            {/* What this means */}
            <div className="space-y-2">
              <p
                className={cn(
                  'text-sm font-medium',
                  isTechnical && 'font-mono',
                )}
              >
                {isTechnical
                  ? 'PERMISSIONS_GRANTED:'
                  : 'This will allow them to:'}
              </p>
              <ul
                className={cn(
                  'text-sm space-y-1.5',
                  isTechnical
                    ? 'text-[#101010]/60 font-mono'
                    : 'text-[#101010]/70',
                )}
              >
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#10B981]" />
                  {isTechnical
                    ? 'Execute Safe transactions'
                    : 'Transfer funds to bank accounts'}
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#10B981]" />
                  {isTechnical
                    ? 'Sign multi-sig approvals'
                    : 'Send crypto to external wallets'}
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#10B981]" />
                  {isTechnical
                    ? 'Manage vault positions'
                    : 'Manage earning balance'}
                </li>
              </ul>
            </div>

            {!isRelayReady && (
              <Alert className="border-amber-200 bg-amber-50">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription
                  className={cn(
                    'text-amber-800 text-sm',
                    isTechnical && 'font-mono',
                  )}
                >
                  {isTechnical
                    ? 'Relay service initializing...'
                    : 'Please wait while we connect to your account...'}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isProcessing}
              className={cn(isTechnical && 'font-mono')}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddOwner}
              disabled={isProcessing || !isRelayReady}
              className={cn(
                'bg-[#1B29FF] hover:bg-[#1420CC]',
                isTechnical && 'font-mono',
              )}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isTechnical ? 'Processing...' : 'Adding...'}
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  {isTechnical ? 'Add Owner' : 'Add Spending Owner'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/**
 * Component to show when a member doesn't have a smart wallet yet.
 * Shows a button that opens a dialog explaining why login is needed.
 */
export function MemberNeedsLogin({
  memberName,
  memberEmail,
  isTechnical = false,
}: {
  memberName: string;
  memberEmail?: string;
  isTechnical?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={cn(
          'gap-1.5',
          isTechnical
            ? 'border-[#101010]/20 text-[#101010]/60 hover:bg-[#101010]/5 font-mono text-xs'
            : 'border-[#101010]/20 text-[#101010]/60 hover:bg-[#101010]/5',
        )}
      >
        <UserPlus className="h-3.5 w-3.5" />
        {isTechnical ? 'Make Owner' : 'Make Spending Owner'}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className={cn(isTechnical && 'font-mono')}>
          <DialogHeader>
            <DialogTitle className={cn(isTechnical && 'font-mono')}>
              {isTechnical ? 'LOGIN_REQUIRED' : 'Login Required'}
            </DialogTitle>
            <DialogDescription className={cn(isTechnical && 'font-mono')}>
              {isTechnical
                ? `${memberName} must log in to create their wallet`
                : `${memberName} needs to log in first`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Explanation */}
            <div
              className={cn(
                'p-4 border rounded-lg',
                isTechnical
                  ? 'border-[#1B29FF]/20 bg-[#1B29FF]/5'
                  : 'border-[#101010]/10 bg-[#F7F7F2]',
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                    isTechnical ? 'bg-[#1B29FF]/10' : 'bg-amber-100',
                  )}
                >
                  <Clock
                    className={cn(
                      'h-5 w-5',
                      isTechnical ? 'text-[#1B29FF]' : 'text-amber-600',
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <p
                    className={cn(
                      'text-[14px] font-medium',
                      isTechnical ? 'font-mono' : '',
                    )}
                  >
                    {isTechnical
                      ? 'Smart wallet not initialized'
                      : 'Wallet not created yet'}
                  </p>
                  <p
                    className={cn(
                      'text-[13px]',
                      isTechnical
                        ? 'font-mono text-[#101010]/60'
                        : 'text-[#101010]/70',
                    )}
                  >
                    {isTechnical
                      ? `When ${memberName} logs in, a smart wallet will be created automatically. This wallet address is needed to add them as a Safe owner.`
                      : `When ${memberName} logs in for the first time, we'll create a secure wallet for them. Once they've logged in, you can add them as a spending owner.`}
                  </p>
                </div>
              </div>
            </div>

            {/* What to do */}
            <div className="space-y-2">
              <p
                className={cn(
                  'text-sm font-medium',
                  isTechnical && 'font-mono',
                )}
              >
                {isTechnical ? 'NEXT_STEPS:' : 'What to do:'}
              </p>
              <ul
                className={cn(
                  'text-sm space-y-1.5',
                  isTechnical
                    ? 'text-[#101010]/60 font-mono'
                    : 'text-[#101010]/70',
                )}
              >
                <li className="flex items-start gap-2">
                  <span className="text-[#1B29FF] font-medium">1.</span>
                  {memberEmail ? (
                    <span>
                      Ask {memberName} to log in at{' '}
                      <span className="font-medium">0.finance</span>
                    </span>
                  ) : (
                    <span>Share the login link with {memberName}</span>
                  )}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1B29FF] font-medium">2.</span>
                  <span>
                    {isTechnical
                      ? 'Their smart wallet will be auto-provisioned'
                      : 'Their wallet will be created automatically'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1B29FF] font-medium">3.</span>
                  <span>
                    {isTechnical
                      ? 'Return here to grant Safe ownership'
                      : 'Come back here to make them a spending owner'}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className={cn(isTechnical && 'font-mono')}
            >
              {isTechnical ? 'Close' : 'Got it'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
