#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import Table from 'cli-table3';
import boxen from 'boxen';
import { getAuthenticatedApi } from '../lib/api-client.js';

const bankCommand = new Command('bank')
  .description('Manage virtual bank accounts');

// List virtual bank accounts
bankCommand
  .command('list')
  .description('List all your virtual bank accounts')
  .action(async () => {
    const spinner = ora('Fetching virtual accounts...').start();
    
    try {
      const api = await getAuthenticatedApi();
      
      // Get virtual account details from DB
      const accounts = await api.align.getVirtualAccountDetails.query();
      
      spinner.stop();
      
      if (accounts.length === 0) {
        console.log(chalk.yellow('\nNo virtual bank accounts found'));
        console.log(chalk.dim('Complete KYC verification to create virtual accounts'));
        return;
      }
      
      console.log(chalk.bold.cyan('\n🏦 Virtual Bank Accounts\n'));
      
      accounts.forEach((account, index) => {
        const isUSD = account.sourceAccountType === 'us_ach';
        const currency = account.sourceCurrency?.toUpperCase() || 'USD';
        
        console.log(boxen(
          chalk.white(`
${chalk.bold(`${currency} Account ${index + 1}`)}

${chalk.cyan('Bank Details:')}
Bank: ${account.sourceBankName || 'N/A'}
${account.sourceBankAddress ? `Address: ${account.sourceBankAddress}` : ''}

${chalk.cyan('Account Details:')}
Beneficiary: ${account.sourceBankBeneficiaryName || 'N/A'}
${account.sourceBankBeneficiaryAddress ? `Address: ${account.sourceBankBeneficiaryAddress}` : ''}

${isUSD ? chalk.cyan('US Account:') : chalk.cyan('IBAN Account:')}
${isUSD ? `Account: ${account.sourceAccountNumber || 'N/A'}` : `IBAN: ${account.sourceIban || 'N/A'}`}
${isUSD ? `Routing: ${account.sourceRoutingNumber || 'N/A'}` : `BIC/SWIFT: ${account.sourceBicSwift || 'N/A'}`}

${chalk.cyan('Destination:')}
Network: ${account.destinationPaymentRail || 'Base'}
Token: ${account.destinationCurrency?.toUpperCase() || 'USDC'}
Address: ${account.destinationAddress ? `${account.destinationAddress.slice(0, 6)}...${account.destinationAddress.slice(-4)}` : 'N/A'}

${chalk.dim('Payment Rails: ' + (account.sourcePaymentRails?.join(', ') || 'ACH, Wire'))}
          `),
          {
            padding: 1,
            borderStyle: 'round',
            borderColor: currency === 'USD' ? 'green' : 'blue',
            title: `${currency} Virtual Account`,
            titleAlignment: 'center'
          }
        ));
        
        if (index < accounts.length - 1) {
          console.log(''); // Add spacing between accounts
        }
      });
      
    } catch (error) {
      spinner.fail('Failed to fetch virtual accounts');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// Create virtual bank accounts
bankCommand
  .command('create')
  .description('Create USD and EUR virtual bank accounts')
  .action(async () => {
    const spinner = ora('Checking KYC status...').start();
    
    try {
      const api = await getAuthenticatedApi();
      
      // Check KYC status first
      const status = await api.align.getCustomerStatus.query();
      
      if (!status.kycStatus || status.kycStatus !== 'approved') {
        spinner.fail('KYC not approved');
        console.log(chalk.yellow('\nYou need to complete KYC verification first'));
        console.log(chalk.dim('Current status: ' + (status.kycStatus || 'Not started')));
        if (status.kycFlowLink) {
          console.log(chalk.dim('Complete KYC at: ' + status.kycFlowLink));
        }
        return;
      }
      
      spinner.text = 'Creating virtual bank accounts...';
      
      const result = await api.align.createAllVirtualAccounts.mutation();
      
      spinner.stop();
      
      if (result.success) {
        console.log(chalk.green.bold('\n✅ Virtual accounts created successfully!\n'));
        
        result.results.forEach(account => {
          console.log(chalk.green(`  ✓ ${account.currency} account created`));
        });
        
        if (result.errors.length > 0) {
          console.log(chalk.yellow('\nSome accounts failed:'));
          result.errors.forEach(error => {
            console.log(chalk.red(`  ✗ ${error.currency}: ${error.error}`));
          });
        }
        
        console.log(chalk.dim('\nRun "zero bank list" to see your account details'));
      } else {
        console.log(chalk.red('\n❌ Failed to create virtual accounts'));
        if (result.errors.length > 0) {
          result.errors.forEach(error => {
            console.log(chalk.red(`  ${error.currency}: ${error.error}`));
          });
        }
      }
      
    } catch (error) {
      spinner.fail('Failed to create virtual accounts');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// Show specific account details
bankCommand
  .command('show <currency>')
  .description('Show details for a specific virtual account (USD or EUR)')
  .action(async (currency) => {
    const spinner = ora('Fetching account details...').start();
    
    try {
      const api = await getAuthenticatedApi();
      
      const accounts = await api.align.getVirtualAccountDetails.query();
      
      spinner.stop();
      
      const account = accounts.find(a => 
        a.sourceCurrency?.toLowerCase() === currency.toLowerCase()
      );
      
      if (!account) {
        console.log(chalk.yellow(`\nNo ${currency.toUpperCase()} virtual account found`));
        return;
      }
      
      const isUSD = account.sourceAccountType === 'us_ach';
      
      console.log(chalk.bold.cyan(`\n🏦 ${currency.toUpperCase()} Virtual Bank Account\n`));
      
      console.log(chalk.bold('Wire Instructions:'));
      console.log('─'.repeat(50));
      
      console.log(chalk.cyan('\nBank Information:'));
      console.log(`Bank Name: ${chalk.white(account.sourceBankName || 'N/A')}`);
      if (account.sourceBankAddress) {
        console.log(`Bank Address: ${chalk.white(account.sourceBankAddress)}`);
      }
      
      console.log(chalk.cyan('\nBeneficiary Information:'));
      console.log(`Name: ${chalk.white(account.sourceBankBeneficiaryName || 'N/A')}`);
      if (account.sourceBankBeneficiaryAddress) {
        console.log(`Address: ${chalk.white(account.sourceBankBeneficiaryAddress)}`);
      }
      
      if (isUSD) {
        console.log(chalk.cyan('\nAccount Details (ACH/Wire):'));
        console.log(`Account Number: ${chalk.white.bold(account.sourceAccountNumber || 'N/A')}`);
        console.log(`Routing Number: ${chalk.white.bold(account.sourceRoutingNumber || 'N/A')}`);
      } else {
        console.log(chalk.cyan('\nAccount Details (SEPA/SWIFT):'));
        console.log(`IBAN: ${chalk.white.bold(account.sourceIban || 'N/A')}`);
        console.log(`BIC/SWIFT: ${chalk.white.bold(account.sourceBicSwift || 'N/A')}`);
      }
      
      console.log('\n' + '─'.repeat(50));
      console.log(chalk.dim('\n💡 Funds sent to this account will be automatically'));
      console.log(chalk.dim(`   converted to ${account.destinationCurrency?.toUpperCase() || 'USDC'} on ${account.destinationPaymentRail || 'Base'}`));
      
    } catch (error) {
      spinner.fail('Failed to fetch account details');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

export default bankCommand;
