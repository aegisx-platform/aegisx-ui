import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import {
  Subscription,
  debounceTime,
  distinctUntilChanged,
  skip,
  forkJoin,
} from 'rxjs';

import { FileUploadService } from './file-upload.service';
import {
  AttachmentService,
  AttachmentStatistics,
} from '../../../services/attachment.service';
import { ConfirmDialogComponent } from '../confirm-dialog.component';
import { AttachmentDetailsDialogComponent } from './attachment-details-dialog.component';
import {
  UploadedFile,
  FileListQuery,
  FILE_UPLOAD_LIMITS,
  isViewableMimeType,
} from './file-upload.types';

/**
 * Enhanced File with Attachment Information
 */
interface EnhancedFile extends UploadedFile {
  attachmentCount?: number;
  isLoadingAttachments?: boolean;
}

/**
 * File Management Component with Attachment Integration
 *
 * Features:
 * - Shows attachment count badges
 * - Displays "In Use" indicators
 * - Opens AttachmentDetailsDialog to show where files are used
 * - Prevents deletion of files that are attached to entities
 * - Warns users before deleting attached files
 */
@Component({
  selector: 'app-file-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatDividerModule,
    MatBadgeModule,
  ],
  template: `
    <div class="file-management-container">
      <!-- Header -->
      <div class="file-management-header">
        <div>
          <h2
            class="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1"
          >
            <mat-icon class="text-blue-600 dark:text-blue-400"
              >folder_open</mat-icon
            >
            <span>File Management</span>
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Manage uploaded files with attachment tracking
          </p>
        </div>
        <div class="header-actions">
          <button
            mat-icon-button
            (click)="refreshFiles()"
            [disabled]="isLoading()"
            matTooltip="Refresh files"
          >
            <mat-icon>refresh</mat-icon>
          </button>
          <button
            mat-icon-button
            [matMenuTriggerFor]="viewMenu"
            matTooltip="View options"
          >
            <mat-icon>view_module</mat-icon>
          </button>
          <mat-menu #viewMenu="matMenu">
            <button mat-menu-item (click)="toggleView('table')">
              <mat-icon>table_rows</mat-icon>
              Table View
            </button>
            <button mat-menu-item (click)="toggleView('grid')">
              <mat-icon>grid_view</mat-icon>
              Grid View
            </button>
          </mat-menu>
        </div>
      </div>

      <!-- File Statistics -->
      <div *ngIf="attachmentStats()" class="file-stats">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">Total Files</div>
            <div class="stat-value">{{ attachmentStats()!.totalFiles }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Files With Attachments</div>
            <div class="stat-value">
              {{ attachmentStats()!.filesWithAttachments }}
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Files Without Attachments</div>
            <div class="stat-value">
              {{ attachmentStats()!.filesWithoutAttachments }}
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Total Attachments</div>
            <div class="stat-value">
              {{ attachmentStats()!.totalAttachments }}
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="file-management-content">
        <!-- Filters and Search -->
        <form [formGroup]="filterForm" class="filter-form">
          <div class="filter-row">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Search files</mat-label>
              <input
                matInput
                formControlName="search"
                placeholder="Search by filename"
              />
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Category</mat-label>
              <mat-select formControlName="category">
                <mat-option value="">All Categories</mat-option>
                <mat-option
                  *ngFor="let category of availableCategories"
                  [value]="category"
                >
                  {{ category | titlecase }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>File Type</mat-label>
              <mat-select formControlName="type">
                <mat-option value="">All Types</mat-option>
                <mat-option value="image">Images</mat-option>
                <mat-option value="document">Documents</mat-option>
                <mat-option value="video">Videos</mat-option>
                <mat-option value="audio">Audio</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Usage Status</mat-label>
              <mat-select formControlName="attachmentStatus">
                <mat-option value="">All Files</mat-option>
                <mat-option value="attached">In Use</mat-option>
                <mat-option value="unattached">Not Used</mat-option>
              </mat-select>
            </mat-form-field>

            <button
              type="button"
              (click)="clearFilters()"
              [disabled]="!hasActiveFilters()"
              class="inline-flex items-center justify-center gap-2 px-4 h-14 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <mat-icon class="icon-size-5">clear</mat-icon>
              <span>Clear Filters</span>
            </button>
          </div>
        </form>

        <!-- Bulk Actions -->
        <div *ngIf="selectedFiles().length > 0" class="bulk-actions">
          <mat-chip-listbox>
            <mat-chip selected
              >{{ selectedFiles().length }} files selected</mat-chip
            >
          </mat-chip-listbox>
          <div class="bulk-action-buttons">
            <button mat-button (click)="bulkDelete()" color="warn">
              <mat-icon>delete</mat-icon>
              Delete Selected
            </button>
            <button mat-button (click)="bulkDownload()">
              <mat-icon>download</mat-icon>
              Download Selected
            </button>
          </div>
        </div>

        <!-- Loading Spinner -->
        <div *ngIf="isLoading()" class="loading-container">
          <mat-progress-spinner
            mode="indeterminate"
            diameter="50"
          ></mat-progress-spinner>
          <p>Loading files...</p>
        </div>

        <!-- Table View -->
        <div
          *ngIf="viewMode() === 'table' && !isLoading()"
          class="table-container"
        >
          <table
            mat-table
            [dataSource]="dataSource"
            matSort
            (matSortChange)="onSortChange($event)"
          >
            <!-- Selection Column -->
            <ng-container matColumnDef="select">
              <th mat-header-cell *matHeaderCellDef>
                <mat-checkbox
                  [checked]="isAllSelected()"
                  [indeterminate]="hasSelection() && !isAllSelected()"
                  (change)="toggleAllSelection()"
                >
                </mat-checkbox>
              </th>
              <td mat-cell *matCellDef="let file">
                <mat-checkbox
                  [checked]="isSelected(file)"
                  (change)="toggleSelection(file)"
                >
                </mat-checkbox>
              </td>
            </ng-container>

            <!-- Preview Column -->
            <ng-container matColumnDef="preview">
              <th mat-header-cell *matHeaderCellDef>Preview</th>
              <td mat-cell *matCellDef="let file">
                <div class="file-preview-cell">
                  <img
                    *ngIf="file.fileType === 'image'"
                    [src]="getDisplayThumbnailUrl(file)"
                    [alt]="file.originalName"
                    class="file-thumbnail"
                    loading="lazy"
                  />
                  <mat-icon
                    *ngIf="file.fileType !== 'image'"
                    class="file-type-icon"
                  >
                    {{ getFileIcon(file.mimeType) }}
                  </mat-icon>
                </div>
              </td>
            </ng-container>

            <!-- Name Column with Attachment Badge -->
            <ng-container matColumnDef="originalName">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
              <td mat-cell *matCellDef="let file">
                <div class="file-name-cell">
                  <div class="flex items-center gap-2">
                    <span class="file-name" [title]="file.originalName">{{
                      file.originalName
                    }}</span>

                    <!-- Attachment Count Badge -->
                    @if (
                      file.attachmentCount !== undefined &&
                      file.attachmentCount > 0
                    ) {
                      <button
                        mat-icon-button
                        class="attachment-badge-btn"
                        (click)="showAttachmentDetails(file)"
                        [matTooltip]="
                          'Used in ' + file.attachmentCount + ' place(s)'
                        "
                      >
                        <mat-icon
                          [matBadge]="file.attachmentCount"
                          matBadgeColor="primary"
                          matBadgeSize="small"
                          class="text-blue-600"
                        >
                          link
                        </mat-icon>
                      </button>
                    }
                  </div>

                  <div class="file-meta">
                    <mat-chip-set>
                      <mat-chip [class]="'category-' + file.fileCategory">{{
                        file.fileCategory
                      }}</mat-chip>

                      <!-- In Use Indicator -->
                      @if (
                        file.attachmentCount !== undefined &&
                        file.attachmentCount > 0
                      ) {
                        <mat-chip class="in-use-chip">
                          <mat-icon class="chip-icon">check_circle</mat-icon>
                          In Use
                        </mat-chip>
                      }

                      <mat-chip *ngIf="file.isPublic" class="public-chip"
                        >Public</mat-chip
                      >
                      <mat-chip *ngIf="file.isTemporary" class="temp-chip"
                        >Temporary</mat-chip
                      >
                    </mat-chip-set>
                  </div>
                </div>
              </td>
            </ng-container>

            <!-- Size Column -->
            <ng-container matColumnDef="fileSize">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Size</th>
              <td mat-cell *matCellDef="let file">
                {{ formatFileSize(file.fileSize) }}
              </td>
            </ng-container>

            <!-- Type Column -->
            <ng-container matColumnDef="mimeType">
              <th mat-header-cell *matHeaderCellDef>Type</th>
              <td mat-cell *matCellDef="let file">
                <span class="file-type" [title]="file.mimeType">{{
                  getFriendlyFileType(file.mimeType)
                }}</span>
              </td>
            </ng-container>

            <!-- Status Column -->
            <ng-container matColumnDef="processingStatus">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let file">
                <mat-chip [class]="'status-' + file.processingStatus">
                  <mat-icon *ngIf="file.processingStatus === 'completed'"
                    >check</mat-icon
                  >
                  <mat-icon *ngIf="file.processingStatus === 'processing'"
                    >hourglass_empty</mat-icon
                  >
                  <mat-icon *ngIf="file.processingStatus === 'failed'"
                    >error</mat-icon
                  >
                  {{ file.processingStatus | titlecase }}
                </mat-chip>
              </td>
            </ng-container>

            <!-- Upload Date Column -->
            <ng-container matColumnDef="uploadedAt">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>
                Uploaded
              </th>
              <td mat-cell *matCellDef="let file">
                {{ file.uploadedAt | date: 'short' }}
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let file">
                <button mat-icon-button [matMenuTriggerFor]="fileMenu">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #fileMenu="matMenu">
                  <button mat-menu-item (click)="downloadFile(file)">
                    <mat-icon>download</mat-icon>
                    Download
                  </button>
                  <button mat-menu-item (click)="viewFile(file)">
                    <mat-icon>visibility</mat-icon>
                    View
                  </button>
                  <button mat-menu-item (click)="copyLink(file)">
                    <mat-icon>link</mat-icon>
                    Copy Link
                  </button>

                  <!-- Show Attachment Details (if file is attached) -->
                  @if (
                    file.attachmentCount !== undefined &&
                    file.attachmentCount > 0
                  ) {
                    <button mat-menu-item (click)="showAttachmentDetails(file)">
                      <mat-icon>info</mat-icon>
                      View Usage ({{ file.attachmentCount }})
                    </button>
                  }

                  <mat-divider></mat-divider>
                  <button
                    mat-menu-item
                    (click)="deleteFile(file)"
                    class="delete-action"
                  >
                    <mat-icon>delete</mat-icon>
                    Delete
                    @if (
                      file.attachmentCount !== undefined &&
                      file.attachmentCount > 0
                    ) {
                      <mat-icon
                        class="ml-2 text-orange-600"
                        matTooltip="File is in use"
                        >warning</mat-icon
                      >
                    }
                  </button>
                </mat-menu>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>

          <!-- No Data Message -->
          <div *ngIf="files().length === 0" class="no-data">
            <mat-icon>folder_open</mat-icon>
            <h3>No files found</h3>
            <p>
              {{
                hasActiveFilters()
                  ? 'Try adjusting your filters'
                  : 'Upload some files to get started'
              }}
            </p>
          </div>
        </div>

        <!-- Grid View -->
        <div
          *ngIf="viewMode() === 'grid' && !isLoading()"
          class="grid-container"
        >
          <div class="file-grid">
            <div
              *ngFor="let file of files(); trackBy: trackByFileId"
              class="file-card"
              [class.selected]="isSelected(file)"
              [class.in-use]="file.attachmentCount && file.attachmentCount > 0"
            >
              <!-- Selection Checkbox -->
              <div class="card-selection">
                <mat-checkbox
                  [checked]="isSelected(file)"
                  (change)="toggleSelection(file)"
                >
                </mat-checkbox>
              </div>

              <!-- In Use Badge (top-right) -->
              @if (
                file.attachmentCount !== undefined && file.attachmentCount > 0
              ) {
                <div class="card-in-use-badge">
                  <mat-icon
                    [matBadge]="file.attachmentCount"
                    matBadgeColor="primary"
                    matBadgeSize="small"
                    class="text-blue-600"
                    matTooltip="Used in {{ file.attachmentCount }} place(s)"
                  >
                    link
                  </mat-icon>
                </div>
              }

              <!-- File Preview -->
              <div class="card-preview">
                <img
                  *ngIf="file.fileType === 'image'"
                  [src]="getDisplayThumbnailUrl(file)"
                  [alt]="file.originalName"
                  class="grid-thumbnail"
                  loading="lazy"
                />
                <div *ngIf="file.fileType !== 'image'" class="grid-file-icon">
                  <mat-icon>{{ getFileIcon(file.mimeType) }}</mat-icon>
                </div>
              </div>

              <!-- File Info -->
              <div class="card-info">
                <h4 class="card-title" [title]="file.originalName">
                  {{ file.originalName }}
                </h4>
                <p class="card-meta">
                  {{ formatFileSize(file.fileSize) }} •
                  {{ file.uploadedAt | date: 'short' }}
                </p>

                <div class="card-tags">
                  <mat-chip-set>
                    <mat-chip [class]="'category-' + file.fileCategory">{{
                      file.fileCategory
                    }}</mat-chip>

                    @if (
                      file.attachmentCount !== undefined &&
                      file.attachmentCount > 0
                    ) {
                      <mat-chip class="in-use-chip">
                        <mat-icon class="chip-icon">check_circle</mat-icon>
                        In Use
                      </mat-chip>
                    }

                    <mat-chip *ngIf="file.isPublic" class="public-chip"
                      >Public</mat-chip
                    >
                  </mat-chip-set>
                </div>
              </div>

              <!-- Actions -->
              <div class="card-actions">
                <button
                  mat-icon-button
                  (click)="downloadFile(file)"
                  matTooltip="Download"
                >
                  <mat-icon>download</mat-icon>
                </button>
                <button
                  mat-icon-button
                  (click)="viewFile(file)"
                  matTooltip="View"
                >
                  <mat-icon>visibility</mat-icon>
                </button>

                <!-- Show attachment details if file is in use -->
                @if (
                  file.attachmentCount !== undefined && file.attachmentCount > 0
                ) {
                  <button
                    mat-icon-button
                    (click)="showAttachmentDetails(file)"
                    matTooltip="View usage details"
                  >
                    <mat-icon class="text-blue-600">info</mat-icon>
                  </button>
                }

                <button
                  mat-icon-button
                  [matMenuTriggerFor]="cardMenu"
                  matTooltip="More options"
                >
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #cardMenu="matMenu">
                  <button mat-menu-item (click)="copyLink(file)">
                    <mat-icon>link</mat-icon>
                    Copy Link
                  </button>
                  <mat-divider></mat-divider>
                  <button
                    mat-menu-item
                    (click)="deleteFile(file)"
                    class="delete-action"
                  >
                    <mat-icon>delete</mat-icon>
                    Delete
                  </button>
                </mat-menu>
              </div>
            </div>
          </div>

          <!-- No Data Message -->
          <div *ngIf="files().length === 0" class="no-data">
            <mat-icon>folder_open</mat-icon>
            <h3>No files found</h3>
            <p>
              {{
                hasActiveFilters()
                  ? 'Try adjusting your filters'
                  : 'Upload some files to get started'
              }}
            </p>
          </div>
        </div>

        <!-- Pagination -->
        <mat-paginator
          *ngIf="!isLoading()"
          [length]="totalFiles()"
          [pageSize]="pageSize()"
          [pageIndex]="currentPage()"
          [pageSizeOptions]="[10, 25, 50, 100]"
          (page)="onPageChange($event)"
          showFirstLastButtons
        >
        </mat-paginator>
      </div>
    </div>
  `,
  styles: [
    `
      .file-management-container {
        width: 100%;
      }

      .file-management-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 1.5rem;
      }

      .file-management-content {
        /* Content wrapper */
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .file-stats {
        padding: 0 0 1.5rem 0;
        background: transparent;
        border-bottom: none;
        margin-bottom: 1rem;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1.5rem;
      }

      .stat-card {
        display: flex;
        flex-direction: column;
        padding: 1.5rem;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        transition: all 0.15s ease;
      }

      .stat-card:hover {
        box-shadow:
          0 1px 3px 0 rgba(0, 0, 0, 0.1),
          0 1px 2px -1px rgba(0, 0, 0, 0.1);
      }

      .stat-label {
        font-size: 0.875rem;
        font-weight: 500;
        color: #6b7280;
        line-height: 1.25rem;
        margin-bottom: 0.5rem;
      }

      .stat-value {
        font-size: 2rem;
        font-weight: 600;
        color: #111827;
        line-height: 1.25;
        letter-spacing: -0.02em;
        font-variant-numeric: tabular-nums;
      }

      /* Dark mode support */
      :host-context(.dark) .stat-card {
        background-color: #1f2937;
        border-color: #374151;
      }

      :host-context(.dark) .stat-card:hover {
        box-shadow:
          0 1px 3px 0 rgba(0, 0, 0, 0.3),
          0 1px 2px -1px rgba(0, 0, 0, 0.3);
      }

      :host-context(.dark) .stat-label {
        color: #9ca3af;
      }

      :host-context(.dark) .stat-value {
        color: #f9fafb;
      }

      .filter-form {
        margin-bottom: 1rem;
      }

      .filter-row {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1fr auto;
        gap: 1rem;
        align-items: center;
      }

      .search-field {
        min-width: 250px;
      }

      .bulk-actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        background-color: #e3f2fd;
        border-radius: 8px;
        margin-bottom: 1rem;
      }

      .bulk-action-buttons {
        display: flex;
        gap: 0.5rem;
      }

      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        gap: 1rem;
      }

      .table-container {
        overflow-x: auto;
      }

      .file-preview-cell {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
      }

      .file-thumbnail {
        width: 32px;
        height: 32px;
        object-fit: cover;
        border-radius: 4px;
      }

      .file-type-icon {
        color: #666;
      }

      .file-name-cell {
        max-width: 400px;
      }

      .file-name {
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: 500;
        margin-bottom: 0.25rem;
      }

      .file-meta {
        margin-top: 0.25rem;
      }

      .attachment-badge-btn {
        width: 32px;
        height: 32px;
      }

      .file-type {
        font-family: monospace;
        font-size: 0.875rem;
        color: #666;
      }

      .delete-action {
        color: #f44336 !important;
      }

      .no-data {
        text-align: center;
        padding: 3rem;
        color: #666;
      }

      .no-data mat-icon {
        font-size: 4rem;
        height: 4rem;
        width: 4rem;
        color: #ccc;
        margin-bottom: 1rem;
      }

      .grid-container {
        margin-top: 1rem;
      }

      .file-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1rem;
      }

      .file-card {
        border: 1px solid #e0e0e0;
        border-radius: 12px;
        overflow: hidden;
        background: white;
        transition: all 0.3s ease;
        position: relative;
      }

      .file-card:hover {
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        transform: translateY(-4px);
      }

      .file-card.selected {
        border-color: #2196f3;
        box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
      }

      .file-card.in-use {
        border-color: #4caf50;
      }

      .card-selection {
        position: absolute;
        top: 0.5rem;
        left: 0.5rem;
        z-index: 2;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 4px;
        padding: 0.25rem;
      }

      .card-in-use-badge {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        z-index: 2;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 50%;
        padding: 0.5rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .card-preview {
        height: 180px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        position: relative;
      }

      .grid-thumbnail {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .grid-file-icon {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .grid-file-icon mat-icon {
        font-size: 4rem;
        height: 4rem;
        width: 4rem;
        color: white;
      }

      .card-info {
        padding: 1rem;
      }

      .card-title {
        font-size: 1rem;
        font-weight: 500;
        margin: 0 0 0.5rem 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .card-meta {
        font-size: 0.875rem;
        color: #666;
        margin: 0 0 0.5rem 0;
      }

      .card-tags {
        margin-top: 0.5rem;
      }

      .card-actions {
        position: absolute;
        bottom: 0.5rem;
        right: 0.5rem;
        display: flex;
        gap: 0.25rem;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 8px;
        padding: 0.25rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .file-card:hover .card-actions {
        opacity: 1;
      }

      /* Chip Styles */
      .chip-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
        margin-right: 4px;
      }

      .in-use-chip {
        background-color: #4caf50 !important;
        color: white !important;
      }

      .category-image {
        background-color: #4caf50;
        color: white;
      }
      .category-document {
        background-color: #2196f3;
        color: white;
      }
      .category-avatar {
        background-color: #9c27b0;
        color: white;
      }
      .category-media {
        background-color: #ff9800;
        color: white;
      }
      .public-chip {
        background-color: #00bcd4;
        color: white;
      }
      .temp-chip {
        background-color: #ff5722;
        color: white;
      }
      .status-completed {
        background-color: #4caf50;
        color: white;
      }
      .status-processing {
        background-color: #ff9800;
        color: white;
      }
      .status-failed {
        background-color: #f44336;
        color: white;
      }

      /* Dark theme adjustments */
      :host-context(.dark) .file-stats {
        background: linear-gradient(135deg, #1a237e 0%, #4a148c 100%);
        border-color: #666;
      }

      :host-context(.dark) .stat-card {
        background-color: #424242;
        color: white;
      }

      :host-context(.dark) .stat-value {
        color: white;
      }

      :host-context(.dark) .bulk-actions {
        background-color: #1e3a5f;
      }

      :host-context(.dark) .file-card {
        background-color: #424242;
        border-color: #666;
      }

      :host-context(.dark) .card-preview {
        background: linear-gradient(135deg, #1a237e 0%, #4a148c 100%);
      }

      @media (max-width: 768px) {
        .filter-row {
          grid-template-columns: 1fr;
          gap: 0.5rem;
        }

        .bulk-actions {
          flex-direction: column;
          gap: 1rem;
          text-align: center;
        }

        .file-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class FileManagementComponent implements OnInit, OnDestroy {
  @Input() showStats = true;
  @Input() allowBulkActions = true;
  @Input() defaultPageSize = 25;

  @Output() fileSelected = new EventEmitter<UploadedFile>();
  @Output() filesDeleted = new EventEmitter<UploadedFile[]>();

  private fileUploadService = inject(FileUploadService);
  private attachmentService = inject(AttachmentService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);
  private subscription = new Subscription();

  // Signals
  private _files = signal<EnhancedFile[]>([]);
  private _isLoading = signal(false);
  private _currentPage = signal(0);
  private _pageSize = signal(this.defaultPageSize);
  private _totalFiles = signal(0);
  private _selectedFiles = signal<EnhancedFile[]>([]);
  private _viewMode = signal<'table' | 'grid'>('table');
  private _attachmentStats = signal<AttachmentStatistics | null>(null);

  readonly files = this._files.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly currentPage = this._currentPage.asReadonly();
  readonly pageSize = this._pageSize.asReadonly();
  readonly totalFiles = this._totalFiles.asReadonly();
  readonly selectedFiles = this._selectedFiles.asReadonly();
  readonly viewMode = this._viewMode.asReadonly();
  readonly attachmentStats = this._attachmentStats.asReadonly();

  readonly availableCategories = FILE_UPLOAD_LIMITS.ALLOWED_CATEGORIES;

  // Computed: Total files that have attachments
  readonly totalAttachedFiles = computed(() => {
    return this._files().filter(
      (f) => f.attachmentCount && f.attachmentCount > 0,
    ).length;
  });

  // Filter form (with new attachmentStatus filter)
  filterForm: FormGroup = this.fb.group({
    search: [''],
    category: [''],
    type: [''],
    isPublic: [''],
    attachmentStatus: [''], // New filter
    sort: ['uploadedAt'],
    order: ['desc'],
  });

  // Table configuration
  displayedColumns = [
    'select',
    'preview',
    'originalName',
    'fileSize',
    'mimeType',
    'processingStatus',
    'uploadedAt',
    'actions',
  ];
  dataSource = new MatTableDataSource<EnhancedFile>();

  // Computed properties
  readonly hasActiveFilters = computed(() => {
    const formValue = this.filterForm.value;
    return Object.values(formValue).some(
      (value) => value !== '' && value !== null && value !== undefined,
    );
  });

  readonly hasSelection = computed(() => this._selectedFiles().length > 0);
  readonly isAllSelected = computed(() => {
    const files = this._files();
    const selected = this._selectedFiles();
    return files.length > 0 && selected.length === files.length;
  });

  ngOnInit() {
    this.setupFilterSubscription();
    this.loadFiles();

    if (this.showStats) {
      this.loadFileStats();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private setupFilterSubscription() {
    this.subscription.add(
      this.filterForm.valueChanges
        .pipe(skip(1), debounceTime(300), distinctUntilChanged())
        .subscribe(() => {
          if (!this._isLoading()) {
            this._currentPage.set(0);
            this.loadFiles();
          }
        }),
    );
  }

  loadFiles() {
    this._isLoading.set(true);

    const formValue = this.filterForm.value;
    const attachmentStatusFilter = formValue.attachmentStatus;

    const query: FileListQuery = {
      page: this._currentPage() + 1,
      limit: this._pageSize(),
      search: formValue.search,
      category: formValue.category,
      type: formValue.type,
      isPublic: formValue.isPublic,
      sort: formValue.sort,
      order: formValue.order,
    };

    Object.keys(query).forEach((key) => {
      if (
        query[key as keyof FileListQuery] === '' ||
        query[key as keyof FileListQuery] == null
      ) {
        delete query[key as keyof FileListQuery];
      }
    });

    this.subscription.add(
      this.fileUploadService.getFiles(query).subscribe({
        next: (response) => {
          const files: EnhancedFile[] = response.data;

          // Load attachment counts for each file
          this.loadAttachmentCounts(files, attachmentStatusFilter);
        },
        error: (error) => {
          this.snackBar.open(
            'Failed to load files: ' + error.message,
            'Close',
            {
              duration: 5000,
            },
          );
          this._isLoading.set(false);
        },
      }),
    );
  }

  /**
   * Load attachment counts for all files
   */
  private loadAttachmentCounts(
    files: EnhancedFile[],
    attachmentStatusFilter?: string,
  ) {
    if (files.length === 0) {
      this._files.set([]);
      this._totalFiles.set(0);
      this.dataSource.data = [];
      this._isLoading.set(false);
      return;
    }

    // Create observable array for attachment count requests
    const countRequests = files.map((file) =>
      this.attachmentService.getAttachmentCountByFileId(file.id),
    );

    this.subscription.add(
      forkJoin(countRequests).subscribe({
        next: (counts) => {
          // Attach counts to files
          const enhancedFiles = files.map((file, index) => ({
            ...file,
            attachmentCount: counts[index],
            isLoadingAttachments: false,
          }));

          // Apply client-side attachment status filter
          let filteredFiles = enhancedFiles;
          if (attachmentStatusFilter === 'attached') {
            filteredFiles = enhancedFiles.filter(
              (f) => f.attachmentCount && f.attachmentCount > 0,
            );
          } else if (attachmentStatusFilter === 'unattached') {
            filteredFiles = enhancedFiles.filter(
              (f) => !f.attachmentCount || f.attachmentCount === 0,
            );
          }

          this._files.set(filteredFiles);
          this._totalFiles.set(filteredFiles.length);
          this.dataSource.data = filteredFiles;
          this._isLoading.set(false);
        },
        error: (error) => {
          console.error('Failed to load attachment counts:', error);

          // Fallback: Set counts to undefined
          const enhancedFiles = files.map((file) => ({
            ...file,
            attachmentCount: undefined,
            isLoadingAttachments: false,
          }));

          this._files.set(enhancedFiles);
          this._totalFiles.set(files.length);
          this.dataSource.data = enhancedFiles;
          this._isLoading.set(false);
        },
      }),
    );
  }

  loadFileStats() {
    console.log('[FileManagement] Loading attachment statistics...');
    this.subscription.add(
      this.attachmentService.getStatistics().subscribe({
        next: (stats) => {
          console.log('[FileManagement] Attachment statistics loaded:', stats);
          this._attachmentStats.set(stats);
        },
        error: (error) => {
          console.error(
            '[FileManagement] Failed to load attachment statistics:',
            error,
          );
          // Set default stats on error so cards are visible
          this._attachmentStats.set({
            totalFiles: 0,
            filesWithAttachments: 0,
            filesWithoutAttachments: 0,
            totalAttachments: 0,
          });
        },
      }),
    );
  }

  refreshFiles() {
    this.loadFiles();
    if (this.showStats) {
      this.loadFileStats();
    }
  }

  clearFilters() {
    this.filterForm.reset(
      {
        search: '',
        category: '',
        type: '',
        isPublic: '',
        attachmentStatus: '',
        sort: 'uploadedAt',
        order: 'desc',
      },
      { emitEvent: false },
    );

    this._currentPage.set(0);
    this.loadFiles();
  }

  toggleView(mode: 'table' | 'grid') {
    this._viewMode.set(mode);
  }

  onPageChange(event: PageEvent) {
    this._currentPage.set(event.pageIndex);
    this._pageSize.set(event.pageSize);
    this.loadFiles();
  }

  onSortChange(sort: Sort) {
    this.filterForm.patchValue(
      {
        sort: sort.active || 'uploadedAt',
        order: sort.direction || 'desc',
      },
      { emitEvent: false },
    );

    this._currentPage.set(0);
    this.loadFiles();
  }

  toggleSelection(file: EnhancedFile) {
    const selected = this._selectedFiles();
    const index = selected.findIndex((f) => f.id === file.id);

    if (index >= 0) {
      selected.splice(index, 1);
    } else {
      selected.push(file);
    }

    this._selectedFiles.set([...selected]);
  }

  toggleAllSelection() {
    if (this.isAllSelected()) {
      this._selectedFiles.set([]);
    } else {
      this._selectedFiles.set([...this._files()]);
    }
  }

  isSelected(file: EnhancedFile): boolean {
    return this._selectedFiles().some((f) => f.id === file.id);
  }

  /**
   * Show attachment details dialog
   */
  showAttachmentDetails(file: EnhancedFile) {
    // Fetch full attachment details
    this.subscription.add(
      this.attachmentService.getAttachmentsByFileId(file.id).subscribe({
        next: (attachments) => {
          this.dialog.open(AttachmentDetailsDialogComponent, {
            width: '600px',
            data: {
              fileName: file.originalName,
              fileId: file.id,
              attachments,
            },
          });
        },
        error: (error) => {
          this.snackBar.open(
            'Failed to load attachment details: ' + error.message,
            'Close',
            { duration: 5000 },
          );
        },
      }),
    );
  }

  downloadFile(file: EnhancedFile) {
    if (file.signedUrls?.download) {
      window.open(file.signedUrls.download, '_blank');
    } else {
      this.subscription.add(
        this.fileUploadService
          .generateSignedUrl(file.id, { expiresIn: 3600 })
          .subscribe({
            next: (response) => {
              window.open(response.data.urls.download, '_blank');
            },
            error: (error) => {
              this.snackBar.open(
                'Failed to generate download link: ' + error.message,
                'Close',
                { duration: 5000 },
              );
            },
          }),
      );
    }
  }

  viewFile(file: EnhancedFile) {
    const isViewable = isViewableMimeType(file.mimeType);

    if (!isViewable) {
      this.snackBar.open(
        `This file type (${file.mimeType}) cannot be previewed. Click Download to save the file.`,
        'Close',
        { duration: 5000 },
      );
      this.downloadFile(file);
      return;
    }

    if (file.signedUrls?.view) {
      window.open(file.signedUrls.view, '_blank');
    } else {
      this.subscription.add(
        this.fileUploadService
          .generateSignedUrl(file.id, { expiresIn: 3600 })
          .subscribe({
            next: (response) => {
              window.open(response.data.urls.view, '_blank');
            },
            error: (error) => {
              this.snackBar.open(
                'Failed to generate view link: ' + error.message,
                'Close',
                {
                  duration: 5000,
                },
              );
            },
          }),
      );
    }
    this.fileSelected.emit(file);
  }

  copyLink(file: EnhancedFile) {
    if (file.signedUrls?.download) {
      navigator.clipboard.writeText(file.signedUrls.download).then(() => {
        this.snackBar.open(
          'Signed download link copied to clipboard',
          'Close',
          {
            duration: 2000,
          },
        );
      });
    } else {
      this.subscription.add(
        this.fileUploadService
          .generateSignedUrl(file.id, { expiresIn: 86400 })
          .subscribe({
            next: (response) => {
              navigator.clipboard
                .writeText(response.data.urls.download)
                .then(() => {
                  this.snackBar.open(
                    'Signed download link copied to clipboard',
                    'Close',
                    {
                      duration: 2000,
                    },
                  );
                });
            },
            error: (error) => {
              this.snackBar.open(
                'Failed to generate shareable link: ' + error.message,
                'Close',
                { duration: 5000 },
              );
            },
          }),
      );
    }
  }

  /**
   * Delete file with attachment protection
   */
  deleteFile(file: EnhancedFile) {
    // Check if file is attached
    if (file.attachmentCount && file.attachmentCount > 0) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '500px',
        data: {
          title: 'Delete File In Use',
          message: `⚠️ This file is currently used in ${file.attachmentCount} place(s).\n\nDeleting this file will NOT remove the attachments, but the entities will lose access to this file.\n\nAre you sure you want to proceed?`,
          confirmText: 'Delete Anyway',
          cancelText: 'Cancel',
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.performDelete(file);
        }
      });
    } else {
      // File not attached, proceed with normal delete confirmation
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: {
          title: 'Delete File',
          message: `Are you sure you want to delete "${file.originalName}"? This action cannot be undone.`,
          confirmText: 'Delete',
          cancelText: 'Cancel',
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.performDelete(file);
        }
      });
    }
  }

  private performDelete(file: EnhancedFile) {
    this.subscription.add(
      this.fileUploadService.deleteFile(file.id).subscribe({
        next: () => {
          this.snackBar.open('File deleted successfully', 'Close', {
            duration: 3000,
          });
          this.refreshFiles();
          this.filesDeleted.emit([file]);
        },
        error: (error) => {
          this.snackBar.open(
            'Failed to delete file: ' + error.message,
            'Close',
            {
              duration: 5000,
            },
          );
        },
      }),
    );
  }

  bulkDelete() {
    const selected = this._selectedFiles();
    if (selected.length === 0) return;

    // Count attached files
    const attachedFiles = selected.filter(
      (f) => f.attachmentCount && f.attachmentCount > 0,
    );

    const message =
      attachedFiles.length > 0
        ? `⚠️ You are about to delete ${selected.length} files, including ${attachedFiles.length} file(s) that are currently in use.\n\nAre you sure you want to proceed?`
        : `Are you sure you want to delete ${selected.length} selected files? This action cannot be undone.`;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        title: 'Delete Files',
        message,
        confirmText: 'Delete All',
        cancelText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._isLoading.set(true);
        const deletePromises = selected.map((file) =>
          this.fileUploadService.deleteFile(file.id).toPromise(),
        );

        Promise.allSettled(deletePromises)
          .then(() => {
            this.snackBar.open(`Deleted ${selected.length} files`, 'Close', {
              duration: 3000,
            });
            this._selectedFiles.set([]);
            this.refreshFiles();
            this.filesDeleted.emit(selected);
          })
          .catch(() => {
            this.snackBar.open('Some files could not be deleted', 'Close', {
              duration: 5000,
            });
            this.refreshFiles();
          });
      }
    });
  }

  bulkDownload() {
    const selected = this._selectedFiles();
    selected.forEach((file) => {
      this.downloadFile(file);
    });
  }

  formatFileSize = this.fileUploadService.formatFileSize;

  /**
   * Convert mime type to friendly file type name
   */
  getFriendlyFileType(mimeType: string): string {
    const mimeTypeMap: Record<string, string> = {
      // Images
      'image/jpeg': 'JPEG Image',
      'image/jpg': 'JPEG Image',
      'image/png': 'PNG Image',
      'image/gif': 'GIF Image',
      'image/webp': 'WebP Image',
      'image/svg+xml': 'SVG Image',
      'image/bmp': 'BMP Image',
      'image/tiff': 'TIFF Image',

      // Documents
      'application/pdf': 'PDF',
      'application/msword': 'Word',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        'Word',
      'application/vnd.ms-excel': 'Excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        'Excel',
      'application/vnd.ms-powerpoint': 'PowerPoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        'PowerPoint',

      // Text
      'text/plain': 'Text',
      'text/csv': 'CSV',
      'text/html': 'HTML',
      'text/css': 'CSS',
      'text/javascript': 'JavaScript',

      // Archives
      'application/zip': 'ZIP',
      'application/x-rar-compressed': 'RAR',
      'application/x-7z-compressed': '7Z',
      'application/x-tar': 'TAR',
      'application/gzip': 'GZIP',

      // Others
      'application/json': 'JSON',
      'application/xml': 'XML',
      'video/mp4': 'MP4 Video',
      'video/avi': 'AVI Video',
      'audio/mpeg': 'MP3',
      'audio/wav': 'WAV',
    };

    // Return friendly name if exists
    if (mimeTypeMap[mimeType]) {
      return mimeTypeMap[mimeType];
    }

    // Fallback: Extract main type (e.g., "image" from "image/png")
    const mainType = mimeType.split('/')[0];
    const subType = mimeType.split('/')[1]?.toUpperCase() || '';

    switch (mainType) {
      case 'image':
        return `${subType} Image`;
      case 'video':
        return `${subType} Video`;
      case 'audio':
        return `${subType} Audio`;
      case 'text':
        return `${subType} Text`;
      case 'application':
        return subType || 'File';
      default:
        return mimeType;
    }
  }

  getFileIcon(mimeType: string): string {
    const category = this.fileUploadService.getFileTypeCategory(mimeType);

    switch (category) {
      case 'image':
        return 'image';
      case 'video':
        return 'videocam';
      case 'audio':
        return 'audiotrack';
      case 'pdf':
        return 'picture_as_pdf';
      case 'document':
        return 'description';
      case 'spreadsheet':
        return 'grid_on';
      case 'archive':
        return 'archive';
      default:
        return 'insert_drive_file';
    }
  }

  trackByFileId(index: number, file: EnhancedFile): string {
    return file.id;
  }

  getDisplayThumbnailUrl(file: EnhancedFile): string {
    if (file.signedUrls?.thumbnail) {
      return file.signedUrls.thumbnail;
    }
    return '';
  }
}
