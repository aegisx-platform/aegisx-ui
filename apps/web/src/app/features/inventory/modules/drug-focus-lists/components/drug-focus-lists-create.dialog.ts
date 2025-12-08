import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DrugFocusListService } from '../services/drug-focus-lists.service';
import { CreateDrugFocusListRequest } from '../types/drug-focus-lists.types';
import {
  DrugFocusListFormComponent,
  DrugFocusListFormData,
} from './drug-focus-lists-form.component';

@Component({
  selector: 'app-drug-focus-lists-create-dialog',
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
    <h2 mat-dialog-title class="ax-header ax-header-info">
      <div class="ax-icon-info">
        <mat-icon>add_circle</mat-icon>
      </div>
      <div class="header-text">
        <div class="ax-title">Create New DrugFocusList</div>
        <div class="ax-subtitle">
          Add a new drugfocuslist to your collection
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
    <app-drug-focus-lists-form
      mode="create"
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
export class DrugFocusListCreateDialogComponent {
  private drugFocusListsService = inject(DrugFocusListService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<DrugFocusListCreateDialogComponent>);

  loading = signal<boolean>(false);

  async onFormSubmit(formData: DrugFocusListFormData) {
    this.loading.set(true);

    try {
      // Cast through unknown to handle form data type conversion (form values may be strings)
      const createRequest = formData as unknown as CreateDrugFocusListRequest;
      const result =
        await this.drugFocusListsService.createDrugFocusList(createRequest);

      if (result) {
        this.snackBar.open('DrugFocusList created successfully', 'Close', {
          duration: 3000,
        });
        this.dialogRef.close(result);
      } else {
        this.snackBar.open('Failed to create drugfocuslist', 'Close', {
          duration: 5000,
        });
      }
    } catch (error: any) {
      const errorMessage = this.drugFocusListsService.permissionError()
        ? 'You do not have permission to create drugfocuslist'
        : error?.message || 'Failed to create drugfocuslist';
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
