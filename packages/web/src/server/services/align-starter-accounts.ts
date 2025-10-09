import { alignApi } from './align-api';
import { db } from '@/db';
import { userFundingSources } from '@/db/schema';

/**
 * Creates starter virtual accounts for new users using the company's pre-approved KYB
 * These accounts allow users to deposit up to $10k immediately without completing their own KYB
 *
 * @param params User and workspace information
 * @returns Created virtual accounts (USD + EUR) or null if disabled
 */
export async function createStarterVirtualAccounts(params: {
  userId: string;
  workspaceId: string;
  destinationAddress: string;
}) {
  const companyCustomerId = process.env.ALIGN_COMPANY_CUSTOMER_ID;
  const featureEnabled = true;

  if (!featureEnabled) {
    console.log(
      '[Starter Accounts] Feature disabled via ENABLE_STARTER_ACCOUNTS',
    );
    return null;
  }

  if (!companyCustomerId) {
    console.warn(
      '[Starter Accounts] Company customer ID not configured - skipping starter account creation',
    );
    return null;
  }

  console.log(
    '[Starter Accounts] Creating for user:',
    params.userId,
    'workspace:',
    params.workspaceId,
  );

  try {
    // Create USD (ACH) starter account
    const usdAccount = await alignApi.createVirtualAccount(companyCustomerId, {
      source_currency: 'usd',
      destination_token: 'usdc',
      destination_network: 'base',
      destination_address: params.destinationAddress,
    });

    // Store USD account in database
    await db.insert(userFundingSources).values({
      userPrivyDid: params.userId,
      workspaceId: params.workspaceId,
      sourceProvider: 'align',
      accountTier: 'starter',
      ownerAlignCustomerId: companyCustomerId,
      alignVirtualAccountIdRef: usdAccount.id,

      sourceAccountType: 'us_ach',
      sourceCurrency: 'usd',
      sourceBankName: usdAccount.deposit_instructions.bank_name,
      sourceBankAddress: usdAccount.deposit_instructions.bank_address,
      sourceBankBeneficiaryName:
        usdAccount.deposit_instructions.beneficiary_name ||
        usdAccount.deposit_instructions.account_beneficiary_name,
      sourceBankBeneficiaryAddress:
        usdAccount.deposit_instructions.beneficiary_address ||
        usdAccount.deposit_instructions.account_beneficiary_address,
      sourceAccountNumber:
        usdAccount.deposit_instructions.us?.account_number ||
        usdAccount.deposit_instructions.account_number,
      sourceRoutingNumber:
        usdAccount.deposit_instructions.us?.routing_number ||
        usdAccount.deposit_instructions.routing_number,
      sourcePaymentRails: usdAccount.deposit_instructions.payment_rails,

      destinationCurrency: 'usdc',
      destinationPaymentRail: 'base',
      destinationAddress: params.destinationAddress,
    });

    console.log('[Starter Accounts] USD account created:', usdAccount.id);

    // Create EUR (IBAN) starter account
    const eurAccount = await alignApi.createVirtualAccount(companyCustomerId, {
      source_currency: 'eur',
      destination_token: 'usdc',
      destination_network: 'base',
      destination_address: params.destinationAddress,
    });

    // Store EUR account in database
    await db.insert(userFundingSources).values({
      userPrivyDid: params.userId,
      workspaceId: params.workspaceId,
      sourceProvider: 'align',
      accountTier: 'starter',
      ownerAlignCustomerId: companyCustomerId,
      alignVirtualAccountIdRef: eurAccount.id,

      sourceAccountType: 'iban',
      sourceCurrency: 'eur',
      sourceBankName: eurAccount.deposit_instructions.bank_name,
      sourceBankAddress: eurAccount.deposit_instructions.bank_address,
      sourceBankBeneficiaryName:
        eurAccount.deposit_instructions.beneficiary_name ||
        eurAccount.deposit_instructions.account_beneficiary_name,
      sourceBankBeneficiaryAddress:
        eurAccount.deposit_instructions.beneficiary_address ||
        eurAccount.deposit_instructions.account_beneficiary_address,
      sourceIban: eurAccount.deposit_instructions.iban?.iban_number,
      sourceBicSwift:
        eurAccount.deposit_instructions.iban?.bic ||
        eurAccount.deposit_instructions.bic?.bic_code,
      sourcePaymentRails: eurAccount.deposit_instructions.payment_rails,

      destinationCurrency: 'usdc',
      destinationPaymentRail: 'base',
      destinationAddress: params.destinationAddress,
    });

    console.log('[Starter Accounts] EUR account created:', eurAccount.id);

    return {
      usdAccount,
      eurAccount,
    };
  } catch (error) {
    console.error('[Starter Accounts] Failed to create:', error);
    // Don't throw - we don't want starter account creation to block user signup
    return null;
  }
}
