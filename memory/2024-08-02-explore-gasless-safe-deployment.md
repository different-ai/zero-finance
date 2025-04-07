# Gasless Safe Deployment Exploration

**Date:** 2024-08-02

**Context:** The current implementation of secondary Safe creation (`initializeAndDeploySafe` in `safe-deployment-service.ts`) relies on a server-side `DEPLOYER_PRIVATE_KEY` which must hold native gas tokens (ETH on Base) to pay for the deployment transaction.

**Requirement:** Explore alternative methods for deploying Safes without requiring the server's deployer key to be funded. This improves security and reduces operational burden.

**Potential Solutions to Investigate:**

1.  **Safe{Core} SDK Relay Kit:** The `@safe-global/relay-kit` allows sponsoring transactions using Gelato or other relayers. This seems like a primary candidate.
2.  **Gas Abstraction Services:** Investigate third-party services (e.g., Biconomy, Pimlico) that specialize in sponsoring user transactions or specific contract interactions.
3.  **User-Funded Deployment:** Shift the deployment transaction initiation to the frontend, requiring the *user's* connected wallet (e.g., their Privy embedded wallet if it holds gas) to pay for the deployment. This changes the UX but removes the server funding need.

**Action:** When revisiting Safe deployment, research and potentially implement a solution using the Relay Kit or another gas abstraction method to sponsor the deployment transaction initiated by the server. 