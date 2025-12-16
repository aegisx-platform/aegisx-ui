import { BreadcrumbComponent, BreadcrumbItem } from '@aegisx/ui';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserOption, UserService } from '../../../users/services/user.service';
import { ActivityLogDetailDialogComponent } from '../../components/activity-log-detail-dialog/activity-log-detail-dialog.component';
import { CleanupDialogComponent } from '../../components/cleanup-dialog/cleanup-dialog.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { ActivityLog, ActivityLogsQuery } from '../../models/monitoring.types';
import { ActivityLogsService } from '../../services/activity-logs.service';

@Component({
  selector: 'app-activity-logs',
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
    MatDialogModule,
    MatAutocompleteModule,
    BreadcrumbComponent,
  ],
  template: `
    <div class="activity-logs-page p-6 space-y-6">
      <!-- Breadcrumb -->
      <ax-breadcrumb [items]="breadcrumbItems"></ax-breadcrumb>

      <!-- Header -->
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight text-on-surface">
            Activity Logs
          </h1>
          <p class="text-muted mt-1">View and manage all user activity logs</p>
        </div>

        <div class="flex flex-wrap gap-2">
          <button
            mat-stroked-button
            (click)="exportLogs()"
            [disabled]="loading()"
          >
            <mat-icon>download</mat-icon>
            Export CSV
          </button>
          <button mat-stroked-button (click)="refresh()" [disabled]="loading()">
            <mat-icon>refresh</mat-icon>
            Refresh
          </button>
        </div>
      </div>

      <!-- Activity Statistics -->
      <div *ngIf="stats()" class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <!-- Total Activities Card -->
        <mat-card appearance="outlined">
          <mat-card-content class="p-4">
            <div class="flex items-center gap-1.5 !mb-2">
              <span
                class="size-2.5 shrink-0 rounded-sm bg-primary"
                aria-hidden="true"
              ></span>
              <h3 class="text-md font-medium text-muted !mb-0">
                Total Activities
              </h3>
            </div>
            <p
              class="text-4xl font-extrabold tracking-tight text-on-surface mb-1"
            >
              {{ stats()?.total_activities || 0 }}
            </p>
            <p class="text-xs text-muted">All recorded user actions</p>
          </mat-card-content>
        </mat-card>

        <!-- Info Activities Card -->
        <mat-card appearance="outlined">
          <mat-card-content class="p-4">
            <div class="flex items-center gap-1.5 !mb-2">
              <span
                class="size-2.5 shrink-0 rounded-sm bg-success"
                aria-hidden="true"
              ></span>
              <h3 class="text-md font-medium text-muted !mb-0">Info</h3>
            </div>
            <p
              class="text-4xl font-extrabold tracking-tight text-on-surface mb-1"
            >
              {{ stats()?.activities_by_severity?.info || 0 }}
            </p>
            <p class="text-xs text-muted">Normal operations</p>
          </mat-card-content>
        </mat-card>

        <!-- Warning Activities Card -->
        <mat-card appearance="outlined">
          <mat-card-content class="p-4">
            <div class="flex items-center gap-1.5 !mb-2">
              <span
                class="size-2.5 shrink-0 rounded-sm bg-warning"
                aria-hidden="true"
              ></span>
              <h3 class="text-md font-medium text-muted !mb-0">Warnings</h3>
            </div>
            <p
              class="text-4xl font-extrabold tracking-tight text-on-surface mb-1"
            >
              {{ stats()?.activities_by_severity?.warning || 0 }}
            </p>
            <p class="text-xs text-muted">Attention required</p>
          </mat-card-content>
        </mat-card>

        <!-- Critical/Error Card -->
        <mat-card appearance="outlined">
          <mat-card-content class="p-4">
            <div class="flex items-center gap-1.5 !mb-2">
              <span
                class="size-2.5 shrink-0 rounded-sm bg-error"
                aria-hidden="true"
              ></span>
              <h3 class="text-md font-medium text-muted !mb-0">
                Critical/Error
              </h3>
            </div>
            <p
              class="text-4xl font-extrabold tracking-tight text-on-surface mb-1"
            >
              {{
                (stats()?.activities_by_severity?.error || 0) +
                  (stats()?.activities_by_severity?.critical || 0)
              }}
            </p>
            <p class="text-xs text-muted">Urgent attention needed</p>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Filters -->
      <mat-card appearance="outlined">
        <mat-card-content class="p-6">
          <!-- Filter Header -->
          <div class="flex items-center gap-2 mb-4">
            <mat-icon class="text-primary">filter_alt</mat-icon>
            <h3 class="text-base font-semibold text-on-surface !mb-0">
              Filter Activity Logs
            </h3>
          </div>

          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start"
          >
            <mat-form-field
              appearance="outline"
              subscriptSizing="dynamic"
              class="w-full"
            >
              <mat-label>Search Description</mat-label>
              <input
                matInput
                placeholder="Search in descriptions"
                [formControl]="searchControl"
              />
              <mat-icon matPrefix>search</mat-icon>
            </mat-form-field>

            <mat-form-field
              appearance="outline"
              subscriptSizing="dynamic"
              class="w-full"
            >
              <mat-label>Severity</mat-label>
              <mat-select [formControl]="severityControl">
                <mat-option [value]="null">All Severities</mat-option>
                <mat-option value="info">Info</mat-option>
                <mat-option value="warning">Warning</mat-option>
                <mat-option value="error">Error</mat-option>
                <mat-option value="critical">Critical</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field
              appearance="outline"
              subscriptSizing="dynamic"
              class="w-full"
            >
              <mat-label>Action</mat-label>
              <input
                matInput
                placeholder="e.g., login, logout"
                [formControl]="actionControl"
              />
            </mat-form-field>

            <mat-form-field
              appearance="outline"
              subscriptSizing="dynamic"
              class="w-full"
            >
              <mat-label>User</mat-label>
              <input
                matInput
                placeholder="Search user by name or email (min 2 characters)"
                [formControl]="userSearchControl"
                [matAutocomplete]="userAuto"
                (input)="onUserSearchChange($event)"
              />
              <mat-icon matPrefix>person</mat-icon>
              @if (selectedUserId) {
                <button
                  matSuffix
                  mat-icon-button
                  (click)="clearUserSelection()"
                  matTooltip="Clear selection"
                >
                  <mat-icon>close</mat-icon>
                </button>
              }
              <mat-autocomplete
                #userAuto="matAutocomplete"
                [displayWith]="displayUser"
                (optionSelected)="onUserSelected($event)"
              >
                @if (isSearchingUsers()) {
                  <mat-option disabled>
                    <div class="flex items-center gap-2">
                      <mat-spinner diameter="20"></mat-spinner>
                      <span>Searching users...</span>
                    </div>
                  </mat-option>
                }
                @for (user of userSearchResults(); track user.value) {
                  <mat-option [value]="user">
                    <div class="flex items-center gap-2">
                      <mat-icon class="text-muted">person</mat-icon>
                      <div>
                        <div class="font-medium">{{ user.label }}</div>
                        @if (user.email) {
                          <div class="text-xs text-muted">
                            {{ user.email }}
                          </div>
                        }
                      </div>
                    </div>
                  </mat-option>
                }
                @if (
                  userSearchResults().length === 0 &&
                  !isSearchingUsers() &&
                  userSearchQuery().length >= 2
                ) {
                  <mat-option disabled>
                    <div class="flex items-center gap-2 text-muted">
                      <mat-icon>search_off</mat-icon>
                      <span>No users found</span>
                    </div>
                  </mat-option>
                }
                @if (
                  userSearchQuery().length > 0 && userSearchQuery().length < 2
                ) {
                  <mat-option disabled>
                    <div class="flex items-center gap-2 text-muted">
                      <mat-icon>info</mat-icon>
                      <span>Type at least 2 characters to search</span>
                    </div>
                  </mat-option>
                }
              </mat-autocomplete>
            </mat-form-field>
          </div>

          <div class="flex gap-2 mt-4">
            <button
              mat-flat-button
              (click)="applyFilters()"
              class="bg-primary text-on-primary"
            >
              <mat-icon>filter_list</mat-icon>
              Apply Filters
            </button>
            <button
              mat-stroked-button
              (click)="clearFilters()"
              class="border-outline text-on-surface "
            >
              <mat-icon>clear</mat-icon>
              Clear Filters
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Loading State -->
      <div *ngIf="loading()" class="flex justify-center items-center py-12">
        <mat-spinner diameter="48"></mat-spinner>
      </div>

      <!-- Error State -->
      <div *ngIf="error()">
        <mat-card
          appearance="outlined"
          class="border border-error bg-error-container rounded-xl"
        >
          <mat-card-content class="flex items-center gap-3 p-6">
            <div class="bg-error-container rounded-lg p-3">
              <mat-icon class="text-error">error</mat-icon>
            </div>
            <div>
              <h3 class="font-semibold text-error">Error Loading Logs</h3>
              <p class="text-sm text-muted">{{ error() }}</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Activity Logs Table -->
      <div *ngIf="!loading() && !error()">
        <mat-card appearance="outlined">
          <div class="overflow-x-auto">
            <table
              mat-table
              [dataSource]="activityLogs()"
              class="w-full"
              matSort
            >
              <!-- Timestamp Column -->
              <ng-container matColumnDef="timestamp">
                <th
                  mat-header-cell
                  *matHeaderCellDef
                  mat-sort-header
                  class="min-w-[180px]"
                >
                  Timestamp
                </th>
                <td
                  mat-cell
                  *matCellDef="let log"
                  class="text-sm min-w-[180px]"
                >
                  {{ log.created_at | date: 'dd/MM/yyyy HH:mm:ss' }}
                </td>
              </ng-container>

              <!-- Severity Column -->
              <ng-container matColumnDef="severity">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>
                  Severity
                </th>
                <td mat-cell *matCellDef="let log">
                  <span
                    [class]="
                      'inline-flex items-center whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset gap-2 ' +
                      (log.severity === 'critical'
                        ? 'chip-error'
                        : log.severity === 'error'
                          ? 'bg-red-50 text-error ring-red-600/20 dark:bg-red-400/10 dark:text-error dark:ring-red-400/20'
                          : log.severity === 'warning'
                            ? 'chip-warning ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-500 dark:ring-amber-400/20'
                            : 'bg-green-50 text-success ring-green-600/20 dark:bg-green-400/10 dark:text-green-500 dark:ring-green-400/20')
                    "
                  >
                    <span
                      [class]="
                        'size-2 rounded-sm ' +
                        (log.severity === 'critical'
                          ? 'bg-error'
                          : log.severity === 'error'
                            ? 'bg-error'
                            : log.severity === 'warning'
                              ? 'bg-warning'
                              : 'bg-success')
                      "
                      aria-hidden="true"
                    ></span>
                    {{ log.severity | uppercase }}
                  </span>
                </td>
              </ng-container>

              <!-- Action Column -->
              <ng-container matColumnDef="action">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>
                  Action
                </th>
                <td mat-cell *matCellDef="let log">
                  <mat-chip class="bg-surface-container text-primary">
                    {{ log.action }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Description Column -->
              <ng-container matColumnDef="description">
                <th mat-header-cell *matHeaderCellDef>Description</th>
                <td mat-cell *matCellDef="let log" class="max-w-md">
                  <div class="truncate" [matTooltip]="log.description">
                    {{ log.description }}
                  </div>
                </td>
              </ng-container>

              <!-- User ID Column (future: map to user email) -->
              <ng-container matColumnDef="user">
                <th mat-header-cell *matHeaderCellDef>User</th>
                <td mat-cell *matCellDef="let log" class="text-sm">
                  <div class="truncate max-w-xs" [matTooltip]="log.user_id">
                    {{ log.user_id.substring(0, 8) }}...
                  </div>
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let log">
                  <button
                    mat-icon-button
                    color="primary"
                    (click)="viewLogDetails(log)"
                    matTooltip="View Details"
                  >
                    <mat-icon>visibility</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>

              <!-- No Data Row -->
              <tr class="mat-row" *matNoDataRow>
                <td
                  class="mat-cell text-center py-8"
                  [attr.colspan]="displayedColumns.length"
                >
                  <div class="flex flex-col items-center gap-2 text-muted">
                    <mat-icon class="text-4xl">inbox</mat-icon>
                    <p>No activity logs found</p>
                  </div>
                </td>
              </tr>
            </table>
          </div>

          <!-- Paginator -->
          <mat-paginator
            *ngIf="pagination()"
            [length]="pagination()?.total || 0"
            [pageSize]="pagination()?.limit || 20"
            [pageIndex]="(pagination()?.page || 1) - 1"
            [pageSizeOptions]="[10, 20, 50, 100]"
            (page)="onPageChange($event)"
            showFirstLastButtons
          >
          </mat-paginator>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
      }

      .activity-logs-page {
        max-width: 1400px;
        margin: 0 auto;
      }

      /* Tremor-style Table Styling */
      table {
        width: 100%;
      }

      .mat-mdc-header-cell {
        padding: 14px 16px;
        font-size: 0.75rem;
        font-weight: 600;
        color: rgb(71, 85, 105); /* text-muted */
        text-transform: uppercase;
        letter-spacing: 0.05em;
        background-color: rgb(248, 250, 252); /* bg-surface-container */
        border-bottom: 1px solid rgb(226, 232, 240); /* border-slate-200 */
      }

      .mat-mdc-cell {
        padding: 14px 16px;
        font-size: 0.875rem;
        color: rgb(51, 65, 85); /* text-on-surface */
        border-bottom: 1px solid rgb(241, 245, 249); /* border-slate-100 */
      }

      .mat-mdc-row:hover {
        background-color: rgb(248, 250, 252); /* bg-surface-container */
      }

      /* Chip Styling */
      mat-chip {
        font-size: 0.75rem;
        min-height: 24px;
        font-weight: 500;
        border-radius: 6px;
      }

      /* Table Container */
      .overflow-x-auto {
        border-radius: 8px 8px 0 0;
      }
    `,
  ],
})
export class ActivityLogsComponent implements OnInit {
  private activityLogsService = inject(ActivityLogsService);
  private userService = inject(UserService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  // Breadcrumb items
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', url: '/', icon: 'home' },
    {
      label: 'Activity Logs',
      url: '/monitoring/activity-logs',
      icon: 'history',
    },
  ];

