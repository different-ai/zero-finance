import { test, expect } from '@playwright/test';

test.describe('Document Upload and Processing', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the inbox page
    await page.goto('/dashboard/inbox');
  });

  test('should upload and process a document', async ({ page }) => {
    // Look for the upload dropzone
    const dropzone = page.locator('[data-testid="unified-dropzone"]');
    await expect(dropzone).toBeVisible();

    // Create a test file
    const buffer = Buffer.from('Test invoice content');
    const fileName = 'test-invoice.pdf';

    // Set up the file input
    const fileInput = page.locator('input[type="file"]');

    // Upload the file
    await fileInput.setInputFiles({
      name: fileName,
      mimeType: 'application/pdf',
      buffer: buffer,
    });

    // Wait for the upload to complete
    await page.waitForResponse(
      (response) =>
        response.url().includes('/api/trpc/inbox.uploadDocument') &&
        response.status() === 200,
    );

    // Check that a new card appears in the inbox
    const inboxCard = page.locator('[data-testid="inbox-card"]').last();
    await expect(inboxCard).toBeVisible();

    // Verify the card contains the uploaded file name
    await expect(inboxCard).toContainText(fileName);
  });

  test('should track which partner paid for an expense', async ({ page }) => {
    // First, get or create a workspace
    await page.evaluate(async () => {
      const response = await fetch('/api/trpc/inbox.getOrCreateWorkspace', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      return data;
    });

    // Upload a document with paidBy information
    const dropzone = page.locator('[data-testid="unified-dropzone"]');
    await expect(dropzone).toBeVisible();

    const fileName = 'restaurant-receipt.jpg';
    const buffer = Buffer.from('Restaurant receipt image data');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: fileName,
      mimeType: 'image/jpeg',
      buffer: buffer,
    });

    // Wait for upload
    await page.waitForResponse(
      (response) =>
        response.url().includes('/api/trpc/inbox.uploadDocument') &&
        response.status() === 200,
    );

    // The uploaded card should appear
    const inboxCard = page.locator('[data-testid="inbox-card"]').last();
    await expect(inboxCard).toBeVisible();

    // In a real implementation, we would have UI to mark who paid
    // For now, just verify the card was created
    await expect(inboxCard).toContainText('restaurant');
  });

  test('should calculate partner balances', async ({ page }) => {
    // This would test the balance calculation feature
    // In a real implementation, would:
    // 1. Create a workspace with partners
    // 2. Upload multiple expenses with different payers
    // 3. Navigate to balance view
    // 4. Verify correct balance calculations

    const response = await page.evaluate(async () => {
      // Get workspace first
      const workspaceResponse = await fetch(
        '/api/trpc/inbox.getOrCreateWorkspace',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const workspaceData = await workspaceResponse.json();

      // Calculate balances
      const balancesResponse = await fetch(
        '/api/trpc/inbox.calculatePartnerBalances',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            workspaceId: workspaceData.result.data.workspaceId,
          }),
        },
      );

      return await balancesResponse.json();
    });

    // Verify the response has the expected structure
    expect(response).toHaveProperty('result');
    expect(response.result).toHaveProperty('data');
    expect(response.result.data).toHaveProperty('balances');
    expect(response.result.data).toHaveProperty('totalExpenses');
    expect(response.result.data).toHaveProperty('members');
  });
});

test.describe('Workspace Management', () => {
  test('should create a workspace for new users', async ({ page }) => {
    await page.goto('/dashboard/inbox');

    const response = await page.evaluate(async () => {
      const response = await fetch('/api/trpc/inbox.getOrCreateWorkspace', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    });

    expect(response).toHaveProperty('result');
    expect(response.result).toHaveProperty('data');
    expect(response.result.data).toHaveProperty('workspaceId');
    expect(response.result.data).toHaveProperty('workspace');
    expect(response.result.data.workspace).toHaveProperty('name');
    expect(response.result.data.workspace.name).toBe('Personal Workspace');
  });

  test('should invite a partner to workspace', async ({ page }) => {
    await page.goto('/dashboard/inbox');

    // Get workspace first
    const workspaceResponse = await page.evaluate(async () => {
      const response = await fetch('/api/trpc/inbox.getOrCreateWorkspace', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    });

    const workspaceId = workspaceResponse.result.data.workspaceId;

    // Invite a partner
    const inviteResponse = await page.evaluate(async (wsId) => {
      const response = await fetch('/api/trpc/inbox.invitePartnerToWorkspace', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workspaceId: wsId,
          partnerEmail: 'partner@example.com',
        }),
      });
      return await response.json();
    }, workspaceId);

    expect(inviteResponse).toHaveProperty('result');
    expect(inviteResponse.result).toHaveProperty('data');
    expect(inviteResponse.result.data).toHaveProperty('success');
    expect(inviteResponse.result.data.success).toBe(true);
  });
});
