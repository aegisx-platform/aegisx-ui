import {
  Component,
  ChangeDetectionStrategy,
  input,
  inject,
  signal,
  computed,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserService } from '../../services/user.service';

/**
 * Activity entry from user activity endpoint
 */
export interface UserActivity {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Profile Activity Component
 *
 * Displays user activity in a timeline format with pagination.
 * Shows recent user activities with action badges, timestamps, and details.
 */
@Component({
  selector: 'app-profile-activity',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './profile-activity.component.html',
  styleUrls: ['./profile-activity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileActivityComponent implements OnInit, OnDestroy {
  private userService = inject(UserService);
  private destroy$ = new Subject<void>();

  // Inputs
  userId = input.required<string>();

  // State signals
  activities = signal<UserActivity[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  // Pagination state
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  totalItems = signal<number>(0);

  // Computed signals
  hasActivities = computed(() => this.activities().length > 0);
  isEmpty = computed(() => !this.loading() && this.activities().length === 0);

  ngOnInit(): void {
    this.loadActivities();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load user activities with current pagination
   */
  loadActivities(): void {
    this.loading.set(true);
    this.error.set(null);

    this.userService
      .getUserActivity({
        page: this.currentPage(),
        limit: this.pageSize(),
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.activities.set(response.data);
            if (response.pagination) {
              this.totalItems.set(response.pagination.total);
            }
          }
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Failed to load activities:', err);
          this.error.set('Failed to load activity history');
          this.loading.set(false);
        },
      });
  }

  /**
   * Handle pagination change
   */
  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
    this.loadActivities();
  }

  /**
   * View activity details
   */
  viewActivityDetails(activity: UserActivity): void {
    // This method can be extended to open a dialog with full activity details
    console.log('View activity details:', activity);
  }

  /**
   * Get icon for activity action
   */
  getActionIcon(action: string): string {
    const iconMap: Record<string, string> = {
      login: 'login',
      logout: 'logout',
      create: 'add_circle',
      update: 'edit',
      delete: 'delete',
      download: 'download',
      upload: 'upload',
      export: 'file_download',
      import: 'file_upload',
      view: 'visibility',
      edit: 'edit',
      change_password: 'security',
      profile_update: 'person',
      role_assignment: 'badge',
      permission_change: 'lock',
      status_change: 'public',
      bulk_action: 'settings_suggest',
    };

    return iconMap[action.toLowerCase()] || 'history';
  }

  /**
   * Get severity badge color class
   */
  getSeverityClass(severity: string): string {
    const classes: Record<string, string> = {
      critical: 'severity-critical',
      error: 'severity-error',
      warning: 'severity-warning',
      info: 'severity-info',
    };

    return classes[severity] || classes['info'];
  }

  /**
   * Get timeline dot color class
   */
  getTimelineDotColor(severity: string): string {
    return `timeline-dot-info`;
  }

  /**
   * Get timeline card color class
   */
  getTimelineCardColor(severity: string): string {
    return `timeline-card-info`;
  }

  /**
   * Format timestamp for display
   */
  formatTimestamp(timestamp: string): {
    date: string;
    time: string;
    relative: string;
  } {
    const date = new Date(timestamp);
    const now = new Date();

    // Format date
    const dateStr = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    // Format time
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    // Calculate relative time
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    let relativeStr = 'Just now';
    if (diffMins > 0) {
      relativeStr = `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    }
    if (diffHours > 0) {
      relativeStr = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    }
    if (diffDays > 0) {
      relativeStr = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }

    return {
      date: dateStr,
      time: timeStr,
      relative: relativeStr,
    };
  }

  /**
   * Track by function for ngFor
   */
  trackByActivityId(index: number, activity: UserActivity): string {
    return activity.id;
  }
}
