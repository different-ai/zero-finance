#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import open from 'open';
import ora from 'ora';
import config from '../lib/config.js';
import { createApiClient } from '../lib/api-client.js';

const authCommand = new Command('auth')
  .description('Manage CLI authentication');

authCommand
  .command('login')
  .description('Authenticate with Zero Finance')
  .action(async () => {
    console.log(chalk.cyan('🔐 Zero Finance CLI Authentication\n'));
    
    const webUrl = config.get('api.webUrl');
    const authUrl = `${webUrl}/cli-auth`;
    
    console.log(chalk.yellow('Opening browser for authentication...'));
    console.log(`If browser doesn't open, visit: ${chalk.bold(authUrl)}\n`);
    
    // Open browser
    await open(authUrl);
    
    // Prompt for token
    const { token } = await inquirer.prompt([{
      type: 'password',
      name: 'token',
      message: 'Paste your CLI token here:',
      mask: '*',
      validate: (input) => input.length > 0 || 'Token is required',
    }]);
    
    // Validate token
    const spinner = ora('Validating token...').start();
    
    try {
      // Store token temporarily to test it
      config.set('auth.token', token);
      
      // Test the token by making a simple API call
      const api = createApiClient();
      await api.align.getCustomerStatus.query();
      
      // Token is valid, store it
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 90); // 90 days default
      config.set('auth.expiresAt', expiresAt.toISOString());
      
      spinner.succeed('Authentication successful!');
      console.log(chalk.green('\n✓ You are now authenticated with Zero Finance CLI'));
      
      // Show current environment
      if (webUrl.includes('localhost')) {
        console.log(chalk.dim(`  Connected to: ${webUrl} (local development)`));
      }
    } catch (error) {
      // Remove invalid token
      config.delete('auth.token');
      config.delete('auth.expiresAt');
      
      spinner.fail('Authentication failed');
      console.error(chalk.red('\n✗ Invalid token. Please try again.'));
      
      if (webUrl.includes('localhost')) {
        console.log(chalk.yellow('\nNote: You are connecting to localhost. Make sure:'));
        console.log(chalk.dim('  1. The web app is running (npm run dev in packages/web)'));
        console.log(chalk.dim('  2. You are signed in at http://localhost:3050'));
      }
      
      process.exit(1);
    }
  });

authCommand
  .command('logout')
  .description('Log out from Zero Finance CLI')
  .action(() => {
    config.delete('auth.token');
    config.delete('auth.expiresAt');
    console.log(chalk.green('✓ Logged out successfully'));
  });

authCommand
  .command('status')
  .description('Check authentication status')
  .action(async () => {
    const token = config.get('auth.token');
    const expiresAt = config.get('auth.expiresAt');
    const apiUrl = config.get('api.url');
    const webUrl = config.get('api.webUrl');
    
    if (!token) {
      console.log(chalk.yellow('✗ Not authenticated'));
      console.log(chalk.dim('Run "zero auth login" to authenticate'));
      return;
    }
    
    // Check if token is expired
    if (expiresAt && new Date(expiresAt) < new Date()) {
      console.log(chalk.yellow('✗ Token expired'));
      console.log(chalk.dim('Run "zero auth login" to re-authenticate'));
      return;
    }
    
    // Test token validity
    const spinner = ora('Checking authentication...').start();
    
    try {
      const api = createApiClient();
      await api.align.getCustomerStatus.query();
      
      spinner.succeed('Authenticated');
      console.log(chalk.green('✓ Valid authentication token'));
      
      if (expiresAt) {
        const expires = new Date(expiresAt);
        const daysLeft = Math.ceil((expires - new Date()) / (1000 * 60 * 60 * 24));
        console.log(chalk.dim(`  Token expires in ${daysLeft} days`));
      }
      
      // Show environment info
      console.log(chalk.dim(`  API: ${apiUrl}`));
      console.log(chalk.dim(`  Web: ${webUrl}`));
      
      if (apiUrl.includes('localhost')) {
        console.log(chalk.cyan('  Environment: Local Development'));
      } else {
        console.log(chalk.cyan('  Environment: Production'));
      }
    } catch (error) {
      spinner.fail('Authentication check failed');
      console.log(chalk.red('✗ Token is invalid or expired'));
      console.log(chalk.dim('Run "zero auth login" to re-authenticate'));
      
      if (apiUrl.includes('localhost')) {
        console.log(chalk.yellow('\nNote: Connecting to localhost. Is the web app running?'));
      }
    }
  });

authCommand
  .command('config')
  .description('Show or update CLI configuration')
  .option('--api-url <url>', 'Set the API URL')
  .option('--web-url <url>', 'Set the Web URL')
  .option('--reset', 'Reset to default configuration')
  .action((options) => {
    if (options.reset) {
      config.set('api.url', 'https://zerofinance.ai/api/trpc');
      config.set('api.webUrl', 'https://zerofinance.ai');
      console.log(chalk.green('✓ Configuration reset to defaults'));
      return;
    }
    
    if (options.apiUrl) {
      config.set('api.url', options.apiUrl);
      console.log(chalk.green(`✓ API URL set to: ${options.apiUrl}`));
    }
    
    if (options.webUrl) {
      config.set('api.webUrl', options.webUrl);
      console.log(chalk.green(`✓ Web URL set to: ${options.webUrl}`));
    }
    
    // Show current configuration
    console.log(chalk.cyan('\nCurrent Configuration:'));
    console.log(`  API URL: ${config.get('api.url')}`);
    console.log(`  Web URL: ${config.get('api.webUrl')}`);
    
    const apiUrl = config.get('api.url');
    if (apiUrl.includes('localhost')) {
      console.log(chalk.yellow('\n⚠️  Using local development environment'));
    }
  });

export default authCommand;
