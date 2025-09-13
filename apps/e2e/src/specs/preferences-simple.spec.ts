import { test, expect, Page } from '@playwright/test';

test.describe('Simple User Preferences Test', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
  });

  test('should access application without authentication and verify basic navigation', async () => {
    // Navigate to the application
    await page.goto('http://localhost:4200');

    // Take a screenshot of the homepage
    await page.screenshot({
      path: 'screenshots/simple-01-homepage.png',
      fullPage: true
    });

    // Check if we can see the basic UI elements
    await expect(page).toHaveTitle(/AegisX/);

    // Look for navigation or login elements
    const loginButton = page.locator('button:has-text("Login"), a:has-text("Login"), [data-testid="login"]');
    const profileButton = page.locator('button:has-text("Profile"), a:has-text("Profile"), [data-testid="profile"]');
    const userButton = page.locator('[data-testid="user-menu"], [aria-label*="user"], .user-menu');

    // Take screenshot of what we can see
    await page.screenshot({
      path: 'screenshots/simple-02-ui-elements.png',
      fullPage: true
    });

    // Try to find any clickable elements
    const clickableElements = await page.locator('button, a, [role="button"]').all();
    console.log(`Found ${clickableElements.length} clickable elements`);

    // Take screenshot of current state
    await page.screenshot({
      path: 'screenshots/simple-03-current-state.png',
      fullPage: true
    });

    // Try to navigate to login page if not authenticated
    if (await loginButton.isVisible()) {
      await loginButton.click();
      await page.waitForTimeout(1000);
      
      await page.screenshot({
        path: 'screenshots/simple-04-login-page.png',
        fullPage: true
      });

      // Try to login with test credentials
      const emailInput = page.locator('input[type="email"], input[name="email"]');
      const passwordInput = page.locator('input[type="password"], input[name="password"]');
      const submitButton = page.locator('button[type="submit"], button:has-text("Login")');

      if (await emailInput.isVisible() && await passwordInput.isVisible()) {
        await emailInput.fill('admin@aegisx.com');
        await passwordInput.fill('admin123');
        
        await page.screenshot({
          path: 'screenshots/simple-05-login-filled.png',
          fullPage: true
        });

        await submitButton.click();
        await page.waitForTimeout(3000);

        await page.screenshot({
          path: 'screenshots/simple-06-after-login.png',
          fullPage: true
        });
      }
    }

    // Try to navigate to profile page
    try {
      await page.goto('http://localhost:4200/profile');
      await page.waitForTimeout(2000);

      await page.screenshot({
        path: 'screenshots/simple-07-profile-direct.png',
        fullPage: true
      });

      // Look for tabs or sections
      const tabs = page.locator('.mat-tab-label, [role="tab"], .tab');
      const tabCount = await tabs.count();
      console.log(`Found ${tabCount} tabs`);

      if (tabCount > 0) {
        // Take screenshot of tabs
        await page.screenshot({
          path: 'screenshots/simple-08-profile-tabs.png',
          fullPage: true
        });

        // Try to click on preferences tab
        const preferencesTab = page.locator('.mat-tab-label:has-text("Preferences"), [role="tab"]:has-text("Preferences")');
        if (await preferencesTab.isVisible()) {
          await preferencesTab.click();
          await page.waitForTimeout(1000);

          await page.screenshot({
            path: 'screenshots/simple-09-preferences-tab.png',
            fullPage: true
          });

          // Look for form elements
          const formElements = page.locator('form, mat-form-field, .form-field');
          const formCount = await formElements.count();
          console.log(`Found ${formCount} form elements`);

          // Look for specific preference controls
          const themeSelect = page.locator('mat-select[formcontrolname="theme"], select[name="theme"]');
          const languageSelect = page.locator('mat-select[formcontrolname="language"], select[name="language"]');
          const notifications = page.locator('mat-slide-toggle, input[type="checkbox"]');

          const controlCounts = {
            theme: await themeSelect.count(),
            language: await languageSelect.count(),
            notifications: await notifications.count()
          };

          console.log('Control counts:', controlCounts);

          // Take final screenshot of preferences
          await page.screenshot({
            path: 'screenshots/simple-10-preferences-final.png',
            fullPage: true
          });
        }
      }
    } catch (error) {
      console.log('Error accessing profile:', error);
      
      await page.screenshot({
        path: 'screenshots/simple-error-profile.png',
        fullPage: true
      });
    }
  });

  test('should test basic page navigation and structure', async () => {
    await page.goto('http://localhost:4200');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of loaded page
    await page.screenshot({
      path: 'screenshots/navigation-01-loaded.png',
      fullPage: true
    });

    // Get page title and URL
    const title = await page.title();
    const url = page.url();
    console.log(`Page title: ${title}, URL: ${url}`);

    // Check for common navigation elements
    const navElements = [
      'nav',
      '.navbar',
      '.navigation',
      '[role="navigation"]',
      '.sidebar',
      '.menu'
    ];

    for (const selector of navElements) {
      const element = page.locator(selector);
      if (await element.isVisible()) {
        console.log(`Found navigation element: ${selector}`);
        
        await page.screenshot({
          path: `screenshots/navigation-found-${selector.replace(/[^a-zA-Z0-9]/g, '_')}.png`,
          fullPage: true
        });
        break;
      }
    }

    // Look for any links or buttons that might lead to preferences
    const preferenceLinks = page.locator('a:has-text("Profile"), a:has-text("Settings"), a:has-text("Preferences"), button:has-text("Profile"), button:has-text("Settings")');
    const linkCount = await preferenceLinks.count();
    console.log(`Found ${linkCount} potential preference links`);

    if (linkCount > 0) {
      await page.screenshot({
        path: 'screenshots/navigation-02-preference-links.png',
        fullPage: true
      });
    }
  });
});