import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { HospitalService } from '../services/hospitals.service';
import { CreateHospitalRequest } from '../types/hospitals.types';
import {
  HospitalFormComponent,
  HospitalFormData,
} from './hospitals-form.component';

@Component({
  selector: 'app-hospitals-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    HospitalFormComponent,
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
        <div class="ax-title">Create New Hospital</div>
        <div class="ax-subtitle">Add a new hospital to your collection</div>
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
    <app-hospitals-form
      mode="create"
      [loading]="loading()"
      (formSubmit)="onFormSubmit($event)"
      (formCancel)="onCancel()"
    ></app-hospitals-form>
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
export class HospitalCreateDialogComponent {
  private hospitalsService = inject(HospitalService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<HospitalCreateDialogComponent>);

  loading = signal<boolean>(false);

  async onFormSubmit(formData: HospitalFormData) {
    this.loading.set(true);

    try {
      // Cast through unknown to handle form data type conversion (form values may be strings)
      const createRequest = formData as unknown as CreateHospitalRequest;
      const result = await this.hospitalsService.createHospital(createRequest);

      if (result) {
        this.snackBar.open('Hospital created successfully', 'Close', {
          duration: 3000,
        });
        this.dialogRef.close(result);
      } else {
        this.snackBar.open('Failed to create hospital', 'Close', {
          duration: 5000,
        });
      }
    } catch (error: any) {
      const errorMessage = this.hospitalsService.permissionError()
        ? 'You do not have permission to create hospital'
        : error?.message || 'Failed to create hospital';
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
