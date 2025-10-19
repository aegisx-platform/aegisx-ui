import {
  Component,
  OnInit,
  computed,
  signal,
  inject,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Material imports for table
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { BookService } from '../services/books.service';
import { Book, ListBookQuery } from '../types/books.types';
import { BookCreateDialogComponent } from './books-create.dialog';
import {
  BookEditDialogComponent,
  BookEditDialogData,
} from './books-edit.dialog';
import {
  BookViewDialogComponent,
  BookViewDialogData,
} from './books-view.dialog';

@Component({
  selector: 'app-books-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCheckboxModule,
  ],
  template: `
    <div class="min-h-screen bg-gray-50 p-6">
      <div class="max-w-7xl mx-auto space-y-6">
        <!-- Simple Header -->
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900">Books</h1>
            <p class="text-sm text-gray-600 mt-1">
              Manage your book collection
            </p>
          </div>
          <button
            (click)="openCreateDialog()"
            [disabled]="
              booksService.loading() || booksService.permissionError()
            "
            class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Add book
          </button>
        </div>

        <!-- Permission Error -->
        @if (booksService.permissionError()) {
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <mat-icon class="text-red-600 !text-xl !w-5 !h-5">error</mat-icon>
              <div class="flex-1">
                <h3 class="text-sm font-medium text-red-900">Access Denied</h3>
                <p class="mt-1 text-sm text-red-700">
                  You don't have permission to access or modify books.
                </p>
              </div>
              <button
                (click)="booksService.clearPermissionError()"
                class="text-red-400 hover:text-red-600"
              >
                <mat-icon class="!text-xl !w-5 !h-5">close</mat-icon>
              </button>
            </div>
          </div>
        }

        <!-- Simple Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg border border-gray-200 p-5">
            <div class="text-sm text-gray-600 mb-2">Total Books</div>
            <div class="text-3xl font-semibold text-gray-900">
              {{ booksService.totalBook() }}
            </div>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 p-5">
            <div class="text-sm text-gray-600 mb-2">Available</div>
            <div class="text-3xl font-semibold text-gray-900">
              {{ getActiveCount() }}
            </div>
            <div class="text-sm text-gray-500 mt-1">
              {{ getPercentage(getActiveCount()) }}%
            </div>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 p-5">
            <div class="text-sm text-gray-600 mb-2">Unavailable</div>
            <div class="text-3xl font-semibold text-gray-900">
              {{ getDraftCount() }}
            </div>
            <div class="text-sm text-gray-500 mt-1">
              {{ getPercentage(getDraftCount()) }}%
            </div>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 p-5">
            <div class="text-sm text-gray-600 mb-2">This Week</div>
            <div class="text-3xl font-semibold text-gray-900">
              {{ getRecentCount() }}
            </div>
            <div class="text-sm text-gray-500 mt-1">Last 7 days</div>
          </div>
        </div>

        <!-- Search and Filters -->
        <div class="bg-white rounded-lg border border-gray-200">
          <div class="p-5 space-y-4">
            <!-- Search -->
            <div class="relative">
              <input
                type="text"
                [(ngModel)]="searchTerm"
                (input)="onSearchChange()"
                (keyup.enter)="onSearchButtonClick()"
                placeholder="Search books..."
                class="w-full px-3 py-2.5 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              @if (searchTerm) {
                <button
                  (click)="clearSearch()"
                  class="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <mat-icon class="!text-lg !w-5 !h-5">close</mat-icon>
                </button>
              }
            </div>

            <!-- Quick Filters -->
            <div class="flex items-center gap-2 flex-wrap">
              <button
                (click)="setQuickFilter('all')"
                [class]="
                  quickFilter === 'all'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                "
                class="px-3 py-2 text-sm font-medium rounded-md transition-colors"
              >
                All Books
              </button>
              <button
                (click)="setQuickFilter('active')"
                [class]="
                  quickFilter === 'active'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                "
                class="px-3 py-2 text-sm font-medium rounded-md transition-colors"
              >
                Available
              </button>
              <button
                (click)="setQuickFilter('published')"
                [class]="
                  quickFilter === 'published'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                "
                class="px-3 py-2 text-sm font-medium rounded-md transition-colors"
              >
                Published
              </button>
            </div>

            <!-- Active Filters -->
            @if (getActiveFilterChips().length > 0) {
              <div
                class="flex items-center gap-2 flex-wrap pt-4 border-t border-gray-200"
              >
                @for (chip of getActiveFilterChips(); track chip.key) {
                  <span
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm"
                  >
                    <span>{{ chip.label }}: {{ chip.value }}</span>
                    <button
                      (click)="removeFilter(chip.key)"
                      class="text-gray-500 hover:text-gray-700"
                    >
                      <mat-icon class="!text-sm !w-3.5 !h-3.5">close</mat-icon>
                    </button>
                  </span>
                }
                <button
                  (click)="clearAllFilters()"
                  class="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  Clear all
                </button>
              </div>
            }

            <!-- Advanced Filters Toggle -->
            <button
              (click)="showAdvancedFilters.set(!showAdvancedFilters())"
              class="text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1"
            >
              <mat-icon class="!text-base !w-4 !h-4">
                {{ showAdvancedFilters() ? 'expand_less' : 'expand_more' }}
              </mat-icon>
              Advanced filters
            </button>

            <!-- Advanced Filters -->
            @if (showAdvancedFilters()) {
              <div
                class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200"
              >
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Available</label
                  >
                  <select
                    [(ngModel)]="queryParams.available"
                    (change)="onFilterChange()"
                    class="w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option [ngValue]="undefined">All</option>
                    <option [ngValue]="true">Yes</option>
                    <option [ngValue]="false">No</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Genre</label
                  >
                  <input
                    type="text"
                    [(ngModel)]="queryParams.genre"
                    (input)="onFilterChange()"
                    placeholder="Filter by genre"
                    class="w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Loading State -->
        @if (booksService.loading()) {
          <div
            class="bg-white rounded-lg border border-gray-200 p-12 text-center"
          >
            <mat-spinner class="!mx-auto" [diameter]="40"></mat-spinner>
            <p class="text-sm text-gray-600 mt-4">Loading books...</p>
          </div>
        }

        <!-- Error State -->
        @else if (booksService.error()) {
          <div
            class="bg-white rounded-lg border border-gray-200 p-12 text-center"
          >
            <mat-icon class="!text-4xl !w-12 !h-12 text-red-600 mx-auto"
              >error_outline</mat-icon
            >
            <h3 class="text-lg font-medium text-gray-900 mt-4">
              Error Loading Books
            </h3>
            <p class="text-sm text-gray-600 mt-2">{{ booksService.error() }}</p>
            <button
              (click)="loadBooks()"
              class="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        }

        <!-- Books Table -->
        @else if (books().length > 0) {
          <div
            class="bg-white rounded-lg border border-gray-200 overflow-hidden"
          >
            <!-- Bulk Actions -->
            @if (selectedItems().length > 0) {
              <div
                class="bg-blue-50 border-b border-blue-200 px-5 py-3 flex items-center justify-between"
              >
                <span class="text-sm font-medium text-blue-900">
                  {{ selectedItems().length }} selected
                </span>
                <button
                  (click)="bulkDelete()"
                  class="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700"
                >
                  Delete selected
                </button>
              </div>
            }

            <!-- Table -->
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th class="px-5 py-3 text-left">
                      <input
                        type="checkbox"
                        [checked]="isAllSelected()"
                        (change)="toggleAllSelection()"
                        class="rounded border-gray-300"
                      />
                    </th>
                    <th
                      class="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Title
                    </th>
                    <th
                      class="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Author
                    </th>
                    <th
                      class="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      ISBN
                    </th>
                    <th
                      class="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Genre
                    </th>
                    <th
                      class="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Pages
                    </th>
                    <th
                      class="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      class="px-5 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  @for (book of books(); track book.id) {
                    <tr class="hover:bg-gray-50">
                      <td class="px-5 py-4">
                        <input
                          type="checkbox"
                          [checked]="isSelected(book.id)"
                          (change)="toggleSelection(book.id)"
                          class="rounded border-gray-300"
                        />
                      </td>
                      <td class="px-5 py-4">
                        <div class="text-sm font-semibold text-gray-900">
                          {{ book.title }}
                        </div>
                        @if (book.description) {
                          <div class="text-sm text-gray-500 mt-0.5">
                            {{ book.description | slice: 0 : 50 }}...
                          </div>
                        }
                      </td>
                      <td class="px-5 py-4 text-sm text-gray-900">
                        {{ book.author_id }}
                      </td>
                      <td class="px-5 py-4">
                        <span class="text-sm font-mono text-gray-600">{{
                          book.isbn
                        }}</span>
                      </td>
                      <td class="px-5 py-4">
                        @if (book.genre) {
                          <span
                            class="inline-flex px-2.5 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded"
                          >
                            {{ book.genre }}
                          </span>
                        }
                      </td>
                      <td class="px-5 py-4 text-sm text-gray-600">
                        {{ book.pages }}
                      </td>
                      <td class="px-5 py-4">
                        @if (book.available) {
                          <span
                            class="inline-flex items-center gap-1.5 px-2.5 py-1 text-sm font-medium text-green-700 bg-green-50 rounded"
                          >
                            <span
                              class="w-2 h-2 bg-green-600 rounded-full"
                            ></span>
                            Active
                          </span>
                        } @else {
                          <span
                            class="inline-flex items-center gap-1.5 px-2.5 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded"
                          >
                            <span
                              class="w-2 h-2 bg-gray-400 rounded-full"
                            ></span>
                            Inactive
                          </span>
                        }
                      </td>
                      <td class="px-5 py-4 text-right">
                        <div class="flex items-center justify-end gap-2">
                          <button
                            (click)="onViewBook(book)"
                            class="text-gray-600 hover:text-gray-900"
                            title="View"
                          >
                            <mat-icon class="!text-lg !w-5 !h-5"
                              >visibility</mat-icon
                            >
                          </button>
                          <button
                            (click)="onEditBook(book)"
                            class="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <mat-icon class="!text-lg !w-5 !h-5">edit</mat-icon>
                          </button>
                          <button
                            (click)="onDeleteBook(book)"
                            class="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <mat-icon class="!text-lg !w-5 !h-5"
                              >delete</mat-icon
                            >
                          </button>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div
              class="bg-white border-t border-gray-200 px-5 py-3 flex items-center justify-between"
            >
              <div class="flex items-center gap-4">
                <span class="text-sm text-gray-700">
                  Showing {{ pageIndex() * pageSize() + 1 }} to
                  {{
                    Math.min(
                      (pageIndex() + 1) * pageSize(),
                      booksService.totalBook()
                    )
                  }}
                  of {{ booksService.totalBook() }}
                </span>
                <select
                  [(ngModel)]="pageSizeValue"
                  (change)="onPageSizeChange()"
                  class="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option [value]="10">10 per page</option>
                  <option [value]="25">25 per page</option>
                  <option [value]="50">50 per page</option>
                  <option [value]="100">100 per page</option>
                </select>
              </div>

              <div class="flex items-center gap-2">
                <button
                  (click)="onPageChange(0)"
                  [disabled]="pageIndex() === 0"
                  class="px-2 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  First
                </button>
                <button
                  (click)="onPageChange(pageIndex() - 1)"
                  [disabled]="pageIndex() === 0"
                  class="px-2 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                @for (page of getPageNumbers(); track page) {
                  @if (page === '...') {
                    <span class="px-2 py-1 text-sm text-gray-500">...</span>
                  } @else {
                    <button
                      (click)="onPageChange(+page - 1)"
                      [class]="
                        pageIndex() === +page - 1
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      "
                      class="px-3 py-1 text-sm border rounded-md"
                    >
                      {{ page }}
                    </button>
                  }
                }

                <button
                  (click)="onPageChange(pageIndex() + 1)"
                  [disabled]="pageIndex() >= totalPages() - 1"
                  class="px-2 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
                <button
                  (click)="onPageChange(totalPages() - 1)"
                  [disabled]="pageIndex() >= totalPages() - 1"
                  class="px-2 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Last
                </button>
              </div>
            </div>
          </div>
        }

        <!-- Empty State -->
        @else {
          <div
            class="bg-white rounded-lg border border-gray-200 p-12 text-center"
          >
            <mat-icon class="!text-4xl !w-12 !h-12 text-gray-400 mx-auto"
              >menu_book</mat-icon
            >
            <h3 class="text-lg font-medium text-gray-900 mt-4">
              No books found
            </h3>
            <p class="text-sm text-gray-600 mt-2">
              @if (searchTerm || getActiveFilterChips().length > 0) {
                Try adjusting your search or filters
              } @else {
                Get started by adding your first book
              }
            </p>
            @if (searchTerm || getActiveFilterChips().length > 0) {
              <button
                (click)="clearAllFilters()"
                class="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                Clear filters
              </button>
            } @else {
              <button
                (click)="openCreateDialog()"
                class="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                Add your first book
              </button>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      /* Minimal custom styles - let Tailwind do the work */
      :host {
        display: block;
      }
    `,
  ],
})
export class BooksListComponent implements OnInit {
  booksService = inject(BookService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  books = computed(() => this.booksService.booksList());

  // Pagination
  pageIndex = signal(0);
  pageSize = signal(25);
  pageSizeValue = 25;
  totalPages = computed(() =>
    Math.ceil(this.booksService.totalBook() / this.pageSize()),
  );

  // Search & Filter
  searchTerm = '';
  quickFilter: 'all' | 'active' | 'published' = 'all';
  showAdvancedFilters = signal(false);

  queryParams: Partial<ListBookQuery> = {
    page: 1,
    limit: 25,
  };

  // Selection
  selectedIds = signal<Set<string>>(new Set());
  selectedItems = computed(() => {
    const ids = this.selectedIds();
    return this.books().filter((book) => ids.has(book.id));
  });

  Math = Math;

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.booksService.loadBookList(this.queryParams);
  }

