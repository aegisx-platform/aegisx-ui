import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-ecommerce-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTabsModule,
  ],
  template: `
    <div class="ecommerce">
      <!-- Header -->
      <header class="ecommerce__header">
        <div class="ecommerce__header-left">
          <h1>E-commerce Dashboard</h1>
          <div class="ecommerce__breadcrumb">
            <span>Dashboard</span>
            <mat-icon>chevron_right</mat-icon>
            <span>E-commerce</span>
          </div>
        </div>
        <div class="ecommerce__header-actions">
          <button mat-stroked-button>
            <mat-icon>add</mat-icon>
            Add Product
          </button>
          <button mat-flat-button color="primary">
            <mat-icon>insights</mat-icon>
            View Reports
          </button>
        </div>
      </header>

      <!-- Overview Cards -->
      <div class="ecommerce__overview">
        @for (card of overviewCards; track card.title) {
          <div
            class="ecommerce__overview-card"
            [style.--accent-color]="card.color"
          >
            <div class="ecommerce__overview-header">
              <span class="ecommerce__overview-title">{{ card.title }}</span>
              <div class="ecommerce__overview-badge" [class]="card.trend">
                {{ card.change }}
              </div>
            </div>
            <div class="ecommerce__overview-value">{{ card.value }}</div>
            <div class="ecommerce__overview-chart">
              @for (point of card.sparkline; track $index) {
                <div
                  class="ecommerce__sparkline-bar"
                  [style.height.%]="point"
                ></div>
              }
            </div>
            <div class="ecommerce__overview-footer">
              <span>vs last month</span>
            </div>
          </div>
        }
      </div>

      <!-- Main Content -->
      <div class="ecommerce__main">
        <!-- Sales Chart -->
        <div class="ecommerce__card ecommerce__card--chart">
          <div class="ecommerce__card-header">
            <h3>Sales Overview</h3>
            <mat-tab-group>
              <mat-tab label="Weekly" />
              <mat-tab label="Monthly" />
              <mat-tab label="Yearly" />
            </mat-tab-group>
          </div>
          <div class="ecommerce__sales-chart">
            <div class="ecommerce__chart-area">
              @for (week of salesData; track week.label) {
                <div class="ecommerce__chart-column">
                  <div class="ecommerce__chart-bars">
                    <div
                      class="ecommerce__chart-bar ecommerce__chart-bar--revenue"
                      [style.height.%]="week.revenue / 100"
                    ></div>
                    <div
                      class="ecommerce__chart-bar ecommerce__chart-bar--orders"
                      [style.height.%]="week.orders / 100"
                    ></div>
                  </div>
                  <span class="ecommerce__chart-label">{{ week.label }}</span>
                </div>
              }
            </div>
            <div class="ecommerce__chart-legend">
              <div class="ecommerce__legend-item">
                <span
                  class="ecommerce__legend-dot ecommerce__legend-dot--revenue"
                ></span>
                Revenue
              </div>
              <div class="ecommerce__legend-item">
                <span
                  class="ecommerce__legend-dot ecommerce__legend-dot--orders"
                ></span>
                Orders
              </div>
            </div>
          </div>
        </div>

        <!-- Best Sellers -->
        <div class="ecommerce__card ecommerce__card--products">
          <div class="ecommerce__card-header">
            <h3>Best Sellers</h3>
            <button mat-button color="primary">See All</button>
          </div>
          <div class="ecommerce__products">
            @for (product of bestSellers; track product.name) {
              <div class="ecommerce__product">
                <div
                  class="ecommerce__product-image"
                  [style.background]="product.color"
                >
                  <mat-icon>{{ product.icon }}</mat-icon>
                </div>
                <div class="ecommerce__product-info">
                  <span class="ecommerce__product-name">{{
                    product.name
                  }}</span>
                  <span class="ecommerce__product-category">{{
                    product.category
                  }}</span>
                </div>
                <div class="ecommerce__product-stats">
                  <span class="ecommerce__product-price">{{
                    product.price
                  }}</span>
                  <span class="ecommerce__product-sold"
                    >{{ product.sold }} sold</span
                  >
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Bottom Row -->
      <div class="ecommerce__bottom">
        <!-- Recent Transactions -->
        <div class="ecommerce__card">
          <div class="ecommerce__card-header">
            <h3>Recent Transactions</h3>
            <button mat-icon-button [matMenuTriggerFor]="transMenu">
              <mat-icon>more_horiz</mat-icon>
            </button>
            <mat-menu #transMenu="matMenu">
              <button mat-menu-item>View All</button>
              <button mat-menu-item>Export</button>
            </mat-menu>
          </div>
          <div class="ecommerce__transactions">
            @for (trans of transactions; track trans.id) {
              <div class="ecommerce__transaction">
                <div class="ecommerce__transaction-icon" [class]="trans.type">
                  <mat-icon>{{ trans.icon }}</mat-icon>
                </div>
                <div class="ecommerce__transaction-info">
                  <span class="ecommerce__transaction-title">{{
                    trans.title
                  }}</span>
                  <span class="ecommerce__transaction-date">{{
                    trans.date
                  }}</span>
                </div>
                <span
                  class="ecommerce__transaction-amount"
                  [class]="trans.type"
                >
                  {{ trans.type === 'income' ? '+' : '-' }}{{ trans.amount }}
                </span>
              </div>
            }
          </div>
        </div>

        <!-- Customer Map -->
        <div class="ecommerce__card">
          <div class="ecommerce__card-header">
            <h3>Customers by Region</h3>
            <button mat-button color="primary">Details</button>
          </div>
          <div class="ecommerce__regions">
            @for (region of regions; track region.name) {
              <div class="ecommerce__region">
                <div class="ecommerce__region-info">
                  <span class="ecommerce__region-flag">{{ region.flag }}</span>
                  <span class="ecommerce__region-name">{{ region.name }}</span>
                </div>
                <div class="ecommerce__region-stats">
                  <span class="ecommerce__region-customers">{{
                    region.customers
                  }}</span>
                  <span class="ecommerce__region-percent"
                    >{{ region.percent }}%</span
                  >
                </div>
                <div class="ecommerce__region-bar">
                  <div
                    class="ecommerce__region-progress"
                    [style.width.%]="region.percent"
                  ></div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Inventory Status -->
        <div class="ecommerce__card">
          <div class="ecommerce__card-header">
            <h3>Inventory Status</h3>
            <button mat-button color="primary">Manage</button>
          </div>
          <div class="ecommerce__inventory">
            @for (item of inventory; track item.name) {
              <div class="ecommerce__inventory-item">
                <div class="ecommerce__inventory-info">
                  <span class="ecommerce__inventory-name">{{ item.name }}</span>
                  <span class="ecommerce__inventory-sku"
                    >SKU: {{ item.sku }}</span
                  >
                </div>
                <div class="ecommerce__inventory-stock" [class]="item.status">
                  <span class="ecommerce__inventory-count">{{
                    item.stock
                  }}</span>
                  <span class="ecommerce__inventory-label">{{
                    item.statusLabel
                  }}</span>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .ecommerce {
        min-height: 100vh;
        background: var(--ax-background-subtle);
        padding: 1.5rem;
      }

      /* Header */
      .ecommerce__header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
        gap: 1rem;

        h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--ax-text-heading);
          margin: 0;
        }
      }

      .ecommerce__breadcrumb {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.875rem;
        color: var(--ax-text-secondary);
        margin-top: 0.25rem;

        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }
      }

      .ecommerce__header-actions {
        display: flex;
        gap: 0.75rem;

        button mat-icon {
          margin-right: 0.5rem;
        }
      }

      /* Overview Cards */
      .ecommerce__overview {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
        margin-bottom: 1.5rem;

        @media (max-width: 1200px) {
          grid-template-columns: repeat(2, 1fr);
        }

        @media (max-width: 640px) {
          grid-template-columns: 1fr;
        }
      }

      .ecommerce__overview-card {
        background: var(--ax-background-default);
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-lg);
        padding: 1.25rem;
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--accent-color);
        }
      }

      .ecommerce__overview-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
      }

      .ecommerce__overview-title {
        font-size: 0.8125rem;
        color: var(--ax-text-secondary);
      }

      .ecommerce__overview-badge {
        font-size: 0.75rem;
        font-weight: 500;
        padding: 0.125rem 0.5rem;
        border-radius: var(--ax-radius-full);

        &.up {
          background: var(--ax-success-subtle);
          color: var(--ax-success-default);
        }

        &.down {
          background: var(--ax-danger-subtle);
          color: var(--ax-danger-default);
        }
      }

      .ecommerce__overview-value {
        font-size: 1.75rem;
        font-weight: 700;
        color: var(--ax-text-heading);
        margin-bottom: 0.75rem;
      }

      .ecommerce__overview-chart {
        display: flex;
        align-items: flex-end;
        gap: 3px;
        height: 40px;
        margin-bottom: 0.5rem;
      }

      .ecommerce__sparkline-bar {
        flex: 1;
        background: var(--accent-color);
        opacity: 0.3;
        border-radius: 2px;
        min-height: 4px;

        &:last-child {
          opacity: 1;
        }
      }

      .ecommerce__overview-footer {
        font-size: 0.75rem;
        color: var(--ax-text-subtle);
      }

      /* Cards */
      .ecommerce__card {
        background: var(--ax-background-default);
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-lg);
        padding: 1.25rem;
      }

      .ecommerce__card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;

        h3 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: 0;
        }
      }

      /* Main Content */
      .ecommerce__main {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 1rem;
        margin-bottom: 1.5rem;

        @media (max-width: 1024px) {
          grid-template-columns: 1fr;
        }
      }

      /* Sales Chart */
      .ecommerce__sales-chart {
        padding: 1rem 0;
      }

      .ecommerce__chart-area {
        display: flex;
        align-items: flex-end;
        gap: 1rem;
        height: 200px;
        padding: 0 1rem;
        margin-bottom: 1rem;
      }

      .ecommerce__chart-column {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        height: 100%;
      }

      .ecommerce__chart-bars {
        flex: 1;
        display: flex;
        align-items: flex-end;
        gap: 4px;
        width: 100%;
      }

      .ecommerce__chart-bar {
        flex: 1;
        border-radius: var(--ax-radius-sm) var(--ax-radius-sm) 0 0;
        min-height: 10px;

        &--revenue {
          background: var(--ax-brand-default);
        }

        &--orders {
          background: var(--ax-success-default);
        }
      }

      .ecommerce__chart-label {
        font-size: 0.75rem;
        color: var(--ax-text-secondary);
      }

      .ecommerce__chart-legend {
        display: flex;
        justify-content: center;
        gap: 2rem;
      }

      .ecommerce__legend-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        color: var(--ax-text-secondary);
      }

      .ecommerce__legend-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;

        &--revenue {
          background: var(--ax-brand-default);
        }

        &--orders {
          background: var(--ax-success-default);
        }
      }

      /* Products */
      .ecommerce__products {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .ecommerce__product {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem;
        background: var(--ax-background-subtle);
        border-radius: var(--ax-radius-md);
      }

      .ecommerce__product-image {
        width: 48px;
        height: 48px;
        border-radius: var(--ax-radius-md);
        display: flex;
        align-items: center;
        justify-content: center;

        mat-icon {
          color: white;
        }
      }

      .ecommerce__product-info {
        flex: 1;
      }

      .ecommerce__product-name {
        display: block;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--ax-text-heading);
      }

      .ecommerce__product-category {
        font-size: 0.75rem;
        color: var(--ax-text-secondary);
      }

      .ecommerce__product-stats {
        text-align: right;
      }

      .ecommerce__product-price {
        display: block;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--ax-text-heading);
      }

      .ecommerce__product-sold {
        font-size: 0.75rem;
        color: var(--ax-text-secondary);
      }

      /* Bottom Row */
      .ecommerce__bottom {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;

        @media (max-width: 1024px) {
          grid-template-columns: 1fr;
        }
      }

      /* Transactions */
      .ecommerce__transactions {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .ecommerce__transaction {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .ecommerce__transaction-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;

        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
        }

        &.income {
          background: var(--ax-success-subtle);
          color: var(--ax-success-default);
        }

        &.expense {
          background: var(--ax-danger-subtle);
          color: var(--ax-danger-default);
        }
      }

      .ecommerce__transaction-info {
        flex: 1;
      }

      .ecommerce__transaction-title {
        display: block;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--ax-text-heading);
      }

      .ecommerce__transaction-date {
        font-size: 0.75rem;
        color: var(--ax-text-secondary);
      }

      .ecommerce__transaction-amount {
        font-size: 0.875rem;
        font-weight: 600;

        &.income {
          color: var(--ax-success-default);
        }

        &.expense {
          color: var(--ax-danger-default);
        }
      }

      /* Regions */
      .ecommerce__regions {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .ecommerce__region {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .ecommerce__region-info {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .ecommerce__region-flag {
        font-size: 1.25rem;
      }

      .ecommerce__region-name {
        flex: 1;
        font-size: 0.875rem;
        color: var(--ax-text-primary);
      }

      .ecommerce__region-stats {
        display: flex;
        gap: 1rem;
        font-size: 0.875rem;
      }

      .ecommerce__region-customers {
        font-weight: 600;
        color: var(--ax-text-heading);
      }

      .ecommerce__region-percent {
        color: var(--ax-text-secondary);
      }

      .ecommerce__region-bar {
        height: 6px;
        background: var(--ax-background-muted);
        border-radius: 3px;
        overflow: hidden;
      }

      .ecommerce__region-progress {
        height: 100%;
        background: var(--ax-brand-default);
        border-radius: 3px;
      }

      /* Inventory */
      .ecommerce__inventory {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .ecommerce__inventory-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem;
        background: var(--ax-background-subtle);
        border-radius: var(--ax-radius-md);
      }

      .ecommerce__inventory-name {
        display: block;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--ax-text-heading);
      }

      .ecommerce__inventory-sku {
        font-size: 0.75rem;
        color: var(--ax-text-secondary);
      }

      .ecommerce__inventory-stock {
        text-align: right;

        &.low {
          .ecommerce__inventory-count {
            color: var(--ax-danger-default);
          }
          .ecommerce__inventory-label {
            color: var(--ax-danger-default);
          }
        }

        &.medium {
          .ecommerce__inventory-count {
            color: var(--ax-warning-default);
          }
          .ecommerce__inventory-label {
            color: var(--ax-warning-default);
          }
        }

        &.good {
          .ecommerce__inventory-count {
            color: var(--ax-success-default);
          }
          .ecommerce__inventory-label {
            color: var(--ax-success-default);
          }
        }
      }

      .ecommerce__inventory-count {
        display: block;
        font-size: 0.875rem;
        font-weight: 600;
      }

      .ecommerce__inventory-label {
        font-size: 0.75rem;
      }

      /* Responsive */
      @media (max-width: 640px) {
        .ecommerce {
          padding: 1rem;
        }

        .ecommerce__header {
          flex-direction: column;
          align-items: flex-start;
        }

        .ecommerce__header-actions {
          width: 100%;

          button {
            flex: 1;
          }
        }
      }
    `,
  ],
})
export class EcommerceDashboardComponent {
  overviewCards = [
    {
      title: 'Total Sales',
      value: '$124,563.00',
      change: '+12.5%',
      trend: 'up',
      color: '#6366f1',
      sparkline: [30, 45, 35, 50, 40, 60, 55, 70, 65, 80, 75, 90],
    },
    {
      title: 'Total Orders',
      value: '2,456',
      change: '+8.2%',
      trend: 'up',
      color: '#10b981',
      sparkline: [40, 35, 50, 45, 55, 50, 60, 65, 70, 75, 80, 85],
    },
    {
      title: 'New Customers',
      value: '1,234',
      change: '-2.4%',
      trend: 'down',
      color: '#f59e0b',
      sparkline: [60, 55, 50, 45, 40, 45, 40, 35, 40, 35, 30, 35],
    },
    {
      title: 'Conversion Rate',
      value: '3.42%',
      change: '+5.1%',
      trend: 'up',
      color: '#ec4899',
      sparkline: [25, 30, 35, 40, 38, 45, 50, 48, 55, 60, 58, 65],
    },
  ];

