import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BudgetRequestService } from '../services/budget-requests.service';
import { CreateBudgetRequestRequest } from '../types/budget-requests.types';
import {
  BudgetRequestFormComponent,
  BudgetRequestFormData,
} from './budget-requests-form.component';

@Component({
  selector: 'app-budget-requests-create-dialog',
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
    <h2 mat-dialog-title class="ax-header ax-header-info">
      <div class="ax-icon-info">
        <mat-icon>add_circle</mat-icon>
      </div>
      <div class="header-text">
        <div class="ax-title">Create New BudgetRequest</div>
        <div class="ax-subtitle">
          Add a new budgetrequest to your collection
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
    <app-budget-requests-form
      mode="create"
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
export class BudgetRequestCreateDialogComponent {
  private budgetRequestsService = inject(BudgetRequestService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<BudgetRequestCreateDialogComponent>);

  loading = signal<boolean>(false);

  async onFormSubmit(formData: BudgetRequestFormData) {
    this.loading.set(true);

    try {
      // Cast through unknown to handle form data type conversion (form values may be strings)
      const createRequest = formData as unknown as CreateBudgetRequestRequest;
      const result =
        await this.budgetRequestsService.createBudgetRequest(createRequest);

      if (result) {
        this.snackBar.open('BudgetRequest created successfully', 'Close', {
          duration: 3000,
        });
        this.dialogRef.close(result);
      } else {
        this.snackBar.open('Failed to create budgetrequest', 'Close', {
          duration: 5000,
        });
      }
    } catch (error: any) {
      const errorMessage = this.budgetRequestsService.permissionError()
        ? 'You do not have permission to create budgetrequest'
        : error?.message || 'Failed to create budgetrequest';
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
