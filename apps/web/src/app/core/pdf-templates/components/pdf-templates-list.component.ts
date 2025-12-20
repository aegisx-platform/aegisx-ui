import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Angular Material imports
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

// AegisX UI imports
import { AxKpiCardComponent } from '@aegisx/ui';
import { AxCardComponent } from '@aegisx/ui';
import { AxBadgeComponent } from '@aegisx/ui';
import { AxEmptyStateComponent } from '@aegisx/ui';

// Sub-components
import { TemplateCardComponent } from './template-card/template-card.component';

import { PdfTemplateService } from '../services/pdf-templates.service';
import {
  ListPdfTemplateQuery,
  PdfTemplate,
} from '../types/pdf-templates.types';
import { PdfTemplateCreateDialogComponent } from './pdf-templates-create.dialog';
import {
  PdfTemplateDuplicateDialog,
  PdfTemplateDuplicateDialogData,
} from './pdf-templates-duplicate.dialog';
import {
  PdfTemplateEditDialogComponent,
  PdfTemplateEditDialogData,
} from './pdf-templates-edit.dialog';
import {
  PdfTemplatePreviewDialog,
  PdfTemplatePreviewDialogData,
} from './pdf-templates-preview.dialog';
import {
  PdfTemplateViewDialogComponent,
  PdfTemplateViewDialogData,
} from './pdf-templates-view.dialog';

