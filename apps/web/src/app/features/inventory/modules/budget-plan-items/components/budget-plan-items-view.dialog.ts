import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { BudgetPlanItem } from '../types/budget-plan-items.types';

export interface BudgetPlanItemViewDialogData {
  budgetPlanItems: BudgetPlanItem;
}

@Component({
  selector: 'app-budget-plan-items-view-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <!-- Dialog Header -->
    <h2 mat-dialog-title class="ax-header ax-header-neutral">
      <div class="ax-icon-neutral">
        <mat-icon>visibility</mat-icon>
      </div>
      <div class="header-text">
        <div class="ax-title">BudgetPlanItem Details</div>
        <div class="ax-subtitle">View complete information</div>
      </div>
      <button
        type="button"
        mat-icon-button
        [mat-dialog-close]="false"
        aria-label="Close dialog"
      >
        <mat-icon>close</mat-icon>
      </button>
    </h2>

    <!-- Dialog Content -->
    <mat-dialog-content>
      <!-- Basic Information -->
      <div class="ax-dialog-section">
        <h3 class="ax-dialog-section-title">Basic Information</h3>
        <div class="ax-dialog-section-content">
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Budget Plan Id</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetPlanItems?.budget_plan_id ?? '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Generic Id</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetPlanItems?.generic_id ?? '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Last Year Qty</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetPlanItems?.last_year_qty ?? '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Two Years Ago Qty</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetPlanItems?.two_years_ago_qty ?? '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Three Years Ago Qty</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetPlanItems?.three_years_ago_qty ?? '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Planned Quantity</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetPlanItems?.planned_quantity ?? '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Estimated Unit Price</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetPlanItems?.estimated_unit_price ?? '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Total Planned Value</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetPlanItems?.total_planned_value ?? '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Q1 Planned Qty</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetPlanItems?.q1_planned_qty ?? '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Q2 Planned Qty</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetPlanItems?.q2_planned_qty ?? '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Q3 Planned Qty</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetPlanItems?.q3_planned_qty ?? '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Q4 Planned Qty</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetPlanItems?.q4_planned_qty ?? '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Q1 Purchased Qty</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetPlanItems?.q1_purchased_qty ?? '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Q2 Purchased Qty</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetPlanItems?.q2_purchased_qty ?? '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Q3 Purchased Qty</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetPlanItems?.q3_purchased_qty ?? '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Q4 Purchased Qty</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetPlanItems?.q4_purchased_qty ?? '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Total Purchased Qty</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetPlanItems?.total_purchased_qty ?? '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Total Purchased Value</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetPlanItems?.total_purchased_value ?? '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Notes</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetPlanItems?.notes || '-' }}
            </div>
          </div>
        </div>
      </div>
      <!-- Record Information -->
      <div class="ax-dialog-section">
        <h3 class="ax-dialog-section-title">Record Information</h3>
        <div class="ax-dialog-section-content ax-dialog-section-metadata">
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Id</div>
            <div class="ax-dialog-field-value">
              <code>{{ data.budgetPlanItems?.id }}</code>
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Created At</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetPlanItems?.created_at | date: 'medium' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Updated At</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetPlanItems?.updated_at | date: 'medium' }}
            </div>
          </div>
        </div>
      </div>
    </mat-dialog-content>

    <!-- Dialog Actions -->
    <mat-dialog-actions align="end">
      <button mat-button (click)="onClose()">Close</button>
      <button mat-flat-button color="primary" (click)="onEdit()">
        <mat-icon>edit</mat-icon>
        Edit BudgetPlanItem
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      /* Header text wrapper for flex layout */
      .header-text {
        flex: 1;
        min-width: 0;
      }

      /* Badge Styles */
      .badge-purple {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        background: var(--ax-info-faint, #f3e8ff);
        color: var(--ax-info-emphasis, #7c3aed);
        border-radius: var(--ax-radius-sm, 4px);
        font-size: var(--ax-text-xs, 0.75rem);
      }

      /* Code Display */
      code {
        padding: 2px 6px;
        background: var(--ax-background-subtle, #f5f5f5);
        border-radius: var(--ax-radius-sm, 3px);
        font-size: 0.85rem;
        font-family: monospace;
      }

      /* Price Display */
      .price {
        font-weight: var(--ax-font-semibold, 600);
        color: var(--ax-success-emphasis, #059669);
      }
    `,
  ],
})
export class BudgetPlanItemViewDialogComponent {
  private dialogRef = inject(MatDialogRef<BudgetPlanItemViewDialogComponent>);
  protected data = inject<BudgetPlanItemViewDialogData>(MAT_DIALOG_DATA);

  onClose() {
    this.dialogRef.close();
  }

  onEdit() {
    this.dialogRef.close({ action: 'edit', data: this.data.budgetPlanItems });
  }
}
