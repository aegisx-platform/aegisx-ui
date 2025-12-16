import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy,
  ViewChild,
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { BreadcrumbComponent, BreadcrumbItem } from '@aegisx/ui';

import { ApiKeysService } from '../../services/api-keys.service';
import {
  ApiKeyWithPreview,
  ListApiKeysQuery,
} from '../../models/api-keys.types';
import { ConfirmDialogComponent } from '../../../../shared/ui/components/confirm-dialog.component';
import {
  API_KEYS_COLUMNS,
  API_KEY_STATUS_BADGE_STYLES,
  API_KEYS_PAGE_CONFIG,
  maskApiKey,
  getApiKeyStatus,
  formatDate,
  formatDateTime,
  getStatusBadgeStyle,
  isExpiringsoon,
} from '../../api-keys.config';

/**
 * API Keys List Page Component
 *
 * Displays a comprehensive list of API keys with:
 * - Statistics cards (total, active, expired, revoked)
 * - Advanced filtering (status, search by name)
 * - Server-side pagination and sorting
 * - Copy, revoke, and delete operations
 */
@Component({
  selector: 'app-api-keys-list',
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
    MatExpansionModule,
    MatMenuModule,
    BreadcrumbComponent,
    ConfirmDialogComponent,
  ],
  templateUrl: './api-keys-list.page.html',
  styleUrls: ['./api-keys-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiKeysListPage implements OnInit {
  private apiKeysService = inject(ApiKeysService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  // Configuration
  readonly API_KEYS_COLUMNS = API_KEYS_COLUMNS;
  readonly API_KEY_STATUS_BADGE_STYLES = API_KEY_STATUS_BADGE_STYLES;
  readonly pageConfig = API_KEYS_PAGE_CONFIG;

  // Table columns for mat-table
  displayedColumns: string[] = [
    'name',
    'preview',
    'status',
    'created_at',
    'expires_at',
    'actions',
  ];

  // Breadcrumb items
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Settings', url: '/settings', icon: 'settings' },
    {
      label: 'API Keys',
      url: '/settings/api-keys',
      icon: 'vpn_key',
    },
  ];

  // State signals from service
  keys = computed(() => this.apiKeysService.keys());
  loading = computed(() => this.apiKeysService.loading());
  error = computed(() => this.apiKeysService.error());
  totalKeys = computed(() => this.apiKeysService.totalKeys());
  activeKeysCount = computed(() => this.apiKeysService.activeKeys());

  // Local state signals
  pageIndex = signal<number>(0);
  pageSize = signal<number>(this.pageConfig.pageSize);
  sortBy = signal<string>('created_at');
  sortOrder = signal<string>('desc');

  // Filter form
  filterForm = new FormGroup({
    search: new FormControl<string>(''),
    status: new FormControl<string | null>(null),
  });

  // Computed signals for statistics
  expiredKeys = computed(() => {
    return this.keys().filter((k) => getApiKeyStatus(k) === 'expired').length;
  });

  revokedKeys = computed(() => {
    return this.keys().filter((k) => getApiKeyStatus(k) === 'revoked').length;
  });

  // Table data source
  dataSource = new MatTableDataSource<ApiKeyWithPreview>([]);

  ngOnInit(): void {
    this.loadKeys();
    // Watch keys signal and update datasource
    this.keys();
  }

  ngAfterViewInit(): void {
    // Note: We'll handle pagination and sorting manually for server-side operations
  }

  /**
   * Load API keys with current filters and pagination
   */
  loadKeys(query?: ListApiKeysQuery): void {
    const filterValue = this.filterForm.value;

    const finalQuery: ListApiKeysQuery = {
      ...query,
      limit: this.pageSize(),
      page: this.pageIndex() + 1, // Backend uses 1-based pagination
      search: filterValue.search || undefined,
      sortBy: this.sortBy() as any,
      sortOrder: (this.sortOrder() as 'asc' | 'desc') || 'desc',
    };

    // Remove undefined values
    Object.keys(finalQuery).forEach((key) => {
      if (
        finalQuery[key as keyof ListApiKeysQuery] === undefined ||
        finalQuery[key as keyof ListApiKeysQuery] === ''
      ) {
        delete finalQuery[key as keyof ListApiKeysQuery];
      }
    });

    this.apiKeysService.getMyKeys(finalQuery).subscribe({
      next: (result) => {
        this.dataSource.data = result.data;
      },
      error: (err) => {
        console.error('Failed to load API keys:', err);
        this.snackBar.open('Failed to load API keys', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  /**
   * Apply filters and reload data
   */
  applyFilters(): void {
    this.pageIndex.set(0);
    this.loadKeys();
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.filterForm.reset();
    this.pageIndex.set(0);
    this.sortBy.set('created_at');
    this.sortOrder.set('desc');
    this.loadKeys();
  }

  /**
   * Handle pagination change
   */
  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadKeys();
  }

  /**
   * Handle sort change
   */
  onSortChange(event: Sort): void {
    this.sortBy.set(event.active);
    this.sortOrder.set((event.direction || 'desc') as 'asc' | 'desc');
    this.pageIndex.set(0);
    this.loadKeys();
  }

  /**
   * Copy API key to clipboard
   */
  copyKey(key: ApiKeyWithPreview, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    // Note: In production, you'd likely show the full key in a secure dialog
    // For now, we'll copy the preview
    const textToCopy = key.preview || key.key_prefix;

    navigator.clipboard.writeText(textToCopy).then(() => {
      this.snackBar.open('API Key copied to clipboard', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar'],
      });
    });
  }

  /**
   * Revoke an API key with confirmation
   */
  revokeKey(key: ApiKeyWithPreview, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Revoke API Key?',
        message: `Are you sure you want to revoke "${key.name}"? This will immediately disable the key and cannot be undone.`,
        confirmText: 'Revoke',
        cancelText: 'Cancel',
        confirmColor: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;

      this.apiKeysService.revokeKey(key.id).subscribe({
        next: () => {
          this.snackBar.open('API Key revoked successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
          this.loadKeys();
        },
        error: (err) => {
          this.snackBar.open(`Failed to revoke key: ${err.message}`, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        },
      });
    });
  }

  /**
   * Delete an API key with confirmation
   */
  deleteKey(key: ApiKeyWithPreview, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete API Key?',
        message: `Are you sure you want to permanently delete "${key.name}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        confirmColor: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;

      this.apiKeysService.deleteKey(key.id).subscribe({
        next: () => {
          this.snackBar.open('API Key deleted successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
          this.loadKeys();
        },
        error: (err) => {
          this.snackBar.open(`Failed to delete key: ${err.message}`, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        },
      });
    });
  }

  /**
   * View API key details
   */
  viewKeyDetails(key: ApiKeyWithPreview, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    // Navigate to detail page if available, or show in dialog
    // this.router.navigate(['/settings/api-keys', key.id]);
    this.snackBar.open(`Key Details: ${key.name} (${key.id})`, 'Close', {
      duration: 5000,
    });
  }

  /**
   * Create new API key
   */
  createNewKey(): void {
    this.router.navigate(['/settings/api-keys/new']);
  }

  // Helper methods for template

  /**
   * Get API key status
   */
  getStatus(key: ApiKeyWithPreview): string {
    return getApiKeyStatus(key);
  }

  /**
   * Get status badge style
   */
  getStatusBadgeClass(key: ApiKeyWithPreview): string {
    const status = getApiKeyStatus(key);
    const styleConfig = getStatusBadgeStyle(status);
    return styleConfig.class;
  }

  /**
   * Get status badge icon
   */
  getStatusBadgeIcon(key: ApiKeyWithPreview): string {
    const status = getApiKeyStatus(key);
    const styleConfig = getStatusBadgeStyle(status);
    return styleConfig.icon;
  }

  /**
   * Mask API key for display
   */
  maskKey(preview: string): string {
    return maskApiKey(preview);
  }

  /**
   * Format date for display
   */
  formatDateDisplay(dateString: string | null | undefined): string {
    return formatDate(dateString);
  }

  /**
   * Check if key is expiring soon
   */
  isExpiringSoon(expiresAt: string | null | undefined): boolean {
    return isExpiringsoon(expiresAt);
  }
}
