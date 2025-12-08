import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { BudgetAllocationService } from '../services/budget-allocations.service';
import {
  BudgetAllocation,
  UpdateBudgetAllocationRequest,
} from '../types/budget-allocations.types';
import {
  BudgetAllocationFormComponent,
  BudgetAllocationFormData,
} from './budget-allocations-form.component';

export interface BudgetAllocationEditDialogData {
  budgetAllocations: BudgetAllocation;
}

@Component({
  selector: 'app-budget-allocations-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    BudgetAllocationFormComponent,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <!-- Dialog Header -->
    <h2 mat-dialog-title class="ax-header ax-header-warning">
      <div class="ax-icon-warning">
        <mat-icon>edit</mat-icon>
      </div>
      <div class="header-text">
        <div class="ax-title">Edit BudgetAllocation</div>
        <div class="ax-subtitle">Update budgetallocation information</div>
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

    <!-- Dialog Content - Form component handles mat-dialog-content and mat-dialog-actions -->
    <app-budget-allocations-form
      mode="edit"
      [initialData]="data.budgetAllocations"
      [loading]="loading()"
      (formSubmit)="onFormSubmit($event)"
      (formCancel)="onCancel()"
    ></app-budget-allocations-form>
  `,
  styles: [
    `
      /* Header text wrapper for flex layout */
      .header-text {
        flex: 1;
        min-width: 0;
      }
    `,
  ],
})
export class BudgetAllocationEditDialogComponent implements OnInit {
  private budgetAllocationsService = inject(BudgetAllocationService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<BudgetAllocationEditDialogComponent>);
  public data = inject<BudgetAllocationEditDialogData>(MAT_DIALOG_DATA);

  loading = signal<boolean>(false);

  ngOnInit() {
    // No additional setup needed since shared form handles data population
  }

  async onFormSubmit(formData: BudgetAllocationFormData) {
    this.loading.set(true);

    try {
      // Cast through unknown to handle form data type conversion (form values may be strings)
      const updateRequest =
        formData as unknown as UpdateBudgetAllocationRequest;
      const result = await this.budgetAllocationsService.updateBudgetAllocation(
        this.data.budgetAllocations.id,
        updateRequest,
      );

      if (result) {
        this.snackBar.open('BudgetAllocation updated successfully', 'Close', {
          duration: 3000,
        });
        this.dialogRef.close(result);
      } else {
        this.snackBar.open('Failed to update budgetallocation', 'Close', {
          duration: 5000,
        });
      }
    } catch (error: any) {
      const errorMessage = this.budgetAllocationsService.permissionError()
        ? 'You do not have permission to update budgetallocation'
        : error?.message || 'Failed to update budgetallocation';
      this.snackBar.open(errorMessage, 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar'],
      });
    } finally {
      this.loading.set(false);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
