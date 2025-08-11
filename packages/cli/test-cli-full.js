#!/usr/bin/env node

/**
 * Test version of Zero Finance CLI with mock authentication
 * This version doesn't require real API connections
 */

import chalk from 'chalk';
import gradient from 'gradient-string';
import figlet from 'figlet';
import inquirer from 'inquirer';
import ora from 'ora';
import { createSpinner } from 'nanospinner';
import boxen from 'boxen';
import Table from 'cli-table3';
import { faker } from '@faker-js/faker';
import { Command } from 'commander';
import Conf from 'conf';

// Import mock auth command
import authCommand from './src/commands/auth-mock.js';

// Configuration store
const config = new Conf({
  projectName: 'zero-finance-cli-test',
  defaults: {
    currentCompany: null,
    companies: [],
    theme: 'default'
  }
});

// CLI version
const VERSION = '1.0.0';

// ASCII Art Banner
const showBanner = () => {
  console.clear();
  const banner = figlet.textSync('ZERO', {
    font: 'ANSI Shadow',
    horizontalLayout: 'full'
  });
  console.log(gradient.pastel.multiline(banner));
  console.log(chalk.dim(`  Self-Custody Business Banking v${VERSION} (Test Mode)\n`));
};

// Helper function
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Main Menu
const mainMenu = async () => {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: chalk.cyan('What would you like to do?'),
      choices: [
        { name: '🏢  Company Management', value: 'company' },
        { name: '🏦  Banking Operations', value: 'banking' },
        { name: '💸  Payments & Payroll', value: 'payments' },
        { name: '📊  Analytics Dashboard', value: 'dashboard' },
        { name: '🚪  Exit', value: 'exit' }
      ]
    }
  ]);

  switch (action) {
    case 'company':
      await companyMenu();
      break;
    case 'banking':
      await bankingMenu();
      break;
    case 'payments':
      await paymentsMenu();
      break;
    case 'dashboard':
      await showDashboard();
      break;
    case 'exit':
      console.log(chalk.yellow('\n👋 Goodbye!\n'));
      process.exit(0);
  }
  
  await mainMenu();
};

// Company Management Menu
const companyMenu = async () => {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: chalk.cyan('Company Management'),
      choices: [
        { name: '➕  Create New Company', value: 'create' },
        { name: '📋  List Companies', value: 'list' },
        { name: '🔄  Switch Company', value: 'switch' },
        { name: '🔙  Back', value: 'back' }
      ]
    }
  ]);

  if (action === 'create') {
    await createCompany();
  } else if (action === 'list') {
    await listCompanies();
  } else if (action === 'switch') {
    await switchCompany();
  }
  
  if (action !== 'back') {
    await companyMenu();
  } else {
    await mainMenu();
  }
};

// Create Company
const createCompany = async () => {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Company name:',
      validate: (input) => input.length > 0 || 'Please enter a company name'
    },
    {
      type: 'list',
      name: 'type',
      message: 'Company type:',
      choices: ['LLC', 'C-Corporation', 'S-Corporation']
    },
    {
      type: 'list',
      name: 'state',
      message: 'State of incorporation:',
      choices: ['Delaware', 'Wyoming', 'Nevada', 'California', 'New York']
    }
  ]);

  const spinner = createSpinner('Creating your company...').start();
  
  await sleep(1000);
  spinner.update({ text: 'Checking name availability...' });
  await sleep(1000);
  spinner.update({ text: 'Preparing formation documents...' });
  await sleep(1000);
  
  spinner.success({ text: 'Company created successfully!' });

  const ein = faker.string.numeric('##-#######');
  const company = {
    id: faker.string.uuid(),
    name: answers.name,
    type: answers.type,
    state: answers.state,
    ein: ein,
    formed: new Date().toISOString(),
    balance: faker.number.float({ min: 10000, max: 100000, precision: 0.01 })
  };

  // Save to config
  const companies = config.get('companies') || [];
  companies.push(company);
  config.set('companies', companies);
  config.set('currentCompany', company.id);

  console.log(boxen(
    chalk.green(`
${chalk.bold(answers.name + ' ' + answers.type)}

📍 State: ${answers.state}
🆔 EIN: ${ein}
📅 Formed: ${new Date().toLocaleDateString()}
💼 Status: Active
💰 Initial Balance: $${company.balance.toLocaleString()}
    `),
    {
      padding: 1,
      borderStyle: 'round',
      borderColor: 'green'
    }
  ));

  await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
};

