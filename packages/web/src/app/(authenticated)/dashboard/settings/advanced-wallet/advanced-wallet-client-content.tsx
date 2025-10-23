'use client';

import { RecoveryWalletManager } from '@/components/settings/recovery-wallet-manager';
import { WalletAddressCard } from '../components/wallet-address-card';
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
  Wallet,
} from 'lucide-react';
import { Address } from 'viem';
import { usePrivy } from '@privy-io/react-auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

export function AdvancedWalletClientContent() {
  const { user } = usePrivy();
  const [copiedDid, setCopiedDid] = useState(false);
  const [copiedSafe, setCopiedSafe] = useState(false);
  const [showRecoveryInfo, setShowRecoveryInfo] = useState(false);

  const {
    data: userSafes,
    isLoading: isLoadingSafes,
    error: errorSafes,
  } = trpc.settings.userSafes.list.useQuery();

  const primarySafeAddress =
    (userSafes?.find((safe) => safe.safeType === 'primary')?.safeAddress as
      | Address
      | undefined) ?? (userSafes?.[0]?.safeAddress as Address | undefined);

  const copyToClipboard = async (text: string, type: 'did' | 'safe') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'did') {
        setCopiedDid(true);
        setTimeout(() => setCopiedDid(false), 2000);
      } else {
        setCopiedSafe(true);
        setTimeout(() => setCopiedSafe(false), 2000);
      }
      toast({
        title: 'Copied!',
        description: `${type === 'did' ? 'User DID' : 'Safe address'} copied to clipboard`,
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
    <div className="w-full space-y-8">
      <div>
        <h1 className="text-[24px] font-semibold tracking-[-0.01em] text-[#101010]">
          Advanced Wallet Settings
        </h1>
        <p className="text-[14px] text-[#101010]/60 mt-2">
          Manage recovery wallets and view technical details
        </p>
      </div>

      <div className="bg-white border border-[#101010]/10 rounded-card-lg p-6 shadow-[0_2px_8px_rgba(16,16,16,0.04)]">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-full bg-[#1B29FF]/10 flex items-center justify-center flex-shrink-0">
            <Info className="h-5 w-5 text-[#1B29FF]" />
          </div>
          <div className="flex-1">
            <h2 className="text-[16px] font-medium text-[#101010] mb-2">
              About Recovery Wallets
            </h2>
            <p className="text-[14px] leading-[1.5] text-[#101010]/70 mb-4">
              Recovery wallets provide an additional layer of security for your
              account. They can be used to recover access if your primary
              authentication method is unavailable.
            </p>

            <button
              onClick={() => setShowRecoveryInfo(!showRecoveryInfo)}
              className="text-[13px] text-[#101010]/60 hover:text-[#1B29FF] transition-colors flex items-center gap-1 font-medium"
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
              <div className="mt-4 space-y-6">
                <div className="p-4 bg-[#101010]/5 border border-[#101010]/10 rounded-md">
                  <h3 className="text-[14px] font-medium text-[#101010] mb-3 flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-[#1B29FF]" />
                    How to Use a Recovery Wallet
                  </h3>
                  <ol className="space-y-2 text-[13px] text-[#101010]/70 leading-[1.5] list-decimal list-inside">
                    <li>
                      Connect a wallet that supports the Base network (e.g.,
                      MetaMask, Coinbase Wallet, or Rainbow)
                    </li>
                    <li>Add the wallet address as a recovery wallet below</li>
                    <li>
                      If you lose access to your account, contact support with
                      your recovery wallet
                    </li>
                    <li>
                      Sign a verification message with your recovery wallet to
                      prove ownership
                    </li>
                    <li>Support will help restore access to your account</li>
                  </ol>
                  <div className="mt-3 p-3 bg-[#f59e0b]/10 border border-[#f59e0b]/20 rounded-md">
                    <p className="text-[12px] text-[#101010]/80 flex items-start gap-2">
                      <span className="text-[#f59e0b] flex-shrink-0 mt-0.5">
                        ⚠️
                      </span>
                      <span>
                        <strong>Important:</strong> Your recovery wallet must
                        support the Base network. Ensure you have access to your
                        recovery wallet before adding it.
                      </span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#10b981]/5 border border-[#10b981]/20 rounded-md">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-6 w-6 rounded-full bg-[#10b981]/10 flex items-center justify-center">
                        <ShieldCheck className="h-3.5 w-3.5 text-[#10b981]" />
                      </div>
                      <h3 className="text-[14px] font-medium text-[#101010]">
                        Upsides
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {[
                        'Additional security layer',
                        'Account recovery capability',
                        'Protection against primary auth loss',
                        'Peace of mind for valuable accounts',
                      ].map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="h-4 w-4 rounded-full bg-[#10b981]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                          </div>
                          <span className="text-[13px] text-[#101010]/70 leading-[1.5]">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-[#ef4444]/5 border border-[#ef4444]/20 rounded-md">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-6 w-6 rounded-full bg-[#ef4444]/10 flex items-center justify-center">
                        <ShieldAlert className="h-3.5 w-3.5 text-[#ef4444]" />
                      </div>
                      <h3 className="text-[14px] font-medium text-[#101010]">
                        Considerations
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {[
                        'More entry points to secure',
                        'Increased complexity',
                        'Recovery wallet must be on Base',
                        'Requires secure wallet storage',
                      ].map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="h-4 w-4 rounded-full bg-[#ef4444]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-[#ef4444]" />
                          </div>
                          <span className="text-[13px] text-[#101010]/70 leading-[1.5]">
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

      {!isLoadingSafes && !errorSafes && (
        <div className="space-y-6">
          <WalletAddressCard />
          <RecoveryWalletManager primarySafeAddress={primarySafeAddress} />
        </div>
      )}

      {isLoadingSafes && (
        <div className="space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      )}

      {errorSafes && (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error Loading Wallets</AlertTitle>
          <AlertDescription>
            Could not load your wallet details. Please try again later.
          </AlertDescription>
        </Alert>
      )}

      <Card className="border-dashed border-[#101010]/10">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-[#101010]/60" />
            <CardTitle className="text-[15px] font-medium">
              Technical Details
            </CardTitle>
          </div>
          <CardDescription className="text-[13px]">
            For debugging and developer support
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-[12px] font-medium text-[#101010]/60 uppercase tracking-[0.14em]">
              Privy User ID
            </label>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 bg-[#101010]/5 border border-[#101010]/10 rounded-md text-[12px] font-mono break-all text-[#101010]/80">
                {user?.id || 'Not authenticated'}
              </code>
              {user?.id && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(user.id, 'did')}
                  className="shrink-0 h-9"
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

          <div className="space-y-2">
            <label className="text-[12px] font-medium text-[#101010]/60 uppercase tracking-[0.14em]">
              Primary Safe Address
            </label>
            <div className="flex items-center gap-2">
              {isLoadingSafes ? (
                <Skeleton className="h-10 flex-1" />
              ) : (
                <>
                  <code className="flex-1 px-3 py-2 bg-[#101010]/5 border border-[#101010]/10 rounded-md text-[12px] font-mono break-all text-[#101010]/80">
                    {primarySafeAddress || 'No Safe wallet found'}
                  </code>
                  {primarySafeAddress && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        copyToClipboard(primarySafeAddress, 'safe')
                      }
                      className="shrink-0 h-9"
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
        </CardContent>
      </Card>
    </div>
  );
}
