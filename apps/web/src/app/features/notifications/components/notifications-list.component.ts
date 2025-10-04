import {
  Component,
  OnInit,
  computed,
  signal,
  inject,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Angular Material imports
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';

import { NotificationService } from '../services/notifications.service';
import { DateRangeFilterComponent } from '../../../shared/components/date-range-filter/date-range-filter.component';
import {
  Notification,
  ListNotificationQuery,
} from '../types/notification.types';
import { NotificationCreateDialogComponent } from './notifications-create.dialog';
import {
  NotificationEditDialogComponent,
  NotificationEditDialogData,
} from './notifications-edit.dialog';
import {
  NotificationViewDialogComponent,
  NotificationViewDialogData,
} from './notifications-view.dialog';

@Component({
  selector: 'app-notifications-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatToolbarModule,
    MatSelectModule,
    MatOptionModule,
    MatChipsModule,
    MatExpansionModule,
    MatBadgeModule,
    DateRangeFilterComponent,
  ],
  template: `
    <div class="notifications-list-container">
      <!-- Header -->
      <mat-toolbar color="primary" class="page-header">
        <h1 class="page-title">🔔 Notifications Management</h1>
        <span class="spacer"></span>
        <div class="header-info">
          <span class="total-count"
            >{{ notificationsService.totalNotification() }} total</span
          >
        </div>
      </mat-toolbar>

      <!-- Quick Search Section -->
      <mat-card class="search-card">
        <mat-card-content>
          <div class="quick-search-container">
            <!-- Search Box -->
            <div class="search-wrapper">
              <mat-form-field appearance="outline" class="search-field">
                <mat-label
                  >Search notifications by title, message, or ID...</mat-label
                >
                <input
                  matInput
                  [(ngModel)]="searchTerm"
                  (input)="onSearchChange()"
                  (keyup.enter)="onSearchButtonClick()"
                />
                <mat-icon matPrefix>search</mat-icon>
              </mat-form-field>
              <button
                mat-raised-button
                color="primary"
                (click)="openCreateDialog()"
                class="add-btn"
              >
                <mat-icon>add</mat-icon>
                Add Notification
              </button>
            </div>

            <!-- Quick Access Filters -->
            <div class="quick-filters">
              <button
                mat-button
                [class.active]="quickFilter === 'all'"
                (click)="setQuickFilter('all')"
                class="filter-chip"
              >
                All
              </button>
              <button
                mat-button
                [class.active]="quickFilter === 'unread'"
                (click)="setQuickFilter('unread')"
                class="filter-chip"
              >
                Unread
                <mat-icon
                  matBadge="{{ getUnreadCount() }}"
                  matBadgeColor="accent"
                  matBadgeSize="small"
                  >notifications</mat-icon
                >
              </button>
              <button
                mat-button
                [class.active]="quickFilter === 'today'"
                (click)="setQuickFilter('today')"
                class="filter-chip"
              >
                Today
              </button>
              <button
                mat-button
                [class.active]="quickFilter === 'week'"
                (click)="setQuickFilter('week')"
                class="filter-chip"
              >
                This Week
              </button>
            </div>

            <!-- Active Filters Display -->
            <div class="active-filters" *ngIf="hasActiveFilters()">
              <span class="active-filters-label">Active Filters:</span>
              <mat-chip-set>
                <mat-chip
                  *ngFor="let filter of getActiveFilterChips()"
                  (removed)="removeFilter(filter.key)"
                  [removable]="true"
                >
                  {{ filter.label }}: {{ filter.value }}
                  <mat-icon matChipRemove>cancel</mat-icon>
                </mat-chip>
              </mat-chip-set>
              <button
                mat-button
                color="warn"
                (click)="clearAllFilters()"
                class="clear-all-btn"
              >
                Clear All
              </button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Advanced Filters -->
      <mat-card class="advanced-filters-card">
        <mat-expansion-panel class="advanced-panel">
          <mat-expansion-panel-header>
            <mat-panel-title>
              <mat-icon>tune</mat-icon>
              Advanced Filters
            </mat-panel-title>
            <mat-panel-description>
              Filter by specific criteria
            </mat-panel-description>
          </mat-expansion-panel-header>

          <div class="advanced-filters-content">
            <div class="filter-grid">
              <!-- Row 1: IDs -->
              <div class="filter-row">
                <div class="filter-group">
                  <label class="filter-label">Notification ID</label>
                  <mat-form-field appearance="outline" class="filter-field">
                    <mat-label>Enter notification ID</mat-label>
                    <input
                      matInput
                      type="text"
                      [(ngModel)]="filters().id"
                      (input)="applyFilters()"
                      [class.mat-form-field-invalid]="validationErrors()['id']"
                      placeholder="Optional: Filter by specific ID"
                    />
                    <mat-hint>Leave empty to show all</mat-hint>
                    <mat-error *ngIf="validationErrors()['id']">
                      {{ validationErrors()['id'] }}
                    </mat-error>
                  </mat-form-field>
                </div>

                <div class="filter-group">
                  <label class="filter-label">User ID / Email</label>
                  <mat-form-field appearance="outline" class="filter-field">
                    <mat-label>Search by user...</mat-label>
                    <input
                      matInput
                      type="text"
                      [(ngModel)]="filters().user_id"
                      (input)="applyFilters()"
                      [class.mat-form-field-invalid]="
                        validationErrors()['user_id']
                      "
                      placeholder="Start typing to search"
                    />
                    <mat-error *ngIf="validationErrors()['user_id']">
                      {{ validationErrors()['user_id'] }}
                    </mat-error>
                  </mat-form-field>
                </div>
              </div>

              <!-- Row 2: Type and Priority -->
              <div class="filter-row">
                <div class="filter-group">
                  <label class="filter-label"
                    >Notification Type <span class="required">*</span></label
                  >
                  <mat-form-field appearance="outline" class="filter-field">
                    <mat-label>-- Select Type --</mat-label>
                    <mat-select
                      [(ngModel)]="filters().type"
                      (selectionChange)="applyFilters()"
                    >
                      <mat-option value="">All Types</mat-option>
                      <mat-option value="info">Info</mat-option>
                      <mat-option value="warning">Warning</mat-option>
                      <mat-option value="error">Error</mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>

                <div class="filter-group">
                  <label class="filter-label">Priority</label>
                  <mat-form-field appearance="outline" class="filter-field">
                    <mat-label>Any priority</mat-label>
                    <mat-select
                      [(ngModel)]="filters().priority"
                      (selectionChange)="applyFilters()"
                    >
                      <mat-option value="">All Priorities</mat-option>
                      <mat-option value="low">Low</mat-option>
                      <mat-option value="normal">Normal</mat-option>
                      <mat-option value="high">High</mat-option>
                      <mat-option value="urgent">Urgent</mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>
              </div>

              <!-- Row 3: Message Content -->
              <div class="filter-row">
                <div class="filter-group full-width">
                  <label class="filter-label">Message Contains</label>
                  <mat-form-field appearance="outline" class="filter-field">
                    <mat-label>Search in message content...</mat-label>
                    <input
                      matInput
                      type="text"
                      [(ngModel)]="filters().message"
                      (input)="applyFilters()"
                    />
                  </mat-form-field>
                </div>
              </div>

              <!-- Date Filters Section -->
              <div class="date-filters-section">
                <h4 class="section-header">
                  <mat-icon>event</mat-icon>
                  Date Filters
                </h4>

                <div class="date-filters-grid">
                  <!-- Read At Filter -->
                  <div class="date-filter-group">
                    <label class="filter-label">Read Date</label>
                    <app-date-range-filter
                      fieldName="read_at"
                      label="Read Date"
                      [isDateTime]="true"
                      (filterChange)="onDateFilterChange($event)"
                    ></app-date-range-filter>
                  </div>

                  <!-- Archived At Filter -->
                  <div class="date-filter-group">
                    <label class="filter-label">Archived Date</label>
                    <app-date-range-filter
                      fieldName="archived_at"
                      label="Archived Date"
                      [isDateTime]="true"
                      (filterChange)="onDateFilterChange($event)"
                    ></app-date-range-filter>
                  </div>

                  <!-- Expires At Filter -->
                  <div class="date-filter-group">
                    <label class="filter-label">Expiration Date</label>
                    <app-date-range-filter
                      fieldName="expires_at"
                      label="Expiration Date"
                      [isDateTime]="true"
                      (filterChange)="onDateFilterChange($event)"
                    ></app-date-range-filter>
                  </div>

                  <!-- Created At Filter -->
                  <div class="date-filter-group">
                    <label class="filter-label">Created Date</label>
                    <app-date-range-filter
                      fieldName="created_at"
                      label="Created Date"
                      [isDateTime]="true"
                      (filterChange)="onDateFilterChange($event)"
                    ></app-date-range-filter>
                  </div>

                  <!-- Updated At Filter -->
                  <div class="date-filter-group">
                    <label class="filter-label">Updated Date</label>
                    <app-date-range-filter
                      fieldName="updated_at"
                      label="Updated Date"
                      [isDateTime]="true"
                      (filterChange)="onDateFilterChange($event)"
                    ></app-date-range-filter>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="filter-actions">
              <button
                mat-stroked-button
                (click)="resetFilters()"
                class="reset-btn"
              >
                Reset Filters
              </button>
              <button
                mat-raised-button
                color="primary"
                (click)="applyFiltersImmediate()"
                class="apply-btn"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </mat-expansion-panel>
      </mat-card>

      <!-- Loading State -->
      <div *ngIf="notificationsService.loading()" class="loading-container">
        <mat-progress-spinner
          mode="indeterminate"
          diameter="50"
        ></mat-progress-spinner>
        <p>Loading Notifications...</p>
      </div>

      <!-- Error State -->
      <mat-card *ngIf="notificationsService.error()" class="error-card">
        <mat-card-content>
          <div class="error-content">
            <mat-icon color="warn">error</mat-icon>
            <p>{{ notificationsService.error() }}</p>
            <button mat-button color="primary" (click)="retry()">
              <mat-icon>refresh</mat-icon>
              Retry
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Data Table -->
      <mat-card
        *ngIf="!notificationsService.loading() && !notificationsService.error()"
        class="table-card"
      >
        <mat-card-content>
          <!-- Bulk Actions -->
          <div *ngIf="hasSelected()" class="bulk-actions">
            <span class="selection-info"
              >{{ selectedItems().length }} selected</span
            >
            <div class="bulk-buttons">
              <button
                mat-stroked-button
                color="warn"
                (click)="bulkDelete()"
                [disabled]="notificationsService.loading()"
              >
                <mat-icon>delete</mat-icon>
                Delete Selected
              </button>
              <button mat-stroked-button (click)="clearSelection()">
                <mat-icon>clear</mat-icon>
                Clear Selection
              </button>
            </div>
          </div>

          <!-- Table -->
          <div class="table-container">
            <table
              mat-table
              [dataSource]="notificationsService.notificationsList()"
              class="notifications-table"
            >
              <!-- Selection Column -->
              <ng-container matColumnDef="select">
                <th mat-header-cell *matHeaderCellDef>
                  <mat-checkbox
                    [checked]="isAllSelected()"
                    [indeterminate]="hasSelected() && !isAllSelected()"
                    (change)="toggleSelectAll()"
                  ></mat-checkbox>
                </th>
                <td mat-cell *matCellDef="let notifications">
                  <mat-checkbox
                    [checked]="isSelected(notifications.id)"
                    (change)="toggleSelect(notifications.id)"
                  ></mat-checkbox>
                </td>
              </ng-container>

              <!-- user_id Column -->
              <ng-container matColumnDef="user_id">
                <th mat-header-cell *matHeaderCellDef>User Id</th>
                <td mat-cell *matCellDef="let notifications">
                  {{ notifications.user_id }}
                </td>
              </ng-container>

              <!-- type Column -->
              <ng-container matColumnDef="type">
                <th mat-header-cell *matHeaderCellDef>Type</th>
                <td mat-cell *matCellDef="let notifications">
                  {{ notifications.type }}
                </td>
              </ng-container>

              <!-- title Column -->
              <ng-container matColumnDef="title">
                <th mat-header-cell *matHeaderCellDef>Title</th>
                <td mat-cell *matCellDef="let notifications">
                  {{ notifications.title }}
                </td>
              </ng-container>

              <!-- message Column -->
              <ng-container matColumnDef="message">
                <th mat-header-cell *matHeaderCellDef>Message</th>
                <td mat-cell *matCellDef="let notifications">
                  <span [title]="notifications.message">
                    {{ notifications.message | slice: 0 : 50
                    }}<span *ngIf="notifications.message.length > 50">...</span>
                  </span>
                </td>
              </ng-container>

              <!-- data Column -->
              <ng-container matColumnDef="data">
                <th mat-header-cell *matHeaderCellDef>Data</th>
                <td mat-cell *matCellDef="let notifications">
                  {{ notifications.data }}
                </td>
              </ng-container>

              <!-- action_url Column -->
              <ng-container matColumnDef="action_url">
                <th mat-header-cell *matHeaderCellDef>Action Url</th>
                <td mat-cell *matCellDef="let notifications">
                  {{ notifications.action_url }}
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let notifications">
                  <button
                    mat-icon-button
                    (click)="openViewDialog(notifications)"
                    matTooltip="View Details"
                  >
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button
                    mat-icon-button
                    (click)="openEditDialog(notifications)"
                    matTooltip="Edit"
                  >
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button
                    mat-icon-button
                    color="warn"
                    (click)="deleteNotification(notifications)"
                    matTooltip="Delete"
                    [disabled]="notificationsService.loading()"
                  >
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
            </table>
          </div>

          <!-- Empty State -->
          <div
            *ngIf="notificationsService.notificationsList().length === 0"
            class="empty-state"
          >
            <mat-icon class="empty-icon">inbox</mat-icon>
            <h3>No Notifications found</h3>
            <p>Create your first Notifications to get started</p>
            <button
              mat-raised-button
              color="primary"
              (click)="openCreateDialog()"
            >
              <mat-icon>add</mat-icon>
              Add Notifications
            </button>
          </div>

          <!-- Pagination -->
          <mat-paginator
            *ngIf="notificationsService.notificationsList().length > 0"
            [length]="notificationsService.totalNotification()"
            [pageSize]="notificationsService.pageSize()"
            [pageSizeOptions]="[5, 10, 25, 50, 100]"
            [pageIndex]="notificationsService.currentPage() - 1"
            (page)="onPageChange($event)"
            showFirstLastButtons
          ></mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .notifications-list-container {
        padding: 16px;
        max-width: 1200px;
        margin: 0 auto;
      }

      .page-header {
        margin-bottom: 16px;
        border-radius: 4px;
      }

      .page-title {
        margin: 0;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .header-info {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .total-count {
        background-color: rgba(255, 255, 255, 0.2);
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 0.875rem;
      }

      .spacer {
        flex: 1 1 auto;
      }

      .search-card {
        margin-bottom: 16px;
      }

      /* Quick Search Styles */
      .quick-search-container {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .search-wrapper {
        display: flex;
        gap: 12px;
        align-items: flex-start;
      }

      .search-field {
        flex: 1;
        min-width: 300px;
      }

      .add-btn {
        height: 56px;
        padding: 0 24px;
        white-space: nowrap;
      }

      /* Quick Filters */
      .quick-filters {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .filter-chip {
        border-radius: 16px;
        text-transform: none;
        min-height: 36px;
        padding: 0 16px;
        border: 1px solid #e0e0e0;
      }

      .filter-chip.active {
        background-color: #1976d2;
        color: white;
        border-color: #1976d2;
      }

      .filter-chip mat-icon {
        margin-left: 8px;
        font-size: 18px;
      }

      /* Active Filters */
      .active-filters {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
        padding: 12px;
        background-color: #f5f5f5;
        border-radius: 8px;
      }

      .active-filters-label {
        font-weight: 500;
        color: #666;
        white-space: nowrap;
      }

      .clear-all-btn {
        margin-left: auto;
      }

      /* Advanced Filters */
      .advanced-filters-card {
        margin-bottom: 16px;
      }

      .advanced-panel {
        box-shadow: none;
      }

      .advanced-filters-content {
        padding: 16px 0;
      }

      .filter-grid {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .filter-row {
        display: flex;
        gap: 16px;
        align-items: flex-start;
      }

      .filter-group {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .filter-group.full-width {
        flex: 2;
      }

      .filter-label {
        font-weight: 500;
        color: #333;
        margin-bottom: 4px;
      }

      .filter-label .required {
        color: #f44336;
      }

      .filter-field {
        width: 100%;
      }

      .filter-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 24px;
        padding-top: 16px;
        border-top: 1px solid #e0e0e0;
      }

      .reset-btn {
        min-width: 120px;
      }

      .apply-btn {
        min-width: 120px;
      }

      .checkbox-filter {
        display: flex;
        align-items: center;
        min-width: 120px;
        margin: 8px 0;
      }

      /* Date Filters Styles */
      .date-filters-section {
        margin-top: 32px;
        padding-top: 24px;
        border-top: 1px solid #e0e0e0;
      }

      .section-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0 0 20px 0;
        font-size: 16px;
        font-weight: 500;
        color: #333;
      }

      .section-header mat-icon {
        color: #1976d2;
        font-size: 20px;
      }

      .date-filters-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 24px;
        align-items: start;
      }

      .date-filter-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .date-filter-group .filter-label {
        font-weight: 500;
        color: #333;
        margin-bottom: 8px;
      }

      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 40px;
      }

      .loading-container p {
        margin-top: 16px;
        color: #666;
      }

      .error-card {
        margin-bottom: 16px;
      }

      .error-content {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .error-content mat-icon {
        font-size: 24px;
      }

      .error-content p {
        flex: 1;
        margin: 0;
      }

      .table-card {
        margin-bottom: 16px;
      }

      .bulk-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 0;
        border-bottom: 1px solid #e0e0e0;
        margin-bottom: 16px;
      }

      .selection-info {
        font-weight: 500;
        color: #1976d2;
      }

      .bulk-buttons {
        display: flex;
        gap: 8px;
      }

      .table-container {
        overflow-x: auto;
      }

      .notifications-table {
        width: 100%;
        min-width: 600px;
      }

      .empty-state {
        text-align: center;
        padding: 40px;
      }

      .empty-icon {
        font-size: 48px;
        color: #ccc;
        margin-bottom: 16px;
      }

      .empty-state h3 {
        margin: 0 0 8px 0;
        color: #666;
      }

      .empty-state p {
        margin: 0 0 24px 0;
        color: #999;
      }

      @media (max-width: 768px) {
        .notifications-list-container {
          padding: 8px;
        }

        .search-wrapper {
          flex-direction: column;
          gap: 16px;
        }

        .search-field {
          min-width: unset;
        }

        .add-btn {
          height: auto;
          padding: 12px 16px;
        }

        .quick-filters {
          justify-content: center;
        }

        .filter-chip {
          flex: 1;
          min-width: 0;
          text-align: center;
        }

        .active-filters {
          flex-direction: column;
          align-items: stretch;
          gap: 8px;
        }

        .clear-all-btn {
          margin-left: 0;
          align-self: flex-end;
        }

        .filter-row {
          flex-direction: column;
          gap: 16px;
        }

        .filter-actions {
          flex-direction: column;
          gap: 8px;
        }

        .reset-btn,
        .apply-btn {
          width: 100%;
        }

        .bulk-actions {
          flex-direction: column;
          gap: 8px;
          align-items: stretch;
        }

        .bulk-buttons {
          justify-content: center;
        }

        .date-filters-grid {
          grid-template-columns: 1fr;
        }

        .date-filter-group {
          margin-bottom: 16px;
        }
      }
    `,
  ],
})
export class NotificationListComponent implements OnInit, OnDestroy {
  protected notificationsService = inject(NotificationService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  // Search and filtering
  searchTerm = '';
  private searchTimeout: any;
  private filterTimeout: any;

  private filtersSignal = signal<Partial<ListNotificationQuery>>({});
  readonly filters = this.filtersSignal.asReadonly();

  // Validation state
  private validationErrorsSignal = signal<Record<string, string>>({});
  readonly validationErrors = this.validationErrorsSignal.asReadonly();

  // Quick filter state
  protected quickFilter = 'all';

  // Selection
  private selectedIdsSignal = signal<Set<string>>(new Set());
  readonly selectedItems = computed(() => Array.from(this.selectedIdsSignal()));

  // Table configuration
  displayedColumns: string[] = [
    'select',
    'user_id',
    'type',
    'title',
    'message',
    'data',
    'action_url',
    'actions',
  ];

  ngOnInit() {
    this.loadNotifications();
  }

  ngOnDestroy() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }
  }

  // ===== DATA LOADING =====

  async loadNotifications() {
    const filters = this.filters();

    // Clean filters by removing null/undefined/empty values
    const cleanFilters: any = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        cleanFilters[key] = value;
      }
    });

    const params: ListNotificationQuery = {
      page: this.notificationsService.currentPage(),
      limit: this.notificationsService.pageSize(),
      ...cleanFilters,
    };

    if (this.searchTerm.trim()) {
      params.search = this.searchTerm.trim();
    }

    console.log('API Request Params:', params); // Debug log
    await this.notificationsService.loadNotificationList(params);
  }

  async retry() {
    this.notificationsService.clearError();
    await this.loadNotifications();
  }

  // ===== VALIDATION METHODS =====

  private isValidUuid(value: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }

  private validateTechnicalFields(): { field: string; message: string }[] {
    const errors: { field: string; message: string }[] = [];
    const filters = this.filters();

    // Validate UUID fields
    if (filters.id && !this.isValidUuid(filters.id as string)) {
      errors.push({
        field: 'id',
        message: 'Please enter a valid UUID format',
      });
    }

    if (filters.user_id && !this.isValidUuid(filters.user_id as string)) {
      errors.push({
        field: 'user_id',
        message: 'Please enter a valid UUID format',
      });
    }

    return errors;
  }

  private showFieldErrors(errors: { field: string; message: string }[]) {
    const errorMap: Record<string, string> = {};
    errors.forEach((error) => {
      errorMap[error.field] = error.message;
    });
    this.validationErrorsSignal.set(errorMap);

    // Show snackbar for user feedback
    if (errors.length > 0) {
      this.snackBar.open(
        'Please check your search criteria and try again',
        'Close',
        { duration: 3000, panelClass: ['error-snackbar'] },
      );
    }
  }

  private clearValidationErrors() {
    this.validationErrorsSignal.set({});
  }

  // ===== DATE FILTERING =====

  onDateFilterChange(dateFilter: { [key: string]: string | null | undefined }) {
    console.log('Date filter change:', dateFilter); // Debug log

    // Update filters with date filter values
    this.filtersSignal.update((filters) => ({
      ...filters,
      ...dateFilter,
    }));

    console.log('Updated filters:', this.filters()); // Debug log

    // Apply filters with debounce
    this.applyFilters();
  }

  // ===== SEARCH AND FILTERING =====

  onSearchChange() {
    // Debounce search for auto-search
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      this.notificationsService.setCurrentPage(1);
      this.loadNotifications();
    }, 300);
  }

  onSearchButtonClick() {
    // Manual search - validate before execution
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    // Validate technical fields first
    const validationErrors = this.validateTechnicalFields();

    if (validationErrors.length > 0) {
      this.showFieldErrors(validationErrors);
      return; // Don't proceed with search
    }

    // Clear any previous validation errors
    this.clearValidationErrors();

    this.notificationsService.setCurrentPage(1);
    this.loadNotifications();
  }

  clearSearch() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTerm = '';
    this.notificationsService.setCurrentPage(1);
    this.loadNotifications();
  }

  applyFilters() {
    // Debounce filter changes to prevent multiple API calls
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    this.filterTimeout = setTimeout(() => {
      this.notificationsService.setCurrentPage(1);
      this.loadNotifications();
    }, 300);
  }

  // Immediate filter application (for button clicks)
  applyFiltersImmediate() {
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    this.notificationsService.setCurrentPage(1);
    this.loadNotifications();
  }

  clearFilters() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    this.searchTerm = '';
    this.filtersSignal.set({});
    this.clearValidationErrors();
    this.notificationsService.setCurrentPage(1);
    this.loadNotifications();
  }

  hasActiveFilters(): boolean {
    return this.searchTerm.length > 0 || Object.keys(this.filters()).length > 0;
  }

  // ===== QUICK FILTERS =====

  protected setQuickFilter(filter: string) {
    // Clear any pending filter operations
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    this.quickFilter = filter;

    // Clear all filters first
    this.searchTerm = '';
    this.filtersSignal.set({});
    this.clearValidationErrors();

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    switch (filter) {
      case 'unread':
        this.filtersSignal.set({ read: false });
        break;
      case 'today':
        this.filtersSignal.set({
          created_at: today.toISOString().split('T')[0],
        });
        break;
      case 'week':
        this.filtersSignal.set({
          created_at: weekAgo.toISOString().split('T')[0],
        });
        break;
      case 'all':
      default:
        // Already cleared above
        break;
    }

    // Quick filters should apply immediately
    this.notificationsService.setCurrentPage(1);
    this.loadNotifications();
  }

  protected getUnreadCount(): number {
    // This would typically come from a service
    return 5; // Mock count
  }

  // ===== ACTIVE FILTER CHIPS =====

  protected getActiveFilterChips(): Array<{
    key: string;
    label: string;
    value: string;
  }> {
    const chips: Array<{ key: string; label: string; value: string }> = [];
    const filters = this.filters();

    // Add quick filter chip if not 'all'
    if (this.quickFilter !== 'all') {
      const quickFilterLabels: Record<string, string> = {
        unread: 'Status: Unread',
        today: 'Date: Today',
        week: 'Date: This Week',
      };
      chips.push({
        key: '_quickFilter',
        label: 'Quick Filter',
        value: quickFilterLabels[this.quickFilter] || this.quickFilter,
      });
    }

    if (this.searchTerm) {
      chips.push({ key: 'search', label: 'Search', value: this.searchTerm });
    }

    if (filters.type) {
      chips.push({
        key: 'type',
        label: 'Type',
        value: this.getTypeLabel(filters.type as string),
      });
    }

    if (filters.priority) {
      chips.push({
        key: 'priority',
        label: 'Priority',
        value: this.getPriorityLabel(filters.priority as string),
      });
    }

    // Don't show read status chip if it's from quick filter
    if (filters.read !== undefined && this.quickFilter === 'all') {
      chips.push({
        key: 'read',
        label: 'Status',
        value: filters.read ? 'Read' : 'Unread',
      });
    }

    if (filters.user_id) {
      chips.push({
        key: 'user_id',
        label: 'User',
        value: filters.user_id as string,
      });
    }

    if (filters.message) {
      chips.push({
        key: 'message',
        label: 'Message Contains',
        value: filters.message as string,
      });
    }

    // Don't show created_at chip if it's from quick filter
    if (filters.created_at && this.quickFilter === 'all') {
      chips.push({
        key: 'created_at',
        label: 'Date',
        value: filters.created_at as string,
      });
    }

    // Date range filters
    const dateFields = [
      { key: 'read_at', label: 'Read Date' },
      { key: 'archived_at', label: 'Archived Date' },
      { key: 'expires_at', label: 'Expiration Date' },
      { key: 'updated_at', label: 'Updated Date' },
    ];

    dateFields.forEach((field) => {
      // Check for exact date match
      if ((filters as any)[field.key]) {
        const dateValue = new Date(
          (filters as any)[field.key] as string,
        ).toLocaleDateString();
        chips.push({ key: field.key, label: field.label, value: dateValue });
      }

      // Check for date range
      const minKey = `${field.key}_min`;
      const maxKey = `${field.key}_max`;

      if ((filters as any)[minKey] || (filters as any)[maxKey]) {
        let rangeValue = '';
        if ((filters as any)[minKey] && (filters as any)[maxKey]) {
          const fromDate = new Date(
            (filters as any)[minKey] as string,
          ).toLocaleDateString();
          const toDate = new Date(
            (filters as any)[maxKey] as string,
          ).toLocaleDateString();
          rangeValue = `${fromDate} - ${toDate}`;
        } else if ((filters as any)[minKey]) {
          const fromDate = new Date(
            (filters as any)[minKey] as string,
          ).toLocaleDateString();
          rangeValue = `From ${fromDate}`;
        } else if ((filters as any)[maxKey]) {
          const toDate = new Date(
            (filters as any)[maxKey] as string,
          ).toLocaleDateString();
          rangeValue = `Until ${toDate}`;
        }

        if (rangeValue) {
          chips.push({
            key: `${field.key}_range`,
            label: `${field.label} Range`,
            value: rangeValue,
          });
        }
      }
    });

    return chips;
  }

  protected removeFilter(key: string) {
    // Clear any pending filter operations
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    if (key === '_quickFilter') {
      // Reset quick filter to 'all'
      this.setQuickFilter('all');
      return;
    }

    if (key === 'search') {
      this.searchTerm = '';
    } else if (key.endsWith('_range')) {
      // Handle date range filter removal
      const baseKey = key.replace('_range', '');
      this.filtersSignal.update((filters) => {
        const updated = { ...filters } as any;
        delete updated[`${baseKey}_min`];
        delete updated[`${baseKey}_max`];
        return updated;
      });
    } else {
      this.filtersSignal.update((filters) => {
        const updated = { ...filters } as any;
        delete updated[key];
        // Also remove related min/max fields if removing a date field
        if (key.includes('_at')) {
          delete updated[`${key}_min`];
          delete updated[`${key}_max`];
        }
        return updated;
      });
    }
    this.clearValidationErrors();
    this.notificationsService.setCurrentPage(1);
    this.loadNotifications();
  }

  protected clearAllFilters() {
    // Clear any pending filter operations
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    this.searchTerm = '';
    this.filtersSignal.set({});
    this.quickFilter = 'all';
    this.clearValidationErrors();
    this.notificationsService.setCurrentPage(1);
    this.loadNotifications();
  }

  protected resetFilters() {
    // Clear any pending filter operations
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    this.filtersSignal.set({});
    this.clearValidationErrors();

    // Reset filters should apply immediately
    this.notificationsService.setCurrentPage(1);
    this.loadNotifications();
  }

  // Helper methods for display labels
  private getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      info: 'Info',
      warning: 'Warning',
      error: 'Error',
    };
    return labels[type] || type;
  }

  private getPriorityLabel(priority: string): string {
    const labels: Record<string, string> = {
      low: 'Low',
      normal: 'Normal',
      high: 'High',
      urgent: 'Urgent',
    };
    return labels[priority] || priority;
  }

  // ===== PAGINATION =====

  onPageChange(event: PageEvent) {
    this.notificationsService.setCurrentPage(event.pageIndex + 1);
    this.notificationsService.setPageSize(event.pageSize);
    this.loadNotifications();
  }

  // ===== SELECTION =====

  isSelected(id: string): boolean {
    return this.selectedIdsSignal().has(id);
  }

  hasSelected(): boolean {
    return this.selectedIdsSignal().size > 0;
  }

  isAllSelected(): boolean {
    const total = this.notificationsService.notificationsList().length;
    return total > 0 && this.selectedIdsSignal().size === total;
  }

  toggleSelect(id: string) {
    this.selectedIdsSignal.update((selected) => {
      const newSet = new Set(selected);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }

  toggleSelectAll() {
    if (this.isAllSelected()) {
      this.selectedIdsSignal.set(new Set());
    } else {
      const allIds = this.notificationsService
        .notificationsList()
        .map((item) => item.id);
      this.selectedIdsSignal.set(new Set(allIds));
    }
  }

  clearSelection() {
    this.selectedIdsSignal.set(new Set());
  }

  // ===== DIALOG OPERATIONS =====

  openCreateDialog() {
    const dialogRef = this.dialog.open(NotificationCreateDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Refresh the list to show the new item
        this.loadNotifications();
      }
    });
  }

  openEditDialog(notifications: Notification) {
    const dialogRef = this.dialog.open(NotificationEditDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      disableClose: true,
      data: { notifications } as NotificationEditDialogData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // The service automatically updates the list with optimistic updates
        // No need to refresh unless there was an error
      }
    });
  }

  openViewDialog(notifications: Notification) {
    const dialogRef = this.dialog.open(NotificationViewDialogComponent, {
      width: '700px',
      maxWidth: '90vw',
      data: { notifications } as NotificationViewDialogData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.action === 'edit') {
        // User clicked edit from view dialog
        this.openEditDialog(result.data);
      }
    });
  }

  // ===== ACTIONS =====

  async deleteNotification(notifications: Notification) {
    if (confirm(`Are you sure you want to delete this notification?`)) {
      try {
        await this.notificationsService.deleteNotification(notifications.id);
        this.snackBar.open('Notification deleted successfully', 'Close', {
          duration: 3000,
        });
      } catch (error) {
        this.snackBar.open('Failed to delete notification', 'Close', {
          duration: 5000,
        });
      }
    }
  }

  async bulkDelete() {
    const selectedIds = Array.from(this.selectedIdsSignal());
    if (selectedIds.length === 0) return;

    const confirmed = confirm(
      `Are you sure you want to delete ${selectedIds.length} notifications?`,
    );
    if (!confirmed) return;

    try {
      await this.notificationsService.bulkDeleteNotification(selectedIds);
      this.clearSelection();
      this.snackBar.open(
        `${selectedIds.length} notifications deleted successfully`,
        'Close',
        {
          duration: 3000,
        },
      );
    } catch (error) {
      this.snackBar.open('Failed to delete notifications', 'Close', {
        duration: 5000,
      });
    }
  }
}
