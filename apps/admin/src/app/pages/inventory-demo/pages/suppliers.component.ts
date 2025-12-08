import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { AxBreadcrumbComponent, BreadcrumbItem } from '@aegisx/ui';

interface Supplier {
  id: string;
  name: string;
  code: string;
  category: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalValue: number;
  rating: number;
  onTimeDelivery: number;
  qualityScore: number;
  status: 'active' | 'inactive' | 'pending';
}

@Component({
  selector: 'ax-inventory-suppliers',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    MatProgressBarModule,
    MatDividerModule,
    AxBreadcrumbComponent,
  ],
  template: `
    <div class="suppliers-page">
      <!-- Breadcrumb -->
      <ax-breadcrumb
        [items]="breadcrumbItems"
        separatorIcon="chevron_right"
        size="sm"
      ></ax-breadcrumb>

      <!-- Page Header -->
      <div class="page-header">
        <div class="page-title">
          <h1>Suppliers</h1>
          <p>Manage your supplier relationships</p>
        </div>
        <div class="page-actions">
          <button mat-stroked-button>
            <mat-icon>file_download</mat-icon>
            Export
          </button>
          <button mat-flat-button color="primary">
            <mat-icon>add</mat-icon>
            Add Supplier
          </button>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="summary-cards">
        <mat-card appearance="outlined" class="summary-card">
          <mat-card-content>
            <div class="summary-icon blue">
              <mat-icon>business</mat-icon>
            </div>
            <div class="summary-info">
              <span class="summary-value">{{ suppliers.length }}</span>
              <span class="summary-label">Total Suppliers</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card appearance="outlined" class="summary-card">
          <mat-card-content>
            <div class="summary-icon green">
              <mat-icon>check_circle</mat-icon>
            </div>
            <div class="summary-info">
              <span class="summary-value">{{ activeCount }}</span>
              <span class="summary-label">Active</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card appearance="outlined" class="summary-card">
          <mat-card-content>
            <div class="summary-icon orange">
              <mat-icon>star</mat-icon>
            </div>
            <div class="summary-info">
              <span class="summary-value">{{ avgRating.toFixed(1) }}</span>
              <span class="summary-label">Avg. Rating</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card appearance="outlined" class="summary-card">
          <mat-card-content>
            <div class="summary-icon purple">
              <mat-icon>payments</mat-icon>
            </div>
            <div class="summary-info">
              <span class="summary-value">{{
                totalValue | currency: 'THB' : 'symbol' : '1.0-0'
              }}</span>
              <span class="summary-label">Total Orders Value</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Suppliers Grid -->
      <div class="suppliers-grid">
        @for (supplier of suppliers; track supplier.id) {
          <mat-card appearance="outlined" class="supplier-card">
            <mat-card-content>
              <div class="supplier-header">
                <div class="supplier-avatar">{{ supplier.name.charAt(0) }}</div>
                <div class="supplier-title">
                  <h3>{{ supplier.name }}</h3>
                  <span class="supplier-code">{{ supplier.code }}</span>
                </div>
                <button mat-icon-button [matMenuTriggerFor]="supplierMenu">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #supplierMenu="matMenu">
                  <button mat-menu-item>
                    <mat-icon>visibility</mat-icon> View Details
                  </button>
                  <button mat-menu-item><mat-icon>edit</mat-icon> Edit</button>
                  <button mat-menu-item>
                    <mat-icon>receipt_long</mat-icon> View Orders
                  </button>
                  <button mat-menu-item>
                    <mat-icon>email</mat-icon> Send Email
                  </button>
                  <mat-divider></mat-divider>
                  <button mat-menu-item class="danger">
                    <mat-icon>block</mat-icon> Deactivate
                  </button>
                </mat-menu>
              </div>

              <div class="supplier-category">
                <mat-chip-set>
                  <mat-chip>{{ supplier.category }}</mat-chip>
                </mat-chip-set>
                <span class="status-badge" [class]="supplier.status">
                  {{ supplier.status | titlecase }}
                </span>
              </div>

              <div class="supplier-contact">
                <div class="contact-item">
                  <mat-icon>person</mat-icon>
                  <span>{{ supplier.contact }}</span>
                </div>
                <div class="contact-item">
                  <mat-icon>email</mat-icon>
                  <span>{{ supplier.email }}</span>
                </div>
                <div class="contact-item">
                  <mat-icon>phone</mat-icon>
                  <span>{{ supplier.phone }}</span>
                </div>
              </div>

              <div class="supplier-stats">
                <div class="stat-item">
                  <span class="stat-label">Orders</span>
                  <span class="stat-value">{{ supplier.totalOrders }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Value</span>
                  <span class="stat-value">{{
                    supplier.totalValue | currency: 'THB' : 'symbol' : '1.0-0'
                  }}</span>
                </div>
              </div>

              <div class="supplier-metrics">
                <div class="metric">
                  <div class="metric-header">
                    <span>Rating</span>
                    <span class="metric-value">{{
                      supplier.rating.toFixed(1)
                    }}</span>
                  </div>
                  <div class="rating-stars">
                    @for (star of [1, 2, 3, 4, 5]; track star) {
                      <mat-icon [class.filled]="star <= supplier.rating"
                        >star</mat-icon
                      >
                    }
                  </div>
                </div>

                <div class="metric">
                  <div class="metric-header">
                    <span>On-time Delivery</span>
                    <span
                      class="metric-value"
                      [class.good]="supplier.onTimeDelivery >= 90"
                      >{{ supplier.onTimeDelivery }}%</span
                    >
                  </div>
                  <mat-progress-bar
                    [mode]="'determinate'"
                    [value]="supplier.onTimeDelivery"
                    [color]="supplier.onTimeDelivery >= 90 ? 'primary' : 'warn'"
                  ></mat-progress-bar>
                </div>

                <div class="metric">
                  <div class="metric-header">
                    <span>Quality Score</span>
                    <span
                      class="metric-value"
                      [class.good]="supplier.qualityScore >= 90"
                      >{{ supplier.qualityScore }}%</span
                    >
                  </div>
                  <mat-progress-bar
                    [mode]="'determinate'"
                    [value]="supplier.qualityScore"
                    [color]="supplier.qualityScore >= 90 ? 'primary' : 'warn'"
                  ></mat-progress-bar>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .suppliers-page {
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

      .summary-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
      }

      .summary-card {
        mat-card-content {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem !important;
        }
      }

      .summary-icon {
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

        &.green {
          background: var(--ax-success-faint);
          color: var(--ax-success-default);
        }

        &.orange {
          background: var(--ax-warning-faint);
          color: var(--ax-warning-default);
        }

        &.purple {
          background: #f3e8ff;
          color: #9333ea;
        }
      }

      .summary-info {
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
      }

      .summary-value {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--ax-text-heading);
      }

      .summary-label {
        font-size: 0.75rem;
        color: var(--ax-text-secondary);
      }

      .suppliers-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
        gap: 1.5rem;
      }

      .supplier-card {
        mat-card-content {
          padding: 1.25rem !important;
        }
      }

      .supplier-header {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        margin-bottom: 1rem;
      }

      .supplier-avatar {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--ax-radius-lg);
        background: var(--ax-brand-default);
        color: white;
        font-size: 1.25rem;
        font-weight: 600;
      }

      .supplier-title {
        flex: 1;

        h3 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: var(--ax-text-heading);
        }
      }

      .supplier-code {
        font-size: 0.75rem;
        color: var(--ax-text-subtle);
      }

      .supplier-category {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1rem;
      }

      .status-badge {
        display: inline-flex;
        padding: 0.25rem 0.5rem;
        font-size: 0.6875rem;
        font-weight: 600;
        border-radius: var(--ax-radius-full);

        &.active {
          background: var(--ax-success-faint);
          color: var(--ax-success-700);
        }

        &.inactive {
          background: var(--ax-error-faint);
          color: var(--ax-error-700);
        }

        &.pending {
          background: var(--ax-warning-faint);
          color: var(--ax-warning-700);
        }
      }

      .supplier-contact {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.75rem;
        background: var(--ax-background-subtle);
        border-radius: var(--ax-radius-md);
        margin-bottom: 1rem;
      }

      .contact-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.8125rem;
        color: var(--ax-text-secondary);

        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
          color: var(--ax-text-subtle);
        }
      }

      .supplier-stats {
        display: flex;
        gap: 1rem;
        padding-bottom: 1rem;
        margin-bottom: 1rem;
        border-bottom: 1px solid var(--ax-border-muted);
      }

      .stat-item {
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
      }

      .stat-label {
        font-size: 0.6875rem;
        color: var(--ax-text-subtle);
        text-transform: uppercase;
      }

      .stat-value {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--ax-text-heading);
      }

      .supplier-metrics {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .metric {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
      }

      .metric-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.75rem;
        color: var(--ax-text-secondary);
      }

      .metric-value {
        font-weight: 600;
        color: var(--ax-text-heading);

        &.good {
          color: var(--ax-success-default);
        }
      }

      .rating-stars {
        display: flex;
        gap: 0.125rem;

        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
          color: var(--ax-border-default);

          &.filled {
            color: #fbbf24;
          }
        }
      }

      mat-progress-bar {
        height: 6px;
        border-radius: 3px;
      }

      .danger {
        color: var(--ax-error-default);
      }
    `,
  ],
})
export class SuppliersComponent {
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', url: '/', icon: 'home' },
    { label: 'Inventory', url: '/inventory-demo' },
    { label: 'Suppliers' },
  ];

  suppliers: Supplier[] = [
    {
      id: '1',
      name: 'MedSupply Co.',
      code: 'SUP-001',
      category: 'Medical Supplies',
      contact: 'John Smith',
      email: 'john@medsupply.com',
      phone: '02-123-4567',
      address: 'Bangkok',
      totalOrders: 45,
      totalValue: 1250000,
      rating: 4.8,
      onTimeDelivery: 96,
      qualityScore: 98,
      status: 'active',
    },
    {
      id: '2',
      name: 'PharmaCorp',
      code: 'SUP-002',
      category: 'Pharmaceuticals',
      contact: 'Jane Doe',
      email: 'jane@pharmacorp.com',
      phone: '02-234-5678',
      address: 'Nonthaburi',
      totalOrders: 38,
      totalValue: 980000,
      rating: 4.5,
      onTimeDelivery: 92,
      qualityScore: 95,
      status: 'active',
    },
    {
      id: '3',
      name: 'EquipMed Ltd.',
      code: 'SUP-003',
      category: 'Equipment',
      contact: 'Bob Wilson',
      email: 'bob@equipmed.com',
      phone: '02-345-6789',
      address: 'Samut Prakan',
      totalOrders: 22,
      totalValue: 2150000,
      rating: 4.2,
      onTimeDelivery: 88,
      qualityScore: 90,
      status: 'active',
    },
    {
      id: '4',
      name: 'LabTech Inc.',
      code: 'SUP-004',
      category: 'Lab Equipment',
      contact: 'Alice Brown',
      email: 'alice@labtech.com',
      phone: '02-456-7890',
      address: 'Pathum Thani',
      totalOrders: 15,
      totalValue: 750000,
      rating: 4.6,
      onTimeDelivery: 94,
      qualityScore: 96,
      status: 'active',
    },
    {
      id: '5',
      name: 'SafeMed Supplies',
      code: 'SUP-005',
      category: 'Safety Equipment',
      contact: 'Charlie Green',
      email: 'charlie@safemed.com',
      phone: '02-567-8901',
      address: 'Bangkok',
      totalOrders: 28,
      totalValue: 420000,
      rating: 4.3,
      onTimeDelivery: 90,
      qualityScore: 92,
      status: 'active',
    },
    {
      id: '6',
      name: 'BioMed Systems',
      code: 'SUP-006',
      category: 'Biotechnology',
      contact: 'Diana Lee',
      email: 'diana@biomed.com',
      phone: '02-678-9012',
      address: 'Chonburi',
      totalOrders: 8,
      totalValue: 1850000,
      rating: 4.7,
      onTimeDelivery: 95,
      qualityScore: 97,
      status: 'pending',
    },
  ];

  get activeCount(): number {
    return this.suppliers.filter((s) => s.status === 'active').length;
  }

  get avgRating(): number {
    return (
      this.suppliers.reduce((acc, s) => acc + s.rating, 0) /
      this.suppliers.length
    );
  }

  get totalValue(): number {
    return this.suppliers.reduce((acc, s) => acc + s.totalValue, 0);
  }
}
