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

import { DrugGenericService } from '../services/drug-generics.service';
import {
  DrugGeneric,
  UpdateDrugGenericRequest,
} from '../types/drug-generics.types';
import {
  DrugGenericFormComponent,
  DrugGenericFormData,
} from './drug-generics-form.component';

export interface DrugGenericEditDialogData {
  drugGenerics: DrugGeneric;
}

@Component({
  selector: 'app-drug-generics-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    DrugGenericFormComponent,
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
        <div class="ax-title">Edit DrugGeneric</div>
        <div class="ax-subtitle">Update druggeneric information</div>
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
    <app-drug-generics-form
      mode="edit"
      [initialData]="data.drugGenerics"
      [loading]="loading()"
      (formSubmit)="onFormSubmit($event)"
      (formCancel)="onCancel()"
    ></app-drug-generics-form>
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
export class DrugGenericEditDialogComponent implements OnInit {
  private drugGenericsService = inject(DrugGenericService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<DrugGenericEditDialogComponent>);
  public data = inject<DrugGenericEditDialogData>(MAT_DIALOG_DATA);

  loading = signal<boolean>(false);

  ngOnInit() {
    // No additional setup needed since shared form handles data population
  }

  async onFormSubmit(formData: DrugGenericFormData) {
    this.loading.set(true);

    try {
      // Cast through unknown to handle form data type conversion (form values may be strings)
      const updateRequest = formData as unknown as UpdateDrugGenericRequest;
      const result = await this.drugGenericsService.updateDrugGeneric(
        this.data.drugGenerics.id,
        updateRequest,
      );

      if (result) {
        this.snackBar.open('DrugGeneric updated successfully', 'Close', {
          duration: 3000,
        });
        this.dialogRef.close(result);
      } else {
        this.snackBar.open('Failed to update druggeneric', 'Close', {
          duration: 5000,
        });
      }
    } catch (error: any) {
      const errorMessage = this.drugGenericsService.permissionError()
        ? 'You do not have permission to update druggeneric'
        : error?.message || 'Failed to update druggeneric';
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
