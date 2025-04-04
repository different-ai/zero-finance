/**
 * Allocation State Service (Database Version)
 * 
 * Manages allocation state using Drizzle ORM and PostgreSQL.
 */

import { db } from '@/db';
import { users, userSafes, allocationStates } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { formatUnits, type Address } from 'viem';

// Define the state structure (matches DB schema columns, less userSafeId)
export interface AllocationStateData {
  lastCheckedUSDCBalance: string;  
  totalDeposited: string;          
  allocatedTax: string;            
  allocatedLiquidity: string;      
  allocatedYield: string;          
  pendingDepositAmount: string;    
  lastUpdated: Date; 
}

// Interface combining state data and the primary safe ID
export interface UserAllocationState extends AllocationStateData {
  userSafeId: string;
}

export interface ConfirmedAllocationResult {
  taxAmount: string; // raw wei string
  liquidityAmount: string; // raw wei string
  yieldAmount: string; // raw wei string
}

const USDC_DECIMALS = 6;
const TAX_PERCENTAGE = 0.3;
const LIQUIDITY_PERCENTAGE = 0.2;
const YIELD_PERCENTAGE = 0.5;

/**
 * Gets or creates a user record based on Privy DID.
 */
const getOrCreateUser = async (userDid: string): Promise<{ privyDid: string; createdAt: Date; }> => {
  let user = await db.select().from(users).where(eq(users.privyDid, userDid)).limit(1).then(res => res[0]);
  if (!user) {
    console.log(`Creating new user record for DID: ${userDid}`);
    const newUser = await db.insert(users).values({ privyDid: userDid }).returning().then(res => res[0]);
    if (!newUser) throw new Error("Failed to create user record");
    user = newUser;
  }
  return user;
};

/**
 * Gets or creates the primary Safe record for a user.
 * Uses NEXT_PUBLIC_SAFE_ADDRESS only when creating the record for the first time.
 */
const getOrCreatePrimarySafe = async (userDid: string): Promise<{ id: string; userDid: string; safeAddress: string; safeType: string; createdAt: Date; }> => {
  const envPrimarySafeAddress = process.env.NEXT_PUBLIC_SAFE_ADDRESS as Address | undefined;
  if (!envPrimarySafeAddress) {
    throw new Error("NEXT_PUBLIC_SAFE_ADDRESS is not configured in .env.local - needed for initial setup");
  }

  let primarySafe = await db.select().from(userSafes)
    .where(and(
      eq(userSafes.userDid, userDid),
      eq(userSafes.safeType, 'primary')
    ))
    .limit(1)
    .then(res => res[0]);

  if (!primarySafe) {
    console.log(`Creating new primary safe record for user ${userDid} using env address ${envPrimarySafeAddress}`);
    // Use the address from the environment ONLY on creation
    const newSafe = await db.insert(userSafes).values({
      userDid: userDid,
      safeAddress: envPrimarySafeAddress, 
      safeType: 'primary'
    }).returning().then(res => res[0]);
    if (!newSafe) throw new Error("Failed to create primary user safe record");
    primarySafe = newSafe;
  }
  // No warning needed here, subsequent calls just use the DB address

  return primarySafe;
};

/**
 * Loads the current allocation state for a user's primary Safe from the database.
 * Creates an initial state record if one doesn't exist.
 * @param userDid The Privy DID of the user.
 * @returns The user's current allocation state including the primary safe ID.
 */
