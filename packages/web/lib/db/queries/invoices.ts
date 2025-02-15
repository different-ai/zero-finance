import { db } from '../index';
import { invoice, adminObligation } from '../schema';
import type { Invoice, AdminObligation } from '../schema';
import type { NewInvoice, NewAdminObligation } from '../schema';
import { eq, and, gte, desc } from 'drizzle-orm';

export async function storeInvoices(data: Array<{
  invoiceNumber: string;
  vendor: string;
  amount: string;
  invoiceDate: Date;
  dueDate: Date;
  userId: string;
}>) {
  try {
    const invoiceInputs: NewInvoice[] = data.map(inv => ({
      id: crypto.randomUUID(),
      invoiceNumber: inv.invoiceNumber,
      vendor: inv.vendor,
      amount: inv.amount,
      invoiceDate: inv.invoiceDate,
      dueDate: inv.dueDate,
      userId: inv.userId,
      createdAt: new Date(),
      source: `ocr_batch_${new Date().toISOString()}`
    }));

    await db.insert(invoice).values(invoiceInputs);
    console.log('Stored', data.length, 'invoice entries');
  } catch (error) {
    console.error('Failed to store invoices:', error);
    throw error;
  }
}

export async function storeAdminObligations(data: Array<{
  obligation: string;
  dueDate: Date;
  notes?: string | null;
  userId: string;
}>) {
  try {
    const adminInputs: NewAdminObligation[] = data.map(admin => ({
      id: crypto.randomUUID(),
      obligation: admin.obligation,
      dueDate: admin.dueDate,
      notes: admin.notes || null,
      userId: admin.userId,
      createdAt: new Date(),
      source: `ocr_batch_${new Date().toISOString()}`
    }));

    await db.insert(adminObligation).values(adminInputs);
    console.log('Stored', data.length, 'admin obligation entries');
  } catch (error) {
    console.error('Failed to store admin obligations:', error);
    throw error;
  }
}

export async function getRecentInvoices({
  userId,
  minutes = 15,
  limit = 5,
}: {
  userId: string;
  minutes?: number;
  limit?: number;
}) {
  try {
    const startTime = new Date(Date.now() - minutes * 60 * 1000);
    return await db
      .select()
      .from(invoice)
      .where(
        and(
          eq(invoice.userId, userId),
          gte(invoice.createdAt, startTime)
        )
      )
      .orderBy(desc(invoice.createdAt))
      .limit(limit);
  } catch (error) {
    console.error('Failed to get recent invoices:', error);
    throw error;
  }
}

export async function getRecentAdminObligations({
  userId,
  minutes = 60 * 24, // Last 24 hours by default
  limit = 100
}: {
  userId: string;
  minutes?: number;
  limit?: number;
}) {
  const startTime = new Date(Date.now() - minutes * 60 * 1000);
  
  return await db.select()
    .from(adminObligation)
    .where(and(
      eq(adminObligation.userId, userId),
      gte(adminObligation.createdAt, startTime)
    ))
    .limit(limit)
    .orderBy(desc(adminObligation.createdAt));
}