  // Table columns
  displayedColumns: string[] = [
    'timestamp',
    'severity',
    'action',
    'description',
    'user',
    'actions',
  ];

  // Form controls for filters
  searchControl = new FormControl<string>('');
  severityControl = new FormControl<string | null>(null);
  actionControl = new FormControl<string>('');
  userSearchControl = new FormControl<string>('');
  selectedUserId: string | null = null;

  // User search state
  userSearchResults = signal<UserOption[]>([]);
  isSearchingUsers = signal<boolean>(false);
  userSearchQuery = signal<string>('');

  // State signals
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  // Data signals from service
  activityLogs = computed(() => this.activityLogsService.activityLogs());
  stats = computed(() => this.activityLogsService.activityStats());
  pagination = computed(() => this.activityLogsService.pagination());

  ngOnInit(): void {
    this.loadActivityLogs();
    this.loadActivityStats();
  }

  // Handle user search input
  onUserSearchChange(event: any): void {
    const query = event.target.value;
    this.userSearchQuery.set(query);

    if (query.length >= 2) {
      this.searchUsers(query);
    } else {
      this.userSearchResults.set([]);
    }
  }

  // Search users via API
  async searchUsers(query: string): Promise<void> {
    this.isSearchingUsers.set(true);
    try {
      const results = await this.userService
        .getUsersDropdownOptions(query)
        .toPromise();

      if (results && Array.isArray(results)) {
        this.userSearchResults.set(results);
      } else {
        this.userSearchResults.set([]);
      }
    } catch (error) {
      console.error('Failed to search users:', error);
      this.userSearchResults.set([]);
    } finally {
      this.isSearchingUsers.set(false);
    }
  }

