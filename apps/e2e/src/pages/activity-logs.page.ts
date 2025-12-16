import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { TEST_TIMEOUTS } from '../fixtures/test-data';

/**
 * Activity Logs Page Object Model
 * Handles activity logs timeline, filtering, and detail viewing
 */
export class ActivityLogsPage extends BasePage {
  // Selectors
  private readonly selectors = {
    // Main containers
    page: '[data-testid="activity-logs-page"], .activity-logs-page',
    pageTitle: '[data-testid="page-title"], h1, .page-title',

    // Timeline view
    timeline:
      '[data-testid="activity-timeline"], .activity-timeline, .timeline',
    timelineItem: '[data-testid="timeline-item"], .timeline-item',
    timelineDate: '[data-testid="timeline-date"], .timeline-date',
    timelineAction: '[data-testid="timeline-action"], .timeline-action',
    timelineUser: '[data-testid="timeline-user"], .timeline-user',
    timelineSeverity: '[data-testid="timeline-severity"], .timeline-severity',

    // Filters
    filterPanel: '[data-testid="filter-panel"], .filter-panel',
    actionFilter: '[data-testid="action-filter"], select[name="action"]',
    severityFilter: '[data-testid="severity-filter"], select[name="severity"]',
    userFilter:
      '[data-testid="user-filter"], select[name="user"], input[name="user"]',
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

    // View toggle (if available)
    viewToggle: '[data-testid="view-toggle"]',
    listViewButton: '[data-testid="list-view"], button[aria-label*="List"]',
    timelineViewButton:
      '[data-testid="timeline-view"], button[aria-label*="Timeline"]',

    // Pagination
    pagination: '[data-testid="pagination"], .pagination, mat-paginator',
    pageSize:
      '[data-testid="page-size"], .page-size, mat-select[aria-label*="Items per page"]',
    nextPageButton: '[data-testid="next-page"], button[aria-label*="Next"]',
    prevPageButton: '[data-testid="prev-page"], button[aria-label*="Previous"]',
    pageInfo: '[data-testid="page-info"], .page-info',
    loadMoreButton: '[data-testid="load-more"], button:has-text("Load More")',

    // Actions
    viewButton: '[data-testid="view-btn"], button[aria-label*="View"]',
    detailsButton: '[data-testid="details-btn"], .details-btn',

    // Detail page
    detailPage: '[data-testid="activity-log-detail"], .activity-log-detail',
    detailTitle: '[data-testid="detail-title"], .detail-title',
    activityAction: '[data-testid="activity-action"], .activity-action',
    activityUser: '[data-testid="activity-user"], .activity-user',
    activityTimestamp:
      '[data-testid="activity-timestamp"], .activity-timestamp',
    activityDetails: '[data-testid="activity-details"], .activity-details',
    activityMetadata: '[data-testid="activity-metadata"], .activity-metadata',
    backButton:
      '[data-testid="back-btn"], button:has-text("Back"), button[aria-label*="Back"]',

    // Empty state
    noDataMessage: '[data-testid="no-data"], .no-data, .empty-state',

    // Loading and messages
    loadingSpinner: '[data-testid="loading"], .loading, .spinner, mat-spinner',
    successMessage: '[data-testid="success"], .success, .alert-success',
    errorMessage: '[data-testid="error"], .error, .alert-error',
  };

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to activity logs page
   */
  async goto(): Promise<void> {
    await this.page.goto('/system/monitoring/activity-logs');
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
   * Verify timeline view is displayed
   */
  async verifyTimelineDisplayed(): Promise<void> {
    await this.verifyElementVisible(this.selectors.timeline);
    const items = this.page.locator(this.selectors.timelineItem);
    const count = await items.count();
    expect(count).toBeGreaterThan(0);
  }

  /**
   * Get timeline item count
   */
  async getTimelineItemCount(): Promise<number> {
    const items = this.page.locator(this.selectors.timelineItem);
    return await items.count();
  }

  /**
   * Get timeline item by index
   */
  getTimelineItem(index: number): Locator {
    return this.page.locator(this.selectors.timelineItem).nth(index);
  }

  /**
   * Filter by action
   */
  async filterByAction(action: string): Promise<void> {
    await this.selectOption(this.selectors.actionFilter, action);
    if (await this.elementExists(this.selectors.applyFiltersButton)) {
      await this.clickElement(this.selectors.applyFiltersButton);
    }
    await this.waitForLoadingComplete();
  }

  /**
   * Filter by severity
   */
  async filterBySeverity(severity: string): Promise<void> {
    await this.selectOption(this.selectors.severityFilter, severity);
    if (await this.elementExists(this.selectors.applyFiltersButton)) {
      await this.clickElement(this.selectors.applyFiltersButton);
    }
    await this.waitForLoadingComplete();
  }

  /**
   * Filter by user
   */
  async filterByUser(username: string): Promise<void> {
    const userFilterInput = this.page.locator(this.selectors.userFilter);
    if ((await userFilterInput.getAttribute('type')) === 'text') {
      await this.fillInput(this.selectors.userFilter, username);
    } else {
      await this.selectOption(this.selectors.userFilter, username);
    }
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
   * Search activity logs
   */
  async search(query: string): Promise<void> {
    await this.fillInput(this.selectors.searchInput, query);
    await this.page.keyboard.press('Enter');
    await this.waitForLoadingComplete();
  }

  /**
   * Switch to list view
   */
  async switchToListView(): Promise<void> {
    if (await this.elementExists(this.selectors.listViewButton)) {
      await this.clickElement(this.selectors.listViewButton);
      await this.waitForLoadingComplete();
    }
  }

  /**
   * Switch to timeline view
   */
  async switchToTimelineView(): Promise<void> {
    if (await this.elementExists(this.selectors.timelineViewButton)) {
      await this.clickElement(this.selectors.timelineViewButton);
      await this.waitForLoadingComplete();
    }
  }

  /**
   * View activity details
   */
  async viewActivityDetails(index: number): Promise<void> {
    const item = this.getTimelineItem(index);

    // Try clicking on view button or details button
    const viewBtn = item.locator(this.selectors.viewButton);
    const detailsBtn = item.locator(this.selectors.detailsButton);

    if ((await viewBtn.count()) > 0) {
      await viewBtn.click();
    } else if ((await detailsBtn.count()) > 0) {
      await detailsBtn.click();
    } else {
      // Click on the item itself
      await item.click();
    }

    await this.waitForElement(this.selectors.detailPage);
  }

  /**
   * View first activity details
   */
  async viewFirstActivity(): Promise<void> {
    await this.viewActivityDetails(0);
  }

  /**
   * Verify activity detail page
   */
  async verifyDetailPageDisplayed(): Promise<void> {
    await this.verifyElementVisible(this.selectors.detailPage);
    await this.verifyElementVisible(this.selectors.activityAction);
    await this.verifyElementVisible(this.selectors.activityTimestamp);
  }

  /**
   * Go back from detail page
   */
  async goBackFromDetail(): Promise<void> {
    await this.clickElement(this.selectors.backButton);
    await this.waitForElement(this.selectors.timeline);
  }

  /**
   * Navigate to next page
   */
  async goToNextPage(): Promise<void> {
    if (await this.elementExists(this.selectors.nextPageButton)) {
      await this.clickElement(this.selectors.nextPageButton);
      await this.waitForLoadingComplete();
    }
  }

  /**
   * Navigate to previous page
   */
  async goToPreviousPage(): Promise<void> {
    if (await this.elementExists(this.selectors.prevPageButton)) {
      await this.clickElement(this.selectors.prevPageButton);
      await this.waitForLoadingComplete();
    }
  }

  /**
   * Load more activities (infinite scroll)
   */
  async loadMore(): Promise<void> {
    if (await this.elementExists(this.selectors.loadMoreButton)) {
      await this.clickElement(this.selectors.loadMoreButton);
      await this.waitForLoadingComplete();
    }
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
   * Check if timeline has data
   */
  async hasData(): Promise<boolean> {
    const itemCount = await this.getTimelineItemCount();
    return itemCount > 0;
  }

  /**
   * Get activity details from timeline item
   */
  async getActivityDetails(index: number): Promise<{
    action: string;
    user: string;
    timestamp: string;
  }> {
    const item = this.getTimelineItem(index);

    const action =
      (await item.locator(this.selectors.timelineAction).textContent()) || '';
    const user =
      (await item.locator(this.selectors.timelineUser).textContent()) || '';
    const timestamp =
      (await item.locator(this.selectors.timelineDate).textContent()) || '';

    return {
      action: action.trim(),
      user: user.trim(),
      timestamp: timestamp.trim(),
    };
  }
}
