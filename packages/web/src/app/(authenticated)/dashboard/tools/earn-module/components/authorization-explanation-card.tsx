import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSafeRelay } from '@/hooks/use-safe-relay';
import { MetaTransactionData } from '@safe-global/safe-core-sdk-types';
import { encodeFunctionData, isAddress, Hex, parseAbiItem } from 'viem';

const addAuthorizedRelayerAbi = parseAbiItem('function addAuthorizedRelayer(address newRelayer)');

export function AuthorizationExplanationCard({ safeAddress }: { safeAddress?: Hex }) {
  const [relayer, setRelayer] = useState('');
  const { ready, send } = useSafeRelay(safeAddress);

  const handleAddRelayer = async () => {
    if (!ready || !safeAddress) return;
    if (!isAddress(relayer)) {
      alert('Invalid relayer address');
      return;
    }
    const earnModuleAddress = process.env.NEXT_PUBLIC_AUTO_EARN_MODULE_ADDRESS;
    if (!earnModuleAddress || !isAddress(earnModuleAddress)) {
      alert('Auto Earn Module address is not configured or invalid.');
      return;
    }

    const txs: MetaTransactionData[] = [
      {
        to: earnModuleAddress as Hex,
        value: '0',
        data: encodeFunctionData({
          abi: [addAuthorizedRelayerAbi],
          functionName: 'addAuthorizedRelayer',
          args: [relayer as Hex],
        }),
        operation: 0, // Call
      },
    ];
    try {
      const txHash = await send(txs, 150_000n); // Provide a gas estimate
      alert(`Relayer add transaction sent: ${txHash}`);
      setRelayer('');
    } catch (e: any) {
      alert(`Failed to send transaction: ${e.message}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
          Understanding Auto-Earn Authorization
        </CardTitle>
        <CardDescription>
          How the shared Earn Module manages permissions for relayers.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <p>
          The Auto-Earn Module contract is designed to be shared by many Safes.
          This multi-tenant approach requires a clear way to manage which
          relayers can trigger actions.
        </p>

        <div>
          <h4 className="font-semibold">Storage Layout:</h4>
          <pre className="mt-1 rounded-md bg-muted p-2 text-xs">
            <code>
              mapping(address relayer =&gt; bool) public authorizedRelayers;
            </code>
          </pre>
          <ul className="mt-1 list-disc pl-5 text-xs text-muted-foreground">
            <li>
              The key is the <strong>relayer EOA address</strong>.
            </li>
            <li>
              The value is a boolean indicating if the relayer is authorized globally for this module instance.
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold">
            Why `autoEarn()` needs a `safe` parameter when called directly (not via Safe execution):
          </h4>
          <p className="text-xs text-muted-foreground">
            The module needs to know which Safe the relayer is acting for:
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>
               When a Safe calls the module, `msg.sender` is the Safe. When your backend (relayer) calls directly, `msg.sender` is the relayer. The contract needs the explicit `safe` parameter in the latter case to know which Safe&apos;s context to operate under (e.g. which Safe&apos;s `accountConfig` to read).
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold">The Authorization Flow:</h4>
          <ol className="mt-1 list-decimal space-y-1 pl-5">
            <li>
              The Safe owner (or module `owner()`) executes a transaction on the module to call{' '}
              `addAuthorizedRelayer(yourBackendRelayer_address)`.
            </li>
            <li>
              This action sets `authorizedRelayers[yourBackendRelayer_address]`
              to `true`.
            </li>
            <li>
              Your backend (acting as `yourBackendRelayer_address`) can now
              directly call `autoEarn(token, amount, targetSafeAddress)` on the
              module. The module verifies the permission using `authorizedRelayers[msg.sender]`.
            </li>
            <li>
              If you want to authorize a *different* relayer, you (as Safe owner or module owner) would call `addAuthorizedRelayer(anotherRelayerAddress)` again. Each relayer needs to be authorized once.
            </li>
          </ol>
        </div>

        <div>
          <h4 className="font-semibold">Key Takeaways:</h4>
          <ul className="mt-1 list-disc pl-5">
            <li>
              The module can be used by many Safes. Relayer permissions are global to the module instance.
            </li>
            <li>
              To authorize a new relayer EOA, a one-time (and cheap) transaction to call `addAuthorizedRelayer()` on the module is needed. This must be done by the module `owner()` or by a Safe that *is* the `owner()` of the module.
            </li>
            <li>
              Once a relayer is whitelisted, it can trigger `autoEarn()`
              directly for any Safe that has *initialized* the module (i.e., called `onInstall`). This saves a relay
              call and the need for a Safe signature for each auto-earn event.
            </li>
          </ul>
        </div>
        <p className="text-xs text-muted-foreground">
          After `addAuthorizedRelayer(&#60;yourRelayer&#62;)` has been successfully called on the module (either by the module `owner()` or a Safe that is the module `owner()`), the
          `NotAuthorized` error (previously `OnlyAuthorizedRelayer`) should no longer occur for direct calls
          from `&#60;yourRelayer&#62;`.
        </p>
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Self-service: Whitelist a Relayer</h4>
          <p className="text-xs text-muted-foreground mb-2">
            If you are the Safe owner (or module owner), you can authorize a new relayer below.
            The transaction will be sent via your Safe.
          </p>
          <Input
            placeholder="0xrelayerAddress..."
            value={relayer}
            onChange={(e) => setRelayer(e.target.value)}
            className="mb-2"
            disabled={!safeAddress}
          />
          <Button
            size="sm"
            disabled={!ready || !safeAddress || !relayer || !isAddress(relayer)}
            onClick={handleAddRelayer}
          >
            Add Relayer via Safe
          </Button>
           {!safeAddress && (
            <p className="text-xs text-red-500 mt-1">
              Primary Safe address not available. Cannot add relayer.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 