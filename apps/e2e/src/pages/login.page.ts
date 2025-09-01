import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { TestCredentials } from '../fixtures/test-data';

/**
 * Login Page Object Model
 * Handles login form interactions and authentication flow
 */
export class LoginPage extends BasePage {
  // Selectors
  private readonly selectors = {
    emailInput: 'input[name="email"], input[type="email"]',
    passwordInput: 'input[name="password"], input[type="password"]',
    loginButton: 'button[type="submit"]',
    loginForm: 'form',
    errorMessage: '[data-testid="error-message"], .error-message, .alert-error',
    rememberMeCheckbox: 'input[type="checkbox"][name="remember"]',
    forgotPasswordLink: 'a[href*="forgot-password"]',
    signUpLink: 'a[href*="register"], a[href*="signup"]',
    loadingSpinner: '.loading, .spinner, [data-testid="loading"]',
  };

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to login page
   */
  async goto(): Promise<void> {
    await this.page.goto('/login');
    await this.waitForLoad();
  }

  /**
   * Wait for login page to be loaded
   */
  async waitForLoad(): Promise<void> {
    await this.waitForElement(this.selectors.loginForm);
    await this.waitForElement(this.selectors.emailInput);
    await this.waitForElement(this.selectors.passwordInput);
    await this.waitForElement(this.selectors.loginButton);
  }

  /**
   * Fill email input
   */
  async fillEmail(email: string): Promise<void> {
    await this.fillInput(this.selectors.emailInput, email);
  }

  /**
   * Fill password input
   */
  async fillPassword(password: string): Promise<void> {
    await this.fillInput(this.selectors.passwordInput, password);
  }

  /**
   * Click login button
   */
  async clickLogin(): Promise<void> {
    await this.clickElement(this.selectors.loginButton);
  }

  /**
   * Check remember me checkbox
   */
  async checkRememberMe(checked = true): Promise<void> {
    if (await this.elementExists(this.selectors.rememberMeCheckbox)) {
      await this.checkCheckbox(this.selectors.rememberMeCheckbox, checked);
    }
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    await this.clickElement(this.selectors.forgotPasswordLink);
  }

  /**
   * Click sign up link
   */
  async clickSignUp(): Promise<void> {
    await this.clickElement(this.selectors.signUpLink);
  }

  /**
   * Perform login with credentials
   */
  async login(credentials: TestCredentials, rememberMe = false): Promise<void> {
    await this.fillEmail(credentials.email);
    await this.fillPassword(credentials.password);
    
    if (rememberMe) {
      await this.checkRememberMe(true);
    }
    
    await this.clickLogin();
  }

  /**
   * Perform login and wait for success
   */
  async loginAndWaitForSuccess(credentials: TestCredentials, rememberMe = false): Promise<void> {
    await this.login(credentials, rememberMe);
    
    // Wait for navigation to dashboard or landing page
    await expect(this.page).toHaveURL(/\/(dashboard|home)/, { timeout: 30000 });
  }

  /**
   * Perform login and expect failure
   */
  async loginAndExpectError(credentials: TestCredentials): Promise<void> {
    await this.login(credentials);
    
    // Wait for error message to appear
    await this.waitForElement(this.selectors.errorMessage);
    
    // Verify we're still on login page
    await this.verifyUrl(/\/login/);
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    try {
      await this.waitForElement(this.selectors.errorMessage);
      return await this.getElementText(this.selectors.errorMessage);
    } catch {
      return '';
    }
  }

  /**
   * Verify error message is displayed
   */
  async verifyErrorMessage(expectedMessage: string | RegExp): Promise<void> {
    await this.verifyElementVisible(this.selectors.errorMessage);
    if (typeof expectedMessage === 'string') {
      await this.verifyElementContainsText(this.selectors.errorMessage, expectedMessage);
    } else {
      await this.verifyElementText(this.selectors.errorMessage, expectedMessage);
    }
  }

