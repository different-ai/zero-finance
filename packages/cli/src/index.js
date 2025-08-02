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

import { Command } from 'commander';
import Conf from 'conf';

// Configuration store
const config = new Conf({
  projectName: 'zero-finance-cli',
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
  console.log(chalk.dim(`  Self-Custody Business Banking v${VERSION}\n`));
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
        { name: '📊  Company Details', value: 'details' },
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
  } else if (action === 'details') {
    await showCompanyDetails();
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

  const ein = faker.string.numeric('##-#######');
  const company = {
    id: faker.string.uuid(),
    name: answers.name,
    type: answers.type,
    state: answers.state,
    ein: ein,
    formed: new Date().toISOString(),
    balance: 0
  };

  // Save to config
  const companies = config.get('companies');
  companies.push(company);
  config.set('companies', companies);
  config.set('currentCompany', company.id);

  const companyInfo = boxen(
    chalk.green(`
${chalk.bold(answers.name + ' ' + answers.type)}

📍 State: ${answers.state}
🆔 EIN: ${ein}
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

// List Companies
const listCompanies = async () => {
  const companies = config.get('companies');
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
  const companies = config.get('companies');
  
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
  } else if (action === 'yield') {
    await showYieldSettings();
  } else if (action === 'transfer') {
    await transferFunds();
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

  const currentCompanyId = config.get('currentCompany');
  const companies = config.get('companies');
  const company = companies.find(c => c.id === currentCompanyId);

  if (!company) {
    console.log(chalk.yellow('\nNo company selected. Please create or select a company first.\n'));
    await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
    return;
  }

  const balance = company.balance || faker.number.float({ min: 10000, max: 500000, precision: 0.01 });
  const pending = faker.number.float({ min: 1000, max: 50000, precision: 0.01 });
  const apy = 5.2;
  const monthlyYield = balance * (apy / 100 / 12);

  console.log(boxen(
    chalk.bold.green(`
💰 ${company.name}

Available: $${balance.toLocaleString()} USDC
Pending:   $${pending.toLocaleString()}
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

  // Generate realistic transactions
  const transactions = [
    { date: new Date('2024-01-15'), desc: 'Sarah Chen - Contractor', amount: -3500, status: '✓' },
    { date: new Date('2024-01-15'), desc: 'AWS Services', amount: -1247.32, status: '✓' },
    { date: new Date('2024-01-14'), desc: 'Acme Corp - Invoice Payment', amount: 12500, status: '✓' },
    { date: new Date('2024-01-13'), desc: 'Google Workspace', amount: -450, status: '✓' },
    { date: new Date('2024-01-12'), desc: 'Alex Rivera - Contractor', amount: -5000, status: '✓' },
    { date: new Date('2024-01-11'), desc: 'TechStart Inc - Payment', amount: 8750, status: '✓' },
    { date: new Date('2024-01-10'), desc: 'Payroll Run', amount: -15000, status: '✓' }
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
  
  // Summary
  const totalIn = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const totalOut = Math.abs(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));
  
  console.log(chalk.bold('\nSummary:'));
  console.log(`Total Inflow:  ${chalk.green(`$${totalIn.toLocaleString()}`)}`);
  console.log(`Total Outflow: ${chalk.red(`$${totalOut.toLocaleString()}`)}`);
  console.log(`Net Flow:      ${totalIn > totalOut ? chalk.green(`+$${(totalIn - totalOut).toLocaleString()}`) : chalk.red(`-$${(totalOut - totalIn).toLocaleString()}`)}`);

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
        { name: '⚡  Quick Pay', value: 'quickpay' },
        { name: '🔙  Back', value: 'back' }
      ]
    }
  ]);

  if (action === 'contractor') {
    await payContractor();
  } else if (action === 'payroll') {
    await runPayroll();
  } else if (action === 'invoice') {
    await payInvoice();
  } else if (action === 'quickpay') {
    await quickPay();
  } else if (action === 'history') {
    await showPaymentHistory();
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
    },
    {
      type: 'input',
      name: 'description',
      message: 'Description (optional):',
      default: 'Contractor payment'
    }
  ]);

  const spinner = createSpinner('Processing payment...').start();
  await sleep(2000);
  spinner.success({ text: 'Payment sent successfully!' });

  const txId = faker.string.alphanumeric(10).toUpperCase();
  console.log(boxen(
    chalk.green(`
✅ Payment Confirmed

To: ${answers.email}
Amount: $${answers.amount.toLocaleString()}
Method: ${answers.method.toUpperCase()}
Description: ${answers.description}
Transaction ID: ${txId}

${answers.method === 'usdc' ? '⚡ Instant settlement on Base network' : ''}
${answers.method === 'ach' ? '🏦 Expected arrival: 1-2 business days' : ''}
${answers.method === 'wire' ? '💸 Same-day settlement' : ''}
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
    { name: 'Michael Brown', role: 'Marketing Manager', salary: 3200 },
    { name: 'Sarah Davis', role: 'Operations Lead', salary: 3500 }
  ];

  const payPeriodStart = new Date();
  payPeriodStart.setDate(1);
  const payPeriodEnd = new Date();
  payPeriodEnd.setDate(15);

  console.log(chalk.bold.cyan('\n💼 Payroll Run\n'));
  console.log(`Pay Period: ${payPeriodStart.toLocaleDateString()} - ${payPeriodEnd.toLocaleDateString()}\n`);

  const table = new Table({
    head: ['Employee', 'Role', 'Gross Pay', 'Taxes', 'Net Pay'],
    style: { head: ['cyan'] }
  });

  let totalGross = 0;
  let totalNet = 0;
  
  employees.forEach(emp => {
    const taxes = emp.salary * 0.25; // Simplified tax calculation
    const netPay = emp.salary - taxes;
    totalGross += emp.salary;
    totalNet += netPay;
    
    table.push([
      emp.name,
      emp.role,
      `$${emp.salary.toLocaleString()}`,
      chalk.red(`-$${taxes.toFixed(2)}`),
      chalk.green(`$${netPay.toFixed(2)}`)
    ]);
  });

  console.log(table.toString());
  
  console.log(chalk.bold('\nPayroll Summary:'));
  console.log(`Total Gross Pay: $${totalGross.toLocaleString()}`);
  console.log(`Total Taxes:     ${chalk.red(`-$${(totalGross - totalNet).toFixed(2)}`)}`);
  console.log(`Total Net Pay:   ${chalk.green(`$${totalNet.toFixed(2)}`)}`);

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
    await sleep(1000);
    spinner.update({ text: 'Calculating withholdings...' });
    await sleep(1000);
    spinner.update({ text: 'Filing tax payments...' });
    await sleep(1000);
    spinner.update({ text: 'Distributing payments...' });
    await sleep(1000);
    spinner.success({ text: 'Payroll completed! All employees paid.' });
  }

  await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
};

// Automation Menu
const automationMenu = async () => {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: chalk.cyan('AI & Automation'),
      choices: [
        { name: '🤖  Enable AI Assistant', value: 'enable' },
        { name: '📧  Connect Gmail', value: 'gmail' },
        { name: '🧠  Connect Claude', value: 'claude' },
        { name: '📊  View AI Stats', value: 'stats' },
        { name: '⚙️   Automation Rules', value: 'rules' },
        { name: '🔙  Back', value: 'back' }
      ]
    }
  ]);

  if (action === 'enable') {
    await enableAI();
  } else if (action === 'gmail') {
    await connectGmail();
  } else if (action === 'claude') {
    await connectClaude();
  } else if (action === 'stats') {
    await showAIStats();
  } else if (action === 'rules') {
    await showAutomationRules();
  }

  if (action !== 'back') {
    await automationMenu();
  } else {
    await mainMenu();
  }
};

// Enable AI
const enableAI = async () => {
  const spinner = createSpinner('Enabling AI automation...').start();
  
  await sleep(1000);
  spinner.update({ text: 'Connecting to Claude AI...' });
  await sleep(1000);
  spinner.update({ text: 'Analyzing transaction patterns...' });
  await sleep(1000);
  spinner.update({ text: 'Setting up smart rules...' });
  await sleep(1000);
  spinner.update({ text: 'Enabling invoice detection...' });
  await sleep(1000);
  
  spinner.success({ text: 'AI automation enabled!' });

  console.log(boxen(
    chalk.green(`
🤖 AI Automation Active

Enabled features:
✓ Auto-categorize transactions
✓ Invoice detection from emails
✓ Smart payment scheduling
✓ Spending pattern analysis
✓ Cash flow optimization
✓ Fraud detection
✓ Natural language commands

Your AI will now:
• Process invoices automatically
• Optimize payment timing
• Alert on unusual activity
• Maximize yield earnings
• Answer financial questions

Try: "Hey Claude, what are my biggest expenses?"
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
    { icon: '🔴', from: 'AWS', subject: 'Invoice #1234 - $1,247.32', due: 'Due in 5 days', urgent: true },
    { icon: '🔴', from: 'Sarah Chen', subject: 'Contractor Invoice - $3,500', due: 'Due today', urgent: true },
    { icon: '🟡', from: 'Figma', subject: 'Subscription Renewal - $45/mo', due: 'Review needed', urgent: false },
    { icon: '🟡', from: 'Vercel', subject: 'Usage Alert - $120 this month', due: 'FYI', urgent: false },
    { icon: '✅', from: 'Google', subject: 'Payment Processed - $450', due: 'Completed', urgent: false },
    { icon: '✅', from: 'Stripe', subject: 'Payout Received - $8,420', due: 'Completed', urgent: false }
  ];

  // Group by status
  const urgent = inboxItems.filter(i => i.urgent);
  const other = inboxItems.filter(i => !i.urgent);

  if (urgent.length > 0) {
    console.log(chalk.red.bold('⚡ Requires Action:\n'));
    urgent.forEach(item => {
      console.log(`${item.icon} ${chalk.bold(item.from)} - ${item.subject}`);
      console.log(`   ${chalk.red(item.due)}\n`);
    });
  }

  if (other.length > 0) {
    console.log(chalk.dim('\n📋 Other Items:\n'));
    other.forEach(item => {
      console.log(`${item.icon} ${chalk.bold(item.from)} - ${item.subject}`);
      console.log(`   ${chalk.dim(item.due)}\n`);
    });
  }

  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Select an action:',
      choices: [
        { name: '💸 Pay All Pending', value: 'pay' },
        { name: '👁️  View Details', value: 'view' },
        { name: '🤖 Ask AI Assistant', value: 'ai' },
        { name: '🔙 Back', value: 'back' }
      ]
    }
  ]);

  if (action === 'pay') {
    const spinner = createSpinner('Processing payments...').start();
    await sleep(2000);
    spinner.success({ text: 'All pending payments processed!' });
    
    console.log(chalk.green('\n✅ Payments Sent:'));
    console.log('  • AWS - $1,247.32 (ACH)');
    console.log('  • Sarah Chen - $3,500 (USDC)');
    console.log('  • Figma - $45 (Card)\n');
  } else if (action === 'ai') {
    console.log(chalk.cyan('\n🤖 Claude: Based on your inbox, here\'s what I recommend:\n'));
    console.log('1. Pay Sarah Chen\'s invoice today to maintain good contractor relations');
    console.log('2. AWS payment can wait 3-4 days to optimize cash flow');
    console.log('3. Consider annual Figma subscription to save 20% ($108/year)');
    console.log('4. Your Vercel usage is trending up - might want to optimize');
  }

  await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
  
  if (action !== 'back') {
    await showInbox();
  } else {
    await mainMenu();
  }
};

