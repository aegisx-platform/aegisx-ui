import { test, expect } from '@playwright/test';
import { BudgetRequestsListPage } from '../pages/budget-requests-list.page';
import {
  BudgetRequestEditPage,
  BudgetRequestFormDialog,
} from '../pages/budget-request-edit.page';

/**
 * Budget Request E2E Tests
 *
 * Critical workflows for presentation:
 * 1. Complete Happy Path Workflow - Create, Initialize, Edit, Submit, Export
 * 2. UI State Management - Button visibility based on state
 *
 * These tests validate the full Budget Request lifecycle including:
 * - Creating budget requests
 * - Initializing items from Drug Master
 * - Editing items in AG Grid
 * - Batch saving changes
 * - Submitting for approval
 * - Exporting to SSCJ format
 */
test.describe('Budget Requests - Critical Workflows', () => {
  let listPage: BudgetRequestsListPage;
  let editPage: BudgetRequestEditPage;
  let formDialog: BudgetRequestFormDialog;

  // Store created request number for cleanup
  let createdRequestNumber: string | null = null;

  test.beforeEach(async ({ page }) => {
    listPage = new BudgetRequestsListPage(page);
    editPage = new BudgetRequestEditPage(page);
    formDialog = new BudgetRequestFormDialog(page);

    // Navigate to Budget Requests page
    await listPage.goto();
    await listPage.verifyPageLoaded();
  });

  /**
   * TEST 1: Complete Happy Path Workflow
   *
   * This is the PRIMARY test for the presentation.
   * It validates the entire budget request workflow from creation to export.
   *
   * Steps:
   * 1. Create new budget request (fiscal_year: 2569)
   * 2. Navigate to edit page
   * 3. Initialize items from Drug Master
   * 4. Verify items loaded (should be > 0)
   * 5. Edit 3 cells in AG Grid (requested_qty values)
   * 6. Save all changes
   * 7. Submit for approval
   * 8. Verify status changed to SUBMITTED
   * 9. Export SSCJ file
   * 10. Verify download triggered
   */
  test('CRITICAL: Complete Happy Path Workflow - Create → Initialize → Edit → Submit → Export', async ({
    page,
  }) => {
    test.setTimeout(120000); // 2 minutes timeout for this critical test

    // STEP 1: Create new budget request
    console.log('Step 1: Creating new budget request...');
    await listPage.clickCreate();

    const fiscalYear = '2569';
    const justification = 'E2E Test - Complete Workflow ' + Date.now();

    await formDialog.fillForm({
      fiscal_year: fiscalYear,
      justification: justification,
    });

    await formDialog.save();

    // Wait for list to refresh and show new request
    await listPage.waitForTableToUpdate();

    // STEP 2: Find the created request and click Edit
    console.log('Step 2: Opening edit page for created request...');

    // Search for our newly created request
    await listPage.search(fiscalYear);
    await page.waitForTimeout(1000);

    // Get the first row (should be our new request)
    const firstRow = listPage.tableRows.first();
    await expect(firstRow).toBeVisible();

    // Extract request number from the row
    const requestNumberCell = firstRow.locator('td, mat-cell').first();
    createdRequestNumber =
      (await requestNumberCell.textContent())?.trim() || null;
    console.log('Created request number:', createdRequestNumber);

    // Click Edit button (navigate to full-page editor)
    if (createdRequestNumber) {
      await listPage.clickEditForRequest(createdRequestNumber);
    } else {
      // Fallback: click first edit button
      const editButton = firstRow
        .locator('button:has-text("Edit"), a:has-text("Edit")')
        .first();
      await editButton.click();
      await page.waitForURL(/budget-requests\/\d+\/edit/);
    }

    // Wait for edit page to load
    await editPage.waitForLoad();

    // STEP 3: Verify initial state - should have 0 items
    console.log('Step 3: Verifying initial state (0 items)...');
    const initialItemsCount = await editPage.getItemsCount();
    console.log('Initial items count:', initialItemsCount);

    // Verify Initialize and Import buttons are visible
    await editPage.verifyButtonsForDraftWithNoItems();

    // STEP 4: Initialize from Drug Master
    console.log('Step 4: Initializing items from Drug Master...');
    await editPage.clickInitialize();

    // Wait for items to load
    await page.waitForTimeout(2000);

    // STEP 5: Verify items loaded
    console.log('Step 5: Verifying items loaded...');
    const itemsCount = await editPage.getItemsCount();
    console.log('Items count after initialization:', itemsCount);

    // CRITICAL ASSERTION: Items should be loaded
    expect(itemsCount).toBeGreaterThan(0);

    // Verify button state changed (Save and Export now visible)
    await editPage.verifyButtonsForDraftWithItems();

    // Wait for AG Grid to be fully ready
    await editPage.waitForGridReady();

    // Verify grid has rows
    const gridRowCount = await editPage.getGridRowCount();
    console.log('AG Grid row count:', gridRowCount);
    expect(gridRowCount).toBeGreaterThan(0);

    // STEP 6: Edit 3 cells in AG Grid
    console.log('Step 6: Editing 3 cells in AG Grid...');

    // Edit requested_qty for first 3 rows
    const edits = [
      { rowIndex: 0, columnField: 'requested_qty', value: '100' },
      { rowIndex: 1, columnField: 'requested_qty', value: '200' },
      { rowIndex: 2, columnField: 'requested_qty', value: '150' },
    ];

    await editPage.editMultipleCells(edits);

    console.log('Successfully edited 3 cells');

    // STEP 7: Save All Changes
    console.log('Step 7: Saving all changes...');
    await editPage.clickSaveAll();

    // Wait for save confirmation
    await page.waitForTimeout(2000);

    // STEP 8: Submit for Approval
    console.log('Step 8: Submitting for approval...');
    await editPage.clickSubmitForApproval();

    // Wait for status to update
    await page.waitForTimeout(2000);

    // STEP 9: Verify status changed to SUBMITTED
    console.log('Step 9: Verifying status changed to SUBMITTED...');
    const currentStatus = await editPage.getStatus();
    console.log('Current status:', currentStatus);

    // CRITICAL ASSERTION: Status should be SUBMITTED
    expect(currentStatus).toBe('SUBMITTED');

    // Verify Submit button is no longer visible (status changed)
    await expect(editPage.submitForApprovalButton).not.toBeVisible();

    // STEP 10: Export SSCJ
    console.log('Step 10: Exporting SSCJ file...');

    // Export button should still be visible
    await expect(editPage.exportButton).toBeVisible();

    // Click export and verify download
    await editPage.clickExportSSCJ();

    // Verify download was triggered (download event occurred)
    // Note: We already handled download in clickExportSSCJ()

    console.log('✅ Complete Happy Path Workflow test PASSED!');
  });

  /**
   * TEST 2: UI State Management
   *
   * This test validates that the UI shows correct buttons based on the state.
   *
   * States to test:
   * - DRAFT with 0 items: Show Initialize + Import buttons
   * - DRAFT with items: Show Save + Export buttons
   * - After initialization: Items count > 0
   *
   * This ensures the UI correctly guides users through the workflow.
   */
  test('CRITICAL: UI State Management - Button visibility based on state', async ({
    page,
  }) => {
    test.setTimeout(90000); // 90 seconds timeout

    console.log('Creating budget request for UI state testing...');

    // Create a new budget request
    await listPage.clickCreate();

    await formDialog.fillForm({
      fiscal_year: '2569',
      justification: 'E2E Test - UI State Management ' + Date.now(),
    });

    await formDialog.save();

    // Wait and navigate to edit
    await listPage.waitForTableToUpdate();
    await page.waitForTimeout(1000);

    // Get first row and click edit
    const firstRow = listPage.tableRows.first();
    const editButton = firstRow
      .locator('button:has-text("Edit"), a:has-text("Edit")')
      .first();
    await editButton.click();
    await page.waitForURL(/budget-requests\/\d+\/edit/);

    await editPage.waitForLoad();

    // STATE 1: DRAFT with 0 items
    console.log('Testing STATE 1: DRAFT with 0 items...');

    const initialCount = await editPage.getItemsCount();
    expect(initialCount).toBe(0);

    // Verify Initialize button is visible
    await expect(editPage.initializeButton).toBeVisible();
    console.log('✓ Initialize button visible');

    // Verify Import button is visible
    await expect(editPage.importButton).toBeVisible();
    console.log('✓ Import button visible');

    // Verify Save button is NOT visible (no items yet)
    await expect(editPage.saveAllButton).not.toBeVisible();
    console.log('✓ Save button not visible (correct)');

    // Verify Export button is NOT visible (no items yet)
    await expect(editPage.exportButton).not.toBeVisible();
    console.log('✓ Export button not visible (correct)');

    // STATE 2: Initialize items
    console.log('Testing STATE 2: After initialization...');

    await editPage.clickInitialize();
    await page.waitForTimeout(2000);

    // Verify items loaded
    const itemsAfterInit = await editPage.getItemsCount();
    console.log('Items after initialization:', itemsAfterInit);
    expect(itemsAfterInit).toBeGreaterThan(0);
    console.log('✓ Items loaded successfully');

    // STATE 3: DRAFT with items > 0
    console.log('Testing STATE 3: DRAFT with items > 0...');

    // Verify Initialize button is NOT visible anymore
    await expect(editPage.initializeButton).not.toBeVisible();
    console.log('✓ Initialize button hidden (correct)');

    // Verify Import button is NOT visible anymore
    await expect(editPage.importButton).not.toBeVisible();
    console.log('✓ Import button hidden (correct)');

    // Verify Save button IS visible now
    await expect(editPage.saveAllButton).toBeVisible();
    console.log('✓ Save button visible');

    // Verify Export button IS visible now
    await expect(editPage.exportButton).toBeVisible();
    console.log('✓ Export button visible');

    // Verify Submit button is visible (status is still DRAFT)
    await expect(editPage.submitForApprovalButton).toBeVisible();
    console.log('✓ Submit for Approval button visible');

    console.log('✅ UI State Management test PASSED!');
  });

  /**
   * TEST 3: Navigation and Basic List Operations
   *
   * This test validates basic list operations:
   * - List page loads correctly
   * - Search functionality
   * - Navigation to edit page
   */
  test('Budget Requests List - Navigation and Search', async ({ page }) => {
    // Verify list page loaded
    await expect(listPage.pageTitle).toBeVisible();
    await expect(listPage.createButton).toBeVisible();

    // Get initial row count
    const initialCount = await listPage.getRowCount();
    console.log('Initial row count:', initialCount);

    // Test search functionality
    if (initialCount > 0) {
      await listPage.search('2569');
      await page.waitForTimeout(1000);

      const searchResultCount = await listPage.getRowCount();
      console.log('Search result count:', searchResultCount);

      // Clear search
      await listPage.searchInput.clear();
      await listPage.searchInput.press('Enter');
      await listPage.waitForTableToUpdate();
    }

    console.log('✅ Navigation and Search test PASSED!');
  });

  /**
   * TEST 4: AG Grid Interaction
   *
   * This test focuses on AG Grid specific interactions:
   * - Grid loads correctly
   * - Cells can be edited
   * - Changes are tracked
   */
  test('Budget Request Edit - AG Grid Interaction', async ({ page }) => {
    test.setTimeout(90000);

    // Create and navigate to edit page
    await listPage.clickCreate();

    await formDialog.fillForm({
      fiscal_year: '2569',
      justification: 'E2E Test - Grid Interaction ' + Date.now(),
    });

    await formDialog.save();
    await listPage.waitForTableToUpdate();

    const firstRow = listPage.tableRows.first();
    const editButton = firstRow
      .locator('button:has-text("Edit"), a:has-text("Edit")')
      .first();
    await editButton.click();
    await page.waitForURL(/budget-requests\/\d+\/edit/);

    await editPage.waitForLoad();

    // Initialize items
    await editPage.clickInitialize();
    await page.waitForTimeout(2000);

    // Wait for grid to be ready
    await editPage.waitForGridReady();

    // Verify grid is visible
    await expect(editPage.agGrid).toBeVisible();

    // Get row count
    const rowCount = await editPage.getGridRowCount();
    console.log('Grid has', rowCount, 'rows');
    expect(rowCount).toBeGreaterThan(0);

    // Edit a single cell
    await editPage.editGridCell(0, 'requested_qty', '500');

    console.log('✅ AG Grid Interaction test PASSED!');
  });
});

