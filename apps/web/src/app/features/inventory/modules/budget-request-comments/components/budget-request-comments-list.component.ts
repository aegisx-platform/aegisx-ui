import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { fromEventPattern } from 'rxjs';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

// Material imports for table
import { SelectionModel } from '@angular/cdk/collections';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MatSort,
  MatSortModule,
  Sort,
  SortDirection,
} from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';

import {
  AxCardComponent,
  AxEmptyStateComponent,
  AxErrorStateComponent,
  AxDialogService,
  BreadcrumbComponent,
  BreadcrumbItem,
} from '@aegisx/ui';
// Export functionality is available through AxTableComponent or custom implementation
// TODO: Add export button with custom export service if needed
import { BudgetRequestCommentService } from '../services/budget-request-comments.service';
import {
  BudgetRequestComment,
  ListBudgetRequestCommentQuery,
} from '../types/budget-request-comments.types';
import { BudgetRequestCommentCreateDialogComponent } from './budget-request-comments-create.dialog';
import {
  BudgetRequestCommentEditDialogComponent,
  BudgetRequestCommentEditDialogData,
} from './budget-request-comments-edit.dialog';
import {
  BudgetRequestCommentViewDialogComponent,
  BudgetRequestCommentViewDialogData,
} from './budget-request-comments-view.dialog';

// Import child components
import { BudgetRequestCommentsListFiltersComponent } from './budget-request-comments-list-filters.component';
import { BudgetRequestCommentsListHeaderComponent } from './budget-request-comments-list-header.component';

