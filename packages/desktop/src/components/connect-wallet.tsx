import { useAccount, useConnect } from 'wagmi';
import { Button } from './ui/button';

export function ConnectWallet() {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  if (isConnected) {
    return null;
  }

  return (
    <Button 
      onClick={() => connect({ connector: connectors[0] })}
      variant="outline"
    >
      Connect Wallet
    </Button>
  );
} 