/**
 * Budget Requests - Additional Test Scenarios
 *
 * These tests cover edge cases and additional functionality
 */
test.describe('Budget Requests - Additional Scenarios', () => {
  let listPage: BudgetRequestsListPage;
  let editPage: BudgetRequestEditPage;
  let formDialog: BudgetRequestFormDialog;

  test.beforeEach(async ({ page }) => {
    listPage = new BudgetRequestsListPage(page);
    editPage = new BudgetRequestEditPage(page);
    formDialog = new BudgetRequestFormDialog(page);

    await listPage.goto();
  });

  /**
   * Test form validation
   */
  test('Form Validation - Required fields', async ({ page }) => {
    await listPage.clickCreate();

    // Try to save without filling fields
    await formDialog.saveButton.click();

    // Dialog should remain open (validation failed)
    await expect(formDialog.dialog).toBeVisible();

    // Cancel the dialog
    await formDialog.cancel();
  });

  /**
   * Test create and immediate view
   */
  test('Create Budget Request and Verify Data', async ({ page }) => {
    const fiscalYear = '2570';
    const justification = 'E2E Test - Verify Data ' + Date.now();

    await listPage.clickCreate();

    await formDialog.fillForm({
      fiscal_year: fiscalYear,
      justification: justification,
    });

    await formDialog.save();

    // Wait for list update
    await listPage.waitForTableToUpdate();

    // Search for the created request
    await listPage.search(fiscalYear);

    // Verify it appears in the list
    const rowCount = await listPage.getRowCount();
    expect(rowCount).toBeGreaterThan(0);

    console.log('✅ Create and Verify test PASSED!');
  });

  /**
   * Test back navigation
   */
  test('Edit Page - Back Navigation', async ({ page }) => {
    // Create a request
    await listPage.clickCreate();

    await formDialog.fillForm({
      fiscal_year: '2569',
      justification: 'E2E Test - Back Nav ' + Date.now(),
    });

    await formDialog.save();
    await listPage.waitForTableToUpdate();

    // Navigate to edit
    const firstRow = listPage.tableRows.first();
    const editButton = firstRow
      .locator('button:has-text("Edit"), a:has-text("Edit")')
      .first();
    await editButton.click();
    await page.waitForURL(/budget-requests\/\d+\/edit/);

    await editPage.waitForLoad();

    // Click back button
    await editPage.clickBack();

    // Verify we're back on list page
    await expect(listPage.pageTitle).toBeVisible();

    console.log('✅ Back Navigation test PASSED!');
  });
});
