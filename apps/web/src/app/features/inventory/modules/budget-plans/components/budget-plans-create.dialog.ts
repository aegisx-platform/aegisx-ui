import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BudgetPlanService } from '../services/budget-plans.service';
import { CreateBudgetPlanRequest } from '../types/budget-plans.types';
import {
  BudgetPlanFormComponent,
  BudgetPlanFormData,
} from './budget-plans-form.component';

@Component({
  selector: 'app-budget-plans-create-dialog',
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
    <h2 mat-dialog-title class="ax-header ax-header-info">
      <div class="ax-icon-info">
        <mat-icon>add_circle</mat-icon>
      </div>
      <div class="header-text">
        <div class="ax-title">Create New BudgetPlan</div>
        <div class="ax-subtitle">Add a new budgetplan to your collection</div>
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
      mode="create"
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
export class BudgetPlanCreateDialogComponent {
  private budgetPlansService = inject(BudgetPlanService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<BudgetPlanCreateDialogComponent>);

  loading = signal<boolean>(false);

  async onFormSubmit(formData: BudgetPlanFormData) {
    this.loading.set(true);

    try {
      // Cast through unknown to handle form data type conversion (form values may be strings)
      const createRequest = formData as unknown as CreateBudgetPlanRequest;
      const result =
        await this.budgetPlansService.createBudgetPlan(createRequest);

      if (result) {
        this.snackBar.open('BudgetPlan created successfully', 'Close', {
          duration: 3000,
        });
        this.dialogRef.close(result);
      } else {
        this.snackBar.open('Failed to create budgetplan', 'Close', {
          duration: 5000,
        });
      }
    } catch (error: any) {
      const errorMessage = this.budgetPlansService.permissionError()
        ? 'You do not have permission to create budgetplan'
        : error?.message || 'Failed to create budgetplan';
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
