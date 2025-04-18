import { BaseSafeOperation, Safe4337Pack } from '@safe-global/relay-kit';
import { ethers } from 'ethers';
import { createWalletClient, Hex } from 'viem';
import { http } from 'viem';
import { base } from 'viem/chains';
import { PrivyProvider } from '@privy-io/react-auth';

/**
 * Interface for the return value of buildSignedOperation
 */
export interface SignedOperationResult {
  predictedSafe: string;
  signedSafeOperation: BaseSafeOperation;
}

/**
 * Builds and signs a Safe operation using the provided provider and deployment transaction data.
 *
 * @param {Object} params - The parameters object
 * @param {any} params.provider - The Privy Ethereum provider
 * @param {Object} params.safeDeploymentTx - The Safe deployment transaction data
 * @returns {Promise<SignedOperationResult>} The signed operation data and predicted Safe address
 */
export async function buildSignedOperation({
  provider,
  safeDeploymentTx,
}: {
  provider: any;
  safeDeploymentTx: {
    to: string;
    value: bigint | string;
    data: `0x${string}`;
  };
}): Promise<SignedOperationResult> {
  // Create a Web3Provider from the Privy provider
  //   const ethersProvider = new ethers.providers.Web3Provider(provider);
  const walletClient = createWalletClient({
    account: provider.address as Hex,
    chain: base,
    transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL),
  });

  console.log('Initializing Safe4337Pack for client operations...');
  // log provider
  console.log('Provider:', provider);

  try {
    // Initialize the Safe4337Pack for client-side operations
    // We need to use type assertions because of type mismatches in the SDK
    const pack = await Safe4337Pack.init({
      bundlerUrl: `https://api.pimlico.io/v2/11155111/rpc?add_balance_override&apikey=${process.env.NEXT_PUBLIC_PIMLICO_API_KEY}`,
      provider: provider,
      //   signer: walletClient,
      options: {
        owners: [provider.address],
        threshold: 1,
      },
      //   safeModulesVersion: '0.3.0',
    } as any);
    const chainId = await pack.getChainId();
    console.log('Chain ID:', chainId);

    console.log('Creating transaction operation...');

    // Create the transaction operation
    const safeOperation = await pack.createTransaction({
      transactions: [
        {
          to: safeDeploymentTx.to,
          value: safeDeploymentTx.value.toString(),
          data: safeDeploymentTx.data,
        },
      ],
    });

    console.log('Signing operation...');

    // Sign the operation
    const signed = await pack.signSafeOperation(safeOperation);

    // Get the predicted Safe address
    const predictedSafe = await pack.protocolKit.getAddress();

    console.log('Safe operation signed, predicted address:', predictedSafe);

    // Return the signed data and predicted Safe address
    return {
      predictedSafe: predictedSafe,
      signedSafeOperation: signed,
    };
  } catch (error) {
    console.error('Error building or signing Safe operation:', error);
    throw error;
  }
}
