'use client';

import Link from 'next/link';
import MainStats from '../main-stats';
import Activity from '../activity';
import { useRouter } from 'next/navigation'; // For potential programmatic navigation if needed

// Assuming EarnState and SweepEvent types are defined elsewhere and imported
// For now, let's define them inline for clarity if not already globally available
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
  totalBalance: string;      
  earningBalance: string;    
  apy: number;               
  lastSweep: string | null;  
  events: SweepEvent[];
  configHash?: string;
}

interface DashboardProps {
  state: EarnState;
  router: ReturnType<typeof useRouter>; // Or just useRouter if used internally
}

export default function Dashboard({ state }: DashboardProps) {
  // const router = useRouter(); // Can be obtained here if not passed as prop

  return (
    <div className="relative p-4">
      <Link 
        href="/dashboard/earn/settings" 
        className="absolute right-4 top-4 text-sm underline text-blue-600 hover:text-blue-800"
      >
        Settings
      </Link>
      <h1 className="text-2xl font-semibold mb-6">Earn Dashboard</h1>
      <MainStats state={state} />
      <Activity events={state.events} />
    </div>
  );
} 