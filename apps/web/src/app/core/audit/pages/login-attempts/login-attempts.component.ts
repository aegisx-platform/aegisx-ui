import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoginAttemptsService } from '../../services/login-attempts.service';
import { LoginAttempt, LoginAttemptsQuery } from '../../models/audit.types';

@Component({
  selector: 'app-login-attempts',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatTooltipModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Login Attempts</h1>
          <p class="text-sm text-gray-600 mt-1">
            Track and monitor login attempts
          </p>
        </div>
        <div class="flex gap-2">
          <button
            mat-raised-button
            color="primary"
            (click)="exportData()"
            [disabled]="loading()"
          >
            <mat-icon>download</mat-icon>
            Export
          </button>
          <button
            mat-raised-button
            color="warn"
            (click)="cleanupOldData()"
            [disabled]="loading()"
          >
            <mat-icon>delete_sweep</mat-icon>
            Cleanup
          </button>
          <button
            mat-icon-button
            (click)="refresh()"
            [disabled]="loading()"
            matTooltip="Refresh"
          >
            <mat-icon>refresh</mat-icon>
          </button>
        </div>
      </div>

      <!-- Filters -->
      <mat-card class="mb-4">
        <mat-card-content class="p-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Search</mat-label>
              <input
                matInput
                [(ngModel)]="searchQuery"
                (ngModelChange)="onSearchChange()"
                placeholder="Email or username"
              />
              <mat-icon matPrefix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Status</mat-label>
              <mat-select
                [(ngModel)]="statusFilter"
                (ngModelChange)="onFilterChange()"
              >
                <mat-option [value]="null">All</mat-option>
                <mat-option [value]="true">Success</mat-option>
                <mat-option [value]="false">Failed</mat-option>
              </mat-select>
            </mat-form-field>

            <button mat-raised-button (click)="clearFilters()" class="h-14">
              <mat-icon>clear</mat-icon>
              Clear Filters
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Loading Spinner -->
      <div *ngIf="loading()" class="flex justify-center items-center py-12">
        <mat-spinner diameter="50"></mat-spinner>
      </div>

      <!-- Error Message -->
      <mat-card *ngIf="error()" class="mb-4 bg-red-50">
        <mat-card-content class="p-4">
          <div class="flex items-center gap-2 text-red-800">
            <mat-icon>error</mat-icon>
            <span>{{ error() }}</span>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Table -->
      <mat-card *ngIf="!loading()">
        <div class="overflow-x-auto">
          <table mat-table [dataSource]="loginAttempts()" class="w-full">
            <!-- Timestamp Column -->
            <ng-container matColumnDef="timestamp">
              <th mat-header-cell *matHeaderCellDef class="font-semibold">
                Timestamp
              </th>
              <td mat-cell *matCellDef="let attempt" class="py-3">
                {{ formatDate(attempt.createdAt) }}
              </td>
            </ng-container>

            <!-- Email Column -->
            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef class="font-semibold">
                Email / Username
              </th>
              <td mat-cell *matCellDef="let attempt" class="py-3">
                <div class="flex flex-col">
                  <span class="font-medium">{{ attempt.email || 'N/A' }}</span>
                  <span class="text-xs text-gray-500" *ngIf="attempt.username">
                    {{ attempt.username }}
                  </span>
                </div>
              </td>
            </ng-container>

            <!-- Status Column -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef class="font-semibold">
                Status
              </th>
              <td mat-cell *matCellDef="let attempt" class="py-3">
                <mat-chip
                  [class]="
                    attempt.success
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  "
                >
                  {{ attempt.success ? 'Success' : 'Failed' }}
                </mat-chip>
              </td>
            </ng-container>

            <!-- Failure Reason Column -->
            <ng-container matColumnDef="failureReason">
              <th mat-header-cell *matHeaderCellDef class="font-semibold">
                Failure Reason
              </th>
              <td mat-cell *matCellDef="let attempt" class="py-3">
                <span
                  *ngIf="!attempt.success && attempt.failureReason"
                  class="text-sm"
                >
                  {{ formatFailureReason(attempt.failureReason) }}
                </span>
                <span *ngIf="attempt.success" class="text-gray-400">-</span>
              </td>
            </ng-container>

            <!-- IP Address Column -->
            <ng-container matColumnDef="ipAddress">
              <th mat-header-cell *matHeaderCellDef class="font-semibold">
                IP Address
              </th>
              <td mat-cell *matCellDef="let attempt" class="py-3">
                <code class="text-xs bg-gray-100 px-2 py-1 rounded">
                  {{ attempt.ipAddress }}
                </code>
              </td>
            </ng-container>

            <!-- User Agent Column -->
            <ng-container matColumnDef="userAgent">
              <th mat-header-cell *matHeaderCellDef class="font-semibold">
                User Agent
              </th>
              <td mat-cell *matCellDef="let attempt" class="py-3">
                <span
                  class="text-xs text-gray-600 truncate max-w-xs block"
                  [matTooltip]="attempt.userAgent || ''"
                >
                  {{ truncateUserAgent(attempt.userAgent) }}
                </span>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>

            <!-- No Data Row -->
            <tr class="mat-row" *matNoDataRow>
              <td
                class="mat-cell text-center py-8 text-gray-500"
                [attr.colspan]="displayedColumns.length"
              >
                <mat-icon class="text-5xl opacity-30 mb-2">inbox</mat-icon>
                <p>No login attempts found</p>
              </td>
            </tr>
          </table>
        </div>

        <!-- Paginator -->
        <mat-paginator
          [length]="totalItems()"
          [pageSize]="pageSize"
          [pageIndex]="currentPage() - 1"
          [pageSizeOptions]="[10, 25, 50, 100]"
          (page)="onPageChange($event)"
          showFirstLastButtons
        ></mat-paginator>
      </mat-card>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class LoginAttemptsComponent implements OnInit {
  private loginAttemptsService = inject(LoginAttemptsService);

  // Signals
  loginAttempts = this.loginAttemptsService.loginAttempts;
  loading = this.loginAttemptsService.loading;
  error = this.loginAttemptsService.error;
  pagination = this.loginAttemptsService.pagination;

  // Computed
  totalItems = computed(() => this.pagination()?.total || 0);
  currentPage = computed(() => this.pagination()?.page || 1);

  // Table configuration
  displayedColumns: string[] = [
    'timestamp',
    'email',
    'status',
    'failureReason',
    'ipAddress',
    'userAgent',
  ];

  // Filter state
  searchQuery = '';
  statusFilter: boolean | null = null;
  pageSize = 25;

  ngOnInit(): void {
    this.loadLoginAttempts();
  }

  loadLoginAttempts(): void {
    const query: LoginAttemptsQuery = {
      page: this.currentPage(),
      limit: this.pageSize,
    };

    if (this.searchQuery) {
      query.search = this.searchQuery;
    }

    if (this.statusFilter !== null) {
      query.success = this.statusFilter;
    }

    this.loginAttemptsService.getLoginAttempts(query).subscribe();
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    const query: LoginAttemptsQuery = {
      page: event.pageIndex + 1,
      limit: event.pageSize,
      search: this.searchQuery || undefined,
      success: this.statusFilter !== null ? this.statusFilter : undefined,
    };
    this.loginAttemptsService.getLoginAttempts(query).subscribe();
  }

  onSearchChange(): void {
    // Debounce would be better in production
    this.loadLoginAttempts();
  }

  onFilterChange(): void {
    this.loadLoginAttempts();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.statusFilter = null;
    this.loadLoginAttempts();
  }

  refresh(): void {
    this.loadLoginAttempts();
  }

  exportData(): void {
    const query: LoginAttemptsQuery = {
      search: this.searchQuery || undefined,
      success: this.statusFilter !== null ? this.statusFilter : undefined,
    };
    this.loginAttemptsService.exportAttempts(query).subscribe({
      next: () => {
        console.log('Export successful');
      },
      error: (error) => {
        console.error('Export failed:', error);
      },
    });
  }

  cleanupOldData(): void {
    const confirmed = confirm('Delete login attempts older than 30 days?');
    if (confirmed) {
      this.loginAttemptsService.cleanupAttempts({ days: 30 }).subscribe({
        next: (result) => {
          alert(`Successfully deleted ${result.deletedCount} login attempts`);
          this.loadLoginAttempts();
        },
        error: (error) => {
          alert(`Cleanup failed: ${error.message}`);
        },
      });
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString();
  }

  formatFailureReason(reason: string): string {
    return reason
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  truncateUserAgent(userAgent?: string): string {
    if (!userAgent) return 'N/A';
    return userAgent.length > 50
      ? userAgent.substring(0, 50) + '...'
      : userAgent;
  }
}
