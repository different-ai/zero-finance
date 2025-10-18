import { randomUUID } from 'crypto';
import {
  users,
  workspaces,
  workspaceMembers,
  type WorkspaceMember,
} from '@/db/schema';
import { eq, and, ne, desc } from 'drizzle-orm';

// Drizzle types for db/transaction are quite involved; use a minimal surface instead.
type DatabaseExecutor = any;

type EnsureWorkspaceResult = {
  workspaceId: string;
  membership: WorkspaceMember;
};

export function withWorkspaceId<T extends { workspaceId?: string | null }>(
  record: T,
  workspaceId: string,
): T {
  return {
    ...record,
    workspaceId,
  };
}

export function withWorkspaceIdArray<T extends { workspaceId?: string | null }>(
  records: T[],
  workspaceId: string,
): T[] {
  return records.map((record) => withWorkspaceId(record, workspaceId));
}

function buildWorkspaceName(user: typeof users.$inferSelect): string {
  const parts = [user.companyName, user.firstName, user.lastName].filter(
    (part) => part && part.trim().length > 0,
  );

  if (parts.length > 0) {
    const name = parts.join(' ').trim();
    if (name.length > 0) {
      return name;
    }
  }

  return `Workspace ${user.privyDid.slice(0, 8)}`;
}

async function upsertPrimaryMembership(
  tx: DatabaseExecutor,
  userId: string,
  workspaceId: string,
): Promise<WorkspaceMember> {
  const membershipRows = await tx
    .select()
    .from(workspaceMembers)
    .where(
      and(
        eq(workspaceMembers.userId, userId),
        eq(workspaceMembers.workspaceId, workspaceId),
      ),
    )
    .limit(1);

  let membership = membershipRows[0];

  if (!membership) {
    const inserted = await tx
      .insert(workspaceMembers)
      .values({
        id: randomUUID(),
        workspaceId,
        userId,
        role: 'owner',
        isPrimary: true,
      })
      .onConflictDoNothing({
        target: [workspaceMembers.workspaceId, workspaceMembers.userId],
      })
      .returning();

    if (!membership) {
      const fallbackRows = await tx
        .select()
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.userId, userId),
            eq(workspaceMembers.workspaceId, workspaceId),
          ),
        )
        .limit(1);

      membership = fallbackRows[0];
    }
  }

  if (!membership) {
    throw new Error('Failed to upsert workspace membership');
  }

  if (!membership.isPrimary) {
    await tx
      .update(workspaceMembers)
      .set({ isPrimary: false })
      .where(
        and(
          eq(workspaceMembers.userId, userId),
          ne(workspaceMembers.id, membership.id),
        ),
      );

    const updated = await tx
      .update(workspaceMembers)
      .set({ isPrimary: true })
      .where(eq(workspaceMembers.id, membership.id))
      .returning();

    membership = updated[0] ?? membership;
  } else {
    await tx
      .update(workspaceMembers)
      .set({ isPrimary: false })
      .where(
        and(
          eq(workspaceMembers.userId, userId),
          ne(workspaceMembers.id, membership.id),
        ),
      );
  }

  return membership;
}

async function resolveWorkspaceId(
  tx: DatabaseExecutor,
  user: typeof users.$inferSelect,
): Promise<string> {
  if (user.primaryWorkspaceId) {
    return user.primaryWorkspaceId;
  }

  const existingMembershipRows = await tx
    .select()
    .from(workspaceMembers)
    .where(eq(workspaceMembers.userId, user.privyDid))
    .orderBy(desc(workspaceMembers.isPrimary), desc(workspaceMembers.joinedAt))
    .limit(1);

  const existingMembership = existingMembershipRows[0];

  if (existingMembership) {
    return existingMembership.workspaceId;
  }

  const [workspace] = await tx
    .insert(workspaces)
    .values({
      id: randomUUID(),
      name: buildWorkspaceName(user),
      createdBy: user.privyDid,
    })
    .returning();

  if (!workspace) {
    throw new Error('Failed to create workspace for user');
  }

  return workspace.id;
}

