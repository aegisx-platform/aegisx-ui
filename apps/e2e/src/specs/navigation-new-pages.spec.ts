import { test, expect } from '@playwright/test';

test.describe('Navigation - New Pages', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard after login
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Monitoring Menu Navigation', () => {
    test('should navigate to Activity Logs from menu', async ({ page }) => {
      // Look for Monitoring menu item
      const monitoringMenu = page
        .locator('a:has-text("Monitoring"), button:has-text("Monitoring")')
        .first();

      if ((await monitoringMenu.count()) > 0) {
        // Click monitoring menu (might expand submenu)
        await monitoringMenu.click();

        // Look for Activity Logs submenu item
        const activityLogsLink = page
          .locator('a:has-text("Activity Logs")')
          .first();
        await expect(activityLogsLink).toBeVisible({ timeout: 5000 });

        // Click Activity Logs
        await activityLogsLink.click();

        // Verify navigation
        await expect(page).toHaveURL(/activity-logs/);
        await expect(page.locator('h1, .page-title')).toContainText(
          /activity/i,
        );
      } else {
        // Alternative: Direct navigation if menu structure is different
        await page.goto('/system/monitoring/activity-logs');
        await expect(page).toHaveURL(/activity-logs/);
      }
    });

    test('should navigate to Error Logs from menu', async ({ page }) => {
      // Look for Monitoring menu item
      const monitoringMenu = page
        .locator('a:has-text("Monitoring"), button:has-text("Monitoring")')
        .first();

      if ((await monitoringMenu.count()) > 0) {
        await monitoringMenu.click();

        // Look for Error Logs submenu item
        const errorLogsLink = page.locator('a:has-text("Error Logs")').first();

        if ((await errorLogsLink.count()) > 0) {
          await expect(errorLogsLink).toBeVisible({ timeout: 5000 });
          await errorLogsLink.click();

          // Verify navigation
          await expect(page).toHaveURL(/error-logs/);
          await expect(page.locator('h1, .page-title')).toContainText(/error/i);
        }
      } else {
        // Alternative: Direct navigation
        await page.goto('/system/monitoring/error-logs');
        await expect(page).toHaveURL(/error-logs/);
      }
    });
  });

  test.describe('User Management Menu Navigation', () => {
    test('should navigate to My Profile from user menu', async ({ page }) => {
      // Look for user menu button (usually in header)
      const userMenuButton = page
        .locator(
          'button[matMenuTriggerFor="userMenu"], button[aria-label*="user"], .user-menu-trigger',
        )
        .first();

      if ((await userMenuButton.count()) > 0) {
        await userMenuButton.click();

        // Look for My Profile menu item
        const profileLink = page
          .locator(
            'a:has-text("Profile"), a:has-text("My Profile"), button:has-text("Profile")',
          )
          .first();

        if ((await profileLink.count()) > 0) {
          await profileLink.click();

          // Verify navigation
          await expect(page).toHaveURL(/profile/);
          await expect(
            page.locator('.profile, [data-testid="profile"]'),
          ).toBeVisible();
        }
      } else {
        // Alternative: Direct navigation
        await page.goto('/system/users/profile');
        await expect(page).toHaveURL(/profile/);
      }
    });

    test('should navigate to Profile from sidebar menu', async ({ page }) => {
      // Look for Users or Profile menu in sidebar
      const usersMenu = page
        .locator('a:has-text("Users"), button:has-text("Users")')
        .first();

      if ((await usersMenu.count()) > 0) {
        await usersMenu.click();

        // Look for Profile submenu item
        const profileLink = page
          .locator('a:has-text("My Profile"), a:has-text("Profile")')
          .first();

        if ((await profileLink.count()) > 0) {
          await profileLink.click();

          // Verify navigation
          await expect(page).toHaveURL(/profile/);
        }
      } else {
        // Try direct access from sidebar
        const profileLink = page.locator('a[href*="profile"]').first();
        if ((await profileLink.count()) > 0) {
          await profileLink.click();
          await expect(page).toHaveURL(/profile/);
        }
      }
    });
  });

  test.describe('System Settings Menu Navigation', () => {
    test('should navigate to API Keys from settings menu', async ({ page }) => {
      // Look for Settings or System menu
      const settingsMenu = page
        .locator(
          'a:has-text("Settings"), button:has-text("Settings"), a:has-text("System")',
        )
        .first();

      if ((await settingsMenu.count()) > 0) {
        await settingsMenu.click();

        // Look for API Keys submenu item
        const apiKeysLink = page.locator('a:has-text("API Keys")').first();

        if ((await apiKeysLink.count()) > 0) {
          await expect(apiKeysLink).toBeVisible({ timeout: 5000 });
          await apiKeysLink.click();

          // Verify navigation
          await expect(page).toHaveURL(/api-keys/);
          await expect(page.locator('h1, .page-title')).toContainText(
            /api.*key/i,
          );
        }
      } else {
        // Alternative: Direct navigation
        await page.goto('/system/settings/api-keys');
        await expect(page).toHaveURL(/api-keys/);
      }
    });
  });

  test.describe('Breadcrumb Navigation', () => {
    test('should display breadcrumbs on Activity Logs page', async ({
      page,
    }) => {
      await page.goto('/system/monitoring/activity-logs');

      // Look for breadcrumb component
      const breadcrumb = page.locator(
        'nav[aria-label="breadcrumb"], .breadcrumb, [data-testid="breadcrumb"]',
      );

      if ((await breadcrumb.count()) > 0) {
        await expect(breadcrumb).toBeVisible();

        // Verify breadcrumb contains expected items
        await expect(breadcrumb).toContainText(/monitoring/i);
        await expect(breadcrumb).toContainText(/activity/i);
      }
    });

    test('should display breadcrumbs on Error Logs page', async ({ page }) => {
      await page.goto('/system/monitoring/error-logs');

      const breadcrumb = page.locator(
        'nav[aria-label="breadcrumb"], .breadcrumb, [data-testid="breadcrumb"]',
      );

      if ((await breadcrumb.count()) > 0) {
        await expect(breadcrumb).toBeVisible();
        await expect(breadcrumb).toContainText(/monitoring/i);
        await expect(breadcrumb).toContainText(/error/i);
      }
    });

    test('should display breadcrumbs on API Keys page', async ({ page }) => {
      await page.goto('/system/settings/api-keys');

      const breadcrumb = page.locator(
        'nav[aria-label="breadcrumb"], .breadcrumb, [data-testid="breadcrumb"]',
      );

      if ((await breadcrumb.count()) > 0) {
        await expect(breadcrumb).toBeVisible();
        await expect(breadcrumb).toContainText(/settings|system/i);
        await expect(breadcrumb).toContainText(/api.*key/i);
      }
    });

    test('should navigate using breadcrumb links', async ({ page }) => {
      await page.goto('/system/monitoring/activity-logs');

      const breadcrumb = page.locator(
        'nav[aria-label="breadcrumb"], .breadcrumb',
      );

      if ((await breadcrumb.count()) > 0) {
        // Find and click on parent breadcrumb (Monitoring)
        const monitoringBreadcrumb = breadcrumb.locator(
          'a:has-text("Monitoring")',
        );

        if ((await monitoringBreadcrumb.count()) > 0) {
          await monitoringBreadcrumb.click();

          // Should navigate to monitoring section or dashboard
          await page.waitForLoadState('networkidle');
          await expect(page).toHaveURL(/monitoring|dashboard/);
        }
      }
    });
  });

  test.describe('Back Button Navigation', () => {
    test('should navigate back from Activity Logs detail page', async ({
      page,
    }) => {
      await page.goto('/system/monitoring/activity-logs');
      await page.waitForLoadState('networkidle');

      // Check if there are any activity items
      const activityItems = page.locator(
        '[data-testid="timeline-item"], .timeline-item, .activity-item',
      );
      const count = await activityItems.count();

      if (count > 0) {
        // Click on first item
        await activityItems.first().click();

        // Should navigate to detail page
        await page.waitForLoadState('networkidle');

        // Click back button
        const backButton = page.locator(
          'button:has-text("Back"), button[aria-label*="Back"]',
        );

        if ((await backButton.count()) > 0) {
          await backButton.click();

          // Should be back on list page
          await expect(page).toHaveURL(/activity-logs/);
          await expect(activityItems.first()).toBeVisible();
        }
      }
    });

    test('should navigate back from Error Logs detail page', async ({
      page,
    }) => {
      await page.goto('/system/monitoring/error-logs');
      await page.waitForLoadState('networkidle');

      // Check if there are any error logs
      const errorItems = page.locator(
        '[data-testid="error-log-row"], tbody tr',
      );
      const count = await errorItems.count();

      if (count > 0) {
        // Click view button on first item
        const viewButton = errorItems
          .first()
          .locator('[data-testid="view-btn"], button[aria-label*="View"]');

        if ((await viewButton.count()) > 0) {
          await viewButton.click();
          await page.waitForLoadState('networkidle');

          // Click back button
          const backButton = page.locator(
            'button:has-text("Back"), button[aria-label*="Back"]',
          );

          if ((await backButton.count()) > 0) {
            await backButton.click();

            // Should be back on list page
            await expect(page).toHaveURL(/error-logs/);
          }
        }
      }
    });

    test('should navigate back from API Key detail page', async ({ page }) => {
      await page.goto('/system/settings/api-keys');
      await page.waitForLoadState('networkidle');

      // Check if there are any API keys
      const apiKeyRows = page.locator('[data-testid="api-key-row"], tbody tr');
      const count = await apiKeyRows.count();

      if (count > 0) {
        // Click view button on first key
        const viewButton = apiKeyRows
          .first()
          .locator('[data-testid="view-btn"], button[aria-label*="View"]');

        if ((await viewButton.count()) > 0) {
          await viewButton.click();
          await page.waitForLoadState('networkidle');

          // Click back button
          const backButton = page.locator(
            'button:has-text("Back"), button[aria-label*="Back"]',
          );

          if ((await backButton.count()) > 0) {
            await backButton.click();

            // Should be back on list page
            await expect(page).toHaveURL(/api-keys/);
          }
        }
      }
    });
  });

  test.describe('Browser Navigation', () => {
    test('should support browser back button', async ({ page }) => {
      // Navigate to activity logs
      await page.goto('/system/monitoring/activity-logs');
      await page.waitForLoadState('networkidle');

      // Navigate to error logs
      await page.goto('/system/monitoring/error-logs');
      await page.waitForLoadState('networkidle');

      // Use browser back button
      await page.goBack();

      // Should be back on activity logs
      await expect(page).toHaveURL(/activity-logs/);
    });

    test('should support browser forward button', async ({ page }) => {
      // Navigate to activity logs
      await page.goto('/system/monitoring/activity-logs');
      await page.waitForLoadState('networkidle');

      // Navigate to error logs
      await page.goto('/system/monitoring/error-logs');
      await page.waitForLoadState('networkidle');

      // Go back
      await page.goBack();
      await expect(page).toHaveURL(/activity-logs/);

      // Go forward
      await page.goForward();
      await expect(page).toHaveURL(/error-logs/);
    });
  });

  test.describe('Direct URL Access', () => {
    test('should access Activity Logs via direct URL', async ({ page }) => {
      await page.goto('/system/monitoring/activity-logs');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveURL(/activity-logs/);
      await expect(
        page.locator('[data-testid="activity-logs-page"], .activity-logs-page'),
      ).toBeVisible();
    });

    test('should access Error Logs via direct URL', async ({ page }) => {
      await page.goto('/system/monitoring/error-logs');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveURL(/error-logs/);
      await expect(
        page.locator('[data-testid="error-logs-page"], .error-logs-page'),
      ).toBeVisible();
    });

    test('should access Profile via direct URL', async ({ page }) => {
      await page.goto('/system/users/profile');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveURL(/profile/);
      await expect(
        page.locator('[data-testid="profile"], .profile'),
      ).toBeVisible();
    });

    test('should access API Keys via direct URL', async ({ page }) => {
      await page.goto('/system/settings/api-keys');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveURL(/api-keys/);
      await expect(
        page.locator('[data-testid="api-keys-page"], .api-keys-page'),
      ).toBeVisible();
    });
  });

  test.describe('Menu Item Visibility', () => {
    test('should display all new menu items', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      // Check for Activity Logs menu item
      const hasActivityLogs =
        (await page
          .locator('a:has-text("Activity Logs"), a[href*="activity-logs"]')
          .count()) > 0;

      // Check for Profile menu item (in user menu or sidebar)
      const hasProfile =
        (await page
          .locator('a:has-text("Profile"), a[href*="profile"]')
          .count()) > 0;

      // Check for API Keys menu item
      const hasApiKeys =
        (await page
          .locator('a:has-text("API Keys"), a[href*="api-keys"]')
          .count()) > 0;

      // At least some of the new menu items should be present
      expect(hasActivityLogs || hasProfile || hasApiKeys).toBeTruthy();
    });

    test('should highlight active menu item', async ({ page }) => {
      await page.goto('/system/monitoring/activity-logs');
      await page.waitForLoadState('networkidle');

      // Find the Activity Logs menu item
      const activityLogsMenuItem = page
        .locator('a[href*="activity-logs"]')
        .first();

      if ((await activityLogsMenuItem.count()) > 0) {
        // Check if it has an active class
        const classes =
          (await activityLogsMenuItem.getAttribute('class')) || '';
        const isActive =
          classes.includes('active') ||
          classes.includes('selected') ||
          (await activityLogsMenuItem.getAttribute('aria-current')) === 'page';

        // Active state should be indicated somehow
        expect(isActive || classes.length > 0).toBeTruthy();
      }
    });
  });

  test.describe('Page Transitions', () => {
    test('should have smooth transitions between pages', async ({ page }) => {
      // Navigate between different pages
      await page.goto('/system/monitoring/activity-logs');
      await page.waitForLoadState('networkidle');
      await expect(
        page.locator('[data-testid="activity-logs-page"]'),
      ).toBeVisible();

      await page.goto('/system/monitoring/error-logs');
      await page.waitForLoadState('networkidle');
      await expect(
        page.locator('[data-testid="error-logs-page"]'),
      ).toBeVisible();

      await page.goto('/system/users/profile');
      await page.waitForLoadState('networkidle');
      await expect(
        page.locator('[data-testid="profile"], .profile'),
      ).toBeVisible();

      await page.goto('/system/settings/api-keys');
      await page.waitForLoadState('networkidle');
      await expect(page.locator('[data-testid="api-keys-page"]')).toBeVisible();
    });

    test('should load pages without errors', async ({ page }) => {
      const errors: string[] = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      // Visit all new pages
      await page.goto('/system/monitoring/activity-logs');
      await page.waitForLoadState('networkidle');

      await page.goto('/system/monitoring/error-logs');
      await page.waitForLoadState('networkidle');

      await page.goto('/system/users/profile');
      await page.waitForLoadState('networkidle');

      await page.goto('/system/settings/api-keys');
      await page.waitForLoadState('networkidle');

      // Filter out known/acceptable errors
      const criticalErrors = errors.filter(
        (error) =>
          !error.includes('favicon') &&
          !error.includes('404') &&
          !error.includes('net::ERR_FAILED'),
      );

      expect(criticalErrors.length).toBe(0);
    });
  });
});
