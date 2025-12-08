import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DrugComponentService } from '../services/drug-components.service';
import { CreateDrugComponentRequest } from '../types/drug-components.types';
import {
  DrugComponentFormComponent,
  DrugComponentFormData,
} from './drug-components-form.component';

@Component({
  selector: 'app-drug-components-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    DrugComponentFormComponent,
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
        <div class="ax-title">Create New DrugComponent</div>
        <div class="ax-subtitle">
          Add a new drugcomponent to your collection
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
    <app-drug-components-form
      mode="create"
      [loading]="loading()"
      (formSubmit)="onFormSubmit($event)"
      (formCancel)="onCancel()"
    ></app-drug-components-form>
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
export class DrugComponentCreateDialogComponent {
  private drugComponentsService = inject(DrugComponentService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<DrugComponentCreateDialogComponent>);

  loading = signal<boolean>(false);

  async onFormSubmit(formData: DrugComponentFormData) {
    this.loading.set(true);

    try {
      // Cast through unknown to handle form data type conversion (form values may be strings)
      const createRequest = formData as unknown as CreateDrugComponentRequest;
      const result =
        await this.drugComponentsService.createDrugComponent(createRequest);

      if (result) {
        this.snackBar.open('DrugComponent created successfully', 'Close', {
          duration: 3000,
        });
        this.dialogRef.close(result);
      } else {
        this.snackBar.open('Failed to create drugcomponent', 'Close', {
          duration: 5000,
        });
      }
    } catch (error: any) {
      const errorMessage = this.drugComponentsService.permissionError()
        ? 'You do not have permission to create drugcomponent'
        : error?.message || 'Failed to create drugcomponent';
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