  // Search Methods
  onSearchChange() {
    // Debounce logic here if needed
  }

  onSearchButtonClick() {
    this.queryParams.search = this.searchTerm || undefined;
    this.queryParams.page = 1;
    this.pageIndex.set(0);
    this.loadBooks();
  }

  clearSearch() {
    this.searchTerm = '';
    delete this.queryParams.search;
    this.queryParams.page = 1;
    this.pageIndex.set(0);
    this.loadBooks();
  }

  // Quick Filters
  setQuickFilter(filter: 'all' | 'active' | 'published') {
    this.quickFilter = filter;

    if (filter === 'all') {
      delete this.queryParams.available;
    } else if (filter === 'active') {
      this.queryParams.available = true;
    } else if (filter === 'published') {
      // Published filter maps to available = true for books
      this.queryParams.available = true;
    }

    this.queryParams.page = 1;
    this.pageIndex.set(0);
    this.loadBooks();
  }

  // Advanced Filters
  onFilterChange() {
    this.queryParams.page = 1;
    this.pageIndex.set(0);
    this.loadBooks();
  }

  // Filter Chips
  getActiveFilterChips(): Array<{ key: string; label: string; value: string }> {
    const chips: Array<{ key: string; label: string; value: string }> = [];

    if (this.queryParams.available !== undefined) {
      chips.push({
        key: 'available',
        label: 'Available',
        value: this.queryParams.available ? 'Yes' : 'No',
      });
    }

    if (this.queryParams.genre) {
      chips.push({
        key: 'genre',
        label: 'Genre',
        value: this.queryParams.genre,
      });
    }

    return chips;
  }

