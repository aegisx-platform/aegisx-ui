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
import { FileAuditService } from '../../services/file-audit.service';
import {
  FileAuditLog,
  FileAuditQuery,
  FileOperation,
} from '../../models/audit.types';

@Component({
  selector: 'app-file-audit',
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
          <h1 class="text-2xl font-bold text-gray-900">File Activity</h1>
          <p class="text-sm text-gray-600 mt-1">
            Track and monitor file operations
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
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Search</mat-label>
              <input
                matInput
                [(ngModel)]="searchQuery"
                (ngModelChange)="onSearchChange()"
                placeholder="File name"
              />
              <mat-icon matPrefix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Operation</mat-label>
              <mat-select
                [(ngModel)]="operationFilter"
                (ngModelChange)="onFilterChange()"
              >
                <mat-option [value]="null">All Operations</mat-option>
                <mat-option value="upload">Upload</mat-option>
                <mat-option value="download">Download</mat-option>
                <mat-option value="delete">Delete</mat-option>
                <mat-option value="view">View</mat-option>
                <mat-option value="update">Update</mat-option>
              </mat-select>
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
          <table mat-table [dataSource]="fileAuditLogs()" class="w-full">
            <!-- Timestamp Column -->
            <ng-container matColumnDef="timestamp">
              <th mat-header-cell *matHeaderCellDef class="font-semibold">
                Timestamp
              </th>
              <td mat-cell *matCellDef="let log" class="py-3">
                {{ formatDate(log.createdAt) }}
              </td>
            </ng-container>

            <!-- File Name Column -->
            <ng-container matColumnDef="fileName">
              <th mat-header-cell *matHeaderCellDef class="font-semibold">
                File Name
              </th>
              <td mat-cell *matCellDef="let log" class="py-3">
                <div class="flex items-center gap-2">
                  <mat-icon class="text-gray-500">description</mat-icon>
                  <span class="font-medium">{{ log.fileName }}</span>
                </div>
              </td>
            </ng-container>

            <!-- File Size Column -->
            <ng-container matColumnDef="fileSize">
              <th mat-header-cell *matHeaderCellDef class="font-semibold">
                Size
              </th>
              <td mat-cell *matCellDef="let log" class="py-3">
                <span class="text-sm">{{ formatFileSize(log.fileSize) }}</span>
              </td>
            </ng-container>

            <!-- Operation Column -->
            <ng-container matColumnDef="operation">
              <th mat-header-cell *matHeaderCellDef class="font-semibold">
                Operation
              </th>
              <td mat-cell *matCellDef="let log" class="py-3">
                <mat-chip [class]="getOperationColor(log.operation)">
                  {{ formatOperation(log.operation) }}
                </mat-chip>
              </td>
            </ng-container>

            <!-- Status Column -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef class="font-semibold">
                Status
              </th>
              <td mat-cell *matCellDef="let log" class="py-3">
                <mat-chip
                  [class]="
                    log.success
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  "
                >
                  {{ log.success ? 'Success' : 'Failed' }}
                </mat-chip>
              </td>
            </ng-container>

            <!-- IP Address Column -->
            <ng-container matColumnDef="ipAddress">
              <th mat-header-cell *matHeaderCellDef class="font-semibold">
                IP Address
              </th>
              <td mat-cell *matCellDef="let log" class="py-3">
                <code class="text-xs bg-gray-100 px-2 py-1 rounded">
                  {{ log.ipAddress }}
                </code>
              </td>
            </ng-container>

            <!-- Error Column -->
            <ng-container matColumnDef="error">
              <th mat-header-cell *matHeaderCellDef class="font-semibold">
                Error
              </th>
              <td mat-cell *matCellDef="let log" class="py-3">
                <span
                  *ngIf="!log.success && log.errorMessage"
                  class="text-xs text-red-600"
                  [matTooltip]="log.errorMessage"
                >
                  {{ truncateError(log.errorMessage) }}
                </span>
                <span *ngIf="log.success" class="text-gray-400">-</span>
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
                <mat-icon class="text-5xl opacity-30 mb-2"
                  >folder_open</mat-icon
                >
                <p>No file activity found</p>
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
export class FileAuditComponent implements OnInit {
  private fileAuditService = inject(FileAuditService);

  // Signals
  fileAuditLogs = this.fileAuditService.fileAuditLogs;
  loading = this.fileAuditService.loading;
  error = this.fileAuditService.error;
  pagination = this.fileAuditService.pagination;

  // Computed
  totalItems = computed(() => this.pagination()?.total || 0);
  currentPage = computed(() => this.pagination()?.page || 1);

  // Table configuration
  displayedColumns: string[] = [
    'timestamp',
    'fileName',
    'fileSize',
    'operation',
    'status',
    'ipAddress',
    'error',
  ];

  // Filter state
  searchQuery = '';
  operationFilter: FileOperation | null = null;
  statusFilter: boolean | null = null;
  pageSize = 25;

  ngOnInit(): void {
    this.loadFileAuditLogs();
  }

  loadFileAuditLogs(): void {
    const query: FileAuditQuery = {
      page: this.currentPage(),
      limit: this.pageSize,
    };

    if (this.searchQuery) {
      query.search = this.searchQuery;
    }

    if (this.operationFilter) {
      query.operation = this.operationFilter;
    }

    if (this.statusFilter !== null) {
      query.success = this.statusFilter;
    }

    this.fileAuditService.getFileAuditLogs(query).subscribe();
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    const query: FileAuditQuery = {
      page: event.pageIndex + 1,
      limit: event.pageSize,
      search: this.searchQuery || undefined,
      operation: this.operationFilter || undefined,
      success: this.statusFilter !== null ? this.statusFilter : undefined,
    };
    this.fileAuditService.getFileAuditLogs(query).subscribe();
  }

  onSearchChange(): void {
    this.loadFileAuditLogs();
  }

  onFilterChange(): void {
    this.loadFileAuditLogs();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.operationFilter = null;
    this.statusFilter = null;
    this.loadFileAuditLogs();
  }

  refresh(): void {
    this.loadFileAuditLogs();
  }

  exportData(): void {
    const query: FileAuditQuery = {
      search: this.searchQuery || undefined,
      operation: this.operationFilter || undefined,
      success: this.statusFilter !== null ? this.statusFilter : undefined,
    };
    this.fileAuditService.exportLogs(query).subscribe({
      next: () => {
        console.log('Export successful');
      },
      error: (error) => {
        console.error('Export failed:', error);
      },
    });
  }

  cleanupOldData(): void {
    const confirmed = confirm('Delete file audit logs older than 30 days?');
    if (confirmed) {
      this.fileAuditService.cleanupLogs({ days: 30 }).subscribe({
        next: (result) => {
          alert(`Successfully deleted ${result.deletedCount} file audit logs`);
          this.loadFileAuditLogs();
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

  formatFileSize(bytes?: number): string {
    if (!bytes) return 'N/A';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  formatOperation(operation: string): string {
    return operation.charAt(0).toUpperCase() + operation.slice(1);
  }

  getOperationColor(operation: string): string {
    const colors: Record<string, string> = {
      upload: 'bg-blue-100 text-blue-800',
      download: 'bg-green-100 text-green-800',
      delete: 'bg-red-100 text-red-800',
      view: 'bg-gray-100 text-gray-800',
      update: 'bg-yellow-100 text-yellow-800',
    };
    return colors[operation] || 'bg-gray-100 text-gray-800';
  }

  truncateError(error?: string): string {
    if (!error) return '';
    return error.length > 50 ? error.substring(0, 50) + '...' : error;
  }
}
