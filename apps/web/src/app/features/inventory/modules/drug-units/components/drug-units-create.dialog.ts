import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DrugUnitService } from '../services/drug-units.service';
import { CreateDrugUnitRequest } from '../types/drug-units.types';
import {
  DrugUnitFormComponent,
  DrugUnitFormData,
} from './drug-units-form.component';

@Component({
  selector: 'app-drug-units-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    DrugUnitFormComponent,
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
        <div class="ax-title">Create New DrugUnit</div>
        <div class="ax-subtitle">Add a new drugunit to your collection</div>
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
    <app-drug-units-form
      mode="create"
      [loading]="loading()"
      (formSubmit)="onFormSubmit($event)"
      (formCancel)="onCancel()"
    ></app-drug-units-form>
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
export class DrugUnitCreateDialogComponent {
  private drugUnitsService = inject(DrugUnitService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<DrugUnitCreateDialogComponent>);

  loading = signal<boolean>(false);

  async onFormSubmit(formData: DrugUnitFormData) {
    this.loading.set(true);

    try {
      // Cast through unknown to handle form data type conversion (form values may be strings)
      const createRequest = formData as unknown as CreateDrugUnitRequest;
      const result = await this.drugUnitsService.createDrugUnit(createRequest);

      if (result) {
        this.snackBar.open('DrugUnit created successfully', 'Close', {
          duration: 3000,
        });
        this.dialogRef.close(result);
      } else {
        this.snackBar.open('Failed to create drugunit', 'Close', {
          duration: 5000,
        });
      }
    } catch (error: any) {
      const errorMessage = this.drugUnitsService.permissionError()
        ? 'You do not have permission to create drugunit'
        : error?.message || 'Failed to create drugunit';
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
