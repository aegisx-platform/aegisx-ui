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

import { BudgetPlanItemService } from '../services/budget-plan-items.service';
import {
  BudgetPlanItem,
  UpdateBudgetPlanItemRequest,
} from '../types/budget-plan-items.types';
import {
  BudgetPlanItemFormComponent,
  BudgetPlanItemFormData,
} from './budget-plan-items-form.component';

export interface BudgetPlanItemEditDialogData {
  budgetPlanItems: BudgetPlanItem;
}

@Component({
  selector: 'app-budget-plan-items-edit-dialog',
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
    <h2 mat-dialog-title class="ax-header ax-header-warning">
      <div class="ax-icon-warning">
        <mat-icon>edit</mat-icon>
      </div>
      <div class="header-text">
        <div class="ax-title">Edit BudgetPlanItem</div>
        <div class="ax-subtitle">Update budgetplanitem information</div>
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
      mode="edit"
      [initialData]="data.budgetPlanItems"
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
export class BudgetPlanItemEditDialogComponent implements OnInit {
  private budgetPlanItemsService = inject(BudgetPlanItemService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<BudgetPlanItemEditDialogComponent>);
  public data = inject<BudgetPlanItemEditDialogData>(MAT_DIALOG_DATA);

  loading = signal<boolean>(false);

  ngOnInit() {
    // No additional setup needed since shared form handles data population
  }

  async onFormSubmit(formData: BudgetPlanItemFormData) {
    this.loading.set(true);

    try {
      // Cast through unknown to handle form data type conversion (form values may be strings)
      const updateRequest = formData as unknown as UpdateBudgetPlanItemRequest;
      const result = await this.budgetPlanItemsService.updateBudgetPlanItem(
        this.data.budgetPlanItems.id,
        updateRequest,
      );

      if (result) {
        this.snackBar.open('BudgetPlanItem updated successfully', 'Close', {
          duration: 3000,
        });
        this.dialogRef.close(result);
      } else {
        this.snackBar.open('Failed to update budgetplanitem', 'Close', {
          duration: 5000,
        });
      }
    } catch (error: any) {
      const errorMessage = this.budgetPlanItemsService.permissionError()
        ? 'You do not have permission to update budgetplanitem'
        : error?.message || 'Failed to update budgetplanitem';
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
