import { db } from '@/db';
import { actionLedger, inboxCards } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

export interface ScheduledPayment {
  id: string;
  cardId: string;
  userId: string;
  amount: string;
  currency: string;
  recipientName: string;
  scheduledFor: Date;
  status: 'scheduled' | 'executed' | 'cancelled' | 'failed';
  paymentMethod: 'ach' | 'wire' | 'crypto' | 'card';
  createdAt: Date;
  executedAt?: Date;
  cancellationReason?: string;
  transactionHash?: string;
}

export class PaymentExecutionService {
  /**
   * Schedule a payment based on classification rule results
   */
  static async schedulePayment(params: {
    cardId: string;
    userId: string;
    amount: string;
    currency: string;
    recipientName: string;
    delayBusinessDays: number;
    paymentMethod?: 'ach' | 'wire' | 'crypto' | 'card';
    reason: string;
  }): Promise<ScheduledPayment> {
    
    const { cardId, userId, amount, currency, recipientName, delayBusinessDays, paymentMethod = 'ach', reason } = params;
    
    // Calculate scheduled date (skip weekends)
    const scheduledFor = this.addBusinessDays(new Date(), delayBusinessDays);
    
    const paymentId = `payment_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    // For demo purposes, we'll store this in the action ledger with special metadata
    // In production, this would go to a dedicated payments table
    const scheduledPayment: ScheduledPayment = {
      id: paymentId,
      cardId,
      userId,
      amount,
      currency,
      recipientName,
      scheduledFor,
      status: 'scheduled',
      paymentMethod,
      createdAt: new Date(),
    };
    
    // Log the scheduled payment in action ledger
    await db.insert(actionLedger).values({
      approvedBy: userId,
      inboxCardId: cardId,
      actionType: 'payment_scheduled',
      actionTitle: `Payment Scheduled: ${recipientName}`,
      actionSubtitle: `${currency} ${amount} - scheduled for ${scheduledFor.toLocaleDateString()}`,
      sourceType: 'ai_classification',
      amount,
      currency,
      status: 'approved',
      originalCardData: {}, // Required field - empty object for payment actions
      executionDetails: {
        paymentId,
        scheduledFor: scheduledFor.toISOString(),
        paymentMethod,
        delayBusinessDays,
        canCancel: true,
        autoExecute: true,
      },
      metadata: {
        paymentData: scheduledPayment,
        reason,
        demoPayment: true, // Mark as demo for safety
      },
      note: `Auto-scheduled via AI classification rule. Payment can be cancelled until ${scheduledFor.toLocaleDateString()}.`,
    });
    
    // Update the card status to show payment is scheduled
    await db.update(inboxCards)
      .set({
        status: 'auto',
        paymentStatus: 'scheduled' as any, // Add 'scheduled' to the enum if needed
        updatedAt: new Date(),
      })
      .where(and(
        eq(inboxCards.cardId, cardId),
        eq(inboxCards.userId, userId)
      ));
    
    console.log(`[PaymentExecution] Scheduled payment ${paymentId} for ${amount} ${currency} to ${recipientName}`);
    
    return scheduledPayment;
  }
  
  /**
   * Cancel a scheduled payment
   */
  static async cancelPayment(params: {
    paymentId: string;
    userId: string;
    reason: string;
  }): Promise<void> {
    const { paymentId, userId, reason } = params;
    
    // Find the payment in action ledger
    const paymentAction = await db.query.actionLedger.findFirst({
      where: and(
        eq(actionLedger.approvedBy, userId),
        eq(actionLedger.actionType, 'payment_scheduled')
      ),
    });
    
    if (!paymentAction || !paymentAction.metadata) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Payment not found' });
    }
    
    const paymentData = (paymentAction.metadata as any).paymentData as ScheduledPayment;
    
    if (paymentData.id !== paymentId) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Payment not found' });
    }
    
    if (paymentData.status !== 'scheduled') {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Payment cannot be cancelled' });
    }
    
    // Log the cancellation
    await db.insert(actionLedger).values({
      approvedBy: userId,
      inboxCardId: paymentAction.inboxCardId,
      actionType: 'payment_cancelled',
      actionTitle: `Payment Cancelled: ${paymentData.recipientName}`,
      actionSubtitle: `${paymentData.currency} ${paymentData.amount} - cancelled by user`,
      sourceType: 'user_action',
      amount: paymentData.amount,
      currency: paymentData.currency,
      status: 'executed',
      executedAt: new Date(),
      originalCardData: {}, // Required field
      metadata: {
        originalPaymentId: paymentId,
        cancellationReason: reason,
        demoPayment: true,
      },
      note: reason,
    });
    
    // Update the card status
    await db.update(inboxCards)
      .set({
        status: 'seen',
        paymentStatus: 'unpaid',
        updatedAt: new Date(),
      })
      .where(eq(inboxCards.cardId, paymentData.cardId));
    
    console.log(`[PaymentExecution] Cancelled payment ${paymentId}: ${reason}`);
  }
  
  /**
   * Execute a scheduled payment (this would be called by a cron job)
   */
  static async executeScheduledPayment(paymentId: string): Promise<void> {
    // For demo purposes, this just logs the execution
    // In production, this would integrate with your payment processor
    
    console.log(`[PaymentExecution] DEMO: Executing payment ${paymentId}`);
    
    // Log the execution
    const demoTxHash = `0x${Math.random().toString(16).substring(2, 66)}`;
    
    // In a real implementation, you'd:
    // 1. Call your payment processor API
    // 2. Handle the response
    // 3. Update the payment status
    // 4. Log the result
    
    console.log(`[PaymentExecution] DEMO: Payment executed with hash ${demoTxHash}`);
  }
  
  /**
   * Add business days to a date (skip weekends)
   */
  private static addBusinessDays(date: Date, businessDays: number): Date {
    const result = new Date(date);
    let addedDays = 0;
    
    while (addedDays < businessDays) {
      result.setDate(result.getDate() + 1);
      
      // Skip weekends (Saturday = 6, Sunday = 0)
      if (result.getDay() !== 0 && result.getDay() !== 6) {
        addedDays++;
      }
    }
    
    return result;
  }
  
  /**
   * Get all scheduled payments for a user
   */
  static async getScheduledPayments(userId: string): Promise<ScheduledPayment[]> {
    const paymentActions = await db.query.actionLedger.findMany({
      where: and(
        eq(actionLedger.approvedBy, userId),
        eq(actionLedger.actionType, 'payment_scheduled')
      ),
    });
    
    return paymentActions
      .map(action => (action.metadata as any)?.paymentData)
      .filter(Boolean) as ScheduledPayment[];
  }
} 