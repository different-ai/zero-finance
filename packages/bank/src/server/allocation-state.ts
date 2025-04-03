/**
 * Allocation State Service
 * 
 * This service manages the state of allocations for detected USDC deposits.
 * It tracks total deposits, tax allocation (30%), liquidity allocation (20%), 
 * yield allocation (50%), and any pending deposit amount awaiting confirmation.
 */

import fs from 'fs';
import path from 'path';
import { formatUnits } from 'viem';

// Define the state structure
export interface AllocationState {
  lastCheckedUSDCBalance: string;  // In wei (full precision)
  totalDeposited: string;          // In wei (full precision) - Confirmed deposits
  allocatedTax: string;            // In wei (full precision) - Confirmed allocations
  allocatedLiquidity: string;      // In wei (full precision) - Confirmed allocations
  allocatedYield: string;          // In wei (full precision) - Confirmed allocations
  pendingDepositAmount: string;    // In wei (full precision) - Deposit detected, awaiting confirmation
  lastUpdated: number;             // Timestamp
}

// Constants
const STATE_FILE_PATH = path.join(process.cwd(), 'data', 'allocation-state.json');
const USDC_DECIMALS = 6;

// Allocation percentages
const TAX_PERCENTAGE = 0.3;        // 30%
const LIQUIDITY_PERCENTAGE = 0.2;  // 20%
const YIELD_PERCENTAGE = 0.5;      // 50%

// Initialize state with default values
const initialState: AllocationState = {
  lastCheckedUSDCBalance: '0',
  totalDeposited: '0',
  allocatedTax: '0',
  allocatedLiquidity: '0',
  allocatedYield: '0',
  pendingDepositAmount: '0', // Start with no pending deposit
  lastUpdated: Date.now()
};

/**
 * Ensures the data directory exists
 */
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

/**
 * Loads the current allocation state from disk
 * @returns The current allocation state
 */
export const loadAllocationState = (): AllocationState => {
  ensureDataDir();
  try {
    if (fs.existsSync(STATE_FILE_PATH)) {
      const stateData = fs.readFileSync(STATE_FILE_PATH, 'utf8');
      const parsedState = JSON.parse(stateData);
      // Ensure pendingDepositAmount exists, default to '0' if not
      // Also ensure all numeric-like fields are loaded as strings
      return {
        lastCheckedUSDCBalance: String(parsedState.lastCheckedUSDCBalance ?? initialState.lastCheckedUSDCBalance),
        totalDeposited: String(parsedState.totalDeposited ?? initialState.totalDeposited),
        allocatedTax: String(parsedState.allocatedTax ?? initialState.allocatedTax),
        allocatedLiquidity: String(parsedState.allocatedLiquidity ?? initialState.allocatedLiquidity),
        allocatedYield: String(parsedState.allocatedYield ?? initialState.allocatedYield),
        pendingDepositAmount: String(parsedState.pendingDepositAmount ?? initialState.pendingDepositAmount),
        lastUpdated: parsedState.lastUpdated ?? initialState.lastUpdated,
      };
    }
  } catch (error) {
    console.error('Error loading allocation state:', error);
  }
  
  // If file doesn't exist or there's an error, return initial state
  return initialState;
};

/**
 * Saves the allocation state to disk
 * @param state The allocation state to save
 */
export const saveAllocationState = (state: AllocationState): void => {
  ensureDataDir();
  try {
    // Ensure all BigInt-like values are saved as strings
    const stateToSave = {
      lastCheckedUSDCBalance: String(state.lastCheckedUSDCBalance),
      totalDeposited: String(state.totalDeposited),
      allocatedTax: String(state.allocatedTax),
      allocatedLiquidity: String(state.allocatedLiquidity),
      allocatedYield: String(state.allocatedYield),
      pendingDepositAmount: String(state.pendingDepositAmount),
      lastUpdated: state.lastUpdated,
    };
    const stateData = JSON.stringify(stateToSave, null, 2);
    fs.writeFileSync(STATE_FILE_PATH, stateData);
  } catch (error) {
    console.error('Error saving allocation state:', error);
  }
};

/**
 * Checks the current balance against the last checked balance to detect new deposits.
 * If a new deposit is found, it updates the pending amount and last checked balance in the state.
 * 
 * @param currentBalance The current USDC balance in wei (full precision)
 * @returns The updated state and whether a new deposit was detected
 */