export async function ensureUserWorkspace(
  dbExecutor: DatabaseExecutor,
  userId: string,
): Promise<EnsureWorkspaceResult> {
  return dbExecutor.transaction(async (tx: DatabaseExecutor) => {
    const userRows = await tx
      .select()
      .from(users)
      .where(eq(users.privyDid, userId))
      .limit(1);

    let user = userRows[0];

    if (!user) {
      const existingMembershipRows = await tx
        .select()
        .from(workspaceMembers)
        .where(eq(workspaceMembers.userId, userId))
        .orderBy(
          desc(workspaceMembers.isPrimary),
          desc(workspaceMembers.joinedAt),
        )
        .limit(1);

      const existingMembership = existingMembershipRows[0];
      let primaryWorkspaceId: string;

      if (existingMembership) {
        const workspaceRows = await tx
          .select()
          .from(workspaces)
          .where(eq(workspaces.id, existingMembership.workspaceId))
          .limit(1);

        if (workspaceRows.length > 0) {
          primaryWorkspaceId = existingMembership.workspaceId;

          const inserted = await tx
            .insert(users)
            .values({ privyDid: userId, primaryWorkspaceId })
            .onConflictDoNothing()
            .returning();

          if (inserted.length === 0) {
            const existing = await tx
              .select()
              .from(users)
              .where(eq(users.privyDid, userId))
              .limit(1);
            user = existing[0];
          } else {
            user = inserted[0];
          }
        } else {
          console.warn(
            `[ensureUserWorkspace] Orphaned workspace membership detected for user ${userId}, ` +
              `workspace ${existingMembership.workspaceId} does not exist. Creating new workspace.`,
          );

          await tx
            .delete(workspaceMembers)
            .where(eq(workspaceMembers.id, existingMembership.id));

          const tempWorkspaceId = randomUUID();

          const insertedUsers = await tx
            .insert(users)
            .values({ privyDid: userId, primaryWorkspaceId: tempWorkspaceId })
            .onConflictDoNothing()
            .returning();

          if (insertedUsers.length === 0) {
            const existing = await tx
              .select()
              .from(users)
              .where(eq(users.privyDid, userId))
              .limit(1);
            user = existing[0];
          } else {
            const [workspace] = await tx
              .insert(workspaces)
              .values({
                id: tempWorkspaceId,
                name: `${userId.slice(0, 8)}'s Workspace`,
                createdBy: userId,
              })
              .returning();

            if (!workspace) {
              throw new Error('Failed to create workspace for user');
            }

            user = insertedUsers[0];
          }
        }
      } else {
        const tempWorkspaceId = randomUUID();

        const insertedUsers = await tx
          .insert(users)
          .values({ privyDid: userId, primaryWorkspaceId: tempWorkspaceId })
          .onConflictDoNothing()
          .returning();

        if (insertedUsers.length === 0) {
          const existing = await tx
            .select()
            .from(users)
            .where(eq(users.privyDid, userId))
            .limit(1);
          user = existing[0];
        } else {
          const [workspace] = await tx
            .insert(workspaces)
            .values({
              id: tempWorkspaceId,
              name: `${userId.slice(0, 8)}'s Workspace`,
              createdBy: userId,
            })
            .returning();

          if (!workspace) {
            throw new Error('Failed to create workspace for user');
          }

          user = insertedUsers[0];
        }
      }
    }

    if (!user) {
      throw new Error(`Failed to ensure user record for ${userId}`);
    }

    const workspaceId = await resolveWorkspaceId(tx, user);
    const membership = await upsertPrimaryMembership(
      tx,
      user.privyDid,
      workspaceId,
    );

    if (user.primaryWorkspaceId !== workspaceId) {
      await tx
        .update(users)
        .set({ primaryWorkspaceId: workspaceId })
        .where(eq(users.privyDid, user.privyDid));
    }

    return {
      workspaceId,
      membership,
    };
  });
}

export async function getUserWorkspaceId(
  dbExecutor: DatabaseExecutor,
  userId: string,
): Promise<string | null> {
  const userRows = await dbExecutor
    .select({
      primaryWorkspaceId: users.primaryWorkspaceId,
    })
    .from(users)
    .where(eq(users.privyDid, userId))
    .limit(1);

  const user = userRows[0];

  return user?.primaryWorkspaceId ?? null;
}
