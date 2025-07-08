# Mock Data - Complete Onboarding Demo Setup

## Overview
Created comprehensive mock data for demo setup that populates all onboarding requirements, funding sources, and enables full Pay action testing.

## Mock Data Created

### 1. User Data (Complete Onboarding)
- **KYC Status**: `approved` 
- **Align Customer ID**: `demo-align-customer-{timestamp}`
- **Virtual Account ID**: `demo-virtual-account-{timestamp}`
- **KYC Provider**: `align`
- **KYC Flow Link**: `https://demo.align.co/kyc-completed`
- **KYC Sub Status**: `kyc_form_submission_accepted`
- **KYC Marked Done**: `true`

### 2. Primary Safe
- **Safe Address**: `0xe51744895fA2c178044EAe9E7aFeC02D80ff1AB3`
- **Safe Type**: `primary`
- **Earn Module Enabled**: `true`

### 3. Funding Sources (3 Realistic Accounts)

#### USD ACH Account
- **Provider**: Align
- **Bank**: JPMorgan Chase Bank
- **Account**: ****1234
- **Routing**: 021000021
- **Currency**: USD → USDC (Base)

#### EUR IBAN Account  
- **Provider**: Align
- **Bank**: Deutsche Bank AG
- **IBAN**: DE89370400440532013000
- **BIC**: DEUTDEFF
- **Currency**: EUR → USDC (Base)

#### GBP UK Account
- **Provider**: Manual
- **Bank**: Barclays Bank UK PLC
- **Account**: ****5678
- **Sort Code**: 20-00-00
- **Currency**: GBP → USDC (Base)

### 4. Demo Inbox Cards
- **Acme Corp Invoice**: $2,500 (unpaid) - Perfect for testing Pay action
- **TechProducts Newsletter**: Marketing email for classification testing
- **AWS Bill**: $543.21 (auto-paid, in history)
- **Uber Receipt**: $18.50 (categorized, in history)

### 5. AI Classification Rules
- Sightglass Weekend Personal
- Auto-Schedule Vendor Payments  
- Filter Marketing Emails

## Impact on Onboarding Tasks Card

With this mock data, the OnboardingTasksCard will show:
- ✅ **Smart Account Created** (userSafes record exists)
- ✅ **Identity Verified** (kycStatus = 'approved')  
- ✅ **Virtual Bank Accounts Set Up** (alignVirtualAccountId exists)

The card will be hidden since all steps are completed, allowing users to focus on the Pay action testing.

## Pay Action Testing

The Acme Corp invoice ($2,500) can now be used to test the complete Pay flow:
1. User clicks "Pay" action in dropdown
2. PayInvoiceModal opens with pre-filled data
3. SimplifiedOffRamp shows all 3 funding sources
4. User can select funding source and complete payment flow

## Cleanup Required

**IMPORTANT**: This is mock data for demo purposes only. All funding sources, KYC status, and Align IDs are fake and must be removed before production deployment.

## Files Modified
- `packages/web/scripts/setup-interactive-demo.ts`

## Created Date
December 2024 