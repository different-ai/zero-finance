#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import Conf from 'conf';
import crypto from 'crypto';
import boxen from 'boxen';

// Create a separate config for mock auth
const config = new Conf({
  projectName: 'zero-finance-cli-mock',
  defaults: {
    auth: {
      token: null,
      expiresAt: null,
      email: null,
    },
  },
});

const authCommand = new Command('auth')
  .description('Manage CLI authentication (Mock Mode)');

authCommand
  .command('login')
  .description('Authenticate with Zero Finance (Mock)')
  .action(async () => {
    console.log(chalk.cyan('🔐 Zero Finance CLI Authentication (Test Mode)\n'));
    
    // Mock auth flow - no real browser needed
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'email',
        message: 'Enter your email:',
        validate: (input) => input.includes('@') || 'Please enter a valid email',
        default: 'test@example.com'
      },
      {
        type: 'password',
        name: 'password',
        message: 'Enter password (any value for test):',
        mask: '*',
        default: 'test123'
      }
    ]);
    
    const spinner = ora('Authenticating...').start();
    
    // Simulate auth delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate mock token
    const mockToken = 'zf_test_' + crypto.randomBytes(32).toString('hex');
    
    // Store auth data
    config.set('auth.token', mockToken);
    config.set('auth.email', answers.email);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 90);
    config.set('auth.expiresAt', expiresAt.toISOString());
    
    spinner.succeed('Authentication successful!');
    
    console.log(boxen(
      chalk.green(`
✓ Authenticated as ${chalk.bold(answers.email)}

Your CLI token (for testing):
${chalk.dim(mockToken.substring(0, 20) + '...')}

Token expires: ${expiresAt.toLocaleDateString()}
      `),
      {
        padding: 1,
        borderStyle: 'round',
        borderColor: 'green'
      }
    ));
  });

authCommand
  .command('logout')
  .description('Log out from Zero Finance CLI')
  .action(() => {
    const email = config.get('auth.email');
    config.delete('auth.token');
    config.delete('auth.expiresAt');
    config.delete('auth.email');
    
    if (email) {
      console.log(chalk.green(`✓ Logged out from ${email}`));
    } else {
      console.log(chalk.green('✓ Logged out successfully'));
    }
  });

authCommand
  .command('status')
  .description('Check authentication status')
  .action(() => {
    const token = config.get('auth.token');
    const expiresAt = config.get('auth.expiresAt');
    const email = config.get('auth.email');
    
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
    
    console.log(chalk.green('✓ Authenticated'));
    if (email) {
      console.log(chalk.dim(`  Email: ${email}`));
    }
    console.log(chalk.dim(`  Token: ${token.substring(0, 20)}...`));
    
    if (expiresAt) {
      const expires = new Date(expiresAt);
      const daysLeft = Math.ceil((expires - new Date()) / (1000 * 60 * 60 * 24));
      console.log(chalk.dim(`  Expires in ${daysLeft} days`));
    }
  });

authCommand
  .command('token')
  .description('Display current token (test mode only)')
  .action(() => {
    const token = config.get('auth.token');
    
    if (!token) {
      console.log(chalk.yellow('No token found. Please login first.'));
      return;
    }
    
    console.log(chalk.cyan('Current Token (Test Mode):'));
    console.log(token);
  });

export default authCommand;