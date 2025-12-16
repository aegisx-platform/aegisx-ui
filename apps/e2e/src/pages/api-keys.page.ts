import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { TEST_TIMEOUTS } from '../fixtures/test-data';

/**
 * API Keys Page Object Model
 * Handles API key management, creation, and revocation
 */
export class ApiKeysPage extends BasePage {
  // Selectors
  private readonly selectors = {
    // Main containers
    page: '[data-testid="api-keys-page"], .api-keys-page',
    pageTitle: '[data-testid="page-title"], h1, .page-title',

    // Stats cards
    statsCards: '[data-testid="stats-cards"], .stats-cards',
    statCard: '[data-testid="stat-card"], .stat-card',
    totalKeysCard: '[data-testid="total-keys"]',
    activeKeysCard: '[data-testid="active-keys"]',
    expiringSoonCard: '[data-testid="expiring-soon"]',

    // Actions
    createButton:
      '[data-testid="create-key-btn"], button:has-text("Create"), button:has-text("New Key")',

    // Table/List
    table: '[data-testid="api-keys-table"], table, .api-keys-list',
    tableRow: '[data-testid="api-key-row"], tbody tr, .api-key-item',
    tableHeader: 'thead th',
    noDataMessage: '[data-testid="no-data"], .no-data, .empty-state',

    // Table columns
    nameColumn: '[data-testid="name-column"]',
    statusColumn: '[data-testid="status-column"]',
    createdColumn: '[data-testid="created-column"]',
    expiresColumn: '[data-testid="expires-column"]',
    actionsColumn: '[data-testid="actions-column"]',

    // Row actions
    viewButton: '[data-testid="view-btn"], button[aria-label*="View"]',
    revokeButton: '[data-testid="revoke-btn"], button[aria-label*="Revoke"]',
    deleteButton: '[data-testid="delete-btn"], button[aria-label*="Delete"]',

    // Create wizard (step 1)
    createWizard:
      '[data-testid="create-wizard"], .create-wizard, mat-dialog-container',
    wizardStep1: '[data-testid="wizard-step-1"]',
    nameInput: '[data-testid="key-name"], input[name="name"]',
    descriptionInput:
      '[data-testid="key-description"], textarea[name="description"]',
    expirationSelect: '[data-testid="expiration"], select[name="expiration"]',
    expirationInput:
      '[data-testid="expiration-date"], input[name="expirationDate"]',
    nextButton: '[data-testid="next-btn"], button:has-text("Next")',

    // Create wizard (step 2)
    wizardStep2: '[data-testid="wizard-step-2"]',
    permissionsPanel: '[data-testid="permissions-panel"]',
    permissionCheckbox: '[data-testid="permission-checkbox"], mat-checkbox',
    selectAllCheckbox:
      '[data-testid="select-all"], mat-checkbox:has-text("Select All")',
    previousButton:
      '[data-testid="previous-btn"], button:has-text("Previous"), button:has-text("Back")',

    // Create wizard (step 3)
    wizardStep3: '[data-testid="wizard-step-3"]',
    reviewPanel: '[data-testid="review-panel"]',
    reviewName: '[data-testid="review-name"]',
    reviewDescription: '[data-testid="review-description"]',
    reviewExpiration: '[data-testid="review-expiration"]',
    reviewPermissions: '[data-testid="review-permissions"]',
    createSubmitButton:
      '[data-testid="create-submit"], button:has-text("Create Key")',

    // API key display (after creation)
    keyDisplayDialog: '[data-testid="key-display-dialog"], .key-display-dialog',
    apiKeyValue: '[data-testid="api-key-value"], .api-key-value',
    copyKeyButton: '[data-testid="copy-key-btn"], button:has-text("Copy")',
    closeKeyButton:
      '[data-testid="close-key-btn"], button:has-text("Close"), button:has-text("Done")',

    // Cancel/Close buttons
    cancelButton: '[data-testid="cancel-btn"], button:has-text("Cancel")',
    closeButton: '[data-testid="close-btn"], button:has-text("Close")',

    // Detail page
    detailPage: '[data-testid="api-key-detail"], .api-key-detail',
    detailTitle: '[data-testid="detail-title"], .detail-title',
    detailName: '[data-testid="detail-name"]',
    detailDescription: '[data-testid="detail-description"]',
    detailStatus: '[data-testid="detail-status"]',
    detailCreated: '[data-testid="detail-created"]',
    detailExpires: '[data-testid="detail-expires"]',
    detailPermissions: '[data-testid="detail-permissions"]',
    backButton:
      '[data-testid="back-btn"], button:has-text("Back"), button[aria-label*="Back"]',

    // Revoke confirmation
    revokeDialog:
      '[data-testid="revoke-dialog"], .revoke-dialog, mat-dialog-container:has-text("Revoke")',
    confirmRevokeButton:
      '[data-testid="confirm-revoke"], button:has-text("Revoke"), button:has-text("Confirm")',
    cancelRevokeButton:
      '[data-testid="cancel-revoke"], button:has-text("Cancel")',

    // Delete confirmation
    deleteDialog:
      '[data-testid="delete-dialog"], .delete-dialog, mat-dialog-container:has-text("Delete")',
    confirmDeleteButton:
      '[data-testid="confirm-delete"], button:has-text("Delete"), button:has-text("Confirm")',
    cancelDeleteButton:
      '[data-testid="cancel-delete"], button:has-text("Cancel")',

    // Loading and messages
    loadingSpinner: '[data-testid="loading"], .loading, .spinner, mat-spinner',
    successMessage:
      '[data-testid="success"], .success, .alert-success, .mat-snack-bar-container',
    errorMessage: '[data-testid="error"], .error, .alert-error',

    // Pagination
    pagination: '[data-testid="pagination"], .pagination, mat-paginator',
    nextPageButton: '[data-testid="next-page"], button[aria-label*="Next"]',
    prevPageButton: '[data-testid="prev-page"], button[aria-label*="Previous"]',
  };

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to API keys page
   */
  async goto(): Promise<void> {
    await this.page.goto('/system/settings/api-keys');
    await this.waitForLoad();
  }

