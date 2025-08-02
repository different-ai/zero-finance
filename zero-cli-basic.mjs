#!/usr/bin/env node

import chalk from 'chalk';
import gradient from 'gradient-string';
import figlet from 'figlet';
import inquirer from 'inquirer';
import ora from 'ora';
import { createSpinner } from 'nanospinner';
import boxen from 'boxen';
import Table from 'cli-table3';
import { faker } from '@faker-js/faker';
import blessed from 'blessed';
import contrib from 'blessed-contrib';

// ASCII Art Banner
const showBanner = () => {
  console.clear();
  const banner = figlet.textSync('ZERO', {
    font: 'ANSI Shadow',
    horizontalLayout: 'full'
  });
  console.log(gradient.pastel.multiline(banner));
  console.log(chalk.dim('  Self-Custody Business Banking v1.0.0\n'));
};

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
        { name: '🤖  AI & Automation', value: 'automation' },
        { name: '📊  Analytics Dashboard', value: 'dashboard' },
        { name: '📧  Financial Inbox', value: 'inbox' },
        { name: '⚙️   Settings', value: 'settings' },
        { name: '🚪  Exit', value: 'exit' }
      ],
      pageSize: 10
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
    case 'automation':
      await automationMenu();
      break;
    case 'dashboard':
      await showDashboard();
      break;
    case 'inbox':
      await showInbox();
      break;
    case 'settings':
      await settingsMenu();
      break;
    case 'exit':
      console.log(chalk.yellow('\n👋 Goodbye!\n'));
      process.exit(0);
  }
};

// Company Management
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

// Create Company Flow
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
  
  // Simulate API calls
  await sleep(1000);
  spinner.update({ text: 'Checking name availability...' });
  await sleep(1000);
  spinner.update({ text: 'Preparing formation documents...' });
  await sleep(1000);
  spinner.update({ text: 'Filing with state...' });
  await sleep(1000);
  spinner.update({ text: 'Obtaining EIN...' });
  await sleep(1000);
  
  spinner.success({ text: 'Company created successfully!' });

  const companyInfo = boxen(
    chalk.green(`
${chalk.bold(answers.name + ' ' + answers.type)}

📍 State: ${answers.state}
🆔 EIN: ${faker.string.numeric('##-#######')}
📅 Formed: ${new Date().toLocaleDateString()}
💼 Status: Active

Next steps:
• Open a business bank account
• Set up payroll
• Connect integrations
    `),
    {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'green'
    }
  );

  console.log(companyInfo);
  await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
};

// Banking Operations
const bankingMenu = async () => {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: chalk.cyan('Banking Operations'),
      choices: [
        { name: '💳  Create Bank Account', value: 'create' },
        { name: '💰  Check Balance', value: 'balance' },
        { name: '📊  View Transactions', value: 'transactions' },
        { name: '🔄  Transfer Funds', value: 'transfer' },
        { name: '📈  Yield Settings', value: 'yield' },
        { name: '🔙  Back', value: 'back' }
      ]
    }
  ]);

  if (action === 'balance') {
    await showBalance();
  } else if (action === 'transactions') {
    await showTransactions();
  } else if (action === 'create') {
    await createBankAccount();
  }

  if (action !== 'back') {
    await bankingMenu();
  } else {
    await mainMenu();
  }
};

