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

import { BudgetTypeService } from '../services/budget-types.service';
import {
  BudgetType,
  UpdateBudgetTypeRequest,
} from '../types/budget-types.types';
import {
  BudgetTypeFormComponent,
  BudgetTypeFormData,
} from './budget-types-form.component';

export interface BudgetTypeEditDialogData {
  budgetTypes: BudgetType;
}

@Component({
  selector: 'app-budget-types-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    BudgetTypeFormComponent,
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
        <div class="ax-title">Edit BudgetType</div>
        <div class="ax-subtitle">Update budgettype information</div>
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
    <app-budget-types-form
      mode="edit"
      [initialData]="data.budgetTypes"
      [loading]="loading()"
      (formSubmit)="onFormSubmit($event)"
      (formCancel)="onCancel()"
    ></app-budget-types-form>
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
export class BudgetTypeEditDialogComponent implements OnInit {
  private budgetTypesService = inject(BudgetTypeService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<BudgetTypeEditDialogComponent>);
  public data = inject<BudgetTypeEditDialogData>(MAT_DIALOG_DATA);

  loading = signal<boolean>(false);

  ngOnInit() {
    // No additional setup needed since shared form handles data population
  }

  async onFormSubmit(formData: BudgetTypeFormData) {
    this.loading.set(true);

    try {
      // Cast through unknown to handle form data type conversion (form values may be strings)
      const updateRequest = formData as unknown as UpdateBudgetTypeRequest;
      const result = await this.budgetTypesService.updateBudgetType(
        this.data.budgetTypes.id,
        updateRequest,
      );

      if (result) {
        this.snackBar.open('BudgetType updated successfully', 'Close', {
          duration: 3000,
        });
        this.dialogRef.close(result);
      } else {
        this.snackBar.open('Failed to update budgettype', 'Close', {
          duration: 5000,
        });
      }
    } catch (error: any) {
      const errorMessage = this.budgetTypesService.permissionError()
        ? 'You do not have permission to update budgettype'
        : error?.message || 'Failed to update budgettype';
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
