import { db } from '@/db';
import { userRequestsTable, UserRequest, NewUserRequest } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getCurrencyConfig } from '@/lib/currencies';

/**
 * Service for managing user requests in the database
 * Note: Request Network integration has been removed. Invoices are now handled natively.
 */
export class UserRequestService {
  /**
   * Add a new request to the database
   * Note: requestId and walletAddress should be null initially
   */
  async addRequest(
    data: Omit<NewUserRequest, 'createdAt' | 'updatedAt'>,
  ): Promise<UserRequest> {
    try {
      console.log('0xHypr DEBUG - Starting addRequest with data:', {
        userId: data.userId,
        role: data.role,
        description: data.description,
        currency: data.currency,
        client: data.client?.substring(0, 20) || 'none',
        status: data.status,
        requestId: data.requestId,
        walletAddress: data.walletAddress,
      });

      console.log('0xHypr DEBUG - Database connection check');

      const dataToInsert: NewUserRequest = {
        ...data,
      };

      console.log(
        '0xHypr DEBUG - Data BEFORE insert:',
        JSON.stringify(
          dataToInsert,
          (key, value) =>
            typeof value === 'bigint' ? value.toString() : value,
          2,
        ),
      );

      const insertedRequests = await db
        .insert(userRequestsTable)
        .values(dataToInsert)
        .returning();

      console.log('0xHypr DEBUG - Database insert operation completed');

      if (insertedRequests.length === 0) {
        console.error('0xHypr DEBUG - No requests returned after insert');
        throw new Error('Failed to add request to database');
      }

      console.log(
        '0xHypr',
        'Successfully added request to database with ID:',
        insertedRequests[0].id,
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
    id: string,
    data: Partial<Omit<NewUserRequest, 'id' | 'userId' | 'createdAt'>>,
  ): Promise<UserRequest> {
    try {
      const updateData = {
        ...data,
        updatedAt: new Date(),
      };

      console.log(
        `0xHypr DEBUG - Updating request ID ${id} with data:`,
        updateData,
      );

      const updatedRequests = await db
        .update(userRequestsTable)
        .set(updateData)
        .where(eq(userRequestsTable.id, id))
        .returning();

      if (updatedRequests.length === 0) {
        console.error(
          `0xHypr DEBUG - Request with ID ${id} not found for update.`,
        );
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
      console.log('0xHypr DEBUG - Starting database query for user requests');

      const requests = await db
        .select()
        .from(userRequestsTable)
        .where(eq(userRequestsTable.userId, userId))
        .orderBy(desc(userRequestsTable.createdAt));

      console.log('0xHypr DEBUG - Database query completed');
      console.log(
        '0xHypr',
        `Found ${requests.length} requests for user ${userId} in database`,
      );

      return requests;
    } catch (error) {
      console.error(
        '0xHypr',
        'Error getting user requests from database:',
        error,
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
    walletAddress: string,
  ): Promise<UserRequest[]> {
    if (!walletAddress) {
      console.warn(
        '0xHypr DEBUG - getRequestsByWalletAddress called with null/undefined address',
      );
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
        `Found ${requests.length} requests for wallet ${walletAddress} in database`,
      );
      return requests;
    } catch (error) {
      console.error(
        '0xHypr',
        'Error getting wallet requests from database:',
        error,
      );
      return [];
    }
  }

  /**
   * Check if a request exists in the database by Request ID
   */
  async requestExists(requestId: string): Promise<boolean> {
    if (!requestId) {
      console.warn(
        '0xHypr DEBUG - requestExists called with null/undefined requestId',
      );
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
   * Get a request by its Request ID (string)
   */
  async getRequestById(requestId: string): Promise<UserRequest | null> {
    if (!requestId) {
      console.warn(
        '0xHypr DEBUG - getRequestById called with null/undefined requestId',
      );
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
      console.error('0xHypr', 'Error getting request by ID:', error);
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
      console.error(
        '0xHypr',
        'Error getting request by primary key:',
        id,
        error,
      );
      return null;
    }
  }
}

export const userRequestService = new UserRequestService();