@Component({
  selector: 'app-budget-request-comments-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatMenuModule,
    MatCardModule,
    BreadcrumbComponent,
    // Child components
    BudgetRequestCommentsListHeaderComponent,
    BudgetRequestCommentsListFiltersComponent,
    // AegisX UI components
    AxCardComponent,
    AxEmptyStateComponent,
    AxErrorStateComponent,
  ],
  templateUrl: './budget-request-comments-list.component.html',
  styleUrl: './budget-request-comments-list.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ),
    ]),
  ],
})
export class BudgetRequestCommentsListComponent {
  budgetRequestCommentsService = inject(BudgetRequestCommentService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private axDialog = inject(AxDialogService);
  private cdr = inject(ChangeDetectorRef);

  // Breadcrumb configuration
  breadcrumbItems: BreadcrumbItem[] = [
    {
      label: 'Home',
      url: '/',
    },
    {
      label: 'Inventory',
      url: '/inventory',
    },
    {
      label: 'Budget',
      url: '/inventory/budget',
    },
    {
      label: 'Budget Request Comments',
    },
  ];

  // Mat-Table setup
  displayedColumns: string[] = [
    'select',
    'budget_request_id',
    'parent_id',
    'comment',
    'created_by',
    'actions',
  ];
  dataSource = new MatTableDataSource<BudgetRequestComment>([]);
  selection = new SelectionModel<BudgetRequestComment>(true, []);

  // Selection for export feature (like authors)
  private selectedIdsSignal = signal<Set<number>>(new Set());
  readonly selectedItems = computed(() =>
    this.budgetRequestCommentsService
      .budgetRequestCommentsList()
      .filter((item) => this.selectedIdsSignal().has(item.id)),
  );

  // --- Signals for sort, page, search ---
  sortState = signal<{ active: string; direction: SortDirection }>({
    active: '',
    direction: '',
  });
  pageState = signal<{ index: number; size: number }>({ index: 0, size: 25 });

  // Search & Filter Signals
  protected searchTermSignal = signal(''); // Active search term (sent to API)
  protected searchInputSignal = signal(''); // Input field value (not auto-searched)

  // Advanced filter INPUT signals (not sent to API until Apply is clicked)
  protected commentInputSignal = signal('');
  protected created_byInputSignal = signal('');

  // Advanced filter ACTIVE signals (sent to API)
  protected commentFilterSignal = signal('');
  protected created_byFilterSignal = signal('');

  // Date filter INPUT signals (not sent to API until Apply is clicked)

  // Date filter ACTIVE signals (sent to API)

  // Reload trigger - increment to force data reload even when filters unchanged
  private reloadTrigger = signal(0);

  // Holds current MatSort subscription
  private matSortSubscription?: import('rxjs').Subscription;

  /**
   * Angular Material sort event subscription
   * Ensures only one subscription at a time
   */
  @ViewChild(MatSort)
  set matSort(sort: MatSort | undefined) {
    this.unsubscribeMatSort();
    if (sort) {
      this.matSortSubscription = this.subscribeMatSort(sort);
    }
  }

  private subscribeMatSort(sort: MatSort): import('rxjs').Subscription {
    return fromEventPattern<Sort>((h) => sort.sortChange.subscribe(h))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((s) => {
        if (this.paginator) this.paginator.pageIndex = 0;
        this.sortState.set({ active: s.active, direction: s.direction });
      });
  }

  /**
   * Unsubscribe previous MatSort subscription if exists
   */
  private unsubscribeMatSort() {
    if (this.matSortSubscription) {
      this.matSortSubscription.unsubscribe();
      this.matSortSubscription = undefined;
    }
  }

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  private destroyRef = inject(DestroyRef);

  // Search & Filter UI State
  quickFilter: 'all' | 'active' | 'unavailable' = 'all';
  showAdvancedFilters = signal(false);

  // Show loading indicator only if loading takes longer than 300ms
  showLoadingIndicator = signal(false);
  private loadingTimeout: any;

  // Expandable rows state
  protected expandedBudgetRequestComment = signal<BudgetRequestComment | null>(
    null,
  );

  // Computed signals
  advancedFilters = computed(() => ({
    comment: this.commentInputSignal(),
    created_by: this.created_byInputSignal(),
  }));

  // Two-way binding helpers
  get searchTerm() {
    return this.searchInputSignal();
  }
  set searchTerm(value: string) {
    this.searchInputSignal.set(value);
  }

  get commentFilter() {
    return this.commentInputSignal();
  }
  set commentFilter(value: string) {
    this.commentInputSignal.set(value);
  }
  get created_byFilter() {
    return this.created_byInputSignal();
  }
  set created_byFilter(value: string) {
    this.created_byInputSignal.set(value);
  }

  // Stats computed from data
  // Note: For accurate stats, consider implementing a dedicated stats endpoint
  stats = computed(() => {
    const list = this.budgetRequestCommentsService.budgetRequestCommentsList();
    const total = this.budgetRequestCommentsService.totalBudgetRequestComment();

    // Calculate available/unavailable from first boolean field (typically is_active)
    // This is a client-side approximation - for accurate counts, use a stats API
    const available = list.filter(
      (item: any) => item.is_active === true,
    ).length;
    const unavailable = list.filter(
      (item: any) => item.is_active === false,
    ).length;

    // Calculate items created this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentWeek = list.filter((item: any) => {
      const createdAt = item.created_at ? new Date(item.created_at) : null;
      return createdAt && createdAt >= oneWeekAgo;
    }).length;

    return {
      total,
      available,
      unavailable,
      recentWeek,
    };
  });

  ngAfterViewInit() {
    this.cdr.detectChanges();
    // Subscribe paginator changes to update pageState
    if (this.paginator) {
      fromEventPattern<{ pageIndex: number; pageSize: number }>((h) =>
        this.paginator.page.subscribe(h),
      )
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((event) => {
          this.pageState.set({ index: event.pageIndex, size: event.pageSize });
        });
    }
  }

  // --- Effect: reload budget_request_comments on sort/page/search/filter change ---
  constructor() {
    // Sync export selection state
    effect(() => {
      const ids = new Set(this.selection.selected.map((b) => b.id));
      this.selectedIdsSignal.set(ids);
    });

    // Track loading state and delay loading indicator
    effect(() => {
      const loading = this.budgetRequestCommentsService.loading();

      // Clear any existing timeout
      if (this.loadingTimeout) {
        clearTimeout(this.loadingTimeout);
        this.loadingTimeout = null;
      }

      if (loading) {
        // Show loading indicator only after 300ms delay
        this.loadingTimeout = setTimeout(() => {
          this.showLoadingIndicator.set(true);
        }, 300);
      } else {
        // Hide immediately when loading completes
        this.showLoadingIndicator.set(false);
      }
    });

    // Reload data when signals change (no auto-search on typing)
    effect(async () => {
      // Track reload trigger to force refresh even when filters unchanged
      this.reloadTrigger();

      const sort = this.sortState();
      const page = this.pageState();
      const search = this.searchTermSignal();

      const comment = this.commentFilterSignal();
      const created_by = this.created_byFilterSignal();

      const params: Partial<ListBudgetRequestCommentQuery> = {
        page: (page?.index ?? 0) + 1,
        limit: page?.size ?? 25,
        sort:
          sort.active && sort.direction
            ? `${sort.active}:${sort.direction}`
            : undefined,
        search: search?.trim() || undefined,
        comment: comment?.trim() || undefined,
        created_by: created_by?.trim() || undefined,
      } as any;

      Object.keys(params).forEach(
        (k) =>
          params[k as keyof typeof params] === undefined &&
          delete params[k as keyof typeof params],
      );

      // Always use traditional API for list/search operations
      // WebSocket events are for real-time sync of CUD operations only
      await this.budgetRequestCommentsService.loadBudgetRequestCommentList(
        params,
      );
      this.dataSource.data =
        this.budgetRequestCommentsService.budgetRequestCommentsList();
      if (this.paginator) {
        this.paginator.length =
          this.budgetRequestCommentsService.totalBudgetRequestComment();
      }
    });
  }

  // Search & Filter Methods
  search() {
    const searchValue = this.searchInputSignal().trim();
    this.searchTermSignal.set(searchValue);
    if (this.paginator) this.paginator.pageIndex = 0;
  }

  refresh() {
    this.searchInputSignal.set('');
    this.searchTermSignal.set('');
    this.commentInputSignal.set('');
    this.commentFilterSignal.set('');
    this.created_byInputSignal.set('');
    this.created_byFilterSignal.set('');
    this.quickFilter = 'all';
    if (this.paginator) this.paginator.pageIndex = 0;
    this.reloadTrigger.update((n) => n + 1);
  }

  applyFilterImmediate() {
    // Apply text and selection filters
    this.commentFilterSignal.set(this.commentInputSignal().trim());
    this.created_byFilterSignal.set(this.created_byInputSignal().trim());

    // Apply date/datetime filters

    if (this.paginator) this.paginator.pageIndex = 0;
  }

  clearSearch() {
    this.searchInputSignal.set('');
    this.searchTermSignal.set('');
    if (this.paginator) this.paginator.pageIndex = 0;
  }

  setQuickFilter(filter: 'all' | 'active' | 'unavailable') {
    this.quickFilter = filter;
    if (this.paginator) this.paginator.pageIndex = 0;
  }

  onDateFilterChange(dateFilter: { [key: string]: string | null | undefined }) {
    // Update INPUT signals only (not sent to API until Apply Filters is clicked)
  }

  clearAllFilters() {
    this.searchInputSignal.set('');
    this.searchTermSignal.set('');
    this.commentInputSignal.set('');
    this.commentFilterSignal.set('');
    this.created_byInputSignal.set('');
    this.created_byFilterSignal.set('');
    this.quickFilter = 'all';
    this.showAdvancedFilters.set(false);
    if (this.paginator) this.paginator.pageIndex = 0;
  }

  // Helper methods
  hasActiveFilters(): boolean {
    return (
      this.searchTermSignal().trim() !== '' ||
      this.commentFilterSignal().trim() !== '' ||
      this.created_byFilterSignal().trim() !== ''
    );
  }

  getActiveFilterCount(): number {
    let count = 0;
    if (this.searchTermSignal().trim()) count++;
    if (this.commentFilterSignal().trim()) count++;
    if (this.created_byFilterSignal().trim()) count++;
    return count;
  }

  // Selection Methods
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  // CRUD Operations
  openCreateDialog() {
    const dialogRef = this.dialog.open(
      BudgetRequestCommentCreateDialogComponent,
      {
        width: '600px',
      },
    );

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.reloadTrigger.update((n) => n + 1);
      }
    });
  }

  onViewBudgetRequestComment(budgetRequestComment: BudgetRequestComment) {
    const dialogRef = this.dialog.open(
      BudgetRequestCommentViewDialogComponent,
      {
        width: '600px',
        data: {
          budgetRequestComments: budgetRequestComment,
        } as BudgetRequestCommentViewDialogData,
      },
    );

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.action === 'edit') {
        this.onEditBudgetRequestComment(result.data);
      }
    });
  }

  onEditBudgetRequestComment(budgetRequestComment: BudgetRequestComment) {
    const dialogRef = this.dialog.open(
      BudgetRequestCommentEditDialogComponent,
      {
        width: '600px',
        data: {
          budgetRequestComments: budgetRequestComment,
        } as BudgetRequestCommentEditDialogData,
      },
    );

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.reloadTrigger.update((n) => n + 1);
      }
    });
  }

  onDeleteBudgetRequestComment(budgetRequestComment: BudgetRequestComment) {
    const itemName =
      (budgetRequestComment as any).name ||
      (budgetRequestComment as any).title ||
      'budgetrequestcomment';
    this.axDialog.confirmDelete(itemName).subscribe(async (confirmed) => {
      if (confirmed) {
        try {
          await this.budgetRequestCommentsService.deleteBudgetRequestComment(
            budgetRequestComment.id,
          );
          this.snackBar.open(
            'BudgetRequestComment deleted successfully',
            'Close',
            {
              duration: 3000,
            },
          );
          this.reloadTrigger.update((n) => n + 1);
        } catch {
          this.snackBar.open('Failed to delete budgetrequestcomment', 'Close', {
            duration: 3000,
          });
        }
      }
    });
  }

  bulkDelete() {
    const count = this.selection.selected.length;
    this.axDialog
      .confirmBulkDelete(count, 'budget_request_comments')
      .subscribe(async (confirmed) => {
        if (confirmed) {
          try {
            const deletePromises = this.selection.selected.map(
              (budgetRequestComment) =>
                this.budgetRequestCommentsService.deleteBudgetRequestComment(
                  budgetRequestComment.id,
                ),
            );

            await Promise.all(deletePromises);
            this.snackBar.open(
              `${count} budgetrequestcomment(s) deleted successfully`,
              'Close',
              { duration: 3000 },
            );
            this.selection.clear();
            this.reloadTrigger.update((n) => n + 1);
          } catch {
            this.snackBar.open(
              'Failed to delete some budget_request_comments',
              'Close',
              {
                duration: 3000,
              },
            );
          }
        }
      });
  }

  // Filter Helpers
  getExportFilters(): Record<string, unknown> {
    return {
      searchTerm: this.searchTermSignal(),
      comment: this.commentFilterSignal(),
      created_by: this.created_byFilterSignal(),
    };
  }

  // Stats Methods
  getPercentage(count: number): number {
    const total = this.stats().total;
    return total > 0 ? Math.round((count / total) * 100) : 0;
  }

  // Expandable Row Methods
  toggleExpandRow(budgetRequestComment: BudgetRequestComment): void {
    const currentExpanded = this.expandedBudgetRequestComment();
    if (currentExpanded?.id === budgetRequestComment.id) {
      // Collapse currently expanded row
      this.expandedBudgetRequestComment.set(null);
    } else {
      // Expand new row (and collapse previous if any)
      this.expandedBudgetRequestComment.set(budgetRequestComment);
    }
  }

  isRowExpanded(budgetRequestComment: BudgetRequestComment): boolean {
    return this.expandedBudgetRequestComment()?.id === budgetRequestComment.id;
  }
}