  removeFilter(key: string) {
    if (key === 'available') delete this.queryParams.available;
    if (key === 'genre') delete this.queryParams.genre;
    this.loadBooks();
  }

  clearAllFilters() {
    this.searchTerm = '';
    this.quickFilter = 'all';
    this.queryParams = {
      page: 1,
      limit: this.pageSize(),
    };
    this.pageIndex.set(0);
    this.loadBooks();
  }

  // Pagination
  onPageChange(page: number) {
    this.pageIndex.set(page);
    this.queryParams.page = page + 1;
    this.loadBooks();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onPageSizeChange() {
    this.pageSize.set(this.pageSizeValue);
    this.queryParams.limit = this.pageSizeValue;
    this.queryParams.page = 1;
    this.pageIndex.set(0);
    this.loadBooks();
  }

  getPageNumbers(): (number | string)[] {
    const total = this.totalPages();
    const current = this.pageIndex();
    const pages: (number | string)[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (current > 3) pages.push('...');

      const start = Math.max(2, current);
      const end = Math.min(total - 1, current + 2);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (current < total - 3) pages.push('...');

      pages.push(total);
    }

    return pages;
  }

  // Selection
  isSelected(id: string): boolean {
    return this.selectedIds().has(id);
  }

  toggleSelection(id: string) {
    const newSet = new Set(this.selectedIds());
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    this.selectedIds.set(newSet);
  }

  isAllSelected(): boolean {
    return (
      this.books().length > 0 &&
      this.books().every((book) => this.selectedIds().has(book.id))
    );
  }

  toggleAllSelection() {
    if (this.isAllSelected()) {
      this.selectedIds.set(new Set());
    } else {
      this.selectedIds.set(new Set(this.books().map((book) => book.id)));
    }
  }

  // CRUD Operations
  openCreateDialog() {
    const dialogRef = this.dialog.open(BookCreateDialogComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadBooks();
      }
    });
  }

  onViewBook(book: Book) {
    this.dialog.open(BookViewDialogComponent, {
      width: '600px',
      data: { books: book } as BookViewDialogData,
    });
  }

  onEditBook(book: Book) {
    const dialogRef = this.dialog.open(BookEditDialogComponent, {
      width: '600px',
      data: { books: book } as BookEditDialogData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadBooks();
      }
    });
  }

  async onDeleteBook(book: Book) {
    if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
      try {
        await this.booksService.deleteBook(book.id);
        this.snackBar.open('Book deleted successfully', 'Close', {
          duration: 3000,
        });
        this.loadBooks();
      } catch {
        this.snackBar.open('Failed to delete book', 'Close', {
          duration: 3000,
        });
      }
    }
  }

  async bulkDelete() {
    const count = this.selectedItems().length;
    if (confirm(`Are you sure you want to delete ${count} book(s)?`)) {
      try {
        const deletePromises = this.selectedItems().map((book) =>
          this.booksService.deleteBook(book.id),
        );

        await Promise.all(deletePromises);
        this.snackBar.open(`${count} book(s) deleted successfully`, 'Close', {
          duration: 3000,
        });
        this.selectedIds.set(new Set());
        this.loadBooks();
      } catch {
        this.snackBar.open('Failed to delete some books', 'Close', {
          duration: 3000,
        });
      }
    }
  }

  // Stats
  getActiveCount(): number {
    return this.books().filter((b) => b.available).length;
  }

  getDraftCount(): number {
    return this.books().filter((b) => !b.available).length;
  }

  getRecentCount(): number {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return this.books().filter((b) => new Date(b.created_at) >= oneWeekAgo)
      .length;
  }

  getPercentage(count: number): number {
    const total = this.booksService.totalBook();
    return total > 0 ? Math.round((count / total) * 100) : 0;
  }
}
