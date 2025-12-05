# Development Patterns

> Standard patterns for AegisX Admin development with MCP integration

## Using AegisX MCP for Patterns

```bash
# List all patterns
aegisx_patterns_list

# List by category
aegisx_patterns_list --category "frontend"
aegisx_patterns_list --category "backend"
aegisx_patterns_list --category "database"
aegisx_patterns_list --category "testing"

# Get pattern code
aegisx_patterns_get "Angular Signal-based Component"
aegisx_patterns_get "Angular HTTP Service"

# Get pattern suggestions for a task
aegisx_patterns_suggest "create dashboard component"
aegisx_patterns_suggest "build form with validation"
```

---

## Frontend Patterns

### 1. Angular Signal-based Component

Modern Angular component using Signals for reactive state management.

**MCP**: `aegisx_patterns_get "Angular Signal-based Component"`

```typescript
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductsService } from '../products.service';
import { Product } from '../products.types';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loading()) {
      <ax-skeleton type="table" [lines]="5"></ax-skeleton>
    } @else {
      <div class="grid gap-4">
        @for (product of filteredProducts(); track product.id) {
          <ax-card [title]="product.name">
            <p>{{ product.description }}</p>
            <ax-badge [color]="product.isActive ? 'success' : 'error'">
              {{ product.isActive ? 'Active' : 'Inactive' }}
            </ax-badge>
          </ax-card>
        } @empty {
          <p>No products found</p>
        }
      </div>
    }
  `,
})
export class ProductsListComponent {
  private productsService = inject(ProductsService);

  // State signals
  loading = signal(true);
  searchQuery = signal('');

  // Data from service (converted to signal)
  products = toSignal(this.productsService.getProducts(), {
    initialValue: [],
  });

