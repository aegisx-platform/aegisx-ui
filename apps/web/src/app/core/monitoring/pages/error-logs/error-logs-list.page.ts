import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BreadcrumbComponent, BreadcrumbItem } from '@aegisx/ui';

import { ErrorLog, ErrorLogsQuery } from '../../models/monitoring.types';
import { ErrorLogsService } from '../../services/error-logs.service';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { CleanupDialogComponent } from '../../components/cleanup-dialog/cleanup-dialog.component';

import {
  ERROR_LOGS_COLUMNS,
  ERROR_LEVEL_BADGE_STYLES,
  ERROR_LOGS_PAGE_CONFIG,
} from './error-logs.config';

/**
 * Error Logs List Page Component
 *
 * Displays a comprehensive list of error logs with:
 * - Statistics cards (total, by level, recent)
 * - Advanced filtering (date range, level, type, user, search)
 * - Server-side pagination and sorting
 * - Export to CSV functionality
 * - Delete and cleanup operations
 */
@Component({
  selector: 'app-error-logs-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatChipsModule,
    MatBadgeModule,
    MatDatepickerModule,
    MatNativeDateModule,
    BreadcrumbComponent,
  ],
  // templateUrl: './error-logs-list.page.html',
  // styleUrls: ['./error-logs-list.page.scss'],
  template: `<div>
    This component is not currently used. Use error-logs.component.ts instead.
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorLogsListPage implements OnInit {
  private errorLogsService = inject(ErrorLogsService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  // Configuration
  readonly ERROR_LOGS_COLUMNS = ERROR_LOGS_COLUMNS;
  readonly ERROR_LEVEL_BADGE_STYLES = ERROR_LEVEL_BADGE_STYLES;
  readonly pageConfig = ERROR_LOGS_PAGE_CONFIG;

  // Table columns for mat-table
  displayedColumns: string[] = [
    'timestamp',
    'level',
    'type',
    'message',
    'userId',
    'actions',
  ];

  // Breadcrumb items
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', url: '/', icon: 'home' },
    {
      label: 'Monitoring',
      url: '/monitoring',
      icon: 'monitor_heart',
    },
    {
      label: 'Error Logs',
      url: '/monitoring/error-logs',
      icon: 'bug_report',
    },
  ];

  // State signals from service
  errorLogs = computed(() => this.errorLogsService.errorLogs());
  stats = computed(() => this.errorLogsService.errorStats());
  loading = computed(() => this.errorLogsService.loading());
  error = computed(() => this.errorLogsService.error());

  // Local state signals
  pageIndex = signal<number>(0);
  pageSize = signal<number>(this.pageConfig.pageSize);
  sortBy = signal<string>('timestamp');
  sortOrder = signal<'asc' | 'desc'>('desc');

  // Filter form
  filterForm = new FormGroup({
    search: new FormControl<string>(''),
    level: new FormControl<string | null>(null),
    type: new FormControl<string | null>(null),
    startDate: new FormControl<Date | null>(null),
    endDate: new FormControl<Date | null>(null),
    userId: new FormControl<string>(''),
  });

  // Computed pagination info
  totalLogs = computed(() => {
    const pagination = this.errorLogsService.pagination();
    return pagination?.total || this.errorLogs().length || 0;
  });

  ngOnInit(): void {
    this.loadErrorLogs();
    this.loadErrorStats();
  }

  /**
   * Load error logs with current filters and pagination
   */
  loadErrorLogs(query?: ErrorLogsQuery): void {
    const finalQuery: ErrorLogsQuery = {
      ...query,
      limit: this.pageSize(),
      offset: this.pageIndex() * this.pageSize(),
      sortBy: this.sortBy() as any,
      sortOrder: this.sortOrder(),
    };

    this.errorLogsService.getErrorLogs(finalQuery).subscribe({
      error: (err) => {
        console.error('Failed to load error logs:', err);
        this.snackBar.open('Failed to load error logs', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  /**
   * Load error statistics
   */
  loadErrorStats(): void {
    this.errorLogsService.getErrorStats().subscribe({
      error: (err) => {
        console.error('Failed to load error stats:', err);
      },
    });
  }

  /**
   * Apply filters and reload data
   */
  applyFilters(): void {
    const formValue = this.filterForm.value;

    const query: ErrorLogsQuery = {
      search: formValue.search || undefined,
      level: formValue.level as any,
      type: formValue.type as any,
      userId: formValue.userId || undefined,
      startDate: formValue.startDate
        ? new Date(formValue.startDate).toISOString()
        : undefined,
      endDate: formValue.endDate
        ? new Date(formValue.endDate).toISOString()
        : undefined,
    };

    // Remove undefined values
    Object.keys(query).forEach((key) => {
      if (
        query[key as keyof ErrorLogsQuery] === undefined ||
        query[key as keyof ErrorLogsQuery] === ''
      ) {
        delete query[key as keyof ErrorLogsQuery];
      }
    });

    this.pageIndex.set(0);
    this.loadErrorLogs(query);
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.filterForm.reset();
    this.pageIndex.set(0);
    this.sortBy.set('timestamp');
    this.sortOrder.set('desc');
    this.loadErrorLogs();
  }

  /**
   * Handle pagination change
   */
  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadErrorLogs();
  }

  /**
   * Handle sort change
   */
  onSortChange(event: Sort): void {
    this.sortBy.set(event.active);
    this.sortOrder.set((event.direction || 'desc') as 'asc' | 'desc');
    this.pageIndex.set(0);
    this.loadErrorLogs();
  }

  /**
   * Handle row click - navigate to detail page
   */
  onRowClick(log: ErrorLog): void {
    this.router.navigate(['/monitoring/error-logs', log.id]);
  }

  /**
   * Delete a single error log with confirmation
   */
  deleteLog(id: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Error Log',
        message:
          'Are you sure you want to delete this error log? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        confirmColor: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;

      this.errorLogsService.deleteErrorLog(id).subscribe({
        next: () => {
          this.snackBar.open('Error log deleted successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
          this.loadErrorLogs();
          this.loadErrorStats();
        },
        error: (err) => {
          this.snackBar.open(`Failed to delete log: ${err.message}`, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        },
      });
    });
  }

  /**
   * Export error logs to CSV
   */
  exportLogs(): void {
    const formValue = this.filterForm.value;
    const query: ErrorLogsQuery = {
      search: formValue.search || undefined,
      level: formValue.level as any,
      type: formValue.type as any,
      userId: formValue.userId || undefined,
      startDate: formValue.startDate
        ? new Date(formValue.startDate).toISOString()
        : undefined,
      endDate: formValue.endDate
        ? new Date(formValue.endDate).toISOString()
        : undefined,
    };

    this.errorLogsService.exportLogs(query).subscribe({
      next: () => {
        this.snackBar.open('Logs exported successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
      },
      error: (err) => {
        this.snackBar.open(`Failed to export logs: ${err.message}`, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  /**
   * Open cleanup dialog to delete old logs
   */
  openCleanupDialog(): void {
    const dialogRef = this.dialog.open(CleanupDialogComponent, {
      width: '500px',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((days: number | undefined) => {
      if (!days) return;

      this.errorLogsService.cleanupLogs({ olderThan: days }).subscribe({
        next: (result) => {
          this.snackBar.open(
            `Deleted ${result.deletedCount} old error logs`,
            'Close',
            {
              duration: 3000,
              panelClass: ['success-snackbar'],
            },
          );
          this.loadErrorLogs();
          this.loadErrorStats();
        },
        error: (err) => {
          this.snackBar.open(
            `Failed to cleanup logs: ${err.message}`,
            'Close',
            {
              duration: 5000,
              panelClass: ['error-snackbar'],
            },
          );
        },
      });
    });
  }

  /**
   * Get badge class for error level
   */
  getLevelBadgeClass(level: string): string {
    const styleConfig =
      ERROR_LEVEL_BADGE_STYLES[level as keyof typeof ERROR_LEVEL_BADGE_STYLES];
    return styleConfig?.class || 'badge-default';
  }

  /**
   * Format timestamp for display
   */
  formatTimestamp(timestamp: string): string {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  }

  /**
   * Truncate message for display
   */
  truncateMessage(message: string, maxLength: number = 100): string {
    if (!message) return '-';
    return message.length > maxLength
      ? message.substring(0, maxLength) + '...'
      : message;
  }
}
