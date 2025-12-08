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

import { DrugPackRatioService } from '../services/drug-pack-ratios.service';
import {
  DrugPackRatio,
  UpdateDrugPackRatioRequest,
} from '../types/drug-pack-ratios.types';
import {
  DrugPackRatioFormComponent,
  DrugPackRatioFormData,
} from './drug-pack-ratios-form.component';

export interface DrugPackRatioEditDialogData {
  drugPackRatios: DrugPackRatio;
}

@Component({
  selector: 'app-drug-pack-ratios-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    DrugPackRatioFormComponent,
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
        <div class="ax-title">Edit DrugPackRatio</div>
        <div class="ax-subtitle">Update drugpackratio information</div>
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
    <app-drug-pack-ratios-form
      mode="edit"
      [initialData]="data.drugPackRatios"
      [loading]="loading()"
      (formSubmit)="onFormSubmit($event)"
      (formCancel)="onCancel()"
    ></app-drug-pack-ratios-form>
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
export class DrugPackRatioEditDialogComponent implements OnInit {
  private drugPackRatiosService = inject(DrugPackRatioService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<DrugPackRatioEditDialogComponent>);
  public data = inject<DrugPackRatioEditDialogData>(MAT_DIALOG_DATA);

  loading = signal<boolean>(false);

  ngOnInit() {
    // No additional setup needed since shared form handles data population
  }

  async onFormSubmit(formData: DrugPackRatioFormData) {
    this.loading.set(true);

    try {
      // Cast through unknown to handle form data type conversion (form values may be strings)
      const updateRequest = formData as unknown as UpdateDrugPackRatioRequest;
      const result = await this.drugPackRatiosService.updateDrugPackRatio(
        this.data.drugPackRatios.id,
        updateRequest,
      );

      if (result) {
        this.snackBar.open('DrugPackRatio updated successfully', 'Close', {
          duration: 3000,
        });
        this.dialogRef.close(result);
      } else {
        this.snackBar.open('Failed to update drugpackratio', 'Close', {
          duration: 5000,
        });
      }
    } catch (error: any) {
      const errorMessage = this.drugPackRatiosService.permissionError()
        ? 'You do not have permission to update drugpackratio'
        : error?.message || 'Failed to update drugpackratio';
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
