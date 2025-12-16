import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { TEST_TIMEOUTS } from '../fixtures/test-data';

/**
 * Error Logs Page Object Model
 * Handles error logs list, filtering, and detail viewing
 */
export class ErrorLogsPage extends BasePage {
  // Selectors
  private readonly selectors = {
    // Main containers
    page: '[data-testid="error-logs-page"], .error-logs-page',
    pageTitle: '[data-testid="page-title"], h1, .page-title',

    // Stats cards
    statsCards: '[data-testid="stats-cards"], .stats-cards',
    statCard: '[data-testid="stat-card"], .stat-card',
    totalErrorsCard: '[data-testid="total-errors"]',
    criticalErrorsCard: '[data-testid="critical-errors"]',
    recentErrorsCard: '[data-testid="recent-errors"]',

    // Filters
    filterPanel: '[data-testid="filter-panel"], .filter-panel',
    levelFilter: '[data-testid="level-filter"], select[name="level"]',
    typeFilter: '[data-testid="type-filter"], select[name="type"]',
    dateRangeFilter: '[data-testid="date-range-filter"]',
    startDateInput: '[data-testid="start-date"], input[name="startDate"]',
    endDateInput: '[data-testid="end-date"], input[name="endDate"]',
    applyFiltersButton:
      '[data-testid="apply-filters"], button:has-text("Apply")',
    clearFiltersButton:
      '[data-testid="clear-filters"], button:has-text("Clear")',

    // Search
    searchInput:
      '[data-testid="search"], input[type="search"], input[placeholder*="Search"]',

    // Table/List
    table: '[data-testid="error-logs-table"], table, .error-logs-list',
    tableRow: '[data-testid="error-log-row"], tbody tr, .error-log-item',
    tableHeader: 'thead th',
    noDataMessage: '[data-testid="no-data"], .no-data, .empty-state',

    // Table columns
    messageColumn: '[data-testid="message-column"]',
    levelColumn: '[data-testid="level-column"]',
    typeColumn: '[data-testid="type-column"]',
    timestampColumn: '[data-testid="timestamp-column"]',
    actionsColumn: '[data-testid="actions-column"]',

    // Sorting
    sortableHeader: 'th[data-sortable="true"], th.sortable',
    sortIcon: '.sort-icon, mat-icon',

    // Pagination
    pagination: '[data-testid="pagination"], .pagination, mat-paginator',
    pageSize:
      '[data-testid="page-size"], .page-size, mat-select[aria-label*="Items per page"]',
    nextPageButton: '[data-testid="next-page"], button[aria-label*="Next"]',
    prevPageButton: '[data-testid="prev-page"], button[aria-label*="Previous"]',
    pageInfo: '[data-testid="page-info"], .page-info',

    // Actions
    viewButton: '[data-testid="view-btn"], button[aria-label*="View"]',
    deleteButton: '[data-testid="delete-btn"], button[aria-label*="Delete"]',
    exportButton: '[data-testid="export-btn"], button:has-text("Export")',

    // Detail page
    detailPage: '[data-testid="error-log-detail"], .error-log-detail',
    detailTitle: '[data-testid="detail-title"], .detail-title',
    errorMessage: '[data-testid="error-message"], .error-message',
    errorStack: '[data-testid="error-stack"], .error-stack',
    errorContext: '[data-testid="error-context"], .error-context',
    errorMetadata: '[data-testid="error-metadata"], .error-metadata',
    backButton:
      '[data-testid="back-btn"], button:has-text("Back")],button[aria-label*="Back"]',

    // Delete confirmation
    deleteDialog:
      '[data-testid="delete-dialog"], .delete-dialog, mat-dialog-container',
    confirmDeleteButton:
      '[data-testid="confirm-delete"], button:has-text("Delete"), button:has-text("Confirm")',
    cancelDeleteButton:
      '[data-testid="cancel-delete"], button:has-text("Cancel")',

    // Loading and messages
    loadingSpinner: '[data-testid="loading"], .loading, .spinner, mat-spinner',
    successMessage: '[data-testid="success"], .success, .alert-success',
    errorMessageAlert: '[data-testid="error"], .error, .alert-error',
  };

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to error logs page
   */
  async goto(): Promise<void> {
    await this.page.goto('/system/monitoring/error-logs');
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
    expect(count).toBeGreaterThanOrEqual(3);
  }

  /**
   * Get stat card value
   */
  async getStatCardValue(cardSelector: string): Promise<string> {
    const card = this.page.locator(cardSelector);
    await expect(card).toBeVisible();
    const value = await card.locator('.value, .stat-value').textContent();
    return value?.trim() || '0';
  }

