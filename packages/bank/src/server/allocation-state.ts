/**
 * Allocation State Service
 * 
 * This service manages the state of allocations for detected USDC deposits.
 * It tracks total deposits, tax allocation (30%), liquidity allocation (20%), 
 * and yield allocation (50%).
 */

import fs from 'fs';
import path from 'path';
import { formatUnits, parseUnits } from 'viem';

// Define the state structure
export interface AllocationState {
  lastCheckedUSDCBalance: string;  // In wei (full precision)
  totalDeposited: string;          // In wei (full precision)
  allocatedTax: string;            // In wei (full precision)
  allocatedLiquidity: string;      // In wei (full precision)
  allocatedYield: string;          // In wei (full precision)
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
      return JSON.parse(stateData);
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
    const stateData = JSON.stringify(state, null, 2);
    fs.writeFileSync(STATE_FILE_PATH, stateData);
  } catch (error) {
    console.error('Error saving allocation state:', error);
  }
};

/**
 * Updates the last checked USDC balance and checks for new deposits
 * @param currentBalance The current USDC balance in wei (full precision)
 * @returns Information about detected deposit, if any
 */
export const checkAndUpdateBalance = (currentBalance: string): { 
  newDeposit: boolean, 
  depositAmount: string 
} => {
  const state = loadAllocationState();
  const lastBalance = state.lastCheckedUSDCBalance;
  
  // Convert to BigInt for comparison (prevents precision issues)
  const currentBalanceBigInt = BigInt(currentBalance);
  const lastBalanceBigInt = BigInt(lastBalance);
  
  // Check if there's a new deposit
  if (currentBalanceBigInt > lastBalanceBigInt) {
    // Calculate the deposit amount
    const depositAmount = (currentBalanceBigInt - lastBalanceBigInt).toString();
    
    // Update the state
    state.lastCheckedUSDCBalance = currentBalance;
    state.lastUpdated = Date.now();
    saveAllocationState(state);
    
    return { newDeposit: true, depositAmount };
  }
  
  // No new deposit detected
  state.lastCheckedUSDCBalance = currentBalance;
  state.lastUpdated = Date.now();
  saveAllocationState(state);
  
  return { newDeposit: false, depositAmount: '0' };
};

/**
 * Calculates and tracks allocation for a new deposit amount
 * @param depositAmount The deposit amount in wei (full precision)
 */
export const calculateAndTrackAllocation = (depositAmount: string): AllocationState => {
  const state = loadAllocationState();
  const depositAmountBigInt = BigInt(depositAmount);
  
  // Add the deposit to the total
  state.totalDeposited = (BigInt(state.totalDeposited) + depositAmountBigInt).toString();
  
  // Calculate allocations
  const taxAmount = (depositAmountBigInt * BigInt(Math.floor(TAX_PERCENTAGE * 100)) / BigInt(100)).toString();
  const liquidityAmount = (depositAmountBigInt * BigInt(Math.floor(LIQUIDITY_PERCENTAGE * 100)) / BigInt(100)).toString();
  
  // Yield gets the remainder to ensure we don't have rounding issues
  const yieldAmount = (depositAmountBigInt - BigInt(taxAmount) - BigInt(liquidityAmount)).toString();
  
  // Update the state
  state.allocatedTax = (BigInt(state.allocatedTax) + BigInt(taxAmount)).toString();
  state.allocatedLiquidity = (BigInt(state.allocatedLiquidity) + BigInt(liquidityAmount)).toString();
  state.allocatedYield = (BigInt(state.allocatedYield) + BigInt(yieldAmount)).toString();
  state.lastUpdated = Date.now();
  
  // Save the updated state
  saveAllocationState(state);
  
  return state;
};

/**
 * Gets the current allocation state formatted with human-readable values
 * @returns The formatted allocation state
 */
export const getFormattedAllocationState = (): {
  totalDeposited: string;
  allocatedTax: string;
  allocatedLiquidity: string;
  allocatedYield: string;
  lastUpdated: number;
} => {
  const state = loadAllocationState();
  
  return {
    totalDeposited: formatUnits(BigInt(state.totalDeposited), USDC_DECIMALS),
    allocatedTax: formatUnits(BigInt(state.allocatedTax), USDC_DECIMALS),
    allocatedLiquidity: formatUnits(BigInt(state.allocatedLiquidity), USDC_DECIMALS),
    allocatedYield: formatUnits(BigInt(state.allocatedYield), USDC_DECIMALS),
    lastUpdated: state.lastUpdated
  };
}; 