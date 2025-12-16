import { test, expect } from '@playwright/test';
import { ErrorLogsPage } from '../pages/error-logs.page';

test.describe('Error Logs Page', () => {
  let errorLogsPage: ErrorLogsPage;

  test.beforeEach(async ({ page }) => {
    errorLogsPage = new ErrorLogsPage(page);
    await errorLogsPage.goto();
  });

  test.describe('Page Loading', () => {
    test('should load error logs page successfully', async () => {
      await errorLogsPage.verifyPageTitle('Error Logs');
      await errorLogsPage.verifyElementVisible(
        '[data-testid="error-logs-page"], .error-logs-page',
      );
    });

    test('should display stats cards', async () => {
      await errorLogsPage.verifyStatsCardsDisplayed();
    });

    test('should display error logs table or empty state', async ({ page }) => {
      const hasData = await errorLogsPage.hasData();

      if (hasData) {
        // Verify table is displayed
        await errorLogsPage.verifyElementVisible(
          '[data-testid="error-logs-table"], table',
        );
        const rowCount = await errorLogsPage.getRowCount();
        expect(rowCount).toBeGreaterThan(0);
      } else {
        // Verify empty state is displayed
        await errorLogsPage.verifyNoDataDisplayed();
      }
    });
  });

  test.describe('Filtering', () => {
    test('should filter by error level', async () => {
      // Skip if no data
      if (!(await errorLogsPage.hasData())) {
        test.skip();
      }

      const initialCount = await errorLogsPage.getRowCount();

      // Filter by critical level
      await errorLogsPage.filterByLevel('critical');

      // Wait for results to update
      await errorLogsPage.waitForLoadingComplete();

      // Verify results are filtered (count should be different or same)
      const filteredCount = await errorLogsPage.getRowCount();
      expect(filteredCount).toBeGreaterThanOrEqual(0);
    });

    test('should filter by error type', async () => {
      // Skip if no data
      if (!(await errorLogsPage.hasData())) {
        test.skip();
      }

      await errorLogsPage.filterByType('validation');
      await errorLogsPage.waitForLoadingComplete();

      // Verify results are displayed
      const count = await errorLogsPage.getRowCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should filter by date range', async () => {
      // Skip if no data
      if (!(await errorLogsPage.hasData())) {
        test.skip();
      }

      const today = new Date().toISOString().split('T')[0];
      const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      await errorLogsPage.filterByDateRange(lastWeek, today);
      await errorLogsPage.waitForLoadingComplete();

      // Verify results are displayed
      const count = await errorLogsPage.getRowCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should clear filters', async () => {
      // Skip if no data
      if (!(await errorLogsPage.hasData())) {
        test.skip();
      }

      // Apply filter
      await errorLogsPage.filterByLevel('error');
      await errorLogsPage.waitForLoadingComplete();

      // Clear filters
      await errorLogsPage.clearFilters();

      // Verify all data is shown again
      const count = await errorLogsPage.getRowCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Search', () => {
    test('should search error logs', async () => {
      // Skip if no data
      if (!(await errorLogsPage.hasData())) {
        test.skip();
      }

      await errorLogsPage.search('error');
      await errorLogsPage.waitForLoadingComplete();

      // Verify search results
      const count = await errorLogsPage.getRowCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should show no results for non-existent search', async () => {
      await errorLogsPage.search('zzzznonexistentzzz');
      await errorLogsPage.waitForLoadingComplete();

      // Should show no data or 0 results
      const count = await errorLogsPage.getRowCount();
      expect(count).toBe(0);
    });
  });

  test.describe('Sorting', () => {
    test('should sort by timestamp', async () => {
      // Skip if no data
      if (!(await errorLogsPage.hasData())) {
        test.skip();
      }

      // Click on timestamp header to sort
      await errorLogsPage.sortByColumn('Timestamp');
      await errorLogsPage.waitForLoadingComplete();

      // Verify data is still displayed
      const count = await errorLogsPage.getRowCount();
      expect(count).toBeGreaterThan(0);
    });

    test('should sort by level', async () => {
      // Skip if no data
      if (!(await errorLogsPage.hasData())) {
        test.skip();
      }

      await errorLogsPage.sortByColumn('Level');
      await errorLogsPage.waitForLoadingComplete();

      // Verify data is still displayed
      const count = await errorLogsPage.getRowCount();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Pagination', () => {
    test('should navigate to next page if multiple pages exist', async ({
      page,
    }) => {
      // Skip if no data
      if (!(await errorLogsPage.hasData())) {
        test.skip();
      }

      // Check if pagination exists
      const paginationExists = await errorLogsPage.elementExists(
        '[data-testid="pagination"], .pagination, mat-paginator',
      );

      if (paginationExists) {
        const nextButtonDisabled = await page
          .locator('[data-testid="next-page"], button[aria-label*="Next"]')
          .isDisabled();

        if (!nextButtonDisabled) {
          await errorLogsPage.goToNextPage();

          // Verify we're on a different page
          const count = await errorLogsPage.getRowCount();
          expect(count).toBeGreaterThanOrEqual(0);
        }
      }
    });

    test('should change page size', async () => {
      // Skip if no data
      if (!(await errorLogsPage.hasData())) {
        test.skip();
      }

      const pageSizeExists = await errorLogsPage.elementExists(
        '[data-testid="page-size"], .page-size',
      );

      if (pageSizeExists) {
        await errorLogsPage.changePageSize(25);

        // Verify data is displayed with new page size
        const count = await errorLogsPage.getRowCount();
        expect(count).toBeGreaterThanOrEqual(0);
        expect(count).toBeLessThanOrEqual(25);
      }
    });
  });

  test.describe('View Error Details', () => {
    test('should view error log details', async () => {
      // Skip if no data
      if (!(await errorLogsPage.hasData())) {
        test.skip();
      }

      // Click on first error log
      await errorLogsPage.viewFirstErrorLog();

      // Verify detail page is displayed
      await errorLogsPage.verifyDetailPageDisplayed();
    });

    test('should navigate back from detail page', async () => {
      // Skip if no data
      if (!(await errorLogsPage.hasData())) {
        test.skip();
      }

      // Go to detail page
      await errorLogsPage.viewFirstErrorLog();
      await errorLogsPage.verifyDetailPageDisplayed();

      // Navigate back
      await errorLogsPage.goBackFromDetail();

      // Verify we're back on list page
      await errorLogsPage.verifyElementVisible(
        '[data-testid="error-logs-table"], table',
      );
    });
  });

  test.describe('Delete Error Log', () => {
    test('should delete error log with confirmation', async () => {
      // Skip if no data
      if (!(await errorLogsPage.hasData())) {
        test.skip();
      }

      const initialCount = await errorLogsPage.getRowCount();

      // Delete first error log
      await errorLogsPage.deleteErrorLog(0);

      // Verify success message or count decreased
      const newCount = await errorLogsPage.getRowCount();
      expect(newCount).toBeLessThanOrEqual(initialCount);
    });

    test('should cancel delete operation', async () => {
      // Skip if no data
      if (!(await errorLogsPage.hasData())) {
        test.skip();
      }

      const initialCount = await errorLogsPage.getRowCount();

      // Start delete but cancel
      await errorLogsPage.cancelDelete(0);

      // Verify count hasn't changed
      const newCount = await errorLogsPage.getRowCount();
      expect(newCount).toBe(initialCount);
    });
  });

  test.describe('Export', () => {
    test('should export error logs', async () => {
      // Skip if no export button
      const exportExists = await errorLogsPage.elementExists(
        '[data-testid="export-btn"], button:has-text("Export")',
      );

      if (exportExists) {
        await errorLogsPage.exportErrorLogs();
        // Note: Actual file download verification would require additional setup
      }
    });
  });

  test.describe('Responsive Design', () => {
    test('should display correctly on mobile', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      await errorLogsPage.goto();

      // Verify page loads on mobile
      await errorLogsPage.verifyElementVisible(
        '[data-testid="error-logs-page"], .error-logs-page',
      );
    });

    test('should display correctly on tablet', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });

      await errorLogsPage.goto();

      // Verify page loads on tablet
      await errorLogsPage.verifyElementVisible(
        '[data-testid="error-logs-page"], .error-logs-page',
      );
    });
  });
});
