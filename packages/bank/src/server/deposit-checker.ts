/**
 * Deposit Checker Service
 * 
 * Runs on an interval to check for new USDC deposits to the Safe and update allocations.
 */

import { fetchUSDCBalance } from './balance-service';
import { checkAndUpdateBalance, calculateAndTrackAllocation } from './allocation-state';

let isRunning = false;
let checkIntervalId: NodeJS.Timeout | null = null;

/**
 * Start the deposit checker service
 * @param intervalMs Interval in milliseconds between checks (default: 60 seconds)
 */
export const startDepositChecker = (intervalMs: number = 60000) => {
  if (isRunning) {
    console.log('Deposit checker is already running');
    return;
  }
  
  isRunning = true;
  
  console.log(`Starting deposit checker service (interval: ${intervalMs}ms)`);
  
  // Run immediately on startup
  checkForNewDeposits();
  
  // Set up interval for repeated checks
  checkIntervalId = setInterval(checkForNewDeposits, intervalMs);
};

/**
 * Stop the deposit checker service
 */
export const stopDepositChecker = () => {
  if (!isRunning) {
    console.log('Deposit checker is not running');
    return;
  }
  
  if (checkIntervalId) {
    clearInterval(checkIntervalId);
    checkIntervalId = null;
  }
  
  isRunning = false;
  console.log('Deposit checker service stopped');
};

/**
 * Check for new deposits and update allocations
 */
const checkForNewDeposits = async () => {
  try {
    console.log('Checking for new deposits...');
    
    // Fetch current USDC balance
    const currentBalance = await fetchUSDCBalance();
    console.log(`Current USDC balance: ${currentBalance}`);
    
    // Check if there's a new deposit
    const { newDeposit, depositAmount } = checkAndUpdateBalance(currentBalance);
    
    if (newDeposit) {
      console.log(`New deposit detected: ${depositAmount}`);
      
      // Calculate and track allocations for the new deposit
      const allocations = calculateAndTrackAllocation(depositAmount);
      console.log('Allocations updated:', allocations);
    } else {
      console.log('No new deposits detected');
    }
  } catch (error) {
    console.error('Error checking for new deposits:', error);
  }
}; 