  // Handle user selection from autocomplete
  onUserSelected(event: any): void {
    const option = event.option.value as UserOption;
    this.selectedUserId = option.value;
    this.userSearchControl.setValue(option.label);
  }

  // Clear user selection
  clearUserSelection(): void {
    this.selectedUserId = null;
    this.userSearchControl.setValue('');
    this.userSearchResults.set([]);
  }

  // Display function for autocomplete
  displayUser = (option: UserOption | string): string => {
    if (!option) return '';
    if (typeof option === 'string') return option;
    return option.label || '';
  };

  loadActivityLogs(query?: ActivityLogsQuery): void {
    this.loading.set(true);
    this.error.set(null);

    this.activityLogsService.getActivityLogs(query).subscribe({
      next: () => {
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.message || 'Failed to load activity logs');
        console.error('Failed to load activity logs:', err);
      },
    });
  }

  loadActivityStats(): void {
    this.activityLogsService.getActivityStats().subscribe({
      error: (err) => {
        console.error('Failed to load activity stats:', err);
      },
    });
  }

  applyFilters(): void {
    const query: ActivityLogsQuery = {
      search: this.searchControl.value || undefined,
      severity: this.severityControl.value as any,
      action: this.actionControl.value || undefined,
      user_id: this.selectedUserId || undefined,
      page: 1,
      limit: 20,
    };

    // Remove null/undefined values
    Object.keys(query).forEach((key) => {
      if (
        query[key as keyof ActivityLogsQuery] === undefined ||
        query[key as keyof ActivityLogsQuery] === null
      ) {
        delete query[key as keyof ActivityLogsQuery];
      }
    });

    this.loadActivityLogs(query);
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.severityControl.setValue(null);
    this.actionControl.setValue('');
    this.userSearchControl.setValue('');
    this.selectedUserId = null;
    this.loadActivityLogs();
  }

  onPageChange(event: PageEvent): void {
    const query: ActivityLogsQuery = {
      page: event.pageIndex + 1, // Backend uses 1-indexed pages
      limit: event.pageSize,
      search: this.searchControl.value || undefined,
      severity: this.severityControl.value as any,
      action: this.actionControl.value || undefined,
      user_id: this.selectedUserId || undefined,
    };

    this.loadActivityLogs(query);
  }

  viewLogDetails(log: ActivityLog): void {
    this.router.navigate(['/monitoring/activity-logs', log.id]);
  }

  exportLogs(): void {
    const query: ActivityLogsQuery = {
      search: this.searchControl.value || undefined,
      severity: this.severityControl.value as any,
      action: this.actionControl.value || undefined,
      user_id: this.selectedUserId || undefined,
    };

    this.activityLogsService.exportLogs(query).subscribe({
      next: () => {
        this.snackBar.open('Logs exported successfully', 'Close', {
          duration: 3000,
        });
      },
      error: (err) => {
        this.snackBar.open(`Failed to export logs: ${err.message}`, 'Close', {
          duration: 5000,
        });
      },
    });
  }

  refresh(): void {
    const query: ActivityLogsQuery = {
      search: this.searchControl.value || undefined,
      severity: this.severityControl.value as any,
      action: this.actionControl.value || undefined,
      user_id: this.selectedUserId || undefined,
      page: this.pagination()?.page || 1,
      limit: this.pagination()?.limit || 20,
    };

    this.loadActivityLogs(query);
    this.loadActivityStats();

    this.snackBar.open('Activity logs refreshed', 'Close', {
      duration: 2000,
    });
  }
}
