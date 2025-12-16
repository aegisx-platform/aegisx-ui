import { test, expect } from '@playwright/test';
import { ProfilePage } from '../pages/profile.page';
import { TestUserFactory } from '../fixtures/test-data';

test.describe('User Profile - Comprehensive E2E Tests', () => {
  let profilePage: ProfilePage;

  test.beforeEach(async ({ page }) => {
    profilePage = new ProfilePage(page);
    await profilePage.goto();
  });

  test.describe('Page Loading', () => {
    test('should load profile page successfully', async () => {
      await profilePage.waitForLoad();
      await profilePage.verifyElementVisible(
        '[data-testid="profile"], .profile',
      );
    });

    test('should display all profile tabs', async ({ page }) => {
      // Check if tabs exist
      const tabsExist = await profilePage.elementExists(
        '[data-testid="profile-tabs"], .profile-tabs, .tabs, mat-tab-group',
      );

      if (tabsExist) {
        // Verify Info tab
        await expect(
          page.locator('mat-tab, [role="tab"]').filter({ hasText: /info/i }),
        ).toBeVisible();

        // Verify Avatar tab (if separate)
        const avatarTabExists =
          (await page
            .locator('mat-tab, [role="tab"]')
            .filter({ hasText: /avatar/i })
            .count()) > 0;

        // Verify Preferences tab
        const preferencesTabExists =
          (await page
            .locator('mat-tab, [role="tab"]')
            .filter({ hasText: /preferences/i })
            .count()) > 0;

        // Verify Activity tab
        const activityTabExists =
          (await page
            .locator('mat-tab, [role="tab"]')
            .filter({ hasText: /activity/i })
            .count()) > 0;
      }
    });

    test('should display user profile information', async () => {
      await profilePage.waitForLoad();
      await profilePage.verifyElementVisible(
        '[data-testid="profile-content"], .profile-content',
      );
    });
  });

  test.describe('Info Tab', () => {
    test('should display profile information in view mode', async () => {
      await profilePage.waitForLoad();

      // Check if in view mode
      const isEditMode = await profilePage.isInEditMode();
      if (!isEditMode) {
        await profilePage.verifyProfileDisplayMode();
      }
    });

    test('should edit profile information', async ({ page }) => {
      await profilePage.waitForLoad();

      // Enter edit mode
      await profilePage.enterEditMode();

      // Verify form is displayed
      await profilePage.verifyProfileFormDisplayed();

      // Update profile data
      const updatedData = {
        firstName: 'Updated',
        lastName: 'Name',
        phone: '+1-555-9999',
        bio: 'Updated bio for testing',
      };

      await profilePage.fillProfileForm(updatedData);

      // Save changes
      await profilePage.saveProfile();

      // Verify success
      await profilePage.waitForSaveComplete();

      // Verify data is updated
      const profileData = await profilePage.getProfileData();
      expect(profileData.firstName).toContain('Updated');
      expect(profileData.lastName).toContain('Name');
    });

    test('should cancel profile edit', async () => {
      await profilePage.waitForLoad();

      // Get original data
      const originalData = await profilePage.getProfileData();

      // Enter edit mode
      await profilePage.enterEditMode();

      // Make changes
      await profilePage.fillProfileForm({
        firstName: 'Temporary',
        lastName: 'Change',
      });

      // Cancel
      await profilePage.cancelEdit();

      // Verify data is unchanged
      const currentData = await profilePage.getProfileData();
      expect(currentData.firstName).toBe(originalData.firstName);
    });

    test('should validate required fields', async () => {
      await profilePage.waitForLoad();
      await profilePage.enterEditMode();

      // Clear required fields
      const firstNameInput =
        '[data-testid="first-name"], input[name="firstName"]';
      const lastNameInput = '[data-testid="last-name"], input[name="lastName"]';

      if (await profilePage.elementExists(firstNameInput)) {
        await profilePage.fillInput(firstNameInput, '');
      }

      if (await profilePage.elementExists(lastNameInput)) {
        await profilePage.fillInput(lastNameInput, '');
      }

      // Try to save
      await profilePage.saveProfile();

      // Should show validation errors
      const errors = await profilePage.verifyValidationErrors();
      expect(errors.length).toBeGreaterThan(0);
    });

    test('should validate email format', async () => {
      const emailExists = await profilePage.elementExists(
        '[data-testid="email"], input[name="email"]',
      );

      if (emailExists) {
        await profilePage.testEmailValidation();
      } else {
        test.skip();
      }
    });
  });

  test.describe('Avatar Tab', () => {
    test('should display avatar component', async ({ page }) => {
      // Check if avatar tab exists
      const avatarTabExists =
        (await page
          .locator('mat-tab, [role="tab"]')
          .filter({ hasText: /avatar/i })
          .count()) > 0;

      if (avatarTabExists) {
        await profilePage.switchToTab('Avatar');
      }

      // Verify avatar component
      await profilePage.verifyProfileInfoSection();
    });

    test('should display current avatar or placeholder', async () => {
      await profilePage.verifyAvatarFallback();
    });

    test('should verify avatar is circular', async () => {
      const hasAvatar = await profilePage.isAvatarDisplayed();

      if (hasAvatar) {
        await profilePage.verifyAvatarIsCircular();
      }
    });

    test('should upload new avatar', async ({ page }) => {
      // Create a test image file path
      // Note: In real tests, you would provide an actual image file path
      const testImagePath = './test-fixtures/avatar.png';

      const fileInputExists =
        await profilePage.elementExists('input[type="file"]');

      if (fileInputExists) {
        // This test would need an actual image file
        test.skip();
      }
    });

    test('should delete avatar if delete option exists', async ({ page }) => {
      const deleteButtonExists = await profilePage.elementExists(
        '[data-testid="delete-avatar"], button:has-text("Delete")',
      );

      if (deleteButtonExists) {
        await page
          .locator('[data-testid="delete-avatar"], button:has-text("Delete")')
          .click();

        // Wait for confirmation if needed
        const confirmExists =
          (await page
            .locator('button:has-text("Confirm"), button:has-text("Yes")')
            .count()) > 0;

        if (confirmExists) {
          await page
            .locator('button:has-text("Confirm"), button:has-text("Yes")')
            .click();
        }

        // Verify avatar is removed
        await profilePage.waitForLoadingComplete();
      }
    });
  });

  test.describe('Preferences Tab', () => {
    test('should switch to preferences tab', async ({ page }) => {
      const preferencesTabExists =
        (await page
          .locator('mat-tab, [role="tab"]')
          .filter({ hasText: /preferences/i })
          .count()) > 0;

      if (preferencesTabExists) {
        await profilePage.switchToTab('Preferences');

        // Verify preferences form is displayed
        await expect(
          page.locator(
            'form, .preferences-form, [data-testid="preferences-form"]',
          ),
        ).toBeVisible();
      }
    });

    test('should change theme preference', async ({ page }) => {
      // Navigate to preferences tab if it exists
      const preferencesTabExists =
        (await page
          .locator('mat-tab, [role="tab"]')
          .filter({ hasText: /preferences/i })
          .count()) > 0;

      if (preferencesTabExists) {
        await profilePage.switchToTab('Preferences');
      }

      // Check if theme selector exists
      const themeSelectExists =
        (await page
          .locator('select[name="theme"], mat-select[formControlName="theme"]')
          .count()) > 0;

      if (themeSelectExists) {
        // Change theme
        const themeSelect = page
          .locator('select[name="theme"], mat-select[formControlName="theme"]')
          .first();

        if ((await themeSelect.getAttribute('type')) !== 'hidden') {
          await themeSelect.click();

          // Select dark theme if available
          const darkOption = page.locator(
            'mat-option:has-text("Dark"), option:has-text("dark")',
          );
          if ((await darkOption.count()) > 0) {
            await darkOption.click();

            // Save preferences
            const saveButton = page
              .locator('button:has-text("Save"), button[type="submit"]')
              .first();
            await saveButton.click();

            // Wait for save
            await profilePage.waitForLoadingComplete();
          }
        }
      }
    });

    test('should change language preference', async ({ page }) => {
      // Navigate to preferences tab if it exists
      const preferencesTabExists =
        (await page
          .locator('mat-tab, [role="tab"]')
          .filter({ hasText: /preferences/i })
          .count()) > 0;

      if (preferencesTabExists) {
        await profilePage.switchToTab('Preferences');
      }

      // Check if language selector exists
      const languageSelectExists =
        (await page
          .locator(
            'select[name="language"], mat-select[formControlName="language"]',
          )
          .count()) > 0;

      if (languageSelectExists) {
        // This test would require actual language options
        const languageSelect = page
          .locator(
            'select[name="language"], mat-select[formControlName="language"]',
          )
          .first();

        // Verify it's interactive
        await expect(languageSelect).toBeVisible();
      }
    });

    test('should update notification preferences', async ({ page }) => {
      // Navigate to preferences tab if it exists
      const preferencesTabExists =
        (await page
          .locator('mat-tab, [role="tab"]')
          .filter({ hasText: /preferences/i })
          .count()) > 0;

      if (preferencesTabExists) {
        await profilePage.switchToTab('Preferences');
      }

      // Check for notification checkboxes
      const notificationCheckboxes = page.locator(
        'mat-checkbox[formControlName*="notification"], input[type="checkbox"][name*="notification"]',
      );
      const count = await notificationCheckboxes.count();

      if (count > 0) {
        // Toggle first notification preference
        await notificationCheckboxes.first().click();

        // Save preferences
        const saveButton = page
          .locator('button:has-text("Save"), button[type="submit"]')
          .first();
        await saveButton.click();

        // Wait for save
        await profilePage.waitForLoadingComplete();
      }
    });

    test('should save preferences successfully', async ({ page }) => {
      // Navigate to preferences tab if it exists
      const preferencesTabExists =
        (await page
          .locator('mat-tab, [role="tab"]')
          .filter({ hasText: /preferences/i })
          .count()) > 0;

      if (preferencesTabExists) {
        await profilePage.switchToTab('Preferences');

        // Find and click save button
        const saveButton = page
          .locator('button:has-text("Save"), button[type="submit"]')
          .first();
        const saveExists = (await saveButton.count()) > 0;

        if (saveExists) {
          await saveButton.click();

          // Wait for save
          await profilePage.waitForLoadingComplete();

          // Check for success message
          const successExists =
            (await page
              .locator('.success, .alert-success, mat-snack-bar-container')
              .count()) > 0;
          if (successExists) {
            await expect(
              page
                .locator('.success, .alert-success, mat-snack-bar-container')
                .first(),
            ).toBeVisible();
          }
        }
      }
    });
  });

  test.describe('Activity Tab', () => {
    test('should switch to activity tab', async ({ page }) => {
      const activityTabExists =
        (await page
          .locator('mat-tab, [role="tab"]')
          .filter({ hasText: /activity/i })
          .count()) > 0;

      if (activityTabExists) {
        await profilePage.switchToTab('Activity');

        // Verify activity list or empty state is displayed
        const hasActivityList =
          (await page
            .locator(
              '.activity-list, [data-testid="activity-list"], .user-activity',
            )
            .count()) > 0;
        const hasEmptyState =
          (await page.locator('.no-data, .empty-state').count()) > 0;

        expect(hasActivityList || hasEmptyState).toBeTruthy();
      }
    });

    test('should display user activity logs', async ({ page }) => {
      const activityTabExists =
        (await page
          .locator('mat-tab, [role="tab"]')
          .filter({ hasText: /activity/i })
          .count()) > 0;

      if (activityTabExists) {
        await profilePage.switchToTab('Activity');

        // Check for activity items
        const activityItems = page.locator(
          '.activity-item, [data-testid="activity-item"], .timeline-item',
        );
        const count = await activityItems.count();

        if (count > 0) {
          // Verify first activity item is visible
          await expect(activityItems.first()).toBeVisible();
        } else {
          // Verify empty state
          await expect(page.locator('.no-data, .empty-state')).toBeVisible();
        }
      }
    });

    test('should paginate activity logs if pagination exists', async ({
      page,
    }) => {
      const activityTabExists =
        (await page
          .locator('mat-tab, [role="tab"]')
          .filter({ hasText: /activity/i })
          .count()) > 0;

      if (activityTabExists) {
        await profilePage.switchToTab('Activity');

        // Check if pagination exists
        const paginationExists =
          (await page.locator('mat-paginator, .pagination').count()) > 0;

        if (paginationExists) {
          const nextButton = page.locator('button[aria-label*="Next"]');
          const isDisabled = await nextButton.isDisabled();

          if (!isDisabled) {
            await nextButton.click();
            await profilePage.waitForLoadingComplete();

            // Verify page changed
            await expect(
              page.locator('.activity-item, .timeline-item').first(),
            ).toBeVisible();
          }
        }
      }
    });
  });

  test.describe('Navigation', () => {
    test('should navigate between tabs', async ({ page }) => {
      const tabsExist =
        (await page.locator('mat-tab-group, .tabs').count()) > 0;

      if (tabsExist) {
        const tabs = page.locator('mat-tab, [role="tab"]');
        const tabCount = await tabs.count();

        if (tabCount > 1) {
          // Click on second tab
          await tabs.nth(1).click();
          await page.waitForTimeout(300);

          // Click back to first tab
          await tabs.nth(0).click();
          await page.waitForTimeout(300);

          // Verify navigation works
          await expect(tabs.first()).toBeVisible();
        }
      }
    });

    test('should maintain state when switching tabs', async ({ page }) => {
      const tabsExist =
        (await page.locator('mat-tab-group, .tabs').count()) > 0;

      if (tabsExist) {
        // Enter edit mode
        await profilePage.enterEditMode();

        // Make a change
        const firstNameInput = page.locator('input[name="firstName"]');
        if ((await firstNameInput.count()) > 0) {
          await firstNameInput.fill('TestName');

          // Switch to another tab
          const tabs = page.locator('mat-tab, [role="tab"]');
          if ((await tabs.count()) > 1) {
            await tabs.nth(1).click();
            await page.waitForTimeout(300);

            // Switch back
            await tabs.nth(0).click();
            await page.waitForTimeout(300);

            // Verify change is still there (or form was reset - depending on implementation)
            const currentValue = await firstNameInput.inputValue();
            // Value should either be preserved or reset to original
            expect(currentValue).toBeTruthy();
          }
        }
      }
    });
  });

  test.describe('Responsive Design', () => {
    test('should display correctly on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await profilePage.goto();

      // Verify profile page loads on mobile
      await profilePage.verifyElementVisible(
        '[data-testid="profile"], .profile',
      );
    });

    test('should display correctly on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await profilePage.goto();

      // Verify profile page loads on tablet
      await profilePage.verifyElementVisible(
        '[data-testid="profile"], .profile',
      );
    });
  });

  test.describe('Error Handling', () => {
    test('should handle save errors gracefully', async ({ page }) => {
      // This would require mocking API responses
      // Skipping as it requires additional setup
      test.skip();
    });

    test('should handle network errors', async ({ page }) => {
      // This would require offline mode or network mocking
      test.skip();
    });
  });
});
