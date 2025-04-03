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
    
    // Read the file line by line into an array
    let lines: string[] = [];
    
    if (fs.existsSync(envPath)) {
      lines = fs.readFileSync(envPath, 'utf8').split('\n');
      
      // Find the SIGNER_PRIVATE_KEY line and update it
      let keyLineIndex = lines.findIndex(line => line.startsWith('SIGNER_PRIVATE_KEY='));
      
      if (keyLineIndex !== -1) {
        // Replace the existing line
        lines[keyLineIndex] = `SIGNER_PRIVATE_KEY=${privateKey}`;
        console.log('Replacing existing SIGNER_PRIVATE_KEY in .env.local');
      } else {
        // Add a new line
        lines.push(`SIGNER_PRIVATE_KEY=${privateKey}`);
        console.log('Adding SIGNER_PRIVATE_KEY to .env.local');
      }
    } else {
      // Create a new file
      lines = [
        `SIGNER_PRIVATE_KEY=${privateKey}`,
      ];
      console.log('Creating new .env.local file with SIGNER_PRIVATE_KEY');
    }
    
    // Write the file back out
    fs.writeFileSync(envPath, lines.join('\n'));
    
    console.log(`✅ Updated ${envPath} with the new private key`);
    
    // Verify the file was updated correctly
    const newContent = fs.readFileSync(envPath, 'utf8');
    console.log('Updated .env.local content:');
    console.log('---');
    console.log(newContent);
    console.log('---');
    
  } catch (error) {
    console.error('Error updating .env.local file:', error);
  }
} 