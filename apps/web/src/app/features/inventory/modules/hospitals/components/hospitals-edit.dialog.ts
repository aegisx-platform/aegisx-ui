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

import { HospitalService } from '../services/hospitals.service';
import { Hospital, UpdateHospitalRequest } from '../types/hospitals.types';
import {
  HospitalFormComponent,
  HospitalFormData,
} from './hospitals-form.component';

export interface HospitalEditDialogData {
  hospitals: Hospital;
}

@Component({
  selector: 'app-hospitals-edit-dialog',
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
    <h2 mat-dialog-title class="ax-header ax-header-warning">
      <div class="ax-icon-warning">
        <mat-icon>edit</mat-icon>
      </div>
      <div class="header-text">
        <div class="ax-title">Edit Hospital</div>
        <div class="ax-subtitle">Update hospital information</div>
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
      mode="edit"
      [initialData]="data.hospitals"
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
export class HospitalEditDialogComponent implements OnInit {
  private hospitalsService = inject(HospitalService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<HospitalEditDialogComponent>);
  public data = inject<HospitalEditDialogData>(MAT_DIALOG_DATA);

  loading = signal<boolean>(false);

  ngOnInit() {
    // No additional setup needed since shared form handles data population
  }

  async onFormSubmit(formData: HospitalFormData) {
    this.loading.set(true);

    try {
      // Cast through unknown to handle form data type conversion (form values may be strings)
      const updateRequest = formData as unknown as UpdateHospitalRequest;
      const result = await this.hospitalsService.updateHospital(
        this.data.hospitals.id,
        updateRequest,
      );

      if (result) {
        this.snackBar.open('Hospital updated successfully', 'Close', {
          duration: 3000,
        });
        this.dialogRef.close(result);
      } else {
        this.snackBar.open('Failed to update hospital', 'Close', {
          duration: 5000,
        });
      }
    } catch (error: any) {
      const errorMessage = this.hospitalsService.permissionError()
        ? 'You do not have permission to update hospital'
        : error?.message || 'Failed to update hospital';
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
