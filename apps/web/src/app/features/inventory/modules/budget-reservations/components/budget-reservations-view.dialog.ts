import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { BudgetReservation } from '../types/budget-reservations.types';

export interface BudgetReservationViewDialogData {
  budgetReservations: BudgetReservation;
}

@Component({
  selector: 'app-budget-reservations-view-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <!-- Dialog Header -->
    <h2 mat-dialog-title class="ax-header ax-header-neutral">
      <div class="ax-icon-neutral">
        <mat-icon>visibility</mat-icon>
      </div>
      <div class="header-text">
        <div class="ax-title">BudgetReservation Details</div>
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
            <div class="ax-dialog-field-label">Allocation Id</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetReservations?.allocation_id ?? '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Pr Id</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetReservations?.pr_id ?? '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Reserved Amount</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetReservations?.reserved_amount ?? '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Quarter</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetReservations?.quarter ?? '-' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Reservation Date</div>
            <div class="ax-dialog-field-value">
              {{
                data.budgetReservations?.reservation_date | date: 'mediumDate'
              }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Expires Date</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetReservations?.expires_date | date: 'mediumDate' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Is Released</div>
            <div class="ax-dialog-field-value">
              @if (data.budgetReservations?.is_released) {
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
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Released At</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetReservations?.released_at | date: 'mediumDate' }}
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
              <code>{{ data.budgetReservations?.id }}</code>
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Created At</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetReservations?.created_at | date: 'medium' }}
            </div>
          </div>
          <div class="ax-dialog-field-row">
            <div class="ax-dialog-field-label">Updated At</div>
            <div class="ax-dialog-field-value">
              {{ data.budgetReservations?.updated_at | date: 'medium' }}
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
        Edit BudgetReservation
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
export class BudgetReservationViewDialogComponent {
  private dialogRef = inject(
    MatDialogRef<BudgetReservationViewDialogComponent>,
  );
  protected data = inject<BudgetReservationViewDialogData>(MAT_DIALOG_DATA);

  onClose() {
    this.dialogRef.close();
  }

  onEdit() {
    this.dialogRef.close({
      action: 'edit',
      data: this.data.budgetReservations,
    });
  }
}
