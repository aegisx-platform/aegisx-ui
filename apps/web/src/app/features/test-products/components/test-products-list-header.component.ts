import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-test-products-list-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule],
  template: `
    <!-- Page Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Test Products
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Manage your test product collection
        </p>
      </div>

      <div class="flex gap-2">
        <!-- Import Button -->
        <button
          mat-stroked-button
          (click)="importClicked.emit()"
          [disabled]="loading || hasError"
        >
          <mat-icon>upload</mat-icon>
          <span>Import</span>
        </button>

        <!-- Add Product Button -->
        <button
          mat-flat-button
          color="primary"
          (click)="createClicked.emit()"
          [disabled]="loading || hasError"
        >
          <mat-icon>add</mat-icon>
          <span>Add Product</span>
        </button>
      </div>
    </div>

    <!-- Permission Error -->
    @if (permissionError) {
      <div
        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-2 mb-6"
      >
        <div class="flex items-start gap-3">
          <div
            class="flex items-center justify-center w-18 h-18 bg-red-100 dark:bg-red-900/50 rounded-full flex-shrink-0"
          >
            <mat-icon class="text-red-600 dark:text-red-400 !text-4xl !w-7 !h-7"
              >lock</mat-icon
            >
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-medium text-red-900 dark:text-red-300">
              Access Denied
            </h3>
            <p class="text-sm text-red-700 dark:text-red-400">
              You don't have permission to access or modify test_products.
            </p>
          </div>
          <button
            mat-icon-button
            color="warn"
            (click)="clearPermissionError.emit()"
          >
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>
    }

    <!-- Statistics Cards Grid -->
    @if (!hasError) {
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2 mb-4"
      >
        <!-- Total TestProducts Card -->
        <mat-card appearance="outlined">
          <mat-card-content>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Total TestProducts
            </p>
            <h3
              class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-2"
            >
              {{ stats.total }}
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
              <span>All products</span>
            </p>
          </mat-card-content>
        </mat-card>

        <!-- Available Card -->
        <mat-card appearance="outlined">
          <mat-card-content>
            <p class="text-sm text-gray-600 dark:text-gray-400">Available</p>
            <h3
              class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-2"
            >
              {{ stats.available }}
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
              <span>{{ getPercentage(stats.available) }}% available</span>
            </p>
          </mat-card-content>
        </mat-card>

        <!-- Unavailable Card -->
        <mat-card appearance="outlined">
          <mat-card-content>
            <p class="text-sm text-gray-600 dark:text-gray-400">Unavailable</p>
            <h3
              class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-2"
            >
              {{ stats.unavailable }}
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
              <span>{{ getPercentage(stats.unavailable) }}% unavailable</span>
            </p>
          </mat-card-content>
        </mat-card>

        <!-- This Week Card -->
        <mat-card appearance="outlined">
          <mat-card-content>
            <p class="text-sm text-gray-600 dark:text-gray-400">This Week</p>
            <h3
              class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-2"
            >
              {{ stats.recentWeek }}
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
              <span>New products</span>
            </p>
          </mat-card-content>
        </mat-card>
      </div>
    }
  `,
})
export class TestProductsListHeaderComponent {
  @Input({ required: true }) stats!: {
    total: number;
    available: number;
    unavailable: number;
    recentWeek: number;
  };
  @Input() loading = false;
  @Input() permissionError = false;
  @Input() hasError = false; // General error state (from service)

  @Output() createClicked = new EventEmitter<void>();
  @Output() importClicked = new EventEmitter<void>();
  @Output() clearPermissionError = new EventEmitter<void>();

  getPercentage(count: number): number {
    return this.stats.total > 0
      ? Math.round((count / this.stats.total) * 100)
      : 0;
  }
}
