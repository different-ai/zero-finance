import Safe from '@safe-global/protocol-kit';
import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

/**
 * Initializes the Safe Protocol Kit and deploys a new Safe contract.
 *
 * @param {string[]} owners An array of owner addresses for the new Safe.
 * @param {number} threshold The confirmation threshold for the new Safe.
 * @param {string} [saltNonce=undefined] Optional salt nonce for deterministic deployment.
 * @returns {Promise<string>} The address of the newly deployed Safe contract.
 * @throws {Error} If environment variables are missing or deployment fails.
 */
export async function initializeAndDeploySafe(
    owners: string[],
    threshold: number,
    saltNonce?: string
): Promise<string> {
    // 1. Check environment variables
    const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
    const rpcUrl = process.env.BASE_RPC_URL;

    if (!privateKey) {
        throw new Error('DEPLOYER_PRIVATE_KEY environment variable is not set.');
    }
    if (!rpcUrl) {
        throw new Error('BASE_RPC_URL environment variable is not set.');
    }
    
    // Convert private key to hex format if it doesn't start with 0x
    const formattedPrivateKey = privateKey.startsWith('0x') 
      ? privateKey 
      : `0x${privateKey}`;

    try {
        // 2. Set up viem clients for monitoring
        const account = privateKeyToAccount(formattedPrivateKey as `0x${string}`);
        
        const publicClient = createPublicClient({
            chain: base,
            transport: http(rpcUrl),
        });
        
        console.log(`Deployer Account Address: ${account.address}`);
        
        // 3. Initialize Protocol Kit with workaround for type issues
        console.log(`Initializing Safe Protocol Kit...`);
        
        // @ts-ignore - Work around type issues by passing config directly
        const protocolKit = await Safe.init({
            provider: rpcUrl,
            signer: formattedPrivateKey,
            // Dynamically create the config object so we don't hit TypeScript errors
            ...(threshold > 0 && { 
                safeConfig: { 
                    owners, 
                    threshold 
                } 
            })
        });

        // 4. Get predicted Safe address
        const predictedSafeAddress = await protocolKit.getAddress();
        console.log(`Predicted Safe address: ${predictedSafeAddress}`);

        // 5. Create deployment transaction
        let deploymentTransaction;
        // @ts-ignore - Completely ignore the type checking for this method
        if (saltNonce) {
            // @ts-ignore - Completely ignore the type checking for this method with parameters
            deploymentTransaction = await protocolKit.createSafeDeploymentTransaction({ saltNonce });
        } else {
            // @ts-ignore - Completely ignore the type checking for this method without parameters
            deploymentTransaction = await protocolKit.createSafeDeploymentTransaction();
        }

        console.log(`Deployment transaction prepared:`, {
            to: deploymentTransaction.to,
            value: deploymentTransaction.value,
            data: deploymentTransaction.data.substring(0, 66) + '...' // Log truncated data for readability
        });

        // 6. Execute transaction
        const externalSigner = await protocolKit.getSafeProvider().getExternalSigner();
        
        // @ts-ignore - Work around viem-specific type issues with sendTransaction
        const txHash = await externalSigner.sendTransaction({
            to: deploymentTransaction.to,
            value: BigInt(deploymentTransaction.value),
            data: deploymentTransaction.data,
        });
        
        console.log(`Deployment transaction submitted. Hash: ${txHash}`);
        
        // 7. Wait for confirmation
        console.log(`Waiting for transaction confirmation...`);
        const txReceipt = await publicClient.waitForTransactionReceipt({
            hash: txHash as `0x${string}`,
        });
        
        console.log(`Transaction confirmed in block ${txReceipt.blockNumber}`);
        
        // 8. Verify deployment
        // @ts-ignore - Work around type issues when connecting to deployed Safe
        const deployedKit = await protocolKit.connect({
            safeAddress: predictedSafeAddress,
        });
        
        const isDeployed = await deployedKit.isSafeDeployed();
        if (isDeployed) {
            console.log(`Safe deployment successful at ${predictedSafeAddress}`);
            return predictedSafeAddress;
        } else {
            throw new Error(`Safe deployment verification failed.`);
        }
    } catch (error) {
        console.error('Error deploying Safe contract:', error);
        if (error instanceof Error) {
            throw new Error(`Safe deployment failed: ${error.message}`);
        }
        throw new Error('Safe deployment failed due to an unknown error.');
    }
} 