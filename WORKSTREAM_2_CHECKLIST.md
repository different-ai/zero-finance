# Workstream 2: Bridge Service - Implementation Checklist

## ✅ Phase 2.1: Across Protocol SDK Integration

- [x] Install @across-protocol/app-sdk
- [x] Create AcrossClientSingleton class
- [x] Implement getAcrossBridgeQuote() with real API calls
- [x] Add detailed fee breakdown (LP, gas, capital)
- [x] Document integrator ID requirement
- [x] Add helper function getRecommendedRelayerFee()
- [x] Export getAcrossClient() for advanced usage
- [x] Use proper TypeScript types from SDK

**Files:** `packages/web/src/lib/across/across-client.ts`

---

## ✅ Phase 2.2: Multicall Encoding

- [x] Create CrossChainAction interface
- [x] Implement encodeApproval() for ERC20
- [x] Implement encodeVaultDeposit() for ERC4626
- [x] Implement encodeVaultDepositMulticall() wrapper
- [x] Use viem's encodeFunctionData for type safety
- [x] Add comprehensive JSDoc comments

**Files:** `packages/web/src/lib/across/encode-multicall.ts`

---

## ✅ Phase 2.3: Bridge Service

- [x] Create BridgeTransaction interface
- [x] Create BridgeDepositParams interface
- [x] Implement getBridgeQuoteForVault() wrapper
- [x] Create encodeBridgeWithVaultDeposit() stub with TODOs
- [x] Create trackBridgeDeposit() stub with exponential backoff
- [x] Add helper functions (getEstimatedBridgeTime, calculateTotalBridgeCost)
- [x] Document TODO items clearly

**Files:** `packages/web/src/server/earn/across-bridge-service.ts`

---

## ✅ Phase 2.4: Database Tracking

- [x] Create SQL migration 0114_add_bridge_transactions.sql
- [x] Add bridge_transactions table schema
- [x] Add indexes for efficient queries
- [x] Create TypeScript schema in bridge-transactions.ts
- [x] Export InsertBridgeTransaction type
- [x] Export SelectBridgeTransaction type
- [x] Update schema/index.ts to export new module
- [x] Add table and column comments

**Files:** 
- `packages/web/drizzle/0114_add_bridge_transactions.sql`
- `packages/web/src/db/schema/bridge-transactions.ts`
- `packages/web/src/db/schema/index.ts`

---

## ⏳ Additional Tasks (From Instructions)

### Safe SDK Implementations (3 functions)

- [ ] Implement predictSafeAddress() in packages/web/src/lib/safe-multi-chain.ts:36
- [ ] Implement getSafeDeploymentTransaction() in packages/web/src/server/earn/multi-chain-safe-manager.ts:182
- [ ] Implement checkSafeDeployedOnChain() in packages/web/src/lib/safe-multi-chain.ts:71

**Note:** These are needed for the bridge to work (need destination Safe address)

---

## 🔧 TODO: Critical Path Completion

### 1. Complete Bridge Transaction Encoding

**File:** `packages/web/src/server/earn/across-bridge-service.ts`
**Function:** `encodeBridgeWithVaultDeposit()`

Steps:
- [ ] Get SpokePool contract ABI from Across SDK
- [ ] Get SpokePool address using `client.getSpokePoolAddress(chainId)`
- [ ] Encode `depositV3` function call with parameters:
  - depositor
  - recipient (destination Safe)
  - inputToken
  - outputToken
  - inputAmount
  - outputAmount
  - destinationChainId
  - exclusiveRelayer
  - quoteTimestamp
  - fillDeadline
  - exclusivityDeadline
  - message (encoded cross-chain actions)
- [ ] Return complete transaction object

### 2. Complete Bridge Status Monitoring

**File:** `packages/web/src/server/earn/across-bridge-service.ts`
**Function:** `trackBridgeDeposit()`

Steps:
- [ ] Use `client.getFillByDepositTx()` to check fill status
- [ ] Implement polling loop with exponential backoff
- [ ] Return 'pending', 'filled', or 'failed' status
- [ ] Handle timeout after max attempts

### 3. Database CRUD Functions

**File:** `packages/web/src/server/db/bridge-transactions.ts` (create new)

Functions needed:
- [ ] `createBridgeTransaction()` - Insert new record
- [ ] `updateBridgeStatus()` - Update status (pending → filled/failed)
- [ ] `getBridgeTransactionsByUser()` - Get user's bridge history
- [ ] `getBridgeTransactionByTxHash()` - Lookup by deposit tx hash
- [ ] `getPendingBridges()` - Get all pending bridges for monitoring

### 4. Testing

- [ ] Unit tests for encodeVaultDepositMulticall()
- [ ] Unit tests for getAcrossBridgeQuote()
- [ ] Integration test: Get quote on testnet
- [ ] Integration test: Execute bridge on testnet
- [ ] Integration test: Monitor bridge completion
- [ ] E2E test: Full Base → Arbitrum vault deposit flow

### 5. Production Readiness

- [ ] Get production integrator ID from Across team
- [ ] Update `integratorId` in across-client.ts
- [ ] Add error monitoring/alerting for failed bridges
- [ ] Add retry logic for transient API failures
- [ ] Document rate limits and error handling
- [ ] Add bridge transaction receipts/confirmations

---

## 📊 Success Criteria

All items below must be true:

- [x] Across SDK installed and working
- [x] Real-time bridge quotes (not hardcoded fees)
- [x] Multicall encoding for vault deposits
- [x] Bridge transaction builder structure
- [x] Status monitoring with exponential backoff
- [x] Database migration and CRUD schema
- [x] No hardcoded values
- [x] Proper error handling structure
- [x] TypeScript types throughout
- [ ] Full E2E bridge flow working
- [ ] Tests passing
- [ ] Production integrator ID obtained

---

## 📝 Documentation

- [x] AGENT_2_IMPLEMENTATION_SUMMARY.md - Detailed implementation report
- [x] ACROSS_INTEGRATION_GUIDE.md - Developer quick reference
- [x] Inline code comments and JSDoc
- [ ] API documentation for public functions
- [ ] Troubleshooting guide for common issues

---

## 🎯 Next Agent Handoff

When handing off to Agent 3 (UI/Frontend):

**What's Ready:**
- ✅ Quote fetching API
- ✅ Fee breakdown display data
- ✅ Multicall encoding logic
- ✅ Database schema

**What Needs Completion:**
- ⏳ Bridge transaction execution
- ⏳ Status monitoring implementation
- ⏳ Database CRUD functions
- ⏳ Safe SDK integration

**Recommended:**
Complete TODO items above before UI implementation for smoother E2E testing.

---

**Last Updated:** November 17, 2025  
**Agent 2 Status:** Phase 2.1-2.4 Complete, Additional Tasks Pending
