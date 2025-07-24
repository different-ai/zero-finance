"use client"

import { useState, useEffect, useRef } from "react"
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Send,
  MessageSquare,
  Upload,
  CheckCircle,
  AlertCircle,
  Calendar,
  CreditCard,
  FileText,
  Globe,
  Zap,
  ChevronRight,
  X,
  Loader2
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Types
interface Balance {
  currency: string
  symbol: string
  amount: number
  usdEquivalent: number
  change: number
}

interface Transaction {
  id: string
  type: "payment" | "receipt" | "conversion" | "fee"
  description: string
  amount: number
  currency: string
  timestamp: Date
  status: "completed" | "pending" | "processing"
  category?: string
}

interface FXRate {
  from: string
  to: string
  rate: number
  change: number
  savings: number
}

interface Notification {
  id: string
  type: "payment" | "fx" | "tax" | "general"
  message: string
  timestamp: Date
  unread: boolean
}

// Utility functions
const formatCurrency = (amount: number, currency: string = "USD") => {
  const symbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    CNY: "¥",
    INR: "₹",
    MXN: "MX$",
    GBP: "£"
  }
  return `${symbols[currency] || currency + " "}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const getRelativeTime = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  if (seconds < 60) return "just now"
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
  return `${Math.floor(seconds / 86400)} days ago`
}

// Sample data generators
const generateTransaction = (index: number): Transaction => {
  const types: Transaction["type"][] = ["payment", "receipt", "conversion", "fee"]
  const descriptions = [
    { type: "payment", desc: "Payment to Shenzhen Electronics Co.", amount: -18250.50, currency: "CNY" },
    { type: "receipt", desc: "Amazon FBA Payout", amount: 12350.42, currency: "USD" },
    { type: "payment", desc: "Supplier Invoice - Mumbai Textiles", amount: -85000, currency: "INR" },
    { type: "conversion", desc: "Currency Exchange CNY → USD", amount: 25000, currency: "USD" },
    { type: "fee", desc: "Shopify Monthly Subscription", amount: -299, currency: "USD" },
    { type: "payment", desc: "VAT Payment - EU Q3 2024", amount: -8234, currency: "EUR" },
    { type: "receipt", desc: "Customer Payment - Carlos Martinez", amount: 320500, currency: "MXN" },
    { type: "fee", desc: "Google Ads Campaign", amount: -2450, currency: "USD" }
  ]
  
  const template = descriptions[index % descriptions.length]
  const minutesAgo = index * 47 + Math.floor(Math.random() * 20)
  
  return {
    id: `tx-${index}`,
    type: template.type as Transaction["type"],
    description: template.desc,
    amount: template.amount,
    currency: template.currency,
    timestamp: new Date(Date.now() - minutesAgo * 60 * 1000),
    status: index === 0 ? "processing" : index < 3 ? "completed" : "completed",
    category: template.type === "payment" ? "Supplier" : template.type === "receipt" ? "Revenue" : "Operating Expense"
  }
}

export default function DemoDashboard() {
  // State
  const [balances, setBalances] = useState<Balance[]>([
    { currency: "USD", symbol: "$", amount: 125420.30, usdEquivalent: 125420.30, change: 0.02 },
    { currency: "CNY", symbol: "¥", amount: 485210.00, usdEquivalent: 67109.00, change: -0.01 },
    { currency: "EUR", symbol: "€", amount: 42150.75, usdEquivalent: 45845.32, change: 0.03 },
    { currency: "INR", symbol: "₹", amount: 2150000, usdEquivalent: 25893.00, change: 0.01 }
  ])
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => 
    Array.from({ length: 8 }, (_, i) => generateTransaction(i))
  )
  
  const [fxRates, setFxRates] = useState<FXRate[]>([
    { from: "CNY", to: "USD", rate: 7.21, change: 0.003, savings: 201 },
    { from: "EUR", to: "USD", rate: 1.088, change: -0.002, savings: 89 },
    { from: "INR", to: "USD", rate: 83.12, change: 0.001, savings: 156 }
  ])
  
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "n1", type: "payment", message: "Supplier payment scheduled for tomorrow", timestamp: new Date(Date.now() - 5 * 60 * 1000), unread: true },
    { id: "n2", type: "fx", message: "FX opportunity: Save $201 on CNY conversion", timestamp: new Date(Date.now() - 30 * 60 * 1000), unread: true },
    { id: "n3", type: "tax", message: "VAT payment due in 3 days", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), unread: false }
  ])
  
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showConvertModal, setShowConvertModal] = useState(false)
  const [showChatModal, setShowChatModal] = useState(false)
  const [showInvoiceUpload, setShowInvoiceUpload] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [notificationCount, setNotificationCount] = useState(2)
  
  // Auto-refresh effects
  useEffect(() => {
    // Update balances every 3 seconds
    const balanceInterval = setInterval(() => {
      setBalances(prev => prev.map(balance => ({
        ...balance,
        amount: balance.amount * (1 + (Math.random() - 0.5) * 0.0001),
        change: (Math.random() - 0.5) * 0.001
      })))
    }, 3000)
    
    // Update FX rates every 5 seconds
    const fxInterval = setInterval(() => {
      setFxRates(prev => prev.map(rate => ({
        ...rate,
        rate: rate.rate * (1 + (Math.random() - 0.5) * 0.0002),
        change: (Math.random() - 0.5) * 0.005,
        savings: Math.floor(Math.random() * 300) + 50
      })))
    }, 5000)
    
    // Add new transaction every 15 seconds
    const txInterval = setInterval(() => {
      const newTx = generateTransaction(transactions.length)
      setTransactions(prev => [newTx, ...prev.slice(0, 7)])
      
      // Add notification for new transaction
      if (Math.random() > 0.5) {
        setNotifications(prev => [{
          id: `n${Date.now()}`,
          type: "payment",
          message: `New ${newTx.type}: ${newTx.description}`,
          timestamp: new Date(),
          unread: true
        }, ...prev.slice(0, 4)])
        setNotificationCount(prev => prev + 1)
      }
    }, 15000)
    
    return () => {
      clearInterval(balanceInterval)
      clearInterval(fxInterval)
      clearInterval(txInterval)
    }
  }, [transactions.length])
  
  // Interactive handlers
  const handleSendPayment = async () => {
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsProcessing(false)
    setShowPaymentModal(false)
    
    // Add success notification
    setNotifications(prev => [{
      id: `n${Date.now()}`,
      type: "payment",
      message: "Payment of ¥50,000 sent to supplier successfully",
      timestamp: new Date(),
      unread: true
    }, ...prev])
    
    // Update balance
    setBalances(prev => prev.map(b => 
      b.currency === "CNY" ? { ...b, amount: b.amount - 50000 } : b
    ))
  }
  
  const handleConvertCurrency = async () => {
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsProcessing(false)
    setShowConvertModal(false)
    
    // Add conversion transaction
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: "conversion",
      description: "Currency Exchange USD → EUR",
      amount: 10000,
      currency: "EUR",
      timestamp: new Date(),
      status: "completed"
    }
    setTransactions(prev => [newTx, ...prev.slice(0, 7)])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Image
                src="/new-logo-bluer.png"
                alt="0.finance"
                width={40}
                height={40}
                className="mr-3"
              />
              <span className="text-xl font-semibold text-gray-900">0.finance Demo</span>
              <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">Sandbox Mode</span>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button 
                className="relative p-2 text-gray-600 hover:text-gray-900"
                onClick={() => setNotificationCount(0)}
              >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>
              
              {/* User Menu */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  S
                </div>
                <span className="text-sm font-medium text-gray-700">Sarah Chen</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Total Balance Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Balance (USD)</p>
              <p className="text-4xl font-bold mt-1">
                ${balances.reduce((sum, b) => sum + b.usdEquivalent, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-blue-100 text-sm mt-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +2.4% from last week
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowPaymentModal(true)}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg font-medium hover:bg-white/30 transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Payment
              </button>
              <button 
                onClick={() => setShowConvertModal(true)}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Convert
              </button>
            </div>
          </div>
        </div>
        
        {/* Currency Balances */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {balances.map((balance) => (
            <div key={balance.currency} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">{balance.currency}</span>
                <span className={`text-xs font-medium flex items-center ${balance.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {balance.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {Math.abs(balance.change * 100).toFixed(2)}%
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(balance.amount, balance.currency)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                ≈ ${balance.usdEquivalent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          ))}
        </div>
        
        {/* Quick Actions & FX Rates */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2 bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button 
                onClick={() => setShowInvoiceUpload(true)}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <Upload className="w-8 h-8 text-gray-600 group-hover:text-blue-600 mb-2" />
                <p className="text-sm font-medium text-gray-900">Upload Invoice</p>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group">
                <Calendar className="w-8 h-8 text-gray-600 group-hover:text-blue-600 mb-2" />
                <p className="text-sm font-medium text-gray-900">Schedule Payment</p>
              </button>
              <button 
                onClick={() => setShowChatModal(true)}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <MessageSquare className="w-8 h-8 text-gray-600 group-hover:text-blue-600 mb-2" />
                <p className="text-sm font-medium text-gray-900">Ask AI CFO</p>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group">
                <FileText className="w-8 h-8 text-gray-600 group-hover:text-blue-600 mb-2" />
                <p className="text-sm font-medium text-gray-900">VAT Report</p>
              </button>
            </div>
          </div>
          
          {/* FX Opportunities */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">FX Opportunities</h2>
              <Zap className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="space-y-3">
              {fxRates.map((rate) => (
                <div key={`${rate.from}-${rate.to}`} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{rate.from} → {rate.to}</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Save ${rate.savings}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">{rate.rate.toFixed(4)}</span>
                    <span className={`text-xs flex items-center ${rate.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {rate.change >= 0 ? '+' : ''}{(rate.change * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Recent Transactions */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
            <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === 'payment' ? 'bg-red-100' : 
                    tx.type === 'receipt' ? 'bg-green-100' : 
                    tx.type === 'conversion' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    {tx.type === 'payment' ? <ArrowUpRight className="w-5 h-5 text-red-600" /> :
                     tx.type === 'receipt' ? <ArrowDownRight className="w-5 h-5 text-green-600" /> :
                     tx.type === 'conversion' ? <RefreshCw className="w-5 h-5 text-blue-600" /> :
                     <DollarSign className="w-5 h-5 text-gray-600" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{tx.description}</p>
                    <p className="text-xs text-gray-500">{getRelativeTime(tx.timestamp)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${tx.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.amount >= 0 ? '+' : ''}{formatCurrency(Math.abs(tx.amount), tx.currency)}
                  </p>
                  {tx.status === 'processing' && (
                    <span className="text-xs text-yellow-600 flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3" />
                      Processing
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Send Payment</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Supplier name or email"
                  defaultValue="Shenzhen Electronics Co."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    defaultValue="50000"
                  />
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>CNY</option>
                    <option>USD</option>
                    <option>EUR</option>
                    <option>INR</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  placeholder="Payment for..."
                  defaultValue="Payment for Order #SE-2024-893"
                />
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-900">
                  <span className="font-medium">Early payment discount available:</span> Pay now to save 2% (¥1,000)
                </p>
              </div>
              
              <button 
                onClick={handleSendPayment}
                disabled={isProcessing}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Payment
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Convert Currency Modal */}
      {showConvertModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Convert Currency</h3>
              <button onClick={() => setShowConvertModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    defaultValue="10000"
                  />
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>USD</option>
                    <option>CNY</option>
                    <option>EUR</option>
                    <option>INR</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-center">
                <RefreshCw className="w-6 h-6 text-gray-400" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    placeholder="0.00"
                    value="9195.40"
                    readOnly
                  />
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>EUR</option>
                    <option>USD</option>
                    <option>CNY</option>
                    <option>INR</option>
                  </select>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-900">
                  <span className="font-medium">You save:</span> $89.45 vs traditional banks
                </p>
                <p className="text-xs text-green-700 mt-1">
                  Rate: 1.0880 • 0.3% better than market
                </p>
              </div>
              
              <button 
                onClick={handleConvertCurrency}
                disabled={isProcessing}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Convert Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* AI Chat Modal */}
      {showChatModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Image
                  src="/new-logo-bluer.png"
                  alt="AI CFO"
                  width={32}
                  height={32}
                />
                <h3 className="text-lg font-semibold">AI CFO Assistant</h3>
              </div>
              <button onClick={() => setShowChatModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="h-64 bg-gray-50 rounded-lg p-4 mb-4 overflow-y-auto">
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <p className="text-sm text-gray-900">Hi Sarah! I'm your AI CFO. How can I help you today?</p>
                </div>
                <div className="bg-blue-600 text-white rounded-lg p-3 ml-auto max-w-[80%]">
                  <p className="text-sm">What's my current tax liability?</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <p className="text-sm text-gray-900">Based on your Q3 sales, your EU VAT liability is €8,234 (due in 3 days). Your estimated Q4 US tax is $12,450. I can prepare the VAT payment now to avoid penalties.</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <input 
                type="text" 
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ask me anything..."
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Invoice Upload */}
      {showInvoiceUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Upload Invoice</h3>
              <button onClick={() => setShowInvoiceUpload(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-900 mb-1">Drop invoice here or click to upload</p>
              <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">AI-Powered Extraction</p>
                  <p className="text-xs text-blue-700 mt-1">We'll automatically extract supplier details, amounts, and due dates</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}