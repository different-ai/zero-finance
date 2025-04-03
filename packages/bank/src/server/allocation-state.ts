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
      return {
        ...initialState,
        ...parsedState,
        pendingDepositAmount: parsedState.pendingDepositAmount ?? '0',
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
    // Ensure all BigInts are saved as strings
    const stateToSave = {
      ...state,
      lastCheckedUSDCBalance: state.lastCheckedUSDCBalance.toString(),
      totalDeposited: state.totalDeposited.toString(),
      allocatedTax: state.allocatedTax.toString(),
      allocatedLiquidity: state.allocatedLiquidity.toString(),
      allocatedYield: state.allocatedYield.toString(),
      pendingDepositAmount: state.pendingDepositAmount.toString(),
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
  depositAmount: string;
} => {
  const state = loadAllocationState();
  const lastBalance = state.lastCheckedUSDCBalance;
  
  // Convert to BigInt for comparison
  const currentBalanceBigInt = BigInt(currentBalance);
  const lastBalanceBigInt = BigInt(lastBalance);
  let newDepositDetected = false;
  let depositAmount = '0';

  if (currentBalanceBigInt > lastBalanceBigInt) {
    depositAmount = (currentBalanceBigInt - lastBalanceBigInt).toString();
    // Only update pending if there isn't already a pending amount
    if (state.pendingDepositAmount === '0') {
       state.pendingDepositAmount = depositAmount;
       newDepositDetected = true;
    } else {
      console.warn(`New deposit (${depositAmount}) detected, but a previous pending deposit (${state.pendingDepositAmount}) exists. Please confirm the previous one first.`);
      // Don't overwrite existing pending deposit, just update the last checked balance
    }
    // Always update the last checked balance if it increased
    state.lastCheckedUSDCBalance = currentBalance;
    state.lastUpdated = Date.now();
    saveAllocationState(state);
  }
  
  return { state, newDepositDetected, depositAmount };
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
  const taxAmount = (pendingAmountBigInt * BigInt(Math.floor(TAX_PERCENTAGE * 100)) / BigInt(100)).toString();
  const liquidityAmount = (pendingAmountBigInt * BigInt(Math.floor(LIQUIDITY_PERCENTAGE * 100)) / BigInt(100)).toString();
  
  // Yield gets the remainder
  const yieldAmount = (pendingAmountBigInt - BigInt(taxAmount) - BigInt(liquidityAmount)).toString();
  
  // Update the main allocation totals
  state.allocatedTax = (BigInt(state.allocatedTax) + BigInt(taxAmount)).toString();
  state.allocatedLiquidity = (BigInt(state.allocatedLiquidity) + BigInt(liquidityAmount)).toString();
  state.allocatedYield = (BigInt(state.allocatedYield) + BigInt(yieldAmount)).toString();
  
  // Reset pending amount and update timestamp
  state.pendingDepositAmount = '0';
  state.lastUpdated = Date.now();
  
  // Save the updated state
  saveAllocationState(state);
  console.log(`Confirmed allocation for deposit: ${state.pendingDepositAmount}`);

  return state;
};

/**
 * Gets the current allocation state formatted with human-readable values
 * @returns The formatted allocation state including the pending deposit amount
 */
export const getFormattedAllocationState = (): {
  totalDeposited: string;
  allocatedTax: string;
  allocatedLiquidity: string;
  allocatedYield: string;
  pendingDepositAmount: string; // Formatted pending amount
  lastUpdated: number;
} => {
  const state = loadAllocationState();
  
  return {
    totalDeposited: formatUnits(BigInt(state.totalDeposited), USDC_DECIMALS),
    allocatedTax: formatUnits(BigInt(state.allocatedTax), USDC_DECIMALS),
    allocatedLiquidity: formatUnits(BigInt(state.allocatedLiquidity), USDC_DECIMALS),
    allocatedYield: formatUnits(BigInt(state.allocatedYield), USDC_DECIMALS),
    pendingDepositAmount: formatUnits(BigInt(state.pendingDepositAmount), USDC_DECIMALS),
    lastUpdated: state.lastUpdated
  };
}; 