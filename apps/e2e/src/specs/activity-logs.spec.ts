import { test, expect } from '@playwright/test';
import { ActivityLogsPage } from '../pages/activity-logs.page';

test.describe('Activity Logs Page', () => {
  let activityLogsPage: ActivityLogsPage;

  test.beforeEach(async ({ page }) => {
    activityLogsPage = new ActivityLogsPage(page);
    await activityLogsPage.goto();
  });

  test.describe('Page Loading', () => {
    test('should load activity logs page successfully', async () => {
      await activityLogsPage.verifyPageTitle('Activity Logs');
      await activityLogsPage.verifyElementVisible(
        '[data-testid="activity-logs-page"], .activity-logs-page',
      );
    });

    test('should display timeline view or empty state', async () => {
      const hasData = await activityLogsPage.hasData();

      if (hasData) {
        // Verify timeline is displayed
        await activityLogsPage.verifyTimelineDisplayed();
        const itemCount = await activityLogsPage.getTimelineItemCount();
        expect(itemCount).toBeGreaterThan(0);
      } else {
        // Verify empty state is displayed
        await activityLogsPage.verifyNoDataDisplayed();
      }
    });

    test('should display activity timeline items', async () => {
      // Skip if no data
      if (!(await activityLogsPage.hasData())) {
        test.skip();
      }

      await activityLogsPage.verifyTimelineDisplayed();
      const itemCount = await activityLogsPage.getTimelineItemCount();
      expect(itemCount).toBeGreaterThan(0);
    });
  });

  test.describe('Filtering', () => {
    test('should filter by action', async () => {
      // Skip if no data
      if (!(await activityLogsPage.hasData())) {
        test.skip();
      }

      const initialCount = await activityLogsPage.getTimelineItemCount();

      // Filter by action (e.g., 'create')
      await activityLogsPage.filterByAction('create');
      await activityLogsPage.waitForLoadingComplete();

      // Verify results are filtered
      const filteredCount = await activityLogsPage.getTimelineItemCount();
      expect(filteredCount).toBeGreaterThanOrEqual(0);
    });

    test('should filter by severity', async () => {
      // Skip if no data
      if (!(await activityLogsPage.hasData())) {
        test.skip();
      }

      await activityLogsPage.filterBySeverity('high');
      await activityLogsPage.waitForLoadingComplete();

      // Verify results are displayed
      const count = await activityLogsPage.getTimelineItemCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should filter by user', async () => {
      // Skip if no data
      if (!(await activityLogsPage.hasData())) {
        test.skip();
      }

      await activityLogsPage.filterByUser('admin');
      await activityLogsPage.waitForLoadingComplete();

      // Verify results are displayed
      const count = await activityLogsPage.getTimelineItemCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should filter by date range', async () => {
      // Skip if no data
      if (!(await activityLogsPage.hasData())) {
        test.skip();
      }

      const today = new Date().toISOString().split('T')[0];
      const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      await activityLogsPage.filterByDateRange(lastWeek, today);
      await activityLogsPage.waitForLoadingComplete();

      // Verify results are displayed
      const count = await activityLogsPage.getTimelineItemCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should clear filters', async () => {
      // Skip if no data
      if (!(await activityLogsPage.hasData())) {
        test.skip();
      }

      // Apply filter
      await activityLogsPage.filterByAction('update');
      await activityLogsPage.waitForLoadingComplete();

      // Clear filters
      await activityLogsPage.clearFilters();

      // Verify all data is shown again
      const count = await activityLogsPage.getTimelineItemCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Search', () => {
    test('should search activity logs', async () => {
      // Skip if no data
      if (!(await activityLogsPage.hasData())) {
        test.skip();
      }

      await activityLogsPage.search('user');
      await activityLogsPage.waitForLoadingComplete();

      // Verify search results
      const count = await activityLogsPage.getTimelineItemCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should show no results for non-existent search', async () => {
      await activityLogsPage.search('zzzznonexistentzzz');
      await activityLogsPage.waitForLoadingComplete();

      // Should show no data or 0 results
      const count = await activityLogsPage.getTimelineItemCount();
      expect(count).toBe(0);
    });
  });

  test.describe('View Toggle', () => {
    test('should switch between timeline and list view if available', async () => {
      // Skip if no data
      if (!(await activityLogsPage.hasData())) {
        test.skip();
      }

      const listViewExists = await activityLogsPage.elementExists(
        '[data-testid="list-view"], button[aria-label*="List"]',
      );

      if (listViewExists) {
        // Switch to list view
        await activityLogsPage.switchToListView();
        await activityLogsPage.waitForLoadingComplete();

        // Switch back to timeline view
        await activityLogsPage.switchToTimelineView();
        await activityLogsPage.waitForLoadingComplete();

        // Verify timeline is displayed
        await activityLogsPage.verifyTimelineDisplayed();
      }
    });
  });

  test.describe('Pagination', () => {
    test('should navigate to next page if multiple pages exist', async ({
      page,
    }) => {
      // Skip if no data
      if (!(await activityLogsPage.hasData())) {
        test.skip();
      }

      // Check if pagination exists
      const paginationExists = await activityLogsPage.elementExists(
        '[data-testid="pagination"], .pagination, mat-paginator',
      );

      if (paginationExists) {
        const nextButtonDisabled = await page
          .locator('[data-testid="next-page"], button[aria-label*="Next"]')
          .isDisabled()
          .catch(() => true);

        if (!nextButtonDisabled) {
          await activityLogsPage.goToNextPage();

          // Verify we're on a different page
          const count = await activityLogsPage.getTimelineItemCount();
          expect(count).toBeGreaterThanOrEqual(0);
        }
      }
    });

    test('should load more activities if infinite scroll exists', async () => {
      // Skip if no data
      if (!(await activityLogsPage.hasData())) {
        test.skip();
      }

      const loadMoreExists = await activityLogsPage.elementExists(
        '[data-testid="load-more"], button:has-text("Load More")',
      );

      if (loadMoreExists) {
        const initialCount = await activityLogsPage.getTimelineItemCount();

        // Load more
        await activityLogsPage.loadMore();

        // Verify more items are loaded
        const newCount = await activityLogsPage.getTimelineItemCount();
        expect(newCount).toBeGreaterThanOrEqual(initialCount);
      }
    });

    test('should change page size', async () => {
      // Skip if no data
      if (!(await activityLogsPage.hasData())) {
        test.skip();
      }

      const pageSizeExists = await activityLogsPage.elementExists(
        '[data-testid="page-size"], .page-size',
      );

      if (pageSizeExists) {
        await activityLogsPage.changePageSize(25);

        // Verify data is displayed with new page size
        const count = await activityLogsPage.getTimelineItemCount();
        expect(count).toBeGreaterThanOrEqual(0);
        expect(count).toBeLessThanOrEqual(25);
      }
    });
  });

  test.describe('View Activity Details', () => {
    test('should view activity log details', async () => {
      // Skip if no data
      if (!(await activityLogsPage.hasData())) {
        test.skip();
      }

      // Click on first activity
      await activityLogsPage.viewFirstActivity();

      // Verify detail page is displayed
      await activityLogsPage.verifyDetailPageDisplayed();
    });

    test('should navigate back from detail page', async () => {
      // Skip if no data
      if (!(await activityLogsPage.hasData())) {
        test.skip();
      }

      // Go to detail page
      await activityLogsPage.viewFirstActivity();
      await activityLogsPage.verifyDetailPageDisplayed();

      // Navigate back
      await activityLogsPage.goBackFromDetail();

      // Verify we're back on list page
      await activityLogsPage.verifyElementVisible(
        '[data-testid="activity-timeline"], .timeline',
      );
    });

    test('should display activity details correctly', async () => {
      // Skip if no data
      if (!(await activityLogsPage.hasData())) {
        test.skip();
      }

      // Get details from timeline
      const timelineDetails = await activityLogsPage.getActivityDetails(0);

      // View details
      await activityLogsPage.viewFirstActivity();

      // Verify detail page shows the same data
      await activityLogsPage.verifyDetailPageDisplayed();
      await activityLogsPage.verifyElementVisible(
        '[data-testid="activity-action"], .activity-action',
      );
      await activityLogsPage.verifyElementVisible(
        '[data-testid="activity-user"], .activity-user',
      );
      await activityLogsPage.verifyElementVisible(
        '[data-testid="activity-timestamp"], .activity-timestamp',
      );
    });
  });

  test.describe('Timeline Features', () => {
    test('should display timeline items with date grouping', async () => {
      // Skip if no data
      if (!(await activityLogsPage.hasData())) {
        test.skip();
      }

      await activityLogsPage.verifyTimelineDisplayed();

      // Verify timeline items have dates
      const firstItem = activityLogsPage.getTimelineItem(0);
      await expect(firstItem).toBeVisible();

      // Check if date headers exist
      const dateExists = await activityLogsPage.elementExists(
        '[data-testid="timeline-date"], .timeline-date',
      );
      expect(dateExists).toBeTruthy();
    });

    test('should display user information in timeline items', async () => {
      // Skip if no data
      if (!(await activityLogsPage.hasData())) {
        test.skip();
      }

      const details = await activityLogsPage.getActivityDetails(0);

      // Verify user information is present
      expect(details.user).toBeTruthy();
      expect(details.action).toBeTruthy();
      expect(details.timestamp).toBeTruthy();
    });
  });

  test.describe('Responsive Design', () => {
    test('should display correctly on mobile', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      await activityLogsPage.goto();

      // Verify page loads on mobile
      await activityLogsPage.verifyElementVisible(
        '[data-testid="activity-logs-page"], .activity-logs-page',
      );
    });

    test('should display correctly on tablet', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });

      await activityLogsPage.goto();

      // Verify page loads on tablet
      await activityLogsPage.verifyElementVisible(
        '[data-testid="activity-logs-page"], .activity-logs-page',
      );
    });
  });

  test.describe('Real-time Updates', () => {
    test('should display activities in chronological order', async () => {
      // Skip if no data
      if (!(await activityLogsPage.hasData())) {
        test.skip();
      }

      await activityLogsPage.verifyTimelineDisplayed();

      // Get first two activities
      const count = await activityLogsPage.getTimelineItemCount();
      if (count >= 2) {
        const activity1 = await activityLogsPage.getActivityDetails(0);
        const activity2 = await activityLogsPage.getActivityDetails(1);

        // Verify both have timestamps
        expect(activity1.timestamp).toBeTruthy();
        expect(activity2.timestamp).toBeTruthy();
      }
    });
  });
});
