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

// Minimal Material imports (icons only)
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { BookService } from '../services/books.service';
import { Book, ListBookQuery } from '../types/books.types';
import { BookCreateDialogComponent } from './books-create.dialog';
import { AuthorService } from '../../authors/services/authors.service';
import {
  BookEditDialogComponent,
  BookEditDialogData,
} from './books-edit.dialog';
import {
  BookViewDialogComponent,
  BookViewDialogData,
} from './books-view.dialog';

interface PageEvent {
  pageIndex: number;
  pageSize: number;
  length: number;
}

@Component({
  selector: 'app-books-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="min-h-screen bg-gray-50 p-6">
      <div class="max-w-7xl mx-auto space-y-6">
        <!-- Clean Header -->
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

        <!-- Permission Error Banner -->
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

        <!-- Enhanced Stats Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <!-- Total Books Card -->
          <div
            class="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-200 p-6 relative overflow-hidden"
          >
            <div
              class="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"
            ></div>
            <div class="relative">
              <div class="flex items-center justify-between mb-3">
                <div
                  class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg"
                >
                  <mat-icon class="text-white !text-xl !w-6 !h-6"
                    >library_books</mat-icon
                  >
                </div>
                <span
                  class="text-xs font-medium px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full"
                  >Total</span
                >
              </div>
              <div class="space-y-1">
                <h3 class="text-3xl font-bold text-slate-900">
                  {{ booksService.totalBook() }}
                </h3>
                <p class="text-sm font-medium text-slate-600">Total Books</p>
              </div>
            </div>
          </div>

          <!-- Available Card -->
          <div
            class="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-200 p-6 relative overflow-hidden"
          >
            <div
              class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"
            ></div>
            <div class="relative">
              <div class="flex items-center justify-between mb-3">
                <div
                  class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg"
                >
                  <mat-icon class="text-white !text-xl !w-6 !h-6"
                    >check_circle</mat-icon
                  >
                </div>
                <span
                  class="text-xs font-medium px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full"
                  >Active</span
                >
              </div>
              <div class="space-y-1">
                <h3 class="text-3xl font-bold text-slate-900">
                  {{ getActiveCount() }}
                </h3>
                <p class="text-sm font-medium text-slate-600">
                  Available Books
                </p>
                <div
                  class="flex items-center gap-1 text-xs text-emerald-600 mt-2"
                >
                  <mat-icon class="!text-sm !w-3 !h-3">trending_up</mat-icon>
                  <span class="font-medium"
                    >{{ getPercentage(getActiveCount()) }}%</span
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Unavailable Card -->
          <div
            class="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-200 p-6 relative overflow-hidden"
          >
            <div
              class="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"
            ></div>
            <div class="relative">
              <div class="flex items-center justify-between mb-3">
                <div
                  class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg"
                >
                  <mat-icon class="text-white !text-xl !w-6 !h-6"
                    >schedule</mat-icon
                  >
                </div>
                <span
                  class="text-xs font-medium px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full"
                  >Pending</span
                >
              </div>
              <div class="space-y-1">
                <h3 class="text-3xl font-bold text-slate-900">
                  {{ getDraftCount() }}
                </h3>
                <p class="text-sm font-medium text-slate-600">Unavailable</p>
                <div
                  class="flex items-center gap-1 text-xs text-amber-600 mt-2"
                >
                  <mat-icon class="!text-sm !w-3 !h-3">remove</mat-icon>
                  <span class="font-medium"
                    >{{ getPercentage(getDraftCount()) }}%</span
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Card -->
          <div
            class="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-200 p-6 relative overflow-hidden"
          >
            <div
              class="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"
            ></div>
            <div class="relative">
              <div class="flex items-center justify-between mb-3">
                <div
                  class="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg"
                >
                  <mat-icon class="text-white !text-xl !w-6 !h-6"
                    >auto_awesome</mat-icon
                  >
                </div>
                <span
                  class="text-xs font-medium px-2.5 py-1 bg-violet-50 text-violet-700 rounded-full"
                  >New</span
                >
              </div>
              <div class="space-y-1">
                <h3 class="text-3xl font-bold text-slate-900">
                  {{ getRecentCount() }}
                </h3>
                <p class="text-sm font-medium text-slate-600">
                  Added This Week
                </p>
                <div
                  class="flex items-center gap-1 text-xs text-violet-600 mt-2"
                >
                  <mat-icon class="!text-sm !w-3 !h-3">schedule</mat-icon>
                  <span class="font-medium">Last 7 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Search and Filters Card -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <!-- Search Bar with Icon -->
          <div class="mb-5">
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
              >
                <mat-icon class="text-slate-400 !text-xl !w-5 !h-5"
                  >search</mat-icon
                >
              </div>
              <input
                type="text"
                [(ngModel)]="searchTerm"
                (input)="onSearchChange()"
                (keyup.enter)="onSearchButtonClick()"
                placeholder="Search by title, author, ISBN, genre..."
                class="block w-full pl-12 pr-24 py-3.5 text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400 transition-all"
              />
              @if (searchTerm) {
                <button
                  (click)="clearSearch()"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <mat-icon class="!text-xl !w-5 !h-5">close</mat-icon>
                </button>
              }
            </div>
          </div>

          <!-- Quick Filter Pills -->
          <div class="flex items-center gap-2 mb-5 flex-wrap">
            <span class="text-sm font-medium text-slate-700 mr-2"
              >Quick filters:</span
            >
            <button
              (click)="setQuickFilter('all')"
              [class.active]="quickFilter === 'all'"
              class="filter-pill"
            >
              <mat-icon class="!text-base !w-4 !h-4">apps</mat-icon>
              <span>All Books</span>
            </button>
            <button
              (click)="setQuickFilter('active')"
              [class.active]="quickFilter === 'active'"
              class="filter-pill"
            >
              <mat-icon class="!text-base !w-4 !h-4">check_circle</mat-icon>
              <span>Available</span>
            </button>
            <button
              (click)="setQuickFilter('published')"
              [class.active]="quickFilter === 'published'"
              class="filter-pill"
            >
              <mat-icon class="!text-base !w-4 !h-4">publish</mat-icon>
              <span>Published</span>
            </button>
          </div>

          <!-- Active Filter Tags -->
          @if (getActiveFilterChips().length > 0) {
            <div
              class="flex items-center gap-2 flex-wrap p-4 bg-blue-50 rounded-xl border border-blue-100"
            >
              <mat-icon class="text-blue-600 !text-base !w-4 !h-4"
                >filter_list</mat-icon
              >
              <span class="text-sm font-medium text-blue-900"
                >Active filters:</span
              >
              @for (chip of getActiveFilterChips(); track chip.key) {
                <span
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-200 text-blue-900 rounded-lg text-xs font-medium shadow-sm"
                >
                  <span class="font-semibold">{{ chip.label }}</span>
                  <span class="text-blue-700">{{ chip.value }}</span>
                  <button
                    (click)="removeFilter(chip.key)"
                    class="ml-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded p-0.5 transition-colors"
                  >
                    <mat-icon class="!text-sm !w-3.5 !h-3.5">close</mat-icon>
                  </button>
                </span>
              }
              <button
                (click)="clearAllFilters()"
                class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-lg transition-all"
              >
                <mat-icon class="!text-sm !w-3.5 !h-3.5">clear_all</mat-icon>
                Clear all
              </button>
            </div>
          }

          <!-- Advanced Filters Toggle -->
          <button
            (click)="showAdvancedFilters.set(!showAdvancedFilters())"
            class="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all border border-slate-200"
          >
            <mat-icon class="!text-base !w-4 !h-4">{{
              showAdvancedFilters() ? 'expand_less' : 'tune'
            }}</mat-icon>
            <span
              >{{ showAdvancedFilters() ? 'Hide' : 'Show' }} Advanced
              Filters</span
            >
          </button>

          <!-- Advanced Filters Panel -->
          @if (showAdvancedFilters()) {
            <div class="mt-5 pt-5 border-t border-slate-200">
              <div
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                <!-- Available Filter -->
                <div class="space-y-2">
                  <label
                    class="block text-xs font-semibold text-slate-700 uppercase tracking-wide"
                    >Availability</label
                  >
                  <select
                    [(ngModel)]="tempFilters['available']"
                    class="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                  >
                    <option value="">All Status</option>
                    <option value="true">Available</option>
                    <option value="false">Unavailable</option>
                  </select>
                </div>

                <!-- Author Filter -->
                <div class="space-y-2">
                  <label
                    class="block text-xs font-semibold text-slate-700 uppercase tracking-wide"
                    >Author</label
                  >
                  <select
                    [(ngModel)]="tempFilters['author_id']"
                    [disabled]="loadingAuthor()"
                    class="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-slate-50 disabled:cursor-not-allowed transition-all"
                  >
                    <option value="">All Authors</option>
                    @if (loadingAuthor()) {
                      <option disabled>Loading authors...</option>
                    }
                    @for (author of authorOptions(); track author.value) {
                      <option [value]="author.value">{{ author.label }}</option>
                    }
                  </select>
                </div>

                <!-- Title Filter -->
                <div class="space-y-2">
                  <label
                    class="block text-xs font-semibold text-slate-700 uppercase tracking-wide"
                    >Title</label
                  >
                  <input
                    type="text"
                    [(ngModel)]="tempFilters['title']"
                    placeholder="Filter by title"
                    class="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                  />
                </div>

                <!-- ISBN Filter -->
                <div class="space-y-2">
                  <label
                    class="block text-xs font-semibold text-slate-700 uppercase tracking-wide"
                    >ISBN</label
                  >
                  <input
                    type="text"
                    [(ngModel)]="tempFilters['isbn']"
                    placeholder="Filter by ISBN"
                    class="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                  />
                </div>

                <!-- Genre Filter -->
                <div class="space-y-2">
                  <label
                    class="block text-xs font-semibold text-slate-700 uppercase tracking-wide"
                    >Genre</label
                  >
                  <input
                    type="text"
                    [(ngModel)]="tempFilters['genre']"
                    placeholder="Filter by genre"
                    class="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                  />
                </div>
              </div>

              <!-- Filter Actions -->
              <div
                class="flex items-center gap-3 justify-end mt-5 pt-5 border-t border-slate-200"
              >
                <button
                  (click)="resetFilters()"
                  class="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                >
                  Reset Filters
                </button>
                <button
                  (click)="applyAdvancedFilters()"
                  class="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm hover:shadow-md"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          }
        </div>

        <!-- Loading State -->
        @if (booksService.loading()) {
          <div
            class="bg-white rounded-xl shadow-sm border border-slate-200 p-16"
          >
            <div class="flex flex-col items-center justify-center gap-6">
              <div class="relative">
                <div
                  class="w-20 h-20 rounded-full border-4 border-blue-100"
                ></div>
                <mat-progress-spinner
                  class="absolute inset-0"
                  mode="indeterminate"
                  diameter="80"
                  strokeWidth="4"
                ></mat-progress-spinner>
              </div>
              <div class="text-center">
                <p class="text-lg font-semibold text-slate-900">
                  Loading your books...
                </p>
                <p class="text-sm text-slate-500 mt-1">Please wait a moment</p>
              </div>
            </div>
          </div>
        }

        <!-- Error State -->
        @if (booksService.error() && !booksService.loading()) {
          <div
            class="bg-white rounded-xl shadow-sm border border-rose-200 p-12"
          >
            <div
              class="flex flex-col items-center justify-center gap-6 text-center max-w-md mx-auto"
            >
              <div
                class="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center"
              >
                <mat-icon class="text-rose-600 !text-5xl !w-12 !h-12"
                  >error_outline</mat-icon
                >
              </div>
              <div>
                <h3 class="text-xl font-bold text-slate-900">
                  Oops! Something went wrong
                </h3>
                <p class="mt-2 text-sm text-slate-600 leading-relaxed">
                  {{ booksService.error() }}
                </p>
              </div>
              <button
                (click)="retry()"
                class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold text-sm shadow-lg hover:shadow-xl hover:scale-105 transform"
              >
                <mat-icon class="!text-lg !w-5 !h-5">refresh</mat-icon>
                <span>Try Again</span>
              </button>
            </div>
          </div>
        }

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Total Books -->
          <div
            class="bg-white rounded-xl shadow-sm border border-slate-200 p-5"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center"
              >
                <mat-icon class="text-blue-600 !text-xl !w-5 !h-5"
                  >library_books</mat-icon
                >
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-slate-600">Total Books</p>
                <p class="text-2xl font-semibold text-slate-900 mt-0.5">
                  {{ booksService.totalBook() }}
                </p>
              </div>
            </div>
          </div>

          <!-- Active Items -->
          <div
            class="bg-white rounded-xl shadow-sm border border-slate-200 p-5"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center"
              >
                <mat-icon class="text-emerald-600 !text-xl !w-5 !h-5"
                  >check_circle</mat-icon
                >
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-slate-600">Available</p>
                <p class="text-2xl font-semibold text-slate-900 mt-0.5">
                  {{ getActiveCount() }}
                </p>
              </div>
            </div>
          </div>

          <!-- Draft Items -->
          <div
            class="bg-white rounded-xl shadow-sm border border-slate-200 p-5"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center"
              >
                <mat-icon class="text-amber-600 !text-xl !w-5 !h-5"
                  >schedule</mat-icon
                >
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-slate-600">Unavailable</p>
                <p class="text-2xl font-semibold text-slate-900 mt-0.5">
                  {{ getDraftCount() }}
                </p>
              </div>
            </div>
          </div>

          <!-- Recent Items -->
          <div
            class="bg-white rounded-xl shadow-sm border border-slate-200 p-5"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-12 h-12 rounded-lg bg-violet-50 flex items-center justify-center"
              >
                <mat-icon class="text-violet-600 !text-xl !w-5 !h-5"
                  >today</mat-icon
                >
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-slate-600">This Week</p>
                <p class="text-2xl font-semibold text-slate-900 mt-0.5">
                  {{ getRecentCount() }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Search and Quick Filters -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <!-- Search Bar -->
          <div class="flex items-center gap-3 mb-4">
            <div class="flex-1 relative">
              <mat-icon
                class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 !text-xl !w-5 !h-5"
                >search</mat-icon
              >
              <input
                type="text"
                [(ngModel)]="searchTerm"
                (input)="onSearchChange()"
                (keyup.enter)="onSearchButtonClick()"
                placeholder="Search books by title, author, ISBN, or genre..."
                class="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            @if (searchTerm) {
              <button
                (click)="clearSearch()"
                class="px-3 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <mat-icon class="!text-xl !w-5 !h-5">close</mat-icon>
              </button>
            }
          </div>

          <!-- Quick Filter Tabs -->
          <div class="flex items-center gap-2 flex-wrap">
            <button
              (click)="setQuickFilter('all')"
              [class.active]="quickFilter === 'all'"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-all quick-filter-btn"
            >
              All Books
            </button>
            <button
              (click)="setQuickFilter('active')"
              [class.active]="quickFilter === 'active'"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-all quick-filter-btn"
            >
              Available
            </button>
            <button
              (click)="setQuickFilter('published')"
              [class.active]="quickFilter === 'published'"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-all quick-filter-btn"
            >
              Published
            </button>
          </div>

          <!-- Active Filter Chips -->
          @if (getActiveFilterChips().length > 0) {
            <div class="mt-4 pt-4 border-t border-slate-200">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-sm font-medium text-slate-700"
                  >Active filters:</span
                >
                @for (chip of getActiveFilterChips(); track chip.key) {
                  <div
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm"
                  >
                    <span class="font-medium">{{ chip.label }}:</span>
                    <span>{{ chip.value }}</span>
                    <button
                      (click)="removeFilter(chip.key)"
                      class="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <mat-icon class="!text-base !w-4 !h-4">close</mat-icon>
                    </button>
                  </div>
                }
                <button
                  (click)="clearAllFilters()"
                  class="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <mat-icon class="!text-base !w-4 !h-4">clear_all</mat-icon>
                  Clear all
                </button>
              </div>
            </div>
          }

          <!-- Advanced Filters Toggle -->
          <button
            (click)="showAdvancedFilters.set(!showAdvancedFilters())"
            class="mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            <mat-icon class="!text-base !w-4 !h-4">{{
              showAdvancedFilters() ? 'expand_less' : 'expand_more'
            }}</mat-icon>
            <span
              >{{ showAdvancedFilters() ? 'Hide' : 'Show' }} Advanced
              Filters</span
            >
          </button>

          <!-- Advanced Filters Panel -->
          @if (showAdvancedFilters()) {
            <div class="mt-4 pt-4 border-t border-slate-200 space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <!-- Available Filter -->
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1.5"
                    >Available</label
                  >
                  <select
                    [(ngModel)]="tempFilters['available']"
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">All</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>

                <!-- Author Filter -->
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1.5"
                    >Author</label
                  >
                  <select
                    [(ngModel)]="tempFilters['author_id']"
                    [disabled]="loadingAuthor()"
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
                  >
                    <option value="">All Authors</option>
                    @if (loadingAuthor()) {
                      <option disabled>Loading...</option>
                    }
                    @for (author of authorOptions(); track author.value) {
                      <option [value]="author.value">{{ author.label }}</option>
                    }
                  </select>
                </div>

                <!-- Title Filter -->
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1.5"
                    >Title</label
                  >
                  <input
                    type="text"
                    [(ngModel)]="tempFilters['title']"
                    placeholder="Enter title"
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                <!-- ISBN Filter -->
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1.5"
                    >ISBN</label
                  >
                  <input
                    type="text"
                    [(ngModel)]="tempFilters['isbn']"
                    placeholder="Enter ISBN"
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                <!-- Genre Filter -->
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1.5"
                    >Genre</label
                  >
                  <input
                    type="text"
                    [(ngModel)]="tempFilters['genre']"
                    placeholder="Enter genre"
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <!-- Filter Actions -->
              <div class="flex items-center gap-3 justify-end pt-2">
                <button
                  (click)="resetFilters()"
                  class="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Reset
                </button>
                <button
                  (click)="applyAdvancedFilters()"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          }
        </div>

        <!-- Loading State -->
        @if (booksService.loading()) {
          <div
            class="bg-white rounded-xl shadow-sm border border-slate-200 p-12"
          >
            <div class="flex flex-col items-center justify-center gap-4">
              <mat-progress-spinner
                mode="indeterminate"
                diameter="40"
              ></mat-progress-spinner>
              <p class="text-sm text-slate-600">Loading books...</p>
            </div>
          </div>
        }

        <!-- Error State -->
        @if (booksService.error() && !booksService.loading()) {
          <div
            class="bg-white rounded-xl shadow-sm border border-slate-200 p-8"
          >
            <div
              class="flex flex-col items-center justify-center gap-4 text-center"
            >
              <div
                class="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center"
              >
                <mat-icon class="text-rose-500 !text-3xl !w-8 !h-8"
                  >error</mat-icon
                >
              </div>
              <div>
                <h3 class="text-lg font-semibold text-slate-900">
                  Error Loading Books
                </h3>
                <p class="mt-1 text-sm text-slate-600">
                  {{ booksService.error() }}
                </p>
              </div>
              <button
                (click)="retry()"
                class="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
              >
                <mat-icon class="!text-lg !w-5 !h-5">refresh</mat-icon>
                <span>Retry</span>
              </button>
            </div>
          </div>
        }

        <!-- Modern Data Table -->
        @if (!booksService.loading() && !booksService.error()) {
          <div
            class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
          >
            <!-- Bulk Actions Bar with Gradient -->
            @if (hasSelected()) {
              <div
                class="px-6 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100"
              >
                <div class="flex items-center justify-between flex-wrap gap-3">
                  <div class="flex items-center gap-3">
                    <div
                      class="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-lg font-bold text-sm"
                    >
                      {{ selectedItems().length }}
                    </div>
                    <span class="text-sm font-semibold text-blue-900">
                      {{ selectedItems().length }} book{{
                        selectedItems().length > 1 ? 's' : ''
                      }}
                      selected
                    </span>
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      (click)="bulkDelete()"
                      [disabled]="booksService.loading()"
                      class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                    >
                      <mat-icon class="!text-base !w-4 !h-4"
                        >delete_sweep</mat-icon
                      >
                      Delete Selected
                    </button>
                    <button
                      (click)="clearSelection()"
                      class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white rounded-lg transition-all border border-slate-200"
                    >
                      <mat-icon class="!text-base !w-4 !h-4">close</mat-icon>
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            }

            <!-- Enhanced Table -->
            @if (booksService.booksList().length > 0) {
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead
                    class="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200"
                  >
                    <tr>
                      <th class="px-6 py-4 text-left w-12">
                        <input
                          type="checkbox"
                          [checked]="isAllSelected()"
                          [indeterminate]="hasSelected() && !isAllSelected()"
                          (change)="toggleSelectAll()"
                          class="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        />
                      </th>
                      <th
                        class="px-6 py-4 text-left text-xs font-bold text-slate-800 uppercase tracking-wider"
                      >
                        <div class="flex items-center gap-2">
                          <mat-icon class="!text-sm !w-4 !h-4 text-slate-500"
                            >menu_book</mat-icon
                          >
                          Book Info
                        </div>
                      </th>
                      <th
                        class="px-6 py-4 text-left text-xs font-bold text-slate-800 uppercase tracking-wider"
                      >
                        <div class="flex items-center gap-2">
                          <mat-icon class="!text-sm !w-4 !h-4 text-slate-500"
                            >person</mat-icon
                          >
                          Author
                        </div>
                      </th>
                      <th
                        class="px-6 py-4 text-left text-xs font-bold text-slate-800 uppercase tracking-wider"
                      >
                        <div class="flex items-center gap-2">
                          <mat-icon class="!text-sm !w-4 !h-4 text-slate-500"
                            >tag</mat-icon
                          >
                          ISBN
                        </div>
                      </th>
                      <th
                        class="px-6 py-4 text-left text-xs font-bold text-slate-800 uppercase tracking-wider"
                      >
                        <div class="flex items-center gap-2">
                          <mat-icon class="!text-sm !w-4 !h-4 text-slate-500"
                            >category</mat-icon
                          >
                          Genre
                        </div>
                      </th>
                      <th
                        class="px-6 py-4 text-left text-xs font-bold text-slate-800 uppercase tracking-wider"
                      >
                        Details
                      </th>
                      <th
                        class="px-6 py-4 text-left text-xs font-bold text-slate-800 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        class="px-6 py-4 text-right text-xs font-bold text-slate-800 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    @for (book of booksService.booksList(); track book.id) {
                      <tr
                        class="group hover:bg-blue-50/30 transition-all duration-150"
                      >
                        <td class="px-6 py-4">
                          <input
                            type="checkbox"
                            [checked]="isSelected(book.id)"
                            (change)="toggleSelect(book.id)"
                            class="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td class="px-6 py-4">
                          <div class="flex items-start gap-3">
                            <div
                              class="flex-shrink-0 w-10 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-sm"
                            >
                              <mat-icon class="text-white !text-lg !w-5 !h-5"
                                >auto_stories</mat-icon
                              >
                            </div>
                            <div class="flex-1 min-w-0">
                              <div
                                class="text-sm font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors"
                              >
                                {{ book.title || 'Untitled' }}
                              </div>
                              @if (book.description) {
                                <div
                                  class="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed"
                                >
                                  {{ book.description }}
                                </div>
                              }
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4">
                          <div class="flex items-center gap-2">
                            <div
                              class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"
                            >
                              <mat-icon
                                class="text-slate-600 !text-base !w-4 !h-4"
                                >person</mat-icon
                              >
                            </div>
                            <span class="text-sm font-medium text-slate-700">{{
                              book.author_id || 'Unknown'
                            }}</span>
                          </div>
                        </td>
                        <td class="px-6 py-4">
                          <span
                            class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg"
                          >
                            <mat-icon class="text-slate-500 !text-xs !w-3 !h-3"
                              >numbers</mat-icon
                            >
                            <span
                              class="text-xs font-mono font-medium text-slate-700"
                              >{{ book.isbn || 'N/A' }}</span
                            >
                          </span>
                        </td>
                        <td class="px-6 py-4">
                          <span
                            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-violet-100 to-purple-100 text-violet-800 border border-violet-200"
                          >
                            {{ book.genre || 'General' }}
                          </span>
                        </td>
                        <td class="px-6 py-4">
                          <div class="space-y-1">
                            @if (book.pages) {
                              <div
                                class="flex items-center gap-1.5 text-xs text-slate-600"
                              >
                                <mat-icon class="!text-xs !w-3 !h-3"
                                  >description</mat-icon
                                >
                                <span class="font-medium"
                                  >{{ book.pages }} pages</span
                                >
                              </div>
                            }
                            @if (book.price) {
                              <div
                                class="flex items-center gap-1.5 text-xs font-semibold text-emerald-600"
                              >
                                <mat-icon class="!text-xs !w-3 !h-3"
                                  >payments</mat-icon
                                >
                                <span>{{ book.price | currency }}</span>
                              </div>
                            }
                          </div>
                        </td>
                        <td class="px-6 py-4">
                          @if (book.available) {
                            <span
                              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200"
                            >
                              <span
                                class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
                              ></span>
                              Available
                            </span>
                          } @else {
                            <span
                              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200"
                            >
                              <span
                                class="w-2 h-2 rounded-full bg-amber-500"
                              ></span>
                              Unavailable
                            </span>
                          }
                        </td>
                        <td class="px-6 py-4">
                          <div class="flex items-center justify-end gap-1">
                            <button
                              (click)="openViewDialog(book)"
                              class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="View details"
                            >
                              <mat-icon class="!text-lg !w-5 !h-5"
                                >visibility</mat-icon
                              >
                            </button>
                            <button
                              (click)="openEditDialog(book)"
                              class="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                              title="Edit book"
                            >
                              <mat-icon class="!text-lg !w-5 !h-5"
                                >edit</mat-icon
                              >
                            </button>
                            <button
                              (click)="deleteBook(book)"
                              [disabled]="booksService.loading()"
                              class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete book"
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

              <!-- Enhanced Pagination -->
              <div
                class="px-6 py-4 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100"
              >
                <div class="flex items-center justify-between flex-wrap gap-4">
                  <div class="text-sm text-slate-600">
                    Showing
                    <span class="font-medium text-slate-900">{{
                      (booksService.currentPage() - 1) *
                        booksService.pageSize() +
                        1
                    }}</span>
                    to
                    <span class="font-medium text-slate-900">{{
                      Math.min(
                        booksService.currentPage() * booksService.pageSize(),
                        booksService.totalBook()
                      )
                    }}</span>
                    of
                    <span class="font-medium text-slate-900">{{
                      booksService.totalBook()
                    }}</span>
                    results
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      (click)="goToPage(1)"
                      [disabled]="booksService.currentPage() === 1"
                      class="px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="First page"
                    >
                      <mat-icon class="!text-base !w-4 !h-4"
                        >first_page</mat-icon
                      >
                    </button>
                    <button
                      (click)="goToPage(booksService.currentPage() - 1)"
                      [disabled]="booksService.currentPage() === 1"
                      class="px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Previous page"
                    >
                      <mat-icon class="!text-base !w-4 !h-4"
                        >chevron_left</mat-icon
                      >
                    </button>

                    <!-- Page Numbers -->
                    @for (page of getPageNumbers(); track page) {
                      @if (page === -1) {
                        <span class="px-3 py-1.5 text-sm text-slate-400"
                          >...</span
                        >
                      } @else {
                        <button
                          (click)="goToPage(page)"
                          [class.active]="page === booksService.currentPage()"
                          class="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors page-btn"
                        >
                          {{ page }}
                        </button>
                      }
                    }

                    <button
                      (click)="goToPage(booksService.currentPage() + 1)"
                      [disabled]="booksService.currentPage() >= getTotalPages()"
                      class="px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Next page"
                    >
                      <mat-icon class="!text-base !w-4 !h-4"
                        >chevron_right</mat-icon
                      >
                    </button>
                    <button
                      (click)="goToPage(getTotalPages())"
                      [disabled]="booksService.currentPage() >= getTotalPages()"
                      class="px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Last page"
                    >
                      <mat-icon class="!text-base !w-4 !h-4"
                        >last_page</mat-icon
                      >
                    </button>
                  </div>

                  <!-- Page Size Selector -->
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-slate-600">Rows per page:</span>
                    <select
                      [(ngModel)]="currentPageSize"
                      (change)="changePageSize()"
                      class="px-2 py-1 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option [value]="5">5</option>
                      <option [value]="10">10</option>
                      <option [value]="25">25</option>
                      <option [value]="50">50</option>
                      <option [value]="100">100</option>
                    </select>
                  </div>
                </div>
              </div>
            } @else {
              <!-- Empty State -->
              <div class="p-12">
                <div
                  class="flex flex-col items-center justify-center gap-4 text-center"
                >
                  <div
                    class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center"
                  >
                    <mat-icon class="text-slate-400 !text-3xl !w-8 !h-8"
                      >auto_stories</mat-icon
                    >
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-slate-900">
                      No books found
                    </h3>
                    <p class="mt-1 text-sm text-slate-600">
                      Get started by adding your first book to the collection
                    </p>
                  </div>
                  <button
                    (click)="openCreateDialog()"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
                  >
                    <mat-icon class="!text-lg !w-5 !h-5">add</mat-icon>
                    <span>Add First Book</span>
                  </button>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      /* Filter Pill Buttons */
      .filter-pill {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        font-weight: 500;
        border-radius: 0.5rem;
        transition: all 0.2s;
        background-color: #f8fafc;
        color: #475569;
        border: 1px solid #e2e8f0;
      }

      .filter-pill:hover {
        background-color: #f1f5f9;
        border-color: #cbd5e1;
      }

      .filter-pill.active {
        background-color: #3b82f6;
        color: white;
        border-color: #3b82f6;
        box-shadow: 0 1px 3px 0 rgb(59 130 246 / 0.4);
      }

      /* Quick Filter Buttons (legacy support) */
      .quick-filter-btn {
        background-color: #f8fafc;
        color: #475569;
        border: 1px solid #e2e8f0;
      }

      .quick-filter-btn:hover {
        background-color: #f1f5f9;
        border-color: #cbd5e1;
      }

      .quick-filter-btn.active {
        background-color: #3b82f6;
        color: white;
        border-color: #3b82f6;
        box-shadow: 0 1px 3px 0 rgb(59 130 246 / 0.3);
      }

      /* Page Buttons */
      .page-btn {
        color: #475569;
        background-color: white;
        border: 1px solid #e2e8f0;
      }

      .page-btn:hover {
        background-color: #f1f5f9;
        border-color: #cbd5e1;
      }

      .page-btn.active {
        background-color: #3b82f6;
        color: white;
        border-color: #3b82f6;
        box-shadow: 0 2px 4px 0 rgb(59 130 246 / 0.3);
      }

      /* Line Clamp Utilities */
      .line-clamp-1 {
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      /* Animations */
      @keyframes pulse {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }

      .animate-pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
    `,
  ],
})
export class BookListComponent implements OnInit, OnDestroy {
  protected readonly Math = Math;
  protected booksService = inject(BookService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private authorService = inject(AuthorService);

  // UI State
  showAdvancedFilters = signal(false);
  searchTerm = '';
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;
  private filterTimeout: ReturnType<typeof setTimeout> | null = null;

  // Filters
  private filtersSignal = signal<Partial<ListBookQuery>>({});
  readonly filters = this.filtersSignal.asReadonly();

  // Temporary filters for advanced filter panel
  tempFilters: Record<string, string | boolean> = {};

  // Quick filter state
  protected quickFilter = 'all';

  // Foreign key dropdown options
  authorOptions = signal<Array<{ value: string; label: string }>>([]);
  loadingAuthor = signal<boolean>(false);

  // Selection
  private selectedIdsSignal = signal<Set<string>>(new Set());
  readonly selectedItems = computed(() =>
    this.booksService
      .booksList()
      .filter((item) => this.selectedIdsSignal().has(item.id)),
  );

  // Pagination
  currentPageSize = 10;

  ngOnInit() {
    this.currentPageSize = this.booksService.pageSize();
    this.loadBooks();
    this.loadAuthor();
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

  async loadBooks() {
    const params: ListBookQuery = {
      page: this.booksService.currentPage(),
      limit: this.booksService.pageSize(),
      ...this.filters(),
    };

    if (this.searchTerm.trim()) {
      params.search = this.searchTerm.trim();
    }

    await this.booksService.loadBookList(params);
  }

  async retry() {
    this.booksService.clearError();
    await this.loadBooks();
  }

  private async loadAuthor() {
    this.loadingAuthor.set(true);
    try {
      const response = await this.authorService.getDropdownOptions();
      this.authorOptions.set(response || []);
    } catch (error) {
      console.error('Failed to load authors:', error);
      this.authorOptions.set([]);
    } finally {
      this.loadingAuthor.set(false);
    }
  }

  // ===== SEARCH AND FILTERING =====

  onSearchChange() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      this.booksService.setCurrentPage(1);
      this.loadBooks();
    }, 300);
  }

  onSearchButtonClick() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.booksService.setCurrentPage(1);
    this.loadBooks();
  }

  clearSearch() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTerm = '';
    this.booksService.setCurrentPage(1);
    this.loadBooks();
  }

  applyAdvancedFilters() {
    // Copy temp filters to actual filters
    const processedFilters: Partial<ListBookQuery> = {};

    Object.keys(this.tempFilters).forEach((key) => {
      const value = this.tempFilters[key];
      if (value !== '' && value !== null && value !== undefined) {
        // Convert string booleans to actual booleans
        if (value === 'true') {
          (processedFilters as Record<string, boolean>)[key] = true;
        } else if (value === 'false') {
          (processedFilters as Record<string, boolean>)[key] = false;
        } else {
          (processedFilters as Record<string, string | boolean>)[key] = value;
        }
      }
    });

    this.filtersSignal.set(processedFilters);
    this.quickFilter = 'all'; // Reset quick filter
    this.booksService.setCurrentPage(1);
    this.loadBooks();
  }

  resetFilters() {
    this.tempFilters = {};
    this.filtersSignal.set({});
    this.quickFilter = 'all';
    this.booksService.setCurrentPage(1);
    this.loadBooks();
  }

  setQuickFilter(filter: string) {
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    this.quickFilter = filter;
    this.tempFilters = {};
    this.filtersSignal.set({});

    switch (filter) {
      case 'active':
        this.filtersSignal.set({ available: true });
        break;
      case 'published':
        this.filtersSignal.set({ available: true });
        break;
      case 'all':
      default:
        break;
    }

    this.booksService.setCurrentPage(1);
    this.loadBooks();
  }

  // ===== ACTIVE FILTER CHIPS =====

  protected getActiveFilterChips(): Array<{
    key: string;
    label: string;
    value: string;
  }> {
    const chips: Array<{ key: string; label: string; value: string }> = [];
    const filters = this.filters();

    if (this.quickFilter !== 'all') {
      const quickFilterLabels: Record<string, string> = {
        active: 'Available',
        published: 'Published',
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

    if (filters.title !== undefined && filters.title !== '') {
      chips.push({
        key: 'title',
        label: 'Title',
        value: String(filters.title),
      });
    }

    if (filters.isbn !== undefined && filters.isbn !== '') {
      chips.push({ key: 'isbn', label: 'ISBN', value: String(filters.isbn) });
    }

    if (filters.genre !== undefined && filters.genre !== '') {
      chips.push({
        key: 'genre',
        label: 'Genre',
        value: String(filters.genre),
      });
    }

    if (filters.author_id !== undefined && filters.author_id !== '') {
      chips.push({
        key: 'author_id',
        label: 'Author',
        value: String(filters.author_id),
      });
    }

    if (filters.available !== undefined) {
      chips.push({
        key: 'available',
        label: 'Available',
        value: filters.available ? 'Yes' : 'No',
      });
    }

    return chips;
  }

  protected removeFilter(key: string) {
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    if (key === '_quickFilter') {
      this.setQuickFilter('all');
      return;
    }

    if (key === 'search') {
      this.searchTerm = '';
    } else {
      this.filtersSignal.update((filters) => {
        const updated = { ...filters };
        delete (updated as Record<string, unknown>)[key];
        return updated;
      });
      delete this.tempFilters[key];
    }

    this.booksService.setCurrentPage(1);
    this.loadBooks();
  }

  protected clearAllFilters() {
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    this.searchTerm = '';
    this.tempFilters = {};
    this.filtersSignal.set({});
    this.quickFilter = 'all';
    this.booksService.setCurrentPage(1);
    this.loadBooks();
  }

  // ===== PAGINATION =====

  getTotalPages(): number {
    return Math.ceil(
      this.booksService.totalBook() / this.booksService.pageSize(),
    );
  }

  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const current = this.booksService.currentPage();
    const pages: number[] = [];

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (current > 3) {
        pages.push(-1); // Ellipsis
      }

      // Show pages around current
      const start = Math.max(2, current - 1);
      const end = Math.min(totalPages - 1, current + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (current < totalPages - 2) {
        pages.push(-1); // Ellipsis
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  }

  goToPage(page: number) {
    if (page < 1 || page > this.getTotalPages()) return;
    this.booksService.setCurrentPage(page);
    this.loadBooks();
  }

  changePageSize() {
    this.booksService.setPageSize(this.currentPageSize);
    this.booksService.setCurrentPage(1);
    this.loadBooks();
  }

  onPageChange(event: PageEvent) {
    this.booksService.setCurrentPage(event.pageIndex + 1);
    this.booksService.setPageSize(event.pageSize);
    this.currentPageSize = event.pageSize;
    this.loadBooks();
  }

  // ===== SELECTION =====

  isSelected(id: string): boolean {
    return this.selectedIdsSignal().has(id);
  }

  hasSelected(): boolean {
    return this.selectedIdsSignal().size > 0;
  }

  isAllSelected(): boolean {
    const total = this.booksService.booksList().length;
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
      const allIds = this.booksService.booksList().map((item) => item.id);
      this.selectedIdsSignal.set(new Set(allIds));
    }
  }

  clearSelection() {
    this.selectedIdsSignal.set(new Set());
  }

  // ===== DIALOG OPERATIONS =====

  openCreateDialog() {
    const dialogRef = this.dialog.open(BookCreateDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadBooks();
      }
    });
  }

  openEditDialog(books: Book) {
    const dialogRef = this.dialog.open(BookEditDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      disableClose: true,
      data: { books } as BookEditDialogData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Service handles optimistic updates
      }
    });
  }

  openViewDialog(books: Book) {
    const dialogRef = this.dialog.open(BookViewDialogComponent, {
      width: '700px',
      maxWidth: '90vw',
      data: { books } as BookViewDialogData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.action === 'edit') {
        this.openEditDialog(result.data);
      }
    });
  }

  // ===== ACTIONS =====

  async deleteBook(books: Book) {
    if (confirm(`Are you sure you want to delete "${books.title}"?`)) {
      try {
        await this.booksService.deleteBook(books.id);
        this.snackBar.open('Book deleted successfully', 'Close', {
          duration: 3000,
        });
      } catch (error) {
        const errorMessage = this.booksService.permissionError()
          ? 'You do not have permission to delete books'
          : (error as Error)?.message || 'Failed to delete book';
        this.snackBar.open(errorMessage, 'Close', {
          duration: 5000,
        });
      }
    }
  }

  async bulkDelete() {
    const selectedIds = Array.from(this.selectedIdsSignal());
    if (selectedIds.length === 0) return;

    const confirmed = confirm(
      `Are you sure you want to delete ${selectedIds.length} book(s)?`,
    );
    if (!confirmed) return;

    try {
      await this.booksService.bulkDeleteBook(selectedIds);
      this.clearSelection();
      this.snackBar.open(
        `${selectedIds.length} book(s) deleted successfully`,
        'Close',
        {
          duration: 3000,
        },
      );
    } catch (error) {
      const errorMessage = this.booksService.permissionError()
        ? 'You do not have permission to delete books'
        : (error as Error)?.message || 'Failed to delete books';
      this.snackBar.open(errorMessage, 'Close', {
        duration: 5000,
      });
    }
  }

  // ===== SUMMARY DASHBOARD METHODS =====

  getActiveCount(): number {
    return this.booksService
      .booksList()
      .filter((item) => item.available === true).length;
  }

  getDraftCount(): number {
    return this.booksService
      .booksList()
      .filter((item) => item.available === false).length;
  }

  getRecentCount(): number {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return this.booksService
      .booksList()
      .filter(
        (item) => item.created_at && new Date(item.created_at) >= oneWeekAgo,
      ).length;
  }

  getPercentage(count: number): number {
    const total = this.booksService.totalBook();
    return total > 0 ? Math.round((count / total) * 100) : 0;
  }
}
