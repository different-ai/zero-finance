'use server';

import { db } from '@/db';
import { apiWaitlist } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function joinApiWaitlist(data: {
  email?: string;
  companyName?: string;
  useCase?: string;
  privyDid?: string;
  userId?: string;
}): Promise<{ success: boolean; message?: string }> {
  try {
    // Validate required fields
    if (!data.email && !data.privyDid) {
      return {
        success: false,
        message: 'Email or authentication required',
      };
    }

    if (!data.companyName) {
      return {
        success: false,
        message: 'Company name is required',
      };
    }

    // Check if email or privyDid already exists
    if (data.email) {
      const existing = await db.query.apiWaitlist.findFirst({
        where: eq(apiWaitlist.email, data.email),
      });

      if (existing) {
        return {
          success: false,
          message: 'This email is already on the waitlist',
        };
      }
    }

    if (data.privyDid) {
      const existing = await db.query.apiWaitlist.findFirst({
        where: eq(apiWaitlist.privyDid, data.privyDid),
      });

      if (existing) {
        return {
          success: false,
          message: 'You are already on the waitlist',
        };
      }
    }

    // Insert into waitlist
    await db.insert(apiWaitlist).values({
      email: data.email,
      companyName: data.companyName,
      useCase: data.useCase || null,
      privyDid: data.privyDid || null,
      userId: data.userId || null,
      status: 'pending',
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error joining API waitlist:', error);
    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  }
}
