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
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BreadcrumbComponent, BreadcrumbItem } from '@aegisx/ui';

import { ActivityLog, ActivityLogsQuery } from '../../models/monitoring.types';
import { ActivityLogsService } from '../../services/activity-logs.service';
import { ActivityLogDetailDialogComponent } from '../../components/activity-log-detail-dialog/activity-log-detail-dialog.component';

import {
  ACTIVITY_LOGS_PAGE_CONFIG,
  SEVERITY_BADGES,
  ACTION_ICONS,
  TIMELINE_SEVERITY_COLORS,
  TIMELINE_DOT_COLORS,
  formatTimelineTimestamp,
  getActionIcon,
  getTimelineDotColor,
  getTimelineCardColor,
} from './activity-logs.config';

/**
 * Activity Logs List Page Component
 *
 * Displays a timeline-style view of activity logs with:
 * - Statistics cards (total, today, this week, critical)
 * - Advanced filtering (date range, severity, action, user)
 * - Timeline visualization with activity cards
 * - Export to CSV functionality
 * - View details action
 */
@Component({
  selector: 'app-activity-logs-list',
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
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatChipsModule,
    MatBadgeModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    BreadcrumbComponent,
  ],
  templateUrl: './activity-logs-list.page.html',
  styleUrls: ['./activity-logs-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityLogsListPage implements OnInit {
  private activityLogsService = inject(ActivityLogsService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  // Configuration
  readonly pageConfig = ACTIVITY_LOGS_PAGE_CONFIG;
  readonly SEVERITY_BADGES = SEVERITY_BADGES;

  // Breadcrumb items
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', url: '/', icon: 'home' },
    {
      label: 'Monitoring',
      url: '/monitoring',
      icon: 'monitor_heart',
    },
    {
      label: 'Activity Logs',
      url: '/monitoring/activity-logs',
      icon: 'history',
    },
  ];

  // State signals from service
  activityLogs = computed(() => this.activityLogsService.activityLogs());
  stats = computed(() => this.activityLogsService.activityStats());
  loading = computed(() => this.activityLogsService.loading());
  error = computed(() => this.activityLogsService.error());
  pagination = computed(() => this.activityLogsService.pagination());

  // Local state signals
  pageIndex = signal<number>(0);
  pageSize = signal<number>(this.pageConfig.pageSize);
  isFiltersExpanded = signal<boolean>(false);

  // Filter form
  filterForm = new FormGroup({
    search: new FormControl<string>(''),
    action: new FormControl<string | null>(null),
    severity: new FormControl<string | null>(null),
    userId: new FormControl<string>(''),
    startDate: new FormControl<Date | null>(null),
    endDate: new FormControl<Date | null>(null),
  });

  // Computed stats for dashboard cards
  computedStats = computed(() => {
    const stats = this.stats();
    if (!stats) {
      return {
        total: 0,
        today: 0,
        thisWeek: 0,
        critical: 0,
      };
    }

    const today = stats.recent_activities_count?.today || 0;
    const thisWeek = stats.recent_activities_count?.this_week || 0;
    const critical = stats.activities_by_severity?.critical || 0;
    const error = stats.activities_by_severity?.error || 0;

    return {
      total: stats.total_activities || 0,
      today,
      thisWeek,
      critical: critical + error, // Combine critical and error
    };
  });

  // Computed pagination info
  totalLogs = computed(() => {
    const pagination = this.pagination();
    return pagination?.total || 0;
  });

  ngOnInit(): void {
    this.loadLogs();
    this.loadStats();
  }

  /**
   * Load activity logs with current filters and pagination
   */
  loadLogs(query?: ActivityLogsQuery): void {
    const finalQuery: ActivityLogsQuery = {
      ...query,
      limit: this.pageSize(),
      page: this.pageIndex() + 1, // Backend uses 1-indexed pages
    };

    this.activityLogsService.getActivityLogs(finalQuery).subscribe({
      error: (err) => {
        console.error('Failed to load activity logs:', err);
        this.snackBar.open('Failed to load activity logs', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  /**
   * Load activity statistics
   */
  loadStats(): void {
    this.activityLogsService.getActivityStats().subscribe({
      error: (err) => {
        console.error('Failed to load activity stats:', err);
      },
    });
  }

  /**
   * Apply filters and reload data
   */
  onFilterChange(): void {
    const formValue = this.filterForm.value;

    const query: ActivityLogsQuery = {
      search: formValue.search || undefined,
      action: formValue.action || undefined,
      severity: formValue.severity as any,
      user_id: formValue.userId || undefined,
      from_date: formValue.startDate
        ? formValue.startDate.toISOString().split('T')[0]
        : undefined,
      to_date: formValue.endDate
        ? formValue.endDate.toISOString().split('T')[0]
        : undefined,
    };

    // Remove undefined values
    Object.keys(query).forEach((key) => {
      if (
        query[key as keyof ActivityLogsQuery] === undefined ||
        query[key as keyof ActivityLogsQuery] === ''
      ) {
        delete query[key as keyof ActivityLogsQuery];
      }
    });

    this.pageIndex.set(0);
    this.loadLogs(query);
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.filterForm.reset();
    this.pageIndex.set(0);
    this.loadLogs();
  }

  /**
   * Handle pagination change
   */
  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadLogs();
  }

  /**
   * View activity log details in dialog
   */
  viewDetails(log: ActivityLog): void {
    const dialogRef = this.dialog.open(ActivityLogDetailDialogComponent, {
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      data: log,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.snackBar.open('Activity details copied to clipboard', 'Close', {
          duration: 2000,
        });
      }
    });
  }

  /**
   * Export activity logs to CSV
   */
  exportLogs(): void {
    const formValue = this.filterForm.value;
    const query: ActivityLogsQuery = {
      search: formValue.search || undefined,
      action: formValue.action || undefined,
      severity: formValue.severity as any,
      user_id: formValue.userId || undefined,
      from_date: formValue.startDate
        ? formValue.startDate.toISOString().split('T')[0]
        : undefined,
      to_date: formValue.endDate
        ? formValue.endDate.toISOString().split('T')[0]
        : undefined,
    };

    this.activityLogsService.exportLogs(query).subscribe({
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
   * Get icon for action
   */
  getActionIcon(action: string): string {
    return getActionIcon(action);
  }

  /**
   * Get timeline dot color class
   */
  getTimelineDotColor(severity: string): string {
    return getTimelineDotColor(severity);
  }

  /**
   * Get timeline card color class
   */
  getTimelineCardColor(severity: string): string {
    return getTimelineCardColor(severity);
  }

  /**
   * Format timestamp for display
   */
  formatTimelineTimestamp(timestamp: string): {
    date: string;
    time: string;
    relative: string;
  } {
    return formatTimelineTimestamp(timestamp);
  }

  /**
   * Get severity badge configuration
   */
  getSeverityBadge(severity: string) {
    return (
      SEVERITY_BADGES[severity as keyof typeof SEVERITY_BADGES] ||
      SEVERITY_BADGES.info
    );
  }

  /**
   * Check if activity log has all required fields for display
   */
  isValidLog(log: ActivityLog): boolean {
    return !!(log.id && log.created_at && log.action && log.description);
  }

  /**
   * Track by function for ngFor
   */
  trackByLogId(index: number, log: ActivityLog): string {
    return log.id;
  }
}
