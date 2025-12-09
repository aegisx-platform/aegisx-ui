import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { TEST_TIMEOUTS } from '../fixtures/test-data';

/**
 * Budget Request Edit Page Object Model
 * Handles interactions with the budget request edit page (full-page editor with AG Grid)
 */
export class BudgetRequestEditPage extends BasePage {
  // Header elements
  readonly pageTitle: Locator;
  readonly backButton: Locator;

  // Budget Request Info Card
  readonly requestNumber: Locator;
  readonly fiscalYear: Locator;
  readonly statusBadge: Locator;
  readonly totalAmount: Locator;

  // Budget Items Grid section
  readonly itemsCountLabel: Locator;
  readonly initializeButton: Locator;
  readonly importButton: Locator;
  readonly saveAllButton: Locator;
  readonly exportButton: Locator;

  // AG Grid
  readonly agGrid: Locator;
  readonly agGridRows: Locator;
  readonly agGridCells: Locator;

  // Action buttons
  readonly submitForApprovalButton: Locator;
  readonly departmentApproveButton: Locator;
  readonly financeApproveButton: Locator;
  readonly cancelButton: Locator;

  // Loading and states
  readonly loadingSpinner: Locator;
  readonly fileInput: Locator;

  constructor(page: Page) {
    super(page);

    // Header
    this.pageTitle = page.locator('h1:has-text("Edit Budget Request")');
    this.backButton = page.locator('button mat-icon:has-text("arrow_back")');

    // Info card
    this.requestNumber = page
      .locator('.info-item:has-text("Request Number") span')
      .last();
    this.fiscalYear = page
      .locator('.info-item:has-text("Fiscal Year") span')
      .last();
    this.statusBadge = page.locator('.status-badge');
    this.totalAmount = page
      .locator('.info-item:has-text("Total Amount") span')
      .last();

    // Items section buttons
    this.itemsCountLabel = page.locator(
      'mat-card-title:has-text("Budget Items")',
    );
    this.initializeButton = page.locator(
      'button:has-text("Initialize from Drug Master")',
    );
    this.importButton = page.locator('button:has-text("Import Excel/CSV")');
    this.saveAllButton = page.locator('button:has-text("Save All Changes")');
    this.exportButton = page.locator('button:has-text("Export SSCJ")');

    // AG Grid - using standard AG Grid selectors
    this.agGrid = page.locator('.ag-root, ag-grid-angular');
    this.agGridRows = page.locator('.ag-row');
    this.agGridCells = page.locator('.ag-cell');

    // Action buttons
    this.submitForApprovalButton = page.locator(
      'button:has-text("Submit for Approval")',
    );
    this.departmentApproveButton = page.locator(
      'button:has-text("Department Approve")',
    );
    this.financeApproveButton = page.locator(
      'button:has-text("Finance Approve")',
    );
    this.cancelButton = page.locator(
      '.action-buttons button:has-text("Cancel")',
    );

    // Loading
    this.loadingSpinner = page.locator('mat-spinner');
    this.fileInput = page.locator('input[type="file"]');
  }

  /**
   * Navigate to edit page for a specific budget request ID
   */
  async goto(budgetRequestId: number): Promise<void> {
    await this.page.goto(
      `/inventory/budget/budget-requests/${budgetRequestId}/edit`,
    );
    await this.waitForLoad();
  }

