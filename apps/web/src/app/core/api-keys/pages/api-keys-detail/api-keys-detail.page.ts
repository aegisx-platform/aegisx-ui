import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { BreadcrumbComponent, BreadcrumbItem } from '@aegisx/ui';
import { ApiKeysService } from '../../services/api-keys.service';
import { ApiKey, ApiKeyScope } from '../../models/api-keys.types';
import { ConfirmDialogComponent } from '../../../../shared/ui/components/confirm-dialog.component';

/**
 * API Keys Detail Page Component
 *
 * Displays complete details of a specific API key including:
 * - Key information (name, status, created, expires)
 * - Masked key display with copy functionality
 * - Permissions/scopes as chips
 * - Usage statistics (total requests, last 7 days)
 * - Recent requests table
 * - Actions: revoke, delete
 */
@Component({
  selector: 'app-api-keys-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatTabsModule,
    BreadcrumbComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Loading State -->
    <div *ngIf="loading()" class="loading-container">
      <mat-spinner diameter="48"></mat-spinner>
      <p class="text-muted mt-4">Loading API key details...</p>
    </div>

    <!-- Detail Page Content -->
    <div *ngIf="!loading() && apiKey()" class="api-key-detail-page">
      <!-- Breadcrumb -->
      <ax-breadcrumb [items]="breadcrumbItems"></ax-breadcrumb>

      <!-- Header Section -->
      <div class="page-header">
        <button
          mat-icon-button
          (click)="goBack()"
          matTooltip="Back to API Keys"
          class="text-on-surface"
        >
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div class="flex-1 flex flex-col gap-1">
          <h1 class="text-3xl font-extrabold tracking-tight text-on-surface">
            {{ apiKey()!.name }}
          </h1>
          <p class="text-muted text-sm">
            Created {{ apiKey()!.created_at | date: 'medium' }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <span
            [ngClass]="{
              'status-badge active-badge': apiKey()!.is_active,
              'status-badge inactive-badge': !apiKey()!.is_active,
            }"
            class="px-3 py-1 rounded-full text-xs font-semibold"
          >
            {{ apiKey()!.is_active ? 'ACTIVE' : 'REVOKED' }}
          </span>
          @if (apiKey()!.is_active) {
            <button
              mat-icon-button
              color="warn"
              (click)="revokeKey()"
              matTooltip="Revoke this API key"
            >
              <mat-icon>block</mat-icon>
            </button>
          }
          <button
            mat-icon-button
            color="warn"
            (click)="deleteKey()"
            matTooltip="Delete this API key"
          >
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      </div>

      <!-- Key Information Card -->
      <mat-card appearance="outlined" class="card-section">
        <mat-card-header>
          <mat-card-title class="flex items-center gap-2 mb-4">
            <mat-icon class="text-primary">info</mat-icon>
            <span>Key Information</span>
          </mat-card-title>
        </mat-card-header>
        <mat-card-content class="pt-0">
          <div class="description-list">
            <!-- Name -->
            <div class="description-item">
              <span class="description-label">Name</span>
              <span class="description-value font-medium">
                {{ apiKey()!.name }}
              </span>
            </div>

            <!-- Status -->
            <div class="description-item">
              <span class="description-label">Status</span>
              <span
                [ngClass]="{
                  'text-success-emphasis': apiKey()!.is_active,
                  'text-error-emphasis': !apiKey()!.is_active,
                }"
                class="font-medium"
              >
                {{ apiKey()!.is_active ? 'Active' : 'Revoked' }}
              </span>
            </div>

            <!-- Created At -->
            <div class="description-item">
              <span class="description-label">Created</span>
              <span class="description-value">
                {{ apiKey()!.created_at | date: 'medium' }}
              </span>
            </div>

            <!-- Updated At -->
            <div class="description-item">
              <span class="description-label">Updated</span>
              <span class="description-value">
                {{ apiKey()!.updated_at | date: 'medium' }}
              </span>
            </div>

            <!-- Expires At -->
            <div class="description-item">
              <span class="description-label">Expires</span>
              @if (apiKey()!.expires_at) {
                <span class="description-value">
                  {{ apiKey()!.expires_at | date: 'medium' }}
                </span>
              } @else {
                <span class="text-muted">Never</span>
              }
            </div>

            <!-- Last Used -->
            <div class="description-item">
              <span class="description-label">Last Used</span>
              @if (apiKey()!.last_used_at) {
                <span class="description-value">
                  {{ apiKey()!.last_used_at | date: 'medium' }}
                </span>
              } @else {
                <span class="text-muted">Never</span>
              }
            </div>

            <!-- Last Used IP -->
            <div
              *ngIf="apiKey()!.last_used_ip"
              class="description-item full-width"
            >
              <span class="description-label">Last Used IP</span>
              <code class="description-code">{{ apiKey()!.last_used_ip }}</code>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Masked Key Section -->
      <mat-card appearance="outlined" class="card-section">
        <mat-card-header>
          <mat-card-title class="flex items-center gap-2 mb-4">
            <mat-icon class="text-primary">vpn_key</mat-icon>
            <span>API Key Preview</span>
          </mat-card-title>
        </mat-card-header>
        <mat-card-content class="pt-0">
          <div class="key-display">
            <div class="key-preview">
              <code class="font-mono text-sm">{{ maskedKey() }}</code>
            </div>
            <button
              mat-icon-button
              color="primary"
              (click)="copyKey()"
              matTooltip="Copy key preview"
              class="copy-key-btn"
            >
              <mat-icon>content_copy</mat-icon>
            </button>
          </div>
          <p class="text-xs text-muted mt-3 mb-0">
            Only the key prefix is displayed for security. The full key was
            shown only once when created.
          </p>
        </mat-card-content>
      </mat-card>

      <!-- Permissions Section -->
      @if (apiKey() && (apiKey()?.scopes?.length ?? 0) > 0) {
        <mat-card appearance="outlined" class="card-section">
          <mat-card-header>
            <mat-card-title class="flex items-center gap-2 mb-4">
              <mat-icon class="text-primary">security</mat-icon>
              <span>Granted Permissions</span>
            </mat-card-title>
          </mat-card-header>
          <mat-card-content class="pt-0">
            <div class="permissions-grid">
              @for (scope of apiKey()?.scopes || []; track scope.resource) {
                <div class="permission-item">
                  <h4 class="font-semibold text-sm mb-2">
                    {{ scope.resource }}
                  </h4>
                  <div class="flex flex-wrap gap-2">
                    @for (action of scope.actions; track action) {
                      <mat-chip class="permission-chip">
                        {{ action }}
                      </mat-chip>
                    }
                  </div>
                  @if (scope.conditions) {
                    <div class="conditions-info text-xs text-muted mt-2">
                      <p>
                        Conditions: {{ formatConditions(scope.conditions) }}
                      </p>
                    </div>
                  }
                </div>
              }
            </div>
          </mat-card-content>
        </mat-card>
      }

      <!-- Usage Statistics Section -->
      @if (usageStats()) {
        <mat-card appearance="outlined" class="card-section">
          <mat-card-header>
            <mat-card-title class="flex items-center gap-2 mb-4">
              <mat-icon class="text-primary">trending_up</mat-icon>
              <span>Usage Statistics</span>
            </mat-card-title>
          </mat-card-header>
          <mat-card-content class="pt-0">
            <div class="stats-grid">
              <!-- Total Requests -->
              <div class="stat-card">
                <div class="stat-value">{{ usageStats()!.totalRequests }}</div>
                <div class="stat-label">Total Requests</div>
              </div>

              <!-- Last 7 Days -->
              <div class="stat-card">
                <div class="stat-value">
                  {{ usageStats()!.requestsLast7Days }}
                </div>
                <div class="stat-label">Last 7 Days</div>
              </div>

              <!-- Success Rate -->
              <div class="stat-card">
                <div class="stat-value">{{ usageStats()!.successRate }}%</div>
                <div class="stat-label">Success Rate</div>
              </div>

              <!-- Avg Response Time -->
              <div class="stat-card">
                <div class="stat-value">
                  {{ usageStats()!.avgResponseTime }}ms
                </div>
                <div class="stat-label">Avg Response Time</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      }

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button
          mat-stroked-button
          (click)="goBack()"
          class="border-outline text-on-surface"
        >
          <mat-icon>arrow_back</mat-icon>
          Back to API Keys
        </button>
        @if (apiKey()!.is_active) {
          <button mat-stroked-button color="warn" (click)="revokeKey()">
            <mat-icon>block</mat-icon>
            Revoke Key
          </button>
        }
        <button mat-flat-button color="warn" (click)="deleteKey()">
          <mat-icon>delete</mat-icon>
          Delete Key
        </button>
      </div>
    </div>

    <!-- Error State -->
    <div *ngIf="!loading() && !apiKey()" class="error-container">
      <mat-card
        appearance="outlined"
        class="border border-error bg-error-container"
      >
        <mat-card-content class="flex items-center gap-3 p-6">
          <div class="bg-error-container rounded-lg p-3">
            <mat-icon class="text-error">error</mat-icon>
          </div>
          <div>
            <h3 class="font-semibold text-error">API Key Not Found</h3>
            <p class="text-sm text-muted">
              The API key you're looking for could not be found or no longer
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
  styleUrls: ['./api-keys-detail.page.scss'],
})
export class ApiKeysDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiKeysService = inject(ApiKeysService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  // State signals
  apiKey = signal<ApiKey | null>(null);
  loading = signal<boolean>(true);
  usageStats = signal<any>(null);

  // Computed signals
  maskedKey = computed(() => {
    const key = this.apiKey();
    if (!key) return '';
    const prefix = key.key_prefix || '***';
    return `${prefix}...`;
  });

  // Breadcrumb items
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Settings', url: '/settings', icon: 'settings' },
    {
      label: 'API Keys',
      url: '/settings/api-keys',
      icon: 'vpn_key',
    },
    {
      label: 'Details',
      icon: 'description',
    },
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadApiKey(id);
      this.loadUsageStats(id);
    } else {
      this.loading.set(false);
    }
  }

  /**
   * Load API key details from the service
   */
  private loadApiKey(id: string): void {
    this.apiKeysService.getKeyById(id).subscribe({
      next: (key) => {
        this.apiKey.set(key);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load API key:', err);
        this.loading.set(false);
        this.snackBar.open('API key not found or access denied', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
        setTimeout(() => this.goBack(), 2000);
      },
    });
  }

  /**
   * Load usage statistics for the API key
   */
  private loadUsageStats(id: string): void {
    // Mock implementation - replace with actual API call when available
    setTimeout(() => {
      this.usageStats.set({
        totalRequests: 1250,
        requestsLast7Days: 342,
        successRate: 98.5,
        avgResponseTime: 145,
      });
    }, 500);
  }

  /**
   * Navigate back to API keys list
   */
  goBack(): void {
    this.router.navigate(['/settings/api-keys']);
  }

  /**
   * Copy masked key to clipboard
   */
  copyKey(): void {
    const key = this.maskedKey();
    if (key) {
      navigator.clipboard.writeText(key).then(
        () => {
          this.snackBar.open('Key preview copied to clipboard', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
        },
        (err) => {
          console.error('Failed to copy to clipboard:', err);
          this.snackBar.open('Failed to copy key', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
        },
      );
    }
  }

  /**
   * Revoke API key with confirmation
   */
  revokeKey(): void {
    if (!this.apiKey()) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Revoke API Key?',
        message: `Are you sure you want to revoke "${this.apiKey()!.name}"? This action will immediately disable the key.`,
        confirmText: 'Revoke',
        confirmColor: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.apiKeysService.revokeKey(this.apiKey()!.id).subscribe({
          next: () => {
            this.snackBar.open('API Key revoked successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar'],
            });
            // Update the local state
            if (this.apiKey()) {
              this.apiKey.set({ ...this.apiKey()!, is_active: false });
            }
          },
          error: (err) => {
            console.error('Failed to revoke API key:', err);
            this.snackBar.open(
              err.message || 'Failed to revoke API key',
              'Close',
              { duration: 5000, panelClass: ['error-snackbar'] },
            );
          },
        });
      }
    });
  }

  /**
   * Delete API key with confirmation
   */
  deleteKey(): void {
    if (!this.apiKey()) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete API Key?',
        message: `Are you sure you want to permanently delete "${this.apiKey()!.name}"? This action cannot be undone.`,
        confirmText: 'Delete',
        confirmColor: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.apiKeysService.deleteKey(this.apiKey()!.id).subscribe({
          next: () => {
            this.snackBar.open('API Key deleted successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar'],
            });
            this.goBack();
          },
          error: (err) => {
            console.error('Failed to delete API key:', err);
            this.snackBar.open(
              err.message || 'Failed to delete API key',
              'Close',
              { duration: 5000, panelClass: ['error-snackbar'] },
            );
          },
        });
      }
    });
  }

  /**
   * Format conditions object as readable string
   */
  formatConditions(conditions: Record<string, any>): string {
    return Object.entries(conditions)
      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
      .join(', ');
  }
}
