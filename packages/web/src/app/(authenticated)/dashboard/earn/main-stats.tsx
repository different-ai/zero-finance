'use client';

// Assuming EarnState is defined and imported if not passed directly
interface SweepEvent {
  id: string;
  timestamp: string; 
  amount: string;    
  currency: string;  
  apyAtTime: number; 
  status: 'success' | 'pending' | 'failed';
  txHash?: string;   
  failureReason?: string;
}
interface EarnState {
  enabled: boolean;          
  allocation: number;        
  totalBalance: string; // Assuming this is a string representing a large number, e.g., in wei or smallest unit
  earningBalance: string; // Same as totalBalance
  apy: number;               
  lastSweep: string | null;  
  events: SweepEvent[];
  configHash?: string;
}

interface MainStatsProps {
  state: EarnState;
}

// Helper to format large string numbers (like balance) to a more readable format
// This is a very basic formatter, consider using a library for robust formatting (e.g., for currency)
const formatBalance = (balanceStr: string, decimals: number = 6): string => {
  try {
    const balanceBigInt = BigInt(balanceStr);
    const divisor = BigInt(10 ** decimals);
    const integerPart = balanceBigInt / divisor;
    const fractionalPart = balanceBigInt % divisor;
    return `${integerPart.toString()}.${fractionalPart.toString().padStart(decimals, '0').slice(0, 2)}`; // Show 2 decimal places
  } catch (e) {
    console.error("Error formatting balance:", e);
    return "N/A";
  }
};

export default function MainStats({ state }: MainStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="p-4 border rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Total Balance (USDC)</h3>
        <p className="text-2xl font-semibold">{formatBalance(state.totalBalance)}</p>
      </div>
      <div className="p-4 border rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Earning Balance (USDC)</h3>
        <p className="text-2xl font-semibold">{formatBalance(state.earningBalance)}</p>
        <p className="text-xs text-gray-400">{state.allocation}% allocated</p>
      </div>
      <div className="p-4 border rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Current APY</h3>
        <p className="text-2xl font-semibold">{state.apy.toFixed(2)}%</p>
        {state.lastSweep && 
          <p className="text-xs text-gray-400">Last sweep: {new Date(state.lastSweep).toLocaleString()}</p>
        }
      </div>
    </div>
  );
} 