// Analytics Dashboard (Terminal-based)
const showDashboard = async () => {
  console.clear();
  console.log(chalk.bold.cyan('📊 Zero Finance Dashboard\n'));

  // Revenue chart (ASCII)
  console.log(chalk.bold('Revenue Trend (7 days):'));
  const data = [5000, 8000, 12000, 9000, 15000, 11000, 18000];
  const max = Math.max(...data);
  const height = 10;
  
  for (let i = height; i > 0; i--) {
    let line = '';
    data.forEach(val => {
      const barHeight = Math.round((val / max) * height);
      line += barHeight >= i ? chalk.green('█') : ' ';
      line += ' ';
    });
    console.log(line);
  }
  console.log('M T W T F S S\n');

  // Key metrics
  const metrics = [
    { label: 'Total Balance', value: '$125,430.52', color: 'green' },
    { label: 'Monthly Revenue', value: '$45,230.00', color: 'yellow' },
    { label: 'Pending Payments', value: '$8,420.00', color: 'red' },
    { label: 'APY Earnings', value: '5.2% ($542/mo)', color: 'cyan' }
  ];

  metrics.forEach(m => {
    console.log(`${chalk.bold(m.label)}: ${chalk[m.color](m.value)}`);
  });

  console.log(chalk.bold('\n📈 Recent Activity:'));
  console.log('• Processed 142 transactions (97% automated)');
  console.log('• Saved 12 hours with AI automation');
  console.log('• Prevented 3 duplicate payments ($3,200 saved)');
  console.log('• Optimized payment timing (saved $180 in fees)');

  console.log(chalk.bold('\n💡 AI Insights:'));
  console.log('• Cloud costs up 12% - consider reserved instances');
  console.log('• 3 unused subscriptions detected - save $340/month');
  console.log('• Cash flow healthy - consider increasing yield allocation');

  await inquirer.prompt([{ type: 'input', name: 'continue', message: '\nPress Enter to continue...' }]);
  await mainMenu();
};

