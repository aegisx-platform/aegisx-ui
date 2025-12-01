import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AxBreadcrumbComponent, BreadcrumbItem } from '@aegisx/ui';

interface StockItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minStock: number;
  unit: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  lastUpdated: string;
}

@Component({
  selector: 'ax-inventory-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatMenuModule,
    MatProgressBarModule,
    AxBreadcrumbComponent,
  ],
  template: `
    <div class="dashboard-page">
      <!-- Breadcrumb -->
      <ax-breadcrumb
        [items]="breadcrumbItems"
        separatorIcon="chevron_right"
        size="sm"
      ></ax-breadcrumb>

      <!-- Page Header -->
      <div class="page-header">
        <div class="page-title">
          <h1>Dashboard</h1>
          <p>Overview of your inventory status</p>
        </div>
        <div class="page-actions">
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

      <!-- Stats Cards -->
      <div class="stats-grid">
        <mat-card appearance="outlined" class="stat-card">
          <mat-card-content>
            <div class="stat-header">
              <div class="stat-icon blue">
                <mat-icon>inventory_2</mat-icon>
              </div>
              <button
                mat-icon-button
                [matMenuTriggerFor]="menu1"
                class="stat-menu"
              >
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #menu1="matMenu">
                <button mat-menu-item>View Details</button>
                <button mat-menu-item>Export</button>
              </mat-menu>
            </div>
            <div class="stat-body">
              <span class="stat-value">2,847</span>
              <span class="stat-label">Total Items</span>
            </div>
            <div class="stat-footer">
              <span class="stat-change positive">
                <mat-icon>trending_up</mat-icon>
                +12.5%
              </span>
              <span class="stat-period">vs last month</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card appearance="outlined" class="stat-card">
          <mat-card-content>
            <div class="stat-header">
              <div class="stat-icon orange">
                <mat-icon>warning</mat-icon>
              </div>
              <button
                mat-icon-button
                [matMenuTriggerFor]="menu2"
                class="stat-menu"
              >
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #menu2="matMenu">
                <button mat-menu-item>View All</button>
                <button mat-menu-item>Create Order</button>
              </mat-menu>
            </div>
            <div class="stat-body">
              <span class="stat-value">23</span>
              <span class="stat-label">Low Stock Items</span>
            </div>
            <div class="stat-footer">
              <span class="stat-change negative">
                <mat-icon>trending_up</mat-icon>
                +5
              </span>
              <span class="stat-period">needs attention</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card appearance="outlined" class="stat-card">
          <mat-card-content>
            <div class="stat-header">
              <div class="stat-icon green">
                <mat-icon>local_shipping</mat-icon>
              </div>
              <button
                mat-icon-button
                [matMenuTriggerFor]="menu3"
                class="stat-menu"
              >
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #menu3="matMenu">
                <button mat-menu-item>View Orders</button>
                <button mat-menu-item>Track Shipment</button>
              </mat-menu>
            </div>
            <div class="stat-body">
              <span class="stat-value">18</span>
              <span class="stat-label">Pending Orders</span>
            </div>
            <div class="stat-footer">
              <span class="stat-change neutral">
                <mat-icon>schedule</mat-icon>
                3 arriving today
              </span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card appearance="outlined" class="stat-card">
          <mat-card-content>
            <div class="stat-header">
              <div class="stat-icon red">
                <mat-icon>event_busy</mat-icon>
              </div>
              <button
                mat-icon-button
                [matMenuTriggerFor]="menu4"
                class="stat-menu"
              >
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #menu4="matMenu">
                <button mat-menu-item>View Items</button>
                <button mat-menu-item>Set Alerts</button>
              </mat-menu>
            </div>
            <div class="stat-body">
              <span class="stat-value">7</span>
              <span class="stat-label">Expiring Soon</span>
            </div>
            <div class="stat-footer">
              <span class="stat-change negative">
                <mat-icon>schedule</mat-icon>
                Within 30 days
              </span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Main Content Grid -->
      <div class="main-grid">
        <!-- Stock Table -->
        <mat-card appearance="outlined" class="table-card">
          <mat-card-header>
            <mat-card-title>Recent Stock Activity</mat-card-title>
            <div class="card-actions">
              <button mat-button color="primary">View All</button>
            </div>
          </mat-card-header>
          <mat-card-content>
            <table mat-table [dataSource]="stockItems" class="stock-table">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Item Name</th>
                <td mat-cell *matCellDef="let item">
                  <div class="item-info">
                    <span class="item-name">{{ item.name }}</span>
                    <span class="item-sku">{{ item.sku }}</span>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="category">
                <th mat-header-cell *matHeaderCellDef>Category</th>
                <td mat-cell *matCellDef="let item">{{ item.category }}</td>
              </ng-container>

              <ng-container matColumnDef="quantity">
                <th mat-header-cell *matHeaderCellDef>Quantity</th>
                <td mat-cell *matCellDef="let item">
                  <div class="quantity-cell">
                    <span>{{ item.quantity }} {{ item.unit }}</span>
                    <mat-progress-bar
                      [mode]="'determinate'"
                      [value]="(item.quantity / item.minStock) * 50"
                      [color]="item.status === 'low-stock' ? 'warn' : 'primary'"
                    ></mat-progress-bar>
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
                      <mat-icon>edit</mat-icon> Edit
                    </button>
                    <button mat-menu-item>
                      <mat-icon>add_shopping_cart</mat-icon> Order
                    </button>
                    <button mat-menu-item>
                      <mat-icon>history</mat-icon> History
                    </button>
                  </mat-menu>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
            </table>
          </mat-card-content>
        </mat-card>

        <!-- Quick Actions & Alerts -->
        <div class="side-cards">
          <mat-card appearance="outlined" class="quick-actions-card">
            <mat-card-header>
              <mat-card-title>Quick Actions</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="quick-actions">
                <button mat-stroked-button class="action-btn">
                  <mat-icon>qr_code_scanner</mat-icon>
                  <span>Scan Barcode</span>
                </button>
                <button mat-stroked-button class="action-btn">
                  <mat-icon>add_box</mat-icon>
                  <span>Stock In</span>
                </button>
                <button mat-stroked-button class="action-btn">
                  <mat-icon>outbox</mat-icon>
                  <span>Stock Out</span>
                </button>
                <button mat-stroked-button class="action-btn">
                  <mat-icon>sync</mat-icon>
                  <span>Transfer</span>
                </button>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card appearance="outlined" class="alerts-card">
            <mat-card-header>
              <mat-card-title>Alerts</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="alerts-list">
                @for (alert of alerts; track alert.id) {
                  <div class="alert-item" [class]="alert.type">
                    <mat-icon>{{ alert.icon }}</mat-icon>
                    <div class="alert-content">
                      <span class="alert-title">{{ alert.title }}</span>
                      <span class="alert-desc">{{ alert.description }}</span>
                    </div>
                  </div>
                }
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <!-- Secondary Grid: Categories & Warehouses -->
      <div class="secondary-grid">
        <!-- Category Breakdown -->
        <mat-card appearance="outlined" class="category-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>category</mat-icon>
              Category Breakdown
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="category-list">
              @for (cat of categories; track cat.name) {
                <div class="category-item">
                  <div class="cat-info">
                    <div
                      class="cat-icon"
                      [style.background]="cat.color + '20'"
                      [style.color]="cat.color"
                    >
                      <mat-icon>{{ cat.icon }}</mat-icon>
                    </div>
                    <div class="cat-details">
                      <span class="cat-name">{{ cat.name }}</span>
                      <span class="cat-count">{{ cat.items }} items</span>
                    </div>
                  </div>
                  <div class="cat-stats">
                    <span class="cat-value">{{
                      cat.value | currency: 'THB' : 'symbol' : '1.0-0'
                    }}</span>
                    <div class="cat-bar">
                      <div
                        class="bar-fill"
                        [style.width.%]="cat.percentage"
                        [style.background]="cat.color"
                      ></div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Warehouse Summary -->
        <mat-card appearance="outlined" class="warehouse-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>warehouse</mat-icon>
              Warehouse Summary
            </mat-card-title>
            <button mat-button color="primary">Manage</button>
          </mat-card-header>
          <mat-card-content>
            <div class="warehouse-list">
              @for (wh of warehouses; track wh.id) {
                <div class="warehouse-item">
                  <div class="wh-header">
                    <div class="wh-name">
                      <mat-icon>location_on</mat-icon>
                      <span>{{ wh.name }}</span>
                    </div>
                    <span
                      class="wh-capacity"
                      [class.high]="wh.usage > 80"
                      [class.medium]="wh.usage > 50 && wh.usage <= 80"
                    >
                      {{ wh.usage }}% Used
                    </span>
                  </div>
                  <mat-progress-bar
                    [mode]="'determinate'"
                    [value]="wh.usage"
                    [color]="wh.usage > 80 ? 'warn' : 'primary'"
                  ></mat-progress-bar>
                  <div class="wh-stats">
                    <span>{{ wh.items }} items</span>
                    <span>{{ wh.capacity | number }} capacity</span>
                  </div>
                </div>
              }
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Purchase Orders Section -->
      <mat-card appearance="outlined" class="po-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>receipt_long</mat-icon>
            Recent Purchase Orders
          </mat-card-title>
          <div class="card-actions">
            <button mat-stroked-button>
              <mat-icon>add</mat-icon>
              New PO
            </button>
            <button mat-button color="primary">View All</button>
          </div>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="purchaseOrders" class="po-table">
            <ng-container matColumnDef="poNumber">
              <th mat-header-cell *matHeaderCellDef>PO Number</th>
              <td mat-cell *matCellDef="let po">
                <span class="po-number">{{ po.poNumber }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="supplier">
              <th mat-header-cell *matHeaderCellDef>Supplier</th>
              <td mat-cell *matCellDef="let po">{{ po.supplier }}</td>
            </ng-container>

            <ng-container matColumnDef="items">
              <th mat-header-cell *matHeaderCellDef>Items</th>
              <td mat-cell *matCellDef="let po">{{ po.items }} items</td>
            </ng-container>

            <ng-container matColumnDef="total">
              <th mat-header-cell *matHeaderCellDef>Total</th>
              <td mat-cell *matCellDef="let po">
                <span class="po-total">{{
                  po.total | currency: 'THB' : 'symbol' : '1.0-0'
                }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>Date</th>
              <td mat-cell *matCellDef="let po">{{ po.date }}</td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let po">
                <span class="po-status" [class]="po.status">
                  {{ getPOStatusLabel(po.status) }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef></th>
              <td mat-cell *matCellDef="let po">
                <button mat-icon-button [matMenuTriggerFor]="poMenu">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #poMenu="matMenu">
                  <button mat-menu-item>
                    <mat-icon>visibility</mat-icon> View Details
                  </button>
                  <button mat-menu-item><mat-icon>edit</mat-icon> Edit</button>
                  <button mat-menu-item>
                    <mat-icon>check_circle</mat-icon> Mark Received
                  </button>
                  <button mat-menu-item>
                    <mat-icon>print</mat-icon> Print
                  </button>
                </mat-menu>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="poColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: poColumns"></tr>
          </table>
        </mat-card-content>
      </mat-card>

      <!-- Activity Timeline & Top Products -->
      <div class="bottom-grid">
        <!-- Recent Activity -->
        <mat-card appearance="outlined" class="activity-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>history</mat-icon>
              Recent Activity
            </mat-card-title>
            <button mat-button color="primary">View All</button>
          </mat-card-header>
          <mat-card-content>
            <div class="activity-timeline">
              @for (activity of recentActivity; track activity.id) {
                <div class="activity-item">
                  <div class="activity-icon" [class]="activity.type">
                    <mat-icon>{{ activity.icon }}</mat-icon>
                  </div>
                  <div class="activity-content">
                    <span class="activity-title">{{ activity.title }}</span>
                    <span class="activity-desc">{{
                      activity.description
                    }}</span>
                    <span class="activity-time">{{ activity.time }}</span>
                  </div>
                </div>
              }
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Top Products -->
        <mat-card appearance="outlined" class="top-products-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>star</mat-icon>
              Top Moving Products
            </mat-card-title>
            <button mat-icon-button [matMenuTriggerFor]="topMenu">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #topMenu="matMenu">
              <button mat-menu-item>This Week</button>
              <button mat-menu-item>This Month</button>
              <button mat-menu-item>This Quarter</button>
            </mat-menu>
          </mat-card-header>
          <mat-card-content>
            <div class="top-products-list">
              @for (product of topProducts; track product.rank) {
                <div class="top-product-item">
                  <span class="product-rank" [class]="'rank-' + product.rank">{{
                    product.rank
                  }}</span>
                  <div class="product-info">
                    <span class="product-name">{{ product.name }}</span>
                    <span class="product-sku">{{ product.sku }}</span>
                  </div>
                  <div class="product-stats">
                    <span class="product-sold">{{ product.sold }} sold</span>
                    <span
                      class="product-trend"
                      [class]="product.trend > 0 ? 'up' : 'down'"
                    >
                      <mat-icon>{{
                        product.trend > 0 ? 'trending_up' : 'trending_down'
                      }}</mat-icon>
                      {{ product.trend > 0 ? '+' : '' }}{{ product.trend }}%
                    </span>
                  </div>
                </div>
              }
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Supplier Performance -->
        <mat-card appearance="outlined" class="supplier-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>business</mat-icon>
              Supplier Performance
            </mat-card-title>
            <button mat-button color="primary">View All</button>
          </mat-card-header>
          <mat-card-content>
            <div class="supplier-list">
              @for (supplier of suppliers; track supplier.id) {
                <div class="supplier-item">
                  <div class="supplier-info">
                    <div class="supplier-avatar">
                      {{ supplier.name.charAt(0) }}
                    </div>
                    <div class="supplier-details">
                      <span class="supplier-name">{{ supplier.name }}</span>
                      <span class="supplier-orders"
                        >{{ supplier.orders }} orders</span
                      >
                    </div>
                  </div>
                  <div class="supplier-rating">
                    <div class="rating-stars">
                      @for (star of [1, 2, 3, 4, 5]; track star) {
                        <mat-icon [class.filled]="star <= supplier.rating"
                          >star</mat-icon
                        >
                      }
                    </div>
                    <span class="rating-value">{{
                      supplier.rating.toFixed(1)
                    }}</span>
                  </div>
                  <div class="supplier-metrics">
                    <div class="metric">
                      <span class="metric-label">On-time</span>
                      <span
                        class="metric-value"
                        [class.good]="supplier.onTime >= 90"
                        >{{ supplier.onTime }}%</span
                      >
                    </div>
                    <div class="metric">
                      <span class="metric-label">Quality</span>
                      <span
                        class="metric-value"
                        [class.good]="supplier.quality >= 90"
                        >{{ supplier.quality }}%</span
                      >
                    </div>
                  </div>
                </div>
              }
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-page {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      /* Page Header */
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

      /* Stats Grid */
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1rem;
      }

      .stat-card {
        mat-card-content {
          padding: 1.25rem !important;
        }
      }

      .stat-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
      }

      .stat-icon {
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--ax-radius-lg);

        mat-icon {
          font-size: 22px;
          width: 22px;
          height: 22px;
        }

        &.blue {
          background: var(--ax-brand-faint);
          color: var(--ax-brand-default);
        }

        &.orange {
          background: var(--ax-warning-faint);
          color: var(--ax-warning-default);
        }

        &.green {
          background: var(--ax-success-faint);
          color: var(--ax-success-default);
        }

        &.red {
          background: var(--ax-error-faint);
          color: var(--ax-error-default);
        }
      }

      .stat-menu {
        margin: -0.5rem -0.5rem 0 0;
        color: var(--ax-text-subtle);
      }

      .stat-body {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .stat-value {
        font-size: 1.75rem;
        font-weight: 700;
        color: var(--ax-text-heading);
        line-height: 1.2;
      }

      .stat-label {
        font-size: 0.875rem;
        color: var(--ax-text-secondary);
      }

      .stat-footer {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 0.75rem;
        padding-top: 0.75rem;
        border-top: 1px solid var(--ax-border-muted);
      }

      .stat-change {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.75rem;
        font-weight: 600;

        mat-icon {
          font-size: 14px;
          width: 14px;
          height: 14px;
        }

        &.positive {
          color: var(--ax-success-default);
        }

        &.negative {
          color: var(--ax-error-default);
        }

        &.neutral {
          color: var(--ax-text-secondary);
        }
      }

      .stat-period {
        font-size: 0.75rem;
        color: var(--ax-text-subtle);
      }

      /* Main Grid */
      .main-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;

        @media (min-width: 1200px) {
          grid-template-columns: 1fr 320px;
        }
      }

      /* Table Card */
      .table-card {
        mat-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--ax-border-muted);

          mat-card-title {
            font-size: 1rem;
            font-weight: 600;
            margin: 0;
          }
        }

        mat-card-content {
          padding: 0 !important;
        }

        .card-actions {
          margin-left: auto;
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
          padding: 0.875rem 1rem;
          background: var(--ax-background-subtle);
        }

        td.mat-cell {
          padding: 0.875rem 1rem;
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
        gap: 0.125rem;
      }

      .item-name {
        font-weight: 500;
        color: var(--ax-text-primary);
      }

      .item-sku {
        font-size: 0.75rem;
        color: var(--ax-text-subtle);
      }

      .quantity-cell {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
        min-width: 100px;

        mat-progress-bar {
          height: 4px;
          border-radius: 2px;
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

      /* Side Cards */
      .side-cards {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .quick-actions-card {
        mat-card-header {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--ax-border-muted);

          mat-card-title {
            font-size: 1rem;
            font-weight: 600;
            margin: 0;
          }
        }

        mat-card-content {
          padding: 1rem !important;
        }
      }

      .quick-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
      }

      .action-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem;
        height: auto;
        border-radius: var(--ax-radius-md);

        mat-icon {
          font-size: 24px;
          width: 24px;
          height: 24px;
          color: var(--ax-brand-default);
        }

        span {
          font-size: 0.75rem;
          font-weight: 500;
        }
      }

      /* Alerts Card */
      .alerts-card {
        mat-card-header {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--ax-border-muted);

          mat-card-title {
            font-size: 1rem;
            font-weight: 600;
            margin: 0;
          }
        }

        mat-card-content {
          padding: 0 !important;
        }
      }

      .alerts-list {
        display: flex;
        flex-direction: column;
      }

      .alert-item {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 0.875rem 1.25rem;
        border-bottom: 1px solid var(--ax-border-muted);

        &:last-child {
          border-bottom: none;
        }

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
          margin-top: 0.125rem;
        }

        &.warning {
          mat-icon {
            color: var(--ax-warning-default);
          }
        }

        &.error {
          mat-icon {
            color: var(--ax-error-default);
          }
        }

        &.info {
          mat-icon {
            color: var(--ax-info-default);
          }
        }
      }

      .alert-content {
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
      }

      .alert-title {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--ax-text-primary);
      }

      .alert-desc {
        font-size: 0.75rem;
        color: var(--ax-text-secondary);
      }

      /* Secondary Grid */
      .secondary-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;

        @media (min-width: 1024px) {
          grid-template-columns: 1fr 1fr;
        }
      }

      /* Category Card */
      .category-card,
      .warehouse-card {
        mat-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--ax-border-muted);

          mat-card-title {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1rem;
            font-weight: 600;
            margin: 0;

            mat-icon {
              font-size: 20px;
              width: 20px;
              height: 20px;
              color: var(--ax-brand-default);
            }
          }
        }

        mat-card-content {
          padding: 1rem 1.25rem !important;
        }
      }

      .category-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .category-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
      }

      .cat-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .cat-icon {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--ax-radius-md);

        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
        }
      }

      .cat-details {
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
      }

      .cat-name {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--ax-text-primary);
      }

      .cat-count {
        font-size: 0.75rem;
        color: var(--ax-text-subtle);
      }

      .cat-stats {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 0.375rem;
        min-width: 120px;
      }

      .cat-value {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--ax-text-heading);
      }

      .cat-bar {
        width: 100%;
        height: 4px;
        background: var(--ax-background-muted);
        border-radius: 2px;
        overflow: hidden;
      }

      .cat-bar .bar-fill {
        height: 100%;
        border-radius: 2px;
      }

      /* Warehouse */
      .warehouse-list {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }

      .warehouse-item {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .wh-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .wh-name {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--ax-text-primary);

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
          color: var(--ax-text-subtle);
        }
      }

      .wh-capacity {
        font-size: 0.75rem;
        font-weight: 600;
        padding: 0.25rem 0.5rem;
        border-radius: var(--ax-radius-sm);
        background: var(--ax-success-faint);
        color: var(--ax-success-700);

        &.medium {
          background: var(--ax-warning-faint);
          color: var(--ax-warning-700);
        }

        &.high {
          background: var(--ax-error-faint);
          color: var(--ax-error-700);
        }
      }

      .wh-stats {
        display: flex;
        justify-content: space-between;
        font-size: 0.75rem;
        color: var(--ax-text-subtle);
      }

      /* Purchase Orders Card */
      .po-card {
        mat-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--ax-border-muted);

          mat-card-title {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1rem;
            font-weight: 600;
            margin: 0;

            mat-icon {
              font-size: 20px;
              width: 20px;
              height: 20px;
              color: var(--ax-brand-default);
            }
          }

          .card-actions {
            display: flex;
            gap: 0.5rem;
          }
        }

        mat-card-content {
          padding: 0 !important;
        }
      }

      .po-table {
        width: 100%;

        th.mat-header-cell {
          font-weight: 600;
          color: var(--ax-text-heading);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 0.875rem 1rem;
          background: var(--ax-background-subtle);
        }

        td.mat-cell {
          padding: 0.875rem 1rem;
          font-size: 0.875rem;
          border-bottom: 1px solid var(--ax-border-muted);
        }

        tr.mat-row:hover {
          background: var(--ax-background-subtle);
        }
      }

      .po-number {
        font-weight: 600;
        color: var(--ax-brand-default);
      }

      .po-total {
        font-weight: 600;
        color: var(--ax-text-heading);
      }

      .po-status {
        display: inline-flex;
        padding: 0.25rem 0.625rem;
        font-size: 0.75rem;
        font-weight: 600;
        border-radius: var(--ax-radius-full);

        &.pending {
          background: var(--ax-warning-faint);
          color: var(--ax-warning-700);
        }

        &.approved {
          background: var(--ax-info-faint);
          color: var(--ax-info-700);
        }

        &.shipped {
          background: var(--ax-brand-faint);
          color: var(--ax-brand-700);
        }

        &.received {
          background: var(--ax-success-faint);
          color: var(--ax-success-700);
        }

        &.cancelled {
          background: var(--ax-error-faint);
          color: var(--ax-error-700);
        }
      }

      /* Bottom Grid */
      .bottom-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;

        @media (min-width: 1200px) {
          grid-template-columns: 1fr 1fr 1fr;
        }
      }

      /* Activity Card */
      .activity-card,
      .top-products-card,
      .supplier-card {
        mat-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--ax-border-muted);

          mat-card-title {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1rem;
            font-weight: 600;
            margin: 0;

            mat-icon {
              font-size: 20px;
              width: 20px;
              height: 20px;
              color: var(--ax-brand-default);
            }
          }
        }

        mat-card-content {
          padding: 1rem 1.25rem !important;
        }
      }

      .activity-timeline {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .activity-item {
        display: flex;
        gap: 0.75rem;
      }

      .activity-icon {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        flex-shrink: 0;

        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }

        &.stock-in {
          background: var(--ax-success-faint);
          color: var(--ax-success-default);
        }

        &.stock-out {
          background: var(--ax-error-faint);
          color: var(--ax-error-default);
        }

        &.transfer {
          background: var(--ax-info-faint);
          color: var(--ax-info-default);
        }

        &.order {
          background: var(--ax-warning-faint);
          color: var(--ax-warning-default);
        }
      }

      .activity-content {
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
        min-width: 0;
      }

      .activity-title {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--ax-text-primary);
      }

      .activity-desc {
        font-size: 0.75rem;
        color: var(--ax-text-secondary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .activity-time {
        font-size: 0.6875rem;
        color: var(--ax-text-subtle);
      }

      /* Top Products */
      .top-products-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .top-product-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.5rem;
        border-radius: var(--ax-radius-md);
        transition: background 0.15s ease;

        &:hover {
          background: var(--ax-background-subtle);
        }
      }

      .product-rank {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-size: 0.75rem;
        font-weight: 700;
        background: var(--ax-background-muted);
        color: var(--ax-text-secondary);

        &.rank-1 {
          background: linear-gradient(135deg, #ffd700, #ffb800);
          color: white;
        }

        &.rank-2 {
          background: linear-gradient(135deg, #c0c0c0, #a0a0a0);
          color: white;
        }

        &.rank-3 {
          background: linear-gradient(135deg, #cd7f32, #b87333);
          color: white;
        }
      }

      .product-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
        min-width: 0;
      }

      .product-name {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--ax-text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .product-sku {
        font-size: 0.6875rem;
        color: var(--ax-text-subtle);
      }

      .product-stats {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 0.125rem;
      }

      .product-sold {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--ax-text-heading);
      }

      .product-trend {
        display: flex;
        align-items: center;
        gap: 0.125rem;
        font-size: 0.6875rem;
        font-weight: 600;

        mat-icon {
          font-size: 12px;
          width: 12px;
          height: 12px;
        }

        &.up {
          color: var(--ax-success-default);
        }

        &.down {
          color: var(--ax-error-default);
        }
      }

      /* Supplier Card */
      .supplier-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .supplier-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem;
        border-radius: var(--ax-radius-md);
        background: var(--ax-background-subtle);
      }

      .supplier-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex: 1;
        min-width: 0;
      }

      .supplier-avatar {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: var(--ax-brand-default);
        color: white;
        font-size: 0.875rem;
        font-weight: 600;
      }

      .supplier-details {
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
        min-width: 0;
      }

      .supplier-name {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--ax-text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .supplier-orders {
        font-size: 0.6875rem;
        color: var(--ax-text-subtle);
      }

      .supplier-rating {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.125rem;
      }

      .rating-stars {
        display: flex;
        gap: 0.125rem;

        mat-icon {
          font-size: 14px;
          width: 14px;
          height: 14px;
          color: var(--ax-border-default);

          &.filled {
            color: #fbbf24;
          }
        }
      }

      .rating-value {
        font-size: 0.6875rem;
        font-weight: 600;
        color: var(--ax-text-secondary);
      }

      .supplier-metrics {
        display: flex;
        gap: 0.75rem;
      }

      .metric {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.125rem;
      }

      .metric-label {
        font-size: 0.625rem;
        color: var(--ax-text-subtle);
        text-transform: uppercase;
      }

      .metric-value {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--ax-text-secondary);

        &.good {
          color: var(--ax-success-default);
        }
      }
    `,
  ],
})
export class DashboardComponent {
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', url: '/', icon: 'home' },
    { label: 'Inventory', url: '/inventory-demo' },
    { label: 'Dashboard' },
  ];

  displayedColumns = ['name', 'category', 'quantity', 'status', 'actions'];

  stockItems: StockItem[] = [
    {
      id: '1',
      name: 'Paracetamol 500mg',
      sku: 'MED-001',
      category: 'Medicine',
      quantity: 1250,
      minStock: 500,
      unit: 'pcs',
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
      unit: 'boxes',
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
      unit: 'bottles',
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
      unit: 'rolls',
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
      unit: 'pcs',
      status: 'low-stock',
      lastUpdated: '2024-01-15',
    },
  ];

  alerts = [
    {
      id: 1,
      type: 'warning',
      icon: 'warning',
      title: 'Low Stock Alert',
      description: '23 items below minimum level',
    },
    {
      id: 2,
      type: 'error',
      icon: 'event_busy',
      title: 'Expiring Items',
      description: '7 items expire within 30 days',
    },
    {
      id: 3,
      type: 'info',
      icon: 'local_shipping',
      title: 'Incoming Shipment',
      description: '3 orders arriving today',
    },
  ];

  categories = [
    {
      name: 'Medicine',
      icon: 'medication',
      items: 1250,
      value: 2500000,
      percentage: 45,
      color: '#3b82f6',
    },
    {
      name: 'Supplies',
      icon: 'medical_services',
      items: 890,
      value: 850000,
      percentage: 30,
      color: '#10b981',
    },
    {
      name: 'Equipment',
      icon: 'biotech',
      items: 450,
      value: 1200000,
      percentage: 15,
      color: '#f59e0b',
    },
    {
      name: 'Consumables',
      icon: 'science',
      items: 257,
      value: 350000,
      percentage: 10,
      color: '#8b5cf6',
    },
  ];

  warehouses = [
    { id: '1', name: 'Main Warehouse', items: 1450, capacity: 2000, usage: 72 },
    { id: '2', name: 'Cold Storage', items: 280, capacity: 300, usage: 93 },
    { id: '3', name: 'Pharmacy Store', items: 620, capacity: 1000, usage: 62 },
    { id: '4', name: 'Emergency Stock', items: 150, capacity: 500, usage: 30 },
  ];

  poColumns = [
    'poNumber',
    'supplier',
    'items',
    'total',
    'date',
    'status',
    'actions',
  ];

  purchaseOrders = [
    {
      poNumber: 'PO-2024-001',
      supplier: 'MedSupply Co.',
      items: 15,
      total: 125000,
      date: '2024-01-15',
      status: 'pending',
    },
    {
      poNumber: 'PO-2024-002',
      supplier: 'PharmaCorp',
      items: 8,
      total: 85000,
      date: '2024-01-14',
      status: 'approved',
    },
    {
      poNumber: 'PO-2024-003',
      supplier: 'EquipMed Ltd.',
      items: 3,
      total: 450000,
      date: '2024-01-13',
      status: 'shipped',
    },
    {
      poNumber: 'PO-2024-004',
      supplier: 'LabTech Inc.',
      items: 22,
      total: 67500,
      date: '2024-01-12',
      status: 'received',
    },
    {
      poNumber: 'PO-2024-005',
      supplier: 'SafeMed Supplies',
      items: 10,
      total: 92000,
      date: '2024-01-11',
      status: 'pending',
    },
  ];

  recentActivity = [
    {
      id: 1,
      type: 'stock-in',
      icon: 'add_box',
      title: 'Stock Received',
      description: 'PO-2024-004 - 22 items from LabTech Inc.',
      time: '10 minutes ago',
    },
    {
      id: 2,
      type: 'stock-out',
      icon: 'outbox',
      title: 'Stock Issued',
      description: 'REQ-5521 - 50 pcs Surgical Gloves to Ward A',
      time: '25 minutes ago',
    },
    {
      id: 3,
      type: 'transfer',
      icon: 'sync',
      title: 'Stock Transfer',
      description: '100 bottles IV Solution to Cold Storage',
      time: '1 hour ago',
    },
    {
      id: 4,
      type: 'order',
      icon: 'shopping_cart',
      title: 'Purchase Order Created',
      description: 'PO-2024-006 for MedSupply Co.',
      time: '2 hours ago',
    },
    {
      id: 5,
      type: 'stock-out',
      icon: 'outbox',
      title: 'Stock Issued',
      description: 'REQ-5520 - Emergency supplies to ICU',
      time: '3 hours ago',
    },
  ];

  topProducts = [
    {
      rank: 1,
      name: 'Paracetamol 500mg',
      sku: 'MED-001',
      sold: 2450,
      trend: 15,
    },
    {
      rank: 2,
      name: 'Surgical Gloves (M)',
      sku: 'SUP-012',
      sold: 1820,
      trend: 8,
    },
    {
      rank: 3,
      name: 'IV Solution 0.9%',
      sku: 'MED-045',
      sold: 1540,
      trend: -3,
    },
    { rank: 4, name: 'Syringe 5ml', sku: 'SUP-008', sold: 1280, trend: 12 },
    { rank: 5, name: 'Bandage Roll 4"', sku: 'SUP-023', sold: 980, trend: 5 },
  ];

  suppliers = [
    {
      id: 1,
      name: 'MedSupply Co.',
      orders: 45,
      rating: 4.8,
      onTime: 96,
      quality: 98,
    },
    {
      id: 2,
      name: 'PharmaCorp',
      orders: 38,
      rating: 4.5,
      onTime: 92,
      quality: 95,
    },
    {
      id: 3,
      name: 'EquipMed Ltd.',
      orders: 22,
      rating: 4.2,
      onTime: 88,
      quality: 90,
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

  getPOStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'Pending',
      approved: 'Approved',
      shipped: 'Shipped',
      received: 'Received',
      cancelled: 'Cancelled',
    };
    return labels[status] || status;
  }
}
