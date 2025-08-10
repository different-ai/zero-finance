# Multi-Vault Savings Testing Checklist

## Database Migration
- [ ] Run migration: `npm run db:migrate`
- [ ] Verify `auto_vault_address` column added to `auto_earn_configs` table
- [ ] Check existing configs default to Seamless vault address

## Unit Tests

### Vault View Model
- [ ] Correctly maps vault data when some stats are missing
- [ ] Handles zero balances gracefully
- [ ] APY calculation converts from decimal to percentage correctly
- [ ] Earned USD calculation is accurate with mixed deposits/withdrawals

### Auto-Vault Selection
- [ ] Selection persists to database
- [ ] Only allows valid Base vault addresses
- [ ] Creates config if doesn't exist
- [ ] Updates existing config if present

## Integration Tests

### Multi-Vault Display
- [ ] All 3 vaults display with correct names and risk levels
- [ ] APY shows for each vault (or 0% if unavailable)
- [ ] Balance shows current USD value
- [ ] Earned shows lifetime earnings

### Auto-Savings Selection
- [ ] Click "Use for auto" → vault becomes selected
- [ ] Selected vault shows "Selected for auto" badge
- [ ] Refresh page → selection persists
- [ ] Only one vault can be selected at a time

### Deposit/Withdraw Routing
- [ ] Click Deposit on Vault A → deposit modal targets Vault A
- [ ] Click Withdraw on Vault B → withdraw modal targets Vault B
- [ ] Hash routing works: `#deposit-0x...` and `#withdraw-0x...`
- [ ] Deposit to Vault A doesn't affect Vault B balance
- [ ] Withdraw from Vault B doesn't affect Vault A balance

## E2E Tests

### Auto-Earn Flow
- [ ] Enable auto-earn at 20%
- [ ] Select Gauntlet Core as auto-vault
- [ ] Receive incoming deposit of $100
- [ ] Verify $20 goes to Gauntlet Core vault
- [ ] Change auto-vault to Steakhouse
- [ ] Next deposit goes to Steakhouse vault

### Live Updates
- [ ] Balances update every 10 seconds
- [ ] APY updates reflect current rates
- [ ] Deposit success → balances update within 3 seconds
- [ ] Withdraw success → balances update within 3 seconds

## Edge Cases

### Error Handling
- [ ] GraphQL API failure → shows 0% APY, doesn't crash
- [ ] Missing vault stats → shows 0 balance/earned
- [ ] Invalid vault address in DB → falls back to Seamless
- [ ] Network errors → shows last cached data

### Backwards Compatibility
- [ ] Users with existing Seamless deposits see correct balance
- [ ] Old auto-earn configs (no vault set) default to Seamless
- [ ] Single vault stats endpoint still works
- [ ] Existing deposit/withdraw flows unaffected

## Performance

### Loading States
- [ ] Initial page load shows spinner
- [ ] Vault cards load progressively
- [ ] Mutations show loading state on buttons

### Caching
- [ ] 10-second cache for vault positions
- [ ] Stats refresh on deposit/withdraw
- [ ] No unnecessary re-fetches

## UI/UX

### Visual Design
- [ ] Base logo displays correctly
- [ ] "All vaults on Base network" badge visible
- [ ] Vault cards responsive on mobile
- [ ] Auto-savings badge clearly visible
- [ ] Risk levels color-coded appropriately

### User Flows
- [ ] New user can enable savings and select vault
- [ ] Existing user sees their current vault selected
- [ ] Details link opens Morpho vault page
- [ ] Quick Actions still work with selected auto-vault

## Security

### Validation
- [ ] Only Base USDC vaults accepted
- [ ] Safe ownership verified for all operations
- [ ] Vault addresses validated as checksummed addresses
- [ ] Percentage constraints (1-100) enforced

## Monitoring

### Logging
- [ ] Vault fetch errors logged
- [ ] Auto-vault selection changes tracked
- [ ] Per-vault deposit/withdraw success logged
- [ ] GraphQL failures captured

## Manual QA Script

1. **Fresh User Setup**
   - Create new safe
   - Enable auto-earn
   - Select Steakhouse vault
   - Verify selection saved

2. **Existing User Migration**
   - User with Seamless deposits
   - Page loads showing Seamless as auto-vault
   - Can change to different vault
   - Old deposits still visible

3. **Multi-Vault Operations**
   - Deposit $100 to Seamless
   - Deposit $200 to Gauntlet Core
   - Withdraw $50 from Seamless
   - Verify balances correct for each

4. **Auto-Earn Trigger**
   - Set 30% auto-earn
   - Select Steakhouse as auto-vault
   - Simulate incoming deposit
   - Verify 30% goes to Steakhouse

## Rollback Plan

If issues arise:
1. Revert frontend changes
2. Keep DB migration (nullable column is safe)
3. TRPC endpoints backward compatible
4. Users continue with single vault (Seamless)