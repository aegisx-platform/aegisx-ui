import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule,
  ],
  template: `
    <div class="dashboard">
      <!-- Header -->
      <header class="dashboard__header">
        <div class="dashboard__header-left">
          <h1>Analytics Dashboard</h1>
          <p>Welcome back! Here's what's happening with your business.</p>
        </div>
        <div class="dashboard__header-actions">
          <button mat-stroked-button>
            <mat-icon>calendar_today</mat-icon>
            Last 30 days
          </button>
          <button mat-flat-button color="primary">
            <mat-icon>download</mat-icon>
            Export
          </button>
        </div>
      </header>

      <!-- Stats Grid -->
      <div class="dashboard__stats">
        @for (stat of stats; track stat.label) {
          <div class="dashboard__stat-card">
            <div class="dashboard__stat-icon" [style.background]="stat.bgColor">
              <mat-icon [style.color]="stat.color">{{ stat.icon }}</mat-icon>
            </div>
            <div class="dashboard__stat-content">
              <span class="dashboard__stat-label">{{ stat.label }}</span>
              <span class="dashboard__stat-value">{{ stat.value }}</span>
              <div
                class="dashboard__stat-change"
                [class.positive]="stat.change > 0"
                [class.negative]="stat.change < 0"
              >
                <mat-icon>{{
                  stat.change > 0 ? 'trending_up' : 'trending_down'
                }}</mat-icon>
                {{ stat.change > 0 ? '+' : '' }}{{ stat.change }}%
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Charts Row -->
      <div class="dashboard__charts">
        <!-- Revenue Chart -->
        <div class="dashboard__card dashboard__card--large">
          <div class="dashboard__card-header">
            <h3>Revenue Overview</h3>
            <button mat-icon-button [matMenuTriggerFor]="chartMenu">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #chartMenu="matMenu">
              <button mat-menu-item>View Details</button>
              <button mat-menu-item>Download Report</button>
            </mat-menu>
          </div>
          <div class="dashboard__chart-placeholder">
            <!-- Simulated Bar Chart -->
            <div class="dashboard__bar-chart">
              @for (bar of chartData; track bar.month) {
                <div class="dashboard__bar-group">
                  <div
                    class="dashboard__bar"
                    [style.height.%]="bar.revenue / 1000"
                  >
                    <span class="dashboard__bar-tooltip"
                      >\${{ bar.revenue }}</span
                    >
                  </div>
                  <span class="dashboard__bar-label">{{ bar.month }}</span>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Traffic Sources -->
        <div class="dashboard__card">
          <div class="dashboard__card-header">
            <h3>Traffic Sources</h3>
            <button mat-icon-button [matMenuTriggerFor]="trafficMenu">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #trafficMenu="matMenu">
              <button mat-menu-item>View All</button>
            </mat-menu>
          </div>
          <div class="dashboard__traffic-list">
            @for (source of trafficSources; track source.name) {
              <div class="dashboard__traffic-item">
                <div class="dashboard__traffic-info">
                  <div
                    class="dashboard__traffic-dot"
                    [style.background]="source.color"
                  ></div>
                  <span class="dashboard__traffic-name">{{ source.name }}</span>
                </div>
                <div class="dashboard__traffic-stats">
                  <span class="dashboard__traffic-value">{{
                    source.visitors
                  }}</span>
                  <span class="dashboard__traffic-percent"
                    >{{ source.percent }}%</span
                  >
                </div>
              </div>
              <mat-progress-bar
                mode="determinate"
                [value]="source.percent"
                [style.--mdc-linear-progress-active-indicator-color]="
                  source.color
                "
              />
            }
          </div>
        </div>
      </div>

      <!-- Bottom Row -->
      <div class="dashboard__bottom">
        <!-- Recent Orders -->
        <div class="dashboard__card dashboard__card--medium">
          <div class="dashboard__card-header">
            <h3>Recent Orders</h3>
            <button mat-button color="primary">View All</button>
          </div>
          <div class="dashboard__orders">
            @for (order of recentOrders; track order.id) {
              <div class="dashboard__order">
                <div class="dashboard__order-info">
                  <img [src]="order.avatar" [alt]="order.customer" />
                  <div>
                    <span class="dashboard__order-customer">{{
                      order.customer
                    }}</span>
                    <span class="dashboard__order-id">#{{ order.id }}</span>
                  </div>
                </div>
                <div class="dashboard__order-details">
                  <span class="dashboard__order-amount">{{
                    order.amount
                  }}</span>
                  <span class="dashboard__order-status" [class]="order.status">
                    {{ order.status }}
                  </span>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Top Products -->
        <div class="dashboard__card dashboard__card--medium">
          <div class="dashboard__card-header">
            <h3>Top Products</h3>
            <button mat-button color="primary">View All</button>
          </div>
          <div class="dashboard__products">
            @for (product of topProducts; track product.name; let i = $index) {
              <div class="dashboard__product">
                <span class="dashboard__product-rank">{{ i + 1 }}</span>
                <div
                  class="dashboard__product-image"
                  [style.background]="product.color"
                >
                  <mat-icon>{{ product.icon }}</mat-icon>
                </div>
                <div class="dashboard__product-info">
                  <span class="dashboard__product-name">{{
                    product.name
                  }}</span>
                  <span class="dashboard__product-sales"
                    >{{ product.sales }} sales</span
                  >
                </div>
                <span class="dashboard__product-revenue">{{
                  product.revenue
                }}</span>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard {
        min-height: 100vh;
        background: var(--ax-background-subtle);
        padding: 1.5rem;
      }

      /* Header */
      .dashboard__header {
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

        p {
          color: var(--ax-text-secondary);
          margin: 0.25rem 0 0;
          font-size: 0.875rem;
        }
      }

      .dashboard__header-actions {
        display: flex;
        gap: 0.75rem;

        button mat-icon {
          margin-right: 0.5rem;
        }
      }

      /* Stats Grid */
      .dashboard__stats {
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

      .dashboard__stat-card {
        display: flex;
        gap: 1rem;
        padding: 1.25rem;
        background: var(--ax-background-default);
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-lg);
      }

      .dashboard__stat-icon {
        width: 48px;
        height: 48px;
        border-radius: var(--ax-radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .dashboard__stat-content {
        display: flex;
        flex-direction: column;
      }

      .dashboard__stat-label {
        font-size: 0.8125rem;
        color: var(--ax-text-secondary);
      }

      .dashboard__stat-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--ax-text-heading);
      }

      .dashboard__stat-change {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.75rem;
        font-weight: 500;

        mat-icon {
          font-size: 14px;
          width: 14px;
          height: 14px;
        }

        &.positive {
          color: var(--ax-success-default);
        }

        &.negative {
          color: var(--ax-danger-default);
        }
      }

      /* Cards */
      .dashboard__card {
        background: var(--ax-background-default);
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-lg);
        padding: 1.25rem;
      }

      .dashboard__card-header {
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

      /* Charts Row */
      .dashboard__charts {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 1rem;
        margin-bottom: 1.5rem;

        @media (max-width: 1024px) {
          grid-template-columns: 1fr;
        }
      }

      .dashboard__chart-placeholder {
        height: 280px;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        padding: 1rem 0;
      }

      /* Bar Chart */
      .dashboard__bar-chart {
        display: flex;
        align-items: flex-end;
        gap: 1rem;
        height: 100%;
        width: 100%;
        padding: 0 1rem;
      }

      .dashboard__bar-group {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
      }

      .dashboard__bar {
        width: 100%;
        max-width: 40px;
        background: linear-gradient(180deg, var(--ax-brand-default), #8b5cf6);
        border-radius: var(--ax-radius-sm) var(--ax-radius-sm) 0 0;
        position: relative;
        transition: transform 0.2s;
        min-height: 20px;

        &:hover {
          transform: scaleY(1.05);

          .dashboard__bar-tooltip {
            opacity: 1;
            visibility: visible;
          }
        }
      }

      .dashboard__bar-tooltip {
        position: absolute;
        top: -30px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--ax-background-inverse);
        color: var(--ax-text-inverse);
        padding: 0.25rem 0.5rem;
        border-radius: var(--ax-radius-sm);
        font-size: 0.75rem;
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        transition: all 0.2s;
      }

      .dashboard__bar-label {
        font-size: 0.75rem;
        color: var(--ax-text-secondary);
      }

      /* Traffic Sources */
      .dashboard__traffic-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .dashboard__traffic-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.25rem;
      }

      .dashboard__traffic-info {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .dashboard__traffic-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
      }

      .dashboard__traffic-name {
        font-size: 0.875rem;
        color: var(--ax-text-primary);
      }

      .dashboard__traffic-stats {
        display: flex;
        gap: 1rem;
      }

      .dashboard__traffic-value {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--ax-text-heading);
      }

      .dashboard__traffic-percent {
        font-size: 0.875rem;
        color: var(--ax-text-secondary);
      }

      /* Bottom Row */
      .dashboard__bottom {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;

        @media (max-width: 900px) {
          grid-template-columns: 1fr;
        }
      }

      /* Orders */
      .dashboard__orders {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .dashboard__order {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem;
        background: var(--ax-background-subtle);
        border-radius: var(--ax-radius-md);
      }

      .dashboard__order-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;

        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }
      }

      .dashboard__order-customer {
        display: block;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--ax-text-heading);
      }

      .dashboard__order-id {
        font-size: 0.75rem;
        color: var(--ax-text-secondary);
      }

      .dashboard__order-details {
        text-align: right;
      }

      .dashboard__order-amount {
        display: block;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--ax-text-heading);
      }

      .dashboard__order-status {
        font-size: 0.75rem;
        padding: 0.125rem 0.5rem;
        border-radius: var(--ax-radius-full);

        &.completed {
          background: var(--ax-success-subtle);
          color: var(--ax-success-default);
        }

        &.pending {
          background: var(--ax-warning-subtle);
          color: var(--ax-warning-default);
        }

        &.processing {
          background: var(--ax-info-subtle);
          color: var(--ax-info-default);
        }
      }

      /* Products */
      .dashboard__products {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .dashboard__product {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem;
        background: var(--ax-background-subtle);
        border-radius: var(--ax-radius-md);
      }

      .dashboard__product-rank {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--ax-text-secondary);
        background: var(--ax-background-muted);
        border-radius: 50%;
      }

      .dashboard__product-image {
        width: 40px;
        height: 40px;
        border-radius: var(--ax-radius-md);
        display: flex;
        align-items: center;
        justify-content: center;

        mat-icon {
          color: white;
          font-size: 20px;
          width: 20px;
          height: 20px;
        }
      }

      .dashboard__product-info {
        flex: 1;
      }

      .dashboard__product-name {
        display: block;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--ax-text-heading);
      }

      .dashboard__product-sales {
        font-size: 0.75rem;
        color: var(--ax-text-secondary);
      }

      .dashboard__product-revenue {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--ax-text-heading);
      }

      /* Responsive */
      @media (max-width: 640px) {
        .dashboard {
          padding: 1rem;
        }

        .dashboard__header {
          flex-direction: column;
          align-items: flex-start;
        }

        .dashboard__header-actions {
          width: 100%;

          button {
            flex: 1;
          }
        }
      }
    `,
  ],
})
export class AnalyticsDashboardComponent {
  stats = [
    {
      label: 'Total Revenue',
      value: '$45,231.89',
      change: 20.1,
      icon: 'attach_money',
      color: '#10b981',
      bgColor: '#d1fae5',
    },
    {
      label: 'Total Users',
      value: '2,350',
      change: 15.3,
      icon: 'people',
      color: '#6366f1',
      bgColor: '#e0e7ff',
    },
    {
      label: 'Total Orders',
      value: '1,245',
      change: -2.4,
      icon: 'shopping_cart',
      color: '#f59e0b',
      bgColor: '#fef3c7',
    },
    {
      label: 'Conversion Rate',
      value: '3.24%',
      change: 8.7,
      icon: 'trending_up',
      color: '#ec4899',
      bgColor: '#fce7f3',
    },
  ];