export const checkForNewDepositAndUpdateState = (currentBalance: string): {
  state: AllocationState;
  newDepositDetected: boolean;
  depositAmount: string; // The amount of the new deposit detected (can be > 0 even if pending exists)
} => {
  const state = loadAllocationState();
  const lastBalance = state.lastCheckedUSDCBalance;
  
  // Convert to BigInt for comparison
  const currentBalanceBigInt = BigInt(currentBalance);
  const lastBalanceBigInt = BigInt(lastBalance);
  let newDepositDetected = false;
  let depositAmountDetected = '0';

  if (currentBalanceBigInt > lastBalanceBigInt) {
    depositAmountDetected = (currentBalanceBigInt - lastBalanceBigInt).toString();
    // Only update pending if there isn't already a pending amount
    if (state.pendingDepositAmount === '0') {
       state.pendingDepositAmount = depositAmountDetected;
       newDepositDetected = true;
       console.log(`New deposit detected and set as pending: ${depositAmountDetected}`);
    } else {
      console.warn(`New deposit (${depositAmountDetected}) detected, but a previous pending deposit (${state.pendingDepositAmount}) exists. Confirm the existing one first.`);
    }
    // Always update the last checked balance if it increased
    state.lastCheckedUSDCBalance = currentBalance;
    state.lastUpdated = Date.now();
    saveAllocationState(state);
  } else {
    // Even if balance didn't increase, save the state to update lastUpdated timestamp potentially
    if (state.lastCheckedUSDCBalance !== currentBalance) {
        state.lastCheckedUSDCBalance = currentBalance;
        state.lastUpdated = Date.now();
        saveAllocationState(state);
    }
  }
  
  return { state, newDepositDetected, depositAmount: depositAmountDetected };
};


/**
 * Confirms the pending deposit amount, calculates allocations, updates the main totals,
 * and resets the pending amount.
 * 
 * @returns The updated allocation state
 */
export const confirmPendingDepositAllocation = (): AllocationState => {
  const state = loadAllocationState();
  const pendingAmountBigInt = BigInt(state.pendingDepositAmount);

  if (pendingAmountBigInt <= 0n) {
    console.log('No pending deposit to confirm.');
    return state;
  }

  // Add the confirmed deposit to the total
  state.totalDeposited = (BigInt(state.totalDeposited) + pendingAmountBigInt).toString();
  
  // Calculate allocations for the pending amount
  const taxAmountBigInt = (pendingAmountBigInt * BigInt(Math.floor(TAX_PERCENTAGE * 100))) / 100n;
  const liquidityAmountBigInt = (pendingAmountBigInt * BigInt(Math.floor(LIQUIDITY_PERCENTAGE * 100))) / 100n;
  // Yield gets the remainder
  const yieldAmountBigInt = pendingAmountBigInt - taxAmountBigInt - liquidityAmountBigInt;
  
  // Update the main allocation totals
  state.allocatedTax = (BigInt(state.allocatedTax) + taxAmountBigInt).toString();
  state.allocatedLiquidity = (BigInt(state.allocatedLiquidity) + liquidityAmountBigInt).toString();
  state.allocatedYield = (BigInt(state.allocatedYield) + yieldAmountBigInt).toString();
  
  // Reset pending amount and update timestamp
  const confirmedAmount = state.pendingDepositAmount;
  state.pendingDepositAmount = '0';
  state.lastUpdated = Date.now();
  
  // Save the updated state
  saveAllocationState(state);
  console.log(`Confirmed allocation for deposit: ${confirmedAmount}`);

  return state;
};

/**
 * Gets the current allocation state, including both formatted and raw values for amounts.
 * @returns The formatted and raw allocation state
 */
export const getFullAllocationState = (): {
  totalDeposited: string; // Formatted
  allocatedTax: string; // Formatted
  allocatedLiquidity: string; // Formatted
  allocatedYield: string; // Formatted
  pendingDepositAmount: string; // Formatted
  rawTotalDeposited: string; // Raw string
  rawAllocatedTax: string; // Raw string
  rawAllocatedLiquidity: string; // Raw string
  rawAllocatedYield: string; // Raw string
  rawPendingDepositAmount: string; // Raw string
  lastUpdated: number;
} => {
  const state = loadAllocationState();
  
  return {
    // Formatted values
    totalDeposited: formatUnits(BigInt(state.totalDeposited), USDC_DECIMALS),
    allocatedTax: formatUnits(BigInt(state.allocatedTax), USDC_DECIMALS),
    allocatedLiquidity: formatUnits(BigInt(state.allocatedLiquidity), USDC_DECIMALS),
    allocatedYield: formatUnits(BigInt(state.allocatedYield), USDC_DECIMALS),
    pendingDepositAmount: formatUnits(BigInt(state.pendingDepositAmount), USDC_DECIMALS),
    // Raw string values
    rawTotalDeposited: state.totalDeposited,
    rawAllocatedTax: state.allocatedTax,
    rawAllocatedLiquidity: state.allocatedLiquidity,
    rawAllocatedYield: state.allocatedYield,
    rawPendingDepositAmount: state.pendingDepositAmount,
    // Timestamp
    lastUpdated: state.lastUpdated
  };
}; 