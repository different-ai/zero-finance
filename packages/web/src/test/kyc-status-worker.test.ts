import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { processKycStatusChanges, checkAndUpdateKycStatus, getUserEmail } from '../../scripts/kyc-status-worker';
import { db } from '../db';
import { alignApi } from '../server/services/align-api';
import { loopsApi } from '../server/services/loops-service';
import { getPrivyClient } from '../lib/auth';

// Mock the dependencies
vi.mock('../db', () => ({
  db: {
    select: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock('../server/services/align-api', () => ({
  alignApi: {
    getCustomer: vi.fn(),
  },
}));

vi.mock('../server/services/loops-service', () => ({
  loopsApi: {
    sendEvent: vi.fn(),
  },
  LoopsEvent: {
    KYC_APPROVED: 'kyc-approved',
    KYC_PENDING_REVIEW: 'kyc-pending-review',
  },
}));

vi.mock('../lib/auth', () => ({
  getPrivyClient: vi.fn(),
}));

describe('KYC Status Worker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getUserEmail', () => {
    it('should return email from Privy user', async () => {
      const mockPrivyClient = {
        getUser: vi.fn().mockResolvedValue({
          email: { address: 'test@example.com' }
        })
      };
      vi.mocked(getPrivyClient).mockResolvedValue(mockPrivyClient as any);

      const email = await getUserEmail('user-123');
      expect(email).toBe('test@example.com');
    });

    it('should handle string email format', async () => {
      const mockPrivyClient = {
        getUser: vi.fn().mockResolvedValue({
          email: 'test@example.com'
        })
      };
      vi.mocked(getPrivyClient).mockResolvedValue(mockPrivyClient as any);

      const email = await getUserEmail('user-123');
      expect(email).toBe('test@example.com');
    });

    it('should return null if Privy client not initialized', async () => {
      vi.mocked(getPrivyClient).mockResolvedValue(null);

      const email = await getUserEmail('user-123');
      expect(email).toBeNull();
    });
  });

  describe('checkAndUpdateKycStatus', () => {
    it('should return null if no KYC data found', async () => {
      vi.mocked(alignApi.getCustomer).mockResolvedValue({
        customer_id: 'test-customer',
        kycs: [],
      } as any);

      const result = await checkAndUpdateKycStatus(
        'test-customer',
        'user-123',
        'pending'
      );

      expect(result).toBeNull();
      expect(db.update).not.toHaveBeenCalled();
    });

    it('should return null if status has not changed', async () => {
      vi.mocked(alignApi.getCustomer).mockResolvedValue({
        customer_id: 'test-customer',
        kycs: [{
          status: 'pending',
          kyc_flow_link: 'https://example.com/kyc',
          sub_status: 'reviewing',
        }],
      } as any);

      const result = await checkAndUpdateKycStatus(
        'test-customer',
        'user-123',
        'pending'
      );

      expect(result).toBeNull();
      expect(db.update).not.toHaveBeenCalled();
    });

    it('should update DB and return change when status changes to approved', async () => {
      const mockUpdate = vi.fn().mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(undefined),
        }),
      });
      vi.mocked(db.update).mockImplementation(mockUpdate);

      vi.mocked(alignApi.getCustomer).mockResolvedValue({
        customer_id: 'test-customer',
        kycs: [{
          status: 'approved',
          kyc_flow_link: 'https://example.com/kyc',
          sub_status: 'completed',
        }],
      } as any);

      // Mock getUserEmail
      const mockPrivyClient = {
        getUser: vi.fn().mockResolvedValue({
          email: { address: 'test@example.com' }
        })
      };
      vi.mocked(getPrivyClient).mockResolvedValue(mockPrivyClient as any);

      const result = await checkAndUpdateKycStatus(
        'test-customer',
        'user-123',
        'pending'
      );

      expect(result).toEqual({
        userId: 'user-123',
        email: 'test@example.com',
        oldStatus: 'pending',
        newStatus: 'approved',
      });
      expect(mockUpdate).toHaveBeenCalled();
    });

    it('should handle API errors gracefully', async () => {
      vi.mocked(alignApi.getCustomer).mockRejectedValue(new Error('API Error'));

      const result = await checkAndUpdateKycStatus(
        'test-customer',
        'user-123',
        'pending'
      );

      expect(result).toBeNull();
      expect(db.update).not.toHaveBeenCalled();
    });
  });

  describe('processKycStatusChanges', () => {
    it('should process users and send notifications for approved KYCs', async () => {
      // Mock db.select chain
      const mockWhere = vi.fn().mockResolvedValue([
        {
          privyDid: 'user-1',
          alignCustomerId: 'customer-1',
          kycStatus: 'pending',
        },
        {
          privyDid: 'user-2',
          alignCustomerId: 'customer-2',
          kycStatus: 'none',
        },
      ]);
      
      const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
      const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });
      vi.mocked(db.select).mockImplementation(mockSelect);

      // Mock update chain
      const mockUpdateWhere = vi.fn().mockResolvedValue(undefined);
      const mockUpdateSet = vi.fn().mockReturnValue({ where: mockUpdateWhere });
      const mockUpdate = vi.fn().mockReturnValue({ set: mockUpdateSet });
      vi.mocked(db.update).mockImplementation(mockUpdate);

      // Mock Align API responses
      vi.mocked(alignApi.getCustomer)
        .mockResolvedValueOnce({
          customer_id: 'customer-1',
          kycs: [{
            status: 'approved',
            kyc_flow_link: 'https://example.com/kyc1',
            sub_status: 'completed',
          }],
        } as any)
        .mockResolvedValueOnce({
          customer_id: 'customer-2',
          kycs: [{
            status: 'pending',
            kyc_flow_link: 'https://example.com/kyc2',
            sub_status: 'reviewing',
          }],
        } as any);

      // Mock Privy client for getUserEmail
      const mockPrivyClient = {
        getUser: vi.fn().mockResolvedValue({
          email: { address: 'user1@example.com' }
        })
      };
      vi.mocked(getPrivyClient).mockResolvedValue(mockPrivyClient as any);

      // Mock Loops API
      vi.mocked(loopsApi.sendEvent).mockResolvedValue({ success: true });

      const result = await processKycStatusChanges();

      expect(result).toEqual({
        checked: 2,
        approved: 1,
        changes: [{
          userId: 'user-1',
          email: 'user1@example.com',
          oldStatus: 'pending',
          newStatus: 'approved',
        }],
      });

      expect(loopsApi.sendEvent).toHaveBeenCalledOnce();
      expect(loopsApi.sendEvent).toHaveBeenCalledWith(
        'user1@example.com',
        'kyc-approved',
        'user-1'
      );
    });

    it('should handle empty user list', async () => {
      const mockWhere = vi.fn().mockResolvedValue([]);
      const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
      const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });
      vi.mocked(db.select).mockImplementation(mockSelect);

      const result = await processKycStatusChanges();

      expect(result).toEqual({
        checked: 0,
        approved: 0,
        changes: [],
      });

      expect(alignApi.getCustomer).not.toHaveBeenCalled();
      expect(loopsApi.sendEvent).not.toHaveBeenCalled();
    });

    it('should continue processing if notification fails', async () => {
      const mockWhere = vi.fn().mockResolvedValue([
        {
          privyDid: 'user-1',
          alignCustomerId: 'customer-1',
          kycStatus: 'pending',
        },
      ]);
      
      const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
      const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });
      vi.mocked(db.select).mockImplementation(mockSelect);

      const mockUpdateWhere = vi.fn().mockResolvedValue(undefined);
      const mockUpdateSet = vi.fn().mockReturnValue({ where: mockUpdateWhere });
      const mockUpdate = vi.fn().mockReturnValue({ set: mockUpdateSet });
      vi.mocked(db.update).mockImplementation(mockUpdate);

      vi.mocked(alignApi.getCustomer).mockResolvedValue({
        customer_id: 'customer-1',
        kycs: [{
          status: 'approved',
          kyc_flow_link: 'https://example.com/kyc1',
          sub_status: 'completed',
        }],
      } as any);

      // Mock Privy client
      const mockPrivyClient = {
        getUser: vi.fn().mockResolvedValue({
          email: { address: 'user1@example.com' }
        })
      };
      vi.mocked(getPrivyClient).mockResolvedValue(mockPrivyClient as any);

      // Mock Loops API to fail
      vi.mocked(loopsApi.sendEvent).mockRejectedValue(new Error('Email service error'));

      const result = await processKycStatusChanges();

      expect(result).toEqual({
        checked: 1,
        approved: 1,
        changes: [{
          userId: 'user-1',
          email: 'user1@example.com',
          oldStatus: 'pending',
          newStatus: 'approved',
        }],
      });
    });
  });
}); 