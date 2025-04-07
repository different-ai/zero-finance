'use client';

import { useState, useEffect } from 'react';
import { 
  Wallet, 
  CreditCard, 
  BarChart4, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Coins, 
  CircleDollarSign,
  Landmark,
  Leaf,
  PieChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Demo data for crypto wallet and financial activity
const walletBalances = [
  { currency: 'USDC', amount: '8,540.00', value: '$8,540.00', change: '+2.3%' },
  { currency: 'ETH', amount: '2.45', value: '$7,350.00', change: '+5.7%' },
  { currency: 'BTC', amount: '0.15', value: '$4,875.00', change: '+1.2%' },
  { currency: 'DAI', amount: '2,100.00', value: '$2,100.00', change: '0%' },
];

const recentTransactions = [
  {
    id: 'tx-001',
    type: 'income',
    description: 'Payment received - DesignCraft Studios',
    amount: '+3,500 USDC',
    timestamp: '2024-03-15 14:32:45',
  },
  {
    id: 'tx-002',
    type: 'expense',
    description: 'Adobe Creative Cloud Subscription',
    amount: '-52.99 USDC',
    timestamp: '2024-03-14 09:15:22',
  },
  {
    id: 'tx-003',
    type: 'yield',
    description: 'USDC Staking Rewards',
    amount: '+25.75 USDC',
    timestamp: '2024-03-13 00:00:00',
  },
  {
    id: 'tx-004',
    type: 'expense',
    description: 'Figma Annual Subscription',
    amount: '-144 USDC',
    timestamp: '2024-03-12 16:45:10',
  },
];

// Allocation data
const allocationData = {
  totalDeposited: '$22,865.00',
  allocatedTax: '$6,859.50',
  allocatedLiquidity: '$4,573.00',
  allocatedYield: '$11,432.50',
  lastUpdated: 'Apr 07, 2024 - 15:42 PM',
  taxPercentage: '30%',
  liquidityPercentage: '20%',
  yieldPercentage: '50%'
};

// Active agents data
const activeAgents = [
  {
    id: 'agent-1',
    name: 'Tax Reserve Optimizer',
    description: 'Automatically sets aside funds for tax payments',
    status: 'Active',
    lastRun: '2024-04-07 13:25',
  },
  {
    id: 'agent-2',
    name: 'Yield Aggregator',
    description: 'Monitors and deploys capital to the best yield strategies',
    status: 'Active',
    lastRun: '2024-04-07 12:15',
  },
  {
    id: 'agent-3',
    name: 'Liquidity Manager',
    description: 'Manages short-term liquidity needs',
    status: 'Active',
    lastRun: '2024-04-07 10:30',
  },
];

export function ModernDashboardDemo() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Allocation Summary Card */}
        <div className="bg-white rounded-lg p-4 border border-primary/20 shadow-sm">
          <div className="flex items-center mb-2">
            <Wallet className="h-5 w-5 mr-2 text-primary" /> 
            <h2 className="text-lg font-medium text-gray-800">Allocation Summary</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Overview of your automated treasury allocations. Last updated: {allocationData.lastUpdated}
          </p>

          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg mb-4">
            <p className="text-sm text-gray-600 flex items-center">
              <CircleDollarSign className="h-4 w-4 mr-1.5"/> Total Confirmed Deposits (USDC)
            </p>
            <p className="text-2xl font-bold text-gray-800">{allocationData.totalDeposited}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tax Allocation */}
            <div className="p-3 border rounded-md flex flex-col justify-between">
              <div>
                <p className="text-sm text-gray-600 flex items-center mb-1">
                  <Landmark className="h-4 w-4 mr-1.5 text-blue-600"/> Tax Reserve
                </p>
                <p className="text-lg font-semibold text-gray-800">{allocationData.allocatedTax}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">~{allocationData.taxPercentage} of deposits</p> 
            </div>

            {/* Liquidity Allocation */}
            <div className="p-3 border rounded-md flex flex-col justify-between">
              <div>
                <p className="text-sm text-gray-600 flex items-center mb-1">
                  <Leaf className="h-4 w-4 mr-1.5 text-green-600"/> Liquidity Pool
                </p>
                <p className="text-lg font-semibold text-gray-800">{allocationData.allocatedLiquidity}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">~{allocationData.liquidityPercentage} of deposits</p> 
            </div>

            {/* Yield Allocation */}
            <div className="p-3 border rounded-md flex flex-col justify-between">
              <div>
                <p className="text-sm text-gray-600 flex items-center mb-1">
                  <CircleDollarSign className="h-4 w-4 mr-1.5 text-yellow-600"/> Yield Strategies
                </p>
                <p className="text-lg font-semibold text-gray-800">{allocationData.allocatedYield}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">~{allocationData.yieldPercentage} of deposits</p> 
            </div>
          </div>
        </div>

        {/* Crypto Wallet Card */}
        <div className="bg-white rounded-lg p-4 border border-primary/20 shadow-sm">
          <div className="flex items-center mb-2">
            <CreditCard className="h-5 w-5 mr-2 text-primary" />
            <h2 className="text-lg font-medium text-gray-800">Crypto Wallet + Card</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Manage your crypto assets and connected payment card
          </p>
          
          <div className="mb-4 p-4 border border-primary/30 rounded-lg bg-primary/5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 mb-1">Available to Spend</p>
                <p className="text-2xl font-bold text-gray-800">$14,682.00</p>
              </div>
              <div className="w-10 h-10 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-3 flex justify-between items-center">
              <p className="text-xs text-gray-500">**** **** **** 3872</p>
              <Badge className="bg-green-500/10 text-green-500 text-xs">Active</Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            {walletBalances.map((coin, index) => (
              <div key={index} className="border border-primary/20 rounded-lg p-3 hover:border-primary/30 transition-colors bg-white">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Coins className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium text-gray-800">{coin.currency}</span>
                  </div>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-500 text-xs">
                    {coin.change}
                  </Badge>
                </div>
                <div className="mt-2">
                  <p className="text-lg font-semibold text-gray-800">{coin.amount}</p>
                  <p className="text-sm text-gray-500">{coin.value}</p>
                </div>
              </div>
            ))}
          </div>
            
          <div className="flex gap-2">
            <Button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200">
              <ArrowDownLeft className="mr-2 h-4 w-4" />
              Receive
            </Button>
            <Button className="flex-1 bg-primary hover:bg-primary/90">
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Send
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active AI Agents */}
        <div className="bg-white rounded-lg p-4 border border-primary/20 shadow-sm">
          <div className="flex items-center mb-2">
            <PieChart className="h-5 w-5 mr-2 text-primary" />
            <h2 className="text-lg font-medium text-gray-800">Active AI Agents</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            AI agents working to optimize your financial activities
          </p>
          
          <div className="space-y-3">
            {activeAgents.map((agent) => (
              <div key={agent.id} className="border border-primary/20 rounded-lg p-3 hover:border-primary/30 transition-colors bg-white">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium text-gray-800">{agent.name}</h3>
                  <Badge className="bg-green-500/10 text-green-500 text-xs">
                    {agent.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{agent.description}</p>
                <p className="text-xs text-gray-500">Last run: {agent.lastRun}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg p-4 border border-primary/20 shadow-sm">
          <div className="flex items-center mb-2">
            <BarChart4 className="h-5 w-5 mr-2 text-primary" />
            <h2 className="text-lg font-medium text-gray-800">Recent Activity</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Your latest financial transactions across all accounts
          </p>
          
          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="border border-primary/20 rounded-lg p-3 hover:border-primary/30 transition-colors bg-white">
                <div className="flex items-start justify-between">
                  <div className="flex gap-2">
                    <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center
                      ${tx.type === 'income' ? 'bg-green-100 text-green-600' : ''}
                      ${tx.type === 'expense' ? 'bg-red-100 text-red-600' : ''}
                      ${tx.type === 'yield' ? 'bg-yellow-100 text-yellow-600' : ''}
                    `}>
                      {tx.type === 'income' && <ArrowDownLeft className="h-4 w-4" />}
                      {tx.type === 'expense' && <ArrowUpRight className="h-4 w-4" />}
                      {tx.type === 'yield' && <Coins className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{tx.description}</p>
                      <p className="text-xs text-gray-500">{tx.timestamp}</p>
                    </div>
                  </div>
                  <p className={`font-semibold ${tx.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.amount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 