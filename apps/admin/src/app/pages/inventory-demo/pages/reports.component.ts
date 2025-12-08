import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AxBreadcrumbComponent, BreadcrumbItem } from '@aegisx/ui';

interface ReportCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  category: string;
  lastGenerated?: string;
}

@Component({
  selector: 'ax-inventory-reports',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    MatFormFieldModule,
    AxBreadcrumbComponent,
  ],
  template: `
    <div class="reports-page">
      <!-- Breadcrumb -->
      <ax-breadcrumb
        [items]="breadcrumbItems"
        separatorIcon="chevron_right"
        size="sm"
      ></ax-breadcrumb>

      <!-- Page Header -->
      <div class="page-header">
        <div class="page-title">
          <h1>Reports</h1>
          <p>Generate and view inventory reports</p>
        </div>
        <div class="page-actions">
          <mat-form-field appearance="outline" class="period-select">
            <mat-label>Period</mat-label>
            <mat-select value="this-month">
              <mat-option value="today">Today</mat-option>
              <mat-option value="this-week">This Week</mat-option>
              <mat-option value="this-month">This Month</mat-option>
              <mat-option value="this-quarter">This Quarter</mat-option>
              <mat-option value="this-year">This Year</mat-option>
              <mat-option value="custom">Custom Range</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="quick-stats">
        <mat-card appearance="outlined" class="stat-card">
          <mat-card-content>
            <div class="stat-icon blue">
              <mat-icon>inventory_2</mat-icon>
            </div>
            <div class="stat-info">
              <span class="stat-value">2,847</span>
              <span class="stat-label">Total SKUs</span>
              <span class="stat-change positive">+12% from last month</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card appearance="outlined" class="stat-card">
          <mat-card-content>
            <div class="stat-icon green">
              <mat-icon>attach_money</mat-icon>
            </div>
            <div class="stat-info">
              <span class="stat-value">฿12.5M</span>
              <span class="stat-label">Inventory Value</span>
              <span class="stat-change positive">+8% from last month</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card appearance="outlined" class="stat-card">
          <mat-card-content>
            <div class="stat-icon orange">
              <mat-icon>sync_alt</mat-icon>
            </div>
            <div class="stat-info">
              <span class="stat-value">4.2x</span>
              <span class="stat-label">Turnover Rate</span>
              <span class="stat-change negative">-5% from last month</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card appearance="outlined" class="stat-card">
          <mat-card-content>
            <div class="stat-icon red">
              <mat-icon>warning</mat-icon>
            </div>
            <div class="stat-info">
              <span class="stat-value">23</span>
              <span class="stat-label">Low Stock Items</span>
              <span class="stat-change negative">+5 from last week</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Report Categories -->
      <div class="report-section">
        <h2>Stock Reports</h2>
        <div class="reports-grid">
          @for (report of stockReports; track report.id) {
            <mat-card appearance="outlined" class="report-card">
              <mat-card-content>
                <div
                  class="report-icon"
                  [style.background]="report.iconColor + '20'"
                  [style.color]="report.iconColor"
                >
                  <mat-icon>{{ report.icon }}</mat-icon>
                </div>
                <div class="report-info">
                  <h3>{{ report.title }}</h3>
                  <p>{{ report.description }}</p>
                  @if (report.lastGenerated) {
                    <span class="last-generated"
                      >Last generated: {{ report.lastGenerated }}</span
                    >
                  }
                </div>
                <div class="report-actions">
                  <button mat-stroked-button>
                    <mat-icon>visibility</mat-icon>
                    View
                  </button>
                  <button mat-icon-button [matMenuTriggerFor]="reportMenu">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #reportMenu="matMenu">
                    <button mat-menu-item>
                      <mat-icon>file_download</mat-icon> Export PDF
                    </button>
                    <button mat-menu-item>
                      <mat-icon>table_chart</mat-icon> Export Excel
                    </button>
                    <button mat-menu-item>
                      <mat-icon>email</mat-icon> Email Report
                    </button>
                    <button mat-menu-item>
                      <mat-icon>schedule</mat-icon> Schedule
                    </button>
                  </mat-menu>
                </div>
              </mat-card-content>
            </mat-card>
          }
        </div>
      </div>

      <div class="report-section">
        <h2>Financial Reports</h2>
        <div class="reports-grid">
          @for (report of financialReports; track report.id) {
            <mat-card appearance="outlined" class="report-card">
              <mat-card-content>
                <div
                  class="report-icon"
                  [style.background]="report.iconColor + '20'"
                  [style.color]="report.iconColor"
                >
                  <mat-icon>{{ report.icon }}</mat-icon>
                </div>
                <div class="report-info">
                  <h3>{{ report.title }}</h3>
                  <p>{{ report.description }}</p>
                  @if (report.lastGenerated) {
                    <span class="last-generated"
                      >Last generated: {{ report.lastGenerated }}</span
                    >
                  }
                </div>
                <div class="report-actions">
                  <button mat-stroked-button>
                    <mat-icon>visibility</mat-icon>
                    View
                  </button>
                  <button mat-icon-button [matMenuTriggerFor]="reportMenu2">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #reportMenu2="matMenu">
                    <button mat-menu-item>
                      <mat-icon>file_download</mat-icon> Export PDF
                    </button>
                    <button mat-menu-item>
                      <mat-icon>table_chart</mat-icon> Export Excel
                    </button>
                    <button mat-menu-item>
                      <mat-icon>email</mat-icon> Email Report
                    </button>
                    <button mat-menu-item>
                      <mat-icon>schedule</mat-icon> Schedule
                    </button>
                  </mat-menu>
                </div>
              </mat-card-content>
            </mat-card>
          }
        </div>
      </div>

      <div class="report-section">
        <h2>Operational Reports</h2>
        <div class="reports-grid">
          @for (report of operationalReports; track report.id) {
            <mat-card appearance="outlined" class="report-card">
              <mat-card-content>
                <div
                  class="report-icon"
                  [style.background]="report.iconColor + '20'"
                  [style.color]="report.iconColor"
                >
                  <mat-icon>{{ report.icon }}</mat-icon>
                </div>
                <div class="report-info">
                  <h3>{{ report.title }}</h3>
                  <p>{{ report.description }}</p>
                  @if (report.lastGenerated) {
                    <span class="last-generated"
                      >Last generated: {{ report.lastGenerated }}</span
                    >
                  }
                </div>
                <div class="report-actions">
                  <button mat-stroked-button>
                    <mat-icon>visibility</mat-icon>
                    View
                  </button>
                  <button mat-icon-button [matMenuTriggerFor]="reportMenu3">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #reportMenu3="matMenu">
                    <button mat-menu-item>
                      <mat-icon>file_download</mat-icon> Export PDF
                    </button>
                    <button mat-menu-item>
                      <mat-icon>table_chart</mat-icon> Export Excel
                    </button>
                    <button mat-menu-item>
                      <mat-icon>email</mat-icon> Email Report
                    </button>
                    <button mat-menu-item>
                      <mat-icon>schedule</mat-icon> Schedule
                    </button>
                  </mat-menu>
                </div>
              </mat-card-content>
            </mat-card>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .reports-page {
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

      .period-select {
        width: 180px;
      }

      .quick-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1rem;
      }

      .stat-card {
        mat-card-content {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem !important;
        }
      }

      .stat-icon {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--ax-radius-lg);

        mat-icon {
          font-size: 24px;
          width: 24px;
          height: 24px;
        }

        &.blue {
          background: var(--ax-brand-faint);
          color: var(--ax-brand-default);
        }

        &.green {
          background: var(--ax-success-faint);
          color: var(--ax-success-default);
        }

        &.orange {
          background: var(--ax-warning-faint);
          color: var(--ax-warning-default);
        }

        &.red {
          background: var(--ax-error-faint);
          color: var(--ax-error-default);
        }
      }

      .stat-info {
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
      }

      .stat-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--ax-text-heading);
      }

      .stat-label {
        font-size: 0.875rem;
        color: var(--ax-text-secondary);
      }

      .stat-change {
        font-size: 0.75rem;
        font-weight: 500;

        &.positive {
          color: var(--ax-success-default);
        }

        &.negative {
          color: var(--ax-error-default);
        }
      }

      .report-section {
        h2 {
          margin: 0 0 1rem;
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--ax-text-heading);
        }
      }

      .reports-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 1rem;
      }

      .report-card {
        mat-card-content {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.25rem !important;
        }
      }

      .report-icon {
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--ax-radius-lg);
        flex-shrink: 0;

        mat-icon {
          font-size: 22px;
          width: 22px;
          height: 22px;
        }
      }

      .report-info {
        flex: 1;
        min-width: 0;

        h3 {
          margin: 0;
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--ax-text-heading);
        }

        p {
          margin: 0.25rem 0 0;
          font-size: 0.8125rem;
          color: var(--ax-text-secondary);
          line-height: 1.4;
        }
      }

      .last-generated {
        display: block;
        margin-top: 0.5rem;
        font-size: 0.6875rem;
        color: var(--ax-text-subtle);
      }

      .report-actions {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        flex-shrink: 0;
      }
    `,
  ],
})
export class ReportsComponent {
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', url: '/', icon: 'home' },
    { label: 'Inventory', url: '/inventory-demo' },
    { label: 'Reports' },
  ];

  stockReports: ReportCard[] = [
    {
      id: '1',
      title: 'Stock Level Report',
      description: 'Current stock levels across all warehouses',
      icon: 'inventory_2',
      iconColor: '#3b82f6',
      category: 'stock',
      lastGenerated: 'Today, 09:00 AM',
    },
    {
      id: '2',
      title: 'Low Stock Alert',
      description: 'Items below minimum stock threshold',
      icon: 'warning',
      iconColor: '#f59e0b',
      category: 'stock',
      lastGenerated: 'Today, 08:30 AM',
    },
    {
      id: '3',
      title: 'Stock Movement',
      description: 'Stock in, out, and transfers summary',
      icon: 'swap_horiz',
      iconColor: '#10b981',
      category: 'stock',
      lastGenerated: 'Yesterday',
    },
    {
      id: '4',
      title: 'Expiry Report',
      description: 'Items expiring within selected period',
      icon: 'event_busy',
      iconColor: '#ef4444',
      category: 'stock',
      lastGenerated: 'Today, 07:00 AM',
    },
  ];

  financialReports: ReportCard[] = [
    {
      id: '5',
      title: 'Inventory Valuation',
      description: 'Total inventory value by category',
      icon: 'account_balance',
      iconColor: '#8b5cf6',
      category: 'financial',
      lastGenerated: 'Yesterday',
    },
    {
      id: '6',
      title: 'Purchase Analysis',
      description: 'Purchase orders and spending trends',
      icon: 'shopping_cart',
      iconColor: '#3b82f6',
      category: 'financial',
      lastGenerated: '2 days ago',
    },
    {
      id: '7',
      title: 'Cost Analysis',
      description: 'Item costs and price variations',
      icon: 'trending_up',
      iconColor: '#10b981',
      category: 'financial',
    },
  ];

  operationalReports: ReportCard[] = [
    {
      id: '8',
      title: 'Supplier Performance',
      description: 'Supplier delivery and quality metrics',
      icon: 'business',
      iconColor: '#f59e0b',
      category: 'operational',
      lastGenerated: 'Last week',
    },
    {
      id: '9',
      title: 'Warehouse Utilization',
      description: 'Storage capacity and usage report',
      icon: 'warehouse',
      iconColor: '#6366f1',
      category: 'operational',
      lastGenerated: 'Today, 06:00 AM',
    },
    {
      id: '10',
      title: 'Audit Trail',
      description: 'Inventory changes and user actions log',
      icon: 'history',
      iconColor: '#64748b',
      category: 'operational',
    },
  ];
}