@Component({
  selector: 'app-pdf-templates-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatToolbarModule,
    MatSelectModule,
    MatOptionModule,
    MatChipsModule,
    MatExpansionModule,
    MatBadgeModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatDividerModule,
    // AegisX UI components
    AxKpiCardComponent,
    AxCardComponent,
    AxBadgeComponent,
    AxEmptyStateComponent,
    // Sub-components
    TemplateCardComponent,
  ],
  templateUrl: './pdf-templates-list.component.html',
  styleUrls: ['./pdf-templates-list.component.scss'],
})
export class PdfTemplateListComponent implements OnInit, OnDestroy {
  protected pdfTemplatesService = inject(PdfTemplateService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  // Search and filtering
  searchTerm = '';
  selectedCategory = ''; // Category filter selection
  private searchTimeout: any;
  private filterTimeout: any;

  private filtersSignal = signal<Partial<ListPdfTemplateQuery>>({});
  readonly filters = this.filtersSignal.asReadonly();

  // Quick filter state
  protected quickFilter = 'all';

  // View mode (grid or table)
  protected viewMode = signal<'grid' | 'table'>('grid');

  // Validation state
  private validationErrorsSignal = signal<Record<string, string>>({});
  readonly validationErrors = this.validationErrorsSignal.asReadonly();

  // Selection
  private selectedIdsSignal = signal<Set<string>>(new Set());
  readonly selectedItems = computed(() =>
    this.pdfTemplatesService
      .pdfTemplatesList()
      .filter((item) => this.selectedIdsSignal().has(item.id)),
  );

  // Table configuration - simplified to show only essential columns
  displayedColumns: string[] = [
    'select',
    'name',
    'display_name',
    'category',
    'actions',
  ];

  ngOnInit() {
    this.loadPdfTemplates();
  }

  ngOnDestroy() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }
  }

  // ===== DATA LOADING =====

  async loadPdfTemplates() {
    const params: ListPdfTemplateQuery = {
      page: this.pdfTemplatesService.currentPage(),
      limit: this.pdfTemplatesService.pageSize(),
      ...this.filters(),
    };

    await this.pdfTemplatesService.loadPdfTemplateList(params);
  }

  async retry() {
    this.pdfTemplatesService.clearError();
    await this.loadPdfTemplates();
  }

  // ===== VALIDATION METHODS =====

  private isValidUuid(value: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }

  private validateTechnicalFields(): { field: string; message: string }[] {
    const errors: { field: string; message: string }[] = [];
    const filters = this.filters();

    return errors;
  }

  private showFieldErrors(errors: { field: string; message: string }[]) {
    const errorMap: Record<string, string> = {};
    errors.forEach((error) => {
      errorMap[error.field] = error.message;
    });
    this.validationErrorsSignal.set(errorMap);

    // Show snackbar for user feedback
    if (errors.length > 0) {
      this.snackBar.open(
        'Please check your search criteria and try again',
        'Close',
        { duration: 3000, panelClass: ['error-snackbar'] },
      );
    }
  }

  private clearValidationErrors() {
    this.validationErrorsSignal.set({});
  }

  // ===== SEARCH AND FILTERING =====

  onSearch(term: string) {
    // Debounce search to prevent multiple API calls
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      // Update filters with search term
      this.filtersSignal.update((filters) => ({
        ...filters,
        search: term || undefined,
      }));

      // Reset to page 1 and reload
      this.pdfTemplatesService.setCurrentPage(1);
      this.loadPdfTemplates();
    }, 300);
  }

  clearSearch() {
    this.searchTerm = '';

    // Remove search from filters
    this.filtersSignal.update((filters) => {
      const { search, ...rest } = filters;
      return rest;
    });

    // Reset to page 1 and reload
    this.pdfTemplatesService.setCurrentPage(1);
    this.loadPdfTemplates();
  }

  // ===== CATEGORY FILTERING =====

  onCategoryFilterChange(category: string) {
    // Clear quick filter when category filter is used
    if (this.quickFilter !== 'all') {
      this.quickFilter = 'all';
    }

    // Update filters with category
    this.filtersSignal.update((filters) => ({
      ...filters,
      category: category || undefined,
    }));

    // Reset to page 1 and reload
    this.pdfTemplatesService.setCurrentPage(1);
    this.loadPdfTemplates();
  }

  // ===== DATE FILTERING =====

  onDateFilterChange(dateFilter: { [key: string]: string | null | undefined }) {
    console.log('Date filter change:', dateFilter); // Debug log

    // Update filters with date filter values
    this.filtersSignal.update((filters) => ({
      ...filters,
      ...dateFilter,
    }));

    console.log('Updated filters:', this.filters()); // Debug log

    // Apply filters with debounce
    this.applyFilters();
  }

  // Handle filter field changes
  onFilterChange(field: string, event: any) {
    const value = event.target ? event.target.value : event;

    // Convert string numbers to numbers for numeric fields
    let processedValue = value;
    if (
      field.includes('_min') ||
      field.includes('_max') ||
      field === 'view_count'
    ) {
      processedValue = value === '' ? undefined : Number(value);
    }

    // Convert string booleans for boolean fields
    if (field === 'published') {
      processedValue = value === '' ? undefined : value;
    }

    // Clear quick filter when advance filters are used
    if (this.quickFilter !== 'all') {
      this.quickFilter = 'all';
    }

    this.filtersSignal.update((filters) => ({
      ...filters,
      [field]: processedValue,
    }));

    this.applyFilters();
  }

  applyFilters() {
    // Debounce filter changes to prevent multiple API calls
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    this.filterTimeout = setTimeout(() => {
      this.pdfTemplatesService.setCurrentPage(1);
      this.loadPdfTemplates();
    }, 300);
  }

  // Immediate filter application (for button clicks)
  applyFiltersImmediate() {
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    this.pdfTemplatesService.setCurrentPage(1);
    this.loadPdfTemplates();
  }

  clearFilters() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    this.searchTerm = '';
    this.filtersSignal.set({});
    this.clearValidationErrors();
    this.pdfTemplatesService.setCurrentPage(1);
    this.loadPdfTemplates();
  }

  hasActiveFilters(): boolean {
    return this.searchTerm.length > 0 || Object.keys(this.filters()).length > 0;
  }

  activeFiltersCount(): number {
    let count = 0;
    if (this.searchTerm.length > 0) count++;
    count += Object.keys(this.filters()).length;
    return count;
  }

  // ===== PAGINATION =====

  onPageChange(event: PageEvent) {
    this.pdfTemplatesService.setCurrentPage(event.pageIndex + 1);
    this.pdfTemplatesService.setPageSize(event.pageSize);
    this.loadPdfTemplates();
  }

  // ===== SELECTION =====

  isSelected(id: string): boolean {
    return this.selectedIdsSignal().has(id);
  }

  hasSelected(): boolean {
    return this.selectedIdsSignal().size > 0;
  }

  isAllSelected(): boolean {
    const total = this.pdfTemplatesService.pdfTemplatesList().length;
    return total > 0 && this.selectedIdsSignal().size === total;
  }

  toggleSelect(id: string) {
    this.selectedIdsSignal.update((selected) => {
      const newSet = new Set(selected);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }

  toggleSelectAll() {
    if (this.isAllSelected()) {
      this.selectedIdsSignal.set(new Set());
    } else {
      const allIds = this.pdfTemplatesService
        .pdfTemplatesList()
        .map((item) => item.id);
      this.selectedIdsSignal.set(new Set(allIds));
    }
  }

  clearSelection() {
    this.selectedIdsSignal.set(new Set());
  }

  // ===== DIALOG OPERATIONS =====

  openCreateDialog() {
    const dialogRef = this.dialog.open(PdfTemplateCreateDialogComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'full-screen-dialog',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Refresh the list to show the new item
        this.loadPdfTemplates();
      }
    });
  }

  openEditDialog(pdfTemplates: PdfTemplate) {
    const dialogRef = this.dialog.open(PdfTemplateEditDialogComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'full-screen-dialog',
      disableClose: true,
      data: { pdfTemplates } as PdfTemplateEditDialogData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Refresh the list to ensure array fields are properly displayed
        this.loadPdfTemplates();
      }
    });
  }

  openViewDialog(pdfTemplates: PdfTemplate) {
    const dialogRef = this.dialog.open(PdfTemplateViewDialogComponent, {
      width: '700px',
      maxWidth: '90vw',
      data: { pdfTemplates } as PdfTemplateViewDialogData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.action === 'edit') {
        // User clicked edit from view dialog
        this.openEditDialog(result.data);
      }
    });
  }

  // ===== QUICK FILTERS =====

  protected setQuickFilter(filter: string) {
    // Clear any pending filter operations
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    this.quickFilter = filter;

    // Clear all filters first
    this.searchTerm = '';
    this.selectedCategory = '';
    this.filtersSignal.set({});
    this.clearValidationErrors();

    switch (filter) {
      case 'active':
        this.filtersSignal.set({ is_active: true });
        break;
      case 'inactive':
        this.filtersSignal.set({ is_active: false });
        break;
      case 'starters':
        this.filtersSignal.set({ is_template_starter: true });
        break;
      case 'all':
      default:
        // Already cleared above
        break;
    }

    // Quick filters should apply immediately
    this.pdfTemplatesService.setCurrentPage(1);
    this.loadPdfTemplates();
  }

  // ===== ACTIVE FILTER CHIPS =====

  protected getActiveFilterChips(): Array<{
    key: string;
    label: string;
    value: string;
  }> {
    const chips: Array<{ key: string; label: string; value: string }> = [];
    const filters = this.filters();

    // Add quick filter chip if not 'all'
    if (this.quickFilter !== 'all') {
      const quickFilterLabels: Record<string, string> = {
        active: 'Active Items',
        // 'featured': 'Featured Items',
        // 'available': 'Available Items',
        // 'draft': 'Draft Status',
      };
      chips.push({
        key: '_quickFilter',
        label: 'Quick Filter',
        value: quickFilterLabels[this.quickFilter] || this.quickFilter,
      });
    }

    if (this.searchTerm) {
      chips.push({ key: 'search', label: 'Search', value: this.searchTerm });
    }

    // Category filter
    if (this.selectedCategory) {
      const categoryLabels: Record<string, string> = {
        invoice: 'Invoice',
        receipt: 'Receipt',
        report: 'Report',
        letter: 'Letter',
        certificate: 'Certificate',
        other: 'Other',
      };
      chips.push({
        key: 'category',
        label: 'Category',
        value: categoryLabels[this.selectedCategory] || this.selectedCategory,
      });
    }

    // Date field filters - only add if fields exist in schema

    if (filters.created_at) {
      chips.push({
        key: 'created_at',
        label: 'Created Date',
        value: this.formatDate(filters.created_at as string),
      });
    } else if (filters.created_at_min || filters.created_at_max) {
      const from = filters.created_at_min
        ? this.formatDate(filters.created_at_min as string)
        : '...';
      const to = filters.created_at_max
        ? this.formatDate(filters.created_at_max as string)
        : '...';
      chips.push({
        key: 'created_at_range',
        label: 'Created Date Range',
        value: `${from} - ${to}`,
      });
    }

    if (filters.updated_at) {
      chips.push({
        key: 'updated_at',
        label: 'Updated Date',
        value: this.formatDate(filters.updated_at as string),
      });
    } else if (filters.updated_at_min || filters.updated_at_max) {
      const from = filters.updated_at_min
        ? this.formatDate(filters.updated_at_min as string)
        : '...';
      const to = filters.updated_at_max
        ? this.formatDate(filters.updated_at_max as string)
        : '...';
      chips.push({
        key: 'updated_at_range',
        label: 'Updated Date Range',
        value: `${from} - ${to}`,
      });
    }

    // String field filters

    // Number field filters

    // Foreign Key filters

    return chips;
  }

  protected removeFilter(key: string) {
    // Clear any pending filter operations
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    if (key === '_quickFilter') {
      // Reset quick filter to 'all'
      this.setQuickFilter('all');
      return;
    }

    if (key === 'search') {
      this.searchTerm = '';
    } else if (key === 'category') {
      this.selectedCategory = '';
      this.filtersSignal.update((filters) => {
        const updated = { ...filters } as any;
        delete updated.category;
        return updated;
      });
    } else if (key.includes('_range')) {
      // Handle date range removal
      const fieldName = key.replace('_range', '');
      this.filtersSignal.update((filters) => {
        const updated = { ...filters } as any;
        delete updated[fieldName];
        delete updated[`${fieldName}_min`];
        delete updated[`${fieldName}_max`];
        return updated;
      });
    } else {
      this.filtersSignal.update((filters) => {
        const updated = { ...filters } as any;
        delete updated[key];
        return updated;
      });
    }
    this.clearValidationErrors();
    this.pdfTemplatesService.setCurrentPage(1);
    this.loadPdfTemplates();
  }

  protected clearAllFilters() {
    // Clear any pending filter operations
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    this.searchTerm = '';
    this.selectedCategory = '';
    this.filtersSignal.set({});
    this.quickFilter = 'all';
    this.clearValidationErrors();
    this.pdfTemplatesService.setCurrentPage(1);
    this.loadPdfTemplates();
  }

  protected resetFilters() {
    // Clear any pending filter operations
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    this.filtersSignal.set({});
    this.clearValidationErrors();

    // Reset filters should apply immediately
    this.pdfTemplatesService.setCurrentPage(1);
    this.loadPdfTemplates();
  }

  // ===== DATE FILTER HANDLERS =====

  protected updateDateFilter(filterUpdate: any) {
    this.filtersSignal.update((current) => ({ ...current, ...filterUpdate }));
    this.applyFilters();
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  // ===== ACTIONS =====

  async deletePdfTemplate(pdfTemplates: PdfTemplate) {
    if (confirm(`Are you sure you want to delete this pdfTemplates?`)) {
      try {
        await this.pdfTemplatesService.deletePdfTemplate(pdfTemplates.id);
        this.snackBar.open('Pdf Templates deleted successfully', 'Close', {
          duration: 3000,
        });
      } catch (error: any) {
        const errorMessage = this.pdfTemplatesService.permissionError()
          ? 'You do not have permission to delete Pdf Templates'
          : error?.message || 'Failed to delete Pdf Templates';
        this.snackBar.open(errorMessage, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      }
    }
  }

  async bulkDelete() {
    const selectedIds = Array.from(this.selectedIdsSignal());
    if (selectedIds.length === 0) return;

    const confirmed = confirm(
      `Are you sure you want to delete ${selectedIds.length} Pdf Templates?`,
    );
    if (!confirmed) return;

    try {
      await this.pdfTemplatesService.bulkDeletePdfTemplate(selectedIds);
      this.clearSelection();
      this.snackBar.open(
        `${selectedIds.length} Pdf Templates deleted successfully`,
        'Close',
        {
          duration: 3000,
        },
      );
    } catch (error: any) {
      const errorMessage = this.pdfTemplatesService.permissionError()
        ? 'You do not have permission to delete Pdf Templates'
        : error?.message || 'Failed to delete Pdf Templates';
      this.snackBar.open(errorMessage, 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar'],
      });
    }
  }

  async bulkUpdateStatus(status: string) {
    const selectedIds = Array.from(this.selectedIdsSignal());
    if (selectedIds.length === 0) return;

    try {
      // Create bulk update data with status field
      const items = selectedIds.map((id) => ({
        id,
        data: { status } as any,
      }));

      await this.pdfTemplatesService.bulkUpdatePdfTemplate(items);
      this.clearSelection();
      this.snackBar.open(
        `${selectedIds.length} Pdf Templates status updated successfully`,
        'Close',
        {
          duration: 3000,
        },
      );
    } catch (error: any) {
      const errorMessage = this.pdfTemplatesService.permissionError()
        ? 'You do not have permission to update Pdf Templates'
        : error?.message || 'Failed to update Pdf Templates status';
      this.snackBar.open(errorMessage, 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar'],
      });
    }
  }

  // ===== SUMMARY DASHBOARD METHODS =====

  /**
   * Get count of active templates
   */
  getActiveCount(): number {
    return this.pdfTemplatesService.pdfTemplatesList().filter((item) => {
      return item.is_active === true;
    }).length;
  }

  /**
   * Get count of template starters
   */
  getTemplateStartersCount(): number {
    return this.pdfTemplatesService.pdfTemplatesList().filter((item) => {
      return item.is_template_starter === true;
    }).length;
  }

  /**
   * Get total usage count across all templates
   */
  getTotalUsageCount(): number {
    return this.pdfTemplatesService.pdfTemplatesList().reduce((total, item) => {
      return total + (item.usage_count || 0);
    }, 0);
  }

  /**
   * Get breakdown of templates by category
   */
  getCategoryBreakdown(): Array<{
    category: string;
    label: string;
    count: number;
  }> {
    const categories = [
      'invoice',
      'receipt',
      'report',
      'letter',
      'certificate',
      'other',
    ];
    const labels: Record<string, string> = {
      invoice: 'Invoice',
      receipt: 'Receipt',
      report: 'Report',
      letter: 'Letter',
      certificate: 'Certificate',
      other: 'Other',
    };

    const breakdown = categories
      .map((category) => ({
        category,
        label: labels[category],
        count: this.pdfTemplatesService
          .pdfTemplatesList()
          .filter((item) => item.category === category).length,
      }))
      .filter((item) => item.count > 0); // Only show categories with templates

    return breakdown;
  }

  /**
   * Get the most used template
   */
  getMostUsedTemplate(): any {
    const templates = this.pdfTemplatesService.pdfTemplatesList();
    if (templates.length === 0) return null;

    return templates.reduce((max, item) => {
      const itemUsage = item.usage_count || 0;
      const maxUsage = max.usage_count || 0;
      return itemUsage > maxUsage ? item : max;
    }, templates[0]);
  }

  // ===== ADVANCED FEATURE METHODS =====

  /**
   * Open preview dialog to show PDF preview
   */
  openPreviewDialog(template: PdfTemplate) {
    const dialogRef = this.dialog.open(PdfTemplatePreviewDialog, {
      width: '90vw',
      height: '90vh',
      maxWidth: '1400px',
      maxHeight: '900px',
      data: { template } as PdfTemplatePreviewDialogData,
      disableClose: false,
    });
  }

  /**
   * Open duplicate dialog and handle duplication
   */
  openDuplicateDialog(template: PdfTemplate) {
    const dialogRef = this.dialog.open(PdfTemplateDuplicateDialog, {
      width: '600px',
      data: { template } as PdfTemplateDuplicateDialogData,
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result && result.name) {
        try {
          const duplicated = await this.pdfTemplatesService.duplicateTemplate(
            template.id,
            result.name,
          );

          if (duplicated) {
            this.snackBar.open(
              `Template "${template.display_name}" duplicated successfully as "${result.name}"`,
              'Close',
              {
                duration: 5000,
                panelClass: ['success-snackbar'],
              },
            );
            // Refresh list to show new template
            await this.loadPdfTemplates();
          }
        } catch (error: any) {
          console.error('Duplication failed:', error);
          this.snackBar.open(
            `Failed to duplicate template: ${error.message || 'Unknown error'}`,
            'Close',
            {
              duration: 5000,
              panelClass: ['error-snackbar'],
            },
          );
        }
      }
    });
  }
}