// Settings Menu
const settingsMenu = async () => {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: chalk.cyan('Settings'),
      choices: [
        { name: '🎨  Theme', value: 'theme' },
        { name: '🔔  Notifications', value: 'notifications' },
        { name: '🔐  Security', value: 'security' },
        { name: '💾  Export Data', value: 'export' },
        { name: '🔙  Back', value: 'back' }
      ]
    }
  ]);

  if (action === 'export') {
    const spinner = createSpinner('Exporting data...').start();
    await sleep(2000);
    spinner.success({ text: 'Data exported to zero-finance-export.json' });
  }

  if (action !== 'back') {
    await settingsMenu();
  } else {
    await mainMenu();
  }
};

// Helper functions
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const createBankAccount = async () => {
  const spinner = createSpinner('Creating self-custody bank account...').start();
  
  await sleep(1000);
  spinner.update({ text: 'Verifying company information...' });
  await sleep(1000);
  spinner.update({ text: 'Running KYC checks...' });
  await sleep(1000);
  spinner.update({ text: 'Creating self-custody wallet...' });
  await sleep(1000);
  spinner.update({ text: 'Generating banking details...' });
  await sleep(1000);
  
  spinner.success({ text: 'Bank account created!' });

  console.log(boxen(
    chalk.green(`
✅ Self-Custody Account Created

🏦 Banking Details:
IBAN: US83 ZERO 0000 0012 3456 7890
Routing: 021000021
Account: 123456789

🔐 Wallet Details:
Address: 0x742d35Cc6634C0532925a3b844Bc9e7595f6E123
Network: Base (Ethereum L2)
Asset: USDC

✨ Features:
• Your keys, your control
• Instant USDC settlements
• Traditional wire/ACH support
• 5.2% APY on idle funds
• No account closures

Your funds are stored as USDC in a wallet you control.
Send/receive traditional payments seamlessly.
    `),
    {
      padding: 1,
      borderStyle: 'round',
      borderColor: 'green'
    }
  ));

  await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
};

