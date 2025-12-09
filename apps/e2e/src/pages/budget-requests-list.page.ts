import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { TEST_TIMEOUTS } from '../fixtures/test-data';

/**
 * Budget Requests List Page Object Model
 * Handles interactions with the budget requests list page
 */
export class BudgetRequestsListPage extends BasePage {
  // Locators
  readonly pageTitle: Locator;
  readonly createButton: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly refreshButton: Locator;
  readonly tableRows: Locator;
  readonly pagination: Locator;
  readonly loadingSpinner: Locator;
  readonly emptyState: Locator;

  // Table column locators
  readonly requestNumberColumn: Locator;
  readonly fiscalYearColumn: Locator;
  readonly statusColumn: Locator;
  readonly actionsColumn: Locator;

  constructor(page: Page) {
    super(page);

    // Header elements
    this.pageTitle = page
      .locator(
        'h1:has-text("Budget Requests"), ax-card-title:has-text("Budget Requests")',
      )
      .first();
    this.createButton = page
      .locator('button:has-text("Create"), button[aria-label*="Create"]')
      .first();

    // Search and filters
    this.searchInput = page
      .locator('input[placeholder*="Search"], input[type="search"]')
      .first();
    this.searchButton = page
      .locator('button:has-text("Search"), button[aria-label*="Search"]')
      .first();
    this.refreshButton = page
      .locator(
        'button:has-text("Refresh"), button[aria-label*="Refresh"], button mat-icon:has-text("refresh")',
      )
      .first();

    // Table elements
    this.tableRows = page
      .locator('mat-row, tr.mat-row, tbody tr')
      .filter({ hasNot: page.locator('.mat-header-row') });
    this.pagination = page.locator('mat-paginator');

    // Loading and empty states
    this.loadingSpinner = page.locator('mat-spinner, .loading-spinner');
    this.emptyState = page.locator(
      'ax-empty-state, .empty-state, text=/No.*found/i',
    );

    // Table columns
    this.requestNumberColumn = page.locator('[data-column="request_number"]');
    this.fiscalYearColumn = page.locator('[data-column="fiscal_year"]');
    this.statusColumn = page.locator('[data-column="status"]');
    this.actionsColumn = page.locator('[data-column="actions"]');
  }

  /**
   * Navigate to the budget requests list page
   */
  async goto(): Promise<void> {
    await this.page.goto('/inventory/budget/budget-requests');
    await this.waitForLoad();
  }

  /**
   * Wait for the page to be fully loaded
   */
  async waitForLoad(): Promise<void> {
    // Wait for page to be in stable state
    await this.page.waitForLoadState('networkidle', {
      timeout: TEST_TIMEOUTS.navigation,
    });

    // Wait for either table rows or empty state to appear
    try {
      await Promise.race([
        this.tableRows.first().waitFor({ state: 'visible', timeout: 5000 }),
        this.emptyState.waitFor({ state: 'visible', timeout: 5000 }),
      ]);
    } catch {
      // If neither appears, that's okay - might be loading
    }

    // Ensure loading spinner is gone
    try {
      await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 });
    } catch {
      // Spinner might not exist or already hidden
    }
  }

  /**
   * Click the Create button to open create dialog
   */
  async clickCreate(): Promise<void> {
    await this.createButton.click();
    // Wait for dialog to appear
    await this.page.waitForSelector('mat-dialog-container', {
      timeout: TEST_TIMEOUTS.action,
    });
  }

  /**
   * Get total number of rows in the table
   */
  async getRowCount(): Promise<number> {
    await this.page.waitForTimeout(500); // Small wait for table to stabilize
    return await this.tableRows.count();
  }

  /**
   * Get a specific row by request number
   */
  getRowByRequestNumber(requestNumber: string): Locator {
    return this.page.locator(`mat-row, tr`).filter({ hasText: requestNumber });
  }

  /**
   * Click Edit button for a specific request
   */
  async clickEditForRequest(requestNumber: string): Promise<void> {
    const row = this.getRowByRequestNumber(requestNumber);

    // Try to find edit button within the row
    const editButton = row
      .locator(
        'button:has-text("Edit"), button mat-icon:has-text("edit"), a:has-text("Edit")',
      )
      .first();

    // If not found in row, try actions menu
    if ((await editButton.count()) === 0) {
      const moreButton = row
        .locator('button mat-icon:has-text("more_vert")')
        .first();
      await moreButton.click();
      await this.page.waitForTimeout(300);
      await this.page.locator('button:has-text("Edit")').first().click();
    } else {
      await editButton.click();
    }

    // Wait for navigation to edit page
    await this.page.waitForURL(/budget-requests\/\d+\/edit/, {
      timeout: TEST_TIMEOUTS.navigation,
    });
  }

  /**
   * Search for budget requests
   */
  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);

    // Try clicking search button if it exists, otherwise press Enter
    if ((await this.searchButton.count()) > 0) {
      await this.searchButton.click();
    } else {
      await this.searchInput.press('Enter');
    }

    await this.waitForTableToUpdate();
  }

  /**
   * Wait for table to update after search/filter
   */
  async waitForTableToUpdate(): Promise<void> {
    // Wait for loading to start and finish
    await this.page.waitForTimeout(300);

    try {
      await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 });
    } catch {
      // Loading spinner might not appear for fast operations
    }

    await this.page.waitForTimeout(500); // Give table time to re-render
  }

  /**
   * Get status badge text for a request
   */
  async getStatusForRequest(requestNumber: string): Promise<string> {
    const row = this.getRowByRequestNumber(requestNumber);
    const statusBadge = row
      .locator('.status-badge, [data-column="status"]')
      .first();
    return (await statusBadge.textContent())?.trim() || '';
  }

  /**
   * Verify page is loaded correctly
   */
  async verifyPageLoaded(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.createButton).toBeVisible();
  }
}
