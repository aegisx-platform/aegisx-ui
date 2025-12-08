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

import { BudgetReservationService } from '../services/budget-reservations.service';
import {
  BudgetReservation,
  UpdateBudgetReservationRequest,
} from '../types/budget-reservations.types';
import {
  BudgetReservationFormComponent,
  BudgetReservationFormData,
} from './budget-reservations-form.component';

export interface BudgetReservationEditDialogData {
  budgetReservations: BudgetReservation;
}

@Component({
  selector: 'app-budget-reservations-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    BudgetReservationFormComponent,
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
        <div class="ax-title">Edit BudgetReservation</div>
        <div class="ax-subtitle">Update budgetreservation information</div>
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
    <app-budget-reservations-form
      mode="edit"
      [initialData]="data.budgetReservations"
      [loading]="loading()"
      (formSubmit)="onFormSubmit($event)"
      (formCancel)="onCancel()"
    ></app-budget-reservations-form>
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
export class BudgetReservationEditDialogComponent implements OnInit {
  private budgetReservationsService = inject(BudgetReservationService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(
    MatDialogRef<BudgetReservationEditDialogComponent>,
  );
  public data = inject<BudgetReservationEditDialogData>(MAT_DIALOG_DATA);

  loading = signal<boolean>(false);

  ngOnInit() {
    // No additional setup needed since shared form handles data population
  }

  async onFormSubmit(formData: BudgetReservationFormData) {
    this.loading.set(true);

    try {
      // Cast through unknown to handle form data type conversion (form values may be strings)
      const updateRequest =
        formData as unknown as UpdateBudgetReservationRequest;
      const result =
        await this.budgetReservationsService.updateBudgetReservation(
          this.data.budgetReservations.id,
          updateRequest,
        );

      if (result) {
        this.snackBar.open('BudgetReservation updated successfully', 'Close', {
          duration: 3000,
        });
        this.dialogRef.close(result);
      } else {
        this.snackBar.open('Failed to update budgetreservation', 'Close', {
          duration: 5000,
        });
      }
    } catch (error: any) {
      const errorMessage = this.budgetReservationsService.permissionError()
        ? 'You do not have permission to update budgetreservation'
        : error?.message || 'Failed to update budgetreservation';
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
