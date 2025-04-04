import { privateKeyToAccount } from 'viem/accounts';
import * as dotenv from 'dotenv';
import path from 'path';

// Determine the correct path to .env.local relative to the script location
// Assumes the script is run from the package root (packages/bank)
const envPath = path.resolve(__dirname, '../.env.local'); 
dotenv.config({ path: envPath });

function getDeployerAddress() {
    const privateKey = process.env.DEPLOYER_PRIVATE_KEY;

    if (!privateKey) {
        console.error('Error: DEPLOYER_PRIVATE_KEY environment variable is not set in', envPath);
        process.exit(1);
    }

    // Ensure the key is in hex format
    const formattedPrivateKey = privateKey.startsWith('0x') 
      ? privateKey 
      : `0x${privateKey}`;

    try {
        // Derive the account from the private key
        const account = privateKeyToAccount(formattedPrivateKey as `0x${string}`);
        
        // Print the public address
        console.log('Deployer Public Address:', account.address);

    } catch (error) {
        console.error('Error deriving address from private key:', error);
        process.exit(1);
    }
}

// Run the function
getDeployerAddress(); 