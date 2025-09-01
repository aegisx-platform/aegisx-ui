import { Page, Browser, BrowserContext } from '@playwright/test';
import { TEST_CREDENTIALS, TestCredentials } from '../fixtures/test-data';
import { LoginPage } from '../pages/login.page';

/**
 * Authentication Helper
 * Provides utilities for handling authentication in E2E tests
 */
export class AuthHelper {
  private page: Page;
  private context?: BrowserContext;
  
  constructor(page: Page, context?: BrowserContext) {
    this.page = page;
    this.context = context;
  }

  /**
   * Login with credentials
   */
  async login(credentials: TestCredentials = TEST_CREDENTIALS.admin): Promise<void> {
    const loginPage = new LoginPage(this.page);
    
    await loginPage.goto();
    await loginPage.loginAndWaitForSuccess(credentials);
  }

  /**
   * Login as admin user
   */
  async loginAsAdmin(): Promise<void> {
    await this.login(TEST_CREDENTIALS.admin);
  }

  /**
   * Login as manager user
   */
  async loginAsManager(): Promise<void> {
    await this.login(TEST_CREDENTIALS.manager);
  }

  /**
   * Login as regular user
   */
  async loginAsUser(): Promise<void> {
    await this.login(TEST_CREDENTIALS.user);
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    // Try multiple logout methods as implementation may vary
    try {
      // Method 1: User menu logout
      await this.page.click('[data-testid="user-menu"], .user-menu, .profile-menu');
      await this.page.waitForTimeout(300);
      await this.page.click('[data-testid="logout"], .logout, [href*="logout"]');
    } catch {
      try {
        // Method 2: Direct navigation to logout
        await this.page.goto('/logout');
      } catch {
        // Method 3: API logout
        await this.page.evaluate(() => {
          fetch('/api/auth/logout', { method: 'POST' });
          localStorage.clear();
          sessionStorage.clear();
        });
        await this.page.goto('/login');
      }
    }
    
    // Wait for redirect to login page
    await this.page.waitForURL(/\/login/, { timeout: 10000 });
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      // Check for authentication indicators
      const currentUrl = this.page.url();
      
      // If on login page, definitely not authenticated
      if (currentUrl.includes('/login')) {
        return false;
      }
      
      // Check for user menu or other authenticated UI elements
      const authElements = [
        '[data-testid="user-menu"]',
        '.user-menu',
        '[data-testid="user-avatar"]',
        '.user-avatar',
        '[data-testid="logout"]',
        '.logout',
      ];
      
      for (const selector of authElements) {
        try {
          await this.page.waitForSelector(selector, { timeout: 2000 });
          return true;
        } catch {
          // Continue to next selector
        }
      }
      
      // Check for authentication token in localStorage/sessionStorage
      const hasToken = await this.page.evaluate(() => {
        const token = localStorage.getItem('token') || 
                     localStorage.getItem('authToken') ||
                     sessionStorage.getItem('token') ||
                     sessionStorage.getItem('authToken');
        return !!token;
      });
      
      return hasToken;
    } catch {
      return false;
    }
  }

  /**
   * Get current user information
   */
  async getCurrentUser(): Promise<{ email?: string; name?: string; role?: string } | null> {
    try {
      // Try to get user info from API
      const response = await this.page.request.get('/api/auth/profile');
      if (response.ok()) {
        return await response.json();
      }
    } catch {
      // Fallback to extracting from UI
      try {
        const userMenuText = await this.page.textContent('[data-testid="user-menu"], .user-menu');
        return { name: userMenuText?.trim() };
      } catch {
        // No user information available
      }
    }
    
    return null;
  }

  /**
   * Save authentication state
   */
  async saveAuthState(path: string): Promise<void> {
    if (this.context) {
      await this.context.storageState({ path });
    } else {
      await this.page.context().storageState({ path });
    }
  }

  /**
   * Load authentication state
   */
  static async createAuthenticatedContext(
    browser: Browser, 
    statePath: string
  ): Promise<BrowserContext> {
    return await browser.newContext({
      storageState: statePath,
    });
  }

  /**
   * Clear authentication state
   */
  async clearAuthState(): Promise<void> {
    await this.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
      // Clear cookies by setting them to expire
      document.cookie.split(';').forEach(cookie => {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      });
    });
  }

  /**
   * Wait for authentication to complete
   */
  async waitForAuth(): Promise<void> {
    // Wait for redirect away from login page
    try {
      await this.page.waitForFunction(
        () => !window.location.pathname.includes('/login'),
        { timeout: 15000 }
      );
    } catch {
      // If still on login page, check for error
      const loginPage = new LoginPage(this.page);
      const error = await loginPage.getErrorMessage();
      if (error) {
        throw new Error(`Authentication failed: ${error}`);
      }
    }
    
    // Wait for authenticated UI elements
    const authSelectors = [
      '[data-testid="user-menu"]',
      '.user-menu',
      '[data-testid="dashboard"]',
      '.dashboard',
    ];
    
    for (const selector of authSelectors) {
      try {
        await this.page.waitForSelector(selector, { timeout: 5000 });
        break;
      } catch {
        // Continue to next selector
      }
    }
  }

  /**
   * Test login with invalid credentials
   */
  async testInvalidLogin(): Promise<void> {
    const loginPage = new LoginPage(this.page);
    
    await loginPage.goto();
    await loginPage.loginAndExpectError(TEST_CREDENTIALS.invalid);
    
    // Verify error message is shown
    const errorMessage = await loginPage.getErrorMessage();
    if (!errorMessage) {
      throw new Error('Expected error message for invalid login');
    }
  }

  /**
   * Test login form validation
   */
  async testLoginValidation(): Promise<void> {
    const loginPage = new LoginPage(this.page);
    
    await loginPage.goto();
    
    // Test empty form submission
    await loginPage.clickLogin();
    await loginPage.verifyErrorMessage();
    
    // Test invalid email format
    await loginPage.fillEmail('invalid-email');
    await loginPage.fillPassword('password');
    await loginPage.clickLogin();
    await loginPage.verifyErrorMessage();
  }

  /**
   * Test password reset flow
   */
  async testPasswordReset(): Promise<void> {
    const loginPage = new LoginPage(this.page);
    
    await loginPage.goto();
    await loginPage.clickForgotPassword();
    
    // Should navigate to password reset page
    await this.page.waitForURL(/\/(forgot-password|reset-password|password-reset)/);
  }

  /**
   * Test session persistence
   */
  async testSessionPersistence(): Promise<void> {
    // Login first
    await this.loginAsAdmin();
    
    // Refresh the page
    await this.page.reload();
    
    // Should still be authenticated
    const isAuth = await this.isAuthenticated();
    if (!isAuth) {
      throw new Error('Session was not persisted after page refresh');
    }
  }

  /**
   * Test session expiration
   */
  async testSessionExpiration(): Promise<void> {
    // Login first
    await this.loginAsAdmin();
    
    // Clear auth tokens to simulate expiration
    await this.page.evaluate(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('authToken');
    });
    
    // Try to access protected page
    await this.page.goto('/dashboard');
    
    // Should be redirected to login
    await this.page.waitForURL(/\/login/, { timeout: 10000 });
  }

  /**
   * Setup authentication for test
   */
  async setupAuth(userType: 'admin' | 'manager' | 'user' = 'admin'): Promise<void> {
    const credentials = TEST_CREDENTIALS[userType];
    await this.login(credentials);
  }

  /**
   * Teardown authentication after test
   */
  async teardownAuth(): Promise<void> {
    try {
      await this.logout();
    } catch {
      // If logout fails, clear auth state
      await this.clearAuthState();
    }
  }

  /**
   * Create quick login helper for different user types
   */
  static createQuickLogin(page: Page) {
    const auth = new AuthHelper(page);
    
    return {
      admin: () => auth.loginAsAdmin(),
      manager: () => auth.loginAsManager(),
      user: () => auth.loginAsUser(),
      logout: () => auth.logout(),
      isAuthenticated: () => auth.isAuthenticated(),
    };
  }
}