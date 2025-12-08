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

import { AdjustmentReasonService } from '../services/adjustment-reasons.service';
import {
  AdjustmentReason,
  UpdateAdjustmentReasonRequest,
} from '../types/adjustment-reasons.types';
import {
  AdjustmentReasonFormComponent,
  AdjustmentReasonFormData,
} from './adjustment-reasons-form.component';

export interface AdjustmentReasonEditDialogData {
  adjustmentReasons: AdjustmentReason;
}

@Component({
  selector: 'app-adjustment-reasons-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    AdjustmentReasonFormComponent,
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
        <div class="ax-title">Edit AdjustmentReason</div>
        <div class="ax-subtitle">Update adjustmentreason information</div>
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
    <app-adjustment-reasons-form
      mode="edit"
      [initialData]="data.adjustmentReasons"
      [loading]="loading()"
      (formSubmit)="onFormSubmit($event)"
      (formCancel)="onCancel()"
    ></app-adjustment-reasons-form>
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
export class AdjustmentReasonEditDialogComponent implements OnInit {
  private adjustmentReasonsService = inject(AdjustmentReasonService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<AdjustmentReasonEditDialogComponent>);
  public data = inject<AdjustmentReasonEditDialogData>(MAT_DIALOG_DATA);

  loading = signal<boolean>(false);

  ngOnInit() {
    // No additional setup needed since shared form handles data population
  }

  async onFormSubmit(formData: AdjustmentReasonFormData) {
    this.loading.set(true);

    try {
      // Cast through unknown to handle form data type conversion (form values may be strings)
      const updateRequest =
        formData as unknown as UpdateAdjustmentReasonRequest;
      const result = await this.adjustmentReasonsService.updateAdjustmentReason(
        this.data.adjustmentReasons.id,
        updateRequest,
      );

      if (result) {
        this.snackBar.open('AdjustmentReason updated successfully', 'Close', {
          duration: 3000,
        });
        this.dialogRef.close(result);
      } else {
        this.snackBar.open('Failed to update adjustmentreason', 'Close', {
          duration: 5000,
        });
      }
    } catch (error: any) {
      const errorMessage = this.adjustmentReasonsService.permissionError()
        ? 'You do not have permission to update adjustmentreason'
        : error?.message || 'Failed to update adjustmentreason';
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
