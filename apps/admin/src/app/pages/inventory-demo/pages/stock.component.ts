import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { AxBreadcrumbComponent, BreadcrumbItem } from '@aegisx/ui';

interface StockItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minStock: number;
  maxStock: number;
  unit: string;
  unitPrice: number;
  location: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  lastUpdated: string;
}

@Component({
  selector: 'ax-inventory-stock',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatDividerModule,
    AxBreadcrumbComponent,
  ],
  template: `
    <div class="stock-page">
      <!-- Breadcrumb -->
      <ax-breadcrumb
        [items]="breadcrumbItems"
        separatorIcon="chevron_right"
        size="sm"
      ></ax-breadcrumb>

      <!-- Page Header -->
      <div class="page-header">
        <div class="page-title">
          <h1>Stock Management</h1>
          <p>Manage your inventory stock items</p>
        </div>
        <div class="page-actions">
          <button mat-stroked-button>
            <mat-icon>file_upload</mat-icon>
            Import
          </button>
          <button mat-stroked-button>
            <mat-icon>file_download</mat-icon>
            Export
          </button>
          <button mat-flat-button color="primary">
            <mat-icon>add</mat-icon>
            Add Item
          </button>
        </div>
      </div>

      <!-- Filters -->
      <mat-card appearance="outlined" class="filter-card">
        <mat-card-content>
          <div class="filters">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Search items</mat-label>
              <mat-icon matPrefix>search</mat-icon>
              <input matInput placeholder="Search by name, SKU..." />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Category</mat-label>
              <mat-select>
                <mat-option value="">All Categories</mat-option>
                <mat-option value="medicine">Medicine</mat-option>
                <mat-option value="supplies">Supplies</mat-option>
                <mat-option value="equipment">Equipment</mat-option>
                <mat-option value="consumables">Consumables</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Status</mat-label>
              <mat-select>
                <mat-option value="">All Status</mat-option>
                <mat-option value="in-stock">In Stock</mat-option>
                <mat-option value="low-stock">Low Stock</mat-option>
                <mat-option value="out-of-stock">Out of Stock</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Location</mat-label>
              <mat-select>
                <mat-option value="">All Locations</mat-option>
                <mat-option value="main">Main Warehouse</mat-option>
                <mat-option value="cold">Cold Storage</mat-option>
                <mat-option value="pharmacy">Pharmacy Store</mat-option>
                <mat-option value="emergency">Emergency Stock</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Stock Table -->
      <mat-card appearance="outlined" class="table-card">
        <mat-card-content>
          <table mat-table [dataSource]="stockItems" class="stock-table">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Item</th>
              <td mat-cell *matCellDef="let item">
                <div class="item-info">
                  <span class="item-name">{{ item.name }}</span>
                  <span class="item-sku">{{ item.sku }}</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="category">
              <th mat-header-cell *matHeaderCellDef>Category</th>
              <td mat-cell *matCellDef="let item">
                <span class="category-badge">{{ item.category }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="quantity">
              <th mat-header-cell *matHeaderCellDef>Quantity</th>
              <td mat-cell *matCellDef="let item">
                <div class="quantity-cell">
                  <span class="qty-value"
                    >{{ item.quantity }} {{ item.unit }}</span
                  >
                  <mat-progress-bar
                    [mode]="'determinate'"
                    [value]="(item.quantity / item.maxStock) * 100"
                    [color]="
                      item.status === 'low-stock'
                        ? 'warn'
                        : item.status === 'out-of-stock'
                          ? 'warn'
                          : 'primary'
                    "
                  ></mat-progress-bar>
                  <span class="qty-range"
                    >Min: {{ item.minStock }} / Max: {{ item.maxStock }}</span
                  >
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="unitPrice">
              <th mat-header-cell *matHeaderCellDef>Unit Price</th>
              <td mat-cell *matCellDef="let item">
                {{ item.unitPrice | currency: 'THB' : 'symbol' : '1.0-0' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="location">
              <th mat-header-cell *matHeaderCellDef>Location</th>
              <td mat-cell *matCellDef="let item">
                <div class="location-cell">
                  <mat-icon>location_on</mat-icon>
                  {{ item.location }}
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let item">
                <span class="status-badge" [class]="item.status">
                  {{ getStatusLabel(item.status) }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef></th>
              <td mat-cell *matCellDef="let item">
                <button mat-icon-button [matMenuTriggerFor]="rowMenu">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #rowMenu="matMenu">
                  <button mat-menu-item>
                    <mat-icon>visibility</mat-icon> View Details
                  </button>
                  <button mat-menu-item><mat-icon>edit</mat-icon> Edit</button>
                  <button mat-menu-item>
                    <mat-icon>add_box</mat-icon> Stock In
                  </button>
                  <button mat-menu-item>
                    <mat-icon>outbox</mat-icon> Stock Out
                  </button>
                  <button mat-menu-item>
                    <mat-icon>sync</mat-icon> Transfer
                  </button>
                  <button mat-menu-item>
                    <mat-icon>history</mat-icon> View History
                  </button>
                  <mat-divider></mat-divider>
                  <button mat-menu-item class="danger">
                    <mat-icon>delete</mat-icon> Delete
                  </button>
                </mat-menu>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>

          <mat-paginator
            [length]="100"
            [pageSize]="10"
            [pageSizeOptions]="[5, 10, 25, 50]"
            showFirstLastButtons
          ></mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .stock-page {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .page-title h1 {
        margin: 0;
        font-size: 1.75rem;
        font-weight: 600;
        color: var(--ax-text-heading);
      }

      .page-title p {
        margin: 0.25rem 0 0;
        font-size: 0.875rem;
        color: var(--ax-text-secondary);
      }

      .page-actions {
        display: flex;
        gap: 0.75rem;
      }

      .filter-card {
        mat-card-content {
          padding: 1rem !important;
        }
      }

      .filters {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .search-field {
        flex: 1;
        min-width: 250px;
      }

      .table-card {
        mat-card-content {
          padding: 0 !important;
        }
      }

      .stock-table {
        width: 100%;

        th.mat-header-cell {
          font-weight: 600;
          color: var(--ax-text-heading);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 1rem;
          background: var(--ax-background-subtle);
        }

        td.mat-cell {
          padding: 1rem;
          font-size: 0.875rem;
          border-bottom: 1px solid var(--ax-border-muted);
        }

        tr.mat-row:hover {
          background: var(--ax-background-subtle);
        }
      }

      .item-info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .item-name {
        font-weight: 500;
        color: var(--ax-text-primary);
      }

      .item-sku {
        font-size: 0.75rem;
        color: var(--ax-text-subtle);
      }

      .category-badge {
        display: inline-flex;
        padding: 0.25rem 0.5rem;
        font-size: 0.75rem;
        font-weight: 500;
        border-radius: var(--ax-radius-sm);
        background: var(--ax-background-muted);
        color: var(--ax-text-secondary);
      }

      .quantity-cell {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
        min-width: 140px;

        mat-progress-bar {
          height: 4px;
          border-radius: 2px;
        }
      }

      .qty-value {
        font-weight: 600;
        color: var(--ax-text-heading);
      }

      .qty-range {
        font-size: 0.6875rem;
        color: var(--ax-text-subtle);
      }

      .location-cell {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        color: var(--ax-text-secondary);

        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
          color: var(--ax-text-subtle);
        }
      }

      .status-badge {
        display: inline-flex;
        padding: 0.25rem 0.625rem;
        font-size: 0.75rem;
        font-weight: 600;
        border-radius: var(--ax-radius-full);

        &.in-stock {
          background: var(--ax-success-faint);
          color: var(--ax-success-700);
        }

        &.low-stock {
          background: var(--ax-warning-faint);
          color: var(--ax-warning-700);
        }

        &.out-of-stock {
          background: var(--ax-error-faint);
          color: var(--ax-error-700);
        }
      }

      .danger {
        color: var(--ax-error-default);
      }

      mat-paginator {
        border-top: 1px solid var(--ax-border-muted);
      }
    `,
  ],
})
export class StockComponent {
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', url: '/', icon: 'home' },
    { label: 'Inventory', url: '/inventory-demo' },
    { label: 'Stock' },
  ];

  displayedColumns = [
    'name',
    'category',
    'quantity',
    'unitPrice',
    'location',
    'status',
    'actions',
  ];

  stockItems: StockItem[] = [
    {
      id: '1',
      name: 'Paracetamol 500mg',
      sku: 'MED-001',
      category: 'Medicine',
      quantity: 1250,
      minStock: 500,
      maxStock: 2000,
      unit: 'pcs',
      unitPrice: 2.5,
      location: 'Main Warehouse',
      status: 'in-stock',
      lastUpdated: '2024-01-15',
    },
    {
      id: '2',
      name: 'Surgical Gloves (M)',
      sku: 'SUP-012',
      category: 'Supplies',
      quantity: 45,
      minStock: 100,
      maxStock: 500,
      unit: 'boxes',
      unitPrice: 150,
      location: 'Main Warehouse',
      status: 'low-stock',
      lastUpdated: '2024-01-14',
    },
    {
      id: '3',
      name: 'IV Solution 0.9%',
      sku: 'MED-045',
      category: 'Medicine',
      quantity: 320,
      minStock: 200,
      maxStock: 600,
      unit: 'bottles',
      unitPrice: 45,
      location: 'Cold Storage',
      status: 'in-stock',
      lastUpdated: '2024-01-15',
    },
    {
      id: '4',
      name: 'Bandage Roll 4"',
      sku: 'SUP-023',
      category: 'Supplies',
      quantity: 0,
      minStock: 50,
      maxStock: 200,
      unit: 'rolls',
      unitPrice: 35,
      location: 'Main Warehouse',
      status: 'out-of-stock',
      lastUpdated: '2024-01-13',
    },
    {
      id: '5',
      name: 'Syringe 5ml',
      sku: 'SUP-008',
      category: 'Supplies',
      quantity: 89,
      minStock: 100,
      maxStock: 400,
      unit: 'pcs',
      unitPrice: 8,
      location: 'Pharmacy Store',
      status: 'low-stock',
      lastUpdated: '2024-01-15',
    },
    {
      id: '6',
      name: 'Amoxicillin 250mg',
      sku: 'MED-015',
      category: 'Medicine',
      quantity: 850,
      minStock: 300,
      maxStock: 1000,
      unit: 'capsules',
      unitPrice: 5,
      location: 'Pharmacy Store',
      status: 'in-stock',
      lastUpdated: '2024-01-15',
    },
    {
      id: '7',
      name: 'Blood Pressure Monitor',
      sku: 'EQP-003',
      category: 'Equipment',
      quantity: 15,
      minStock: 5,
      maxStock: 30,
      unit: 'units',
      unitPrice: 2500,
      location: 'Main Warehouse',
      status: 'in-stock',
      lastUpdated: '2024-01-12',
    },
    {
      id: '8',
      name: 'Insulin Injection',
      sku: 'MED-078',
      category: 'Medicine',
      quantity: 120,
      minStock: 50,
      maxStock: 200,
      unit: 'vials',
      unitPrice: 350,
      location: 'Cold Storage',
      status: 'in-stock',
      lastUpdated: '2024-01-15',
    },
  ];

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'in-stock': 'In Stock',
      'low-stock': 'Low Stock',
      'out-of-stock': 'Out of Stock',
    };
    return labels[status] || status;
  }
}