const showYieldSettings = async () => {
  console.log(chalk.bold.cyan('\n📈 Yield Settings\n'));
  
  const { settings } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'settings',
      message: 'Enable automatic yield optimization?',
      default: true
    }
  ]);

  if (settings) {
    const { threshold } = await inquirer.prompt([
      {
        type: 'number',
        name: 'threshold',
        message: 'Minimum balance to keep liquid ($):',
        default: 10000
      }
    ]);

    console.log(chalk.green(`\n✓ Auto-yield enabled`));
    console.log(`• Current APY: 5.2%`);
    console.log(`• Liquid reserve: $${threshold.toLocaleString()}`);
    console.log(`• Excess funds automatically allocated to yield\n`);
  }

  await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
};

const payInvoice = async () => {
  const invoices = [
    { id: 'INV-001', vendor: 'AWS', amount: 1247.32, due: '2024-01-20' },
    { id: 'INV-002', vendor: 'CloudFlare', amount: 890.00, due: '2024-01-22' },
    { id: 'INV-003', vendor: 'Vercel', amount: 20.00, due: '2024-01-25' },
    { id: 'INV-004', vendor: 'DataDog', amount: 450.00, due: '2024-01-18' }
  ];

  const choices = invoices.map(inv => ({
    name: `${inv.vendor} - $${inv.amount} (Due: ${inv.due})`,
    value: inv.id
  }));

  const { invoiceId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'invoiceId',
      message: 'Select invoice to pay:',
      choices
    }
  ]);

  const invoice = invoices.find(i => i.id === invoiceId);
  const spinner = createSpinner(`Paying invoice to ${invoice.vendor}...`).start();
  await sleep(2000);
  spinner.success({ text: 'Invoice paid successfully!' });

  console.log(chalk.green(`\n✅ Payment confirmed`));
  console.log(`Transaction ID: ${faker.string.alphanumeric(10).toUpperCase()}`);

  await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
};

