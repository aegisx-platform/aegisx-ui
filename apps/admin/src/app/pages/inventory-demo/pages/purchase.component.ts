import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';
import { AxBreadcrumbComponent, BreadcrumbItem } from '@aegisx/ui';

interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: string;
  items: number;
  total: number;
  orderDate: string;
  expectedDate: string;
  status:
    | 'draft'
    | 'pending'
    | 'approved'
    | 'shipped'
    | 'received'
    | 'cancelled';
  createdBy: string;
}

@Component({
  selector: 'ax-inventory-purchase',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatMenuModule,
    MatTabsModule,
    MatChipsModule,
    MatPaginatorModule,
    MatDividerModule,
    AxBreadcrumbComponent,
  ],
  template: `
    <div class="purchase-page">
      <!-- Breadcrumb -->
      <ax-breadcrumb
        [items]="breadcrumbItems"
        separatorIcon="chevron_right"
        size="sm"
      ></ax-breadcrumb>

      <!-- Page Header -->
      <div class="page-header">
        <div class="page-title">
          <h1>Purchase Orders</h1>
          <p>Manage purchase orders and procurement</p>
        </div>
        <div class="page-actions">
          <button mat-flat-button color="primary">
            <mat-icon>add</mat-icon>
            Create PO
          </button>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="summary-cards">
        <mat-card appearance="outlined" class="summary-card">
          <mat-card-content>
            <div class="summary-icon draft">
              <mat-icon>edit_note</mat-icon>
            </div>
            <div class="summary-info">
              <span class="summary-value">3</span>
              <span class="summary-label">Draft</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card appearance="outlined" class="summary-card">
          <mat-card-content>
            <div class="summary-icon pending">
              <mat-icon>hourglass_empty</mat-icon>
            </div>
            <div class="summary-info">
              <span class="summary-value">8</span>
              <span class="summary-label">Pending Approval</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card appearance="outlined" class="summary-card">
          <mat-card-content>
            <div class="summary-icon approved">
              <mat-icon>check_circle</mat-icon>
            </div>
            <div class="summary-info">
              <span class="summary-value">12</span>
              <span class="summary-label">Approved</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card appearance="outlined" class="summary-card">
          <mat-card-content>
            <div class="summary-icon shipped">
              <mat-icon>local_shipping</mat-icon>
            </div>
            <div class="summary-info">
              <span class="summary-value">5</span>
              <span class="summary-label">In Transit</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card appearance="outlined" class="summary-card">
          <mat-card-content>
            <div class="summary-icon total">
              <mat-icon>receipt_long</mat-icon>
            </div>
            <div class="summary-info">
              <span class="summary-value">{{
                totalValue | currency: 'THB' : 'symbol' : '1.0-0'
              }}</span>
              <span class="summary-label">Total Value</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Tabs & Table -->
      <mat-card appearance="outlined" class="table-card">
        <mat-tab-group>
          <mat-tab label="All Orders">
            <div class="tab-content">
              <table mat-table [dataSource]="purchaseOrders" class="po-table">
                <ng-container matColumnDef="poNumber">
                  <th mat-header-cell *matHeaderCellDef>PO Number</th>
                  <td mat-cell *matCellDef="let po">
                    <span class="po-number">{{ po.poNumber }}</span>
                  </td>
                </ng-container>

                <ng-container matColumnDef="supplier">
                  <th mat-header-cell *matHeaderCellDef>Supplier</th>
                  <td mat-cell *matCellDef="let po">
                    <div class="supplier-cell">
                      <span class="supplier-name">{{ po.supplier }}</span>
                    </div>
                  </td>
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

                <ng-container matColumnDef="orderDate">
                  <th mat-header-cell *matHeaderCellDef>Order Date</th>
                  <td mat-cell *matCellDef="let po">{{ po.orderDate }}</td>
                </ng-container>

                <ng-container matColumnDef="expectedDate">
                  <th mat-header-cell *matHeaderCellDef>Expected</th>
                  <td mat-cell *matCellDef="let po">{{ po.expectedDate }}</td>
                </ng-container>

                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>Status</th>
                  <td mat-cell *matCellDef="let po">
                    <span class="status-badge" [class]="po.status">
                      {{ getStatusLabel(po.status) }}
                    </span>
                  </td>
                </ng-container>

                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef></th>
                  <td mat-cell *matCellDef="let po">
                    <button mat-icon-button [matMenuTriggerFor]="rowMenu">
                      <mat-icon>more_vert</mat-icon>
                    </button>
                    <mat-menu #rowMenu="matMenu">
                      <button mat-menu-item>
                        <mat-icon>visibility</mat-icon> View Details
                      </button>
                      <button mat-menu-item>
                        <mat-icon>edit</mat-icon> Edit
                      </button>
                      <button mat-menu-item>
                        <mat-icon>content_copy</mat-icon> Duplicate
                      </button>
                      <button mat-menu-item>
                        <mat-icon>print</mat-icon> Print
                      </button>
                      @if (po.status === 'pending') {
                        <button mat-menu-item>
                          <mat-icon>check</mat-icon> Approve
                        </button>
                      }
                      @if (po.status === 'shipped') {
                        <button mat-menu-item>
                          <mat-icon>inventory</mat-icon> Mark Received
                        </button>
                      }
                      <mat-divider></mat-divider>
                      <button mat-menu-item class="danger">
                        <mat-icon>cancel</mat-icon> Cancel Order
                      </button>
                    </mat-menu>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr
                  mat-row
                  *matRowDef="let row; columns: displayedColumns"
                ></tr>
              </table>

              <mat-paginator
                [length]="50"
                [pageSize]="10"
                [pageSizeOptions]="[5, 10, 25]"
                showFirstLastButtons
              ></mat-paginator>
            </div>
          </mat-tab>
          <mat-tab label="Pending (8)"></mat-tab>
          <mat-tab label="Approved (12)"></mat-tab>
          <mat-tab label="In Transit (5)"></mat-tab>
        </mat-tab-group>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .purchase-page {
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

      .summary-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
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

        &.draft {
          background: var(--ax-background-muted);
          color: var(--ax-text-secondary);
        }

        &.pending {
          background: var(--ax-warning-faint);
          color: var(--ax-warning-default);
        }

        &.approved {
          background: var(--ax-info-faint);
          color: var(--ax-info-default);
        }

        &.shipped {
          background: var(--ax-brand-faint);
          color: var(--ax-brand-default);
        }

        &.total {
          background: var(--ax-success-faint);
          color: var(--ax-success-default);
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

      .table-card {
        overflow: hidden;
      }

      .tab-content {
        padding: 0;
      }

      .po-table {
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

      .po-number {
        font-weight: 600;
        color: var(--ax-brand-default);
      }

      .supplier-name {
        font-weight: 500;
        color: var(--ax-text-primary);
      }

      .po-total {
        font-weight: 600;
        color: var(--ax-text-heading);
      }

      .status-badge {
        display: inline-flex;
        padding: 0.25rem 0.625rem;
        font-size: 0.75rem;
        font-weight: 600;
        border-radius: var(--ax-radius-full);

        &.draft {
          background: var(--ax-background-muted);
          color: var(--ax-text-secondary);
        }

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

      .danger {
        color: var(--ax-error-default);
      }

      mat-paginator {
        border-top: 1px solid var(--ax-border-muted);
      }
    `,
  ],
})
export class PurchaseComponent {
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', url: '/', icon: 'home' },
    { label: 'Inventory', url: '/inventory-demo' },
    { label: 'Purchase Orders' },
  ];

  displayedColumns = [
    'poNumber',
    'supplier',
    'items',
    'total',
    'orderDate',
    'expectedDate',
    'status',
    'actions',
  ];

  totalValue = 2450000;

  purchaseOrders: PurchaseOrder[] = [
    {
      id: '1',
      poNumber: 'PO-2024-001',
      supplier: 'MedSupply Co.',
      items: 15,
      total: 125000,
      orderDate: '2024-01-15',
      expectedDate: '2024-01-22',
      status: 'pending',
      createdBy: 'John Doe',
    },
    {
      id: '2',
      poNumber: 'PO-2024-002',
      supplier: 'PharmaCorp',
      items: 8,
      total: 85000,
      orderDate: '2024-01-14',
      expectedDate: '2024-01-21',
      status: 'approved',
      createdBy: 'Jane Smith',
    },
    {
      id: '3',
      poNumber: 'PO-2024-003',
      supplier: 'EquipMed Ltd.',
      items: 3,
      total: 450000,
      orderDate: '2024-01-13',
      expectedDate: '2024-01-25',
      status: 'shipped',
      createdBy: 'John Doe',
    },
    {
      id: '4',
      poNumber: 'PO-2024-004',
      supplier: 'LabTech Inc.',
      items: 22,
      total: 67500,
      orderDate: '2024-01-12',
      expectedDate: '2024-01-19',
      status: 'received',
      createdBy: 'Jane Smith',
    },
    {
      id: '5',
      poNumber: 'PO-2024-005',
      supplier: 'SafeMed Supplies',
      items: 10,
      total: 92000,
      orderDate: '2024-01-11',
      expectedDate: '2024-01-18',
      status: 'pending',
      createdBy: 'John Doe',
    },
    {
      id: '6',
      poNumber: 'PO-2024-006',
      supplier: 'MedSupply Co.',
      items: 18,
      total: 156000,
      orderDate: '2024-01-10',
      expectedDate: '2024-01-17',
      status: 'approved',
      createdBy: 'Jane Smith',
    },
    {
      id: '7',
      poNumber: 'PO-2024-007',
      supplier: 'PharmaCorp',
      items: 5,
      total: 42000,
      orderDate: '2024-01-09',
      expectedDate: '2024-01-16',
      status: 'shipped',
      createdBy: 'John Doe',
    },
    {
      id: '8',
      poNumber: 'PO-2024-008',
      supplier: 'BioMed Systems',
      items: 2,
      total: 890000,
      orderDate: '2024-01-08',
      expectedDate: '2024-02-08',
      status: 'draft',
      createdBy: 'Jane Smith',
    },
  ];

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      draft: 'Draft',
      pending: 'Pending',
      approved: 'Approved',
      shipped: 'In Transit',
      received: 'Received',
      cancelled: 'Cancelled',
    };
    return labels[status] || status;
  }
}
