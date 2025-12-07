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

import { CompanieService } from '../services/companies.service';
import { Companie, UpdateCompanieRequest } from '../types/companies.types';
import {
  CompanieFormComponent,
  CompanieFormData,
} from './companies-form.component';

export interface CompanieEditDialogData {
  companies: Companie;
}

@Component({
  selector: 'app-companies-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    CompanieFormComponent,
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
        <div class="ax-title">Edit Companie</div>
        <div class="ax-subtitle">Update companie information</div>
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
    <app-companies-form
      mode="edit"
      [initialData]="data.companies"
      [loading]="loading()"
      (formSubmit)="onFormSubmit($event)"
      (formCancel)="onCancel()"
    ></app-companies-form>
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
export class CompanieEditDialogComponent implements OnInit {
  private companiesService = inject(CompanieService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<CompanieEditDialogComponent>);
  public data = inject<CompanieEditDialogData>(MAT_DIALOG_DATA);

  loading = signal<boolean>(false);

  ngOnInit() {
    // No additional setup needed since shared form handles data population
  }

  async onFormSubmit(formData: CompanieFormData) {
    this.loading.set(true);

    try {
      // Cast through unknown to handle form data type conversion (form values may be strings)
      const updateRequest = formData as unknown as UpdateCompanieRequest;
      const result = await this.companiesService.updateCompanie(
        this.data.companies.id,
        updateRequest,
      );

      if (result) {
        this.snackBar.open('Companie updated successfully', 'Close', {
          duration: 3000,
        });
        this.dialogRef.close(result);
      } else {
        this.snackBar.open('Failed to update companie', 'Close', {
          duration: 5000,
        });
      }
    } catch (error: any) {
      const errorMessage = this.companiesService.permissionError()
        ? 'You do not have permission to update companie'
        : error?.message || 'Failed to update companie';
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
