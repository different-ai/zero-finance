// Mock data for the Earn feature

type EarnState = {
  enabled: boolean;          // module installed?
  allocation: number;        // 0-100 %
  totalBalance: bigint;      // wei - represented as string for JSON transport
  earningBalance: bigint;    // wei - represented as string for JSON transport
  apy: number;               // e.g., 5.4 for 5.4%
  lastSweep: string | null;  // ISO date string
  events: SweepEvent[];
  configHash?: string;       // The config hash used to enable the module
};

type SweepEvent = {
  id: string;
  timestamp: string; // ISO date string
  amount: string;    // wei
  currency: string;  // e.g., "USDC"
  apyAtTime: number; // e.g., 5.4
  status: 'success' | 'pending' | 'failed';
  txHash?: string;   // Optional transaction hash
  failureReason?: string;
};

const MOCK_EARN_STATE_DISABLED: EarnState = {
  enabled: false,
  allocation: 30, // Default allocation
  totalBalance: '10000000000', // 10,000 USDC (assuming 6 decimals for example)
  earningBalance: '0',
  apy: 5.4, // Example APY
  lastSweep: null,
  events: [],
};

const MOCK_EARN_STATE_ENABLED: EarnState = {
  enabled: true,
  allocation: 30,
  totalBalance: '10000000000', // 10,000 USDC
  earningBalance: '3000000000', // 3,000 USDC (30% of total)
  apy: 5.4,
  lastSweep: new Date(Date.now() - 3600 * 1000 * 2).toISOString(), // 2 hours ago
  configHash: '0x123abc',
  events: [
    {
      id: 'sweep1',
      timestamp: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
      amount: '1050000000', // 1050 USDC
      currency: 'USDC',
      apyAtTime: 5.2,
      status: 'success',
      txHash: '0xabc123...',
    },
    {
      id: 'sweep2',
      timestamp: new Date(Date.now() - 3600 * 1000 * 24 * 3).toISOString(), // 3 days ago
      amount: '500000000',  // 500 USDC
      currency: 'USDC',
      apyAtTime: 5.1,
      status: 'success',
      txHash: '0xdef456...',
    },
     {
      id: 'sweep3',
      timestamp: new Date(Date.now() - 3600 * 1000 * 24 * 1).toISOString(), // 1 day ago
      amount: '200000000',  // 200 USDC
      currency: 'USDC',
      apyAtTime: 5.3,
      status: 'failed',
      failureReason: 'Insufficient gas for relay.',
    },
  ],
};

// Store current state in memory for mocks
let currentEarnState: EarnState = MOCK_EARN_STATE_DISABLED;

// Functions to manipulate mock state (would be replaced by actual API calls)
function MOCK_ENABLE_MODULE(configHash: string): Promise<void> {
  console.log(`MOCK: Enabling earn module for safe with configHash: ${configHash}`);
  currentEarnState = { ...MOCK_EARN_STATE_ENABLED, allocation: currentEarnState.allocation, configHash };
  return Promise.resolve();
}

function MOCK_DISABLE_MODULE(): Promise<void> {
  console.log('MOCK: Disabling earn module');
  currentEarnState = { ...MOCK_EARN_STATE_DISABLED, allocation: currentEarnState.allocation };
  return Promise.resolve();
}

function MOCK_SET_ALLOCATION(percentage: number): Promise<void> {
  console.log(`MOCK: Setting allocation to ${percentage}%`);
  if (percentage < 0 || percentage > 100) {
    return Promise.reject(new Error("Allocation must be between 0 and 100"));
  }
  currentEarnState.allocation = percentage;
  // Simulate recalculation of earningBalance if enabled
  if (currentEarnState.enabled) {
    const total = BigInt(currentEarnState.totalBalance);
    currentEarnState.earningBalance = ((total * BigInt(percentage)) / 100n).toString();
  }
  return Promise.resolve();
}

function MOCK_GET_EARN_STATE(): Promise<EarnState> {
  console.log('MOCK: Getting earn state', currentEarnState);
  // Simulate APY fluctuation
  currentEarnState.apy = parseFloat((5.0 + Math.random() * 0.5).toFixed(2));
  return Promise.resolve(currentEarnState);
}

function MOCK_ADD_SWEEP_EVENT(event: Omit<SweepEvent, 'id' | 'timestamp' | 'apyAtTime'>): Promise<SweepEvent> {
  console.log('MOCK: Adding sweep event', event);
  const newEvent: SweepEvent = {
    ...event,
    id: `sweep${currentEarnState.events.length + 1}`,
    timestamp: new Date().toISOString(),
    apyAtTime: currentEarnState.apy,
  };
  currentEarnState.events.unshift(newEvent); // Add to the beginning of the list
  if (event.status === 'success') {
    currentEarnState.earningBalance = (BigInt(currentEarnState.earningBalance) + BigInt(event.amount)).toString();
    currentEarnState.lastSweep = newEvent.timestamp;
  }
  return Promise.resolve(newEvent);
} 