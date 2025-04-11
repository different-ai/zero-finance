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
   * Note: requestId and walletAddress should be null initially
   */
  async addRequest(data: Omit<NewUserRequest, 'createdAt' | 'updatedAt'>): Promise<UserRequest> {
    try {
      console.log('0xHypr DEBUG - Starting addRequest with data:', {
        userId: data.userId,
        role: data.role,
        description: data.description,
        currency: data.currency,
        client: data.client?.substring(0, 20) || 'none',
        status: data.status,
        // Explicitly showing initial null/undefined values
        requestId: data.requestId, // Should be undefined/null here
        walletAddress: data.walletAddress, // Should be undefined/null here
      });

      // Log the database connection status
      console.log('0xHypr DEBUG - Database connection check');

      // Ensure required nullable fields are handled correctly by drizzle or set explicitly if needed
      const dataToInsert: NewUserRequest = {
        ...data,
        // Drizzle will now use the explicitly provided ID if present
      };

      console.log('0xHypr DEBUG - Data BEFORE insert:', JSON.stringify(dataToInsert, null, 2));

      const insertedRequests = await db
        .insert(userRequestsTable)
        .values(dataToInsert) // Use the prepared data
        .returning();

      console.log('0xHypr DEBUG - Database insert operation completed');

      if (insertedRequests.length === 0) {
        console.error('0xHypr DEBUG - No requests returned after insert');
        throw new Error('Failed to add request to database');
      }

      console.log(
        '0xHypr',
        'Successfully added request to database with ID:',
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
   * Update an existing request in the database using its primary key (UUID string)
   */
  async updateRequest(
    id: string, // Primary key (UUID)
    data: Partial<Omit<NewUserRequest, 'id' | 'userId' | 'createdAt'>> // Update data, excluding immutable/auto fields
  ): Promise<UserRequest> {
    try {
      // Add the updatedAt timestamp automatically
      const updateData = {
        ...data,
        updatedAt: new Date(),
      };

      console.log(`0xHypr DEBUG - Updating request ID ${id} with data:`, updateData);

      const updatedRequests = await db
        .update(userRequestsTable)
        .set(updateData)
        .where(eq(userRequestsTable.id, id)) // Use the primary key 'id'
        .returning();

      if (updatedRequests.length === 0) {
        console.error(`0xHypr DEBUG - Request with ID ${id} not found for update.`);
        throw new Error('Request not found for update');
      }

      console.log('0xHypr', 'Updated request in database with ID:', id);
      return updatedRequests[0];
    } catch (error) {
      console.error('0xHypr', `Error updating request with ID ${id}:`, error);
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
    // Ensure walletAddress is not null or undefined before querying
    if (!walletAddress) {
        console.warn('0xHypr DEBUG - getRequestsByWalletAddress called with null/undefined address');
        return [];
    }
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
   * Check if a request exists in the database by Request Network ID
   */
  async requestExists(requestId: string): Promise<boolean> {
    // Ensure requestId is not null or undefined before querying
    if (!requestId) {
        console.warn('0xHypr DEBUG - requestExists called with null/undefined requestId');
        return false;
    }
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
   * Get a request by its Request Network ID (string)
   */
  async getRequestById(requestId: string): Promise<UserRequest | null> {
    // Ensure requestId is not null or undefined before querying
    if (!requestId) {
        console.warn('0xHypr DEBUG - getRequestById called with null/undefined requestId');
        return null;
    }
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
      console.error('0xHypr', 'Error getting request by Request Network ID:', error);
      return null;
    }
  }

  /**
   * Get a request by its primary key (UUID string)
   */
  async getRequestByPrimaryKey(id: string): Promise<UserRequest | null> {
    try {
      const requests = await db
        .select()
        .from(userRequestsTable)
        .where(eq(userRequestsTable.id, id))
        .limit(1);

      if (requests.length === 0) {
        return null;
      }

      return requests[0];
    } catch (error) {
      console.error('0xHypr', 'Error getting request by primary key:', id, error);
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
      // Check if we already have this request in our database using RN ID
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
      const paymentStatus = await request.getData(); // Re-fetch might not be needed
      const isPaid = paymentStatus.state === 'accepted';
      const status: 'paid' | 'pending' | 'db_pending' = isPaid ? 'paid' : 'pending'; // Keep pending if fetched from RN

      // Format amount
      let displayAmount = requestData.expectedAmount || '0';
      let currencyDecimals = 18; // Default
      // TODO: Get decimals based on fetched currency info if possible
      try {
        // Attempt to get decimals from currency info - NEEDS getCurrencyConfig or similar logic here
        // For now, assuming 18 for ETH/ERC20, 2 for fiat - this needs refinement
        if (requestData.currencyInfo?.type === 'ISO4217') {
          currencyDecimals = 2; // Common for fiat
        } else {
            // Look up ERC20 decimals - complex, skip for now
        }
        const amountFormatted = ethers.utils.formatUnits(displayAmount, currencyDecimals);
        displayAmount = parseFloat(amountFormatted).toFixed(currencyDecimals);
      } catch (error) {
        console.error('0xHypr', 'Error formatting amount:', error);
        // Fallback to raw amount if formatting fails
        displayAmount = requestData.expectedAmount || '0'; 
      }

      // Format currency
      // Use .value for symbol (ISO) or address (ERC20)
      // Use .type to differentiate if needed later
      let currencyDisplay = requestData.currencyInfo?.value || requestData.currency || 'Unknown'; 

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
      // We need id, createdAt, updatedAt? Drizzle handles defaults on insert.
      const newRequestData: Omit<NewUserRequest, 'id' | 'createdAt' | 'updatedAt'> = {
        requestId, // The RN ID
        userId, // Provided user ID
        walletAddress, // Provided wallet address
        role,
        description,
        amount: displayAmount.toString(),
        currency: currencyDisplay,
        status,
        client: clientName,
        invoiceData: contentData, // Store fetched content data
        shareToken: null, // No share token when syncing from RN
      };

      // Add the request to our database
      return await this.addRequest(newRequestData);
    } catch (error) {
      console.error('0xHypr', 'Error fetching request details:', error);
      return null;
    }
  }

  /**
   * Update the status of a request (check if it's been paid) using RN ID
   */
  async updateRequestStatus(requestId: string): Promise<UserRequest | null> {
    // Ensure requestId is valid
     if (!requestId) {
        console.warn('0xHypr DEBUG - updateRequestStatus called with null/undefined requestId');
        return null;
    }
    try {
      // Get the existing request using RN ID
      const existingRequest = await this.getRequestById(requestId);
      if (!existingRequest) {
        console.error(
          '0xHypr',
          'Request not found when updating status:',
          requestId
        );
        return null;
      }

      // Only update if it's currently pending or db_pending
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
        return existingRequest; // Return the current DB state
      }

      // Check payment status
      const paymentStatus = await request.getData(); // Re-fetch might not be needed
      const isPaid = paymentStatus.state === 'accepted';

      // Type assertions to handle the status comparisons safely
      const currentStatus = existingRequest.status as string | null | undefined;
      const paidStatus = 'paid' as const;

      if (isPaid && currentStatus !== paidStatus) {
        console.log(`0xHypr Status changed to PAID for RN ID ${requestId}, DB ID ${existingRequest.id}`);
        // Update the request status using DB primary key
        return await this.updateRequest(existingRequest.id, { status: paidStatus });
      } else if (!isPaid && currentStatus === paidStatus) {
         // Optional: Handle case where RN says pending but DB says paid (maybe log warning)
         console.warn(`0xHypr Mismatch: RN ID ${requestId} is PENDING on network but PAID in DB (ID: ${existingRequest.id}). Keeping DB status.`);
      }

      return existingRequest; // Return existing record if status hasn't changed to paid
    } catch (error) {
      console.error('0xHypr', 'Error updating request status:', error);
      // Attempt to return existing record on error
      const existing = await this.getRequestById(requestId).catch(() => null);
      return existing;
    }
  }
}

export const userRequestService = new UserRequestService();
