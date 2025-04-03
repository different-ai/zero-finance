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
      
      // Check if SIGNER_PRIVATE_KEY line exists and has a value
      const signerKeyRegex = /SIGNER_PRIVATE_KEY=(.*?)(\n|$)/;
      if (envContent.match(signerKeyRegex)) {
        // Replace existing SIGNER_PRIVATE_KEY with new value
        envContent = envContent.replace(signerKeyRegex, `SIGNER_PRIVATE_KEY=${privateKey}\n`);
        console.log('Replacing existing SIGNER_PRIVATE_KEY in .env.local');
      } else {
        // Add SIGNER_PRIVATE_KEY to the end of the file with a newline
        envContent = envContent.trim() + `\nSIGNER_PRIVATE_KEY=${privateKey}\n`;
        console.log('Adding SIGNER_PRIVATE_KEY to .env.local');
      }
    } else {
      // Create new .env.local file with SIGNER_PRIVATE_KEY
      envContent = `SIGNER_PRIVATE_KEY=${privateKey}\n`;
      console.log('Creating new .env.local file with SIGNER_PRIVATE_KEY');
    }
    
    // Write updated content back to .env.local
    fs.writeFileSync(envPath, envContent);
    console.log(`✅ Updated ${envPath} with the new private key`);

    // Print first 6 characters of the key to verify it was set
    const newContent = fs.readFileSync(envPath, 'utf8');
    const match = newContent.match(/SIGNER_PRIVATE_KEY=(0x[a-f0-9]{6}).*/);
    if (match) {
      console.log(`Verified key (showing first 6 chars): ${match[1]}...`);
    }
  } catch (error) {
    console.error('Error updating .env.local file:', error);
  }
} 