const connectGmail = async () => {
  const spinner = createSpinner('Connecting to Gmail...').start();
  
  await sleep(1000);
  spinner.update({ text: 'Opening OAuth consent screen...' });
  await sleep(1000);
  spinner.update({ text: 'Authorizing access...' });
  await sleep(1000);
  spinner.update({ text: 'Scanning for financial emails...' });
  await sleep(1000);
  
  spinner.success({ text: 'Gmail connected!' });

  console.log(boxen(
    chalk.green(`
📧 Gmail Connected Successfully

Found in your inbox:
• 47 invoices
• 23 receipts  
• 15 payment confirmations
• 8 bank statements
• 32 subscription emails

AI will now:
✓ Auto-detect new invoices
✓ Extract payment details
✓ Create payment reminders
✓ Track payment status
✓ Alert on unusual charges

Next sync: Every 10 minutes
    `),
    {
      padding: 1,
      borderStyle: 'round',
      borderColor: 'green'
    }
  ));

  await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
};

const connectClaude = async () => {
  const spinner = createSpinner('Connecting to Claude AI...').start();
  
  await sleep(1000);
  spinner.update({ text: 'Authenticating with Anthropic...' });
  await sleep(1000);
  spinner.update({ text: 'Setting up financial assistant...' });
  await sleep(1000);
  
  spinner.success({ text: 'Claude AI connected!' });

  console.log(boxen(
    chalk.green(`
🧠 Claude AI Connected

Your AI assistant can now:
✓ Answer financial questions
✓ Analyze spending patterns
✓ Provide tax insights
✓ Optimize cash flow
✓ Suggest cost savings
✓ Explain transactions

Example commands:
• "What are my biggest expenses?"
• "How can I reduce AWS costs?"
• "When should I pay this invoice?"
• "Analyze my cash flow"
• "Find duplicate charges"
    `),
    {
      padding: 1,
      borderStyle: 'round',
      borderColor: 'green'
    }
  ));

  await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
};

