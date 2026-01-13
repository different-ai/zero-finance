import { db } from '@/db';
import { workspaces, type Workspace } from '@/db/schema';
import { eq } from 'drizzle-orm';

export type InsuranceStatus = 'sandbox' | 'pending' | 'active' | 'suspended';

export type YieldPolicy = {
  insuranceStatus: InsuranceStatus;
  hasCompletedKyc: boolean;
  canUseSandbox: boolean;
  canUseUninsured: boolean;
  canUseInsured: boolean;
};

export async function getWorkspaceYieldPolicy(
  workspaceId: string,
): Promise<YieldPolicy> {
  const workspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.id, workspaceId),
    columns: {
      insuranceStatus: true,
      kycStatus: true,
    },
  });

  if (!workspace) {
    throw new Error('Workspace not found');
  }

  const insuranceStatus = (workspace.insuranceStatus ||
    'sandbox') as InsuranceStatus;
  const hasCompletedKyc = workspace.kycStatus === 'approved';

  const canUseSandbox = insuranceStatus !== 'suspended';
  const canUseUninsured =
    insuranceStatus === 'pending' || insuranceStatus === 'active';
  const canUseInsured = insuranceStatus === 'active';

  return {
    insuranceStatus,
    hasCompletedKyc,
    canUseSandbox,
    canUseUninsured,
    canUseInsured,
  };
}

export function isVaultActionable(
  vault: { isInsured: boolean; sandboxOnly: boolean },
  policy: YieldPolicy,
): { allowed: boolean; reason?: string } {
  if (policy.insuranceStatus === 'suspended') {
    return { allowed: false, reason: 'Insurance status suspended.' };
  }

  if (vault.sandboxOnly) {
    return policy.canUseSandbox
      ? { allowed: true }
      : { allowed: false, reason: 'Sandbox access disabled.' };
  }

  if (policy.insuranceStatus === 'sandbox') {
    return { allowed: false, reason: 'Sandbox-only access is enabled.' };
  }

  if (!policy.hasCompletedKyc) {
    return { allowed: false, reason: 'KYC not completed.' };
  }

  if (vault.isInsured) {
    return policy.canUseInsured
      ? { allowed: true }
      : { allowed: false, reason: 'Insured vault access not active.' };
  }

  return policy.canUseUninsured
    ? { allowed: true }
    : { allowed: false, reason: 'Uninsured vault access not active.' };
}
