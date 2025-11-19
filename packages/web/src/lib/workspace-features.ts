/**
 * Workspace Features Service
 *
 * Provides functions to check if workspaces have specific features enabled.
 * Features are controlled via the admin dashboard and stored in the database.
 */

import { db } from '@/db';
import { workspaceFeatures } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import type { WorkspaceFeatureName } from '@/db/schema/workspace-features';

/**
 * Check if a workspace has a specific feature enabled
 */
export async function hasWorkspaceFeature(
  workspaceId: string,
  featureName: WorkspaceFeatureName,
): Promise<boolean> {
  const feature = await db.query.workspaceFeatures.findFirst({
    where: and(
      eq(workspaceFeatures.workspaceId, workspaceId),
      eq(workspaceFeatures.featureName, featureName),
      eq(workspaceFeatures.isActive, true),
    ),
  });

  // Check if expired
  if (feature?.expiresAt && new Date(feature.expiresAt) < new Date()) {
    return false;
  }

  return !!feature;
}

/**
 * Check if a workspace has the multi-chain feature enabled
 */
export async function hasMultiChainFeature(
  workspaceId: string,
): Promise<boolean> {
  return hasWorkspaceFeature(workspaceId, 'multi_chain');
}

/**
 * Get all active features for a workspace
 */
export async function getWorkspaceFeatures(
  workspaceId: string,
): Promise<WorkspaceFeatureName[]> {
  const features = await db.query.workspaceFeatures.findMany({
    where: and(
      eq(workspaceFeatures.workspaceId, workspaceId),
      eq(workspaceFeatures.isActive, true),
    ),
  });

  // Filter out expired features
  const now = new Date();
  return features
    .filter((f) => !f.expiresAt || new Date(f.expiresAt) >= now)
    .map((f) => f.featureName);
}

/**
 * Check multiple features at once for a workspace
 * Returns a map of feature name to boolean
 */
export async function checkWorkspaceFeatures(
  workspaceId: string,
  featureNames: WorkspaceFeatureName[],
): Promise<Record<WorkspaceFeatureName, boolean>> {
  const features = await db.query.workspaceFeatures.findMany({
    where: and(
      eq(workspaceFeatures.workspaceId, workspaceId),
      eq(workspaceFeatures.isActive, true),
    ),
  });

  const now = new Date();
  const activeFeatures = new Set(
    features
      .filter((f) => !f.expiresAt || new Date(f.expiresAt) >= now)
      .map((f) => f.featureName),
  );

  return featureNames.reduce(
    (acc, name) => {
      acc[name] = activeFeatures.has(name);
      return acc;
    },
    {} as Record<WorkspaceFeatureName, boolean>,
  );
}