  chartData = [
    { month: 'Jan', revenue: 4500 },
    { month: 'Feb', revenue: 5200 },
    { month: 'Mar', revenue: 4800 },
    { month: 'Apr', revenue: 6100 },
    { month: 'May', revenue: 5500 },
    { month: 'Jun', revenue: 7200 },
    { month: 'Jul', revenue: 6800 },
    { month: 'Aug', revenue: 8500 },
    { month: 'Sep', revenue: 7100 },
    { month: 'Oct', revenue: 9200 },
    { month: 'Nov', revenue: 8400 },
    { month: 'Dec', revenue: 10500 },
  ];

  trafficSources = [
    {
      name: 'Organic Search',
      visitors: '12,450',
      percent: 45,
      color: '#6366f1',
    },
    { name: 'Direct', visitors: '8,230', percent: 30, color: '#10b981' },
    { name: 'Social Media', visitors: '4,120', percent: 15, color: '#f59e0b' },
    { name: 'Referral', visitors: '2,750', percent: 10, color: '#ec4899' },
  ];

  recentOrders = [
    {
      id: 'ORD-001',
      customer: 'Sarah Johnson',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
      amount: '$234.50',
      status: 'completed',
    },
    {
      id: 'ORD-002',
      customer: 'Michael Chen',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      amount: '$129.00',
      status: 'processing',
    },
    {
      id: 'ORD-003',
      customer: 'Emily Davis',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      amount: '$567.80',
      status: 'pending',
    },
    {
      id: 'ORD-004',
      customer: 'James Wilson',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      amount: '$89.99',
      status: 'completed',
    },
  ];

  topProducts = [
    {
      name: 'Premium Headphones',
      sales: 1234,
      revenue: '$12,340',
      icon: 'headphones',
      color: '#6366f1',
    },
    {
      name: 'Wireless Keyboard',
      sales: 987,
      revenue: '$9,870',
      icon: 'keyboard',
      color: '#10b981',
    },
    {
      name: 'Smart Watch Pro',
      sales: 756,
      revenue: '$15,120',
      icon: 'watch',
      color: '#f59e0b',
    },
    {
      name: 'USB-C Hub',
      sales: 654,
      revenue: '$3,270',
      icon: 'usb',
      color: '#ec4899',
    },
  ];
}
