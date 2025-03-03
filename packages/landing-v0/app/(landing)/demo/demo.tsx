'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Monitor, Wallet, CreditCard, FileText, BarChart4, ArrowUpRight, ArrowDownLeft, Coins } from 'lucide-react';
import { BrowserWindow } from './browser-window';
import { motion, AnimatePresence } from 'framer-motion';
import { ValueJourney } from '../components/value-journey';

// Demo data for crypto wallet and financial activity
const walletBalances = [
  { currency: 'USDC', amount: '8,540.00', value: '$8,540.00', change: '+2.3%' },
  { currency: 'ETH', amount: '2.45', value: '$7,350.00', change: '+5.7%' },
  { currency: 'BTC', amount: '0.15', value: '$4,875.00', change: '+1.2%' },
  { currency: 'DAI', amount: '2,100.00', value: '$2,100.00', change: '0%' },
];

const recentInvoices = [
  {
    id: 'INV-0024',
    client: 'DesignCraft Studios',
    amount: '$3,500.00',
    status: 'Paid',
    date: '2024-03-15',
    paymentMethod: 'USDC'
  },
  {
    id: 'INV-0023',
    client: 'TechVision Inc',
    amount: '$2,800.00',
    status: 'Pending',
    date: '2024-03-10',
    paymentMethod: 'ETH'
  },
  {
    id: 'INV-0022',
    client: 'Global Marketing Co',
    amount: '$1,750.00',
    status: 'Paid',
    date: '2024-03-05',
    paymentMethod: 'USDC'
  }
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

const financialInsights = [
  {
    id: 'insight-1',
    title: 'Income Forecast',
    description: 'Based on pending invoices, expect $5,300 income in the next 14 days',
    priority: 'medium',
  },
  {
    id: 'insight-2',
    title: 'Yield Opportunity',
    description: 'Stake 2,000 USDC for 9.5% APY to earn ~$190/month',
    priority: 'high',
  },
  {
    id: 'insight-3',
    title: 'Tax Optimization',
    description: 'Set aside 25% of recent payments ($875) for quarterly tax payment',
    priority: 'high',
  },
];

export const Demo = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [textareaHeight, setTextareaHeight] = useState('auto');
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
  
  const adjustTextareaHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = window.innerHeight * 0.6;
      const newHeight = Math.min(scrollHeight, maxHeight);
      setTextareaHeight(`${newHeight}px`);
    }
  }, []);

  const renderWalletDashboard = () => {
    return (
      <div className="bg-white rounded-lg p-6 border border-primary/20 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-gray-800`}>Crypto Wallet + Card</h2>
          <Badge variant="outline" className="bg-primary/10 text-primary">
            Gnosis Pay
          </Badge>
        </div>
        
        <div className="mb-5 p-4 border border-primary/30 rounded-lg bg-primary/5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 mb-1">Available to Spend</p>
              <p className="text-2xl font-bold text-gray-800">$14,682.00</p>
            </div>
            <div className="w-12 h-12 flex items-center justify-center">
              <CreditCard className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div className="mt-3 flex justify-between items-center">
            <p className="text-xs text-gray-500">**** **** **** 3872</p>
            <Badge className="bg-green-500/10 text-green-500">Active</Badge>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {walletBalances.map((coin, index) => (
              <div key={index} className="border border-primary/20 rounded-lg p-3 hover:border-primary/30 transition-colors bg-white">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Coins className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium text-gray-800">{coin.currency}</span>
                  </div>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-500">
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
          
          <div className="flex gap-2 mt-4">
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
    );
  };

  const renderInvoiceSection = () => {
    return (
      <div className="bg-white rounded-lg p-6 border border-primary/20 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-gray-800`}>Recent Invoices</h2>
          <Button variant="outline" size="sm" className="text-sm border-primary/30 text-primary">
            <FileText className="mr-2 h-4 w-4" />
            {!isMobile && "New Invoice"}
          </Button>
        </div>
        <div className="space-y-3 mt-4">
          {recentInvoices.map((invoice) => (
            <div key={invoice.id} className="border border-primary/20 rounded-lg p-3 hover:border-primary/30 transition-colors bg-white">
              <div className="flex justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">{invoice.id}</span>
                    <span className="text-sm text-gray-500">• {invoice.client}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{invoice.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">{invoice.amount}</p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <Badge 
                      variant="outline" 
                      className={`
                        ${invoice.status === 'Paid' ? 'bg-green-500/10 text-green-500' : ''}
                        ${invoice.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' : ''}
                      `}
                    >
                      {invoice.status}
                    </Badge>
                    <span className="text-xs text-gray-500">{invoice.paymentMethod}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTransactionsAndInsights = () => {
    return (
      <div className={`${isMobile ? 'space-y-4' : 'grid md:grid-cols-2 gap-4'}`}>
        <div className="bg-white rounded-lg p-6 border border-primary/20 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-gray-800`}>Recent Transactions</h2>
            <Badge variant="outline" className="border-primary/30 text-primary">
              All Accounts
            </Badge>
          </div>
          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="border border-primary/20 rounded-lg p-3 hover:border-primary/30 transition-colors bg-white">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center
                      ${tx.type === 'income' ? 'bg-green-500/10' : ''}
                      ${tx.type === 'expense' ? 'bg-red-500/10' : ''}
                      ${tx.type === 'yield' ? 'bg-primary/10' : ''}
                    `}>
                      {tx.type === 'income' && <ArrowDownLeft className="h-4 w-4 text-green-500" />}
                      {tx.type === 'expense' && <ArrowUpRight className="h-4 w-4 text-red-500" />}
                      {tx.type === 'yield' && <Coins className="h-4 w-4 text-primary" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{tx.description}</p>
                      <p className="text-xs text-gray-500">{tx.timestamp}</p>
                    </div>
                  </div>
                  <p className={`font-medium 
                    ${tx.type === 'income' ? 'text-green-500' : ''}
                    ${tx.type === 'expense' ? 'text-red-500' : ''}
                    ${tx.type === 'yield' ? 'text-primary' : ''}
                  `}>
                    {tx.amount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 border border-primary/20 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-gray-800`}>AI Financial Insights</h2>
            <Badge variant="outline" className="bg-primary/10 text-primary">
              Your Personal CFO
            </Badge>
          </div>
          <div className="space-y-3">
            {financialInsights.map((insight) => (
              <div key={insight.id} className="border border-primary/20 rounded-lg p-4 hover:border-primary/30 transition-colors bg-white">
                <div className="flex items-start gap-3">
                  <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center
                    ${insight.priority === 'high' ? 'bg-primary/20' : 'bg-primary/10'}
                  `}>
                    <BarChart4 className={`h-4 w-4 
                      ${insight.priority === 'high' ? 'text-primary' : 'text-primary/80'}
                    `} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{insight.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{insight.description}</p>
                  </div>
                </div>
                <div className="ml-11 mt-3">
                  <Button size="sm" className={`${insight.priority === 'high' ? 'bg-primary hover:bg-primary/90' : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200'}`}>
                    Take Action
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderOverviewPanel = () => {
    return (
      <div className="space-y-6">
        <ValueJourney />
        <div className={`${isMobile ? 'space-y-4' : 'grid gap-4 md:grid-cols-2'}`}>
          {renderWalletDashboard()}
          {renderInvoiceSection()}
        </div>
        {renderTransactionsAndInsights()}
      </div>
    );
  };

  return (
    <BrowserWindow>
      <div className="mx-auto p-4">
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderOverviewPanel()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </BrowserWindow>
  );
};