import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { BudgetAllocation } from '../types/budget-allocations.types';

export interface BudgetAllocationViewDialogData {
  budgetAllocations: BudgetAllocation;
}

@Component({
  selector: 'app-budget-allocations-view-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <!-- Dialog Header -->
    <h2 mat-dialog-title class="ax-header ax-header-neutral">
      <div class="ax-icon-neutral">
        <mat-icon>visibility</mat-icon>
      </div>
      <div class="header-text">
        <div class="ax-title">BudgetAllocation Details</div>
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
            <div class="ax-dialog-field-label">Fiscal Year</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetAllocations?.fiscal_year ?? '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Budget Id</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetAllocations?.budget_id ?? '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Department Id</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetAllocations?.department_id ?? '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Total Budget</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetAllocations?.total_budget ?? '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Q1 Budget</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetAllocations?.q1_budget ?? '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Q2 Budget</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetAllocations?.q2_budget ?? '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Q3 Budget</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetAllocations?.q3_budget ?? '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Q4 Budget</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetAllocations?.q4_budget ?? '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Q1 Spent</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetAllocations?.q1_spent ?? '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Q2 Spent</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetAllocations?.q2_spent ?? '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Q3 Spent</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetAllocations?.q3_spent ?? '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Q4 Spent</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetAllocations?.q4_spent ?? '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Total Spent</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetAllocations?.total_spent ?? '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Remaining Budget</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetAllocations?.remaining_budget ?? '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Is Active</div>
            <div class="ax-dialog-field-value">
              @if (data.budgetAllocations?.is_active) {
                <span class="ax-dialog-status-success">
                  <span class="ax-dialog-status-dot"></span>
                  Yes
                </span>
              } @else {
                <span class="ax-dialog-status-neutral">
                  <span class="ax-dialog-status-dot"></span>
                  No
                </span>
              }
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
              <code>{{ data.budgetAllocations?.id }}</code>
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Created At</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetAllocations?.created_at | date: 'medium' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Updated At</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetAllocations?.updated_at | date: 'medium' }}
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
        Edit BudgetAllocation
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
export class BudgetAllocationViewDialogComponent {
  private dialogRef = inject(MatDialogRef<BudgetAllocationViewDialogComponent>);
  protected data = inject<BudgetAllocationViewDialogData>(MAT_DIALOG_DATA);

  onClose() {
    this.dialogRef.close();
  }

  onEdit() {
    this.dialogRef.close({ action: 'edit', data: this.data.budgetAllocations });
  }
}
