import { z } from 'zod';
import { router, protectedProcedure } from '../create-router';
import { TRPCError } from '@trpc/server';
import { db } from '@/db';
import {
  companies,
  companyMembers,
  sharedCompanyData,
  companyInviteLinks,
  companyClients,
  userProfilesTable,
} from '@/db/schema';
import { eq, and, desc, isNull } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export const companyRouter = router({
  // Get current user's company (as owner)
  getMyCompany: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    // First check if user owns a company
    const [company] = await db
      .select()
      .from(companies)
      .where(
        and(eq(companies.ownerPrivyDid, userId), isNull(companies.deletedAt)),
      )
      .limit(1);

    if (!company) return null;

    // Fetch shared data separately
    const sharedDataItems = await db
      .select()
      .from(sharedCompanyData)
      .where(eq(sharedCompanyData.companyId, company.id));

    return { ...company, sharedData: sharedDataItems };
  }),

  // Get all companies user is a member of
  getMyCompanies: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    // Get companies where user is a member (including as owner)
    const memberships = await db
      .select({
        company: companies,
        role: companyMembers.role,
      })
      .from(companyMembers)
      .innerJoin(companies, eq(companyMembers.companyId, companies.id))
      .where(
        and(
          eq(companyMembers.userPrivyDid, userId),
          isNull(companies.deletedAt), // Filter out deleted companies
        ),
      )
      .orderBy(companies.createdAt);

    // Deduplicate by company ID and return with role
    const companyMap = new Map();
    memberships.forEach((m) => {
      const existingEntry = companyMap.get(m.company.id);
      if (!existingEntry || m.role === 'owner') {
        // Prefer owner role if there are multiple memberships
        companyMap.set(m.company.id, { ...m.company, role: m.role });
      }
    });

    return Array.from(companyMap.values());
  }),

  // Get a specific company by ID
  getCompany: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // Check if user has access to this company
      const [company] = await db
        .select()
        .from(companies)
        .where(eq(companies.id, input.id))
        .limit(1);

      if (!company) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Company not found',
        });
      }

      // Check if user is owner or member
      const isOwner = company.ownerPrivyDid === userId;

      if (!isOwner) {
        const [membership] = await db
          .select()
          .from(companyMembers)
          .where(
            and(
              eq(companyMembers.companyId, input.id),
              eq(companyMembers.userPrivyDid, userId),
            ),
          )
          .limit(1);

        if (!membership) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have access to this company',
          });
        }
      }

      // Fetch shared data
      const sharedDataItems = await db
        .select()
        .from(sharedCompanyData)
        .where(eq(sharedCompanyData.companyId, company.id));

      return { ...company, sharedData: sharedDataItems };
    }),

  // Create a new company
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        address: z.string().optional(),
        city: z.string().optional(),
        postalCode: z.string().optional(),
        country: z.string().optional(),
        taxId: z.string().optional(),
        paymentAddress: z.string().optional(),
        preferredNetwork: z.string().optional(),
        preferredCurrency: z.string().optional(),
        settings: z
          .object({
            paymentTerms: z.string().optional(),
          })
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // Allow users to create multiple companies (they can be members of many)
      // Create the company
      const [company] = await db
        .insert(companies)
        .values({
          name: input.name,
          email: input.email,
          address: input.address,
          city: input.city,
          postalCode: input.postalCode,
          country: input.country,
          taxId: input.taxId,
          paymentAddress: input.paymentAddress,
          preferredNetwork: input.preferredNetwork || 'solana',
          preferredCurrency: input.preferredCurrency || 'USDC',
          ownerPrivyDid: userId,
          settings: input.settings || {},
        })
        .returning();

      // Add owner as a member
      await db.insert(companyMembers).values({
        companyId: company.id,
        userPrivyDid: userId,
        role: 'owner',
      });

      return company;
    }),

  // Update company
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1),
        email: z.string().email(),
        address: z.string().optional(),
        city: z.string().optional(),
        postalCode: z.string().optional(),
        country: z.string().optional(),
        taxId: z.string().optional(),
        paymentAddress: z.string().optional(),
        settings: z
          .object({
            paymentTerms: z.string().optional(),
          })
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // Verify ownership
      const [company] = await db
        .select()
        .from(companies)
        .where(
          and(
            eq(companies.id, input.id),
            eq(companies.ownerPrivyDid, userId),
            isNull(companies.deletedAt),
          ),
        )
        .limit(1);

      if (!company) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not own this company',
        });
      }

      // Update the company
      const [updated] = await db
        .update(companies)
        .set({
          name: input.name,
          email: input.email,
          address: input.address,
          city: input.city,
          postalCode: input.postalCode,
          country: input.country,
          taxId: input.taxId,
          paymentAddress: input.paymentAddress,
          settings: input.settings || {},
          updatedAt: new Date(),
        })
        .where(eq(companies.id, input.id))
        .returning();

      return updated;
    }),

  // Update shared data
  updateSharedData: protectedProcedure
    .input(
      z.object({
        companyId: z.string().uuid(),
        data: z.array(
          z.object({
            key: z.string(),
            value: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // Verify ownership
      const [company] = await db
        .select()
        .from(companies)
        .where(
          and(
            eq(companies.id, input.companyId),
            eq(companies.ownerPrivyDid, userId),
            isNull(companies.deletedAt),
          ),
        )
        .limit(1);

      if (!company) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not own this company',
        });
      }

      // Delete existing shared data
      await db
        .delete(sharedCompanyData)
        .where(eq(sharedCompanyData.companyId, input.companyId));

      // Insert new shared data
      if (input.data.length > 0) {
        await db.insert(sharedCompanyData).values(
          input.data.map((item) => ({
            companyId: input.companyId,
            dataKey: item.key,
            dataValue: item.value,
          })),
        );
      }

      return { success: true };
    }),

  // Create invite link
  createInviteLink: protectedProcedure
    .input(
      z.object({
        companyId: z.string().uuid(),
        metadata: z.record(z.string(), z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // Verify ownership
      const [company] = await db
        .select()
        .from(companies)
        .where(
          and(
            eq(companies.id, input.companyId),
            eq(companies.ownerPrivyDid, userId),
            isNull(companies.deletedAt),
          ),
        )
        .limit(1);

      if (!company) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not own this company',
        });
      }

      // Create invite link
      const [inviteLink] = await db
        .insert(companyInviteLinks)
        .values({
          companyId: input.companyId,
          token: nanoid(16),
          metadata: input.metadata || {},
        })
        .returning();

      return inviteLink;
    }),

  // Get invite links
  getInviteLinks: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    // Get user's company
    const [company] = await db
      .select()
      .from(companies)
      .where(
        and(eq(companies.ownerPrivyDid, userId), isNull(companies.deletedAt)),
      )
      .limit(1);

    if (!company) {
      return [];
    }

    // Get invite links
    const links = await db
      .select()
      .from(companyInviteLinks)
      .where(eq(companyInviteLinks.companyId, company.id))
      .orderBy(desc(companyInviteLinks.createdAt));

    return links;
  }),

  // Delete invite link
  deleteInviteLink: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // Get the invite link to verify ownership
      const [inviteLink] = await db
        .select({
          link: companyInviteLinks,
          company: companies,
        })
        .from(companyInviteLinks)
        .innerJoin(companies, eq(companyInviteLinks.companyId, companies.id))
        .where(eq(companyInviteLinks.id, input.id))
        .limit(1);

      if (!inviteLink || inviteLink.company.ownerPrivyDid !== userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You cannot delete this invite link',
        });
      }

      await db
        .delete(companyInviteLinks)
        .where(eq(companyInviteLinks.id, input.id));

      return { success: true };
    }),

  // Join company via invite link
  joinViaInvite: protectedProcedure
    .input(
      z.object({
        token: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // Find the invite link
      const [inviteLinkData] = await db
        .select({
          link: companyInviteLinks,
          company: companies,
        })
        .from(companyInviteLinks)
        .innerJoin(companies, eq(companyInviteLinks.companyId, companies.id))
        .where(eq(companyInviteLinks.token, input.token))
        .limit(1);

      if (!inviteLinkData) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Invalid invite link',
        });
      }

      // Check if already a member
      const [existingMember] = await db
        .select()
        .from(companyMembers)
        .where(
          and(
            eq(companyMembers.companyId, inviteLinkData.link.companyId),
            eq(companyMembers.userPrivyDid, userId),
          ),
        )
        .limit(1);

      if (existingMember) {
        return {
          success: true,
          message: 'You are already a member of this company',
          company: inviteLinkData.company,
        };
      }

      // Add as member
      await db.insert(companyMembers).values({
        companyId: inviteLinkData.link.companyId,
        userPrivyDid: userId,
        role: 'member',
      });

      // Increment usage count
      await db
        .update(companyInviteLinks)
        .set({
          usedCount: (inviteLinkData.link.usedCount || 0) + 1,
        })
        .where(eq(companyInviteLinks.id, inviteLinkData.link.id));

      return {
        success: true,
        message: 'Successfully joined company',
        company: inviteLinkData.company,
      };
    }),

  // Get company by invite token (public)
  getCompanyByInvite: protectedProcedure
    .input(
      z.object({
        token: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const [inviteLinkData] = await db
        .select({
          company: companies,
        })
        .from(companyInviteLinks)
        .innerJoin(companies, eq(companyInviteLinks.companyId, companies.id))
        .where(eq(companyInviteLinks.token, input.token))
        .limit(1);

      if (!inviteLinkData) {
        return null;
      }

      return inviteLinkData.company;
    }),

  // Get company members and invite statistics
  getCompanyMembers: protectedProcedure
    .input(
      z.object({
        companyId: z.string().uuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // Verify user has access to this company
      const [company] = await db
        .select()
        .from(companies)
        .where(eq(companies.id, input.companyId))
        .limit(1);

      if (!company) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Company not found',
        });
      }

      // Check if user is owner or member
      const isOwner = company.ownerPrivyDid === userId;

      if (!isOwner) {
        const [membership] = await db
          .select()
          .from(companyMembers)
          .where(
            and(
              eq(companyMembers.companyId, input.companyId),
              eq(companyMembers.userPrivyDid, userId),
            ),
          )
          .limit(1);

        if (!membership) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have access to this company',
          });
        }
      }

      // Get all members with their email addresses (including owner)
      const allMembers = await db
        .select({
          id: companyMembers.id,
          userPrivyDid: companyMembers.userPrivyDid,
          role: companyMembers.role,
          joinedAt: companyMembers.joinedAt,
          email: userProfilesTable.email,
          businessName: userProfilesTable.businessName,
        })
        .from(companyMembers)
        .leftJoin(
          userProfilesTable,
          eq(companyMembers.userPrivyDid, userProfilesTable.privyDid),
        )
        .where(eq(companyMembers.companyId, input.companyId))
        .orderBy(desc(companyMembers.joinedAt));

      // Get invite links with usage stats
      const inviteLinks = await db
        .select()
        .from(companyInviteLinks)
        .where(eq(companyInviteLinks.companyId, input.companyId))
        .orderBy(desc(companyInviteLinks.createdAt));

      return {
        members: allMembers,
        inviteLinks,
        stats: {
          totalMembers: allMembers.length,
          totalInvites: inviteLinks.length,
          totalInviteUses: inviteLinks.reduce(
            (sum, link) => sum + (link.usedCount || 0),
            0,
          ),
        },
      };
    }),

  // Remove company member
  removeMember: protectedProcedure
    .input(
      z.object({
        companyId: z.string().uuid(),
        memberId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // Verify ownership
      const [company] = await db
        .select()
        .from(companies)
        .where(
          and(
            eq(companies.id, input.companyId),
            eq(companies.ownerPrivyDid, userId),
            isNull(companies.deletedAt),
          ),
        )
        .limit(1);

      if (!company) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not own this company',
        });
      }

      // Remove member
      await db
        .delete(companyMembers)
        .where(eq(companyMembers.id, input.memberId));

      return { success: true };
    }),

  // Get client companies (companies used as recipients in invoices)
  getClientCompanies: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    const clients = await db
      .select({
        company: companies,
        clientRelation: companyClients,
      })
      .from(companyClients)
      .innerJoin(companies, eq(companyClients.clientCompanyId, companies.id))
      .where(eq(companyClients.userPrivyDid, userId))
      .orderBy(desc(companyClients.lastUsedAt));

    return clients.map((c) => ({
      ...c.company,
      lastUsedAt: c.clientRelation.lastUsedAt,
      notes: c.clientRelation.notes,
    }));
  }),

  // Get all companies (both owned/member and client companies)
  getAllCompanies: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    // Get companies where user is owner
    const ownedCompanies = await db
      .select()
      .from(companies)
      .where(
        and(eq(companies.ownerPrivyDid, userId), isNull(companies.deletedAt)),
      );

    // Get companies where user is a member
    const memberCompanies = await db
      .select({
        company: companies,
      })
      .from(companyMembers)
      .innerJoin(companies, eq(companyMembers.companyId, companies.id))
      .where(
        and(
          eq(companyMembers.userPrivyDid, userId),
          isNull(companies.deletedAt),
        ),
      );

    // Get client companies
    const clientCompanies = await db
      .select({
        company: companies,
        lastUsedAt: companyClients.lastUsedAt,
      })
      .from(companyClients)
      .innerJoin(companies, eq(companyClients.clientCompanyId, companies.id))
      .where(
        and(
          eq(companyClients.userPrivyDid, userId),
          isNull(companies.deletedAt),
        ),
      );

    // Combine all companies and remove duplicates
    const companyMap = new Map();

    // Add owned companies
    ownedCompanies.forEach((company) => {
      companyMap.set(company.id, {
        ...company,
        relationship: 'owner',
        lastUsedAt: null,
      });
    });

    // Add member companies
    memberCompanies.forEach(({ company }) => {
      if (!companyMap.has(company.id)) {
        companyMap.set(company.id, {
          ...company,
          relationship: 'member',
          lastUsedAt: null,
        });
      }
    });

    // Add client companies
    clientCompanies.forEach(({ company, lastUsedAt }) => {
      if (!companyMap.has(company.id)) {
        companyMap.set(company.id, {
          ...company,
          relationship: 'client',
          lastUsedAt,
        });
      } else {
        // Update lastUsedAt if this is also a client
        const existing = companyMap.get(company.id);
        if (lastUsedAt) {
          existing.lastUsedAt = lastUsedAt;
        }
      }
    });

    // Convert to array and sort by name
    const allCompanies = Array.from(companyMap.values()).sort((a, b) => {
      // Sort by lastUsedAt (most recent first), then by name
      if (a.lastUsedAt && b.lastUsedAt) {
        return (
          new Date(b.lastUsedAt).getTime() - new Date(a.lastUsedAt).getTime()
        );
      }
      if (a.lastUsedAt) return -1;
      if (b.lastUsedAt) return 1;
      return a.name.localeCompare(b.name);
    });

    return allCompanies;
  }),

  // Add or update a client company
  saveClientCompany: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        address: z.string().optional(),
        city: z.string().optional(),
        postalCode: z.string().optional(),
        country: z.string().optional(),
        taxId: z.string().optional(),
        paymentAddress: z.string().optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // Check if company already exists by email
      let [company] = await db
        .select()
        .from(companies)
        .where(eq(companies.email, input.email))
        .limit(1);

      // If company doesn't exist, create it
      if (!company) {
        [company] = await db
          .insert(companies)
          .values({
            name: input.name,
            email: input.email,
            address: input.address,
            city: input.city,
            postalCode: input.postalCode,
            country: input.country,
            taxId: input.taxId,
            paymentAddress: input.paymentAddress,
            ownerPrivyDid: userId, // User becomes owner of client company record
          })
          .returning();
      }

      // Check if client relationship exists
      const [existingRelation] = await db
        .select()
        .from(companyClients)
        .where(
          and(
            eq(companyClients.userPrivyDid, userId),
            eq(companyClients.clientCompanyId, company.id),
          ),
        )
        .limit(1);

      if (existingRelation) {
        // Update last used
        await db
          .update(companyClients)
          .set({
            lastUsedAt: new Date(),
            notes: input.notes || existingRelation.notes,
          })
          .where(eq(companyClients.id, existingRelation.id));
      } else {
        // Create new client relationship
        await db.insert(companyClients).values({
          userPrivyDid: userId,
          clientCompanyId: company.id,
          notes: input.notes,
          lastUsedAt: new Date(),
        });
      }

      return company;
    }),

  // Search companies by email
  searchByEmail: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .query(async ({ input }) => {
      const company = await db
        .select()
        .from(companies)
        .where(eq(companies.email, input.email))
        .limit(1);

      return company[0] || null;
    }),

  // Delete company (soft delete)
  deleteCompany: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // Verify ownership - only owner can delete
      const [company] = await db
        .select()
        .from(companies)
        .where(
          and(
            eq(companies.id, input.id),
            eq(companies.ownerPrivyDid, userId),
            isNull(companies.deletedAt), // Make sure it's not already deleted
          ),
        )
        .limit(1);

      if (!company) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not own this company or it has already been deleted',
        });
      }

      // Soft delete the company
      await db
        .update(companies)
        .set({ deletedAt: new Date() })
        .where(eq(companies.id, input.id));

      return { success: true };
    }),

  // Update company details (including payment info)
  updateCompany: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().optional(),
        email: z.string().email().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        postalCode: z.string().optional(),
        country: z.string().optional(),
        taxId: z.string().optional(),
        paymentAddress: z.string().optional(),
        preferredNetwork: z.string().optional(),
        preferredCurrency: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const { id, ...updateData } = input;

      // Check if user has permission (owner or member)
      const [company] = await db
        .select()
        .from(companies)
        .where(eq(companies.id, id))
        .limit(1);

      if (!company) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Company not found',
        });
      }

      const isOwner = company.ownerPrivyDid === userId;

      if (!isOwner) {
        const [membership] = await db
          .select()
          .from(companyMembers)
          .where(
            and(
              eq(companyMembers.companyId, id),
              eq(companyMembers.userPrivyDid, userId),
            ),
          )
          .limit(1);

        if (!membership) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to update this company',
          });
        }
      }

      const [updated] = await db
        .update(companies)
        .set(updateData)
        .where(eq(companies.id, id))
        .returning();

      return updated;
    }),
});
