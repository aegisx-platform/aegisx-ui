import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BreadcrumbComponent, BreadcrumbItem } from '@aegisx/ui';
import { ActivityLog } from '../../models/monitoring.types';
import { ActivityLogsService } from '../../services/activity-logs.service';

/**
 * Activity Logs Detail Page Component
 *
 * Displays complete details of a specific activity log including:
 * - Activity information (action, description, severity, user)
 * - User context (IP address, user agent, session ID)
 * - Device information (browser, OS, device type)
 * - Location information (country, city, timezone)
 * - Metadata and timestamps
 * - Copy functionality for metadata and full details
 */
@Component({
  selector: 'app-activity-logs-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatTooltipModule,
    BreadcrumbComponent,
  ],
  template: `
    <!-- Loading State -->
    <div *ngIf="loading()" class="loading-container">
      <mat-spinner diameter="48"></mat-spinner>
      <p class="text-muted mt-4">Loading activity details...</p>
    </div>

    <!-- Detail Page Content -->
    <div *ngIf="!loading() && activityLog()" class="activity-detail-page">
      <!-- Breadcrumb -->
      <ax-breadcrumb [items]="breadcrumbItems"></ax-breadcrumb>

      <!-- Header Section -->
      <div class="page-header">
        <button
          mat-icon-button
          (click)="goBack()"
          matTooltip="Back to Activity Logs"
          class="text-on-surface"
        >
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div class="flex-1 flex flex-col gap-1">
          <h1 class="text-3xl font-extrabold tracking-tight text-on-surface">
            Activity Details
          </h1>
          <p class="text-muted text-sm">
            {{ activityLog()!.created_at | date: 'medium' }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <span
            [ngClass]="{
              'severity-badge critical-badge':
                activityLog()!.severity === 'critical',
              'severity-badge error-badge': activityLog()!.severity === 'error',
              'severity-badge warning-badge':
                activityLog()!.severity === 'warning',
              'severity-badge info-badge': activityLog()!.severity === 'info',
            }"
            class="px-3 py-1 rounded-full text-xs font-semibold"
          >
            {{ activityLog()!.severity | uppercase }}
          </span>
          <button
            mat-icon-button
            color="warn"
            (click)="deleteActivity()"
            matTooltip="Delete this activity log"
          >
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      </div>

      <!-- Activity Information Card -->
      <mat-card appearance="outlined" class="card-section">
        <mat-card-header>
          <mat-card-title class="flex items-center gap-2 mb-4">
            <mat-icon class="text-primary">info</mat-icon>
            <span>Activity Information</span>
          </mat-card-title>
        </mat-card-header>
        <mat-card-content class="pt-0">
          <div class="description-list">
            <!-- Action -->
            <div class="description-item">
              <span class="description-label">Action</span>
              <span class="font-medium text-primary">
                {{ activityLog()!.action }}
              </span>
            </div>

            <!-- Severity -->
            <div class="description-item">
              <span class="description-label">Severity</span>
              <span
                [ngClass]="{
                  'text-critical': activityLog()!.severity === 'critical',
                  'text-error': activityLog()!.severity === 'error',
                  'text-warning': activityLog()!.severity === 'warning',
                  'text-success': activityLog()!.severity === 'info',
                }"
                class="font-medium"
              >
                {{ activityLog()!.severity | uppercase }}
              </span>
            </div>

            <!-- User ID -->
            <div class="description-item">
              <span class="description-label">User ID</span>
              <code class="description-code">{{ activityLog()!.user_id }}</code>
            </div>

            <!-- Request ID -->
            <div *ngIf="activityLog()!.request_id" class="description-item">
              <span class="description-label">Request ID</span>
              <code class="description-code">{{
                activityLog()!.request_id
              }}</code>
            </div>

            <!-- Description -->
            <div class="description-item full-width">
              <span class="description-label">Description</span>
              <p class="activity-description">
                {{ activityLog()!.description }}
              </p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- User Context Card -->
      <mat-card appearance="outlined" class="card-section">
        <mat-card-header>
          <mat-card-title class="flex items-center gap-2 mb-4">
            <mat-icon class="text-primary">person</mat-icon>
            <span>User Context</span>
          </mat-card-title>
        </mat-card-header>
        <mat-card-content class="pt-0">
          <div class="description-list">
            <!-- IP Address -->
            <div *ngIf="activityLog()!.ip_address" class="description-item">
              <span class="description-label">IP Address</span>
              <code class="description-code">{{
                activityLog()!.ip_address
              }}</code>
            </div>

            <!-- Session ID -->
            <div *ngIf="activityLog()!.session_id" class="description-item">
              <span class="description-label">Session ID</span>
              <code class="description-code">{{
                activityLog()!.session_id
              }}</code>
            </div>

            <!-- User Agent -->
            <div
              *ngIf="activityLog()!.user_agent"
              class="description-item full-width"
            >
              <span class="description-label">User Agent</span>
              <code class="description-code text-xs">
                {{ activityLog()!.user_agent }}
              </code>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Device Information Section -->
      <mat-expansion-panel
        *ngIf="activityLog()!.device_info"
        class="card-section"
        appearance="outline"
      >
        <mat-expansion-panel-header>
          <mat-panel-title class="flex items-center gap-2">
            <mat-icon class="text-primary">devices</mat-icon>
            <span>Device Information</span>
          </mat-panel-title>
        </mat-expansion-panel-header>

        <div class="description-list px-6 py-4">
          <!-- Browser -->
          <div
            *ngIf="activityLog()!.device_info?.browser"
            class="description-item"
          >
            <span class="description-label">Browser</span>
            <span class="description-value">
              {{ activityLog()!.device_info?.browser }}
            </span>
          </div>

          <!-- Operating System -->
          <div *ngIf="activityLog()!.device_info?.os" class="description-item">
            <span class="description-label">Operating System</span>
            <span class="description-value">
              {{ activityLog()!.device_info?.os }}
            </span>
          </div>

          <!-- Device Type -->
          <div
            *ngIf="activityLog()!.device_info?.device"
            class="description-item"
          >
            <span class="description-label">Device</span>
            <span class="description-value">
              {{ activityLog()!.device_info?.device }}
            </span>
          </div>

          <!-- Device Categories -->
          <div class="description-item full-width">
            <span class="description-label">Device Categories</span>
            <div class="flex flex-wrap gap-2">
              <span
                *ngIf="activityLog()!.device_info?.isDesktop"
                class="chip-badge"
              >
                <mat-icon class="text-xs">desktop_mac</mat-icon>
                Desktop
              </span>
              <span
                *ngIf="activityLog()!.device_info?.isTablet"
                class="chip-badge"
              >
                <mat-icon class="text-xs">tablet_mac</mat-icon>
                Tablet
              </span>
              <span
                *ngIf="activityLog()!.device_info?.isMobile"
                class="chip-badge"
              >
                <mat-icon class="text-xs">smartphone</mat-icon>
                Mobile
              </span>
            </div>
          </div>
        </div>
      </mat-expansion-panel>

      <!-- Location Information Section -->
      <mat-expansion-panel
        *ngIf="activityLog()!.location_info"
        class="card-section"
        appearance="outline"
      >
        <mat-expansion-panel-header>
          <mat-panel-title class="flex items-center gap-2">
            <mat-icon class="text-primary">location_on</mat-icon>
            <span>Location Information</span>
          </mat-panel-title>
        </mat-expansion-panel-header>

        <div class="description-list px-6 py-4">
          <!-- Country -->
          <div
            *ngIf="activityLog()!.location_info?.country"
            class="description-item"
          >
            <span class="description-label">Country</span>
            <span class="description-value">
              {{ activityLog()!.location_info?.country }}
            </span>
          </div>

          <!-- City -->
          <div
            *ngIf="activityLog()!.location_info?.city"
            class="description-item"
          >
            <span class="description-label">City</span>
            <span class="description-value">
              {{ activityLog()!.location_info?.city }}
            </span>
          </div>

          <!-- Timezone -->
          <div
            *ngIf="activityLog()!.location_info?.timezone"
            class="description-item"
          >
            <span class="description-label">Timezone</span>
            <span class="description-value">
              {{ activityLog()!.location_info?.timezone }}
            </span>
          </div>
        </div>
      </mat-expansion-panel>

      <!-- Metadata Section -->
      <mat-expansion-panel
        *ngIf="activityLog()!.metadata"
        class="card-section"
        appearance="outline"
      >
        <mat-expansion-panel-header>
          <mat-panel-title class="flex items-center gap-2">
            <mat-icon class="text-warning">data_object</mat-icon>
            <span>Metadata</span>
          </mat-panel-title>
        </mat-expansion-panel-header>

        <div class="metadata-container">
          <button
            mat-icon-button
            (click)="copyMetadata()"
            matTooltip="Copy metadata"
            class="copy-btn"
          >
            <mat-icon>content_copy</mat-icon>
          </button>
          <pre class="metadata-json"><code>{{
            formatMetadata(activityLog()!.metadata!)
          }}</code></pre>
        </div>
      </mat-expansion-panel>

      <!-- Timestamps Card -->
      <mat-card appearance="outlined" class="card-section">
        <mat-card-header>
          <mat-card-title class="flex items-center gap-2 mb-4">
            <mat-icon class="text-muted">schedule</mat-icon>
            <span>Timestamps</span>
          </mat-card-title>
        </mat-card-header>
        <mat-card-content class="pt-0">
          <div class="description-list">
            <!-- Activity ID -->
            <div class="description-item full-width">
              <span class="description-label">Activity ID</span>
              <code class="description-code">{{ activityLog()!.id }}</code>
            </div>

            <!-- Created At -->
            <div class="description-item">
              <span class="description-label">Created At</span>
              <span class="description-value">
                {{ activityLog()!.created_at | date: 'medium' }}
              </span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button
          mat-stroked-button
          (click)="goBack()"
          class="border-outline text-on-surface"
        >
          <mat-icon>arrow_back</mat-icon>
          Back to Activity Logs
        </button>
        <button
          mat-flat-button
          color="primary"
          (click)="copyAllDetails()"
          class="bg-primary text-on-primary"
        >
          <mat-icon>content_copy</mat-icon>
          Copy All Details
        </button>
      </div>
    </div>

    <!-- Error State -->
    <div *ngIf="!loading() && !activityLog()" class="error-container">
      <mat-card
        appearance="outlined"
        class="border border-error bg-error-container"
      >
        <mat-card-content class="flex items-center gap-3 p-6">
          <div class="bg-error-container rounded-lg p-3">
            <mat-icon class="text-error">error</mat-icon>
          </div>
          <div>
            <h3 class="font-semibold text-error">Activity Log Not Found</h3>
            <p class="text-sm text-muted">
              The activity log you're looking for could not be found or no
              longer exists.
            </p>
          </div>
          <button
            mat-flat-button
            (click)="goBack()"
            class="ml-auto bg-primary text-on-primary"
          >
            Go Back
          </button>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styleUrls: ['./activity-logs-detail.page.scss'],
})
export class ActivityLogsDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private activityLogsService = inject(ActivityLogsService);
  private snackBar = inject(MatSnackBar);

  // State signals
  activityLog = signal<ActivityLog | null>(null);
  loading = signal<boolean>(true);

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
    {
      label: 'Details',
      icon: 'description',
    },
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadActivityLog(id);
    } else {
      this.loading.set(false);
    }
  }

  /**
   * Load activity log details from the API
   */
  loadActivityLog(id: string): void {
    this.activityLogsService.getActivityLog(id).subscribe({
      next: (data) => {
        this.activityLog.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load activity log:', err);
        this.loading.set(false);
        this.snackBar.open('Activity log not found or access denied', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
        // Navigate back after delay to allow user to see the message
        setTimeout(() => this.goBack(), 2000);
      },
    });
  }

  /**
   * Navigate back to activity logs list
   */
  goBack(): void {
    this.router.navigate(['/monitoring/activity-logs']);
  }

  /**
   * Copy metadata to clipboard
   */
  copyMetadata(): void {
    const metadata = this.activityLog()?.metadata;
    if (metadata) {
      const metadataStr = JSON.stringify(metadata, null, 2);
      navigator.clipboard.writeText(metadataStr).then(
        () => {
          this.snackBar.open('Metadata copied to clipboard', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
        },
        (err) => {
          console.error('Failed to copy to clipboard:', err);
          this.snackBar.open('Failed to copy metadata', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
        },
      );
    }
  }

  /**
   * Copy all activity details to clipboard
   */
  copyAllDetails(): void {
    const details = this.formatActivityDetails();
    navigator.clipboard.writeText(details).then(
      () => {
        this.snackBar.open('All details copied to clipboard', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
      },
      (err) => {
        console.error('Failed to copy to clipboard:', err);
        this.snackBar.open('Failed to copy details', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      },
    );
  }

  /**
   * Delete activity log with confirmation
   */
  deleteActivity(): void {
    if (!this.activityLog()) return;

    const confirmed = confirm(
      'Are you sure you want to delete this activity log? This action cannot be undone.',
    );
    if (!confirmed) return;

    this.activityLogsService
      .deleteActivityLog(this.activityLog()!.id)
      .subscribe({
        next: () => {
          this.snackBar.open('Activity log deleted successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
          this.goBack();
        },
        error: (err) => {
          console.error('Failed to delete activity log:', err);
          this.snackBar.open(`Failed to delete: ${err.message}`, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        },
      });
  }

  /**
   * Format metadata object as pretty JSON
   */
  formatMetadata(metadata: Record<string, any>): string {
    return JSON.stringify(metadata, null, 2);
  }

  /**
   * Format all activity details for clipboard export
   */
  private formatActivityDetails(): string {
    const log = this.activityLog();
    if (!log) return '';

    let details = `Activity Log Details
=====================

Action: ${log.action}
Severity: ${log.severity.toUpperCase()}
Description: ${log.description}
ID: ${log.id}
User ID: ${log.user_id}

`;

    if (log.request_id) {
      details += `Request ID: ${log.request_id}\n`;
    }

    details += `\nUser Context:
${log.ip_address ? `IP Address: ${log.ip_address}\n` : ''}${log.session_id ? `Session ID: ${log.session_id}\n` : ''}${log.user_agent ? `User Agent: ${log.user_agent}\n` : ''}`;

    if (log.device_info) {
      details += `\nDevice Information:
${log.device_info.browser ? `Browser: ${log.device_info.browser}\n` : ''}${log.device_info.os ? `OS: ${log.device_info.os}\n` : ''}${log.device_info.device ? `Device: ${log.device_info.device}\n` : ''}${log.device_info.isDesktop ? `Desktop: Yes\n` : ''}${log.device_info.isTablet ? `Tablet: Yes\n` : ''}${log.device_info.isMobile ? `Mobile: Yes\n` : ''}`;
    }

    if (log.location_info) {
      details += `\nLocation Information:
${log.location_info.country ? `Country: ${log.location_info.country}\n` : ''}${log.location_info.city ? `City: ${log.location_info.city}\n` : ''}${log.location_info.timezone ? `Timezone: ${log.location_info.timezone}\n` : ''}`;
    }

    if (log.metadata) {
      details += `\nMetadata:
${JSON.stringify(log.metadata, null, 2)}\n`;
    }

    details += `\nCreated At: ${log.created_at}
`;

    return details;
  }
}
