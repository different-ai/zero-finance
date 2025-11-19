# Safe Deployment Strategy & Compatibility Plan

## The Problem
The error `Safe already deployed` occurs because the frontend `handleDeploySafe` tries to *create* a deployment transaction for an address that the Safe SDK thinks is already deployed, OR the configuration (owners/threshold/salt) generates a predictable address that conflicts with an existing one.

Additionally, we have a fragmentation of ownership:
- **Base Safes:** Owned by **Smart Wallet**.
- **Arbitrum Safes (New):** Owned by **Embedded Wallet (EOA)**.

We need a unified strategy that handles both, respects existing deployments, and correctly routes transaction execution based on who the *actual* owner is.

## The Solution: "Check Owner, Then Act"

We will refactor the deployment and execution logic to be owner-agnostic until the moment of action.

### 1. Deployment Logic (`DepositEarnCard` & Backend)
Instead of blindly enforcing EOA ownership or Smart Wallet ownership, we will:
1.  **Backend:** When predicting/generating deployment txs, we default to EOA ownership (for new setups) but we must handle the case where a Safe *might* already exist or the user wants to replicate their Base setup.
    *   *Refinement:* We will stick to the **EOA Ownership** for new chains as it is robust.
    *   *Fix for "Already Deployed":* If the Safe is already deployed on-chain but missing from our DB, we should just register it, not try to redeploy.

### 2. Execution Logic (`DepositEarnCard` - `handleTargetChainDeposit`)
This is the critical path. We must dynamically detect the execution path.

**Step 1: Check Owners**
Query the `getOwners()` of the target Safe on the target chain.

**Step 2: Determine Path**
-   **Case A: EOA is Owner** (New Arbitrum Safes)
    *   **Action:** Sign transaction hash with EOA (`usePrivy().sign`).
    *   **Relay:** Submit via Smart Wallet (`targetClient.sendTransaction`) with the signature attached.
    *   *Status:* Already implemented in previous turns, just needs verification.

-   **Case B: Smart Wallet is Owner** (Base Safes / Legacy)
    *   **Action:** Do *not* sign with EOA.
    *   **Relay:** Submit via Smart Wallet (`targetClient.sendTransaction`). The Smart Wallet acts as `msg.sender`, which satisfies the Safe's check (if `msg.sender` is owner).
    *   *Requirement:* Smart Wallet MUST be deployed on the target chain for this to work safely (or use `validateOwner` flow).

### 3. Fixing the "Safe already deployed" Error

This specific error in `createSafeDeploymentTransaction` usually means the SDK detects code at the predicted address.

**Fix in `DepositEarnCard.tsx`:**
1.  Before calling `protocolKit.createSafeDeploymentTransaction()`, check if code exists at the `predictedAddress`.
2.  If code exists:
    *   Skip deployment transaction creation.
    *   Proceed directly to `registerSafeMutation`.
    *   Inform the user "Safe already exists, linking to account...".

## Implementation Plan

1.  **Update `DepositEarnCard`:**
    *   Add a pre-check for code at `predictedAddress` inside `handleDeploySafe`.
    *   If deployed, skip to registration.
    *   Refine the `predictedSafe` config to ensuring it matches the backend's prediction exactly (owners/salt) to avoid address mismatch errors.

2.  **Refine Execution:**
    *   The dual-path execution (EOA vs Smart Wallet) is already largely in place from the previous commit. We will double-check it covers the "Smart Wallet Owner" case correctly by ensuring `skipPreSig` logic is robust.

Let's implement the `DepositEarnCard` fix first.