// List Companies
const listCompanies = async () => {
  const companies = config.get('companies') || [];
  const currentCompanyId = config.get('currentCompany');

  if (companies.length === 0) {
    console.log(chalk.yellow('\nNo companies found. Create one first!\n'));
    await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
    return;
  }

  console.log(chalk.bold.cyan('\n📋 Your Companies\n'));

  companies.forEach((company, index) => {
    const isCurrent = company.id === currentCompanyId;
    const marker = isCurrent ? chalk.green('▶') : ' ';
    
    console.log(`${marker} ${index + 1}. ${chalk.bold(company.name)} (${company.type})`);
    console.log(`     EIN: ${company.ein}`);
    console.log(`     State: ${company.state}`);
    console.log(`     Balance: $${(company.balance || 0).toLocaleString()}`);
    console.log('');
  });

  await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
};

// Switch Company
const switchCompany = async () => {
  const companies = config.get('companies') || [];
  
  if (companies.length === 0) {
    console.log(chalk.yellow('\nNo companies found. Create one first!\n'));
    await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
    return;
  }

  const choices = companies.map(c => ({
    name: `${c.name} (${c.type}) - EIN: ${c.ein}`,
    value: c.id
  }));

  const { companyId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'companyId',
      message: 'Select company:',
      choices
    }
  ]);

  config.set('currentCompany', companyId);
  const selectedCompany = companies.find(c => c.id === companyId);
  console.log(chalk.green(`\n✓ Switched to ${selectedCompany.name}\n`));
  await sleep(1000);
};

// Banking Menu
const bankingMenu = async () => {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: chalk.cyan('Banking Operations'),
      choices: [
        { name: '💰  Check Balance', value: 'balance' },
        { name: '📊  View Transactions', value: 'transactions' },
        { name: '🔄  Transfer Funds', value: 'transfer' },
        { name: '🔙  Back', value: 'back' }
      ]
    }
  ]);

  if (action === 'balance') {
    await showBalance();
  } else if (action === 'transactions') {
    await showTransactions();
  } else if (action === 'transfer') {
    await transferFunds();
  }

  if (action !== 'back') {
    await bankingMenu();
  } else {
    await mainMenu();
  }
};

// Show Balance
const showBalance = async () => {
  const spinner = ora('Fetching balance...').start();
  await sleep(1000);
  spinner.stop();

  const currentCompanyId = config.get('currentCompany');
  const companies = config.get('companies') || [];
  const company = companies.find(c => c.id === currentCompanyId);

  if (!company) {
    console.log(chalk.yellow('\nNo company selected. Please create or select a company first.\n'));
    await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
    return;
  }

  const balance = company.balance || faker.number.float({ min: 10000, max: 500000, precision: 0.01 });
  const apy = 5.2;
  const monthlyYield = balance * (apy / 100 / 12);

  console.log(boxen(
    chalk.bold.green(`
💰 ${company.name}

Available: $${balance.toLocaleString()} USDC
APY:       ${apy}%

📈 This month: +$${monthlyYield.toFixed(2)}

🔐 Self-Custody Wallet:
   0x742d...e7595f (Base)
    `),
    {
      padding: 1,
      borderStyle: 'double',
      borderColor: 'green',
      title: 'Account Balance',
      titleAlignment: 'center'
    }
  ));

  await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
};

// Show Transactions
const showTransactions = async () => {
  const spinner = ora('Loading transactions...').start();
  await sleep(1000);
  spinner.stop();

  const table = new Table({
    head: ['Date', 'Description', 'Amount', 'Status'],
    colWidths: [12, 30, 15, 10],
    style: {
      head: ['cyan'],
      border: ['grey']
    }
  });

  // Generate mock transactions
  const transactions = [
    { date: new Date('2024-01-15'), desc: 'Sarah Chen - Contractor', amount: -3500, status: '✓' },
    { date: new Date('2024-01-15'), desc: 'AWS Services', amount: -1247.32, status: '✓' },
    { date: new Date('2024-01-14'), desc: 'Acme Corp - Invoice Payment', amount: 12500, status: '✓' },
    { date: new Date('2024-01-13'), desc: 'Google Workspace', amount: -450, status: '✓' },
    { date: new Date('2024-01-12'), desc: 'Alex Rivera - Contractor', amount: -5000, status: '✓' }
  ];

  transactions.forEach(tx => {
    table.push([
      tx.date.toLocaleDateString(),
      tx.desc,
      tx.amount > 0 ? chalk.green(`+$${Math.abs(tx.amount).toLocaleString()}`) : chalk.red(`-$${Math.abs(tx.amount).toLocaleString()}`),
      chalk.green(tx.status)
    ]);
  });

  console.log(table.toString());
  
  await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
};

// Transfer Funds
const transferFunds = async () => {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'recipient',
      message: 'Recipient (email or wallet):',
      validate: (input) => input.length > 0 || 'Please enter recipient details'
    },
    {
      type: 'number',
      name: 'amount',
      message: 'Amount ($):',
      validate: (input) => input > 0 || 'Amount must be greater than 0'
    }
  ]);

  const spinner = createSpinner('Processing transfer...').start();
  await sleep(2000);
  spinner.success({ text: 'Transfer completed!' });

  console.log(chalk.green(`\n✅ Transfer successful`));
  console.log(`Amount: $${answers.amount.toLocaleString()}`);
  console.log(`To: ${answers.recipient}`);
  console.log(`Transaction ID: ${faker.string.alphanumeric(10).toUpperCase()}`);

  await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
};

