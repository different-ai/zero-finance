import { z } from "zod";
import { router, protectedProcedure } from "../create-router"; // Corrected import path and names

// Mock data and functions (in a real scenario, these would be in a service/DB layer)
// For simplicity, copying relevant parts from memory/mock-data-earn.md
// In a real app, you'''d import these or have a proper data store.

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

const MOCK_EARN_STATE_DISABLED: EarnState = {
  enabled: false,
  allocation: 30, 
  totalBalance: '10000000000', 
  earningBalance: '0',
  apy: 5.4, 
  lastSweep: null,
  events: [],
};

const MOCK_EARN_STATE_ENABLED: EarnState = {
  enabled: true,
  allocation: 30,
  totalBalance: '10000000000',
  earningBalance: '3000000000', 
  apy: 5.4,
  lastSweep: new Date(Date.now() - 3600 * 1000 * 2).toISOString(), 
  configHash: '0x123abc',
  events: [
    {
      id: 'sweep1',
      timestamp: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
      amount: '1050000000', 
      currency: 'USDC',
      apyAtTime: 5.2,
      status: 'success',
      txHash: '0xabc123...',
    },
  ],
};

let currentEarnState: EarnState = {
    ...MOCK_EARN_STATE_DISABLED,
    // Make a deep copy of events for the initial state if MOCK_EARN_STATE_DISABLED has any
    // In this case, it's an empty array, but good practice for more complex initial mocks.
    events: [...MOCK_EARN_STATE_DISABLED.events]
};

async function mockEnableModule(configHash: string, safeId: string): Promise<void> {
  console.log(`MOCK: Enabling earn module for safe ${safeId} with configHash: ${configHash}`);
  currentEarnState = { 
    ...MOCK_EARN_STATE_ENABLED, 
    allocation: currentEarnState.allocation, // Preserve current allocation
    totalBalance: currentEarnState.totalBalance, // Preserve current total balance
    earningBalance: currentEarnState.earningBalance, // Preserve current earning balance
    events: [...currentEarnState.events], // Preserve current events
    configHash 
  };
  // Recalculate earning balance after enabling based on current total and allocation
  const total = BigInt(currentEarnState.totalBalance);
  currentEarnState.earningBalance = ((total * BigInt(currentEarnState.allocation)) / 100n).toString();
  return Promise.resolve();
}

async function mockDisableModule(safeId: string): Promise<void> {
  console.log(`MOCK: Disabling earn module for safe ${safeId}`);
  currentEarnState = { 
    ...MOCK_EARN_STATE_DISABLED, 
    allocation: currentEarnState.allocation, // Preserve current allocation
    totalBalance: currentEarnState.totalBalance, // Preserve current total balance
    earningBalance: '0', // Reset earning balance
    events: [...currentEarnState.events], // Preserve current events
    configHash: undefined // Clear confighash
  };
  return Promise.resolve();
}

async function mockSetAllocation(percentage: number, safeId: string): Promise<void> {
  console.log(`MOCK: Setting allocation to ${percentage}% for safe ${safeId}`);
  if (percentage < 0 || percentage > 100) {
    throw new Error("Allocation must be between 0 and 100");
  }
  currentEarnState.allocation = percentage;
  if (currentEarnState.enabled) {
    const total = BigInt(currentEarnState.totalBalance);
    currentEarnState.earningBalance = ((total * BigInt(percentage)) / 100n).toString();
  }
  return Promise.resolve();
}

async function mockGetEarnState(safeId: string): Promise<EarnState> {
  console.log(`MOCK: Getting earn state for safe ${safeId}`);
  currentEarnState.apy = parseFloat((5.0 + Math.random() * 0.5).toFixed(2)); 
  if (Math.random() < 0.1) {
    const newDeposit = BigInt(Math.floor(Math.random() * 1000) * 10**6); 
    currentEarnState.totalBalance = (BigInt(currentEarnState.totalBalance) + newDeposit).toString();
    console.log(`MOCK: Simulated new deposit of ${newDeposit.toString()} to totalBalance for safe ${safeId}.`);
    if (currentEarnState.enabled) {
       const total = BigInt(currentEarnState.totalBalance);
       currentEarnState.earningBalance = ((total * BigInt(currentEarnState.allocation)) / 100n).toString();
    }
  }
  return Promise.resolve({...currentEarnState, events: [...currentEarnState.events]}); // Return a copy
}

const SweepEventSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  amount: z.string(),
  currency: z.string(),
  apyAtTime: z.number(),
  status: z.enum(['success', 'pending', 'failed']),
  txHash: z.string().optional(),
  failureReason: z.string().optional(),
});

const EarnStateSchema = z.object({
  enabled: z.boolean(),
  allocation: z.number().min(0).max(100),
  totalBalance: z.string(), 
  earningBalance: z.string(), 
  apy: z.number(),
  lastSweep: z.string().nullable(),
  events: z.array(SweepEventSchema),
  configHash: z.string().optional(),
});

export const earnRouter = router({
  getState: protectedProcedure
    .input(z.object({ safeId: z.string() }))
    .output(EarnStateSchema)
    .query(async ({ input, ctx }) => {
      // console.log('Accessing user from ctx:', ctx.user);
      // Ensure safeId might be tied to ctx.user or other auth logic here if needed
      return mockGetEarnState(input.safeId);
    }),

  enableModule: protectedProcedure
    .input(z.object({ safeId: z.string(), configHash: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await mockEnableModule(input.configHash, input.safeId);
      return { success: true };
    }),

  disableModule: protectedProcedure
    .input(z.object({ safeId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await mockDisableModule(input.safeId);
      return { success: true };
    }),

  setAllocation: protectedProcedure
    .input(
      z.object({
        safeId: z.string(),
        percentage: z.number().min(0).max(100),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await mockSetAllocation(input.percentage, input.safeId);
      return { success: true };
    }),
});

// Example of how to add this to your appRouter
// import { earnRouter } from './earn';
// export const appRouter = createTRPCRouter({
//   earn: earnRouter,
//   // ...other routers
// }); 