  // Computed signals
  filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.products().filter((p) => p.name.toLowerCase().includes(query));
  });

  totalCount = computed(() => this.filteredProducts().length);

  // Methods
  onSearch(query: string) {
    this.searchQuery.set(query);
  }

  async deleteProduct(id: string) {
    await this.productsService.delete(id);
  }
}
```

**Key Points:**

- Use `standalone: true` for all components
- Prefer `signal()` over `BehaviorSubject`
- Use `computed()` for derived state
- Use `toSignal()` for RxJS conversion
- Use `@if/@for` control flow syntax

---

### 2. Angular HTTP Service

HTTP service with proper typing and error handling.

**MCP**: `aegisx_patterns_get "Angular HTTP Service"`

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '@env/environment';
import { Product, CreateProduct, UpdateProduct, PaginatedResponse, PaginationQuery } from './products.types';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/products`;

  getProducts(query?: PaginationQuery): Observable<PaginatedResponse<Product>> {
    let params = new HttpParams();

    if (query) {
      if (query.page) params = params.set('page', query.page.toString());
      if (query.limit) params = params.set('limit', query.limit.toString());
      if (query.search) params = params.set('search', query.search);
      if (query.sortBy) params = params.set('sortBy', query.sortBy);
      if (query.sortOrder) params = params.set('sortOrder', query.sortOrder);
    }

    return this.http.get<PaginatedResponse<Product>>(this.baseUrl, { params }).pipe(catchError(this.handleError));
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`).pipe(catchError(this.handleError));
  }

  createProduct(data: CreateProduct): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, data).pipe(catchError(this.handleError));
  }

  updateProduct(id: string, data: UpdateProduct): Observable<Product> {
    return this.http.patch<Product>(`${this.baseUrl}/${id}`, data).pipe(catchError(this.handleError));
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('API Error:', error);
    return throwError(() => error);
  }
}
```

**Key Points:**

- Use `environment` for base URL
- Use proper TypeScript generics
- Handle errors consistently with `catchError`
- Use `HttpParams` for query strings
- Use `inject()` instead of constructor injection

---

### 3. AegisX UI Integration

Integrating AegisX UI components with Angular.

**MCP**: `aegisx_patterns_get "AegisX UI Integration"`

```typescript
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// AegisX UI Components
import { AxCardComponent, AxBadgeComponent, AxAvatarComponent, AxAlertComponent, AxSkeletonComponent, AxInnerLoadingComponent, AxKpiCardComponent } from '@aegisx/ui';

// AegisX UI Services
import { AxDialogService, AxToastService } from '@aegisx/ui';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    // AegisX UI
    AxCardComponent,
    AxBadgeComponent,
    AxAvatarComponent,
    AxAlertComponent,
    AxSkeletonComponent,
    AxInnerLoadingComponent,
    AxKpiCardComponent,
  ],
  template: `
    <div class="p-6">
      <ax-alert type="info" title="Welcome!" [dismissible]="true"> Welcome to your dashboard </ax-alert>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <ax-card title="Users" subtitle="Total registered">
          <ax-kpi-card title="Total Users" [value]="1234" trend="up" trendValue="+12.5%"> </ax-kpi-card>
        </ax-card>

        <ax-card title="Recent Activity">
          @for (user of recentUsers(); track user.id) {
            <div class="flex items-center gap-2 py-2">
              <ax-avatar [name]="user.name" size="sm"></ax-avatar>
              <span>{{ user.name }}</span>
              <ax-badge [color]="user.status === 'active' ? 'success' : 'warn'">
                {{ user.status }}
              </ax-badge>
            </div>
          }
        </ax-card>
      </div>
    </div>
  `,
})
export class DashboardComponent {
  private dialog = inject(AxDialogService);
  private toast = inject(AxToastService);

  recentUsers = signal([
    { id: 1, name: 'John Doe', status: 'active' },
    { id: 2, name: 'Jane Smith', status: 'inactive' },
  ]);

  showConfirmDialog() {
    this.dialog
      .confirm({
        title: 'Confirm Action',
        message: 'Are you sure you want to proceed?',
      })
      .subscribe((result) => {
        if (result) {
          this.toast.success('Action confirmed!');
        }
      });
  }
}
```

**Key Points:**

- Import components from `@aegisx/ui`
- Use services via `inject()`
- Combine with Material components
- Use TailwindCSS for layout

---

## Form Patterns

### 4. Reactive Form with Signals

```typescript
import { Component, signal, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AxCardComponent, AxAlertComponent } from '@aegisx/ui';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, AxCardComponent, AxAlertComponent],
  template: `
    <ax-card title="User Form">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        @if (error()) {
          <ax-alert type="error" [dismissible]="true" (dismiss)="error.set('')">
            {{ error() }}
          </ax-alert>
        }

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" />
          @if (form.controls.name.errors?.['required']) {
            <mat-error>Name is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email" />
          @if (form.controls.email.errors?.['email']) {
            <mat-error>Invalid email format</mat-error>
          }
        </mat-form-field>

        <button mat-raised-button color="primary" type="submit" [disabled]="!isValid() || submitting()">
          @if (submitting()) {
            <mat-spinner diameter="20"></mat-spinner>
          } @else {
            Save
          }
        </button>
      </form>
    </ax-card>
  `,
})
export class UserFormComponent {
  private fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
  });

  submitting = signal(false);
  error = signal('');

  isValid = computed(() => this.form.valid);

  async onSubmit() {
    if (!this.form.valid) return;

    this.submitting.set(true);
    this.error.set('');

    try {
      const data = this.form.getRawValue();
      // await this.userService.create(data);
      console.log('Submitted:', data);
    } catch (err) {
      this.error.set('Failed to save user');
    } finally {
      this.submitting.set(false);
    }
  }
}
```

---

### 5. Data Table with Pagination

```typescript
import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { AxInnerLoadingComponent, AxBadgeComponent } from '@aegisx/ui';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule, AxInnerLoadingComponent, AxBadgeComponent],
  template: `
    <ax-inner-loading [loading]="loading()">
      <table mat-table [dataSource]="users()" matSort (matSortChange)="onSort($event)">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
          <td mat-cell *matCellDef="let user">{{ user.name }}</td>
        </ng-container>

        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Email</th>
          <td mat-cell *matCellDef="let user">{{ user.email }}</td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let user">
            <ax-badge [color]="user.isActive ? 'success' : 'error'">
              {{ user.isActive ? 'Active' : 'Inactive' }}
            </ax-badge>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>

      <mat-paginator [length]="totalCount()" [pageSize]="pageSize()" [pageSizeOptions]="[10, 25, 50]" (page)="onPageChange($event)"> </mat-paginator>
    </ax-inner-loading>
  `,
})
export class UsersTableComponent implements OnInit {
  private usersService = inject(UsersService);

  displayedColumns = ['name', 'email', 'status'];

  loading = signal(false);
  users = signal<User[]>([]);
  totalCount = signal(0);
  pageSize = signal(10);
  pageIndex = signal(0);
  sortBy = signal('name');
  sortOrder = signal<'asc' | 'desc'>('asc');

  ngOnInit() {
    this.loadUsers();
  }

  async loadUsers() {
    this.loading.set(true);

    try {
      const result = await this.usersService
        .getUsers({
          page: this.pageIndex() + 1,
          limit: this.pageSize(),
          sortBy: this.sortBy(),
          sortOrder: this.sortOrder(),
        })
        .toPromise();

      this.users.set(result.data);
      this.totalCount.set(result.meta.total);
    } finally {
      this.loading.set(false);
    }
  }

  onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadUsers();
  }

  onSort(sort: Sort) {
    this.sortBy.set(sort.active);
    this.sortOrder.set(sort.direction as 'asc' | 'desc');
    this.loadUsers();
  }
}
```

---

## Dialog Patterns

### 6. Confirmation Dialog

```typescript
import { Component, inject } from '@angular/core';
import { AxDialogService, AxToastService } from '@aegisx/ui';

@Component({
  selector: 'app-delete-button',
  standalone: true,
  template: ` <button mat-raised-button color="warn" (click)="confirmDelete()">Delete</button> `,
})
export class DeleteButtonComponent {
  private dialog = inject(AxDialogService);
  private toast = inject(AxToastService);

  confirmDelete() {
    this.dialog
      .confirm({
        title: 'Delete Item',
        message: 'Are you sure you want to delete this item? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        confirmColor: 'warn',
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.deleteItem();
        }
      });
  }

  private async deleteItem() {
    try {
      // await this.service.delete(id);
      this.toast.success('Item deleted successfully');
    } catch (error) {
      this.toast.error('Failed to delete item');
    }
  }
}
```

---

### 7. Form Dialog

```typescript
import { Component, inject } from '@angular/core';
import { AxDialogService } from '@aegisx/ui';
import { UserFormDialogComponent } from './user-form-dialog.component';

@Component({
  selector: 'app-users-page',
  standalone: true,
  template: ` <button mat-raised-button color="primary" (click)="openCreateDialog()">Add User</button> `,
})
export class UsersPageComponent {
  private dialog = inject(AxDialogService);

  openCreateDialog() {
    this.dialog
      .open(UserFormDialogComponent, {
        title: 'Create User',
        width: '500px',
        data: { mode: 'create' },
      })
      .subscribe((result) => {
        if (result) {
          // Refresh list
          this.loadUsers();
        }
      });
  }

  openEditDialog(user: User) {
    this.dialog
      .open(UserFormDialogComponent, {
        title: 'Edit User',
        width: '500px',
        data: { mode: 'edit', user },
      })
      .subscribe((result) => {
        if (result) {
          this.loadUsers();
        }
      });
  }
}
```

---

## Layout Patterns

### 8. Page with Toolbar

```typescript
import { Component } from '@angular/core';
import { AxCardComponent, AxBreadcrumbComponent } from '@aegisx/ui';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [AxCardComponent, AxBreadcrumbComponent, MatButtonModule, MatIconModule],
  template: `
    <div class="p-6">
      <!-- Breadcrumb -->
      <ax-breadcrumb [items]="breadcrumbs" class="mb-4"></ax-breadcrumb>

      <!-- Page Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold">Products</h1>
          <p class="text-muted">Manage your product catalog</p>
        </div>
        <div class="flex gap-2">
          <button mat-stroked-button>
            <mat-icon>upload</mat-icon>
            Import
          </button>
          <button mat-raised-button color="primary">
            <mat-icon>add</mat-icon>
            Add Product
          </button>
        </div>
      </div>

      <!-- Content -->
      <ax-card>
        <!-- Table or content here -->
      </ax-card>
    </div>
  `,
})
export class ProductsPageComponent {
  breadcrumbs = [{ label: 'Home', link: '/' }, { label: 'Products' }];
}
```

---

## State Management Patterns

### 9. Store Pattern with Signals

```typescript
import { Injectable, signal, computed } from '@angular/core';

export interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
}

@Injectable({ providedIn: 'root' })
export class AppStore {
  // State
  private state = signal<AppState>({
    user: null,
    theme: 'light',
    sidebarCollapsed: false,
  });

  // Selectors
  user = computed(() => this.state().user);
  theme = computed(() => this.state().theme);
  sidebarCollapsed = computed(() => this.state().sidebarCollapsed);
  isLoggedIn = computed(() => !!this.state().user);

  // Actions
  setUser(user: User | null) {
    this.state.update((s) => ({ ...s, user }));
  }

  toggleTheme() {
    this.state.update((s) => ({
      ...s,
      theme: s.theme === 'light' ? 'dark' : 'light',
    }));
  }

  toggleSidebar() {
    this.state.update((s) => ({
      ...s,
      sidebarCollapsed: !s.sidebarCollapsed,
    }));
  }

  logout() {
    this.state.update((s) => ({ ...s, user: null }));
  }
}
```

---

## Error Handling Patterns

### 10. Error Boundary Component

```typescript
import { Component, input, signal } from '@angular/core';
import { AxAlertComponent, AxCardComponent } from '@aegisx/ui';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-error-boundary',
  standalone: true,
  imports: [AxAlertComponent, AxCardComponent, MatButtonModule],
  template: `
    @if (error()) {
      <ax-card class="text-center py-8">
        <ax-alert type="error" [title]="errorTitle()">
          {{ errorMessage() }}
        </ax-alert>
        <div class="mt-4">
          <button mat-raised-button color="primary" (click)="retry()">Try Again</button>
        </div>
      </ax-card>
    } @else {
      <ng-content></ng-content>
    }
  `,
})
export class ErrorBoundaryComponent {
  error = input<Error | null>(null);
  onRetry = input<() => void>();

  errorTitle = computed(() => this.error()?.name || 'Error');
  errorMessage = computed(() => this.error()?.message || 'An unexpected error occurred');

  retry() {
    const retryFn = this.onRetry();
    if (retryFn) retryFn();
  }
}
```

---

## Related Documentation

- [README.md](./README.md) - Overview & Quick Start
- [COMPONENTS.md](./COMPONENTS.md) - UI Components Reference
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Development Guide
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Application Architecture