  /**
   * Wait for page to load
   */
  async waitForLoad(): Promise<void> {
    await this.waitForElement(this.selectors.page);
    await this.waitForLoadingComplete();
  }

  /**
   * Wait for loading to complete
   */
  async waitForLoadingComplete(): Promise<void> {
    const loadingExists = await this.elementExists(
      this.selectors.loadingSpinner,
    );
    if (loadingExists) {
      await this.waitForElementHidden(this.selectors.loadingSpinner);
    }
  }

  /**
   * Verify stats cards are displayed
   */
  async verifyStatsCardsDisplayed(): Promise<void> {
    await this.verifyElementVisible(this.selectors.statsCards);
    const cards = this.page.locator(this.selectors.statCard);
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(2);
  }

  /**
   * Click create new key button
   */
  async clickCreateKey(): Promise<void> {
    await this.clickElement(this.selectors.createButton);
    await this.waitForElement(this.selectors.createWizard);
  }

  /**
   * Fill wizard step 1 (basic info)
   */
  async fillWizardStep1(data: {
    name: string;
    description: string;
    expiration?: string;
  }): Promise<void> {
    await this.fillInput(this.selectors.nameInput, data.name);
    await this.fillInput(this.selectors.descriptionInput, data.description);

    if (data.expiration) {
      if (await this.elementExists(this.selectors.expirationSelect)) {
        await this.selectOption(
          this.selectors.expirationSelect,
          data.expiration,
        );
      } else if (await this.elementExists(this.selectors.expirationInput)) {
        await this.fillInput(this.selectors.expirationInput, data.expiration);
      }
    }
  }

  /**
   * Click next in wizard
   */
  async clickNext(): Promise<void> {
    await this.clickElement(this.selectors.nextButton);
    await this.page.waitForTimeout(500); // Wait for step transition
  }

  /**
   * Click previous in wizard
   */
  async clickPrevious(): Promise<void> {
    await this.clickElement(this.selectors.previousButton);
    await this.page.waitForTimeout(500); // Wait for step transition
  }

  /**
   * Select permissions in step 2
   */
  async selectPermissions(permissions: string[]): Promise<void> {
    for (const permission of permissions) {
      const checkbox = this.page.locator(
        `${this.selectors.permissionCheckbox}:has-text("${permission}")`,
      );
      await checkbox.check();
    }
  }

  /**
   * Select all permissions
   */
  async selectAllPermissions(): Promise<void> {
    if (await this.elementExists(this.selectors.selectAllCheckbox)) {
      await this.checkCheckbox(this.selectors.selectAllCheckbox, true);
    }
  }

  /**
   * Review and create key (step 3)
   */
  async reviewAndCreate(): Promise<void> {
    await this.clickElement(this.selectors.createSubmitButton);
    await this.waitForElement(this.selectors.keyDisplayDialog);
  }

  /**
   * Get displayed API key value
   */
  async getApiKeyValue(): Promise<string> {
    const keyElement = this.page.locator(this.selectors.apiKeyValue);
    const keyValue = await keyElement.textContent();
    return keyValue?.trim() || '';
  }

  /**
   * Copy API key
   */
  async copyApiKey(): Promise<void> {
    await this.clickElement(this.selectors.copyKeyButton);
    await this.page.waitForTimeout(500); // Wait for copy
  }

  /**
   * Close API key display dialog
   */
  async closeKeyDisplay(): Promise<void> {
    await this.clickElement(this.selectors.closeKeyButton);
    await this.waitForElement(this.selectors.table);
  }