// Payments Menu
const paymentsMenu = async () => {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: chalk.cyan('Payments & Payroll'),
      choices: [
        { name: '💸  Pay Contractor', value: 'contractor' },
        { name: '💼  Run Payroll', value: 'payroll' },
        { name: '🔙  Back', value: 'back' }
      ]
    }
  ]);

  if (action === 'contractor') {
    await payContractor();
  } else if (action === 'payroll') {
    await runPayroll();
  }

  if (action !== 'back') {
    await paymentsMenu();
  } else {
    await mainMenu();
  }
};

// Pay Contractor
const payContractor = async () => {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'email',
      message: 'Contractor email:',
      validate: (input) => input.includes('@') || 'Please enter a valid email'
    },
    {
      type: 'number',
      name: 'amount',
      message: 'Amount ($):',
      validate: (input) => input > 0 || 'Amount must be greater than 0'
    }
  ]);

  const spinner = createSpinner('Processing payment...').start();
  await sleep(2000);
  spinner.success({ text: 'Payment sent successfully!' });

  console.log(boxen(
    chalk.green(`
✅ Payment Confirmed

To: ${answers.email}
Amount: $${answers.amount.toLocaleString()}
Method: USDC (Instant)
Transaction ID: ${faker.string.alphanumeric(10).toUpperCase()}
    `),
    {
      padding: 1,
      borderStyle: 'round',
      borderColor: 'green'
    }
  ));

  await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
};

// Run Payroll
const runPayroll = async () => {
  const spinner = ora('Preparing payroll...').start();
  await sleep(1000);
  spinner.stop();

  const employees = [
    { name: 'John Smith', role: 'Senior Engineer', salary: 4500 },
    { name: 'Emily Johnson', role: 'Product Designer', salary: 3800 },
    { name: 'Michael Brown', role: 'Marketing Manager', salary: 3200 }
  ];

  console.log(chalk.bold.cyan('\n💼 Payroll Run\n'));

  const table = new Table({
    head: ['Employee', 'Role', 'Net Pay'],
    style: { head: ['cyan'] }
  });

  employees.forEach(emp => {
    table.push([
      emp.name,
      emp.role,
      chalk.green(`$${emp.salary.toLocaleString()}`)
    ]);
  });

  console.log(table.toString());

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Process payroll?',
      default: true
    }
  ]);

  if (confirm) {
    const spinner = createSpinner('Processing payroll...').start();
    await sleep(2000);
    spinner.success({ text: 'Payroll completed! All employees paid.' });
  }

  await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
};

// Dashboard
const showDashboard = async () => {
  console.clear();
  console.log(chalk.bold.cyan('📊 Zero Finance Dashboard\n'));

  const table = new Table({
    head: ['Metric', 'Value'],
    style: { head: ['cyan'] }
  });

  table.push(
    ['Total Balance', chalk.green('$125,430.52')],
    ['Monthly Revenue', chalk.yellow('$45,230.00')],
    ['Pending Payments', chalk.red('$8,420.00')],
    ['APY Earnings', chalk.cyan('5.2% ($542/mo)')]
  );

  console.log(table.toString());
  
  console.log(chalk.bold('\n📈 Recent Activity:'));
  console.log('• Processed 142 transactions');
  console.log('• Saved 12 hours with automation');
  console.log('• Prevented 3 duplicate payments');
  
  await inquirer.prompt([{ type: 'input', name: 'continue', message: '\nPress Enter to continue...' }]);
  await mainMenu();
};

// Commander setup
const program = new Command();

program
  .name('zero')
  .description('Zero Finance CLI - Self-custody business banking (Test Mode)')
  .version(VERSION);

// Add auth command
program.addCommand(authCommand);

// Company command
program
  .command('company')
  .description('Manage companies')
  .action(async () => {
    showBanner();
    await companyMenu();
  });

// Balance command
program
  .command('balance')
  .description('Check account balance')
  .action(async () => {
    showBanner();
    await showBalance();
  });

// Pay command
program
  .command('pay <email> <amount>')
  .description('Quick payment to contractor')
  .action(async (email, amount) => {
    showBanner();
    const spinner = createSpinner(`Paying ${email}...`).start();
    await sleep(2000);
    spinner.success({ text: `Payment of $${amount} sent to ${email}!` });
  });

// Run the CLI
const run = async () => {
  if (process.argv.length > 2) {
    // Handle command line arguments
    program.parse();
  } else {
    // Interactive mode
    showBanner();
    await mainMenu();
  }
};

run().catch(console.error);