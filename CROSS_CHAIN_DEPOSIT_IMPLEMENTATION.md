# Cross-Chain Safe Architecture: EOA Ownership Migration

## Overview

We have transitioned the cross-chain Safe architecture to use **Embedded Wallet (EOA) Ownership** instead of Smart Wallet (Kernel) ownership.

### Why?
1.  **Reliability:** EOAs are always "deployed" and available on all chains. This eliminates the "undeployed owner" errors we faced on Arbitrum (where the Kernel Smart Wallet wasn't deployed yet).
2.  **Control:** Users directly own their Safes via their Privy Embedded Wallet key.
3.  **Sponsorship:** We maintain gas sponsorship by using the Privy Smart Wallet as the **Relayer** (transaction submitter), even though it is no longer the owner.

## Changes Implemented

### 1. Backend: Safe Deployment (`multi-chain-safe-manager.ts`)
-   **New Logic:** When deploying a new Safe on a secondary chain (e.g., Arbitrum), the system now looks up the user's **Embedded Wallet (EOA) Address**.
-   **Owner Assignment:** The new Safe is deployed with the EOA as the sole owner (`threshold: 1`).
-   **Determinism:** The `saltNonce` is derived from the Base Safe address to maintain a link, but the resulting Safe address will be different from the Base Safe (due to different owners). This is expected and handled by the database.

### 2. Frontend: Deposit Flow (`deposit-earn-card.tsx`)
-   **Owner Detection:** The UI now dynamically checks the on-chain owners of the Target Safe.
-   **Hybrid Execution Flow:**
    *   **If EOA Owner (New Standard):**
        1.  Constructs the Safe transaction (Approve + Deposit).
        2.  User signs the transaction hash via their **Embedded Wallet** (`wallets[0].sign(hash)`).
        3.  The signed transaction is relayed via the **Smart Wallet Client** (`targetClient.sendTransaction`).
        4.  **Result:** Gas is sponsored (via Smart Wallet), but custody is verified via EOA signature.
    *   **If Smart Wallet Owner (Legacy):**
        1.  Constructs the Safe transaction.
        2.  Relays via Smart Wallet Client (which acts as both signer and submitter).
        3.  *Note:* This path requires the Smart Wallet to be deployed on the target chain.

### 3. Cleanup Script (`scripts/clean-arbitrum-safe.ts`)
-   A script has been created to delete the existing (broken) Arbitrum Safe record for user `did:privy:cmfzy4jse000pjx0clx16p972`.
-   **Usage:** Run this script to reset the user's state. The next time they visit the UI, it will prompt them to deploy a *new* Safe, which will use the new EOA-owner logic.

## How to Verify
1.  **Run Cleanup:** Execute the cleanup script (ensure local DB is running).
2.  **UI Test:** Go to the Earn page for the user.
3.  **Deploy:** Click "Set Up Arbitrum Account". Verify the new Safe is deployed.
4.  **Deposit:** Perform a deposit. You should see a signature request from the Embedded Wallet, followed by a sponsored transaction.
