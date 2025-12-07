import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DrugPackRatioService } from '../services/drug-pack-ratios.service';
import { CreateDrugPackRatioRequest } from '../types/drug-pack-ratios.types';
import {
  DrugPackRatioFormComponent,
  DrugPackRatioFormData,
} from './drug-pack-ratios-form.component';

@Component({
  selector: 'app-drug-pack-ratios-create-dialog',
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
    <h2 mat-dialog-title class="ax-header ax-header-info">
      <div class="ax-icon-info">
        <mat-icon>add_circle</mat-icon>
      </div>
      <div class="header-text">
        <div class="ax-title">Create New DrugPackRatio</div>
        <div class="ax-subtitle">
          Add a new drugpackratio to your collection
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
    <app-drug-pack-ratios-form
      mode="create"
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
export class DrugPackRatioCreateDialogComponent {
  private drugPackRatiosService = inject(DrugPackRatioService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<DrugPackRatioCreateDialogComponent>);

  loading = signal<boolean>(false);

  async onFormSubmit(formData: DrugPackRatioFormData) {
    this.loading.set(true);

    try {
      // Cast through unknown to handle form data type conversion (form values may be strings)
      const createRequest = formData as unknown as CreateDrugPackRatioRequest;
      const result =
        await this.drugPackRatiosService.createDrugPackRatio(createRequest);

      if (result) {
        this.snackBar.open('DrugPackRatio created successfully', 'Close', {
          duration: 3000,
        });
        this.dialogRef.close(result);
      } else {
        this.snackBar.open('Failed to create drugpackratio', 'Close', {
          duration: 5000,
        });
      }
    } catch (error: any) {
      const errorMessage = this.drugPackRatiosService.permissionError()
        ? 'You do not have permission to create drugpackratio'
        : error?.message || 'Failed to create drugpackratio';
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
