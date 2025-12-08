import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BudgetPlanItemService } from '../services/budget-plan-items.service';
import { CreateBudgetPlanItemRequest } from '../types/budget-plan-items.types';
import {
  BudgetPlanItemFormComponent,
  BudgetPlanItemFormData,
} from './budget-plan-items-form.component';

@Component({
  selector: 'app-budget-plan-items-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    BudgetPlanItemFormComponent,
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
        <div class="ax-title">Create New BudgetPlanItem</div>
        <div class="ax-subtitle">
          Add a new budgetplanitem to your collection
        </div>
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
    <app-budget-plan-items-form
      mode="create"
      [loading]="loading()"
      (formSubmit)="onFormSubmit($event)"
      (formCancel)="onCancel()"
    ></app-budget-plan-items-form>
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
export class BudgetPlanItemCreateDialogComponent {
  private budgetPlanItemsService = inject(BudgetPlanItemService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<BudgetPlanItemCreateDialogComponent>);

  loading = signal<boolean>(false);

  async onFormSubmit(formData: BudgetPlanItemFormData) {
    this.loading.set(true);

    try {
      // Cast through unknown to handle form data type conversion (form values may be strings)
      const createRequest = formData as unknown as CreateBudgetPlanItemRequest;
      const result =
        await this.budgetPlanItemsService.createBudgetPlanItem(createRequest);

      if (result) {
        this.snackBar.open('BudgetPlanItem created successfully', 'Close', {
          duration: 3000,
        });
        this.dialogRef.close(result);
      } else {
        this.snackBar.open('Failed to create budgetplanitem', 'Close', {
          duration: 5000,
        });
      }
    } catch (error: any) {
      const errorMessage = this.budgetPlanItemsService.permissionError()
        ? 'You do not have permission to create budgetplanitem'
        : error?.message || 'Failed to create budgetplanitem';
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
