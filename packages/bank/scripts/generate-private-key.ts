/**
 * Ethereum Private Key Generator
 * 
 * This script generates a random Ethereum private key using viem.
 * Use it to create a SIGNER_PRIVATE_KEY for your .env.local file.
 * SECURITY WARNING: Keep your private keys secure and never share them.
 */

import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { formatEther } from 'viem';
import fs from 'fs';
import path from 'path';

// Generate a random private key
const privateKey = generatePrivateKey();
const account = privateKeyToAccount(privateKey);

console.log('\n==== GENERATED ETHEREUM ACCOUNT ====');
console.log(`Private Key: ${privateKey}`);
console.log(`Account Address: ${account.address}`);
console.log('\nTo add this private key to your .env.local:');
console.log(`SIGNER_PRIVATE_KEY=${privateKey}`);
console.log('\nSECURITY WARNING:');
console.log('- Keep this private key secure and never share it');
console.log('- This key will have full control over the signer account');
console.log('- For production, consider using a hardware wallet or more secure key management solution\n');

// Offer to update .env.local directly
const shouldUpdateEnv = process.argv.includes('--update-env');
if (shouldUpdateEnv) {
  try {
    // Use the correct path relative to the current working directory
    const envPath = path.resolve('.env.local');
    let envContent = '';
    
    // Read existing .env.local if it exists
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
      
      // Replace existing SIGNER_PRIVATE_KEY or add it if it doesn't exist
      if (envContent.includes('SIGNER_PRIVATE_KEY=')) {
        envContent = envContent.replace(/SIGNER_PRIVATE_KEY=.*\n?/, `SIGNER_PRIVATE_KEY=${privateKey}\n`);
      } else {
        envContent += `\nSIGNER_PRIVATE_KEY=${privateKey}\n`;
      }
    } else {
      envContent = `SIGNER_PRIVATE_KEY=${privateKey}\n`;
    }
    
    // Write updated content back to .env.local
    fs.writeFileSync(envPath, envContent);
    console.log(`✅ Updated ${envPath} with the new private key`);
  } catch (error) {
    console.error('Error updating .env.local file:', error);
  }
} 