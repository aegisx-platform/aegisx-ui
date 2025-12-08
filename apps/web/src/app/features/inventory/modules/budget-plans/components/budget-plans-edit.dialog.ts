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

import { BudgetPlanService } from '../services/budget-plans.service';
import {
  BudgetPlan,
  UpdateBudgetPlanRequest,
} from '../types/budget-plans.types';
import {
  BudgetPlanFormComponent,
  BudgetPlanFormData,
} from './budget-plans-form.component';

export interface BudgetPlanEditDialogData {
  budgetPlans: BudgetPlan;
}

@Component({
  selector: 'app-budget-plans-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    BudgetPlanFormComponent,
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
        <div class="ax-title">Edit BudgetPlan</div>
        <div class="ax-subtitle">Update budgetplan information</div>
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
    <app-budget-plans-form
      mode="edit"
      [initialData]="data.budgetPlans"
      [loading]="loading()"
      (formSubmit)="onFormSubmit($event)"
      (formCancel)="onCancel()"
    ></app-budget-plans-form>
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
export class BudgetPlanEditDialogComponent implements OnInit {
  private budgetPlansService = inject(BudgetPlanService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<BudgetPlanEditDialogComponent>);
  public data = inject<BudgetPlanEditDialogData>(MAT_DIALOG_DATA);

  loading = signal<boolean>(false);

  ngOnInit() {
    // No additional setup needed since shared form handles data population
  }

  async onFormSubmit(formData: BudgetPlanFormData) {
    this.loading.set(true);

    try {
      // Cast through unknown to handle form data type conversion (form values may be strings)
      const updateRequest = formData as unknown as UpdateBudgetPlanRequest;
      const result = await this.budgetPlansService.updateBudgetPlan(
        this.data.budgetPlans.id,
        updateRequest,
      );

      if (result) {
        this.snackBar.open('BudgetPlan updated successfully', 'Close', {
          duration: 3000,
        });
        this.dialogRef.close(result);
      } else {
        this.snackBar.open('Failed to update budgetplan', 'Close', {
          duration: 5000,
        });
      }
    } catch (error: any) {
      const errorMessage = this.budgetPlansService.permissionError()
        ? 'You do not have permission to update budgetplan'
        : error?.message || 'Failed to update budgetplan';
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
