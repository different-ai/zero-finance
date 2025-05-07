import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

export function AuthorizationExplanationCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
          Understanding Auto-Earn Authorization
        </CardTitle>
        <CardDescription>
          How the shared Earn Module manages permissions for different Safes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <p>
          The Auto-Earn Module contract is designed to be shared by many Safes.
          This multi-tenant approach requires a clear way to manage which
          relayers can trigger actions for specific Safes.
        </p>

        <div>
          <h4 className="font-semibold">Storage Layout:</h4>
          <pre className="mt-1 rounded-md bg-muted p-2 text-xs">
            <code>
              mapping(address safe =&#62; mapping(address relayer =&#62; bool))
              public authorizedRelayers;
            </code>
          </pre>
          <ul className="mt-1 list-disc pl-5 text-xs text-muted-foreground">
            <li>
              The first key is the <strong>Safe address</strong>.
            </li>
            <li>
              The second key is the <strong>relayer EOA address</strong>.
            </li>
            <li>
              The value is a boolean indicating if the relayer is authorized
              for that Safe.
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold">
            Why the `safe` parameter in `autoEarn()`?
          </h4>
          <p className="text-xs text-muted-foreground">
            The module needs to know which Safe the relayer is acting for:
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>
              <strong>`msg.sender` is ambiguous:</strong> When a Safe calls
              the module, `msg.sender` is the Safe. When your backend (relayer)
              calls directly, `msg.sender` is the relayer. The contract
              can&apos;t reliably distinguish these.
            </li>
            <li>
              <strong>Storing `owningSafe` isn&apos;t scalable:</strong> A
              single module instance can be used by thousands of Safes. Storing
              an owner for each would be inefficient.
            </li>
            <li>
              <strong>Global relayer list is insecure:</strong> Authorizing a
              relayer globally would grant it access to all Safes using the
              module, which is a security risk.
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold">The Authorization Flow:</h4>
          <ol className="mt-1 list-decimal space-y-1 pl-5">
            <li>A Safe (e.g., Safe A) installs the Auto-Earn Module.</li>
            <li>
              Safe A then executes a transaction on the module to call{' '}
              `addAuthorizedRelayer(SafeA_address, yourBackendRelayer_address)`.
            </li>
            <li>
              This action sets `authorizedRelayers[SafeA_address][yourBackendRelayer_address]`
              to `true`.
            </li>
            <li>
              Your backend (acting as `yourBackendRelayer_address`) can now
              directly call `autoEarn(token, amount, SafeA_address)` on the
              module. The module verifies the permission using the mapping.
            </li>
            <li>
              If another Safe (Safe B) installs the module, it must also
              whitelist its desired relayer, even if it&apos;s the same backend
              relayer EOA, because the permission is specific to Safe B.
            </li>
          </ol>
        </div>

        <div>
          <h4 className="font-semibold">Key Takeaways:</h4>
          <ul className="mt-1 list-disc pl-5">
            <li>
              The module is multi-tenant; permissions are per-Safe to prevent
              cross-Safe interference.
            </li>
            <li>
              Each Safe you manage needs a one-time (and cheap) transaction to
              whitelist your backend relayer.
            </li>
            <li>
              Once whitelisted, your backend relayer can trigger `autoEarn()`
              directly, without routing through the Safe. This saves a relay
              call and the need for a Safe signature for each auto-earn event.
            </li>
          </ul>
        </div>
        <p className="text-xs text-muted-foreground">
          After running `addAuthorizedRelayer(&#60;thisSafe&#62;, &#60;yourRelayer&#62;)`, the
          `OnlyAuthorizedRelayer` error should no longer occur for direct calls
          from your backend.
        </p>
      </CardContent>
    </Card>
  );
} 