import { test, expect, Page } from '@playwright/test';
import { UserPreferencesPage } from '../pages/user-preferences.page';
import { PreferencesApiHelper, PreferencesApiScenarios } from '../support/preferences-api.helper';
import {
  TEST_PREFERENCES,
  DEFAULT_USER_PREFERENCES,
  TestPreferencesFactory,
  UserPreferences
} from '../fixtures/test-data';

test.describe('User Preferences Visual Regression Tests', () => {
  let page: Page;
  let preferencesPage: UserPreferencesPage;
  let apiHelper: PreferencesApiHelper;
  let apiScenarios: PreferencesApiScenarios;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    preferencesPage = new UserPreferencesPage(page);
    apiHelper = new PreferencesApiHelper(page);
    apiScenarios = new PreferencesApiScenarios(apiHelper);
  });

  test.afterEach(async () => {
    await apiHelper.cleanup();
  });

  test.describe('Theme Visual Tests', () => {
    test('should capture visual snapshots of all theme variations', async () => {
      await apiHelper.mockPreferencesEndpoints();
      await preferencesPage.goto();

      const themes = [
        { name: 'default', theme: 'default', scheme: 'light' },
        { name: 'light', theme: 'light', scheme: 'light' },
        { name: 'dark', theme: 'dark', scheme: 'dark' },
        { name: 'auto-light', theme: 'auto', scheme: 'light' },
        { name: 'auto-dark', theme: 'auto', scheme: 'dark' }
      ] as const;

      for (const themeConfig of themes) {
        // Apply theme settings
        await preferencesPage.changeTheme(themeConfig.theme);
        await preferencesPage.changeScheme(themeConfig.scheme);

        // Wait for any theme transitions
        await page.waitForTimeout(500);

        // Take full page screenshot
        await expect(page).toHaveScreenshot(`theme-${themeConfig.name}-full.png`, {
          fullPage: true,
          animations: 'disabled'
        });

        // Take appearance section screenshot
        await expect(page.locator('ax-card:has-text("Appearance")')).toHaveScreenshot(
          `theme-${themeConfig.name}-appearance-section.png`
        );
      }
    });

    test('should verify theme transitions are smooth', async () => {
      await apiHelper.mockPreferencesEndpoints();
      await preferencesPage.goto();

      // Capture initial state
      await expect(page).toHaveScreenshot('theme-transition-initial.png', {
        fullPage: true,
        animations: 'disabled'
      });

      // Change theme and capture intermediate state
      await preferencesPage.changeTheme('dark');
      await page.waitForTimeout(250); // Capture mid-transition
      await expect(page).toHaveScreenshot('theme-transition-intermediate.png', {
        fullPage: true
      });

      // Wait for transition to complete
      await page.waitForTimeout(500);
      await expect(page).toHaveScreenshot('theme-transition-final.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });
  });

  test.describe('Layout Visual Tests', () => {
    test('should capture visual snapshots of all layout variations', async () => {
      await apiHelper.mockPreferencesEndpoints();
      await preferencesPage.goto();

      const layouts = ['classic', 'compact', 'enterprise', 'empty'] as const;

      for (const layout of layouts) {
        await preferencesPage.changeLayout(layout);
        await page.waitForTimeout(300);

        // Take screenshot of the preferences page with this layout
        await expect(page).toHaveScreenshot(`layout-${layout}-preferences.png`, {
          fullPage: true,
          animations: 'disabled'
        });

        // Take screenshot of the appearance section specifically
        await expect(page.locator('ax-card:has-text("Appearance")')).toHaveScreenshot(
          `layout-${layout}-appearance.png`
        );
      }
    });

    test('should test layout responsiveness', async () => {
      await apiHelper.mockPreferencesEndpoints();
      
      const viewports = [
        { name: 'mobile', width: 375, height: 667 },
        { name: 'tablet', width: 768, height: 1024 },
        { name: 'desktop', width: 1440, height: 900 },
        { name: 'wide', width: 1920, height: 1080 }
      ];

      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await preferencesPage.goto();

        // Test with different layouts on different screen sizes
        const layouts = ['classic', 'compact'];
        
        for (const layout of layouts) {
          await preferencesPage.changeLayout(layout);
          await page.waitForTimeout(300);

          await expect(page).toHaveScreenshot(
            `responsive-${viewport.name}-${layout}.png`,
            {
              fullPage: true,
              animations: 'disabled'
            }
          );
        }
      }
    });
  });

  test.describe('Notification Visual Tests', () => {
    test('should capture notification toggle states', async () => {
      await apiHelper.mockPreferencesEndpoints();
      await preferencesPage.goto();

      // Test different notification combinations
      const notificationStates = [
        { name: 'all-disabled', email: false, push: false, desktop: false, sound: false },
        { name: 'email-only', email: true, push: false, desktop: false, sound: false },
        { name: 'all-enabled', email: true, push: true, desktop: true, sound: true },
        { name: 'mixed', email: true, push: false, desktop: true, sound: false }
      ];

      for (const state of notificationStates) {
        await preferencesPage.toggleEmailNotifications(state.email);
        await preferencesPage.togglePushNotifications(state.push);
        await preferencesPage.toggleDesktopNotifications(state.desktop);
        await preferencesPage.toggleSoundNotifications(state.sound);

        // Take screenshot of notifications section
        await expect(page.locator('ax-card:has-text("Notifications")')).toHaveScreenshot(
          `notifications-${state.name}.png`
        );
      }
    });

    test('should test notification toggle animations', async () => {
      await apiHelper.mockPreferencesEndpoints();
      await preferencesPage.goto();

      // Test toggle animation sequence
      const notificationSection = page.locator('ax-card:has-text("Notifications")');

      // Initial state
      await expect(notificationSection).toHaveScreenshot('notifications-toggle-initial.png');

      // Toggle email notification
      await preferencesPage.toggleEmailNotifications(false);
      await page.waitForTimeout(150); // Capture mid-animation
      await expect(notificationSection).toHaveScreenshot('notifications-toggle-email-mid.png');

      await page.waitForTimeout(200); // Complete animation
      await expect(notificationSection).toHaveScreenshot('notifications-toggle-email-final.png');
    });
  });

  test.describe('Navigation Visual Tests', () => {
    test('should capture navigation configuration states', async () => {
      await apiHelper.mockPreferencesEndpoints();
      await preferencesPage.goto();

      const navigationConfigs = [
        { name: 'default-left', type: 'default', position: 'left', collapsed: false },
        { name: 'compact-left-collapsed', type: 'compact', position: 'left', collapsed: true },
        { name: 'horizontal-top', type: 'horizontal', position: 'top', collapsed: false },
        { name: 'default-right', type: 'default', position: 'right', collapsed: false }
      ] as const;

      for (const config of navigationConfigs) {
        await preferencesPage.changeNavigationType(config.type);
        await preferencesPage.changeNavigationPosition(config.position);
        await preferencesPage.toggleNavigationCollapsed(config.collapsed);

        await page.waitForTimeout(300);

        // Take screenshot of navigation section
        await expect(page.locator('ax-card:has-text("Navigation")')).toHaveScreenshot(
          `navigation-${config.name}.png`
        );
      }
    });
  });

  test.describe('Form State Visual Tests', () => {
    test('should capture different form states', async () => {
      await apiHelper.mockPreferencesEndpoints();
      await preferencesPage.goto();

      // Initial clean state
      await expect(page).toHaveScreenshot('form-state-initial.png', {
        fullPage: true,
        animations: 'disabled'
      });

      // Modified state (unsaved changes)
      await preferencesPage.changeTheme('dark');
      await preferencesPage.changeLanguage('th');
      await expect(page).toHaveScreenshot('form-state-modified.png', {
        fullPage: true,
        animations: 'disabled'
      });

      // Loading state during save
      await apiHelper.mockSlowPreferencesResponse(2000);
      const savePromise = preferencesPage.savePreferences();
      
      // Capture loading state
      await page.waitForTimeout(500);
      await expect(page).toHaveScreenshot('form-state-saving.png', {
        fullPage: true
      });

      await savePromise;

      // Success state after save
      await expect(page).toHaveScreenshot('form-state-saved.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('should capture validation error states', async () => {
      await apiHelper.mockPreferencesApiError('validation');
      await preferencesPage.goto();

      // Try to save with invalid data
      await preferencesPage.changeTheme('dark');
      await preferencesPage.savePreferences();

      // Wait for error to appear
      await page.waitForTimeout(1000);

      // Capture error state
      await expect(page).toHaveScreenshot('form-state-validation-error.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('should capture network error states', async () => {
      await apiHelper.mockPreferencesEndpoints();
      await preferencesPage.goto();

      // Setup network error for save operation
      await apiHelper.mockPreferencesApiError('network');

      // Try to save
      await preferencesPage.changeTheme('dark');
      await preferencesPage.savePreferences();

      // Wait for error handling
      await page.waitForTimeout(2000);

      // Capture network error state
      await expect(page).toHaveScreenshot('form-state-network-error.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });
  });

  test.describe('Scenario-Based Visual Tests', () => {
    test('should capture first-time user experience', async () => {
      await apiScenarios.firstTimeUser();
      await preferencesPage.goto();

      await expect(page).toHaveScreenshot('scenario-first-time-user.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('should capture dark theme user scenario', async () => {
      await apiScenarios.darkThemeUser();
      await preferencesPage.goto();

      await expect(page).toHaveScreenshot('scenario-dark-theme-user.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('should capture international user scenario', async () => {
      await apiScenarios.internationalUser();
      await preferencesPage.goto();

      await expect(page).toHaveScreenshot('scenario-international-user.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('should capture enterprise user scenario', async () => {
      await apiScenarios.enterpriseUser();
      await preferencesPage.goto();

      await expect(page).toHaveScreenshot('scenario-enterprise-user.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('should capture privacy-conscious user scenario', async () => {
      await apiScenarios.privacyUser();
      await preferencesPage.goto();

      await expect(page).toHaveScreenshot('scenario-privacy-user.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('should capture power user scenario', async () => {
      await apiScenarios.powerUser();
      await preferencesPage.goto();

      await expect(page).toHaveScreenshot('scenario-power-user.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });
  });

  test.describe('Accessibility Visual Tests', () => {
    test('should capture high contrast mode', async () => {
      await apiHelper.mockPreferencesEndpoints();
      
      // Enable high contrast mode
      await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
      await preferencesPage.goto();

      await expect(page).toHaveScreenshot('accessibility-high-contrast.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('should capture reduced motion mode', async () => {
      await apiHelper.mockPreferencesEndpoints();
      
      // Enable reduced motion
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await preferencesPage.goto();

      // Test theme change without animations
      await preferencesPage.changeTheme('dark');
      
      await expect(page).toHaveScreenshot('accessibility-reduced-motion.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('should capture focus states', async () => {
      await apiHelper.mockPreferencesEndpoints();
      await preferencesPage.goto();

      // Focus on different form elements and capture
      const focusableElements = [
        'mat-select[formcontrolname="theme"]',
        'mat-select[formcontrolname="language"]',
        'mat-slide-toggle[formcontrolname="email"]',
        'button:has-text("Save Preferences")'
      ];

      for (let i = 0; i < focusableElements.length; i++) {
        const element = focusableElements[i];
        await page.locator(element).focus();
        await page.waitForTimeout(200);

        await expect(page).toHaveScreenshot(`accessibility-focus-${i + 1}.png`, {
          fullPage: true,
          animations: 'disabled'
        });
      }
    });
  });

  test.describe('Cross-Browser Visual Tests', () => {
    test('should maintain visual consistency across themes', async () => {
      await apiHelper.mockPreferencesEndpoints();
      await preferencesPage.goto();

      // Test key visual elements that should be consistent
      const themes = ['default', 'light', 'dark'] as const;
      
      for (const theme of themes) {
        await preferencesPage.changeTheme(theme);
        await page.waitForTimeout(500);

        // Capture key UI components
        await expect(page.locator('ax-card:has-text("Appearance")')).toHaveScreenshot(
          `cross-browser-appearance-${theme}.png`
        );

        await expect(page.locator('form')).toHaveScreenshot(
          `cross-browser-form-${theme}.png`
        );

        await expect(page.locator('button:has-text("Save Preferences")')).toHaveScreenshot(
          `cross-browser-save-button-${theme}.png`
        );
      }
    });
  });

  test.describe('Animation Visual Tests', () => {
    test('should capture smooth transitions', async () => {
      await apiHelper.mockPreferencesEndpoints();
      await preferencesPage.goto();

      // Test smooth theme transition
      await expect(page).toHaveScreenshot('animation-theme-before.png', {
        animations: 'disabled'
      });

      // Enable animations for this test
      await preferencesPage.changeTheme('dark');

      // Capture during transition (if any)
      await page.waitForTimeout(150);
      await expect(page).toHaveScreenshot('animation-theme-during.png');

      // Final state
      await page.waitForTimeout(500);
      await expect(page).toHaveScreenshot('animation-theme-after.png', {
        animations: 'disabled'
      });
    });

    test('should capture toggle animations', async () => {
      await apiHelper.mockPreferencesEndpoints();
      await preferencesPage.goto();

      const toggleElement = page.locator('mat-slide-toggle[formcontrolname="email"]');

      // Before toggle
      await expect(toggleElement).toHaveScreenshot('animation-toggle-before.png');

      // Click and capture during animation
      await toggleElement.click();
      await page.waitForTimeout(100);
      await expect(toggleElement).toHaveScreenshot('animation-toggle-during.png');

      // After animation completes
      await page.waitForTimeout(300);
      await expect(toggleElement).toHaveScreenshot('animation-toggle-after.png');
    });
  });
});