  salesData = [
    { label: 'Mon', revenue: 65, orders: 45 },
    { label: 'Tue', revenue: 80, orders: 55 },
    { label: 'Wed', revenue: 45, orders: 35 },
    { label: 'Thu', revenue: 90, orders: 70 },
    { label: 'Fri', revenue: 75, orders: 50 },
    { label: 'Sat', revenue: 95, orders: 80 },
    { label: 'Sun', revenue: 60, orders: 40 },
  ];

  bestSellers = [
    {
      name: 'Wireless Earbuds Pro',
      category: 'Electronics',
      price: '$129.99',
      sold: 1234,
      icon: 'headphones',
      color: '#6366f1',
    },
    {
      name: 'Smart Fitness Watch',
      category: 'Wearables',
      price: '$249.99',
      sold: 987,
      icon: 'watch',
      color: '#10b981',
    },
    {
      name: 'Portable Charger 20K',
      category: 'Accessories',
      price: '$49.99',
      sold: 856,
      icon: 'battery_charging_full',
      color: '#f59e0b',
    },
    {
      name: 'Bluetooth Speaker',
      category: 'Audio',
      price: '$79.99',
      sold: 743,
      icon: 'speaker',
      color: '#ec4899',
    },
  ];

  transactions = [
    {
      id: 1,
      title: 'Payment from #1234',
      date: 'Today, 2:30 PM',
      amount: '$1,234.00',
      type: 'income',
      icon: 'arrow_downward',
    },
    {
      id: 2,
      title: 'Refund to Customer',
      date: 'Today, 11:00 AM',
      amount: '$89.00',
      type: 'expense',
      icon: 'arrow_upward',
    },
    {
      id: 3,
      title: 'Payment from #1235',
      date: 'Yesterday',
      amount: '$567.00',
      type: 'income',
      icon: 'arrow_downward',
    },
    {
      id: 4,
      title: 'Supplier Payment',
      date: 'Yesterday',
      amount: '$2,345.00',
      type: 'expense',
      icon: 'arrow_upward',
    },
  ];

  regions = [
    { name: 'United States', flag: '🇺🇸', customers: '12,450', percent: 45 },
    { name: 'United Kingdom', flag: '🇬🇧', customers: '5,230', percent: 19 },
    { name: 'Germany', flag: '🇩🇪', customers: '4,120', percent: 15 },
    { name: 'France', flag: '🇫🇷', customers: '3,210', percent: 12 },
    { name: 'Others', flag: '🌍', customers: '2,490', percent: 9 },
  ];

  inventory = [
    {
      name: 'Wireless Earbuds',
      sku: 'WE-001',
      stock: 12,
      status: 'low',
      statusLabel: 'Low Stock',
    },
    {
      name: 'Smart Watch',
      sku: 'SW-002',
      stock: 45,
      status: 'medium',
      statusLabel: 'Medium',
    },
    {
      name: 'Bluetooth Speaker',
      sku: 'BS-003',
      stock: 128,
      status: 'good',
      statusLabel: 'In Stock',
    },
    {
      name: 'USB-C Cable',
      sku: 'UC-004',
      stock: 5,
      status: 'low',
      statusLabel: 'Critical',
    },
  ];
}