const showAIStats = async () => {
  const spinner = ora('Loading AI statistics...').start();
  await sleep(1000);
  spinner.stop();

  console.log(chalk.bold.cyan('\n📊 AI Performance (Last 30 days)\n'));

  const table = new Table({
    head: ['Metric', 'Value', 'Impact'],
    style: { head: ['cyan'] }
  });

  table.push(
    ['Transactions Processed', '142', chalk.green('+97% automated')],
    ['Invoices Detected', '23', chalk.green('100% accuracy')],
    ['Time Saved', '12 hours', chalk.green('+$1,800 value')],
    ['Yield Optimized', '$542.31', chalk.green('+5.2% APY')],
    ['Duplicate Payments', '3 prevented', chalk.green('$3,200 saved')],
    ['Payment Timing', 'Optimized', chalk.green('$180 saved')]
  );

  console.log(table.toString());

  console.log(chalk.bold('\n🎯 Top AI Actions:'));
  console.log('1. Auto-categorized 138 transactions');
  console.log('2. Scheduled 23 payments optimally');
  console.log('3. Detected 8 subscription changes');
  console.log('4. Prevented 3 late payment fees');
  console.log('5. Identified $340/mo in savings');

  console.log(chalk.bold('\n💡 Current Insights:'));
  console.log('• Cloud costs trending up 12% - review usage');
  console.log('• 3 unused subscriptions costing $340/month');
  console.log('• Cash flow healthy - increase yield allocation');
  console.log('• Tax payment due in 45 days - set aside $12,000');

  await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
};

// Additional helper functions
const showCompanyDetails = async () => {
  const currentCompanyId = config.get('currentCompany');
  const companies = config.get('companies');
  const company = companies.find(c => c.id === currentCompanyId);

  if (!company) {
    console.log(chalk.yellow('\nNo company selected.\n'));
    await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
    return;
  }

  console.log(boxen(
    chalk.cyan(`
${chalk.bold(company.name)} (${company.type})

📍 State: ${company.state}
🆔 EIN: ${company.ein}
📅 Formed: ${new Date(company.formed).toLocaleDateString()}
💰 Balance: $${(company.balance || 0).toLocaleString()}

📊 This Month:
• Revenue: $45,230
• Expenses: $28,450
• Net Income: $16,780

👥 Employees: 4
📄 Invoices: 3 pending
💳 Cards: 2 active
    `),
    {
      padding: 1,
      borderStyle: 'round',
      borderColor: 'cyan',
      title: 'Company Details',
      titleAlignment: 'center'
    }
  ));

  await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
};