  /**
   * Wait for the page to be fully loaded
   */
  async waitForLoad(): Promise<void> {
    // Wait for page load
    await this.page.waitForLoadState('networkidle', {
      timeout: TEST_TIMEOUTS.navigation,
    });

    // Wait for loading spinner to disappear
    try {
      await this.loadingSpinner.waitFor({ state: 'visible', timeout: 2000 });
      await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 15000 });
    } catch {
      // Spinner might not appear or already gone
    }

    // Verify page title is visible
    await expect(this.pageTitle).toBeVisible({ timeout: TEST_TIMEOUTS.medium });
  }

  /**
   * Get current status of the budget request
   */
  async getStatus(): Promise<string> {
    return (await this.statusBadge.textContent())?.trim() || '';
  }

  /**
   * Get the count of budget items from the label
   */
  async getItemsCount(): Promise<number> {
    const labelText = await this.itemsCountLabel.textContent();
    const match = labelText?.match(/\((\d+)\s+items\)/);
    return match ? parseInt(match[1]) : 0;
  }

  /**
   * Wait for AG Grid to be ready and loaded with data
   */
  async waitForGridReady(): Promise<void> {
    // Wait for AG Grid root to be visible
    await this.agGrid.waitFor({
      state: 'visible',
      timeout: TEST_TIMEOUTS.medium,
    });

    // Wait for grid to finish loading (rows to appear)
    await this.page.waitForTimeout(1000);

    // Check if we have rows or empty grid
    const rowCount = await this.agGridRows.count();
    console.log(`AG Grid loaded with ${rowCount} rows`);
  }

  /**
   * Get number of rows in AG Grid
   */
  async getGridRowCount(): Promise<number> {
    await this.page.waitForTimeout(500); // Small delay for grid to stabilize
    return await this.agGridRows.count();
  }

  /**
   * Click Initialize from Drug Master button
   */
  async clickInitialize(): Promise<void> {
    await this.initializeButton.click();

    // Wait for loading to start and complete
    await this.page.waitForTimeout(500);

    try {
      await this.loadingSpinner.waitFor({ state: 'visible', timeout: 2000 });
      await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 30000 });
    } catch {
      // Loading might be very fast
    }

    // Wait for grid to be populated
    await this.waitForGridReady();
  }

  /**
   * Click Import Excel/CSV button and upload file
   */
  async clickImportAndUpload(filePath: string): Promise<void> {
    // Set up file chooser handler before clicking
    const fileChooserPromise = this.page.waitForEvent('filechooser', {
      timeout: 5000,
    });

    await this.importButton.click();

    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePath);

    // Wait for upload to complete
    await this.page.waitForTimeout(1000);

    try {
      await this.loadingSpinner.waitFor({ state: 'visible', timeout: 2000 });
      await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 30000 });
    } catch {
      // Loading might be very fast
    }
  }

  /**
   * Edit a cell in AG Grid by row index and column field
   */
  async editGridCell(
    rowIndex: number,
    columnField: string,
    value: string,
  ): Promise<void> {
    // Find the specific cell
    const cell = this.page.locator(
      `.ag-row[row-index="${rowIndex}"] .ag-cell[col-id="${columnField}"]`,
    );

    // Double-click to enter edit mode
    await cell.dblclick();
    await this.page.waitForTimeout(200);

    // Clear and type new value
    await this.page.keyboard.press('Control+A');
    await this.page.keyboard.type(value);

    // Press Enter to confirm
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(200);
  }

  /**
   * Edit multiple cells in AG Grid
   * @param edits Array of { rowIndex, columnField, value }
   */
  async editMultipleCells(
    edits: Array<{ rowIndex: number; columnField: string; value: string }>,
  ): Promise<void> {
    for (const edit of edits) {
      await this.editGridCell(edit.rowIndex, edit.columnField, edit.value);
    }
  }

  /**
   * Click Save All Changes button
   */
  async clickSaveAll(): Promise<void> {
    await this.saveAllButton.click();

    // Wait for save operation to complete
    try {
      await this.loadingSpinner.waitFor({ state: 'visible', timeout: 2000 });
      await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 15000 });
    } catch {
      // Save might be very fast
    }

    await this.page.waitForTimeout(500);
  }

  /**
   * Click Submit for Approval button
   */
  async clickSubmitForApproval(): Promise<void> {
    await this.submitForApprovalButton.click();

    // Wait for status change
    await this.page.waitForTimeout(1000);

    try {
      await this.loadingSpinner.waitFor({ state: 'visible', timeout: 2000 });
      await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 });
    } catch {
      // Might be fast
    }
  }

  /**
   * Click Export SSCJ button
   */
  async clickExportSSCJ(): Promise<void> {
    // Set up download handler
    const downloadPromise = this.page.waitForEvent('download', {
      timeout: 10000,
    });

    await this.exportButton.click();

    // Wait for download to start
    try {
      const download = await downloadPromise;
      console.log('Download started:', download.suggestedFilename());
      return;
    } catch {
      console.log('Download did not trigger within timeout');
    }
  }

  /**
   * Verify button visibility based on state
   */
  async verifyButtonsForDraftWithNoItems(): Promise<void> {
    await expect(this.initializeButton).toBeVisible();
    await expect(this.importButton).toBeVisible();
    await expect(this.saveAllButton).not.toBeVisible();
    await expect(this.exportButton).not.toBeVisible();
  }

  /**
   * Verify button visibility when items exist
   */
  async verifyButtonsForDraftWithItems(): Promise<void> {
    await expect(this.initializeButton).not.toBeVisible();
    await expect(this.importButton).not.toBeVisible();
    await expect(this.saveAllButton).toBeVisible();
    await expect(this.exportButton).toBeVisible();
  }

  /**
   * Go back to list page
   */
  async clickBack(): Promise<void> {
    await this.backButton.click();
    await this.page.waitForURL(/budget-requests$/, {
      timeout: TEST_TIMEOUTS.navigation,
    });
  }
}

/**
 * Budget Request Create/Edit Dialog Page Object
 * For the dialog-based create/edit forms
 */
export class BudgetRequestFormDialog {
  readonly page: Page;
  readonly dialog: Locator;
  readonly fiscalYearInput: Locator;
  readonly justificationInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialog = page.locator('mat-dialog-container');
    this.fiscalYearInput = this.dialog.locator(
      'input[formControlName="fiscal_year"], input[name="fiscal_year"]',
    );
    this.justificationInput = this.dialog.locator(
      'textarea[formControlName="justification"], textarea[name="justification"]',
    );
    this.saveButton = this.dialog.locator(
      'button:has-text("Save"), button:has-text("Create")',
    );
    this.cancelButton = this.dialog.locator('button:has-text("Cancel")');
  }

  /**
   * Fill the budget request form
   */
  async fillForm(data: {
    fiscal_year?: string;
    justification?: string;
  }): Promise<void> {
    if (data.fiscal_year) {
      await this.fiscalYearInput.fill(data.fiscal_year);
    }

    if (data.justification) {
      await this.justificationInput.fill(data.justification);
    }
  }

  /**
   * Click Save/Create button
   */
  async save(): Promise<void> {
    await this.saveButton.click();
    // Wait for dialog to close
    await this.dialog.waitFor({ state: 'hidden', timeout: 10000 });
  }

  /**
   * Click Cancel button
   */
  async cancel(): Promise<void> {
    await this.cancelButton.click();
    await this.dialog.waitFor({ state: 'hidden', timeout: 5000 });
  }
}