  /**
   * Complete API key creation flow
   */
  async createApiKey(data: {
    name: string;
    description: string;
    expiration?: string;
    permissions: string[];
  }): Promise<string> {
    // Open wizard
    await this.clickCreateKey();

    // Step 1: Basic info
    await this.fillWizardStep1({
      name: data.name,
      description: data.description,
      expiration: data.expiration,
    });
    await this.clickNext();

    // Step 2: Permissions
    await this.selectPermissions(data.permissions);
    await this.clickNext();

    // Step 3: Review and create
    await this.reviewAndCreate();

    // Get API key value
    const apiKey = await this.getApiKeyValue();

    // Copy and close
    await this.copyApiKey();
    await this.closeKeyDisplay();

    return apiKey;
  }

  /**
   * Cancel key creation
   */
  async cancelKeyCreation(): Promise<void> {
    await this.clickElement(this.selectors.cancelButton);
    await this.waitForElement(this.selectors.table);
  }

  /**
   * Get table row count
   */
  async getRowCount(): Promise<number> {
    const rows = this.page.locator(this.selectors.tableRow);
    return await rows.count();
  }

  /**
   * Get API key row by index
   */
  getRow(index: number): Locator {
    return this.page.locator(this.selectors.tableRow).nth(index);
  }

  /**
   * View API key details
   */
  async viewApiKey(index: number): Promise<void> {
    const row = this.getRow(index);
    const viewBtn = row.locator(this.selectors.viewButton);
    await viewBtn.click();
    await this.waitForElement(this.selectors.detailPage);
  }

  /**
   * View first API key
   */
  async viewFirstApiKey(): Promise<void> {
    await this.viewApiKey(0);
  }

  /**
   * Verify detail page is displayed
   */
  async verifyDetailPageDisplayed(): Promise<void> {
    await this.verifyElementVisible(this.selectors.detailPage);
    await this.verifyElementVisible(this.selectors.detailName);
    await this.verifyElementVisible(this.selectors.detailPermissions);
  }

  /**
   * Go back from detail page
   */
  async goBackFromDetail(): Promise<void> {
    await this.clickElement(this.selectors.backButton);
    await this.waitForElement(this.selectors.table);
  }

  /**
   * Revoke API key
   */
  async revokeApiKey(index: number): Promise<void> {
    const row = this.getRow(index);
    const revokeBtn = row.locator(this.selectors.revokeButton);
    await revokeBtn.click();

    // Wait for confirmation dialog
    await this.waitForElement(this.selectors.revokeDialog);

    // Confirm revocation
    await this.clickElement(this.selectors.confirmRevokeButton);
    await this.waitForLoadingComplete();
  }

  /**
   * Cancel revoke operation
   */
  async cancelRevoke(index: number): Promise<void> {
    const row = this.getRow(index);
    const revokeBtn = row.locator(this.selectors.revokeButton);
    await revokeBtn.click();

    // Wait for confirmation dialog
    await this.waitForElement(this.selectors.revokeDialog);

    // Cancel revocation
    await this.clickElement(this.selectors.cancelRevokeButton);
  }

  /**
   * Delete API key
   */
  async deleteApiKey(index: number): Promise<void> {
    const row = this.getRow(index);
    const deleteBtn = row.locator(this.selectors.deleteButton);
    await deleteBtn.click();

    // Wait for confirmation dialog
    await this.waitForElement(this.selectors.deleteDialog);

    // Confirm deletion
    await this.clickElement(this.selectors.confirmDeleteButton);
    await this.waitForLoadingComplete();
  }

  /**
   * Cancel delete operation
   */
  async cancelDelete(index: number): Promise<void> {
    const row = this.getRow(index);
    const deleteBtn = row.locator(this.selectors.deleteButton);
    await deleteBtn.click();

    // Wait for confirmation dialog
    await this.waitForElement(this.selectors.deleteDialog);

    // Cancel deletion
    await this.clickElement(this.selectors.cancelDeleteButton);
  }

  /**
   * Verify key status in table
   */
  async verifyKeyStatus(index: number, expectedStatus: string): Promise<void> {
    const row = this.getRow(index);
    const statusCell = row.locator(this.selectors.statusColumn);
    await expect(statusCell).toContainText(expectedStatus);
  }

  /**
   * Verify success message
   */
  async verifySuccessMessage(message?: string): Promise<void> {
    await this.verifyElementVisible(this.selectors.successMessage);
    if (message) {
      await this.verifyElementContainsText(
        this.selectors.successMessage,
        message,
      );
    }
  }

  /**
   * Verify no data message is displayed
   */
  async verifyNoDataDisplayed(): Promise<void> {
    await this.verifyElementVisible(this.selectors.noDataMessage);
  }

  /**
   * Check if table has data
   */
  async hasData(): Promise<boolean> {
    const rowCount = await this.getRowCount();
    return rowCount > 0;
  }

  /**
   * Find key by name
   */
  async findKeyByName(name: string): Promise<number | null> {
    const rowCount = await this.getRowCount();
    for (let i = 0; i < rowCount; i++) {
      const row = this.getRow(i);
      const nameCell = row.locator(this.selectors.nameColumn);
      const cellText = await nameCell.textContent();
      if (cellText?.includes(name)) {
        return i;
      }
    }
    return null;
  }
}
