import { db } from './src/db/index.js';
import { gmailOAuthTokens } from './src/db/schema.js';

console.log('Checking Gmail OAuth tokens in database...');

try {
  const tokens = await db.select().from(gmailOAuthTokens);
  console.log('Gmail OAuth tokens count:', tokens.length);
  
  if (tokens.length > 0) {
    console.log('Tokens:');
    tokens.forEach((token, index) => {
      console.log(`  ${index + 1}. User: ${token.userPrivyDid}`);
      console.log(`     Access Token: ${token.accessToken ? 'Present' : 'Missing'}`);
      console.log(`     Refresh Token: ${token.refreshToken ? 'Present' : 'Missing'}`);
      console.log(`     Expiry: ${token.expiryDate}`);
      console.log(`     Created: ${token.createdAt}`);
    });
  } else {
    console.log('No Gmail OAuth tokens found in database.');
  }
} catch (error) {
  console.error('Error checking tokens:', error);
}

process.exit(0); 