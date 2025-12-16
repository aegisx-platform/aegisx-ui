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
import { ErrorLog } from '../../models/monitoring.types';
import { ErrorLogsService } from '../../services/error-logs.service';

/**
 * Error Logs Detail Page Component
 *
 * Displays complete details of a specific error log including:
 * - Error information (level, type, message, URL)
 * - User context (user ID, session ID, user agent)
 * - Request context (correlation ID, IP address, referer)
 * - Stack trace with copy functionality
 * - Metadata and timestamps
 */
@Component({
  selector: 'app-error-logs-detail',
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
      <p class="text-muted mt-4">Loading error details...</p>
    </div>

    <!-- Detail Page Content -->
    <div *ngIf="!loading() && errorLog()" class="error-detail-page">
      <!-- Breadcrumb -->
      <ax-breadcrumb [items]="breadcrumbItems"></ax-breadcrumb>

      <!-- Header Section -->
      <div class="page-header">
        <button
          mat-icon-button
          (click)="goBack()"
          matTooltip="Back to Error Logs"
          class="text-on-surface"
        >
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div class="flex-1 flex flex-col gap-1">
          <h1 class="text-3xl font-extrabold tracking-tight text-on-surface">
            Error Details
          </h1>
          <p class="text-muted text-sm">
            {{ errorLog()!.timestamp | date: 'medium' }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <span
            [ngClass]="{
              'level-badge error-badge': errorLog()!.level === 'error',
              'level-badge warn-badge': errorLog()!.level === 'warn',
              'level-badge info-badge': errorLog()!.level === 'info',
            }"
            class="px-3 py-1 rounded-full text-xs font-semibold"
          >
            {{ errorLog()!.level | uppercase }}
          </span>
          <button
            mat-icon-button
            color="warn"
            (click)="deleteError()"
            matTooltip="Delete this error log"
          >
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      </div>

      <!-- Error Information Card -->
      <mat-card appearance="outlined" class="card-section">
        <mat-card-header>
          <mat-card-title class="flex items-center gap-2 mb-4">
            <mat-icon class="text-primary">info</mat-icon>
            <span>Error Information</span>
          </mat-card-title>
        </mat-card-header>
        <mat-card-content class="pt-0">
          <div class="description-list">
            <!-- Level -->
            <div class="description-item">
              <span class="description-label">Level</span>
              <span
                [ngClass]="{
                  'error-text': errorLog()!.level === 'error',
                  'warn-text': errorLog()!.level === 'warn',
                  'info-text': errorLog()!.level === 'info',
                }"
                class="font-medium"
              >
                {{ errorLog()!.level | uppercase }}
              </span>
            </div>

            <!-- Type -->
            <div class="description-item">
              <span class="description-label">Type</span>
              <span class="description-value font-mono text-sm">
                {{ errorLog()!.type }}
              </span>
            </div>

            <!-- Message -->
            <div class="description-item full-width">
              <span class="description-label">Message</span>
              <p class="error-message">{{ errorLog()!.message }}</p>
            </div>

            <!-- URL -->
            <div *ngIf="errorLog()!.url" class="description-item full-width">
              <span class="description-label">URL</span>
              <a
                [href]="errorLog()!.url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary hover:underline break-all"
              >
                {{ errorLog()!.url }}
                <mat-icon class="inline text-xs ml-1">open_in_new</mat-icon>
              </a>
            </div>

            <!-- User ID -->
            <div *ngIf="errorLog()!.userId" class="description-item">
              <span class="description-label">User ID</span>
              <code class="description-code">{{ errorLog()!.userId }}</code>
            </div>

            <!-- Session ID -->
            <div *ngIf="errorLog()!.sessionId" class="description-item">
              <span class="description-label">Session ID</span>
              <code class="description-code">{{ errorLog()!.sessionId }}</code>
            </div>

            <!-- IP Address -->
            <div *ngIf="errorLog()!.ipAddress" class="description-item">
              <span class="description-label">IP Address</span>
              <code class="description-code">{{ errorLog()!.ipAddress }}</code>
            </div>

            <!-- User Agent -->
            <div
              *ngIf="errorLog()!.userAgent"
              class="description-item full-width"
            >
              <span class="description-label">User Agent</span>
              <code class="description-code text-xs">
                {{ errorLog()!.userAgent }}
              </code>
            </div>

            <!-- Correlation ID -->
            <div
              *ngIf="errorLog()!.correlationId"
              class="description-item full-width"
            >
              <span class="description-label">Correlation ID</span>
              <code class="description-code">
                {{ errorLog()!.correlationId }}
              </code>
            </div>

            <!-- Referer -->
            <div
              *ngIf="errorLog()!.referer"
              class="description-item full-width"
            >
              <span class="description-label">Referer</span>
              <a
                [href]="errorLog()!.referer"
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary hover:underline break-all font-mono text-sm"
              >
                {{ errorLog()!.referer }}
              </a>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Stack Trace Section -->
      <mat-expansion-panel
        *ngIf="errorLog()!.stack"
        class="card-section"
        appearance="outline"
      >
        <mat-expansion-panel-header>
          <mat-panel-title class="flex items-center gap-2">
            <mat-icon class="text-error">code</mat-icon>
            <span>Stack Trace</span>
            <span class="text-xs text-muted ml-auto">
              {{ stackTraceLines }} lines
            </span>
          </mat-panel-title>
        </mat-expansion-panel-header>

        <div class="stack-trace-container">
          <button
            mat-icon-button
            (click)="copyStackTrace()"
            matTooltip="Copy stack trace"
            class="copy-btn"
          >
            <mat-icon>content_copy</mat-icon>
          </button>
          <pre class="stack-trace"><code>{{ errorLog()!.stack }}</code></pre>
        </div>
      </mat-expansion-panel>

      <!-- Context Section -->
      <mat-expansion-panel
        *ngIf="errorLog()!.context"
        class="card-section"
        appearance="outline"
      >
        <mat-expansion-panel-header>
          <mat-panel-title class="flex items-center gap-2">
            <mat-icon class="text-warning">data_object</mat-icon>
            <span>Additional Context</span>
          </mat-panel-title>
        </mat-expansion-panel-header>

        <div class="context-container">
          <button
            mat-icon-button
            (click)="copyContext()"
            matTooltip="Copy context"
            class="copy-btn"
          >
            <mat-icon>content_copy</mat-icon>
          </button>
          <pre class="context-json"><code>{{
            formatContext(errorLog()!.context!)
          }}</code></pre>
        </div>
      </mat-expansion-panel>

      <!-- Metadata Card -->
      <mat-card appearance="outlined" class="card-section">
        <mat-card-header>
          <mat-card-title class="flex items-center gap-2 mb-4">
            <mat-icon class="text-muted">schedule</mat-icon>
            <span>Metadata</span>
          </mat-card-title>
        </mat-card-header>
        <mat-card-content class="pt-0">
          <div class="description-list">
            <!-- Error ID -->
            <div class="description-item full-width">
              <span class="description-label">Error ID</span>
              <code class="description-code">{{ errorLog()!.id }}</code>
            </div>

            <!-- Client Timestamp -->
            <div class="description-item">
              <span class="description-label">Client Timestamp</span>
              <span class="description-value">
                {{ errorLog()!.timestamp | date: 'medium' }}
              </span>
            </div>

            <!-- Server Timestamp -->
            <div class="description-item">
              <span class="description-label">Server Timestamp</span>
              <span class="description-value">
                {{ errorLog()!.serverTimestamp | date: 'medium' }}
              </span>
            </div>

            <!-- Created At -->
            <div class="description-item">
              <span class="description-label">Created At</span>
              <span class="description-value">
                {{ errorLog()!.createdAt | date: 'medium' }}
              </span>
            </div>

            <!-- Updated At -->
            <div class="description-item">
              <span class="description-label">Updated At</span>
              <span class="description-value">
                {{ errorLog()!.updatedAt | date: 'medium' }}
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
          Back to Error Logs
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
    <div *ngIf="!loading() && !errorLog()" class="error-container">
      <mat-card
        appearance="outlined"
        class="border border-error bg-error-container"
      >
        <mat-card-content class="flex items-center gap-3 p-6">
          <div class="bg-error-container rounded-lg p-3">
            <mat-icon class="text-error">error</mat-icon>
          </div>
          <div>
            <h3 class="font-semibold text-error">Error Log Not Found</h3>
            <p class="text-sm text-muted">
              The error log you're looking for could not be found or no longer
              exists.
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
  styleUrls: ['./error-logs-detail.page.scss'],
})
export class ErrorLogsDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private errorLogsService = inject(ErrorLogsService);
  private snackBar = inject(MatSnackBar);

  // State signals
  errorLog = signal<ErrorLog | null>(null);
  loading = signal<boolean>(true);

  // Computed signals
  stackTraceLines = computed(() => {
    const stack = this.errorLog()?.stack;
    return stack ? stack.split('\n').length : 0;
  });

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
    {
      label: 'Details',
      icon: 'description',
    },
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadErrorLog(id);
    } else {
      this.loading.set(false);
    }
  }

  /**
   * Load error log details from the API
   */
  loadErrorLog(id: string): void {
    this.errorLogsService.getErrorLog(id).subscribe({
      next: (data) => {
        this.errorLog.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load error log:', err);
        this.loading.set(false);
        this.snackBar.open('Error log not found or access denied', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
        // Navigate back after delay to allow user to see the message
        setTimeout(() => this.goBack(), 2000);
      },
    });
  }

  /**
   * Navigate back to error logs list
   */
  goBack(): void {
    this.router.navigate(['/monitoring/error-logs']);
  }

  /**
   * Copy stack trace to clipboard
   */
  copyStackTrace(): void {
    const stack = this.errorLog()?.stack;
    if (stack) {
      navigator.clipboard.writeText(stack).then(
        () => {
          this.snackBar.open('Stack trace copied to clipboard', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
        },
        (err) => {
          console.error('Failed to copy to clipboard:', err);
          this.snackBar.open('Failed to copy stack trace', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
        },
      );
    }
  }

  /**
   * Copy context JSON to clipboard
   */
  copyContext(): void {
    const context = this.errorLog()?.context;
    if (context) {
      const contextStr = JSON.stringify(context, null, 2);
      navigator.clipboard.writeText(contextStr).then(
        () => {
          this.snackBar.open('Context copied to clipboard', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
        },
        (err) => {
          console.error('Failed to copy to clipboard:', err);
          this.snackBar.open('Failed to copy context', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
        },
      );
    }
  }

  /**
   * Copy all error details to clipboard
   */
  copyAllDetails(): void {
    const details = this.formatErrorDetails();
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
   * Delete error log with confirmation
   */
  deleteError(): void {
    if (!this.errorLog()) return;

    const confirmed = confirm(
      'Are you sure you want to delete this error log? This action cannot be undone.',
    );
    if (!confirmed) return;

    this.errorLogsService.deleteErrorLog(this.errorLog()!.id).subscribe({
      next: () => {
        this.snackBar.open('Error log deleted successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
        this.goBack();
      },
      error: (err) => {
        console.error('Failed to delete error log:', err);
        this.snackBar.open(`Failed to delete: ${err.message}`, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  /**
   * Format context object as pretty JSON
   */
  formatContext(context: Record<string, any>): string {
    return JSON.stringify(context, null, 2);
  }

  /**
   * Format all error details for clipboard export
   */
  private formatErrorDetails(): string {
    const log = this.errorLog();
    if (!log) return '';

    let details = `Error Log Details
==================

Level: ${log.level.toUpperCase()}
Type: ${log.type}
Message: ${log.message}
ID: ${log.id}

`;

    if (log.url) {
      details += `URL: ${log.url}\n`;
    }

    details += `\nError Information:
${log.userId ? `User ID: ${log.userId}\n` : ''}${log.sessionId ? `Session ID: ${log.sessionId}\n` : ''}${log.userAgent ? `User Agent: ${log.userAgent}\n` : ''}${log.correlationId ? `Correlation ID: ${log.correlationId}\n` : ''}${log.ipAddress ? `IP Address: ${log.ipAddress}\n` : ''}${log.referer ? `Referer: ${log.referer}\n` : ''}`;

    if (log.stack) {
      details += `\nStack Trace:
${log.stack}\n`;
    }

    if (log.context) {
      details += `\nAdditional Context:
${JSON.stringify(log.context, null, 2)}\n`;
    }

    details += `\nTimestamps:
Client Time: ${log.timestamp}
Server Time: ${log.serverTimestamp}
Created At: ${log.createdAt}
Updated At: ${log.updatedAt}
`;

    return details;
  }
}
