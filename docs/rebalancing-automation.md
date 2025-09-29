# Automated Cross-Vault Rebalancing – Feasibility Notes

## Current Savings Activation Flow
- `usePrimaryAccountSetup` (`packages/web/src/hooks/use-primary-account-setup.ts`) bootstraps a Privy smart wallet, deploys the user's Safe, then enables the Fluidkey Earn module by calling `enableModule` and `onInstall` with `CONFIG_HASH_DECIMAL`.
- The config hash resolves to the static vault mapping defined in `FluidkeyBaseConfig` (`packages/fluidkey-earn-module/script/FluidkeyBaseConfig.sol`). For Base USDC, the module points at `0xeE8F4eC5672F09119b96Ab6fB59C27E1b7e44b61` (Gauntlet USDC Prime), not the Seamless address listed in the UI helper (`packages/web/src/server/earn/base-vaults.ts`).
- Once the module reports as enabled, the hook calls `setAutoEarnPct` to store a 100% allocation so the background worker can trigger `autoEarn` when new idle balances hit the Safe.

## What the Module Supports Today
- `FluidkeyEarnModule` stores vault choices in `config[configHash][chainId][token]`. Only the contract owner can push new configs via `setConfig`; users inherit whichever hash was encoded during `onInstall`.
- `autoEarn` is the only on-chain action exposed to authorized relayers. It simply approves and deposits the current Safe token balance into the configured ERC-4626 vault. There is no withdrawal or "swap vault" logic.
- Users can opt into a different config hash via `changeConfigHash`, but **the Safe itself must submit that transaction**. Because accounts are self-custodial, we cannot sign it for them.

## Requirements for Seamless → Other Vault Rebalancing
1. Withdraw the user's existing vault shares back into the Safe (ERC-4626 `redeem`/`withdraw`).
2. Approve and deposit the resulting asset into the new target vault.
3. Update the module config so future automated deposits use the new vault.
4. Do all of the above without surfacing a UX prompt to the user.

## Gaps Blocking Full Automation
- **No withdrawal primitive**: The module never calls `redeem`/`withdraw`, so it cannot unwind a Seamless position on its own. Adding this would require a contract upgrade and new safety reviews.
- **Config changes still need the Safe's signature**: `changeConfigHash` requires `msg.sender` to be the Safe. Today we obtain a signature through the user's embedded Privy wallet (see the relay flow in the hook). Without the user online, we cannot broadcast that transaction.
- **Authorized relayers are deposit-only**: Even after a contract upgrade, we would need new entry points that let an authorized relayer trigger withdrawals and multi-step re-deposits atomically, otherwise the Safe would sit with idle assets if a step fails.
- **Off-chain job coordination**: The current worker pipeline assumes a single deposit target per token. Supporting migrations would mean teaching the worker to:
  - Detect when a Safe is mapped to an outdated vault.
  - Pause new deposits while a migration is in flight.
  - Orchestrate multi-transaction sequences (withdraw → deposit → config change) with retries and monitoring.
- **State tracking for share accounting**: We do not store how many vault shares each Safe holds, so we would need on-chain reads or subgraph indexing to know how much to unwind safely.

## Possible Paths (All Require Meaningful Work)
- **Contract extension**: Introduce `rebalance(token, newVault, amount)` that is callable by authorized relayers and executes withdraw + deposit + config update internally. This demands contract changes, re-audit, and Safe governance for upgrade/redeployment.
- **User-assisted migration**: Keep the current contract and build a guided flow that has the user sign the necessary Safe transactions via the embedded wallet. This avoids contract risk but is not "fully automated".
- **Partial automation**: Owner updates the global config to point new deposits at the next vault, and a background job notifies users that legacy funds remain in the previous vault. This still leaves manual cleanup.

## Conclusion
Given the present contract and hook architecture, **we cannot transparently rebalance user funds across vaults without their participation**. Achieving a hands-off migration would demand:
- New contract functionality (withdrawal/rebalance primitives, relayer permissions)
- Safe-level transaction flows that we can trigger without user signatures (not currently possible under our self-custodial model)
- Significant backend orchestration to coordinate the migration

The fastest viable option today is a user-guided migration flow. Truly automated rebalancing would require a contract redesign plus new infrastructure and would not be "easy" to ship safely.
