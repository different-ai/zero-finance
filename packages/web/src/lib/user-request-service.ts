import { db } from '@/db';
import { userRequestsTable, UserRequest, NewUserRequest } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { requestClient } from './request-network';
import { ethers } from 'ethers';

/**
 * Service for managing user requests in the database
 */
export class UserRequestService {
  /**
   * Add a new request to the database
   */
  async addRequest(data: NewUserRequest): Promise<UserRequest> {
    try {
      console.log('0xHypr DEBUG - Starting addRequest with data:', {
        requestId: data.requestId,
        userId: data.userId,
        walletAddress: data.walletAddress,
        role: data.role,
        description: data.description,
        currency: data.currency,
        client: data.client?.substring(0, 20) || 'none',
      });

      // Log the database connection status
      console.log('0xHypr DEBUG - Database connection check');

      console.log('0xHypr DEBUG - Data BEFORE insert:', JSON.stringify(data, null, 2));

      const insertedRequests = await db
        .insert(userRequestsTable)
        .values(data)
        .returning();

      console.log('0xHypr DEBUG - Database insert operation completed');

      if (insertedRequests.length === 0) {
        console.error('0xHypr DEBUG - No requests returned after insert');
        throw new Error('Failed to add request to database');
      }

      console.log(
        '0xHypr',
        'Successfully added request to database:',
        insertedRequests[0].requestId,
        'with ID:',
        insertedRequests[0].id
      );
      return insertedRequests[0];
    } catch (error) {
      console.error('0xHypr', 'Error adding request to database:', error);
      if (error instanceof Error) {
        console.error('0xHypr DEBUG - Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack,
        });
      }
      throw error;
    }
  }

  /**
   * Update an existing request in the database
   */
  async updateRequest(
    requestId: string,
    data: Partial<Omit<NewUserRequest, 'requestId' | 'userId'>>
  ): Promise<UserRequest> {
    try {
      const updatedRequests = await db
        .update(userRequestsTable)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(userRequestsTable.requestId, requestId))
        .returning();

      if (updatedRequests.length === 0) {
        throw new Error('Request not found');
      }

      console.log('0xHypr', 'Updated request in database:', requestId);
      return updatedRequests[0];
    } catch (error) {
      console.error('0xHypr', 'Error updating request:', error);
      throw error;
    }
  }

  /**
   * Get all requests for a user from the database
   */
  async getUserRequests(userId: string): Promise<UserRequest[]> {
    try {
      console.log('0xHypr DEBUG - getUserRequests called for userId:', userId);

      // Check if the user exists in the database (just for debugging)
      console.log('0xHypr DEBUG - Starting database query for user requests');

      const requests = await db
        .select()
        .from(userRequestsTable)
        .where(eq(userRequestsTable.userId, userId))
        .orderBy(desc(userRequestsTable.createdAt));

      console.log('0xHypr DEBUG - Database query completed');
      console.log(
        '0xHypr',
        `Found ${requests.length} requests for user ${userId} in database`
      );

      // Get the raw SQL for debugging
      const query = db
        .select()
        .from(userRequestsTable)
        .where(eq(userRequestsTable.userId, userId))
        .orderBy(desc(userRequestsTable.createdAt))
        .toSQL();

      console.log('0xHypr DEBUG - SQL Query:', {
        sql: query.sql,
        params: query.params,
      });

      return requests;
    } catch (error) {
      console.error(
        '0xHypr',
        'Error getting user requests from database:',
        error
      );
      if (error instanceof Error) {
        console.error('0xHypr DEBUG - Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack,
        });
      }
      return [];
    }
  }

  /**
   * Get requests by wallet address
   */
  async getRequestsByWalletAddress(
    walletAddress: string
  ): Promise<UserRequest[]> {
    try {
      const requests = await db
        .select()
        .from(userRequestsTable)
        .where(eq(userRequestsTable.walletAddress, walletAddress))
        .orderBy(desc(userRequestsTable.createdAt));

      console.log(
        '0xHypr',
        `Found ${requests.length} requests for wallet ${walletAddress} in database`
      );
      return requests;
    } catch (error) {
      console.error(
        '0xHypr',
        'Error getting wallet requests from database:',
        error
      );
      return [];
    }
  }

  /**
   * Check if a request exists in the database
   */
  async requestExists(requestId: string): Promise<boolean> {
    try {
      const requests = await db
        .select()
        .from(userRequestsTable)
        .where(eq(userRequestsTable.requestId, requestId))
        .limit(1);

      return requests.length > 0;
    } catch (error) {
      console.error('0xHypr', 'Error checking if request exists:', error);
      return false;
    }
  }

  /**
   * Get a request by its ID
   */
  async getRequestById(requestId: string): Promise<UserRequest | null> {
    try {
      const requests = await db
        .select()
        .from(userRequestsTable)
        .where(eq(userRequestsTable.requestId, requestId))
        .limit(1);

      if (requests.length === 0) {
        return null;
      }

      return requests[0];
    } catch (error) {
      console.error('0xHypr', 'Error getting request by ID:', error);
      return null;
    }
  }

  /**
   * Fetch the full request details from the Request Network
   * and convert it to our UserRequest format
   */
  async fetchRequestDetails(
    requestId: string,
    userId: string,
    walletAddress: string
  ): Promise<UserRequest | null> {
    try {
      // Check if we already have this request in our database
      const existingRequest = await this.getRequestById(requestId);
      if (existingRequest) {
        return existingRequest;
      }

      // Fetch the request details from the Request Network
      console.log(
        '0xHypr',
        'Fetching request details from Request Network:',
        requestId
      );
      const request = await requestClient.fromRequestId(requestId);
      if (!request) {
        console.error(
          '0xHypr',
          'Request not found in Request Network:',
          requestId
        );
        return null;
      }

      const requestData = request.getData();
      const contentData = requestData.contentData || {};

      // Check if this request belongs to the user by comparing wallet address
      const payeeAddress = requestData.payee?.value || '';
      const payerAddress = requestData.payer?.value || '';

      const isUserInvolved =
        payeeAddress.toLowerCase() === walletAddress.toLowerCase() ||
        payerAddress.toLowerCase() === walletAddress.toLowerCase();

      if (!isUserInvolved) {
        console.warn(
          '0xHypr',
          'User is not involved in this request:',
          requestId
        );
        // We'll still add it to our database, but mark the role correctly
      }

      // Determine user role (seller or buyer)
      const isUserSeller =
        payeeAddress.toLowerCase() === walletAddress.toLowerCase();
      const role = isUserSeller ? 'seller' : 'buyer';

      // Get payment status
      const paymentStatus = await request.getData();
      const isPaid = paymentStatus.state === 'accepted';
      const status: 'paid' | 'pending' = isPaid ? 'paid' : 'pending';

      // Format amount
      let displayAmount = requestData.expectedAmount || '0';
      try {
        // Convert from wei to decimal
        const amountInEth = ethers.utils.formatUnits(displayAmount, 18);
        displayAmount = parseFloat(amountInEth).toFixed(2);
      } catch (error) {
        console.error('0xHypr', 'Error formatting amount:', error);
      }

      // Format currency
      let currencyDisplay = 'Unknown';
      // Import Types if needed
      if (
        requestData.currency &&
        requestData.currency === '0xcB444e90D8198415266c6a2724b7900fb12FC56E'
      ) {
        currencyDisplay = 'EURe';
      } else if (
        requestData.currency &&
        requestData.currency === '0xcB444e90D8198415266c6a2724b7900fb12FC56E'
      ) {
        currencyDisplay = requestData.currency;
      }

      // Get client name
      const sellerEmail = contentData.sellerInfo?.email || '';
      const buyerEmail = contentData.buyerInfo?.email || '';
      const clientName = isUserSeller
        ? contentData.buyerInfo?.businessName || buyerEmail || 'Unknown Client'
        : contentData.sellerInfo?.businessName ||
          sellerEmail ||
          'Unknown Seller';

      // Get request description
      const description =
        contentData.invoiceItems?.[0]?.name ||
        contentData.reason ||
        contentData.invoiceNumber ||
        'Invoice';

      // Create a new user request object
      const newRequest: NewUserRequest = {
        requestId,
        userId,
        walletAddress,
        role,
        description,
        amount: displayAmount.toString(),
        currency: currencyDisplay,
        status,
        client: clientName,
      };

      // Add the request to our database
      return await this.addRequest(newRequest);
    } catch (error) {
      console.error('0xHypr', 'Error fetching request details:', error);
      return null;
    }
  }

  /**
   * Update the status of a request (check if it's been paid)
   */
  async updateRequestStatus(requestId: string): Promise<UserRequest | null> {
    try {
      // Get the existing request
      const existingRequest = await this.getRequestById(requestId);
      if (!existingRequest) {
        console.error(
          '0xHypr',
          'Request not found when updating status:',
          requestId
        );
        return null;
      }

      // Only update if it's currently pending
      if (existingRequest.status === 'paid') {
        return existingRequest;
      }

      // Check the current status from the Request Network
      const request = await requestClient.fromRequestId(requestId);
      if (!request) {
        console.error(
          '0xHypr',
          'Request not found in Request Network when updating status:',
          requestId
        );
        return existingRequest;
      }

      // Check payment status
      const paymentStatus = await request.getData();
      const isPaid = paymentStatus.state === 'accepted';
      request.getData().state === 'accepted';

      if (isPaid) {
        // Update the request status
        return await this.updateRequest(requestId, { status: 'paid' });
      }

      return existingRequest;
    } catch (error) {
      console.error('0xHypr', 'Error updating request status:', error);
      return null;
    }
  }
}

export const userRequestService = new UserRequestService();
