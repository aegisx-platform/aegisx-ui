import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ReturnActionService } from '../services/return-actions.service';
import { CreateReturnActionRequest } from '../types/return-actions.types';
import {
  ReturnActionFormComponent,
  ReturnActionFormData,
} from './return-actions-form.component';

@Component({
  selector: 'app-return-actions-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReturnActionFormComponent,
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
        <div class="ax-title">Create New ReturnAction</div>
        <div class="ax-subtitle">Add a new returnaction to your collection</div>
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
    <app-return-actions-form
      mode="create"
      [loading]="loading()"
      (formSubmit)="onFormSubmit($event)"
      (formCancel)="onCancel()"
    ></app-return-actions-form>
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
export class ReturnActionCreateDialogComponent {
  private returnActionsService = inject(ReturnActionService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<ReturnActionCreateDialogComponent>);

  loading = signal<boolean>(false);

  async onFormSubmit(formData: ReturnActionFormData) {
    this.loading.set(true);

    try {
      // Cast through unknown to handle form data type conversion (form values may be strings)
      const createRequest = formData as unknown as CreateReturnActionRequest;
      const result =
        await this.returnActionsService.createReturnAction(createRequest);

      if (result) {
        this.snackBar.open('ReturnAction created successfully', 'Close', {
          duration: 3000,
        });
        this.dialogRef.close(result);
      } else {
        this.snackBar.open('Failed to create returnaction', 'Close', {
          duration: 5000,
        });
      }
    } catch (error: any) {
      const errorMessage = this.returnActionsService.permissionError()
        ? 'You do not have permission to create returnaction'
        : error?.message || 'Failed to create returnaction';
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
