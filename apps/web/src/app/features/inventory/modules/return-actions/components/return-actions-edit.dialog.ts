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

import { ReturnActionService } from '../services/return-actions.service';
import {
  ReturnAction,
  UpdateReturnActionRequest,
} from '../types/return-actions.types';
import {
  ReturnActionFormComponent,
  ReturnActionFormData,
} from './return-actions-form.component';

export interface ReturnActionEditDialogData {
  returnActions: ReturnAction;
}

@Component({
  selector: 'app-return-actions-edit-dialog',
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
    <h2 mat-dialog-title class="ax-header ax-header-warning">
      <div class="ax-icon-warning">
        <mat-icon>edit</mat-icon>
      </div>
      <div class="header-text">
        <div class="ax-title">Edit ReturnAction</div>
        <div class="ax-subtitle">Update returnaction information</div>
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
      mode="edit"
      [initialData]="data.returnActions"
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
export class ReturnActionEditDialogComponent implements OnInit {
  private returnActionsService = inject(ReturnActionService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<ReturnActionEditDialogComponent>);
  public data = inject<ReturnActionEditDialogData>(MAT_DIALOG_DATA);

  loading = signal<boolean>(false);

  ngOnInit() {
    // No additional setup needed since shared form handles data population
  }

  async onFormSubmit(formData: ReturnActionFormData) {
    this.loading.set(true);

    try {
      // Cast through unknown to handle form data type conversion (form values may be strings)
      const updateRequest = formData as unknown as UpdateReturnActionRequest;
      const result = await this.returnActionsService.updateReturnAction(
        this.data.returnActions.id,
        updateRequest,
      );

      if (result) {
        this.snackBar.open('ReturnAction updated successfully', 'Close', {
          duration: 3000,
        });
        this.dialogRef.close(result);
      } else {
        this.snackBar.open('Failed to update returnaction', 'Close', {
          duration: 5000,
        });
      }
    } catch (error: any) {
      const errorMessage = this.returnActionsService.permissionError()
        ? 'You do not have permission to update returnaction'
        : error?.message || 'Failed to update returnaction';
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
