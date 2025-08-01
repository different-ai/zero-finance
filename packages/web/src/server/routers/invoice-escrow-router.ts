import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../create-router';
import { TRPCError } from '@trpc/server';
import { db } from '@/db';
import { 
  userRequestsTable, 
  NewUserRequest,
  type InvoiceStatus,
  escrowInvoicesTable,
  NewEscrowInvoice
} from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { parseEther, formatEther, createPublicClient, http, createWalletClient } from 'viem';
import { base } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { userProfileService } from '@/lib/user-profile-service';

// Simple escrow contract ABI (you'll need to deploy this contract)
const ESCROW_CONTRACT_ABI = [
  {
    inputs: [
      { name: 'invoiceId', type: 'bytes32' },
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'lockFunds',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      { name: 'invoiceId', type: 'bytes32' }
    ],
    name: 'releaseFunds',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { name: 'invoiceId', type: 'bytes32' }
    ],
    name: 'cancelAndRefund',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { name: 'user', type: 'address' }
    ],
    name: 'getLockedBalance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
];

// You'll need to deploy this contract and add the address here
const ESCROW_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000'; // TODO: Deploy and update

const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

export const invoiceEscrowRouter = router({
  // Get escrow balance information
  getEscrowBalance: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.user.id;
      
      try {
        // Get user's wallet
        const userWallet = await userProfileService.getOrCreateWallet(userId);
        if (!userWallet?.address) {
          throw new TRPCError({ 
            code: 'INTERNAL_SERVER_ERROR', 
            message: 'User wallet not found' 
          });
        }

        // Get wallet balance
        const walletBalance = await publicClient.getBalance({
          address: userWallet.address as `0x${string}`,
        });

        // Get locked balance from escrow contract
        // Note: This would require the escrow contract to be deployed
        let lockedBalance = BigInt(0);
        let totalReleased = BigInt(0);
        
        // For demo purposes, calculate from database
        const escrowInvoices = await db
          .select()
          .from(escrowInvoicesTable)
          .where(eq(escrowInvoicesTable.userId, userId));
        
        for (const invoice of escrowInvoices) {
          if (invoice.status === 'locked') {
            lockedBalance += BigInt(invoice.amount);
          } else if (invoice.status === 'sent' || invoice.status === 'paid') {
            totalReleased += BigInt(invoice.amount);
          }
        }

        return {
          walletBalance: walletBalance.toString(),
          lockedBalance: lockedBalance.toString(),
          totalReleased: totalReleased.toString(),
        };
      } catch (error) {
        console.error('Failed to get escrow balance:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch escrow balance',
        });
      }
    }),

  // Create a new escrow invoice
  createEscrowInvoice: protectedProcedure
    .input(z.object({
      recipientEmail: z.string().email(),
      recipientName: z.string(),
      amount: z.string(), // Wei amount as string
      currency: z.enum(['ETH', 'USDC']),
      description: z.string(),
      dueDate: z.string(),
      invoiceNumber: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.user.id;
      const userEmail = ctx.user.email?.address;

      if (!userEmail) {
        throw new TRPCError({ 
          code: 'BAD_REQUEST', 
          message: 'User email is required.' 
        });
      }

      try {
        // Get user profile and wallet
        const [userProfile, userWallet] = await Promise.all([
          userProfileService.getOrCreateProfile(userId, userEmail),
          userProfileService.getOrCreateWallet(userId)
        ]);

        if (!userWallet?.privateKey) {
          throw new TRPCError({ 
            code: 'INTERNAL_SERVER_ERROR', 
            message: 'User wallet not configured' 
          });
        }

        // Create invoice record
        const invoiceId = crypto.randomUUID();
        const newInvoice: NewEscrowInvoice = {
          id: invoiceId,
          userId: userId,
          invoiceNumber: input.invoiceNumber,
          senderName: userProfile.businessName || userEmail,
          senderEmail: userEmail,
          recipientName: input.recipientName,
          recipientEmail: input.recipientEmail,
          amount: BigInt(input.amount),
          currency: input.currency,
          description: input.description,
          status: 'locked',
          dueDate: new Date(input.dueDate),
          shareableLink: `${process.env.NEXT_PUBLIC_APP_URL}/invoice-escrow/${invoiceId}`,
          escrowTxHash: '', // Will be updated after blockchain transaction
        };

        // In a real implementation, you would:
        // 1. Create a wallet client
        // 2. Lock funds in the escrow contract
        // 3. Update the invoice with the transaction hash
        
        // For demo purposes, we'll simulate this:
        const account = privateKeyToAccount(userWallet.privateKey as `0x${string}`);
        const walletClient = createWalletClient({
          account,
          chain: base,
          transport: http(),
        });

        // Simulate locking funds (in production, this would be a real transaction)
        // const txHash = await walletClient.writeContract({
        //   address: ESCROW_CONTRACT_ADDRESS,
        //   abi: ESCROW_CONTRACT_ABI,
        //   functionName: 'lockFunds',
        //   args: [invoiceId, input.recipientEmail, BigInt(input.amount)],
        //   value: BigInt(input.amount), // For ETH
        // });

        // For demo, generate a mock tx hash
        const mockTxHash = `0x${crypto.randomUUID().replace(/-/g, '')}`;
        newInvoice.escrowTxHash = mockTxHash;

        // Save to database
        await db.insert(escrowInvoicesTable).values(newInvoice);

        return {
          success: true,
          invoiceId: invoiceId,
          invoiceNumber: input.invoiceNumber,
          shareableLink: newInvoice.shareableLink,
          escrowTxHash: mockTxHash,
        };

      } catch (error) {
        console.error('Error creating escrow invoice:', error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({ 
          code: 'INTERNAL_SERVER_ERROR', 
          message: 'Failed to create escrow invoice.', 
          cause: error 
        });
      }
    }),

  // List user's escrow invoices
  listEscrowInvoices: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.user.id;

      try {
        const invoices = await db
          .select()
          .from(escrowInvoicesTable)
          .where(eq(escrowInvoicesTable.userId, userId))
          .orderBy(desc(escrowInvoicesTable.createdAt));

        return invoices.map(invoice => ({
          ...invoice,
          amount: invoice.amount.toString(), // Convert bigint to string for serialization
        }));
      } catch (error) {
        console.error('Failed to fetch escrow invoices:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch invoices',
        });
      }
    }),

  // Get public invoice details
  getPublicInvoice: publicProcedure
    .input(z.object({ 
      invoiceId: z.string() 
    }))
    .query(async ({ input }) => {
      try {
        const invoice = await db
          .select()
          .from(escrowInvoicesTable)
          .where(eq(escrowInvoicesTable.id, input.invoiceId))
          .limit(1);

        if (!invoice || invoice.length === 0) {
          throw new TRPCError({ 
            code: 'NOT_FOUND', 
            message: 'Invoice not found.' 
          });
        }

        return {
          ...invoice[0],
          amount: invoice[0].amount.toString(),
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({ 
          code: 'INTERNAL_SERVER_ERROR', 
          message: 'Failed to fetch invoice.' 
        });
      }
    }),

  // Send invoice (releases funds from escrow)
  sendInvoice: protectedProcedure
    .input(z.object({ 
      invoiceId: z.string() 
    }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.user.id;

      try {
        // Verify invoice ownership
        const invoice = await db
          .select()
          .from(escrowInvoicesTable)
          .where(and(
            eq(escrowInvoicesTable.id, input.invoiceId),
            eq(escrowInvoicesTable.userId, userId)
          ))
          .limit(1);

        if (!invoice || invoice.length === 0) {
          throw new TRPCError({ 
            code: 'NOT_FOUND', 
            message: 'Invoice not found.' 
          });
        }

        if (invoice[0].status !== 'locked') {
          throw new TRPCError({ 
            code: 'BAD_REQUEST', 
            message: 'Invoice is not in locked status.' 
          });
        }

        // In production, this would trigger the smart contract to release funds
        // For demo, we'll just update the status
        await db
          .update(escrowInvoicesTable)
          .set({ 
            status: 'sent',
            updatedAt: new Date() 
          })
          .where(eq(escrowInvoicesTable.id, input.invoiceId));

        return { 
          success: true,
          message: 'Invoice sent and funds released from escrow.'
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({ 
          code: 'INTERNAL_SERVER_ERROR', 
          message: 'Failed to send invoice.' 
        });
      }
    }),

  // Cancel invoice (refund locked funds)
  cancelInvoice: protectedProcedure
    .input(z.object({ 
      invoiceId: z.string() 
    }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.user.id;

      try {
        // Verify invoice ownership
        const invoice = await db
          .select()
          .from(escrowInvoicesTable)
          .where(and(
            eq(escrowInvoicesTable.id, input.invoiceId),
            eq(escrowInvoicesTable.userId, userId)
          ))
          .limit(1);

        if (!invoice || invoice.length === 0) {
          throw new TRPCError({ 
            code: 'NOT_FOUND', 
            message: 'Invoice not found.' 
          });
        }

        if (invoice[0].status !== 'locked') {
          throw new TRPCError({ 
            code: 'BAD_REQUEST', 
            message: 'Invoice cannot be cancelled.' 
          });
        }

        // In production, this would trigger the smart contract to refund
        // For demo, we'll just update the status
        await db
          .update(escrowInvoicesTable)
          .set({ 
            status: 'cancelled',
            updatedAt: new Date() 
          })
          .where(eq(escrowInvoicesTable.id, input.invoiceId));

        return { 
          success: true,
          message: 'Invoice cancelled and funds returned.'
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({ 
          code: 'INTERNAL_SERVER_ERROR', 
          message: 'Failed to cancel invoice.' 
        });
      }
    }),

  // Pay invoice (for recipients)
  payInvoice: publicProcedure
    .input(z.object({ 
      invoiceId: z.string() 
    }))
    .mutation(async ({ input }) => {
      try {
        const invoice = await db
          .select()
          .from(escrowInvoicesTable)
          .where(eq(escrowInvoicesTable.id, input.invoiceId))
          .limit(1);

        if (!invoice || invoice.length === 0) {
          throw new TRPCError({ 
            code: 'NOT_FOUND', 
            message: 'Invoice not found.' 
          });
        }

        if (invoice[0].status !== 'sent') {
          throw new TRPCError({ 
            code: 'BAD_REQUEST', 
            message: 'Invoice is not available for payment.' 
          });
        }

        // In production, this would process the payment
        // For demo, we'll just update the status
        await db
          .update(escrowInvoicesTable)
          .set({ 
            status: 'paid',
            updatedAt: new Date() 
          })
          .where(eq(escrowInvoicesTable.id, input.invoiceId));

        return { 
          success: true,
          message: 'Payment successful!'
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({ 
          code: 'INTERNAL_SERVER_ERROR', 
          message: 'Failed to process payment.' 
        });
      }
    }),
});