  /**
   * Verify no error message is displayed
   */
  async verifyNoErrorMessage(): Promise<void> {
    const errorExists = await this.elementExists(this.selectors.errorMessage);
    if (errorExists) {
      await this.verifyElementHidden(this.selectors.errorMessage);
    }
  }

  /**
   * Wait for loading to complete
   */
  async waitForLoadingComplete(): Promise<void> {
    const loadingExists = await this.elementExists(this.selectors.loadingSpinner);
    if (loadingExists) {
      await this.waitForElementHidden(this.selectors.loadingSpinner);
    }
  }

  /**
   * Verify login form is displayed
   */
  async verifyLoginFormDisplayed(): Promise<void> {
    await this.verifyElementVisible(this.selectors.loginForm);
    await this.verifyElementVisible(this.selectors.emailInput);
    await this.verifyElementVisible(this.selectors.passwordInput);
    await this.verifyElementVisible(this.selectors.loginButton);
  }

  /**
   * Verify email input has focus
   */
  async verifyEmailInputFocused(): Promise<void> {
    const emailInput = this.page.locator(this.selectors.emailInput);
    await expect(emailInput).toBeFocused();
  }

  /**
   * Get email input value
   */
  async getEmailValue(): Promise<string> {
    return await this.page.locator(this.selectors.emailInput).inputValue();
  }

  /**
   * Get password input value
   */
  async getPasswordValue(): Promise<string> {
    return await this.page.locator(this.selectors.passwordInput).inputValue();
  }

  /**
   * Verify remember me checkbox state
   */
  async verifyRememberMeChecked(expected = true): Promise<void> {
    if (await this.elementExists(this.selectors.rememberMeCheckbox)) {
      const checkbox = this.page.locator(this.selectors.rememberMeCheckbox);
      if (expected) {
        await expect(checkbox).toBeChecked();
      } else {
        await expect(checkbox).not.toBeChecked();
      }
    }
  }

  /**
   * Clear form inputs
   */
  async clearForm(): Promise<void> {
    await this.fillInput(this.selectors.emailInput, '', { clear: true });
    await this.fillInput(this.selectors.passwordInput, '', { clear: true });
    
    if (await this.elementExists(this.selectors.rememberMeCheckbox)) {
      await this.checkCheckbox(this.selectors.rememberMeCheckbox, false);
    }
  }

  /**
   * Submit form using Enter key
   */
  async submitWithEnterKey(): Promise<void> {
    await this.page.locator(this.selectors.passwordInput).press('Enter');
  }

  /**
   * Test keyboard navigation
   */
  async testKeyboardNavigation(): Promise<void> {
    // Tab to email input
    await this.page.keyboard.press('Tab');
    await this.verifyEmailInputFocused();
    
    // Tab to password input
    await this.page.keyboard.press('Tab');
    const passwordInput = this.page.locator(this.selectors.passwordInput);
    await expect(passwordInput).toBeFocused();
    
    // Tab to login button
    await this.page.keyboard.press('Tab');
    const loginButton = this.page.locator(this.selectors.loginButton);
    await expect(loginButton).toBeFocused();
  }

  /**
   * Verify accessibility attributes
   */
  async verifyAccessibility(): Promise<void> {
    // Check for proper labels
    const emailInput = this.page.locator(this.selectors.emailInput);
    const passwordInput = this.page.locator(this.selectors.passwordInput);
    
    // Verify inputs have accessible names
    await expect(emailInput).toHaveAttribute('aria-label');
    await expect(passwordInput).toHaveAttribute('aria-label');
    
    // Or verify they have associated labels
    const emailId = await emailInput.getAttribute('id');
    const passwordId = await passwordInput.getAttribute('id');
    
    if (emailId) {
      await expect(this.page.locator(`label[for="${emailId}"]`)).toBeVisible();
    }
    
    if (passwordId) {
      await expect(this.page.locator(`label[for="${passwordId}"]`)).toBeVisible();
    }
  }

  /**
   * Take screenshot of login page
   */
  async takeLoginPageScreenshot(name = 'login-page'): Promise<void> {
    await this.screenshot(name, { fullPage: true });
  }
}