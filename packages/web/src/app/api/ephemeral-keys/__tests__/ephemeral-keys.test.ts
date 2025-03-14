import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from '@/db';
import { ephemeralKeysTable } from '@/db/schema';
import { sql, eq, or, lt } from 'drizzle-orm';
import { ephemeralKeyService } from '@/lib/ephemeral-key-service';

// Helper function to make requests to our API endpoints
async function makeRequest(path: string, options: RequestInit = {}) {
  const baseUrl = 'http://localhost:3050/api';
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return response;
}

describe('Ephemeral Keys Integration Tests', () => {
  // Clean up database before and after tests
  beforeAll(async () => {
    await db.delete(ephemeralKeysTable);
  });

  afterAll(async () => {
    await db.delete(ephemeralKeysTable);
  });

  describe('Generate Endpoint', () => {
    it('should generate a new ephemeral key', async () => {
      const response = await makeRequest('/ephemeral-keys/generate', {
        method: 'POST',
      });
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.token).toBeDefined();
      expect(data.publicKey).toBeDefined();
      
      // Verify key was stored in database
      const [storedKey] = await db
        .select()
        .from(ephemeralKeysTable)
        .where(eq(ephemeralKeysTable.token, data.token));
      
      expect(storedKey).toBeDefined();
      expect(storedKey.publicKey).toBeDefined();
      expect(storedKey.privateKey).toBeDefined();
      expect(storedKey.expiresAt).toBeDefined();
    });
  });

  describe('Retrieval Endpoint', () => {
    it('should retrieve an existing ephemeral key', async () => {
      // First generate a key
      const generateResponse = await makeRequest('/ephemeral-keys/generate', {
        method: 'POST',
      });
      const { token } = await generateResponse.json();

      // Then retrieve it
      const retrieveResponse = await makeRequest(`/ephemeral-keys/${token}`);
      expect(retrieveResponse.status).toBe(200);
      
      const data = await retrieveResponse.json();
      expect(data.privateKey).toBeDefined();

      // Verify against database
      const [storedKey] = await db
        .select()
        .from(ephemeralKeysTable)
        .where(eq(ephemeralKeysTable.token, token));
      
      expect(data.privateKey).toBe(storedKey.privateKey);
    });

    it('should return 400 when token is missing', async () => {
      const response = await makeRequest('/ephemeral-keys');
      expect(response.status).toBe(400);
      
      const data = await response.json();
      expect(data.error).toBe('Token is required');
    });

    it('should return null for non-existent token', async () => {
      const response = await makeRequest('/ephemeral-keys/nonexistent');
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.privateKey).toBeNull();
    });
  });

  describe('Expiration', () => {
    it('should handle expired keys correctly', async () => {
      // Generate a key
      const generateResponse = await makeRequest('/ephemeral-keys/generate', {
        method: 'POST',
      });
      const { token } = await generateResponse.json();

      // Manually expire the key in the database
      await db
        .update(ephemeralKeysTable)
        .set({ expiresAt: new Date(Date.now() - 1000) }) // Set to past
        .where(eq(ephemeralKeysTable.token, token));

      // Try to retrieve the expired key
      const retrieveResponse = await makeRequest(`/ephemeral-keys/${token}`);
      expect(retrieveResponse.status).toBe(200);
      
      const data = await retrieveResponse.json();
      expect(data.privateKey).toBeNull();

      // Verify key was deleted from database
      const [storedKey] = await db
        .select()
        .from(ephemeralKeysTable)
        .where(eq(ephemeralKeysTable.token, token));
      
      expect(storedKey).toBeUndefined();
    });
  });

  describe('Cleanup', () => {
    it('should clean up expired keys', async () => {
      // First clean any existing keys
      await db.delete(ephemeralKeysTable);

      // Generate multiple keys
      const generatePromises = Array(3).fill(null).map(() =>
        makeRequest('/ephemeral-keys/generate', { method: 'POST' })
      );
      const responses = await Promise.all(generatePromises);
      const tokens = await Promise.all(
        responses.map(r => r.json().then(data => data.token))
      );

      // Verify we have 3 keys
      const initialKeys = await db.select().from(ephemeralKeysTable);
      console.log('0xHypr', 'Initial keys:', initialKeys.length);
      expect(initialKeys.length).toBe(3);

      // Expire two keys
      const pastDate = new Date(Date.now() - 1000);
      await db
        .update(ephemeralKeysTable)
        .set({ expiresAt: pastDate })
        .where(or(
          eq(ephemeralKeysTable.token, tokens[0]),
          eq(ephemeralKeysTable.token, tokens[1])
        ));

      // Verify expiration was set
      const expiredKeys = await db
        .select()
        .from(ephemeralKeysTable)
        .where(lt(ephemeralKeysTable.expiresAt, new Date()));
      console.log('0xHypr', 'Expired keys:', expiredKeys.length);
      expect(expiredKeys.length).toBe(2);

      // Trigger cleanup
      const deletedKeys = await ephemeralKeyService.cleanupExpiredKeys();
      console.log('0xHypr', 'Deleted keys:', deletedKeys.length);
      expect(deletedKeys.length).toBe(2);

      // Check remaining keys
      const remainingKeys = await db
        .select()
        .from(ephemeralKeysTable);
      console.log('0xHypr', 'Remaining keys:', remainingKeys.length);

      expect(remainingKeys.length).toBe(1);
      expect(remainingKeys[0].token).toBe(tokens[2]);
    });
  });
}); 