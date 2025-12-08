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

import { DrugFocusListService } from '../services/drug-focus-lists.service';
import {
  DrugFocusList,
  UpdateDrugFocusListRequest,
} from '../types/drug-focus-lists.types';
import {
  DrugFocusListFormComponent,
  DrugFocusListFormData,
} from './drug-focus-lists-form.component';

export interface DrugFocusListEditDialogData {
  drugFocusLists: DrugFocusList;
}

@Component({
  selector: 'app-drug-focus-lists-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    DrugFocusListFormComponent,
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
        <div class="ax-title">Edit DrugFocusList</div>
        <div class="ax-subtitle">Update drugfocuslist information</div>
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
    <app-drug-focus-lists-form
      mode="edit"
      [initialData]="data.drugFocusLists"
      [loading]="loading()"
      (formSubmit)="onFormSubmit($event)"
      (formCancel)="onCancel()"
    ></app-drug-focus-lists-form>
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
export class DrugFocusListEditDialogComponent implements OnInit {
  private drugFocusListsService = inject(DrugFocusListService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<DrugFocusListEditDialogComponent>);
  public data = inject<DrugFocusListEditDialogData>(MAT_DIALOG_DATA);

  loading = signal<boolean>(false);

  ngOnInit() {
    // No additional setup needed since shared form handles data population
  }

  async onFormSubmit(formData: DrugFocusListFormData) {
    this.loading.set(true);

    try {
      // Cast through unknown to handle form data type conversion (form values may be strings)
      const updateRequest = formData as unknown as UpdateDrugFocusListRequest;
      const result = await this.drugFocusListsService.updateDrugFocusList(
        this.data.drugFocusLists.id,
        updateRequest,
      );

      if (result) {
        this.snackBar.open('DrugFocusList updated successfully', 'Close', {
          duration: 3000,
        });
        this.dialogRef.close(result);
      } else {
        this.snackBar.open('Failed to update drugfocuslist', 'Close', {
          duration: 5000,
        });
      }
    } catch (error: any) {
      const errorMessage = this.drugFocusListsService.permissionError()
        ? 'You do not have permission to update drugfocuslist'
        : error?.message || 'Failed to update drugfocuslist';
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