const transferFunds = async () => {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: 'Transfer type:',
      choices: [
        { name: '🏦 Bank to Bank', value: 'bank' },
        { name: '💸 To Crypto Wallet', value: 'crypto' },
        { name: '🔄 Between Companies', value: 'internal' }
      ]
    },
    {
      type: 'input',
      name: 'recipient',
      message: 'Recipient (account/address):',
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

const quickPay = async () => {
  const recentPayees = [
    { name: 'Sarah Chen (Contractor)', email: 'sarah@example.com', lastAmount: 3500 },
    { name: 'AWS', account: 'aws-billing', lastAmount: 1247.32 },
    { name: 'Alex Rivera (Contractor)', email: 'alex@example.com', lastAmount: 5000 }
  ];

  const choices = recentPayees.map(p => ({
    name: `${p.name} - Last: $${p.lastAmount}`,
    value: p
  }));

  const { payee } = await inquirer.prompt([
    {
      type: 'list',
      name: 'payee',
      message: 'Select recent payee:',
      choices
    }
  ]);

  const { amount } = await inquirer.prompt([
    {
      type: 'number',
      name: 'amount',
      message: `Amount (last: $${payee.lastAmount}):`,
      default: payee.lastAmount
    }
  ]);

  const spinner = createSpinner(`Paying ${payee.name}...`).start();
  await sleep(1500);
  spinner.success({ text: 'Payment sent!' });

  await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
};

const showPaymentHistory = async () => {
  const spinner = ora('Loading payment history...').start();
  await sleep(1000);
  spinner.stop();

  console.log(chalk.bold.cyan('\n📋 Payment History\n'));

  const payments = [
    { date: '2024-01-15', to: 'Sarah Chen', amount: 3500, method: 'USDC', status: '✅' },
    { date: '2024-01-14', to: 'AWS', amount: 1247.32, method: 'ACH', status: '✅' },
    { date: '2024-01-12', to: 'Payroll (4 employees)', amount: 15000, method: 'ACH', status: '✅' },
    { date: '2024-01-10', to: 'Google Workspace', amount: 450, method: 'Card', status: '✅' },
    { date: '2024-01-08', to: 'Alex Rivera', amount: 5000, method: 'Wire', status: '✅' }
  ];

  const table = new Table({
    head: ['Date', 'Recipient', 'Amount', 'Method', 'Status'],
    style: { head: ['cyan'] }
  });

  payments.forEach(p => {
    table.push([
      p.date,
      p.to,
      chalk.red(`-$${p.amount.toLocaleString()}`),
      p.method,
      p.status
    ]);
  });

  console.log(table.toString());

  const total = payments.reduce((sum, p) => sum + p.amount, 0);
  console.log(`\nTotal Payments: ${chalk.red(`$${total.toLocaleString()}`)}`);

  await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
};

const showAutomationRules = async () => {
  console.log(chalk.bold.cyan('\n⚙️  Automation Rules\n'));

  const rules = [
    { name: 'Auto-pay recurring vendors', status: 'Active', condition: 'Amount < $1,000' },
    { name: 'Categorize cloud services', status: 'Active', condition: 'Vendor matches AWS, GCP, Azure' },
    { name: 'Flag large transactions', status: 'Active', condition: 'Amount > $10,000' },
    { name: 'Schedule optimal payment', status: 'Active', condition: '3 days before due' },
    { name: 'Auto-yield allocation', status: 'Active', condition: 'Balance > $50,000' }
  ];

  rules.forEach((rule, i) => {
    const status = rule.status === 'Active' ? chalk.green('✓ Active') : chalk.red('✗ Inactive');
    console.log(`${i + 1}. ${chalk.bold(rule.name)}`);
    console.log(`   Status: ${status}`);
    console.log(`   Condition: ${chalk.dim(rule.condition)}\n`);
  });

  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        { name: '➕ Add New Rule', value: 'add' },
        { name: '✏️  Edit Rules', value: 'edit' },
        { name: '🔙 Back', value: 'back' }
      ]
    }
  ]);

  if (action === 'add') {
    console.log(chalk.green('\n✓ Rule creation wizard coming soon!\n'));
  }

  await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
};

// Commander setup for CLI arguments
const program = new Command();

program
  .name('zero')
  .description('Zero Finance CLI - Self-custody business banking')
  .version(VERSION);

program
  .command('company')
  .description('Manage companies')
  .action(async () => {
    showBanner();
    await companyMenu();
  });

program
  .command('pay <email> <amount>')
  .description('Quick payment to contractor')
  .action(async (email, amount) => {
    showBanner();
    const spinner = createSpinner(`Paying ${email}...`).start();
    await sleep(2000);
    spinner.success({ text: `Payment of $${amount} sent to ${email}!` });
  });

program
  .command('balance')
  .description('Check account balance')
  .action(async () => {
    showBanner();
    await showBalance();
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