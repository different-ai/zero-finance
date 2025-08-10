#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import open from 'open';
import { getAuthenticatedApi } from '../lib/api-client.js';

const kycCommand = new Command('kyc')
  .description('Manage KYC verification');

kycCommand
  .command('status')
  .description('Check KYC verification status')
  .action(async () => {
    const spinner = ora('Checking KYC status...').start();
    
    try {
      const api = await getAuthenticatedApi();
      const status = await api.align.getCustomerStatus.query();
      
      spinner.stop();
      
      console.log(chalk.bold('\n📋 KYC Status\n'));
      
      if (!status.alignCustomerId) {
        console.log(chalk.yellow('Status: Not started'));
        console.log(chalk.dim('Run "zero kyc start" to begin verification'));
        return;
      }
      
      // Display status with appropriate color
      let statusColor = 'yellow';
      let statusIcon = '⏳';
      
      if (status.kycStatus === 'approved') {
        statusColor = 'green';
        statusIcon = '✓';
      } else if (status.kycStatus === 'rejected') {
        statusColor = 'red';
        statusIcon = '✗';
      }
      
      console.log(`Status: ${chalk[statusColor](`${statusIcon} ${status.kycStatus}`)}`);
      console.log(`Provider: Align`);
      console.log(`Customer ID: ${status.alignCustomerId}`);
      
      if (status.kycSubStatus) {
        console.log(`Details: ${status.kycSubStatus.replace(/_/g, ' ')}`);
      }
      
      if (status.kycStatus === 'pending' && status.kycFlowLink) {
        console.log(chalk.dim(`\nComplete verification at: ${status.kycFlowLink}`));
      }
    } catch (error) {
      spinner.fail('Failed to check KYC status');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

kycCommand
  .command('start')
  .description('Start or resume KYC verification')
  .action(async () => {
    const spinner = ora('Checking KYC status...').start();
    
    try {
      const api = await getAuthenticatedApi();
      const status = await api.align.getCustomerStatus.query();
      
      spinner.stop();
      
      if (status.kycStatus === 'approved') {
        console.log(chalk.green('✓ KYC already approved'));
        return;
      }
      
      if (status.kycFlowLink) {
        console.log(chalk.yellow('Opening KYC verification in browser...'));
        console.log(`If browser doesn't open, visit: ${chalk.bold(status.kycFlowLink)}`);
        await open(status.kycFlowLink);
      } else {
        console.log(chalk.yellow('KYC not initialized'));
        console.log(chalk.dim('Please visit https://zerofinance.ai to start KYC verification'));
      }
    } catch (error) {
      spinner.fail('Failed to start KYC');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

export default kycCommand;