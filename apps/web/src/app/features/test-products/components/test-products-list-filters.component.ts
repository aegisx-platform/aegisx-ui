import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-test-products-list-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatBadgeModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  template: `
    <!-- ============================================
         Filters Panel
         ============================================ -->
    <mat-card appearance="outlined" class="mb-4">
      <mat-card-content>
        <!-- Quick Filters Section -->
        <div class="flex items-center justify-between gap-3 flex-wrap mb-4">
          <!-- Quick Filter Buttons -->
          <mat-button-toggle-group
            [value]="quickFilter"
            (change)="onQuickFilterChange($event.value)"
          >
            <mat-button-toggle value="all">All</mat-button-toggle>
            <mat-button-toggle value="active">Available</mat-button-toggle>
            <mat-button-toggle value="unavailable"
              >Unavailable</mat-button-toggle
            >
          </mat-button-toggle-group>

          <!-- Right Actions -->
          <div class="flex items-center gap-2 flex-wrap">
            <!-- Advanced Filters Toggle -->
            <button
              mat-stroked-button
              [color]="showAdvancedFilters() ? 'primary' : undefined"
              (click)="showAdvancedFilters.set(!showAdvancedFilters())"
            >
              <mat-icon>tune</mat-icon>
              Advanced Filters
              @if (activeFilterCount > 0) {
                <mat-icon
                  matBadge="{{ activeFilterCount }}"
                  matBadgeColor="primary"
                ></mat-icon>
              }
            </button>

            <!-- Export Button -->
            <ng-content select="[export]"></ng-content>

            <!-- Clear All (show when filters active) -->
            @if (activeFilterCount > 0) {
              <button mat-button color="warn" (click)="clearAllClicked.emit()">
                <mat-icon>clear</mat-icon>
                Clear
              </button>
            }
          </div>
        </div>

        <!-- Search & Refresh Section -->
        <div class="flex items-center gap-3">
          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>Search</mat-label>
            <input
              matInput
              type="text"
              [(ngModel)]="searchTerm"
              (keyup.enter)="onSearch()"
              placeholder="Search by ..."
              aria-label="Search test_products"
            />
            <mat-icon matPrefix>search</mat-icon>
            @if (searchTerm) {
              <button
                mat-icon-button
                matSuffix
                (click)="onClearSearch()"
                aria-label="Clear search"
                [disabled]="loading"
              >
                <mat-icon>close</mat-icon>
              </button>
            }
            @if (loading) {
              <mat-spinner
                matSuffix
                [diameter]="20"
                [strokeWidth]="3"
              ></mat-spinner>
            }
          </mat-form-field>
          <button
            mat-icon-button
            color="primary"
            (click)="onSearch()"
            [disabled]="loading"
            aria-label="Search"
            [matTooltip]="
              searchTerm.trim() ? 'Search test_products' : 'Enter search term'
            "
          >
            <mat-icon>search</mat-icon>
          </button>
          <button
            mat-icon-button
            (click)="refreshClicked.emit()"
            [disabled]="loading"
            aria-label="Refresh"
            [matTooltip]="loading ? 'Loading...' : 'Reload all test_products'"
          >
            <mat-icon>refresh</mat-icon>
          </button>
        </div>

        <!-- Active Filter Chips -->
        @if (activeFilterCount > 0) {
          <div class="mt-3 flex flex-wrap gap-2">
            <ng-content select="[filter-chips]"></ng-content>
          </div>
        }

        <!-- Advanced Filters Panel -->
        @if (showAdvancedFilters()) {
          <div class="mt-4 pt-4 border-t border-gray-200">
            <!-- Filter Fields Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Code Filter -->
              <mat-form-field appearance="outline">
                <mat-label>Code</mat-label>
                <input
                  matInput
                  [(ngModel)]="codeFilter"
                  (ngModelChange)="codeFilterChange.emit($event)"
                  (keyup.enter)="applyFiltersClicked.emit()"
                  placeholder="Enter code"
                />
              </mat-form-field>

              <!-- Name Filter -->
              <mat-form-field appearance="outline">
                <mat-label>Name</mat-label>
                <input
                  matInput
                  [(ngModel)]="nameFilter"
                  (ngModelChange)="nameFilterChange.emit($event)"
                  (keyup.enter)="applyFiltersClicked.emit()"
                  placeholder="Enter name"
                />
              </mat-form-field>

              <!-- Slug Filter -->
              <mat-form-field appearance="outline">
                <mat-label>Slug</mat-label>
                <input
                  matInput
                  [(ngModel)]="slugFilter"
                  (ngModelChange)="slugFilterChange.emit($event)"
                  (keyup.enter)="applyFiltersClicked.emit()"
                  placeholder="Enter slug"
                />
              </mat-form-field>

              <!-- Description Filter -->
              <mat-form-field appearance="outline">
                <mat-label>Description</mat-label>
                <input
                  matInput
                  [(ngModel)]="descriptionFilter"
                  (ngModelChange)="descriptionFilterChange.emit($event)"
                  (keyup.enter)="applyFiltersClicked.emit()"
                  placeholder="Enter description"
                />
              </mat-form-field>

              <!-- Status Filter -->
              <mat-form-field appearance="outline">
                <mat-label>Status</mat-label>
                <input
                  matInput
                  [(ngModel)]="statusFilter"
                  (ngModelChange)="statusFilterChange.emit($event)"
                  (keyup.enter)="applyFiltersClicked.emit()"
                  placeholder="Enter status"
                />
              </mat-form-field>

              <!-- Created By Filter -->
              <mat-form-field appearance="outline">
                <mat-label>Created By</mat-label>
                <input
                  matInput
                  [(ngModel)]="created_byFilter"
                  (ngModelChange)="created_byFilterChange.emit($event)"
                  (keyup.enter)="applyFiltersClicked.emit()"
                  placeholder="Enter created by"
                />
              </mat-form-field>

              <!-- Updated By Filter -->
              <mat-form-field appearance="outline">
                <mat-label>Updated By</mat-label>
                <input
                  matInput
                  [(ngModel)]="updated_byFilter"
                  (ngModelChange)="updated_byFilterChange.emit($event)"
                  (keyup.enter)="applyFiltersClicked.emit()"
                  placeholder="Enter updated by"
                />
              </mat-form-field>

              <!-- Is Active Filter -->
              <mat-form-field appearance="outline">
                <mat-label>Is Active</mat-label>
                <mat-select
                  [(ngModel)]="is_activeFilter"
                  (ngModelChange)="is_activeFilterChange.emit($event)"
                >
                  <mat-option [value]="undefined">All</mat-option>
                  <mat-option [value]="true">Yes</mat-option>
                  <mat-option [value]="false">No</mat-option>
                </mat-select>
              </mat-form-field>

              <!-- Is Featured Filter -->
              <mat-form-field appearance="outline">
                <mat-label>Is Featured</mat-label>
                <mat-select
                  [(ngModel)]="is_featuredFilter"
                  (ngModelChange)="is_featuredFilterChange.emit($event)"
                >
                  <mat-option [value]="undefined">All</mat-option>
                  <mat-option [value]="true">Yes</mat-option>
                  <mat-option [value]="false">No</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <!-- Apply Filters Actions -->
            <div class="mt-4 flex justify-end gap-2">
              <button mat-stroked-button (click)="clearAllClicked.emit()">
                Clear All
              </button>
              <button
                mat-flat-button
                color="primary"
                (click)="applyFiltersClicked.emit()"
                [disabled]="loading"
              >
                Apply Filters
              </button>
            </div>
          </div>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [],
})
export class TestProductsListFiltersComponent {
  @Input({ required: true }) activeFilterCount!: number;
  @Input() loading = false;

  // Two-way binding properties
  @Input() searchTerm = '';
  @Output() searchTermChange = new EventEmitter<string>();

  @Input() quickFilter: 'all' | 'active' | 'unavailable' = 'all';
  @Output() quickFilterChange = new EventEmitter<
    'all' | 'active' | 'unavailable'
  >();

  // Code filter
  @Input() codeFilter = '';
  @Output() codeFilterChange = new EventEmitter<string>();
  // Name filter
  @Input() nameFilter = '';
  @Output() nameFilterChange = new EventEmitter<string>();
  // Slug filter
  @Input() slugFilter = '';
  @Output() slugFilterChange = new EventEmitter<string>();
  // Description filter
  @Input() descriptionFilter = '';
  @Output() descriptionFilterChange = new EventEmitter<string>();
  // Status filter
  @Input() statusFilter = '';
  @Output() statusFilterChange = new EventEmitter<string>();
  // Created By filter
  @Input() created_byFilter = '';
  @Output() created_byFilterChange = new EventEmitter<string>();
  // Updated By filter
  @Input() updated_byFilter = '';
  @Output() updated_byFilterChange = new EventEmitter<string>();

  // Is Active filter
  @Input() is_activeFilter: boolean | undefined = undefined;
  @Output() is_activeFilterChange = new EventEmitter<boolean | undefined>();
  // Is Featured filter
  @Input() is_featuredFilter: boolean | undefined = undefined;
  @Output() is_featuredFilterChange = new EventEmitter<boolean | undefined>();

  // Event outputs
  @Output() searchClicked = new EventEmitter<void>();
  @Output() refreshClicked = new EventEmitter<void>();
  @Output() clearSearchClicked = new EventEmitter<void>();
  @Output() applyFiltersClicked = new EventEmitter<void>();
  @Output() clearAllClicked = new EventEmitter<void>();
  @Output() dateFilterChange = new EventEmitter<{
    [key: string]: string | null | undefined;
  }>();

  // UI state
  showAdvancedFilters = signal(false);

  onSearch() {
    this.searchTermChange.emit(this.searchTerm);
    this.searchClicked.emit();
  }

  onClearSearch() {
    this.searchTerm = '';
    this.searchTermChange.emit(this.searchTerm);
    this.clearSearchClicked.emit();
  }

  onQuickFilterChange(filter: 'all' | 'active' | 'unavailable') {
    this.quickFilter = filter;
    this.quickFilterChange.emit(filter);
  }

  onDateFilterChange(dateFilter: { [key: string]: string | null | undefined }) {
    this.dateFilterChange.emit(dateFilter);
  }
}
