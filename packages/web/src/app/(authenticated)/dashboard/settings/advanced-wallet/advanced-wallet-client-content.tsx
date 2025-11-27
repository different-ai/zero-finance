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
} from 'lucide-react';
import { Address } from 'viem';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useSmartWallet } from '@/hooks/use-smart-wallet';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useMemo } from 'react';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

export function AdvancedWalletClientContent() {
  const { user } = usePrivy();
  const { wallets } = useWallets();
  const { smartWalletAddress } = useSmartWallet();
  const [copiedDid, setCopiedDid] = useState(false);
  const [copiedSafe, setCopiedSafe] = useState(false);
  const [copiedSmart, setCopiedSmart] = useState(false);
  const [copiedEmbedded, setCopiedEmbedded] = useState(false);
  const [showRecoveryInfo, setShowRecoveryInfo] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  const {
    data: userSafes,
    isLoading: isLoadingSafes,
    error: errorSafes,
  } = trpc.settings.userSafes.list.useQuery();

  const primarySafeAddress =
    (userSafes?.find((safe) => safe.safeType === 'primary')?.safeAddress as
      | Address
      | undefined) ?? (userSafes?.[0]?.safeAddress as Address | undefined);

  const embeddedWallet = useMemo(
    () => wallets.find((w: any) => w.walletClientType === 'privy'),
    [wallets],
  );

  const copyToClipboard = async (
    text: string,
    type: 'did' | 'safe' | 'smart' | 'embedded',
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
      } else {
        setCopiedEmbedded(true);
        setTimeout(() => setCopiedEmbedded(false), 2000);
      }
      const label = {
        did: 'User DID',
        safe: 'Safe address',
        smart: 'Smart wallet address',
        embedded: 'Embedded wallet address',
      }[type];
      toast({
        title: 'Copied!',
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
    <div className="min-h-screen bg-[#F7F7F2]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#F7F7F2] border-b border-[#101010]/10">
        <div className="h-[60px] flex items-center px-4 sm:px-6 max-w-[1400px] mx-auto">
          <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mr-3">
            Settings
          </p>
          <h1 className="font-serif text-[24px] sm:text-[28px] leading-[1] text-[#101010]">
            Advanced Wallet
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 py-6 sm:py-8 max-w-[1400px] mx-auto space-y-6">
        <div>
          <p className="text-[14px] text-[#101010]/60">
            Manage recovery wallets and view technical details
          </p>
        </div>

        {/* Recovery Wallet Manager - Moved Up */}
        {!isLoadingSafes && !errorSafes && (
          <RecoveryWalletManager primarySafeAddress={primarySafeAddress} />
        )}

        {isLoadingSafes && <Skeleton className="h-64 w-full rounded-card-lg" />}

        {errorSafes && (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error Loading Wallets</AlertTitle>
            <AlertDescription>
              Could not load your wallet details. Please try again later.
            </AlertDescription>
          </Alert>
        )}

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
                Recovery wallets provide an additional layer of security for
                your account. They can be used to recover access if your primary
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
                <div className="mt-6 space-y-6">
                  <div className="p-5 bg-[#101010]/5 border border-[#101010]/10 rounded-md">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-7 w-7 rounded-full bg-[#1B29FF]/10 flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-[#1B29FF]" />
                      </div>
                      <h3 className="text-[15px] font-medium text-[#101010]">
                        How to Use a Recovery Wallet
                      </h3>
                    </div>
                    <ol className="space-y-3 text-[13px] text-[#101010]/70 leading-[1.5] pl-1">
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
                          Add the wallet address as a recovery wallet below
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

                  <div className="p-4 bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-md">
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-[#f59e0b]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-[#f59e0b]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[14px] font-medium text-[#101010] mb-1">
                          Important: Base Network Required
                        </h4>
                        <p className="text-[13px] text-[#101010]/70 leading-[1.5]">
                          Your recovery wallet must support the Base network.
                          Ensure you have secure access to your recovery wallet
                          before adding it.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 bg-[#10b981]/5 border border-[#10b981]/20 rounded-md">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-7 w-7 rounded-full bg-[#10b981]/10 flex items-center justify-center">
                          <ShieldCheck className="h-4 w-4 text-[#10b981]" />
                        </div>
                        <h3 className="text-[15px] font-medium text-[#101010]">
                          Benefits
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
                            <div className="h-4 w-4 rounded-full bg-[#10b981]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                            </div>
                            <span className="text-[13px] text-[#101010]/70 leading-[1.5]">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-5 bg-[#ef4444]/5 border border-[#ef4444]/20 rounded-md">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-7 w-7 rounded-full bg-[#ef4444]/10 flex items-center justify-center">
                          <ShieldAlert className="h-4 w-4 text-[#ef4444]" />
                        </div>
                        <h3 className="text-[15px] font-medium text-[#101010]">
                          Considerations
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
                            <div className="h-4 w-4 rounded-full bg-[#ef4444]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
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

        {/* Technical Details - Progressive Disclosure */}
        <Card className="border-dashed border-[#101010]/10 shadow-[0_2px_8px_rgba(16,16,16,0.04)]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-[#101010]/60" />
                <CardTitle className="text-[15px] font-medium">
                  Technical Details
                </CardTitle>
              </div>
              <button
                onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                className="text-[13px] text-[#101010]/60 hover:text-[#1B29FF] transition-colors flex items-center gap-1 font-medium"
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
            <CardDescription className="text-[13px]">
              Developer wallet addresses and identifiers for advanced users
            </CardDescription>
          </CardHeader>

          {showTechnicalDetails && (
            <CardContent className="space-y-5 pt-0">
              {/* Warning */}
              <Alert className="border-[#ef4444]/20 bg-[#ef4444]/5">
                <AlertTriangle className="h-4 w-4 text-[#ef4444]" />
                <AlertTitle className="text-[14px] font-medium text-[#101010]">
                  Do Not Send Funds to Internal Addresses
                </AlertTitle>
                <AlertDescription className="text-[13px] text-[#101010]/70">
                  The Privy wallet addresses below are internal. Sending funds
                  directly may result in permanent loss. Use your primary Safe
                  address for receiving payments.
                </AlertDescription>
              </Alert>

              {/* Primary Safe Address */}
              <div className="space-y-2">
                <label className="text-[12px] font-medium text-[#101010]/60 uppercase tracking-[0.14em]">
                  Primary Safe Address
                </label>
                <p className="text-[12px] text-[#101010]/60 mb-2">
                  Your main account address for receiving and managing funds
                </p>
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

              {/* Privy Smart Wallet */}
              <div className="space-y-2">
                <label className="text-[12px] font-medium text-[#101010]/60 uppercase tracking-[0.14em]">
                  Privy Smart Wallet Address
                </label>
                <p className="text-[12px] text-[#101010]/60 mb-2">
                  Internal smart wallet managed by Privy
                </p>
                <div className="flex items-center gap-2">
                  {smartWalletAddress ? (
                    <>
                      <code className="flex-1 px-3 py-2 bg-[#101010]/5 border border-[#101010]/10 rounded-md text-[12px] font-mono break-all text-[#101010]/80">
                        {smartWalletAddress}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          copyToClipboard(smartWalletAddress, 'smart')
                        }
                        className="shrink-0 h-9"
                      >
                        {copiedSmart ? (
                          <CheckCircle2 className="h-4 w-4 text-[#10b981]" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </>
                  ) : (
                    <code className="flex-1 px-3 py-2 bg-[#101010]/5 border border-[#101010]/10 rounded-md text-[12px] text-[#101010]/60">
                      No smart wallet found
                    </code>
                  )}
                </div>
              </div>

              {/* Privy Embedded Wallet */}
              <div className="space-y-2">
                <label className="text-[12px] font-medium text-[#101010]/60 uppercase tracking-[0.14em]">
                  Privy Embedded Wallet Address
                </label>
                <p className="text-[12px] text-[#101010]/60 mb-2">
                  Internal embedded wallet managed by Privy
                </p>
                <div className="flex items-center gap-2">
                  {embeddedWallet?.address ? (
                    <>
                      <code className="flex-1 px-3 py-2 bg-[#101010]/5 border border-[#101010]/10 rounded-md text-[12px] font-mono break-all text-[#101010]/80">
                        {embeddedWallet.address}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          copyToClipboard(embeddedWallet.address, 'embedded')
                        }
                        className="shrink-0 h-9"
                      >
                        {copiedEmbedded ? (
                          <CheckCircle2 className="h-4 w-4 text-[#10b981]" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </>
                  ) : (
                    <code className="flex-1 px-3 py-2 bg-[#101010]/5 border border-[#101010]/10 rounded-md text-[12px] text-[#101010]/60">
                      Loading embedded wallet...
                    </code>
                  )}
                </div>
              </div>

              {/* Privy User ID */}
              <div className="space-y-2">
                <label className="text-[12px] font-medium text-[#101010]/60 uppercase tracking-[0.14em]">
                  Privy User ID
                </label>
                <p className="text-[12px] text-[#101010]/60 mb-2">
                  For debugging and developer support
                </p>
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
            </CardContent>
          )}
        </Card>
      </main>
    </div>
  );
}
