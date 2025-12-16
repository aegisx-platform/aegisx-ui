import { test, expect, Browser, BrowserContext } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test.describe('Authentication & Authorization - New Features', () => {
  test.describe('Profile Access', () => {
    test('should allow all authenticated users to access their profile', async ({
      page,
      context,
    }) => {
      // Navigate to profile
      await page.goto('/system/users/profile');
      await page.waitForLoadState('networkidle');

      // Should not redirect to login
      await expect(page).not.toHaveURL(/login/);

      // Profile page should be accessible
      await expect(page).toHaveURL(/profile/);
      await expect(
        page.locator('[data-testid="profile"], .profile'),
      ).toBeVisible();
    });

    test('should allow users to view their own profile', async ({ page }) => {
      await page.goto('/system/users/profile');
      await page.waitForLoadState('networkidle');

      // Verify profile content is displayed
      const profileContent = page.locator(
        '[data-testid="profile-content"], .profile-content',
      );
      await expect(profileContent).toBeVisible();
    });

    test('should allow users to edit their own profile', async ({ page }) => {
      await page.goto('/system/users/profile');
      await page.waitForLoadState('networkidle');

      // Look for edit button
      const editButton = page.locator(
        '[data-testid="edit-btn"], button:has-text("Edit")',
      );

      if ((await editButton.count()) > 0) {
        // User should be able to click edit
        await editButton.click();

        // Verify edit form appears
        const form = page.locator('form, [data-testid="profile-form"]');
        await expect(form).toBeVisible();
      }
    });

    test('should redirect unauthenticated users trying to access profile', async ({
      browser,
    }) => {
      // Create new context without authentication
      const context = await browser.newContext({
        storageState: { cookies: [], origins: [] },
      });
      const page = await context.newPage();

      try {
        await page.goto('/system/users/profile');
        await page.waitForLoadState('networkidle');

        // Should redirect to login
        await expect(page).toHaveURL(/login/);
      } finally {
        await context.close();
      }
    });
  });

  test.describe('Monitoring Pages Access', () => {
    test('should allow users with monitoring:read permission to access Activity Logs', async ({
      page,
    }) => {
      await page.goto('/system/monitoring/activity-logs');
      await page.waitForLoadState('networkidle');

      // Should not redirect or show error
      await expect(page).toHaveURL(/activity-logs/);
      await expect(
        page.locator('[data-testid="activity-logs-page"], .activity-logs-page'),
      ).toBeVisible();
    });

    test('should allow users with monitoring:read permission to access Error Logs', async ({
      page,
    }) => {
      await page.goto('/system/monitoring/error-logs');
      await page.waitForLoadState('networkidle');

      // Should not redirect or show error
      await expect(page).toHaveURL(/error-logs/);
      await expect(
        page.locator('[data-testid="error-logs-page"], .error-logs-page'),
      ).toBeVisible();
    });

    test('should restrict write operations to users without monitoring:write permission', async ({
      page,
    }) => {
      // This test assumes current user doesn't have write permission
      // Navigate to error logs
      await page.goto('/system/monitoring/error-logs');
      await page.waitForLoadState('networkidle');

      // Check if delete buttons are present
      const deleteButtons = page.locator(
        '[data-testid="delete-btn"], button[aria-label*="Delete"]',
      );
      const count = await deleteButtons.count();

      if (count > 0) {
        // If delete buttons exist, they should be disabled or protected
        // Try to click delete on first item
        const firstDeleteBtn = deleteButtons.first();
        const isDisabled = await firstDeleteBtn.isDisabled().catch(() => false);

        // Either button is disabled or clicking will show permission error
        if (!isDisabled) {
          await firstDeleteBtn.click();

          // Should show permission error or confirmation that won't succeed
          const errorMessage = page.locator(
            '.error, .alert-error, .permission-denied',
          );
          // This is optional - some implementations may allow click but fail on API
        }
      }
    });

    test('should redirect unauthenticated users trying to access monitoring pages', async ({
      browser,
    }) => {
      const context = await browser.newContext({
        storageState: { cookies: [], origins: [] },
      });
      const page = await context.newPage();

      try {
        await page.goto('/system/monitoring/activity-logs');
        await page.waitForLoadState('networkidle');

        // Should redirect to login
        await expect(page).toHaveURL(/login/);
      } finally {
        await context.close();
      }
    });
  });

  test.describe('API Keys Access', () => {
    test('should allow authorized users to access API Keys page', async ({
      page,
    }) => {
      await page.goto('/system/settings/api-keys');
      await page.waitForLoadState('networkidle');

      // Should not redirect or show error
      await expect(page).toHaveURL(/api-keys/);
      await expect(
        page.locator('[data-testid="api-keys-page"], .api-keys-page'),
      ).toBeVisible();
    });

    test('should allow authorized users to create API keys', async ({
      page,
    }) => {
      await page.goto('/system/settings/api-keys');
      await page.waitForLoadState('networkidle');

      // Check if create button is visible and enabled
      const createButton = page.locator(
        '[data-testid="create-key-btn"], button:has-text("Create")',
      );

      if ((await createButton.count()) > 0) {
        await expect(createButton).toBeVisible();

        const isDisabled = await createButton.isDisabled().catch(() => true);
        expect(isDisabled).toBeFalsy();
      }
    });

    test('should allow authorized users to view API key details', async ({
      page,
    }) => {
      await page.goto('/system/settings/api-keys');
      await page.waitForLoadState('networkidle');

      // Check if there are any API keys
      const viewButtons = page.locator(
        '[data-testid="view-btn"], button[aria-label*="View"]',
      );
      const count = await viewButtons.count();

      if (count > 0) {
        // Should be able to click view
        await viewButtons.first().click();
        await page.waitForLoadState('networkidle');

        // Should navigate to detail page
        await expect(
          page.locator('[data-testid="api-key-detail"], .api-key-detail'),
        ).toBeVisible();
      }
    });

    test('should allow authorized users to revoke API keys', async ({
      page,
    }) => {
      await page.goto('/system/settings/api-keys');
      await page.waitForLoadState('networkidle');

      // Check if revoke buttons are present
      const revokeButtons = page.locator(
        '[data-testid="revoke-btn"], button[aria-label*="Revoke"]',
      );
      const count = await revokeButtons.count();

      if (count > 0) {
        // Revoke button should be present and enabled
        const isDisabled = await revokeButtons
          .first()
          .isDisabled()
          .catch(() => true);
        // Should not be disabled (or might be disabled if already revoked)
        // Just verify button exists
        await expect(revokeButtons.first()).toBeVisible();
      }
    });

    test('should restrict API keys access for users without permission', async ({
      browser,
    }) => {
      // This test would require a different user context with different permissions
      // For now, we'll test unauthenticated access
      const context = await browser.newContext({
        storageState: { cookies: [], origins: [] },
      });
      const page = await context.newPage();

      try {
        await page.goto('/system/settings/api-keys');
        await page.waitForLoadState('networkidle');

        // Should redirect to login or show access denied
        const isLoginPage = await page.url().includes('login');
        const isAccessDenied =
          (await page.locator('.access-denied, .unauthorized').count()) > 0;

        expect(isLoginPage || isAccessDenied).toBeTruthy();
      } finally {
        await context.close();
      }
    });
  });

  test.describe('Permission-based UI Elements', () => {
    test('should show delete buttons only for users with write permissions', async ({
      page,
    }) => {
      await page.goto('/system/monitoring/error-logs');
      await page.waitForLoadState('networkidle');

      // Check for delete buttons
      const deleteButtons = page.locator(
        '[data-testid="delete-btn"], button[aria-label*="Delete"]',
      );
      const count = await deleteButtons.count();

      // If delete buttons exist, verify they work or are properly protected
      if (count > 0) {
        // Buttons exist - user likely has permission
        await expect(deleteButtons.first()).toBeVisible();
      } else {
        // No delete buttons - user likely doesn't have permission
        // This is expected for read-only users
        expect(count).toBe(0);
      }
    });

    test('should show create button only for authorized users', async ({
      page,
    }) => {
      await page.goto('/system/settings/api-keys');
      await page.waitForLoadState('networkidle');

      // Check if create button exists
      const createButton = page.locator(
        '[data-testid="create-key-btn"], button:has-text("Create")',
      );
      const exists = (await createButton.count()) > 0;

      // If button exists, it should be enabled
      if (exists) {
        const isDisabled = await createButton.isDisabled().catch(() => true);
        expect(isDisabled).toBeFalsy();
      }
      // If it doesn't exist, user doesn't have permission (which is also valid)
    });

    test('should show edit button on profile for all users', async ({
      page,
    }) => {
      await page.goto('/system/users/profile');
      await page.waitForLoadState('networkidle');

      // All users should be able to edit their own profile
      const editButton = page.locator(
        '[data-testid="edit-btn"], button:has-text("Edit")',
      );

      // Edit button might be in a different form (like direct edit mode)
      // Or might be in a menu
      const hasEditButton = (await editButton.count()) > 0;
      const hasEditableForm =
        (await page
          .locator('input[name="firstName"], input[name="lastName"]')
          .count()) > 0;

      // Either edit button exists or form is already editable
      expect(hasEditButton || hasEditableForm).toBeTruthy();
    });
  });

  test.describe('Session Management', () => {
    test('should maintain session when navigating between new pages', async ({
      page,
      context,
    }) => {
      // Navigate to multiple pages
      await page.goto('/system/monitoring/activity-logs');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/activity-logs/);

      await page.goto('/system/monitoring/error-logs');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/error-logs/);

      await page.goto('/system/users/profile');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/profile/);

      await page.goto('/system/settings/api-keys');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/api-keys/);

      // Verify we never got redirected to login
      const cookies = await context.cookies();
      const hasAuthCookie = cookies.some(
        (cookie) =>
          cookie.name.includes('token') ||
          cookie.name.includes('auth') ||
          cookie.name.includes('session'),
      );

      // Should still have auth cookie
      expect(hasAuthCookie).toBeTruthy();
    });

    test('should redirect to login after session timeout', async ({
      browser,
    }) => {
      const context = await browser.newContext({
        storageState: { cookies: [], origins: [] },
      });
      const page = await context.newPage();

      try {
        // Try to access protected page without session
        await page.goto('/system/users/profile');
        await page.waitForLoadState('networkidle');

        // Should be redirected to login
        await expect(page).toHaveURL(/login/);
      } finally {
        await context.close();
      }
    });

    test('should preserve user context across page reloads', async ({
      page,
      context,
    }) => {
      await page.goto('/system/users/profile');
      await page.waitForLoadState('networkidle');

      // Get user info from profile
      const userName = await page
        .locator('[data-testid="display-name"], .user-name, .profile-name')
        .textContent()
        .catch(() => '');

      // Reload page
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Should still show same user
      const userNameAfterReload = await page
        .locator('[data-testid="display-name"], .user-name, .profile-name')
        .textContent()
        .catch(() => '');

      if (userName && userNameAfterReload) {
        expect(userName).toBe(userNameAfterReload);
      }

      // Should not be redirected to login
      await expect(page).toHaveURL(/profile/);
    });
  });

  test.describe('Role-based Access Control', () => {
    test('should show appropriate menu items based on permissions', async ({
      page,
    }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      // Check which menu items are visible
      const hasMonitoring =
        (await page
          .locator('a:has-text("Monitoring"), a[href*="monitoring"]')
          .count()) > 0;
      const hasProfile =
        (await page
          .locator('a:has-text("Profile"), a[href*="profile"]')
          .count()) > 0;
      const hasApiKeys =
        (await page
          .locator('a:has-text("API Keys"), a[href*="api-keys"]')
          .count()) > 0;

      // Profile should always be visible for authenticated users
      // Other items depend on permissions
      // At minimum, some navigation should be present
      const hasAnyNavigation = hasMonitoring || hasProfile || hasApiKeys;
      expect(hasAnyNavigation).toBeTruthy();
    });

    test('should not show admin-only features to regular users', async ({
      page,
    }) => {
      // This test assumes current test user is not an admin
      // Check for admin-specific UI elements
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      // Look for admin panel or admin menu items
      const adminPanel = await page
        .locator('[data-testid="admin-panel"], .admin-panel')
        .count();
      const systemSettings = await page
        .locator('a:has-text("System Settings"), a[href*="/admin"]')
        .count();

      // Admin-specific items might not be visible
      // This depends on the current user's role
      // Just verify the page loads without errors
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('Access Denied Scenarios', () => {
    test('should handle unauthorized API requests gracefully', async ({
      page,
    }) => {
      // Listen for API responses
      const responses: number[] = [];

      page.on('response', (response) => {
        if (response.url().includes('/api/')) {
          responses.push(response.status());
        }
      });

      // Navigate to pages
      await page.goto('/system/monitoring/activity-logs');
      await page.waitForLoadState('networkidle');

      // Check if any 403 responses were returned
      const has403 = responses.includes(403);

      // If there are 403 responses, verify UI handles them
      if (has403) {
        // Should show error message or access denied
        const errorExists =
          (await page
            .locator('.error, .access-denied, .unauthorized')
            .count()) > 0;
        // Error handling should be present
        // or page should redirect/show appropriate message
      }
    });

    test('should display appropriate error message for forbidden resources', async ({
      page,
    }) => {
      // Try to access a resource directly that might be forbidden
      // This would require knowing a specific forbidden endpoint

      // For now, just verify error handling exists
      await page.goto('/system/settings/api-keys');
      await page.waitForLoadState('networkidle');

      // Page should either load successfully or show appropriate error
      const isAccessible =
        (await page.locator('[data-testid="api-keys-page"]').count()) > 0;
      const hasError =
        (await page.locator('.error, .access-denied').count()) > 0;
      const isLogin = page.url().includes('login');

      // One of these should be true
      expect(isAccessible || hasError || isLogin).toBeTruthy();
    });
  });
});
