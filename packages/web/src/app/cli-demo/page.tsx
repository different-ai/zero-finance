'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Command {
  input: string;
  output: string[];
  timestamp: Date;
}

export default function CLIDemo() {
  const [commands, setCommands] = useState<Command[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const processCommand = (input: string): string[] => {
    const cmd = input.toLowerCase().trim();
    const args = cmd.split(' ');
    const mainCmd = args[0];

    switch (mainCmd) {
      case 'help':
        return [
          '╔════════════════════════════════════════════════════════════════╗',
          '║                    ZERO FINANCE CLI v1.0.0                     ║',
          '╠════════════════════════════════════════════════════════════════╣',
          '║ COMPANY SETUP                                                  ║',
          '║   company create <type>     Create LLC or C-Corp               ║',
          '║   company list             List all companies                  ║',
          '║   company switch <id>      Switch active company               ║',
          '║                                                                ║',
          '║ BANKING                                                        ║',
          '║   bank create              Create business bank account         ║',
          '║   bank balance             Check account balance               ║',
          '║   bank transactions        View recent transactions            ║',
          '║                                                                ║',
          '║ PAYMENTS                                                       ║',
          '║   pay invoice <id>         Pay an invoice                     ║',
          '║   pay contractor <email>   Pay a contractor                   ║',
          '║   payroll run              Run payroll                        ║',
          '║   payroll add <email>      Add employee to payroll            ║',
          '║                                                                ║',
          '║ AUTOMATION                                                     ║',
          '║   auto enable              Enable AI automation               ║',
          '║   auto rules               View automation rules              ║',
          '║   auto stats               View automation statistics          ║',
          '║                                                                ║',
          '║ INTEGRATIONS                                                   ║',
          '║   connect claude           Connect Claude AI                  ║',
          '║   integrations status      View connector status              ║',
          '║                                                                ║',
          '║ UTILITIES                                                      ║',
          '║   clear                    Clear terminal                     ║',
          '║   exit                     Exit CLI                           ║',
          '╚════════════════════════════════════════════════════════════════╝'
        ];

      case 'company':
        if (args[1] === 'create') {
          if (args[2] === 'llc') {
            return [
              '🏢 Creating LLC...',
              '',
              '✓ Checking name availability: "TechVentures LLC"',
              '✓ Preparing formation documents',
              '✓ Filing with Delaware Secretary of State',
              '✓ Obtaining EIN from IRS',
              '✓ Creating operating agreement',
              '',
              '🎉 LLC created successfully!',
              '',
              'Company Details:',
              '  Name: TechVentures LLC',
              '  State: Delaware',
              '  EIN: 88-1234567',
              '  Formation Date: ' + new Date().toLocaleDateString(),
              '',
              'Next steps:',
              '  1. Run "bank create" to open a business bank account',
              '  2. Run "payroll add" to set up payroll'
            ];
          } else if (args[2] === 'c-corp') {
            return [
              '🏢 Creating C-Corporation...',
              '',
              '✓ Checking name availability: "TechVentures Inc."',
              '✓ Preparing articles of incorporation',
              '✓ Filing with Delaware Secretary of State',
              '✓ Issuing stock certificates',
              '✓ Creating corporate bylaws',
              '✓ Obtaining EIN from IRS',
              '',
              '🎉 C-Corp created successfully!',
              '',
              'Company Details:',
              '  Name: TechVentures Inc.',
              '  State: Delaware',
              '  EIN: 88-7654321',
              '  Authorized Shares: 10,000,000',
              '  Formation Date: ' + new Date().toLocaleDateString()
            ];
          }
        } else if (args[1] === 'list') {
          return [
            '📋 Your Companies:',
            '',
            '1. TechVentures LLC',
            '   Status: Active ✓',
            '   EIN: 88-1234567',
            '   Bank: Connected (Chase Business)',
            '   Monthly Revenue: $45,230',
            '',
            '2. AI Solutions Inc.',
            '   Status: Active ✓',
            '   EIN: 88-9876543',
            '   Bank: Connected (Bank of America)',
            '   Monthly Revenue: $128,450'
          ];
        }
        break;

      case 'bank':
        if (args[1] === 'create') {
          return [
            '🏦 Creating business bank account...',
            '',
            '✓ Verifying company information',
            '✓ Running KYC checks',
            '✓ Creating self-custody wallet',
            '✓ Generating IBAN/ACH details',
            '✓ Setting up USDC integration',
            '',
            '✅ Bank account created!',
            '',
            'Account Details:',
            '  Type: Self-Custody Business Account',
            '  IBAN: US83 ZERO 0000 0012 3456 7890',
            '  Routing: 021000021',
            '  Account: 123456789',
            '  USDC Address: 0x742d35Cc6634C0532925a3b844Bc9e7595f6E123',
            '',
            '💡 Your funds are stored as USDC in a wallet you control.',
            '   Send/receive traditional wires and ACH payments seamlessly.'
          ];
        } else if (args[1] === 'balance') {
          return [
            '💰 Account Balance',
            '',
            'Available Balance: $125,430.52 (125,430.52 USDC)',
            '',
            'Breakdown:',
            '  Operating Funds:  $85,430.52',
            '  Payroll Reserve:  $30,000.00',
            '  Tax Reserve:      $10,000.00',
            '',
            'Pending:',
            '  Incoming: $15,250.00 (2 payments)',
            '  Outgoing: $8,420.00 (5 payments)',
            '',
            '📈 Auto-Earn Status: Enabled',
            '   Current APY: 5.2%',
            '   Monthly Earnings: $542.31'
          ];
        } else if (args[1] === 'transactions') {
          return [
            '📊 Recent Transactions',
            '',
            '2024-01-15 | -$3,500.00 | Contractor Payment - Sarah Chen',
            '2024-01-15 | -$1,200.00 | AWS Services',
            '2024-01-14 | +$12,500.00 | Client Payment - Acme Corp',
            '2024-01-13 | -$450.00 | Google Workspace',
            '2024-01-12 | -$5,000.00 | Contractor Payment - Alex Rivera',
            '2024-01-11 | +$8,750.00 | Client Payment - TechStart Inc',
            '2024-01-10 | -$15,000.00 | Payroll Run (5 employees)',
            '',
            'Summary (Last 30 days):',
            '  Total Inflow:  $145,230.00',
            '  Total Outflow: $98,450.00',
            '  Net Flow:      +$46,780.00'
          ];
        }
        break;

      case 'pay':
        if (args[1] === 'invoice') {
          return [
            '📄 Processing invoice payment...',
            '',
            'Invoice Details:',
            '  ID: INV-2024-0142',
            '  Vendor: CloudTech Solutions',
            '  Amount: $2,450.00',
            '  Due Date: 2024-01-20',
            '',
            '🤖 AI Analysis:',
            '  ✓ Invoice verified authentic',
            '  ✓ Vendor verified (paid 12 times before)',
            '  ✓ Amount within expected range',
            '  ✓ Services match contract terms',
            '',
            '💸 Initiating payment...',
            '✓ Payment sent via ACH',
            '✓ Transaction ID: TXN-8B4F2A91',
            '',
            '✅ Payment completed successfully!'
          ];
        } else if (args[1] === 'contractor') {
          return [
            '👤 Paying contractor...',
            '',
            'Contractor: alex.rivera@example.com',
            'Found recent invoice in inbox:',
            '  Amount: $5,000.00',
            '  Project: Mobile App Development',
            '  Hours: 80 @ $62.50/hour',
            '',
            '💳 Payment Method:',
            '  [1] ACH Transfer (1-2 days)',
            '  [2] Wire Transfer (same day)',
            '  [3] USDC (instant)',
            '',
            'Selected: USDC (instant)',
            '',
            '✓ Payment sent to contractor wallet',
            '✓ Transaction hash: 0x742d...e7595f',
            '✓ Email notification sent',
            '',
            '✅ Contractor paid successfully!'
          ];
        }
        break;

      case 'payroll':
        if (args[1] === 'run') {
          return [
            '💼 Running payroll...',
            '',
            'Payroll Date: ' + new Date().toLocaleDateString(),
            'Pay Period: Jan 1-15, 2024',
            '',
            'Employees:',
            '  1. John Smith (Engineer)         $4,500.00',
            '  2. Emily Johnson (Designer)      $3,800.00',
            '  3. Michael Brown (Marketing)     $3,200.00',
            '  4. Sarah Davis (Operations)      $3,500.00',
            '',
            'Summary:',
            '  Gross Pay:        $15,000.00',
            '  Federal Tax:      -$3,150.00',
            '  State Tax:        -$1,050.00',
            '  Benefits:         -$1,200.00',
            '  Net Pay:          $9,600.00',
            '',
            '✓ Calculating withholdings',
            '✓ Filing tax payments',
            '✓ Distributing payments via ACH',
            '✓ Updating payroll records',
            '',
            '✅ Payroll completed! All employees paid.'
          ];
        } else if (args[1] === 'add') {
          return [
            '➕ Adding employee to payroll...',
            '',
            'Employee Email: ' + (args[2] || 'new.employee@example.com'),
            '',
            '📝 Employee Details:',
            '  Name: Jane Wilson',
            '  Role: Senior Developer',
            '  Salary: $120,000/year',
            '  Start Date: ' + new Date().toLocaleDateString(),
            '',
            '✓ Sending onboarding documents',
            '✓ Setting up direct deposit',
            '✓ Enrolling in benefits',
            '✓ Configuring tax withholdings',
            '',
            '✅ Employee added to payroll system!'
          ];
        }
        break;

      case 'auto':
        if (args[1] === 'enable') {
          return [
            '🤖 Enabling AI automation...',
            '',
            '✓ Connecting to Claude AI',
            '✓ Analyzing transaction patterns',
            '✓ Setting up smart rules',
            '✓ Enabling invoice detection',
            '',
            '🎯 Automation enabled with rules:',
            '',
            '1. Auto-categorize transactions',
            '2. Flag unusual spending patterns',
            '3. Auto-pay recurring vendors under $1,000',
            '4. Extract invoice data from emails',
            '5. Schedule payments before due dates',
            '6. Optimize cash allocation for yield',
            '',
            '✅ AI automation is now active!'
          ];
        } else if (args[1] === 'stats') {
          return [
            '📊 Automation Statistics (Last 30 days)',
            '',
            'Transactions Processed: 142',
            'Auto-Categorized: 138 (97.2%)',
            'Auto-Paid Invoices: 23',
            'Time Saved: ~12 hours',
            '',
            'Financial Insights:',
            '  • Reduced late payments by 100%',
            '  • Earned $542.31 extra from auto-yield',
            '  • Identified $3,200 in duplicate charges',
            '  • Optimized payment timing saved $180 in fees',
            '',
            'Top Auto-Actions:',
            '  1. AWS billing → Cloud Services (12x)',
            '  2. Contractor invoices → Auto-approved (8x)',
            '  3. Software subscriptions → Renewed (15x)'
          ];
        }
        break;

      case 'connect':
        if (args[1] === 'gmail') {
          return [
            '⚠️  Email connectors are currently disabled.',
            '',
            'Use secure uploads or bank sync to ingest financial documents.',
            'Contact the Zero team if you need a specific partner integration.',
          ];
        } else if (args[1] === 'claude') {
          return [
            '🧠 Connecting Claude AI...',
            '',
            '✓ Authenticating with Anthropic',
            '✓ Setting up secure connection',
            '✓ Configuring financial assistant',
            '',
            '🤖 Claude AI connected!',
            '',
            'Capabilities unlocked:',
            '  • Natural language commands',
            '  • Intelligent invoice analysis',
            '  • Spending pattern insights',
            '  • Tax optimization suggestions',
            '  • Cash flow predictions',
            '',
            'Try: "Hey Claude, analyze my spending"'
          ];
        }
        break;

      case 'integrations':
        if (args[1] === 'status') {
          return [
            '🔌 Integration Status',
            '',
            'Email Inbox: Retired',
            'Bank Sync: Enabled',
            'Yield Automations: Enabled',
            'Document Uploads: Enabled',
            '',
            'Need something else? Ping the Zero team and we\'ll coordinate access.',
          ];
        }
        break;

      case 'inbox':
        return [
          '📥 Financial Inbox',
          '',
          '🔴 Pending (3):',
          '  1. Invoice from AWS - $1,247.32 - Due in 5 days',
          '  2. Contractor invoice - Sarah Chen - $3,500.00',
          '  3. Subscription renewal - Figma - $45.00/month',
          '',
          '🟡 Review Needed (2):',
          '  4. Large payment detected - CloudFlare - $5,420.00',
          '  5. New vendor invoice - DataDog - $890.00',
          '',
          '✅ Processed Today (8):',
          '  • Paid: Google Workspace - $450.00',
          '  • Paid: Vercel Hosting - $20.00',
          '  • Categorized: 6 transactions',
          '',
          '💡 AI Suggestion: "3 invoices due next week totaling $4,792.32"'
        ];

      case 'clear':
        setCommands([]);
        return [];

      case 'exit':
        return ['👋 Goodbye! Thank you for using Zero Finance CLI.'];

      default:
        if (cmd.startsWith('hey claude')) {
          return [
            '🤖 Claude AI:',
            '',
            'I\'ve analyzed your recent financial activity:',
            '',
            '📊 Spending Analysis:',
            '  • Cloud services: $8,420/month (↑12% from last month)',
            '  • Contractors: $22,500/month (stable)',
            '  • Software subscriptions: $1,890/month',
            '',
            '💡 Recommendations:',
            '  1. Your AWS spending increased due to higher usage.',
            '     Consider reserved instances to save ~$2,100/month',
            '',
            '  2. You have $45,000 in idle cash earning 0%.',
            '     Enable auto-yield to earn ~$187/month',
            '',
            '  3. 3 subscriptions haven\'t been used in 30 days.',
            '     Cancel to save $340/month',
            '',
            'Would you like me to implement any of these suggestions?'
          ];
        }
        return [`Command not found: ${cmd}. Type 'help' for available commands.`];
    }
    return [];
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim()) return;

    const output = processCommand(currentInput);
    const newCommand: Command = {
      input: currentInput,
      output,
      timestamp: new Date()
    };

    setCommands([...commands, newCommand]);
    setCurrentInput('');
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 text-center">
          <h1 className="text-2xl mb-2">Zero Finance CLI Demo</h1>
          <p className="text-green-600 text-sm">
            Type 'help' to see available commands
          </p>
        </div>

        <div 
          ref={terminalRef}
          className="bg-gray-900 rounded-lg p-4 h-[80vh] overflow-y-auto shadow-2xl border border-green-800"
          onClick={() => inputRef.current?.focus()}
        >
          {/* Welcome message */}
          {commands.length === 0 && (
            <div className="mb-4">
              <p>Zero Finance CLI v1.0.0</p>
              <p>Copyright (c) 2024 Zero Finance. All rights reserved.</p>
              <p></p>
              <p>Welcome to the future of business banking.</p>
              <p>Type 'help' to get started.</p>
              <p></p>
            </div>
          )}

          {/* Command history */}
          {commands.map((cmd, index) => (
            <div key={index} className="mb-4">
              <div className="flex items-center">
                <span className="text-blue-400 mr-2">zero@finance</span>
                <span className="text-gray-500 mr-2">~</span>
                <span className="text-yellow-400 mr-2">$</span>
                <span>{cmd.input}</span>
              </div>
              {cmd.output.map((line, lineIndex) => (
                <motion.div
                  key={lineIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: lineIndex * 0.02 }}
                  className="ml-4"
                >
                  {line}
                </motion.div>
              ))}
            </div>
          ))}

          {/* Current input line */}
          <form onSubmit={handleCommand} className="flex items-center">
            <span className="text-blue-400 mr-2">zero@finance</span>
            <span className="text-gray-500 mr-2">~</span>
            <span className="text-yellow-400 mr-2">$</span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              className="flex-1 bg-transparent outline-none text-green-400"
              autoFocus
            />
            <span className="animate-pulse">_</span>
          </form>
        </div>

        <div className="mt-4 text-center text-xs text-gray-600">
          This is a demo. Real CLI coming soon. 
          <a href="/" className="ml-2 text-blue-400 hover:underline">
            Back to Zero Finance
          </a>
        </div>
      </div>
    </div>
  );
}