export const loadAllocationStateForUser = async (userDid: string): Promise<UserAllocationState> => {
  try {
    await getOrCreateUser(userDid); // Ensure user exists
    const primarySafe = await getOrCreatePrimarySafe(userDid);

    let state = await db.select().from(allocationStates)
      .where(eq(allocationStates.userSafeId, primarySafe.id))
      .limit(1)
      .then(res => res[0]);

    if (!state) {
      console.log(`Creating initial allocation state for user ${userDid}, primary safe ID ${primarySafe.id}`);
      const initialStateValues = {
          userSafeId: primarySafe.id,
          // Defaults are handled by the DB schema
      };
      const newState = await db.insert(allocationStates).values(initialStateValues).returning().then(res => res[0]);
      if (!newState) throw new Error("Failed to create initial allocation state");
      // Use defaults from schema definition for the return value before first save
      state = {
          userSafeId: newState.userSafeId,
          lastCheckedUSDCBalance: '0', 
          totalDeposited: '0',
          allocatedTax: '0',       
          allocatedLiquidity: '0', 
          allocatedYield: '0',
          pendingDepositAmount: '0',
          lastUpdated: newState.lastUpdated, 
      };
    }
    
    // Construct the UserAllocationState object
    return {
        userSafeId: state.userSafeId,
        lastCheckedUSDCBalance: String(state.lastCheckedUSDCBalance),
        totalDeposited: String(state.totalDeposited),
        allocatedTax: String(state.allocatedTax),
        allocatedLiquidity: String(state.allocatedLiquidity),
        allocatedYield: String(state.allocatedYield),
        pendingDepositAmount: String(state.pendingDepositAmount),
        lastUpdated: state.lastUpdated,
    };

  } catch (error) {
    console.error(`Error loading allocation state for user ${userDid}:`, error);
    throw new Error(`Failed to load allocation state: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Saves (updates) the allocation state for a user's primary safe to the database.
 * @param userDid The Privy DID of the user.
 * @param updates A partial state object containing fields to update.
 */
export const saveAllocationStateForUser = async (userDid: string, updates: Partial<AllocationStateData>): Promise<void> => {
   try {
    const primarySafe = await getOrCreatePrimarySafe(userDid); // Need the safe ID to update

    // Prepare update values, ensuring numbers are strings and adding lastUpdated timestamp
    const updateValues: { [key: string]: string | Date } = {}; 
    for (const key in updates) {
        if (Object.prototype.hasOwnProperty.call(updates, key)) {
            const typedKey = key as keyof typeof updates;
            // Convert potential BigInts or numbers back to string for DB
            if (typedKey !== 'lastUpdated') { // Exclude lastUpdated from String conversion
                 updateValues[typedKey] = String(updates[typedKey]); 
            }
        }
    }
    updateValues.lastUpdated = new Date(); // Always update timestamp on save

    if (Object.keys(updateValues).length <= 1) { // Only lastUpdated added
        console.log(`No state changes detected for user ${userDid}, skipping save.`);
        return;
    }

    await db.update(allocationStates)
      .set(updateValues)
      .where(eq(allocationStates.userSafeId, primarySafe.id));

    console.log(`Saved state updates for user ${userDid}:`, Object.keys(updates));

  } catch (error) {
    console.error(`Error saving allocation state for user ${userDid}:`, error);
    throw new Error(`Failed to save allocation state: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Checks the current balance for a user's primary safe against the last checked balance.
 * If a new deposit is found, it updates the pending amount in the database.
 * 
 * @param userDid The Privy DID of the user.
 * @param currentBalance The current USDC balance in wei (full precision string).
 * @returns The updated state and deposit details.
 */
export const checkDepositAndGetState = async (userDid: string, currentBalance: string): Promise<{
  state: UserAllocationState;
  newDepositDetected: boolean;
  depositAmount: string;
}> => {
  let state = await loadAllocationStateForUser(userDid);
  const lastBalance = state.lastCheckedUSDCBalance;
  
  const currentBalanceBigInt = BigInt(currentBalance);
  const lastBalanceBigInt = BigInt(lastBalance);
  let newDepositDetected = false;
  let depositAmountDetected = '0';

  const updates: Partial<AllocationStateData> = {};

  if (currentBalanceBigInt > lastBalanceBigInt) {
    depositAmountDetected = (currentBalanceBigInt - lastBalanceBigInt).toString();
    if (state.pendingDepositAmount === '0') {
       updates.pendingDepositAmount = depositAmountDetected;
       newDepositDetected = true;
       console.log(`User ${userDid}: New deposit detected and set as pending: ${depositAmountDetected}`);
    } else {
      console.warn(`User ${userDid}: New deposit (${depositAmountDetected}) detected, but pending (${state.pendingDepositAmount}) exists. Confirm first.`);
    }
    updates.lastCheckedUSDCBalance = currentBalance; // Always update if balance increased
  } else if (state.lastCheckedUSDCBalance !== currentBalance) {
    // Update balance even if it decreased or stayed same but value changed
    updates.lastCheckedUSDCBalance = currentBalance;
  }

  // Only save if there are updates
  if (Object.keys(updates).length > 0) {
    await saveAllocationStateForUser(userDid, updates);
    // Reload state after saving to get the most recent data including lastUpdated
    state = await loadAllocationStateForUser(userDid); 
  }
  
  return { state, newDepositDetected, depositAmount: depositAmountDetected };
};

/**
 * Confirms the pending deposit for a user, updates allocations in the DB,
 * and returns the amounts allocated in this step.
 * 
 * @param userDid The Privy DID of the user.
 * @returns The updated state and the allocated amounts.
 */
export const confirmAllocationForUser = async (userDid: string): Promise<{
  newState: UserAllocationState;
  allocatedAmounts: ConfirmedAllocationResult;
}> => {
  let state = await loadAllocationStateForUser(userDid);
  const pendingAmountBigInt = BigInt(state.pendingDepositAmount);

  if (pendingAmountBigInt <= 0n) {
    console.log(`User ${userDid}: No pending deposit to confirm.`);
    return {
      newState: state,
      allocatedAmounts: { taxAmount: '0', liquidityAmount: '0', yieldAmount: '0' },
    };
  }

  // Calculate changes
  const newTotalDeposited = (BigInt(state.totalDeposited) + pendingAmountBigInt).toString();
  const taxAmountBigInt = (pendingAmountBigInt * BigInt(Math.floor(TAX_PERCENTAGE * 100))) / 100n;
  const liquidityAmountBigInt = (pendingAmountBigInt * BigInt(Math.floor(LIQUIDITY_PERCENTAGE * 100))) / 100n;
  const yieldAmountBigInt = pendingAmountBigInt - taxAmountBigInt - liquidityAmountBigInt;
  const newAllocatedTax = (BigInt(state.allocatedTax) + taxAmountBigInt).toString();
  const newAllocatedLiquidity = (BigInt(state.allocatedLiquidity) + liquidityAmountBigInt).toString();
  const newAllocatedYield = (BigInt(state.allocatedYield) + yieldAmountBigInt).toString();

  const updates: Partial<AllocationStateData> = {
    totalDeposited: newTotalDeposited,
    allocatedTax: newAllocatedTax,
    allocatedLiquidity: newAllocatedLiquidity,
    allocatedYield: newAllocatedYield,
    pendingDepositAmount: '0', // Reset pending amount
  };

  await saveAllocationStateForUser(userDid, updates);
  console.log(`User ${userDid}: Confirmed allocation for deposit: ${state.pendingDepositAmount}`);

  const allocatedAmounts: ConfirmedAllocationResult = {
    taxAmount: taxAmountBigInt.toString(),
    liquidityAmount: liquidityAmountBigInt.toString(),
    yieldAmount: yieldAmountBigInt.toString(),
  };
  
  // Reload state after save
  const newState = await loadAllocationStateForUser(userDid);
  return { newState, allocatedAmounts };
};

/**
 * Gets the full allocation state (formatted and raw) for a user.
 * @param userDid The Privy DID of the user.
 * @returns The user's full allocation state including formatted and raw values.
 */
export const getFullAllocationStateForUser = async (userDid: string): Promise<{
  totalDeposited: string; 
  allocatedTax: string; 
  allocatedLiquidity: string;
  allocatedYield: string; 
  pendingDepositAmount: string;
  rawTotalDeposited: string; 
  rawAllocatedTax: string; 
  rawAllocatedLiquidity: string;
  rawAllocatedYield: string; 
  rawPendingDepositAmount: string;
  lastUpdated: Date;
  primarySafeAddress: Address; // Add primary safe address
}> => {
  const state = await loadAllocationStateForUser(userDid);
  const primarySafe = await getOrCreatePrimarySafe(userDid); // Fetch safe again to get address
  
  return {
    totalDeposited: formatUnits(BigInt(state.totalDeposited), USDC_DECIMALS),
    allocatedTax: formatUnits(BigInt(state.allocatedTax), USDC_DECIMALS),
    allocatedLiquidity: formatUnits(BigInt(state.allocatedLiquidity), USDC_DECIMALS),
    allocatedYield: formatUnits(BigInt(state.allocatedYield), USDC_DECIMALS),
    pendingDepositAmount: formatUnits(BigInt(state.pendingDepositAmount), USDC_DECIMALS),
    rawTotalDeposited: state.totalDeposited,
    rawAllocatedTax: state.allocatedTax,
    rawAllocatedLiquidity: state.allocatedLiquidity,
    rawAllocatedYield: state.allocatedYield,
    rawPendingDepositAmount: state.pendingDepositAmount,
    lastUpdated: state.lastUpdated,
    primarySafeAddress: primarySafe.safeAddress as Address // Return the primary address
  };
}; 