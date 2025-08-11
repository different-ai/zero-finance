#!/usr/bin/env node

import { createApiClient } from './src/lib/api-client.js';
import config from './src/lib/config.js';
import chalk from 'chalk';

async function testAuth() {
  console.log(chalk.cyan('\n🧪 Testing CLI Authentication\n'));
  
  const token = config.get('auth.token');
  const apiUrl = config.get('api.url');
  
  console.log('API URL:', apiUrl);
  console.log('Token present:', !!token);
  
  if (!token) {
    console.log(chalk.yellow('No token found. Run: npm run auth:login'));
    return;
  }
  
  console.log('Token (first 20 chars):', token.substring(0, 20) + '...');
  console.log('\nTesting API call...\n');
  
  try {
    const api = createApiClient();
    
    // Try a simple query
    console.log('Calling align.getCustomerStatus...');
    const result = await api.align.getCustomerStatus.query();
    
    console.log(chalk.green('\n✅ Authentication successful!'));
    console.log('Result:', result);
  } catch (error) {
    console.log(chalk.red('\n❌ Authentication failed!'));
    console.log('Error:', error.message);
    
    if (error.data) {
      console.log('Error data:', error.data);
    }
    
    if (error.cause) {
      console.log('Cause:', error.cause);
    }
  }
}

testAuth().catch(console.error);
