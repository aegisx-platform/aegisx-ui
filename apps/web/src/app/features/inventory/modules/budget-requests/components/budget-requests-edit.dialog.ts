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

import { BudgetRequestService } from '../services/budget-requests.service';
import {
  BudgetRequest,
  UpdateBudgetRequestRequest,
} from '../types/budget-requests.types';
import {
  BudgetRequestFormComponent,
  BudgetRequestFormData,
} from './budget-requests-form.component';

export interface BudgetRequestEditDialogData {
  budgetRequests: BudgetRequest;
}

@Component({
  selector: 'app-budget-requests-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    BudgetRequestFormComponent,
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
        <div class="ax-title">Edit BudgetRequest</div>
        <div class="ax-subtitle">Update budgetrequest information</div>
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
    <app-budget-requests-form
      mode="edit"
      [initialData]="data.budgetRequests"
      [loading]="loading()"
      (formSubmit)="onFormSubmit($event)"
      (formCancel)="onCancel()"
    ></app-budget-requests-form>
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
export class BudgetRequestEditDialogComponent implements OnInit {
  private budgetRequestsService = inject(BudgetRequestService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<BudgetRequestEditDialogComponent>);
  public data = inject<BudgetRequestEditDialogData>(MAT_DIALOG_DATA);

  loading = signal<boolean>(false);

  ngOnInit() {
    // No additional setup needed since shared form handles data population
  }

  async onFormSubmit(formData: BudgetRequestFormData) {
    this.loading.set(true);

    try {
      // Cast through unknown to handle form data type conversion (form values may be strings)
      const updateRequest = formData as unknown as UpdateBudgetRequestRequest;
      const result = await this.budgetRequestsService.updateBudgetRequest(
        this.data.budgetRequests.id,
        updateRequest,
      );

      if (result) {
        this.snackBar.open('BudgetRequest updated successfully', 'Close', {
          duration: 3000,
        });
        this.dialogRef.close(result);
      } else {
        this.snackBar.open('Failed to update budgetrequest', 'Close', {
          duration: 5000,
        });
      }
    } catch (error: any) {
      const errorMessage = this.budgetRequestsService.permissionError()
        ? 'You do not have permission to update budgetrequest'
        : error?.message || 'Failed to update budgetrequest';
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