  /**
   * Filter by level
   */
  async filterByLevel(level: string): Promise<void> {
    await this.selectOption(this.selectors.levelFilter, level);
    if (await this.elementExists(this.selectors.applyFiltersButton)) {
      await this.clickElement(this.selectors.applyFiltersButton);
    }
    await this.waitForLoadingComplete();
  }

  /**
   * Filter by type
   */
  async filterByType(type: string): Promise<void> {
    await this.selectOption(this.selectors.typeFilter, type);
    if (await this.elementExists(this.selectors.applyFiltersButton)) {
      await this.clickElement(this.selectors.applyFiltersButton);
    }
    await this.waitForLoadingComplete();
  }

  /**
   * Filter by date range
   */
  async filterByDateRange(startDate: string, endDate: string): Promise<void> {
    if (await this.elementExists(this.selectors.startDateInput)) {
      await this.fillInput(this.selectors.startDateInput, startDate);
    }
    if (await this.elementExists(this.selectors.endDateInput)) {
      await this.fillInput(this.selectors.endDateInput, endDate);
    }
    if (await this.elementExists(this.selectors.applyFiltersButton)) {
      await this.clickElement(this.selectors.applyFiltersButton);
    }
    await this.waitForLoadingComplete();
  }

  /**
   * Clear all filters
   */
  async clearFilters(): Promise<void> {
    if (await this.elementExists(this.selectors.clearFiltersButton)) {
      await this.clickElement(this.selectors.clearFiltersButton);
      await this.waitForLoadingComplete();
    }
  }

  /**
   * Search error logs
   */
  async search(query: string): Promise<void> {
    await this.fillInput(this.selectors.searchInput, query);
    await this.page.keyboard.press('Enter');
    await this.waitForLoadingComplete();
  }

  /**
   * Sort by column
   */
  async sortByColumn(columnName: string): Promise<void> {
    const header = this.page.locator(`th:has-text("${columnName}")`);
    await header.click();
    await this.waitForLoadingComplete();
  }

  /**
   * Get table row count
   */
  async getRowCount(): Promise<number> {
    const rows = this.page.locator(this.selectors.tableRow);
    return await rows.count();
  }

  /**
   * Get error log row by index
   */
  getRow(index: number): Locator {
    return this.page.locator(this.selectors.tableRow).nth(index);
  }

  /**
   * Click view button on row
   */
  async viewErrorLog(index: number): Promise<void> {
    const row = this.getRow(index);
    const viewBtn = row.locator(this.selectors.viewButton);
    await viewBtn.click();
    await this.waitForElement(this.selectors.detailPage);
  }

  /**
   * Click view button on first row
   */
  async viewFirstErrorLog(): Promise<void> {
    await this.viewErrorLog(0);
  }

  /**
   * Delete error log
   */
  async deleteErrorLog(index: number): Promise<void> {
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
   * Export error logs
   */
  async exportErrorLogs(): Promise<void> {
    if (await this.elementExists(this.selectors.exportButton)) {
      await this.clickElement(this.selectors.exportButton);
      await this.page.waitForTimeout(2000); // Wait for download
    }
  }

  /**
   * Navigate to next page
   */
  async goToNextPage(): Promise<void> {
    await this.clickElement(this.selectors.nextPageButton);
    await this.waitForLoadingComplete();
  }

  /**
   * Navigate to previous page
   */
  async goToPreviousPage(): Promise<void> {
    await this.clickElement(this.selectors.prevPageButton);
    await this.waitForLoadingComplete();
  }

  /**
   * Change page size
   */
  async changePageSize(size: number): Promise<void> {
    if (await this.elementExists(this.selectors.pageSize)) {
      await this.clickElement(this.selectors.pageSize);
      await this.page.locator(`mat-option:has-text("${size}")`).click();
      await this.waitForLoadingComplete();
    }
  }

  /**
   * Verify error log detail page
   */
  async verifyDetailPageDisplayed(): Promise<void> {
    await this.verifyElementVisible(this.selectors.detailPage);
    await this.verifyElementVisible(this.selectors.errorMessage);
  }

  /**
   * Go back from detail page
   */
  async goBackFromDetail(): Promise<void> {
    await this.clickElement(this.selectors.backButton);
    await this.waitForElement(this.selectors.table);
  }

  /**
   * Verify no data message is displayed
   */
  async verifyNoDataDisplayed(): Promise<void> {
    await this.verifyElementVisible(this.selectors.noDataMessage);
  }

  /**
   * Verify page title
   */
  async verifyPageTitle(expectedTitle: string): Promise<void> {
    await this.verifyElementText(
      this.selectors.pageTitle,
      new RegExp(expectedTitle, 'i'),
    );
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
   * Check if table has data
   */
  async hasData(): Promise<boolean> {
    const rowCount = await this.getRowCount();
    return rowCount > 0;
  }
}
