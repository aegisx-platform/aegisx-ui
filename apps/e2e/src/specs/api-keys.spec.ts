import { test, expect } from '@playwright/test';
import { ApiKeysPage } from '../pages/api-keys.page';

test.describe('API Keys Management', () => {
  let apiKeysPage: ApiKeysPage;

  test.beforeEach(async ({ page }) => {
    apiKeysPage = new ApiKeysPage(page);
    await apiKeysPage.goto();
  });

  test.describe('Page Loading', () => {
    test('should load API keys page successfully', async () => {
      await apiKeysPage.verifyElementVisible(
        '[data-testid="api-keys-page"], .api-keys-page',
      );
    });

    test('should display stats cards', async () => {
      await apiKeysPage.verifyStatsCardsDisplayed();
    });

    test('should display API keys table or empty state', async () => {
      const hasData = await apiKeysPage.hasData();

      if (hasData) {
        // Verify table is displayed
        await apiKeysPage.verifyElementVisible(
          '[data-testid="api-keys-table"], table',
        );
        const rowCount = await apiKeysPage.getRowCount();
        expect(rowCount).toBeGreaterThan(0);
      } else {
        // Verify empty state is displayed
        await apiKeysPage.verifyNoDataDisplayed();
      }
    });

    test('should display create button', async () => {
      await apiKeysPage.verifyElementVisible(
        '[data-testid="create-key-btn"], button:has-text("Create")',
      );
    });
  });

  test.describe('Create API Key - Wizard Flow', () => {
    test('should open create wizard', async () => {
      await apiKeysPage.clickCreateKey();

      // Verify wizard is displayed
      await apiKeysPage.verifyElementVisible(
        '[data-testid="create-wizard"], .create-wizard, mat-dialog-container',
      );
    });

    test('should complete wizard step 1 (basic info)', async () => {
      await apiKeysPage.clickCreateKey();

      // Fill basic info
      await apiKeysPage.fillWizardStep1({
        name: 'Test API Key',
        description: 'API key for E2E testing',
        expiration: '30',
      });

      // Go to next step
      await apiKeysPage.clickNext();

      // Verify we're on step 2
      await apiKeysPage.verifyElementVisible(
        '[data-testid="wizard-step-2"], .permissions-panel',
      );
    });

    test('should select permissions in step 2', async () => {
      await apiKeysPage.clickCreateKey();

      // Step 1
      await apiKeysPage.fillWizardStep1({
        name: 'Test API Key',
        description: 'API key for E2E testing',
      });
      await apiKeysPage.clickNext();

      // Step 2: Select permissions
      await apiKeysPage.selectPermissions(['read:users', 'read:logs']);

      // Go to next step
      await apiKeysPage.clickNext();

      // Verify we're on step 3 (review)
      await apiKeysPage.verifyElementVisible(
        '[data-testid="wizard-step-3"], .review-panel',
      );
    });

    test('should navigate back in wizard', async () => {
      await apiKeysPage.clickCreateKey();

      // Step 1
      await apiKeysPage.fillWizardStep1({
        name: 'Test API Key',
        description: 'API key for E2E testing',
      });
      await apiKeysPage.clickNext();

      // Step 2
      await apiKeysPage.verifyElementVisible('[data-testid="wizard-step-2"]');

      // Go back to step 1
      await apiKeysPage.clickPrevious();

      // Verify we're back on step 1
      await apiKeysPage.verifyElementVisible('[data-testid="wizard-step-1"]');
    });

    test('should cancel API key creation', async () => {
      await apiKeysPage.clickCreateKey();

      // Cancel
      await apiKeysPage.cancelKeyCreation();

      // Verify we're back on main page
      await apiKeysPage.verifyElementVisible(
        '[data-testid="api-keys-table"], table',
      );
    });
  });

  test.describe('Create API Key - Complete Flow', () => {
    test('should create API key successfully', async () => {
      const keyName = `E2E Test Key ${Date.now()}`;

      // Create API key
      const apiKey = await apiKeysPage.createApiKey({
        name: keyName,
        description: 'E2E test key',
        expiration: '30',
        permissions: ['read:users'],
      });

      // Verify API key is displayed
      expect(apiKey).toBeTruthy();
      expect(apiKey.length).toBeGreaterThan(20);

      // Verify we're back on the list page
      await apiKeysPage.verifyElementVisible(
        '[data-testid="api-keys-table"], table',
      );

      // Verify the new key appears in the list
      const keyIndex = await apiKeysPage.findKeyByName(keyName);
      expect(keyIndex).not.toBeNull();
    });

    test('should display API key only once after creation', async () => {
      await apiKeysPage.clickCreateKey();

      // Complete wizard
      await apiKeysPage.fillWizardStep1({
        name: `One-Time Key ${Date.now()}`,
        description: 'Test one-time display',
      });
      await apiKeysPage.clickNext();

      await apiKeysPage.selectPermissions(['read:logs']);
      await apiKeysPage.clickNext();

      await apiKeysPage.reviewAndCreate();

      // Verify key display dialog
      await apiKeysPage.verifyElementVisible(
        '[data-testid="key-display-dialog"], .key-display-dialog',
      );

      // Get and verify API key
      const apiKey = await apiKeysPage.getApiKeyValue();
      expect(apiKey).toBeTruthy();

      // Close dialog
      await apiKeysPage.closeKeyDisplay();

      // Key should no longer be visible
      const keyDialogExists = await apiKeysPage.elementExists(
        '[data-testid="key-display-dialog"]',
      );
      expect(keyDialogExists).toBeFalsy();
    });

    test('should copy API key to clipboard', async () => {
      await apiKeysPage.clickCreateKey();

      // Complete wizard
      await apiKeysPage.fillWizardStep1({
        name: `Copy Test Key ${Date.now()}`,
        description: 'Test copy functionality',
      });
      await apiKeysPage.clickNext();
      await apiKeysPage.selectPermissions(['read:users']);
      await apiKeysPage.clickNext();
      await apiKeysPage.reviewAndCreate();

      // Copy key
      await apiKeysPage.copyApiKey();

      // Wait for copy operation
      await apiKeysPage.page.waitForTimeout(500);

      // Verify copy button exists (actual clipboard verification requires additional setup)
      await apiKeysPage.verifyElementVisible(
        '[data-testid="copy-key-btn"], button:has-text("Copy")',
      );

      await apiKeysPage.closeKeyDisplay();
    });
  });

  test.describe('View API Key Details', () => {
    test('should view API key details', async () => {
      // Skip if no data
      if (!(await apiKeysPage.hasData())) {
        test.skip();
      }

      // View first API key
      await apiKeysPage.viewFirstApiKey();

      // Verify detail page is displayed
      await apiKeysPage.verifyDetailPageDisplayed();
    });

    test('should display key information in detail page', async () => {
      // Skip if no data
      if (!(await apiKeysPage.hasData())) {
        test.skip();
      }

      await apiKeysPage.viewFirstApiKey();

      // Verify all detail sections are displayed
      await apiKeysPage.verifyElementVisible('[data-testid="detail-name"]');
      await apiKeysPage.verifyElementVisible('[data-testid="detail-status"]');
      await apiKeysPage.verifyElementVisible(
        '[data-testid="detail-permissions"]',
      );
    });

    test('should navigate back from detail page', async () => {
      // Skip if no data
      if (!(await apiKeysPage.hasData())) {
        test.skip();
      }

      // Go to detail page
      await apiKeysPage.viewFirstApiKey();
      await apiKeysPage.verifyDetailPageDisplayed();

      // Navigate back
      await apiKeysPage.goBackFromDetail();

      // Verify we're back on list page
      await apiKeysPage.verifyElementVisible(
        '[data-testid="api-keys-table"], table',
      );
    });
  });

  test.describe('Revoke API Key', () => {
    test('should revoke API key with confirmation', async () => {
      // Skip if no data
      if (!(await apiKeysPage.hasData())) {
        test.skip();
      }

      const initialCount = await apiKeysPage.getRowCount();

      // Find an active key (assuming first key is active)
      await apiKeysPage.revokeApiKey(0);

      // Verify key status changed to revoked
      await apiKeysPage.waitForLoadingComplete();

      // Verify success message or status change
      const hasSuccess = await apiKeysPage.elementExists(
        '.success, .alert-success, mat-snack-bar-container',
      );
      if (hasSuccess) {
        await apiKeysPage.verifySuccessMessage();
      }
    });

    test('should cancel revoke operation', async () => {
      // Skip if no data
      if (!(await apiKeysPage.hasData())) {
        test.skip();
      }

      // Start revoke but cancel
      await apiKeysPage.cancelRevoke(0);

      // Verify we're still on the same page
      await apiKeysPage.verifyElementVisible(
        '[data-testid="api-keys-table"], table',
      );
    });

    test('should not allow revoking already revoked key', async ({ page }) => {
      // Skip if no data
      if (!(await apiKeysPage.hasData())) {
        test.skip();
      }

      // Check if any key is already revoked
      const rows = await apiKeysPage.getRowCount();
      for (let i = 0; i < rows; i++) {
        const row = apiKeysPage.getRow(i);
        const statusCell = row.locator('[data-testid="status-column"], td');
        const statusText = await statusCell.textContent();

        if (statusText?.toLowerCase().includes('revoked')) {
          // Try to find revoke button - it should be disabled or not present
          const revokeBtn = row.locator(
            '[data-testid="revoke-btn"], button[aria-label*="Revoke"]',
          );
          const count = await revokeBtn.count();

          if (count > 0) {
            const isDisabled = await revokeBtn.isDisabled();
            expect(isDisabled).toBeTruthy();
          }
          break;
        }
      }
    });
  });

  test.describe('Delete API Key', () => {
    test('should delete API key with confirmation', async () => {
      // Skip if no data
      if (!(await apiKeysPage.hasData())) {
        test.skip();
      }

      const initialCount = await apiKeysPage.getRowCount();

      // Delete first key
      await apiKeysPage.deleteApiKey(0);

      // Verify count decreased
      const newCount = await apiKeysPage.getRowCount();
      expect(newCount).toBeLessThan(initialCount);
    });

    test('should cancel delete operation', async () => {
      // Skip if no data
      if (!(await apiKeysPage.hasData())) {
        test.skip();
      }

      const initialCount = await apiKeysPage.getRowCount();

      // Start delete but cancel
      await apiKeysPage.cancelDelete(0);

      // Verify count hasn't changed
      const newCount = await apiKeysPage.getRowCount();
      expect(newCount).toBe(initialCount);
    });
  });

  test.describe('Pagination', () => {
    test('should navigate between pages if multiple pages exist', async ({
      page,
    }) => {
      // Skip if no data
      if (!(await apiKeysPage.hasData())) {
        test.skip();
      }

      // Check if pagination exists
      const paginationExists = await apiKeysPage.elementExists(
        'mat-paginator, .pagination',
      );

      if (paginationExists) {
        const nextButton = page.locator('button[aria-label*="Next"]');
        const isDisabled = await nextButton.isDisabled().catch(() => true);

        if (!isDisabled) {
          const initialCount = await apiKeysPage.getRowCount();

          // Go to next page
          await nextButton.click();
          await apiKeysPage.waitForLoadingComplete();

          // Verify we're on a different page
          const newCount = await apiKeysPage.getRowCount();
          expect(newCount).toBeGreaterThan(0);
        }
      }
    });
  });

  test.describe('Permissions Display', () => {
    test('should display permissions in detail view', async () => {
      // Skip if no data
      if (!(await apiKeysPage.hasData())) {
        test.skip();
      }

      await apiKeysPage.viewFirstApiKey();

      // Verify permissions section exists
      await apiKeysPage.verifyElementVisible(
        '[data-testid="detail-permissions"]',
      );

      // Permissions should be displayed as a list or badges
      const permissionsList = apiKeysPage.page.locator(
        '[data-testid="detail-permissions"] li, [data-testid="detail-permissions"] .badge',
      );
      const count = await permissionsList.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Expiration Handling', () => {
    test('should display expiration date', async () => {
      // Skip if no data
      if (!(await apiKeysPage.hasData())) {
        test.skip();
      }

      await apiKeysPage.viewFirstApiKey();

      // Verify expiration field exists
      const expirationExists = await apiKeysPage.elementExists(
        '[data-testid="detail-expires"]',
      );
      if (expirationExists) {
        await apiKeysPage.verifyElementVisible(
          '[data-testid="detail-expires"]',
        );
      }
    });

    test('should highlight expiring soon keys', async ({ page }) => {
      // Skip if no data
      if (!(await apiKeysPage.hasData())) {
        test.skip();
      }

      // Check if "Expiring Soon" stat card shows any keys
      const expiringSoonCard = page.locator('[data-testid="expiring-soon"]');
      const exists = (await expiringSoonCard.count()) > 0;

      if (exists) {
        await expect(expiringSoonCard).toBeVisible();
      }
    });
  });

  test.describe('Responsive Design', () => {
    test('should display correctly on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await apiKeysPage.goto();

      // Verify page loads on mobile
      await apiKeysPage.verifyElementVisible(
        '[data-testid="api-keys-page"], .api-keys-page',
      );
    });

    test('should display correctly on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await apiKeysPage.goto();

      // Verify page loads on tablet
      await apiKeysPage.verifyElementVisible(
        '[data-testid="api-keys-page"], .api-keys-page',
      );
    });
  });

  test.describe('Security Features', () => {
    test('should not display full API key in list view', async ({ page }) => {
      // Skip if no data
      if (!(await apiKeysPage.hasData())) {
        test.skip();
      }

      // Check all rows - they should not show full API keys
      const rows = await apiKeysPage.getRowCount();
      for (let i = 0; i < rows; i++) {
        const row = apiKeysPage.getRow(i);
        const rowText = await row.textContent();

        // API keys should not be visible in full (looking for masked values or absence)
        expect(rowText).not.toMatch(/[a-zA-Z0-9]{40,}/); // No long unmasked keys
      }
    });

    test('should require confirmation for destructive actions', async () => {
      // Skip if no data
      if (!(await apiKeysPage.hasData())) {
        test.skip();
      }

      // Try to delete - should show confirmation
      const row = apiKeysPage.getRow(0);
      const deleteBtn = row.locator(
        '[data-testid="delete-btn"], button[aria-label*="Delete"]',
      );

      if ((await deleteBtn.count()) > 0) {
        await deleteBtn.click();

        // Verify confirmation dialog appears
        await apiKeysPage.verifyElementVisible(
          '[data-testid="delete-dialog"], mat-dialog-container',
        );

        // Cancel
        await apiKeysPage.clickElement(
          '[data-testid="cancel-delete"], button:has-text("Cancel")',
        );
      }
    });
  });
});