// Show Balance with fancy display
const showBalance = async () => {
  const spinner = ora('Fetching balance...').start();
  await sleep(1000);
  spinner.stop();

  const balance = faker.number.float({ min: 10000, max: 500000, precision: 0.01 });
  const pending = faker.number.float({ min: 1000, max: 50000, precision: 0.01 });
  const apy = faker.number.float({ min: 4, max: 8, precision: 0.1 });

  console.log(boxen(
    chalk.bold.green(`
💰 Account Balance

Available: $${balance.toLocaleString()} USDC
Pending:   $${pending.toLocaleString()}
APY:       ${apy}%

📈 This month: +$${faker.number.float({ min: 100, max: 1000, precision: 0.01 }).toLocaleString()}
    `),
    {
      padding: 1,
      borderStyle: 'double',
      borderColor: 'green',
      title: 'Zero Finance',
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

  // Generate fake transactions
  for (let i = 0; i < 10; i++) {
    const date = faker.date.recent({ days: 30 });
    const isIncome = faker.datatype.boolean();
    const amount = faker.number.float({ min: 100, max: 10000, precision: 0.01 });
    
    table.push([
      date.toLocaleDateString(),
      faker.company.name(),
      isIncome ? chalk.green(`+$${amount.toLocaleString()}`) : chalk.red(`-$${amount.toLocaleString()}`),
      chalk.green('✓')
    ]);
  }

  console.log(table.toString());
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
        { name: '💸  Pay Invoice', value: 'invoice' },
        { name: '👥  Pay Contractor', value: 'contractor' },
        { name: '💼  Run Payroll', value: 'payroll' },
        { name: '📋  Payment History', value: 'history' },
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

// Pay Contractor Flow
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
    },
    {
      type: 'list',
      name: 'method',
      message: 'Payment method:',
      choices: [
        { name: '⚡ USDC (Instant)', value: 'usdc' },
        { name: '🏦 ACH (1-2 days)', value: 'ach' },
        { name: '💸 Wire (Same day)', value: 'wire' }
      ]
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
Method: ${answers.method.toUpperCase()}
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

// Show Financial Inbox
const showInbox = async () => {
  const spinner = ora('Loading inbox...').start();
  await sleep(1000);
  spinner.stop();

  console.log(chalk.bold.cyan('\n📧 Financial Inbox\n'));

  const inboxItems = [
    { icon: '🔴', from: 'AWS', subject: 'Invoice #1234 - $1,247.32', due: 'Due in 5 days' },
    { icon: '🔴', from: 'Sarah Chen', subject: 'Contractor Invoice - $3,500', due: 'Due today' },
    { icon: '🟡', from: 'Figma', subject: 'Subscription Renewal - $45/mo', due: 'Review needed' },
    { icon: '✅', from: 'Google', subject: 'Payment Processed - $450', due: 'Completed' },
    { icon: '✅', from: 'Vercel', subject: 'Payment Processed - $20', due: 'Completed' }
  ];

  inboxItems.forEach(item => {
    console.log(`${item.icon} ${chalk.bold(item.from)} - ${item.subject}`);
    console.log(`   ${chalk.dim(item.due)}\n`);
  });

  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Select an action:',
      choices: [
        { name: '💸 Pay All Pending', value: 'pay' },
        { name: '👁️  View Details', value: 'view' },
        { name: '🔙 Back', value: 'back' }
      ]
    }
  ]);

  if (action === 'pay') {
    const spinner = createSpinner('Processing payments...').start();
    await sleep(2000);
    spinner.success({ text: 'All pending payments processed!' });
  }

  await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
  await mainMenu();
};

// Analytics Dashboard
const showDashboard = async () => {
  const screen = blessed.screen({
    smartCSR: true,
    title: 'Zero Finance Dashboard'
  });

  const grid = new contrib.grid({ rows: 12, cols: 12, screen: screen });

  // Revenue chart
  const line = grid.set(0, 0, 6, 6, contrib.line, {
    style: { line: "yellow", text: "green", baseline: "black" },
    xLabelPadding: 3,
    xPadding: 5,
    showLegend: true,
    wholeNumbersOnly: false,
    label: 'Revenue Trend'
  });

  const data = {
    x: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    y: [5000, 8000, 12000, 9000, 15000, 11000, 18000]
  };

  line.setData([
    {
      title: 'Revenue',
      x: data.x,
      y: data.y,
      style: { line: 'green' }
    }
  ]);

  // Metrics
  const box1 = grid.set(0, 6, 3, 3, blessed.box, {
    label: 'Total Balance',
    content: '\n  $125,430.52',
    style: { fg: 'green', border: { fg: 'cyan' } }
  });

  const box2 = grid.set(0, 9, 3, 3, blessed.box, {
    label: 'Monthly Revenue',
    content: '\n  $45,230.00',
    style: { fg: 'yellow', border: { fg: 'cyan' } }
  });

  const box3 = grid.set(3, 6, 3, 3, blessed.box, {
    label: 'Pending Payments',
    content: '\n  $8,420.00',
    style: { fg: 'red', border: { fg: 'cyan' } }
  });

  const box4 = grid.set(3, 9, 3, 3, blessed.box, {
    label: 'APY Earnings',
    content: '\n  5.2% ($542/mo)',
    style: { fg: 'cyan', border: { fg: 'cyan' } }
  });

  // Transaction log
  const log = grid.set(6, 0, 6, 12, contrib.log, {
    fg: "green",
    selectedFg: "green",
    label: 'Recent Transactions'
  });

  log.log('2024-01-15 | -$3,500.00 | Contractor Payment - Sarah Chen');
  log.log('2024-01-15 | -$1,200.00 | AWS Services');
  log.log('2024-01-14 | +$12,500.00 | Client Payment - Acme Corp');
  log.log('2024-01-13 | -$450.00 | Google Workspace');
  log.log('2024-01-12 | -$5,000.00 | Contractor Payment - Alex Rivera');

  screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    screen.destroy();
    mainMenu();
  });

  screen.render();
};

// Helper functions
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Run the CLI
const run = async () => {
  showBanner();
  await mainMenu();
};

run().catch(console.error);